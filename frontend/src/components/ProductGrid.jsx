import { useEffect, useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import Pagination from "./Pagnation";

const SORT_OPTIONS = ["Best match", "Price: Low to High", "Price: High to Low", "Newest first"];

export default function ProductGrid({ products, currentPage, pageSize, onPageChange, onAddToCart }) {
  const [sortBy, setSortBy] = useState("Best match");
  const [view, setView] = useState("grid");

  const sortedProducts = useMemo(() => {
    const list = [...products];
    if (sortBy === "Price: Low to High") return list.sort((a, b) => a.price - b.price);
    if (sortBy === "Price: High to Low") return list.sort((a, b) => b.price - a.price);
    if (sortBy === "Newest first") return list.sort((a, b) => b.id - a.id);
    return list;
  }, [products, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / pageSize));
  const currentProducts = useMemo(
    () => sortedProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [sortedProducts, currentPage, pageSize]
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      onPageChange(totalPages);
    }
  }, [currentPage, onPageChange, totalPages]);

  return (
    <div style={{ flex: 1 }}>
      {/* Toolbar */}
      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: 16,
      }}>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            padding: "8px 12px", border: "1px solid #D1D5DB",
            borderRadius: 6, fontSize: 14, background: "#fff", color: "black", cursor: "pointer",
          }}
        >
          {SORT_OPTIONS.map((o) => <option key={o}>{o}</option>)}
        </select>

        <div style={{ display: "flex", gap: 4 }}>
          {["grid", "list"].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              type="button"
              style={{
                width: 34, height: 34, border: "1px solid #D1D5DB",
                borderRadius: 6,
                background: view === v ? "#3B5BDB" : "#fff",
                color: view === v ? "#fff" : "#6B7280",
                cursor: "pointer", fontSize: 16,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              {v === "grid" ? "⊞" : "☰"}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: view === "grid" 
          ? "repeat(auto-fill, minmax(160px, 1fr))" 
          : "1fr",
        gap: 16,
      }}>
        {currentProducts.map((product) => (
          <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}
