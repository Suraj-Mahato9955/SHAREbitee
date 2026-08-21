const Food = require('../models/Food');


const addFood = async (req, res) => {
  try {
    const {
    foodName,
    quantity,
    foodType,
    foodCategory,
    location,
    expiryTime,
    description,
    image,
    servesPeople
    } = req.body;
    // Basic validation
    if (!foodName || !quantity || !location) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    const food = await Food.create({
  foodName,
  quantity,
  foodType,
  foodCategory,
  location,
  expiryTime,
  description,
  image,
  servesPeople,
  donorId: req.user._id,
});

    res.status(201).json(food);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
const getAllFood = async (req, res) => {
  try {
    const foods = await Food.find({})
      .populate('donorId', 'name email')
      .limit(50)
      .sort({ createdAt: -1 });

    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id)
      .populate('donorId', 'name email');

    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }

    res.json(food);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const deleteFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }

    if (
      food.donorId.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(401).json({ message: 'Not authorized to delete this food' });
    }

    await food.deleteOne();
    res.json({ message: 'Food removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const getNearbyFood = async (req, res) => {
  try {
    const { location } = req.query;

    if (!location) {
      return res.status(400).json({ message: 'Location query is required' });
    }

    const foods = await Food.find({
      location: { $regex: location, $options: 'i' }
    }).populate('donorId', 'name email');

    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  addFood,
  getAllFood,
  getFoodById,
  deleteFood,
  getNearbyFood,
};
