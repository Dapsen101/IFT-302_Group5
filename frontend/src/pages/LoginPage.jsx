import { useState } from "react";

export default function LoginPage({ onLogin, onGoToSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function validate() {
    const e = {};
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Enter a valid email address";
    if (password.length < 6) e.password = "Password must be at least 6 characters";
    return e;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);

    try {
      const res = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (!res.ok) {
        setErrors({ email: data.error || "Login failed" });
      } else {
        onLogin(data); // pass { token, user }
      }
    } catch (err) {
      setErrors({ email: "Could not connect to server" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={pageWrap}>
      {/* Left decorative panel */}
      <div style={leftPanel}>
        <div style={{ position: "relative", zIndex: 1, maxWidth: 420 }}>
          <div style={logoRow}>
            <div style={logoBubble}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
              </svg>
            </div>
            <span style={{ fontWeight: 700, fontSize: 20, color: "#fff" }}>
              Group<span style={{ color: "#93C5FD" }}>Five</span>
            </span>
          </div>
          <h1 style={{ fontSize: 38, fontWeight: 800, color: "#fff", lineHeight: 1.2, margin: "36px 0 16px" }}>
            Welcome back!
          </h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 16, lineHeight: 1.7 }}>
            Sign in to access your orders, saved items, and personalised recommendations.
          </p>

          {/* Feature bullets */}
          <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              ["🛒", "Track your orders in real time"],
              ["❤️", "Access your wishlist anytime"],
              ["🔒", "Secure, encrypted checkout"],
            ].map(([icon, text]) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 20 }}>{icon}</span>
                <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 15 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Background circles */}
        <div style={{ position: "absolute", width: 350, height: 350, borderRadius: "50%", background: "rgba(255,255,255,0.05)", top: -80, right: -80 }} />
        <div style={{ position: "absolute", width: 250, height: 250, borderRadius: "50%", background: "rgba(255,255,255,0.06)", bottom: 40, left: -60 }} />
      </div>

      {/* Right form panel */}
      <div style={rightPanel}>
        <div style={formCard}>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: "#111", margin: "0 0 6px" }}>Sign in</h2>
          <p style={{ fontSize: 14, color: "#6B7280", margin: "0 0 28px" }}>
            Don't have an account?{" "}
            <button onClick={onGoToSignup} style={linkBtn}>Create one</button>
          </p>

          {/* Social buttons */}
          <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
            <SocialBtn label="Continue with Google" icon={
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.2l6.7-6.7C35.8 2.5 30.2 0 24 0 14.7 0 6.7 5.5 2.9 13.5l7.8 6.1C12.6 13.3 17.9 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.5 24.5c0-1.7-.2-3.3-.5-4.8H24v9.1h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.3z" />
                <path fill="#FBBC05" d="M10.7 28.4c-.5-1.5-.8-3.1-.8-4.8s.3-3.3.8-4.8L2.9 12.7C1.1 16.1 0 19.9 0 24s1.1 7.9 2.9 11.3l7.8-6.9z" />
                <path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.5-5.8c-2.1 1.4-4.7 2.2-7.7 2.2-6.1 0-11.4-3.8-13.3-9.2l-7.8 6.1C6.7 42.5 14.7 48 24 48z" />
              </svg>
            } />
            <SocialBtn label="Continue with Apple" icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#111">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
            } />
          </div>

          <Divider />

          <form onSubmit={handleSubmit} noValidate>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <Field
                id="login-email" label="Email address" type="email"
                value={email} error={errors.email}
                onChange={setEmail} placeholder="you@example.com"
              />

              <div>
                <label htmlFor="login-password" style={labelStyle}>Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{
                      ...inputStyle,
                      paddingRight: 44,
                      ...(errors.password ? errorBorder : {}),
                    }}
                    onFocus={(e) => { e.target.style.borderColor = "#3B5BDB"; e.target.style.boxShadow = "0 0 0 3px rgba(59,91,219,0.1)"; }}
                    onBlur={(e) => { e.target.style.borderColor = errors.password ? "#EF4444" : "#D1D5DB"; e.target.style.boxShadow = "none"; }}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={eyeBtn}>
                    {showPassword ? <EyeOff /> : <EyeOn />}
                  </button>
                </div>
                {errors.password && <span style={errorStyle}>{errors.password}</span>}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "16px 0 24px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14, color: "#374151" }}>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  style={{ width: 16, height: 16, accentColor: "#3B5BDB" }}
                />
                Remember me
              </label>
              <button type="button" style={linkBtn}>Forgot password?</button>
            </div>

            <button type="submit" disabled={loading} style={submitBtn(loading)}>
              {loading ? <Spinner /> : "Sign in →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ── Social button ── */
function SocialBtn({ label, icon }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      onMouseOver={() => setHovered(true)}
      onMouseOut={() => setHovered(false)}
      style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        padding: "10px 0", border: "1px solid #D1D5DB", borderRadius: 9,
        background: hovered ? "#F9FAFB" : "#fff", cursor: "pointer",
        fontSize: 13, fontWeight: 500, color: "#374151",
        transition: "background 0.15s, border-color 0.15s",
        borderColor: hovered ? "#9CA3AF" : "#D1D5DB",
      }}
    >
      {icon}
      <span style={{ fontSize: 12 }}>{label.replace("Continue with ", "")}</span>
    </button>
  );
}

