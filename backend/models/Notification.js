const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: [
        'request',
        'approved',
        'rejected',
        'pickup',
        'delivered',
        'general'
      ],
      default: 'general',
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Request',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model('Notification', notificationSchema);