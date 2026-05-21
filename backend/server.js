const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 4000;
const PRODUCT_API_URL = "https://dummyjson.com/products?limit=50";

console.log("Backend config: PORT=", PORT, "PRODUCT_API_URL=", PRODUCT_API_URL);

const CONDITIONS = ["Brand new", "Used item", "Well used", "Old item"];

const FALLBACK_PRODUCTS = [
  {
    id: 1,
    name: "Smart watch with the sleek and stylish your perfect assistant.",
    price: 376.0,
    rating: 4.5,
    orders: 12,
    category: "Smartphones",
    brand: "Apple",
    condition: "Brand new",
    img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80",
    description: "A sleek smart watch that keeps you connected all day.",
  },
  {
    id: 2,
    name: "Xiaomi Smart watch Pro Max 95680 great memory and Ultra display",
    price: 99.5,
    rating: 4.0,
    orders: 5,
    category: "Smart watches",
    brand: "Xiaomi",
    condition: "Brand new",
    img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&q=80",
    description: "A budget-friendly smartwatch with impressive battery life.",
  },
  {
    id: 3,
    name: "Wireless headset with unbeatable sound and comfort.",
    price: 129.0,
    rating: 4.2,
    orders: 22,
    category: "Headsets",
    brand: "Samsung",
    condition: "Used item",
    img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&q=80",
    description: "Comfortable wireless headphones for music and calls.",
  },
  {
    id: 4,
    name: "Galaxy Tab, designed for both work and play with its stunning display",
    price: 56.0,
    rating: 4.5,
    orders: 12,
    category: "Computers",
    brand: "Asus",
    condition: "Brand new",
    img: "https://images.unsplash.com/photo-1589739900266-43b2843f4c12?w=300&q=80",
    description: "A lightweight tablet built for productivity and media.",
  },
  {
    id: 5,
    name: "Wacom Intuos Pro tablet, perfect for artists and designers alike.",
    price: 12.99,
    rating: 4.5,
    orders: 12,
    category: "Accessories",
    brand: "Lenovo",
    condition: "Well used",
    img: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&q=80",
    description: "A graphics tablet designed for creative professionals.",
  },
  {
    id: 6,
    name: "Ultra-portable laptop built for productivity on the go.",
    price: 899.0,
    rating: 4.8,
    orders: 18,
    category: "Laptops",
    brand: "DELL",
    condition: "Brand new",
    img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&q=80",
    description: "A compact laptop with powerful performance for daily use.",
  },
  {
    id: 7,
    name: "Noise-cancelling headphones with long battery life.",
    price: 199.0,
    rating: 4.7,
    orders: 35,
    category: "Headsets",
    brand: "Panasonic",
    condition: "Brand new",
    img: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&q=80",
    description: "Premium over-ear headphones for immersive sound.",
  },
  {
    id: 8,
    name: "Portable speaker with deep bass and wireless streaming.",
    price: 45.0,
    rating: 4.3,
    orders: 42,
    category: "Sound",
    brand: "Xiaomi",
    condition: "Brand new",
    img: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&q=80",
    description: "A compact speaker with rich bass and Bluetooth support.",
  },
  {
    id: 9,
    name: "Smart home camera for easy monitoring and peace of mind.",
    price: 89.0,
    rating: 4.5,
    orders: 27,
    category: "Mini Cameras",
    brand: "Samsung",
    condition: "Used item",
    img: "https://images.unsplash.com/photo-1606400082777-ef05f3c5cde2?w=300&q=80",
    description: "A smart camera with live streaming and motion alerts.",
  },
];

function normalizeProduct(product) {
  const price = Number(product?.price) || 0;
  const image = product?.thumbnail || (Array.isArray(product?.images) ? product.images[0] : "") || "";
  const totalInventory = Number(product?.stock) || 0;

  return {
    id: product.id,
    name: product.title || product.name || "Unknown product",
    price,
    rating: Number(product?.rating) || Number(((product.id % 5) + 3.5).toFixed(1)),
    orders: totalInventory || Math.max(1, Number(product.id) % 40),
    category: product.category || "Misc",
    brand: product.brand || "Generic",
    condition: CONDITIONS[Number(product.id) % CONDITIONS.length],
    img: image,
    description: product.description || "",
  };
}

app.use(cors());

app.get("/api/products", async (req, res) => {
  console.log("GET /api/products called");
  try {
    console.log("Fetching products from", PRODUCT_API_URL);
    const response = await axios.get(PRODUCT_API_URL, {
      timeout: 15000,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "application/json, text/plain, */*",
      },
    });

    const products = Array.isArray(response.data?.products)
      ? response.data.products.map(normalizeProduct)
      : Array.isArray(response.data)
      ? response.data.map(normalizeProduct)
      : [];

    console.log("Product fetch complete, count=", products.length);
    res.json({ products });
  } catch (error) {
    console.error("Product API error", error?.message || error);
    const products = FALLBACK_PRODUCTS;
    console.log("Returning fallback products, count=", products.length);
    res.json({ products });
  }
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
