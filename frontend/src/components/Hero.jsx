export default function Hero() {
  return (
    <div style={{
      background: "#E8EAF6",
      borderRadius: 12,
      margin: "20px 0",
      padding: "40px 48px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      overflow: "hidden",
      position: "relative",
    }}>
      {/* Text */}
      <div style={{ zIndex: 1 }}>
        <span style={{
          background: "#3B5BDB", color: "#fff", fontSize: 12,
          fontWeight: 600, padding: "4px 12px", borderRadius: 4,
          display: "inline-block", marginBottom: 16,
        }}>
          LIMITED OFFER
        </span>
        <h1 style={{ margin: 0, fontSize: 36, fontWeight: 400, lineHeight: 1.2 }}>
          Super Deals
        </h1>
        <h1 style={{ margin: "4px 0 12px", fontSize: 36, fontWeight: 700 }}>
          Home Furniture
        </h1>
        <p style={{ color: "#6B7280", fontSize: 14, margin: 0 }}>
          Last Call for upto 20% offer
        </p>
      </div>

      {/* Decorative Graphics */}
      <div style={{ display: "flex", gap: 40, zIndex: 1 }}>
        <div style={{
          width: 160, height: 200,
          background: "rgba(255,255,255,0.3)",
          borderRadius: 80,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 80,
        }}>
          🛍️
        </div>
        <div style={{
          width: 180, height: 180,
          background: "rgba(255,255,255,0.4)",
          borderRadius: 12,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 60,
        }}>
          🖥️
        </div>
      </div>
    </div>
  );
}