function Divider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "0 0 24px" }}>
      <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
      <span style={{ fontSize: 13, color: "#9CA3AF" }}>or sign in with email</span>
      <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
    </div>
  );
}

function Field({ id, label, type, value, error, onChange, placeholder }) {
  return (
    <div>
      <label htmlFor={id} style={labelStyle}>{label}</label>
      <input
        id={id} type={type} value={value} placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={{ ...inputStyle, ...(error ? errorBorder : {}) }}
        onFocus={(e) => { e.target.style.borderColor = "#3B5BDB"; e.target.style.boxShadow = "0 0 0 3px rgba(59,91,219,0.1)"; }}
        onBlur={(e) => { e.target.style.borderColor = error ? "#EF4444" : "#D1D5DB"; e.target.style.boxShadow = "none"; }}
      />
      {error && <span style={errorStyle}>{error}</span>}
    </div>
  );
}

function Spinner() {
  return (
    <div style={{
      width: 18, height: 18, border: "2.5px solid rgba(255,255,255,0.4)",
      borderTop: "2.5px solid #fff", borderRadius: "50%",
      animation: "spin 0.7s linear infinite", display: "inline-block",
    }} />
  );
}

function EyeOn() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOff() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

/* ── Styles ── */
const pageWrap = {
  display: "flex", minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif",
};
const leftPanel = {
  flex: "0 0 420px", background: "linear-gradient(145deg, #3B5BDB 0%, #4F46E5 60%, #6D28D9 100%)",
  padding: "48px 48px", display: "flex", flexDirection: "column", justifyContent: "center",
  position: "relative", overflow: "hidden",
};
const rightPanel = {
  flex: 1, background: "#F8F9FA", display: "flex",
  alignItems: "center", justifyContent: "center", padding: "40px 24px",
};
const formCard = {
  background: "#fff", borderRadius: 20, padding: "40px 40px",
  width: "100%", maxWidth: 440,
  boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
};
const logoRow = { display: "flex", alignItems: "center", gap: 10 };
const logoBubble = {
  width: 38, height: 38, borderRadius: 10, background: "rgba(255,255,255,0.2)",
  display: "flex", alignItems: "center", justifyContent: "center",
};
const labelStyle = { display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 7 };
const inputStyle = {
  width: "100%", padding: "11px 14px", 
  borderWidth: "1.5px", borderStyle: "solid", borderColor: "#D1D5DB",
  borderRadius: 9, fontSize: 14, outline: "none", boxSizing: "border-box",
  transition: "border-color 0.15s, box-shadow 0.15s", color: "#111",
};
const errorBorder = { borderColor: "#EF4444" };
const errorStyle = { fontSize: 12, color: "#EF4444", display: "block", marginTop: 5 };
const eyeBtn = {
  position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
  background: "none", border: "none", cursor: "pointer", color: "#9CA3AF",
  display: "flex", alignItems: "center", padding: 2,
};
const linkBtn = {
  background: "none", border: "none", cursor: "pointer",
  color: "#3B5BDB", fontSize: 14, fontWeight: 500, padding: 0,
};
const submitBtn = (loading) => ({
  width: "100%", padding: "13px 0",
  background: loading
    ? "#93C5FD"
    : "linear-gradient(135deg, #3B5BDB, #4F46E5)",
  color: "#fff", border: "none", borderRadius: 10,
  fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
  letterSpacing: 0.3, boxShadow: "0 4px 14px rgba(59,91,219,0.3)",
  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
  transition: "opacity 0.15s",
});

// Add spinner keyframe to document
if (typeof document !== "undefined" && !document.getElementById("spin-style")) {
  const s = document.createElement("style");
  s.id = "spin-style";
  s.textContent = "@keyframes spin { to { transform: rotate(360deg); } }";
  document.head.appendChild(s);
}
