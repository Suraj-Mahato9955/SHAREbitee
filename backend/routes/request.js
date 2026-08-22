const express = require('express');
const router = express.Router();

const {
  createRequest,
  getMyRequests,
  updateRequestStatus,
  getVolunteerRequests,
  getDonorRequests,
  assignVolunteer,
  markPickedUp,
  markDelivered
} = require('../controllers/requestController');

const { protect } = require('../middlewares/authMiddleware');

router.route('/create').post(protect, createRequest);

router.route('/my').get(protect, getMyRequests);

router.route('/donor').get(protect, getDonorRequests);

router.route('/update-status').put(protect, updateRequestStatus);

router.route('/volunteer').get(protect, getVolunteerRequests);

router.route('/assign').put(protect, assignVolunteer);

router.route('/pickup').put(protect, markPickedUp);

router.route('/deliver').put(protect, markDelivered);

module.exports = router;