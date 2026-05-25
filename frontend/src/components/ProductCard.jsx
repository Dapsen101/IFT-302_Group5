import { useState } from "react";
import StarRating from "../utils/StarRating";

export default function ProductCard({ product, onAddToCart }) {
  const [liked, setLiked] = useState(false);

  return (
    <div style={{
      background: "#fff",
      borderRadius: 8,
      overflow: "hidden",
      border: "1px solid #F0F0F0",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Image Area */}
      <div style={{ position: "relative", background: "var(--bg-card)", height: 200 }}>
        <img
          src={product.img || 'https://placehold.co/400x400/F3F4F6/9CA3AF?text=No+image'}
          alt={product.name}
          loading="lazy"
          onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x400/F3F4F6/9CA3AF?text=No+image'; }}
          style={{ width: "100%", height: "100%", objectFit: "contain", padding: 16 }}
        />
        <button
          onClick={() => setLiked(!liked)}
          style={{
            position: "absolute", top: 10, right: 10,
            background: "#fff", border: "1px solid #E5E7EB",
            borderRadius: 6, width: 32, height: 32,
            cursor: "pointer", display: "flex",
            alignItems: "center", justifyContent: "center",
          }}
        >
          <svg
            width="16" height="16" viewBox="0 0 24 24"
            fill={liked ? "#EF4444" : "none"}
            stroke={liked ? "#EF4444" : "#9CA3AF"}
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      {/* Info Area */}
      <div style={{ padding: "12px 14px 14px", flex: 1, display: "flex", flexDirection: "column" }}>
        <p style={{ fontSize: 13, color: "#374151", margin: "0 0 8px", lineHeight: 1.4, flex: 1 }}>
          {product.name}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
          <StarRating rating={product.rating} />
          <span style={{ fontSize: 12, color: "#F5A623", fontWeight: 600 }}>{product.rating}</span>
          <span style={{ fontSize: 12, color: "#9CA3AF" }}>({product.orders} orders)</span>
        </div>
        <p style={{ color: "#3B5BDB", fontWeight: 700, fontSize: 16, margin: "0 0 10px" }}>
          ${product.price.toFixed(2)}
        </p>
        <button
          type="button"
          onClick={() => onAddToCart?.(product)}
          style={{
            width: "100%", padding: "8px 0",
            border: "1px solid #E5E7EB", borderRadius: 6,
            background: "#F9FAFB", cursor: "pointer",
            fontSize: 13, color: "#374151",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          Add to cart
        </button>
      </div>
    </div>
  );
}
