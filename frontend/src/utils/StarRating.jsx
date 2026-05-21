export default function StarRating({ rating }) {
  return (
    <span style={{ display: "inline-flex", gap: 1 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width="12" height="12" viewBox="0 0 12 12">
          <polygon
            points="6,1 7.5,4.5 11,5 8.5,7.5 9.2,11 6,9.3 2.8,11 3.5,7.5 1,5 4.5,4.5"
            fill={s <= Math.floor(rating) ? "#F5A623" : s - 0.5 <= rating ? "#F5A623" : "#D1D5DB"}
            stroke="#F5A623"
            strokeWidth="0.3"
          />
        </svg>
      ))}
    </span>
  );
}
