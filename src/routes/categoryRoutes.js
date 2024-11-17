const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

router.get('/', categoryController.getAllCategories);
router.post('/', protect, restrictTo('admin'), categoryController.createCategory);

module.exports = router;