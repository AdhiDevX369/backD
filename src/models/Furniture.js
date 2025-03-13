const mongoose = require("mongoose");

const furnitureSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    basePrice: { type: Number, required: true },
    description: String,
    imageUrl: { type: String, required: true }, // Adding image URL field
    woodTypes: [
      {
        woodType: { type: mongoose.Schema.Types.ObjectId, ref: "Wood" },
        priceMultiplier: Number,
      },
    ],
    stock: { type: Number, required: true, default: 0 },
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Furniture", furnitureSchema);
