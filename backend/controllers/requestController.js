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

module.exports = { createRequest, getMyRequests, updateRequestStatus };
