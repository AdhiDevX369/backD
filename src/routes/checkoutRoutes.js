const express = require("express");
const router = express.Router();
const checkoutController = require("../controllers/checkoutController");
const { protect } = require("../middlewares/authMiddleware");

// Protected checkout routes
router.post(
  "/create-session",
  protect,
  checkoutController.createCheckoutSession
);
router.get("/success", protect, checkoutController.checkoutSuccess);

module.exports = router;
