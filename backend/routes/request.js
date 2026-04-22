const express = require('express');
const router = express.Router();
const { createRequest, getMyRequests, updateRequestStatus } = require('../controllers/requestController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/create').post(protect, createRequest);
router.route('/my').get(protect, getMyRequests);
router.route('/update-status').put(protect, updateRequestStatus);

module.exports = router;
