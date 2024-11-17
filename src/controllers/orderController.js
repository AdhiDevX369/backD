const Order = require('../models/Order');
const { calculateTotalPrice } = require('../utils/calculatePrice');

exports.createOrder = async (req, res) => {
  try {
    const orderData = req.body;
    orderData.user = req.user._id;
    orderData.totalAmount = await calculateTotalPrice(orderData.items);
    
    const order = await Order.create(orderData);
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.furniture')
      .populate('items.woodType');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};