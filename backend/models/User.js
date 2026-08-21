const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

  // Common Information
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },


  // User Role
  role: {
    type: String,
    enum: ['donor', 'ngo', 'volunteer', 'admin'],
    default: 'donor',
  },


  // Common Profile Details
  phoneNumber: {
    type: String,
  },

  city: {
    type: String,
  },

  address: {
    type: String,
  },

  profileImage: {
    type: String,
  },


  // Donor / NGO Information
  organizationName: {
    type: String,
  },

  registrationNumber: {
    type: String,
  },


  // Volunteer Information
  vehicleType: {
    type: String,
  },

  availability: {
    type: Boolean,
    default: false,
  },


  // NGO Verification
  verificationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  }

}, { timestamps: true });


module.exports = mongoose.model('User', userSchema);