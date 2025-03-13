const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const cartController = require("../controllers/cartController");

const router = express.Router();

router.use(protect); // Protect all cart routes

router.get("/", cartController.getCart);
router.post("/add", cartController.addToCart);
router.delete("/item/:itemId", cartController.removeFromCart);
router.put("/item/update/:itemId", cartController.updateCartItem);
router.delete("/clear", cartController.clearCart); // Add new route for clearing the cart

module.exports = router;
