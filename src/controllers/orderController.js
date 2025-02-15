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

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({ is_active: true })
      .populate('items.furniture')
      .populate('items.woodType')
      .populate('user', '-password');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, is_active: true })
      .populate('items.furniture')
      .populate('items.woodType')
      .populate('user', '-password');
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id, is_active: true })
      .populate('items.furniture')
      .populate('items.woodType');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can update order status' });
    }

    const { status, description, deliveryDate } = req.body;
    if (!['pending', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    if (status === 'accepted' && !deliveryDate) {
      return res.status(400).json({ error: 'Delivery date is required when accepting an order' });
    }

    if ((status === 'accepted' || status === 'rejected') && !description) {
      return res.status(400).json({ error: 'Description is required when accepting or rejecting an order' });
    }

    const order = await Order.findOne({ _id: req.params.id, is_active: true });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.status = status;
    order.description = description;
    if (status === 'accepted') {
      order.deliveryDate = deliveryDate;
    }

    await order.save();
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can delete orders' });
    }

    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, is_active: true },
      { is_active: false },
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAcceptedOrders = async (req, res) => {
  try {
    const orders = await Order.find({ status: 'accepted', is_active: true })
      .populate('items.furniture')
      .populate('items.woodType')
      .populate('user', '-password');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRejectedOrders = async (req, res) => {
  try {
    const orders = await Order.find({ status: 'rejected', is_active: true })
      .populate('items.furniture')
      .populate('items.woodType')
      .populate('user', '-password');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const { items, description } = req.body;
    const order = await Order.findOne({ 
      _id: req.params.id, 
      user: req.user._id, 
      is_active: true,
      status: 'pending' // Only allow updates for pending orders
    });

    if (!order) {
      return res.status(404).json({ 
        error: 'Order not found or cannot be modified (only pending orders can be updated)'
      });
    }

    if (items) {
      order.items = items;
      order.totalAmount = await calculateTotalPrice(items);
    }
    
    if (description) {
      order.description = description;
    }

    await order.save();
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};