const express = require('express');
const router = express.Router();
const { getUsers, deleteUser } = require('../controllers/adminController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.route('/users').get(protect, admin, getUsers);
router.route('/user/:id').delete(protect, admin, deleteUser);

module.exports = router;
