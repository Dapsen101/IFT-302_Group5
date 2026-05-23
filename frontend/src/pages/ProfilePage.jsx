import { useState } from "react";

export default function ProfilePage({ user }) {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
    city: user?.city || "",
    state: user?.state || "",
    zip: user?.zip || "",
    country: user?.country || "United States",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  if (!user) {
    return <div style={{ padding: 100, textAlign: "center" }}>Please log in to view your profile.</div>;
  }

  const initials = user.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:4000/api/auth/me", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to update profile");

      setMessage("✓ Profile updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage(`✗ ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 20px", minHeight: "60vh" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>My Profile</h1>
      
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-main)", borderRadius: 16, overflow: "hidden" }}>
        {/* Banner */}
        <div style={{ height: 120, background: "linear-gradient(135deg, var(--accent), #6D28D9)" }} />
        
        <div style={{ padding: "0 32px 32px", position: "relative" }}>
          {/* Avatar */}
          <div style={{ 
            width: 100, height: 100, borderRadius: "50%", background: "var(--bg-nav)", 
            display: "flex", alignItems: "center", justifyContent: "center",
            marginTop: -50, marginBottom: 16, border: "4px solid var(--bg-card)", boxShadow: "var(--shadow-sm)"
          }}>
            <div style={{ 
              width: "100%", height: "100%", borderRadius: "50%", 
              background: "var(--accent-bg)", 
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 32, fontWeight: 700, color: "var(--accent)"
            }}>
              {initials}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, color: "var(--text-muted)", marginBottom: 6, fontWeight: 600 }}>Full Name</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                style={{ width: "100%", padding: "12px 16px", border: "1px solid var(--border-main)", borderRadius: 8, fontSize: 15, background: "var(--bg-input)", color: "var(--text-main)" }}
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, color: "var(--text-muted)", marginBottom: 6, fontWeight: 600 }}>Phone</label>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  style={{ width: "100%", padding: "12px 16px", border: "1px solid var(--border-main)", borderRadius: 8, fontSize: 15, background: "var(--bg-input)", color: "var(--text-main)" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, color: "var(--text-muted)", marginBottom: 6, fontWeight: 600 }}>Email Address</label>
                <input 
                  type="email" 
                  value={user.email} 
                  style={{ width: "100%", padding: "12px 16px", border: "1px solid var(--border-main)", borderRadius: 8, fontSize: 15, background: "var(--bg-hover)", color: "var(--text-main)" }}
                  disabled
                />
              </div>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, color: "var(--text-muted)", marginBottom: 6, fontWeight: 600 }}>Street Address</label>
              <input 
                type="text" 
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Main St"
                style={{ width: "100%", padding: "12px 16px", border: "1px solid var(--border-main)", borderRadius: 8, fontSize: 15, background: "var(--bg-input)", color: "var(--text-main)" }}
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, color: "var(--text-muted)", marginBottom: 6, fontWeight: 600 }}>City</label>
                <input 
                  type="text" 
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="San Francisco"
                  style={{ width: "100%", padding: "12px 16px", border: "1px solid var(--border-main)", borderRadius: 8, fontSize: 15, background: "var(--bg-input)", color: "var(--text-main)" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, color: "var(--text-muted)", marginBottom: 6, fontWeight: 600 }}>State</label>
                <input 
                  type="text" 
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="CA"
                  style={{ width: "100%", padding: "12px 16px", border: "1px solid var(--border-main)", borderRadius: 8, fontSize: 15, background: "var(--bg-input)", color: "var(--text-main)" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, color: "var(--text-muted)", marginBottom: 6, fontWeight: 600 }}>ZIP</label>
                <input 
                  type="text" 
                  name="zip"
                  value={formData.zip}
                  onChange={handleChange}
                  placeholder="94102"
                  style={{ width: "100%", padding: "12px 16px", border: "1px solid var(--border-main)", borderRadius: 8, fontSize: 15, background: "var(--bg-input)", color: "var(--text-main)" }}
                />
              </div>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, color: "var(--text-muted)", marginBottom: 6, fontWeight: 600 }}>Country</label>
              <input 
                type="text" 
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="United States"
                style={{ width: "100%", padding: "12px 16px", border: "1px solid var(--border-main)", borderRadius: 8, fontSize: 15, background: "var(--bg-input)", color: "var(--text-main)" }}
              />
            </div>
            {message && (
              <div style={{ padding: "12px 16px", background: message.startsWith("✗") ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)", color: message.startsWith("✗") ? "var(--danger)" : "#10B981", borderRadius: 8, fontSize: 14 }}>
                {message}
              </div>
            )}
            <div style={{ display: "flex", gap: 12 }}>
              <button 
                onClick={handleSave}
                disabled={saving}
                style={{ 
                  flex: 1, padding: "12px 24px", background: saving ? "var(--text-muted)" : "var(--accent)", color: "var(--accent-foreground)", border: "none", borderRadius: 8, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 
                }}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
