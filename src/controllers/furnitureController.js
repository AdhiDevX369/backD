const Furniture = require('../models/Furniture');
const User = require('../models/User');

exports.getAllFurniture = async (req, res) => {
  try {
    const furniture = await Furniture.find({ is_active: true })
      .populate('category', '-__v')
      .populate('woodTypes.woodType', '-__v');
    res.json(furniture);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createFurniture = async (req, res) => {
  try {
    const furniture = await Furniture.create(req.body);
    res.status(201).json(furniture);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateFurniture = async (req, res) => {
  try {
    const furniture = await Furniture.findOne({ _id: req.params.id, is_active: true });
    
    if (!furniture) {
      return res.status(404).json({ error: 'Furniture not found' });
    }

    Object.assign(furniture, req.body);
    await furniture.save();
    res.json(furniture);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteFurniture = async (req, res) => {
  try {
    const furniture = await Furniture.findOneAndUpdate(
      { _id: req.params.id, is_active: true },
      { is_active: false },
      { new: true }
    );

    if (!furniture) {
      return res.status(404).json({ error: 'Furniture not found' });
    }

    res.json({ message: 'Furniture deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.addToFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const furnitureId = req.params.id;

    if (user.favorites.includes(furnitureId)) {
      return res.status(400).json({ error: 'Furniture already in favorites' });
    }

    user.favorites.push(furnitureId);
    await user.save();

    res.json({ message: 'Added to favorites successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.removeFromFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const furnitureId = req.params.id;

    if (!user.favorites.includes(furnitureId)) {
      return res.status(400).json({ error: 'Furniture not in favorites' });
    }

    user.favorites = user.favorites.filter(id => id.toString() !== furnitureId);
    await user.save();

    res.json({ message: 'Removed from favorites successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('favorites');
    res.json(user.favorites);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.viewFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const furnitureId = req.params.id;

    if (!user.favorites.includes(furnitureId)) {
      return res.status(404).json({ error: 'Furniture not found in favorites' });
    }

    const furniture = await Furniture.findOne({ _id: furnitureId, is_active: true })
      .populate('category', '-__v')
      .populate('woodTypes.woodType', '-__v');

    if (!furniture) {
      return res.status(404).json({ error: 'Furniture not found' });
    }

    res.json(furniture);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = exports;