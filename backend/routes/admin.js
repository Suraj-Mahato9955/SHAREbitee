const express = require('express');
const router = express.Router();

const {
  getUsers,
  deleteUser,
  getAdminStats,
} = require('../controllers/adminController');

const {
  protect,
  admin,
} = require('../middlewares/authMiddleware');

// Get all users
router.get(
  '/users',
  protect,
  admin,
  getUsers
);

// Get dashboard statistics
router.get(
  '/stats',
  protect,
  admin,
  getAdminStats
);

// Delete user
router.delete(
  '/user/:id',
  protect,
  admin,
  deleteUser
);

module.exports = router;