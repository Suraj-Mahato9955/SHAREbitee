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
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Food', foodSchema);
