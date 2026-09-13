const Request = require('../models/Request');
const Notification = require('../models/Notification');

const createRequest = async (req, res) => {
  try {
    const { foodId } = req.body;

    if (!foodId) {
      return res.status(400).json({
        message: 'Food ID is required'
      });
    }

    const Food = require('../models/Food');

    const food = await Food.findById(foodId);

    if (!food) {
      return res.status(404).json({
        message: 'Food not found'
      });
    }

    if (food.status !== 'available') {
      return res.status(400).json({
        message: 'This food is no longer available'
      });
    }

    const existingRequest = await Request.findOne({
      foodId,
      receiverId: req.user._id
    });

    if (existingRequest) {
      return res.status(400).json({
        message: 'You have already requested this food'
      });
    }

    const request = await Request.create({
      foodId,
      receiverId: req.user._id,
    });

    // Notify donor
    await Notification.create({
      userId: food.donorId,
      message: `${req.user.name} has requested your food "${food.foodName}"`,
      type: 'request',
      requestId: request._id
    });

    res.status(201).json(request);

  } catch (error) {

    if (error.code === 11000) {
      return res.status(400).json({
        message: 'You have already requested this food'
      });
    }

    console.error('CREATE REQUEST ERROR:', error);

    res.status(500).json({
      message: 'Server Error',
      error: error.message
    });
  }
};


const getMyRequests = async (req, res) => {
  try {
    const requests = await Request.find({
      receiverId: req.user._id
    }).populate('foodId');

    res.json(requests);

  } catch (error) {

    res.status(500).json({
      message: 'Server Error',
      error: error.message
    });
  }
};


const updateRequestStatus = async (req, res) => {
  try {
    const { requestId, status } = req.body;

    if (!requestId || !status) {
      return res.status(400).json({
        message: 'Request ID and status are required'
      });
    }

    const request = await Request.findById(requestId)
      .populate('foodId');

    if (!request) {
      return res.status(404).json({
        message: 'Request not found'
      });
    }

    if (!request.foodId) {
      return res.status(404).json({
        message: 'Food associated with this request not found'
      });
    }

    const donorId = request.foodId.donorId?.toString();
    const currentUserId = req.user._id.toString();

    if (
      donorId !== currentUserId &&
      req.user.role !== 'admin'
    ) {
      return res.status(401).json({
        message: 'Not authorized to update this request'
      });
    }

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        message: 'Invalid status'
      });
    }

    request.status = status;

    await request.save();

    // Notify NGO
    const notificationMessage =
      status === 'approved'
        ? `Your food request for "${request.foodId.foodName}" has been approved`
        : `Your food request for "${request.foodId.foodName}" has been rejected`;

    await Notification.create({
      userId: request.receiverId,
      message: notificationMessage,
      type: status,
      requestId: request._id
    });

    const updatedRequest = await Request.findById(requestId)
      .populate('foodId')
      .populate('receiverId', 'name email');

    res.json(updatedRequest);

  } catch (error) {

    console.error('UPDATE REQUEST STATUS ERROR:', error);

    res.status(500).json({
      message: 'Server Error',
      error: error.message
    });
  }
};


const getVolunteerRequests = async (req, res) => {
  try {

    const requests = await Request.find({
      $or: [
        { status: 'approved' },
        { status: 'picked_up' },
        { status: 'delivered' }
      ]
    })
      .populate({
        path: 'foodId',
        populate: {
          path: 'donorId',
          select: 'name email'
        }
      })
      .populate('receiverId', 'name email')
      .populate('volunteerId', 'name email');

    res.json(requests);

  } catch (error) {

    console.error('VOLUNTEER REQUEST ERROR:', error);

    res.status(500).json({
      message: 'Server Error',
      error: error.message
    });
  }
};


const assignVolunteer = async (req, res) => {
  try {

    const { requestId } = req.body;

    const request = await Request.findById(requestId)
      .populate('foodId')
      .populate('receiverId', 'name');

    if (!request) {
      return res.status(404).json({
        message: 'Request not found'
      });
    }

    if (request.status !== 'approved') {
      return res.status(400).json({
        message: 'Only approved requests can be accepted'
      });
    }

    if (req.user.role !== 'volunteer') {
      return res.status(401).json({
        message: 'Only volunteers can accept pickup'
      });
    }

    request.volunteerId = req.user._id;
    request.status = 'approved';

    await request.save();

    // Notify NGO
    await Notification.create({
      userId: request.receiverId._id,
      message: `Volunteer ${req.user.name} has accepted the pickup for "${request.foodId.foodName}"`,
      type: 'pickup',
      requestId: request._id
    });

    res.status(200).json(request);

  } catch (error) {

    console.error('ASSIGN VOLUNTEER ERROR:', error);

    res.status(500).json({
      message: 'Server Error',
      error: error.message
    });
  }
};


const markPickedUp = async (req, res) => {
  try {

    const { requestId } = req.body;

    const request = await Request.findById(requestId)
      .populate('foodId');

    if (!request) {
      return res.status(404).json({
        message: 'Request not found'
      });
    }

    if (
      !request.volunteerId ||
      request.volunteerId.toString() !== req.user._id.toString()
    ) {
      return res.status(401).json({
        message: 'Not authorized'
      });
    }

    request.status = 'picked_up';

    await request.save();

    // Notify NGO
    await Notification.create({
      userId: request.receiverId,
      message: `Food "${request.foodId.foodName}" has been picked up by volunteer ${req.user.name}`,
      type: 'pickup',
      requestId: request._id
    });

    res.status(200).json(request);

  } catch (error) {

    console.error('PICKUP ERROR:', error);

    res.status(500).json({
      message: 'Server Error',
      error: error.message
    });
  }
};


const markDelivered = async (req, res) => {
  try {

    const { requestId } = req.body;

    const request = await Request.findById(requestId)
      .populate('foodId');

    if (!request) {
      return res.status(404).json({
        message: 'Request not found'
      });
    }

    if (
      !request.volunteerId ||
      request.volunteerId.toString() !== req.user._id.toString()
    ) {
      return res.status(401).json({
        message: 'Not authorized'
      });
    }

    request.status = 'delivered';

    await request.save();

    // Notify NGO
    await Notification.create({
      userId: request.receiverId,
      message: `Food "${request.foodId.foodName}" has been delivered successfully`,
      type: 'delivered',
      requestId: request._id
    });

    // Notify Donor
    await Notification.create({
      userId: request.foodId.donorId,
      message: `Your food "${request.foodId.foodName}" has been delivered successfully`,
      type: 'delivered',
      requestId: request._id
    });

    res.status(200).json(request);

  } catch (error) {

    console.error('DELIVERY ERROR:', error);

    res.status(500).json({
      message: 'Server Error',
      error: error.message
    });
  }
};


const getDonorRequests = async (req, res) => {
  try {

    const requests = await Request.find()
      .populate({
        path: 'foodId',
        populate: {
          path: 'donorId',
          select: 'name email'
        }
      })
      .populate('receiverId', 'name email');

    const donorRequests = requests.filter((request) => {

      if (!request.foodId || !request.foodId.donorId) {
        return false;
      }

      return (
        request.foodId.donorId._id.toString() ===
        req.user._id.toString()
      );
    });

    res.status(200).json(donorRequests);

  } catch (error) {

    console.error('GET DONOR REQUESTS ERROR:', error);

    res.status(500).json({
      message: 'Server Error',
      error: error.message
    });
  }
};


module.exports = {
  createRequest,
  getMyRequests,
  updateRequestStatus,
  getVolunteerRequests,
  getDonorRequests,
  assignVolunteer,
  markPickedUp,
  markDelivered
};