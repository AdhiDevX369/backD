const express = require('express');
const router = express.Router();
const furnitureController = require('../controllers/furnitureController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

router.get('/', furnitureController.getAllFurniture);
router.post('/', protect, restrictTo('admin'), furnitureController.createFurniture);
router.put('/:id', protect, restrictTo('admin'), furnitureController.updateFurniture);

module.exports = router;