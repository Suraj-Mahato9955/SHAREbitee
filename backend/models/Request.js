const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  foodId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Food',
    required: true,
  },

  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  volunteerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },

  status: {
    type: String,
    enum: [
      'pending',
      'approved',
      'rejected',
      'picked_up',
      'delivered'
    ],
    default: 'pending',
  }
}, { timestamps: true });

module.exports = mongoose.model('Request', requestSchema);