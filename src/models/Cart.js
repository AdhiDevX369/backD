const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  furniture: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Furniture",
    required: true,
  },
  quantity: { type: Number, required: true, min: 1 },
  woodType: { type: mongoose.Schema.Types.ObjectId, ref: "Wood" },
  price: { type: Number, required: true },
});

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [cartItemSchema],
    totalAmount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
