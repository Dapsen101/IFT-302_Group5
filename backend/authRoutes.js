const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { stmts } = require("./db");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key-for-group-5"; // In production, use a strong env variable

router.post("/signup", (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = stmts.getUserByEmail.get(email);
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // Hash password and save user
    const name = `${firstName} ${lastName}`;
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const { lastInsertRowid: userId } = stmts.insertUser.run(name, email, hashedPassword);

    // Generate token
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      token,
      user: { id: userId, name, email }
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/login", (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user
    const user = stmts.getUserByEmail.get(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check password
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/social", (req, res) => {
  try {
    const { provider, email, name } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required for social login" });

    let user = stmts.getUserByEmail.get(email);
    
    // If no user exists, auto-create one for social login
    if (!user) {
      const defaultName = name || email.split("@")[0];
      const randomPassword = bcrypt.hashSync(Math.random().toString(36).slice(-8), 10);
      const { lastInsertRowid: userId } = stmts.insertUser.run(defaultName, email, randomPassword);
      user = { id: userId, name: defaultName, email };
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    console.error("Social login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Middleware to verify JWT token
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

router.get("/me", authMiddleware, (req, res) => {
  try {
    const user = stmts.getUserById.get(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update user profile
router.put("/me", authMiddleware, (req, res) => {
  try {
    const { name, phone, address, city, state, zip, country, avatar_url } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    stmts.updateUserProfile.run(
      name,
      phone || "",
      address || "",
      city || "",
      state || "",
      zip || "",
      country || "United States",
      avatar_url || "",
      req.userId
    );

    const updatedUser = stmts.getUserById.get(req.userId);
    res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

module.exports = { authRouter: router, authMiddleware };
