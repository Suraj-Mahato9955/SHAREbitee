const User = require('../models/User');
const Food = require('../models/Food');
const Request = require('../models/Request');

// ===============================
// GET ALL USERS
// ===============================
const getUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    console.error('GET USERS ERROR:', error);

    res.status(500).json({
      message: 'Server Error',
      error: error.message,
    });
  }
};

// ===============================
// DELETE USER
// ===============================
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    // Delete food donated by this user
    await Food.deleteMany({
      donorId: user._id,
    });

    // Delete requests received by this user
    await Request.deleteMany({
      receiverId: user._id,
    });

    // Delete requests where this user was volunteer
    await Request.deleteMany({
      volunteerId: user._id,
    });

    await user.deleteOne();

    res.json({
      message: 'User removed successfully',
    });
  } catch (error) {
    console.error('DELETE USER ERROR:', error);

    res.status(500).json({
      message: 'Server Error',
      error: error.message,
    });
  }
};

// ===============================
// GET ADMIN STATISTICS
// ===============================
const getAdminStats = async (req, res) => {
  try {
    // USER COUNTS
    const totalUsers = await User.countDocuments();

    const totalDonors = await User.countDocuments({
      role: 'donor',
    });

    const totalNGOs = await User.countDocuments({
      role: 'ngo',
    });

    const totalVolunteers = await User.countDocuments({
      role: 'volunteer',
    });

    const totalAdmins = await User.countDocuments({
      role: 'admin',
    });

    // FOOD COUNTS
    const totalFood = await Food.countDocuments();

    const availableFood = await Food.countDocuments({
      status: 'available',
    });

    const deliveredFood = await Food.countDocuments({
      status: 'delivered',
    });

    // REQUEST COUNTS
    const totalRequests = await Request.countDocuments();

    const pendingRequests = await Request.countDocuments({
      status: 'pending',
    });

    const approvedRequests = await Request.countDocuments({
      status: 'approved',
    });

    const pickedUpRequests = await Request.countDocuments({
      status: 'picked_up',
    });

    const deliveredRequests = await Request.countDocuments({
      status: 'delivered',
    });

    const rejectedRequests = await Request.countDocuments({
      status: 'rejected',
    });

    res.status(200).json({
      users: {
        total: totalUsers,
        donors: totalDonors,
        ngos: totalNGOs,
        volunteers: totalVolunteers,
        admins: totalAdmins,
      },

      food: {
        total: totalFood,
        available: availableFood,
        delivered: deliveredFood,
      },

      requests: {
        total: totalRequests,
        pending: pendingRequests,
        approved: approvedRequests,
        pickedUp: pickedUpRequests,
        delivered: deliveredRequests,
        rejected: rejectedRequests,
      },
    });
  } catch (error) {
    console.error('ADMIN STATS ERROR:', error);

    res.status(500).json({
      message: 'Failed to fetch admin statistics',
      error: error.message,
    });
  }
};

module.exports = {
  getUsers,
  deleteUser,
  getAdminStats,
};
