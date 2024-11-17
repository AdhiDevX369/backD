const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    furniture: { type: mongoose.Schema.Types.ObjectId, ref: 'Furniture' },
    woodType: { type: mongoose.Schema.Types.ObjectId, ref: 'Wood' },
    quantity: Number,
    price: Number
  }],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'delivered'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);