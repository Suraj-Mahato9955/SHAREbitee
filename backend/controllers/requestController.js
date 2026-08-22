const Request = require('../models/Request');

const createRequest = async (req, res) => {
  try {
    const { foodId } = req.body;
    const existingRequest = await Request.findOne({ foodId, receiverId: req.user._id });

    if (existingRequest) {
      return res.status(400).json({ message: 'You have already requested this food' });
    }

    const request = await Request.create({
      foodId,
      receiverId: req.user._id,
    });
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const getMyRequests = async (req, res) => {
  try {
    const requests = await Request.find({ receiverId: req.user._id }).populate('foodId');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const updateRequestStatus = async (req, res) => {
  try {
    const { requestId, status } = req.body;
    const request = await Request.findById(requestId).populate('foodId');

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.foodId.donorId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    request.status = status;
    await request.save();
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
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

    const request = await Request.findById(requestId);

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

    const request = await Request.findById(requestId);

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

    const request = await Request.findById(requestId);

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