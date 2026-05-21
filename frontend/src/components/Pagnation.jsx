export default function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between",
      alignItems: "center", marginTop: 24, paddingBottom: 24,
    }}>
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        style={{
          padding: "8px 16px", border: "1px solid #D1D5DB",
          borderRadius: 6, background: currentPage === 1 ? "#F9FAFB" : "#fff",
          fontSize: 13, cursor: currentPage === 1 ? "not-allowed" : "pointer",
        }}>
        « Prev
      </button>

      <div style={{ display: "flex", gap: 4 }}>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            style={{
              width: 36, height: 36, border: "1px solid #D1D5DB",
              borderRadius: 6,
              background: currentPage === p ? "#3B5BDB" : "#fff",
              color: currentPage === p ? "#fff" : "#374151",
              fontWeight: currentPage === p ? 700 : 400,
              fontSize: 13, cursor: "pointer",
            }}
          >
            {p}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        style={{
          padding: "8px 16px", border: "1px solid #D1D5DB",
          borderRadius: 6, background: currentPage === totalPages ? "#F9FAFB" : "#fff",
          fontSize: 13, cursor: currentPage === totalPages ? "not-allowed" : "pointer",
        }}>
        Next »
      </button>
    </div>
  );
}
