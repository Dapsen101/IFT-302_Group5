const express = require("express");
const { stmts, createOrderTx } = require("./db");
const { authMiddleware } = require("./authRoutes");

const router = express.Router();

// Require authentication for all order routes
router.use(authMiddleware);

// Create a new order
router.post("/", (req, res) => {
  try {
    const { items, shipping, total } = req.body;

    if (!items || !items.length || !shipping || total === undefined) {
      return res.status(400).json({ error: "Invalid order data" });
    }

    // Generate a simple order number
    const orderNumber = `GF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const orderData = {
      orderNumber,
      total,
      shippingName: `${shipping.firstName} ${shipping.lastName}`,
      shippingAddr: shipping.address,
      shippingCity: shipping.city,
      shippingState: shipping.state,
      shippingZip: shipping.zip,
      shippingCountry: shipping.country
    };

    // Use the transaction helper to save order and items atomically
    const orderId = createOrderTx(req.userId, orderData, items);

    res.status(201).json({ success: true, orderId, orderNumber });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// Get user's past orders
router.get("/", (req, res) => {
  try {
    const orders = stmts.getOrdersByUser.all(req.userId);
    
    // Attach items to each order
    for (const order of orders) {
      order.items = stmts.getOrderItems.all(order.id);
    }

    res.json({ orders });
  } catch (error) {
    console.error("Fetching orders error:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

module.exports = { orderRouter: router };
