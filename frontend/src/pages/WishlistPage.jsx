export default function WishlistPage({ onNavigate }) {
  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 20px", minHeight: "60vh" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>My Wishlist</h1>
      
      <div style={{ textAlign: "center", padding: "80px 20px", background: "#fff", borderRadius: 16, border: "1px solid #E5E7EB" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>❤️</div>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: "#111", marginBottom: 8 }}>Your wishlist is empty</h2>
        <p style={{ color: "#6B7280", marginBottom: 24, maxWidth: 400, margin: "0 auto 24px" }}>
          Save items you want to look at later. They will stay here until you're ready to buy them!
        </p>
        <button 
          onClick={() => onNavigate("shop")}
          style={{ padding: "12px 24px", background: "#3B5BDB", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}
        >
          Explore Products
        </button>
      </div>
    </div>
  );
}
