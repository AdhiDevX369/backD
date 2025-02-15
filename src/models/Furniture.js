const mongoose = require('mongoose');

const furnitureSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  basePrice: { type: Number, required: true },
  description: String,
  woodTypes: [{
    woodType: { type: mongoose.Schema.Types.ObjectId, ref: 'Wood' },
    priceMultiplier: Number
  }],
  is_active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Furniture', furnitureSchema);