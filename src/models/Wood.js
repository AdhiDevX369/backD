const mongoose = require('mongoose');

const woodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  priceMultiplier: { type: Number, required: true },
  availability: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Wood', woodSchema);