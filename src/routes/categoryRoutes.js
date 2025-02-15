const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategory);
router.post('/', protect, restrictTo('admin'), categoryController.createCategory);
router.put('/:id', protect, restrictTo('admin'), categoryController.updateCategory);
router.delete('/:id', protect, restrictTo('admin'), categoryController.deleteCategory);

module.exports = router;