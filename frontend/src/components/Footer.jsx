import { FOOTER_LINKS } from "../data";

export default function Footer() {
  return (
    <footer style={{
      background: "var(--bg-nav)",
      borderTop: "3px solid var(--accent)",
      marginTop: 20,
      padding: "40px 20px 20px",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{
          display: "flex", justifyContent: "space-between",
          gap: 24, flexWrap: "wrap", marginBottom: 32,
        }}>
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h4 style={{ fontWeight: 700, fontSize: 14, margin: "0 0 12px", color: "var(--text-main)" }}>
                {section}
              </h4>
              {links.map((link) => (
                <p key={link} style={{ margin: "0 0 6px", fontSize: 13 }}>
                  <a href="#" style={{ color: "var(--accent)", textDecoration: "none" }}>
                    {link}
                  </a>
                </p>
              ))}
            </div>
          ))}
        </div>

        <div style={{
          borderTop: "1px solid var(--border-main)", paddingTop: 16,
          textAlign: "center", fontSize: 13, color: "var(--text-muted)",
        }}>
          Copyright © 2026 Group-Five. All Rights Reserved
        </div>
      </div>
    </footer>
  );
}
