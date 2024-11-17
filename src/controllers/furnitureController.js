const Furniture = require('../models/Furniture');

exports.getAllFurniture = async (req, res) => {
  try {
    const furniture = await Furniture.find()
      .populate('category')
      .populate('woodTypes.woodType');
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
    const furniture = await Furniture.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(furniture);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};