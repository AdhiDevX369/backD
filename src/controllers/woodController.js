const Wood = require('../models/Wood');

exports.getAllWoods = async (req, res) => {
  try {
    const woods = await Wood.find({ is_active: true });
    res.json(woods);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createWood = async (req, res) => {
  try {
    const wood = await Wood.create(req.body);
    res.status(201).json(wood);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateWood = async (req, res) => {
  try {
    const wood = await Wood.findOne({ _id: req.params.id, is_active: true });
    
    if (!wood) {
      return res.status(404).json({ error: 'Wood type not found' });
    }

    Object.assign(wood, req.body);
    await wood.save();
    res.json(wood);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteWood = async (req, res) => {
  try {
    const wood = await Wood.findOneAndUpdate(
      { _id: req.params.id, is_active: true },
      { is_active: false },
      { new: true }
    );
    
    if (!wood) {
      return res.status(404).json({ error: 'Wood type not found' });
    }

    res.json({ message: 'Wood type deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};