const express = require('express');
const router = express.Router();
const woodController = require('../controllers/woodController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

router.get('/', woodController.getAllWoods);
router.post('/', protect, restrictTo('admin'), woodController.createWood);
router.put('/:id', protect, restrictTo('admin'), woodController.updateWood);
router.delete('/:id', protect, restrictTo('admin'), woodController.deleteWood);

module.exports = router;