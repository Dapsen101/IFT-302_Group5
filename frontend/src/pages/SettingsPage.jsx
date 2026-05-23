export default function SettingsPage() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 20px", minHeight: "60vh" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>Account Settings</h1>
      
      <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16, overflow: "hidden" }}>
        <div style={{ padding: 24, borderBottom: "1px solid #E5E7EB" }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: "#111", margin: "0 0 16px" }}>Notifications</h2>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
              <input type="checkbox" defaultChecked style={{ width: 18, height: 18, accentColor: "#3B5BDB" }} />
              <div>
                <span style={{ display: "block", fontSize: 15, fontWeight: 500, color: "#111" }}>Order Updates</span>
                <span style={{ fontSize: 13, color: "#6B7280" }}>Get emails about your order status and shipping.</span>
              </div>
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
              <input type="checkbox" defaultChecked style={{ width: 18, height: 18, accentColor: "#3B5BDB" }} />
              <div>
                <span style={{ display: "block", fontSize: 15, fontWeight: 500, color: "#111" }}>Promotional Emails</span>
                <span style={{ fontSize: 13, color: "#6B7280" }}>Receive exclusive offers and product news.</span>
              </div>
            </label>
          </div>
        </div>

        <div style={{ padding: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: "#111", margin: "0 0 16px" }}>Security</h2>
          <button style={{ padding: "10px 20px", background: "#fff", color: "#374151", border: "1px solid #D1D5DB", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>
            Change Password
          </button>
          
          <div style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid #F3F4F6" }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: "#EF4444", margin: "0 0 8px" }}>Danger Zone</h3>
            <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 16px" }}>Once you delete your account, there is no going back. Please be certain.</p>
            <button style={{ padding: "10px 20px", background: "#FEF2F2", color: "#EF4444", border: "1px solid #FCA5A5", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
