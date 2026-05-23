import StarRating from "../utils/StarRating";

export default function CartPage({ cartItems, onUpdateQty, onRemove, onCheckout, onContinueShopping }) {
  const items = Object.values(cartItems);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? (subtotal >= 100 ? 0 : 9.99) : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 20px", fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <button
          onClick={onContinueShopping}
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: "#3B5BDB", fontSize: 14, fontWeight: 500,
            display: "flex", alignItems: "center", gap: 6, padding: 0, marginBottom: 12,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Continue Shopping
        </button>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#111", margin: 0 }}>
          Shopping Cart
          <span style={{ fontSize: 16, fontWeight: 400, color: "#6B7280", marginLeft: 10 }}>
            ({items.length} {items.length === 1 ? "item" : "items"})
          </span>
        </h1>
      </div>

      {items.length === 0 ? (
        /* Empty State */
        <div style={{
          background: "#fff", borderRadius: 16, border: "1px solid #E5E7EB",
          padding: "80px 40px", textAlign: "center",
        }}>
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.2"
            style={{ marginBottom: 20 }}>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
          </svg>
          <h2 style={{ fontSize: 22, fontWeight: 600, color: "#374151", margin: "0 0 8px" }}>Your cart is empty</h2>
          <p style={{ color: "#9CA3AF", fontSize: 15, marginBottom: 28 }}>
            Looks like you haven't added anything yet.
          </p>
          <button
            onClick={onContinueShopping}
            style={{
              background: "#3B5BDB", color: "#fff", border: "none",
              borderRadius: 10, padding: "14px 32px",
              fontSize: 15, fontWeight: 600, cursor: "pointer",
            }}
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 24, alignItems: "start" }}>
          {/* Cart Items */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Free shipping banner */}
            {subtotal < 100 && (
              <div style={{
                background: "linear-gradient(135deg, #EEF2FF, #E0E7FF)",
                border: "1px solid #C7D2FE", borderRadius: 10, padding: "12px 18px",
                display: "flex", alignItems: "center", gap: 10, fontSize: 14,
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3B5BDB" strokeWidth="2">
                  <rect x="1" y="3" width="15" height="13" rx="2" />
                  <path d="M16 8h4l3 3v5h-7V8z" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
                <span style={{ color: "#3730A3" }}>
                  Add <strong>${(100 - subtotal).toFixed(2)}</strong> more for <strong>free shipping</strong>!
                </span>
              </div>
            )}

            {items.map((item) => (
              <CartItemRow
                key={item.id}
                item={item}
                onUpdateQty={onUpdateQty}
                onRemove={onRemove}
              />
            ))}
          </div>

          {/* Order Summary */}
          <div style={{
            background: "#fff", borderRadius: 16, border: "1px solid #E5E7EB",
            padding: 24, position: "sticky", top: 90,
          }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111", margin: "0 0 20px" }}>Order Summary</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <SummaryRow label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
              <SummaryRow
                label="Shipping"
                value={shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                valueColor={shipping === 0 ? "#16A34A" : undefined}
              />
              <SummaryRow label="Tax (8%)" value={`$${tax.toFixed(2)}`} />
              <div style={{ borderTop: "2px solid #F3F4F6", margin: "4px 0" }} />
              <SummaryRow label="Total" value={`$${total.toFixed(2)}`} isBold />
            </div>

            <button
              onClick={onCheckout}
              style={{
                width: "100%", marginTop: 24,
                background: "linear-gradient(135deg, #3B5BDB, #4F46E5)",
                color: "#fff", border: "none", borderRadius: 10,
                padding: "15px 0", fontSize: 16, fontWeight: 700,
                cursor: "pointer", letterSpacing: 0.3,
                boxShadow: "0 4px 14px rgba(59,91,219,0.35)",
                transition: "transform 0.15s, box-shadow 0.15s",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(59,91,219,0.45)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "0 4px 14px rgba(59,91,219,0.35)";
              }}
            >
              Proceed to Checkout
            </button>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 14 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span style={{ fontSize: 12, color: "#9CA3AF" }}>Secure checkout · SSL encrypted</span>
            </div>

            {/* Accepted payments */}
            <div style={{ marginTop: 20, borderTop: "1px solid #F3F4F6", paddingTop: 16 }}>
              <p style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 10, textAlign: "center" }}>We accept</p>
              <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
                {["Visa", "Mastercard", "PayPal", "Amex"].map((p) => (
                  <span key={p} style={{
                    padding: "4px 10px", background: "#F9FAFB",
                    border: "1px solid #E5E7EB", borderRadius: 6,
                    fontSize: 11, fontWeight: 600, color: "#374151",
                  }}>{p}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CartItemRow({ item, onUpdateQty, onRemove }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 14, border: "1px solid #E5E7EB",
      padding: 18, display: "flex", gap: 18, alignItems: "center",
      transition: "box-shadow 0.15s",
    }}
      onMouseOver={(e) => e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.07)"}
      onMouseOut={(e) => e.currentTarget.style.boxShadow = "none"}
    >
      {/* Image */}
      <div style={{
        width: 90, height: 90, background: "#F4F5F7", borderRadius: 10,
        flexShrink: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <img src={item.img} alt={item.name}
          style={{ width: "100%", height: "100%", objectFit: "contain", padding: 8 }} />
      </div>

      {/* Details */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: "#111", margin: "0 0 4px", lineHeight: 1.4 }}>
          {item.name}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
          <StarRating rating={item.rating} size={12} />
          <span style={{ fontSize: 12, color: "#9CA3AF" }}>{item.brand}</span>
          <span style={{
            fontSize: 11, color: "#6B7280", background: "#F3F4F6",
            padding: "2px 7px", borderRadius: 20,
          }}>{item.condition}</span>
        </div>
        <p style={{ fontSize: 18, fontWeight: 700, color: "#3B5BDB", margin: 0 }}>
          ${(item.price * item.quantity).toFixed(2)}
          <span style={{ fontSize: 12, fontWeight: 400, color: "#9CA3AF", marginLeft: 6 }}>
            (${item.price.toFixed(2)} each)
          </span>
        </p>
      </div>

      {/* Qty + Remove */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 12 }}>
        <button
          onClick={() => onRemove(item.id)}
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: "#EF4444", fontSize: 12, display: "flex", alignItems: "center", gap: 4,
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
          </svg>
          Remove
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 0, border: "1px solid #E5E7EB", borderRadius: 8, overflow: "hidden" }}>
          <button
            onClick={() => onUpdateQty(item.id, item.quantity - 1)}
            style={{
              width: 34, height: 34, border: "none", background: "#F9FAFB",
              cursor: "pointer", fontSize: 18, color: "#374151",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >−</button>
          <span style={{
            width: 40, textAlign: "center", fontSize: 14,
            fontWeight: 600, color: "#111", lineHeight: "34px",
          }}>{item.quantity}</span>
          <button
            onClick={() => onUpdateQty(item.id, item.quantity + 1)}
            style={{
              width: 34, height: 34, border: "none", background: "#F9FAFB",
              cursor: "pointer", fontSize: 18, color: "#374151",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >+</button>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, isBold, valueColor }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: 14, color: isBold ? "#111" : "#6B7280", fontWeight: isBold ? 700 : 400 }}>{label}</span>
      <span style={{ fontSize: isBold ? 18 : 14, color: valueColor || (isBold ? "#111" : "#374151"), fontWeight: isBold ? 700 : 500 }}>
        {value}
      </span>
    </div>
  );
}
