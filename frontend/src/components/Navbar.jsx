import { useState } from "react";
import { NAV_LINKS } from "../data";

const NAV_ICONS = [
  {
    label: "Orders",
    path: "M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18",
  },
  {
    label: "Saved",
    path: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
  },
  {
    label: "My cart",
    path: "M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6",
  },
  {
    label: "Sign in",
    path: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
  },
];

export default function Navbar({ searchQuery, onSearchChange, cartCount }) {
  return (
    <header style={{
      background: "#fff",
      borderBottom: "1px solid #E5E7EB",
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto", padding: "12px 20px",
        display: "flex", alignItems: "center", gap: 20,
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 140 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8, background: "#3B5BDB",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
            </svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: 18 }}>
            Group<span style={{ color: "#3B5BDB" }}>Five</span>
          </span>
        </div>

        {/* Search */}
        <div style={{ flex: 1, display: "flex", maxWidth: 500 }}>
          <input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search Product"
            style={{
              flex: 1, padding: "9px 14px", border: "1px solid #D1D5DB",
              borderRight: "none", borderRadius: "6px 0 0 6px",
              fontSize: 14, outline: "none",
            }}
          />
          <button style={{
            padding: "9px 18px", background: "#3B5BDB", color: "#fff",
            border: "none", borderRadius: "0 6px 6px 0",
            fontWeight: 600, fontSize: 14, cursor: "pointer",
          }}>
            Search
          </button>
        </div>

        {/* Icon Buttons */}
        <div style={{ display: "flex", gap: 24, marginLeft: "auto" }}>
          {NAV_ICONS.map(({ label, path }) => (
            <button key={label} type="button" style={{
              position: "relative",
              background: "none", border: "none", cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="1.8">
                <path d={path} />
              </svg>
              {label === "My cart" && cartCount > 0 && (
                <span style={{
                  position: "absolute", top: -5, right: -10,
                  minWidth: 18, height: 18, borderRadius: 9,
                  background: "#EF4444", color: "#fff",
                  fontSize: 11, fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  padding: "0 6px",
                }}>
                  {cartCount}
                </span>
              )}
              <span style={{ fontSize: 11, color: "#6B7280" }}>{label}</span>
            </button>
          ))}
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
            cursor: "pointer", fontSize: 14, color: "#374151",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            ☰ All categories
          </button>
          {NAV_LINKS.map((link) => (
            <button key={link} style={{
              padding: "10px 14px", border: "none", background: "none",
              cursor: "pointer", fontSize: 14, color: "#374151",
            }}>
              {link}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
