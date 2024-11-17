const Wood = require('../models/Wood');

exports.getAllWoods = async (req, res) => {
  try {
    const woods = await Wood.find();
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