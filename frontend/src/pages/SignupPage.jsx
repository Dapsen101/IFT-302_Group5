import { useState } from "react";

export default function SignupPage({ onSignup, onGoToLogin }) {
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", password: "", confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (field) => (val) => setForm((p) => ({ ...p, [field]: val }));

  function validate() {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Enter a valid email address";
    if (form.password.length < 8) e.password = "Password must be at least 8 characters";
    if (!/[A-Z]/.test(form.password)) e.password = "Must contain at least one uppercase letter";
    if (form.confirmPassword !== form.password) e.confirmPassword = "Passwords do not match";
    if (!agreedToTerms) e.terms = "You must agree to the Terms & Conditions";
    return e;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);

    try {
      const res = await fetch("http://localhost:4000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();

      if (!res.ok) {
        setErrors({ email: data.error || "Signup failed" });
      } else {
        onSignup(data); // pass { token, user }
      }
    } catch (err) {
      setErrors({ email: "Could not connect to server" });
    } finally {
      setLoading(false);
    }
  }

  const strength = getPasswordStrength(form.password);

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

          <h1 style={{ fontSize: 36, fontWeight: 800, color: "#fff", lineHeight: 1.2, margin: "36px 0 16px" }}>
            Join thousands of happy shoppers
          </h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 16, lineHeight: 1.7 }}>
            Create a free account and start shopping smarter today.
          </p>

          {/* Testimonial card */}
          <div style={{
            marginTop: 44, background: "rgba(255,255,255,0.1)", borderRadius: 16,
            padding: "22px 24px", backdropFilter: "blur(8px)",
          }}>
            <div style={{ display: "flex", gap: 3, marginBottom: 10 }}>
              {[...Array(5)].map((_, i) => (
                <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#FCD34D" stroke="none">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
            </div>
            <p style={{ color: "rgba(255,255,255,0.9)", fontSize: 14, lineHeight: 1.6, margin: "0 0 14px", fontStyle: "italic" }}>
              "Incredible selection and super fast delivery. GroupFive is my go-to store for all tech purchases!"
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "linear-gradient(135deg,#93C5FD,#A78BFA)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 15, fontWeight: 700, color: "#fff",
              }}>A</div>
              <div>
                <p style={{ color: "#fff", fontWeight: 600, fontSize: 13, margin: 0 }}>Alex Johnson</p>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, margin: 0 }}>Verified Customer</p>
              </div>
            </div>
          </div>
        </div>
        <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", background: "rgba(255,255,255,0.05)", top: -60, right: -60 }} />
        <div style={{ position: "absolute", width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.06)", bottom: 60, left: -40 }} />
      </div>

      {/* Right form panel */}
      <div style={rightPanel}>
        <div style={formCard}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#111", margin: "0 0 6px" }}>Create your account</h2>
          <p style={{ fontSize: 14, color: "#6B7280", margin: "0 0 26px" }}>
            Already have an account?{" "}
            <button onClick={onGoToLogin} style={linkBtn}>Sign in</button>
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Name row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field id="firstName" label="First Name" value={form.firstName}
                  error={errors.firstName} onChange={set("firstName")} placeholder="Jane" />
                <Field id="lastName" label="Last Name" value={form.lastName}
                  error={errors.lastName} onChange={set("lastName")} placeholder="Doe" />
              </div>

              {/* Email */}
              <Field id="signup-email" label="Email Address" type="email"
                value={form.email} error={errors.email}
                onChange={set("email")} placeholder="jane@example.com" />

              {/* Password */}
              <div>
                <label htmlFor="signup-password" style={labelStyle}>Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => set("password")(e.target.value)}
                    placeholder="Min. 8 characters"
                    style={{ ...inputStyle, paddingRight: 44, ...(errors.password ? errorBorder : {}) }}
                    onFocus={(e) => { e.target.style.borderColor = "#3B5BDB"; e.target.style.boxShadow = "0 0 0 3px rgba(59,91,219,0.1)"; }}
                    onBlur={(e) => { e.target.style.borderColor = errors.password ? "#EF4444" : "#D1D5DB"; e.target.style.boxShadow = "none"; }}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={eyeBtn}>
                    {showPassword ? <EyeOff /> : <EyeOn />}
                  </button>
                </div>
                {errors.password && <span style={errorStyle}>{errors.password}</span>}
                {/* Strength bar */}
                {form.password.length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ display: "flex", gap: 4 }}>
                      {["Weak", "Fair", "Good", "Strong"].map((label, i) => (
                        <div key={label} style={{
                          flex: 1, height: 4, borderRadius: 4,
                          background: i < strength.score ? strength.color : "#E5E7EB",
                          transition: "background 0.2s",
                        }} />
                      ))}
                    </div>
                    <span style={{ fontSize: 11, color: strength.color, fontWeight: 600, marginTop: 4, display: "block" }}>
                      {strength.label}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="signup-confirm" style={labelStyle}>Confirm Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    id="signup-confirm"
                    type={showConfirm ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={(e) => set("confirmPassword")(e.target.value)}
                    placeholder="Re-enter password"
                    style={{ ...inputStyle, paddingRight: 44, ...(errors.confirmPassword ? errorBorder : {}) }}
                    onFocus={(e) => { e.target.style.borderColor = "#3B5BDB"; e.target.style.boxShadow = "0 0 0 3px rgba(59,91,219,0.1)"; }}
                    onBlur={(e) => { e.target.style.borderColor = errors.confirmPassword ? "#EF4444" : "#D1D5DB"; e.target.style.boxShadow = "none"; }}
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={eyeBtn}>
                    {showConfirm ? <EyeOff /> : <EyeOn />}
                  </button>
                </div>
                {errors.confirmPassword && <span style={errorStyle}>{errors.confirmPassword}</span>}
              </div>

              {/* Terms */}
              <div>
                <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    style={{ width: 16, height: 16, marginTop: 2, accentColor: "#3B5BDB", flexShrink: 0 }}
                  />
                  <span style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.5 }}>
                    I agree to the{" "}
                    <button type="button" style={linkBtn}>Terms of Service</button>
                    {" "}and{" "}
                    <button type="button" style={linkBtn}>Privacy Policy</button>
                  </span>
                </label>
                {errors.terms && <span style={{ ...errorStyle, marginTop: 6 }}>{errors.terms}</span>}
              </div>
            </div>

            <button type="submit" disabled={loading} style={{ ...submitBtn(loading), marginTop: 24 }}>
              {loading ? <Spinner /> : "Create Account →"}
            </button>
          </form>

          {/* Divider + social */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "22px 0 16px" }}>
            <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
            <span style={{ fontSize: 12, color: "#9CA3AF" }}>or sign up with</span>
            <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <SocialBtn label="Google" icon={
              <svg width="16" height="16" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.2l6.7-6.7C35.8 2.5 30.2 0 24 0 14.7 0 6.7 5.5 2.9 13.5l7.8 6.1C12.6 13.3 17.9 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.5 24.5c0-1.7-.2-3.3-.5-4.8H24v9.1h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.3z" />
                <path fill="#FBBC05" d="M10.7 28.4c-.5-1.5-.8-3.1-.8-4.8s.3-3.3.8-4.8L2.9 12.7C1.1 16.1 0 19.9 0 24s1.1 7.9 2.9 11.3l7.8-6.9z" />
                <path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.5-5.8c-2.1 1.4-4.7 2.2-7.7 2.2-6.1 0-11.4-3.8-13.3-9.2l-7.8 6.1C6.7 42.5 14.7 48 24 48z" />
              </svg>
            } />
            <SocialBtn label="Apple" icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#111">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
            } />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Password strength helper ── */
