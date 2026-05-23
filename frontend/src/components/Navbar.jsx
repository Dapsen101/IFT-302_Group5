import { useState } from "react";
import { NAV_LINKS } from "../data";

const CART_PATH = "M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6";
const ORDERS_PATH = "M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18";
const SAVED_PATH = "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z";

export default function Navbar({ searchQuery, onSearchChange, cartCount, onCartClick, onSignInClick, user, onLogout, onNavigate }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(document.documentElement.getAttribute("data-theme") === "dark");

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem('theme', 'light');
    }
  };

  // Initials avatar color derived from name
  const initials = user
    ? user.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "";

  return (
    <header style={{
      background: "var(--bg-nav)",
      borderBottom: "1px solid var(--border-main)",
      position: "sticky", top: 0, zIndex: 100,
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto", padding: "12px 20px",
        display: "flex", alignItems: "center", gap: 20,
      }}>
        {/* Logo */}
        <div onClick={() => onNavigate("shop")} style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 140, cursor: "pointer" }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8, background: "var(--accent)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d={ORDERS_PATH} />
              <line x1="3" y1="6" x2="21" y2="6" />
            </svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: 18, color: "var(--text-main)" }}>
            Group<span style={{ color: "var(--accent)" }}>Five</span>
          </span>
        </div>

        {/* Search */}
        <div style={{ flex: 1, display: "flex", maxWidth: 500 }}>
          <input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search Product"
            style={{
              flex: 1, padding: "9px 14px", border: "1px solid var(--border-main)",
              borderRight: "none", borderRadius: "6px 0 0 6px",
              fontSize: 14, outline: "none", background: 'var(--bg-input)', color: 'var(--text-main)'
            }}
          />
          <button style={{
            padding: "9px 18px", background: "var(--accent)", color: "var(--accent-foreground)",
            border: "none", borderRadius: "0 6px 6px 0",
            fontWeight: 600, fontSize: 14, cursor: "pointer",
          }}>
            Search
          </button>
        </div>

        {/* Icon area */}
        <div style={{ display: "flex", gap: 20, marginLeft: "auto", alignItems: "center" }}>

          {/* Theme Toggle */}
          <button type="button" onClick={toggleDarkMode} style={iconBtnStyle}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="1.8">
              {isDarkMode ? (
                <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              ) : (
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              )}
            </svg>
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{isDarkMode ? "Light" : "Dark"}</span>
          </button>

          {/* Orders */}
          <NavIconBtn label="Orders" path={ORDERS_PATH} onClick={() => onNavigate("orders")} />

          {/* Saved */}
          <NavIconBtn label="Saved" path={SAVED_PATH} onClick={() => onNavigate("wishlist")} />

          {/* Cart */}
          <button type="button" onClick={onCartClick} style={iconBtnStyle}>
            <div style={{ position: "relative" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="1.8">
                <path d={CART_PATH} />
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
              </svg>
              {cartCount > 0 && (
                <span style={{
                  position: "absolute", top: -6, right: -8,
                  minWidth: 18, height: 18, borderRadius: 9,
                  background: "#EF4444", color: "#fff",
                  fontSize: 11, fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  padding: "0 4px",
                }}>
                  {cartCount}
                </span>
              )}
            </div>
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>My cart</span>
          </button>

          {/* Sign in / User avatar */}
          {!user ? (
            <button
              type="button"
              onClick={onSignInClick}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                background: "none", border: "none", cursor: "pointer",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="1.8">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
              </svg>
              <span style={{ fontSize: 11, color: "#6B7280" }}>Sign in</span>
            </button>
          ) : (
            /* Avatar dropdown */
            <div style={{ position: "relative" }}>
              <button
                type="button"
                onClick={() => setDropdownOpen((v) => !v)}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  background: "none", border: "none", cursor: "pointer",
                }}
              >
                <div style={{
                  width: 34, height: 34, borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--accent), #6D28D9)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--accent-foreground)", fontWeight: 700, fontSize: 13, flexShrink: 0,
                }}>
                  {initials}
                </div>
                <div style={{ textAlign: "left", lineHeight: 1.3 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-main)", margin: 0 }}>
                    {user.name.split(" ")[0]}
                  </p>
                  <p style={{ fontSize: 11, color: "var(--text-muted-light)", margin: 0 }}>Account</p>
                </div>
                <svg
                  width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="var(--text-muted-light)" strokeWidth="2"
                  style={{ transform: dropdownOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {dropdownOpen && (
                <div style={{
                  position: "absolute", top: "calc(100% + 8px)", right: 0,
                  background: "var(--bg-card)", border: "1px solid var(--border-main)", borderRadius: 12,
                  boxShadow: "var(--shadow-lg)",
                  minWidth: 210, padding: "8px 0", zIndex: 200,
                }}>
                  {/* User info header */}
                  <div style={{ padding: "12px 16px 10px", borderBottom: "1px solid var(--border-light)" }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-main)", margin: 0 }}>{user.name}</p>
                    <p style={{ fontSize: 12, color: "var(--text-muted-light)", margin: "2px 0 0" }}>{user.email}</p>
                  </div>

                  {[
                    ["👤", "My Profile", "profile"],
                    ["📦", "My Orders", "orders"],
                    ["❤️", "Wishlist", "wishlist"],
                    ["⚙️", "Settings", "settings"],
                  ].map(([icon, label, route]) => (
                    <button key={label} type="button" style={dropdownItem}
                      onClick={() => { setDropdownOpen(false); onNavigate(route); }}
                      onMouseOver={(e) => e.currentTarget.style.background = "var(--bg-hover)"}
                      onMouseOut={(e) => e.currentTarget.style.background = "none"}
                    >
                      <span>{icon}</span> {label}
                    </button>
                  ))}

                  <div style={{ borderTop: "1px solid var(--border-light)", marginTop: 4 }} />
                  <button
                    type="button"
                    onClick={() => { setDropdownOpen(false); onLogout(); }}
                    style={{ ...dropdownItem, color: "var(--danger)" }}
                    onMouseOver={(e) => e.currentTarget.style.background = "rgba(250,230,230,0.6)"}
                    onMouseOut={(e) => e.currentTarget.style.background = "none"}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Sign out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Nav Links */}
      <div style={{ borderTop: "1px solid #F3F4F6" }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto", padding: "0 20px",
          display: "flex", alignItems: "center", gap: 4,
        }}>
          <button style={{
            padding: "10px 14px", border: "none", background: "none",
            cursor: "pointer", fontSize: 14, color: "var(--text-strong)",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            ☰ All categories
          </button>
          {NAV_LINKS.map((link) => (
            <button key={link} style={{
              padding: "10px 14px", border: "none", background: "none",
              cursor: "pointer", fontSize: 14, color: "var(--text-strong)",
            }}>
              {link}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

function NavIconBtn({ label, path, onClick }) {
  return (
    <button type="button" onClick={onClick} style={iconBtnStyle}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text-strong)" strokeWidth="1.8">
        <path d={path} />
      </svg>
      <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{label}</span>
    </button>
  );
}

const iconBtnStyle = {
  background: "none", border: "none", cursor: "pointer",
  display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
};

const dropdownItem = {
  width: "100%", padding: "10px 16px",
  background: "none", border: "none", cursor: "pointer",
  display: "flex", alignItems: "center", gap: 10,
  fontSize: 13, color: "var(--text-strong)", textAlign: "left",
  transition: "background 0.1s",
};
