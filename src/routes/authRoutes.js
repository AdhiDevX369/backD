const express = require('express');
const router = express.Router();
const furnitureController = require('../controllers/furnitureController');
const authController = require('../controllers/authController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

router.get('/', furnitureController.getAllFurniture);
router.post('/', protect, restrictTo('admin'), furnitureController.createFurniture);
router.put('/:id', protect, restrictTo('admin'), furnitureController.updateFurniture);

// Auth endpoints
router.post('/register', authController.register);
router.post('/login', authController.login);

// User management endpoints
router.get('/users', protect, restrictTo('admin'), authController.getUsers);
router.get('/users/:id', protect, authController.getUser);
router.put('/users/:id', protect, authController.updateProfile);
router.delete('/users/:id', protect, authController.deleteUser);

module.exports = router;