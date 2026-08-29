const express = require('express');

const router = express.Router();

const {
  getMyNotifications,
  markAsRead,
  markAllAsRead
} = require('../controllers/notificationController');

const { protect } = require('../middlewares/authMiddleware');


// Get logged-in user's notifications
router.get('/', protect, getMyNotifications);

// Mark one notification as read
router.put('/:id/read', protect, markAsRead);

// Mark all notifications as read
router.put('/read-all', protect, markAllAsRead);


module.exports = router;
