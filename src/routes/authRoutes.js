const express = require('express');
const router = express.Router();
const furnitureController = require('../controllers/furnitureController');
const authController = require('../controllers/authController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

router.get('/', furnitureController.getAllFurniture);
router.post('/', protect, restrictTo('admin'), furnitureController.createFurniture);
router.put('/:id', protect, restrictTo('admin'), furnitureController.updateFurniture);

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/users', protect, restrictTo('admin'), authController.getUsers);

module.exports = router;