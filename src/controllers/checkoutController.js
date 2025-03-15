const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Cart = require("../models/Cart");

exports.createCheckoutSession = async (req, res) => {
  try {
    const { products } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ error: "No products provided" });
    }

    // Format line items for Stripe
    const lineItems = products.map((item) => {
      const unitAmount = Math.round((item.price / item.quantity) * 100); // Stripe requires amount in cents

      return {
        price_data: {
          currency: "lkr",
          product_data: {
            name: item.furniture.name || "Furniture Item",
            description: item.woodType
              ? `Wood Type: ${item.woodType.name}`
              : "Custom Furniture",
            images: [item.furniture.imageUrl],
          },
          unit_amount: unitAmount,
        },
        quantity: item.quantity,
      };
    });

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${req.headers.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/cart`,
      // Enable shipping address collection
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "LK"], // Add countries you want to allow
      },
      // Enable phone number collection
      phone_number_collection: {
        enabled: true,
      },
      // Store collected information in metadata
      metadata: {
        userId: req.user.id,
      },
    });

    // Return session ID
    res.json({ id: session.id });
  } catch (error) {
    console.error("Stripe session creation error:", error);
    res.status(500).json({
      error: "Failed to create checkout session",
      details: error.message,
    });
  }
};

exports.checkoutSuccess = async (req, res) => {
  try {
    const { session_id } = req.query;

    // Verify the session
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === "paid") {
      // Clear the user's cart after successful payment
      await Cart.findOneAndUpdate(
        { user: req.user.id },
        { $set: { items: [], totalAmount: 0 } }
      );

      res.json({ success: true, message: "Payment successful!" });
    } else {
      res.status(400).json({ error: "Payment not completed" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
