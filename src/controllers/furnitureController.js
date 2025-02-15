const Furniture = require('../models/Furniture');

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