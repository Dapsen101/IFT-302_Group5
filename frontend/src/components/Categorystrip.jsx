import { CATEGORIES } from "../data";

export default function CategoryStrip() {
  return (
    <div style={{ marginBottom: 28 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>
        Electronics & Gadgets
      </h2>
      <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 4 }}>
        {CATEGORIES.map((cat) => (
          <div key={cat.name} style={{
            display: "flex", flexDirection: "column",
            alignItems: "center", gap: 8,
            cursor: "pointer", minWidth: 90,
          }}>
            <div style={{
              width: 80, height: 80,
              background: "#EEF2FF",
              borderRadius: 12,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 32,
            }}>
              {cat.icon}
            </div>
            <span style={{ fontSize: 12, color: "#374151", textAlign: "center" }}>
              {cat.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
