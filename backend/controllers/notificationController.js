const Notification = require('../models/Notification');

// Get notifications for logged-in user
const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.user._id
    })
      .sort({ createdAt: -1 })
      .populate('requestId');

    res.status(200).json(notifications);
  } catch (error) {
    console.error('NOTIFICATION ERROR:', error);

    res.status(500).json({
      message: 'Failed to load notifications',
      error: error.message
    });
  }
};


// Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!notification) {
      return res.status(404).json({
        message: 'Notification not found'
      });
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json(notification);
  } catch (error) {
    console.error('MARK READ ERROR:', error);

    res.status(500).json({
      message: 'Failed to mark notification as read',
      error: error.message
    });
  }
};


// Mark all notifications as read
const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      {
        userId: req.user._id,
        isRead: false
      },
      {
        $set: { isRead: true }
      }
    );

    res.status(200).json({
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('MARK ALL READ ERROR:', error);

    res.status(500).json({
      message: 'Failed to mark notifications as read',
      error: error.message
    });
  }
};


module.exports = {
  getMyNotifications,
  markAsRead,
  markAllAsRead
};
