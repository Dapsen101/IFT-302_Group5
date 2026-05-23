const Database = require("better-sqlite3");
const path = require("path");

const DB_PATH = path.join(__dirname, "store.db");
const db = new Database(DB_PATH);

// Enable WAL mode for better performance
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// ── Schema ────────────────────────────────────────────────────────────────────

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL,
    email       TEXT    NOT NULL UNIQUE COLLATE NOCASE,
    password    TEXT    NOT NULL,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS orders (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    order_number  TEXT    NOT NULL UNIQUE,
    status        TEXT    NOT NULL DEFAULT 'Processing',
    total         REAL    NOT NULL,
    shipping_name TEXT    NOT NULL,
    shipping_addr TEXT    NOT NULL,
    shipping_city TEXT    NOT NULL,
    shipping_state TEXT   NOT NULL,
    shipping_zip  TEXT,
    shipping_country TEXT NOT NULL DEFAULT 'United States',
    created_at    TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id    INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id  INTEGER NOT NULL,
    name        TEXT    NOT NULL,
    brand       TEXT,
    img         TEXT,
    price       REAL    NOT NULL,
    quantity    INTEGER NOT NULL
  );
`);

// ── Prepared statements ───────────────────────────────────────────────────────

const stmts = {
  // Users
  insertUser: db.prepare(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)"
  ),
  getUserByEmail: db.prepare(
    "SELECT * FROM users WHERE email = ?"
  ),
  getUserById: db.prepare(
    "SELECT id, name, email, created_at FROM users WHERE id = ?"
  ),

  // Orders
  insertOrder: db.prepare(`
    INSERT INTO orders
      (user_id, order_number, total, shipping_name, shipping_addr,
       shipping_city, shipping_state, shipping_zip, shipping_country)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `),
  insertOrderItem: db.prepare(`
    INSERT INTO order_items (order_id, product_id, name, brand, img, price, quantity)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `),
  getOrdersByUser: db.prepare(`
    SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC
  `),
  getOrderItems: db.prepare(`
    SELECT * FROM order_items WHERE order_id = ?
  `),
  getOrderById: db.prepare(`
    SELECT o.*, u.name AS user_name, u.email AS user_email
    FROM orders o JOIN users u ON o.user_id = u.id
    WHERE o.id = ?
  `),
};

// ── Transaction helper: create order + items atomically ──────────────────────

const createOrderTx = db.transaction((userId, orderData, items) => {
  const { lastInsertRowid: orderId } = stmts.insertOrder.run(
    userId,
    orderData.orderNumber,
    orderData.total,
    orderData.shippingName,
    orderData.shippingAddr,
    orderData.shippingCity,
    orderData.shippingState,
    orderData.shippingZip || "",
    orderData.shippingCountry || "United States"
  );

  for (const item of items) {
    stmts.insertOrderItem.run(
      orderId,
      item.id,
      item.name,
      item.brand || "",
      item.img || "",
      item.price,
      item.quantity
    );
  }

  return orderId;
});

module.exports = { db, stmts, createOrderTx };
