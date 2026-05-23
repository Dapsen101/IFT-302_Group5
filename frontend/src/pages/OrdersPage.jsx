import { useState, useEffect } from "react";

export default function OrdersPage({ token, onNavigate }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError("Please log in to view your orders.");
      setLoading(false);
      return;
    }

    fetch("http://localhost:4000/api/orders", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) setError(data.error);
        else setOrders(data.orders || []);
      })
      .catch(() => setError("Could not connect to server"))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return <div style={{ padding: 100, textAlign: "center" }}>Loading your orders...</div>;
  }

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 20px" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>My Orders</h1>
      
      {error && <p style={{ color: "#EF4444" }}>{error}</p>}

      {!error && orders.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 0", background: "#fff", borderRadius: 12 }}>
          <p style={{ color: "#6B7280", marginBottom: 16 }}>You haven't placed any orders yet.</p>
          <button 
            onClick={() => onNavigate("shop")}
            style={{ padding: "10px 20px", background: "#3B5BDB", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" }}
          >
            Start Shopping
          </button>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {orders.map(order => (
          <div key={order.id} style={{ border: "1px solid #E5E7EB", borderRadius: 12, background: "#fff", overflow: "hidden" }}>
            {/* Header */}
            <div style={{ background: "#F9FAFB", padding: "16px 20px", borderBottom: "1px solid #E5E7EB", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
              <div>
                <p style={{ fontSize: 12, color: "#6B7280", margin: "0 0 4px" }}>ORDER PLACED</p>
                <p style={{ fontSize: 14, color: "#111", margin: 0, fontWeight: 600 }}>
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p style={{ fontSize: 12, color: "#6B7280", margin: "0 0 4px" }}>TOTAL</p>
                <p style={{ fontSize: 14, color: "#111", margin: 0, fontWeight: 600 }}>${order.total.toFixed(2)}</p>
              </div>
              <div>
                <p style={{ fontSize: 12, color: "#6B7280", margin: "0 0 4px" }}>SHIP TO</p>
                <p style={{ fontSize: 14, color: "#3B5BDB", margin: 0, fontWeight: 600 }}>{order.shipping_name}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: 12, color: "#6B7280", margin: "0 0 4px" }}>ORDER # {order.order_number}</p>
                <p style={{ fontSize: 14, color: "#16A34A", margin: 0, fontWeight: 700 }}>{order.status}</p>
              </div>
            </div>
            {/* Items */}
            <div style={{ padding: "20px" }}>
              {order.items?.map(item => (
                <div key={item.id} style={{ display: "flex", gap: 16, marginBottom: 16 }}>
                  <div style={{ width: 80, height: 80, background: "#F3F4F6", borderRadius: 8, overflow: "hidden" }}>
                    {item.img && <img src={item.img} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: "#111", margin: "0 0 4px" }}>{item.name}</h3>
                    <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 8px" }}>Brand: {item.brand}</p>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#111", margin: 0 }}>
                      ${item.price.toFixed(2)} <span style={{ color: "#9CA3AF", fontWeight: 400, fontSize: 13 }}>x {item.quantity}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
