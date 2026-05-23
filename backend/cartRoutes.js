const express = require("express");
const { authMiddleware } = require("./authRoutes");
const { stmts } = require("./db");

const router = express.Router();

// ── Cart Routes ───────────────────────────────────────────────────────────

// Get user's cart
router.get("/", authMiddleware, (req, res) => {
  try {
    const cartItems = stmts.getCart.all(req.userId);
    res.json({ cartItems });
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

// Add or update item in cart
router.post("/", authMiddleware, (req, res) => {
  try {
    const { product_id, quantity } = req.body;
    
    if (!product_id || quantity < 1) {
      return res.status(400).json({ error: "Invalid product_id or quantity" });
    }

    // Add to cart, or increment if already exists
    stmts.addToCart.run(req.userId, product_id, quantity, quantity);
    
    const cartItems = stmts.getCart.all(req.userId);
    res.json({ success: true, cartItems });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ error: "Failed to add item to cart" });
  }
});

// Update cart item quantity
router.put("/:product_id", authMiddleware, (req, res) => {
  try {
    const { product_id } = req.params;
    const { quantity } = req.body;
    
    if (quantity < 1) {
      return res.status(400).json({ error: "Quantity must be at least 1" });
    }

    stmts.updateCartQuantity.run(quantity, req.userId, product_id);
    
    const cartItems = stmts.getCart.all(req.userId);
    res.json({ success: true, cartItems });
  } catch (error) {
    console.error("Update cart error:", error);
    res.status(500).json({ error: "Failed to update cart" });
  }
});

// Remove item from cart
router.delete("/:product_id", authMiddleware, (req, res) => {
  try {
    const { product_id } = req.params;
    
    stmts.removeFromCart.run(req.userId, product_id);
    
    const cartItems = stmts.getCart.all(req.userId);
    res.json({ success: true, cartItems });
  } catch (error) {
    console.error("Remove from cart error:", error);
    res.status(500).json({ error: "Failed to remove item from cart" });
  }
});

// Clear entire cart
router.delete("/", authMiddleware, (req, res) => {
  try {
    stmts.clearCart.run(req.userId);
    res.json({ success: true, cartItems: [] });
  } catch (error) {
    console.error("Clear cart error:", error);
    res.status(500).json({ error: "Failed to clear cart" });
  }
});

// ── Wishlist Routes ───────────────────────────────────────────────────────

// Get user's wishlist
router.get("/wishlist", authMiddleware, (req, res) => {
  try {
    const wishlistItems = stmts.getWishlist.all(req.userId);
    res.json({ wishlistItems });
  } catch (error) {
    console.error("Get wishlist error:", error);
    res.status(500).json({ error: "Failed to fetch wishlist" });
  }
});

// Add to wishlist
router.post("/wishlist", authMiddleware, (req, res) => {
  try {
    const { product_id } = req.body;
    
    if (!product_id) {
      return res.status(400).json({ error: "product_id is required" });
    }

    stmts.addToWishlist.run(req.userId, product_id);
    
    const wishlistItems = stmts.getWishlist.all(req.userId);
    res.json({ success: true, wishlistItems });
  } catch (error) {
    if (error.message.includes("UNIQUE constraint")) {
      return res.status(400).json({ error: "Item already in wishlist" });
    }
    console.error("Add to wishlist error:", error);
    res.status(500).json({ error: "Failed to add to wishlist" });
  }
});

// Remove from wishlist
router.delete("/wishlist/:product_id", authMiddleware, (req, res) => {
  try {
    const { product_id } = req.params;
    
    stmts.removeFromWishlist.run(req.userId, product_id);
    
    const wishlistItems = stmts.getWishlist.all(req.userId);
    res.json({ success: true, wishlistItems });
  } catch (error) {
    console.error("Remove from wishlist error:", error);
    res.status(500).json({ error: "Failed to remove from wishlist" });
  }
});

// Check if product is in wishlist
router.get("/wishlist/:product_id", authMiddleware, (req, res) => {
  try {
    const { product_id } = req.params;
    
    const exists = stmts.isInWishlist.get(req.userId, product_id);
    res.json({ inWishlist: !!exists });
  } catch (error) {
    console.error("Check wishlist error:", error);
    res.status(500).json({ error: "Failed to check wishlist" });
  }
});

module.exports = router;
