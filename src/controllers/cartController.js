const Cart = require("../models/Cart");
const Furniture = require("../models/Furniture");

exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id })
      .populate("items.furniture")
      .populate("items.woodType");

    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { furnitureId, quantity, woodTypeId } = req.body;

    const furniture = await Furniture.findOne({
      _id: furnitureId,
      is_active: true,
    });
    if (!furniture) {
      return res.status(404).json({ error: "Furniture not found" });
    }

    if (furniture.stock < quantity) {
      return res.status(400).json({ error: "Not enough stock" });
    }

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    const woodTypeItem = furniture.woodTypes.find(
      (w) => w._id.toString() === woodTypeId
    );

    if (!woodTypeItem) {
      return res.status(404).json({ error: "Wood type not found" });
    }

    const price = furniture.basePrice * woodTypeItem.priceMultiplier;

    const existingItem = cart.items.find(
      (item) =>
        item.furniture.toString() === furnitureId &&
        item.woodType?.toString() === woodTypeItem.woodType.toString()
    );

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.price = price * existingItem.quantity;
    } else {
      cart.items.push({
        furniture: furnitureId,
        quantity,
        woodType: woodTypeItem.woodType, // Store the actual Wood reference, not the _id of the woodTypes array item
        price: price * quantity,
      });
    }

    cart.totalAmount = cart.items.reduce(
      (total, item) => total + item.price,
      0
    );
    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    cart.items = cart.items.filter((item) => item._id.toString() !== itemId);
    cart.totalAmount = cart.items.reduce(
      (total, item) => total + item.price,
      0
    );

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    // Validate quantity
    if (!quantity || quantity < 1) {
      return res.status(400).json({
        error: "Invalid quantity. Must be greater than 0",
      });
    }

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const cartItem = cart.items.find((item) => item._id.toString() === itemId);
    if (!cartItem) {
      return res.status(404).json({ error: "Item not found in cart" });
    }

    // Check furniture stock
    const furniture = await Furniture.findById(cartItem.furniture);
    if (!furniture) {
      return res.status(404).json({ error: "Furniture no longer available" });
    }

    if (furniture.stock < quantity) {
      return res.status(400).json({
        error: "Not enough stock",
        availableStock: furniture.stock,
      });
    }

    // Calculate new price
    const woodType = furniture.woodTypes.find(
      (w) => w.woodType.toString() === cartItem.woodType.toString()
    );
    const unitPrice =
      furniture.basePrice * (woodType ? woodType.priceMultiplier : 1);

    // Update cart item
    cartItem.quantity = quantity;
    cartItem.price = unitPrice * quantity;

    // Recalculate total
    cart.totalAmount = cart.items.reduce(
      (total, item) => total + item.price,
      0
    );
    await cart.save();

    // Return updated cart with populated data
    const updatedCart = await Cart.findById(cart._id)
      .populate("items.furniture")
      .populate("items.woodType");

    res.json({
      success: true,
      message: "Cart updated successfully",
      cart: updatedCart,
      updatedItem: {
        id: cartItem._id,
        quantity: cartItem.quantity,
        price: cartItem.price,
        unitPrice: unitPrice,
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    // Find cart only for the current authenticated user
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    // Clear cart items and reset total amount for this user only
    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    res.json({
      success: true,
      message: "Cart cleared successfully",
      cart,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
