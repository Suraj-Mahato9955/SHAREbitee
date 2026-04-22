const express = require('express');
const router = express.Router();
const { addFood, getAllFood, getFoodById, deleteFood } = require('../controllers/foodController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/').get(getAllFood);
router.route('/add').post(protect, addFood);
router.route('/:id').get(getFoodById).delete(protect, deleteFood);

module.exports = router;
