const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

router.get('/', protect, restrictTo('admin'), orderController.getAllOrders);
router.get('/my-orders', protect, orderController.getUserOrders);
router.get('/:id', protect, orderController.getOrder);
router.post('/', protect, orderController.createOrder);
router.put('/:id/status', protect, restrictTo('admin'), orderController.updateOrderStatus);
router.delete('/:id', protect, restrictTo('admin'), orderController.deleteOrder);
router.get('/status/accepted', protect, restrictTo('admin'), orderController.getAcceptedOrders);
router.get('/status/rejected', protect, restrictTo('admin'), orderController.getRejectedOrders);
router.put('/:id', protect, orderController.updateOrder);

module.exports = router;