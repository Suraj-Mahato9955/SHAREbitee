const express = require('express');
const router = express.Router();

const {
  createRequest,
  getMyRequests,
  updateRequestStatus,
  getDonorRequests,
  getVolunteerRequests
} = require('../controllers/requestController');

const { protect } = require('../middlewares/authMiddleware');

router.route('/create').post(protect, createRequest);

router.route('/my').get(protect, getMyRequests);

router.route('/donor').get(protect, getDonorRequests);

router.route('/update-status').put(protect, updateRequestStatus);

router.route('/volunteer').get(protect, getVolunteerRequests);

module.exports = router;