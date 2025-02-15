const express = require('express');
const router = express.Router();
const furnitureController = require('../controllers/furnitureController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

router.get('/', furnitureController.getAllFurniture);
router.post('/', protect, restrictTo('admin'), furnitureController.createFurniture);
router.put('/:id', protect, restrictTo('admin'), furnitureController.updateFurniture);
router.delete('/:id', protect, restrictTo('admin'), furnitureController.deleteFurniture);

router.post('/:id/favorite', protect, furnitureController.addToFavorites);
router.delete('/:id/favorite', protect, furnitureController.removeFromFavorites);
router.get('/favorites', protect, furnitureController.getFavorites);
router.get('/favorites/:id', protect, furnitureController.viewFavorite);

module.exports = router;