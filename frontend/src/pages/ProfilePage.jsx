export default function ProfilePage({ user }) {
  if (!user) {
    return <div style={{ padding: 100, textAlign: "center" }}>Please log in to view your profile.</div>;
  }

  const initials = user.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 20px", minHeight: "60vh" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>My Profile</h1>
      
      <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16, overflow: "hidden" }}>
        {/* Banner */}
        <div style={{ height: 120, background: "linear-gradient(135deg, #3B5BDB, #6D28D9)" }} />
        
        <div style={{ padding: "0 32px 32px", position: "relative" }}>
          {/* Avatar */}
          <div style={{ 
            width: 100, height: 100, borderRadius: "50%", background: "#fff", 
            display: "flex", alignItems: "center", justifyContent: "center",
            marginTop: -50, marginBottom: 16, border: "4px solid #fff", boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
          }}>
            <div style={{ 
              width: "100%", height: "100%", borderRadius: "50%", 
              background: "linear-gradient(135deg, #E0E7FF, #C7D2FE)", 
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 32, fontWeight: 700, color: "#3B5BDB"
            }}>
              {initials}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, color: "#6B7280", marginBottom: 6, fontWeight: 600 }}>Full Name</label>
              <input 
                type="text" 
                defaultValue={user.name} 
                style={{ width: "100%", padding: "12px 16px", border: "1px solid #D1D5DB", borderRadius: 8, fontSize: 15 }}
                readOnly
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, color: "#6B7280", marginBottom: 6, fontWeight: 600 }}>Email Address</label>
              <input 
                type="email" 
                defaultValue={user.email} 
                style={{ width: "100%", padding: "12px 16px", border: "1px solid #D1D5DB", borderRadius: 8, fontSize: 15, background: "#F9FAFB" }}
                readOnly
              />
            </div>
            <div>
              <button style={{ padding: "12px 24px", background: "#111", color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, cursor: "not-allowed", opacity: 0.7 }}>
                Update Profile
              </button>
              <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 8 }}>Profile editing is currently disabled.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