function getPasswordStrength(pwd) {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  const map = [
    { score: 1, label: "Weak", color: "#EF4444" },
    { score: 2, label: "Fair", color: "#F59E0B" },
    { score: 3, label: "Good", color: "#3B82F6" },
    { score: 4, label: "Strong", color: "#16A34A" },
  ];
  return map[score - 1] || { score: 0, label: "", color: "#E5E7EB" };
}

/* ── Shared sub-components ── */
function SocialBtn({ label, icon }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button type="button"
      onMouseOver={() => setHovered(true)} onMouseOut={() => setHovered(false)}
      style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        padding: "10px 0", border: "1px solid", borderRadius: 9,
        background: hovered ? "#F9FAFB" : "#fff", cursor: "pointer",
        fontSize: 13, fontWeight: 500, color: "#374151",
        borderColor: hovered ? "#9CA3AF" : "#D1D5DB",
        transition: "background 0.15s, border-color 0.15s",
      }}
    >{icon} {label}</button>
  );
}

function Field({ id, label, type = "text", value, error, onChange, placeholder }) {
  return (
    <div>
      <label htmlFor={id} style={labelStyle}>{label}</label>
      <input id={id} type={type} value={value} placeholder={placeholder}
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
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
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
const pageWrap = { display: "flex", minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif" };
const leftPanel = {
  flex: "0 0 420px", background: "linear-gradient(145deg, #4F46E5 0%, #6D28D9 60%, #7C3AED 100%)",
  padding: "48px 48px", display: "flex", flexDirection: "column", justifyContent: "center",
  position: "relative", overflow: "hidden",
};
const rightPanel = {
  flex: 1, background: "#F8F9FA", display: "flex",
  alignItems: "center", justifyContent: "center", padding: "40px 24px", overflowY: "auto",
};
const formCard = {
  background: "#fff", borderRadius: 20, padding: "36px 40px",
  width: "100%", maxWidth: 480, boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
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
  background: loading ? "#93C5FD" : "linear-gradient(135deg, #4F46E5, #6D28D9)",
  color: "#fff", border: "none", borderRadius: 10,
  fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
  letterSpacing: 0.3, boxShadow: "0 4px 14px rgba(79,70,229,0.3)",
  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
});
