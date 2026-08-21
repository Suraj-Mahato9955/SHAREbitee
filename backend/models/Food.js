const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({

  foodName: {
    type: String,
    required: true,
  },

  quantity: {
    type: String,
    required: true,
  },

  foodType: {
    type: String,
    enum: ['veg', 'non-veg'],
  },

  foodCategory: {
    type: String,
  },

  location: {
    type: String,
    required: true,
  },

  expiryTime: {
    type: Date,
    required: true,
  },

  description: {
    type: String,
  },

  image: {
    type: String,
  },

  servesPeople: {
    type: Number,
  },

  status: {
    type: String,
    enum: [
      'available',
      'requested',
      'accepted',
      'pickedup',
      'delivered',
      'completed',
      'expired'
    ],
    default: 'available'
  },

  priority: {
    type: String,
    enum: [
      'low',
      'medium',
      'high'
    ],
    default: 'low'
  },

  isExpired: {
    type: Boolean,
    default: false
  },

  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }

}, { timestamps: true });


module.exports = mongoose.model('Food', foodSchema);