const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");

// Route to handle contact form submissions
router.post("/", contactController.sendContactEmail);

module.exports = router;
