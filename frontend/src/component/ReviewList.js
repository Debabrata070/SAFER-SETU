 function ReviewList({ reviews }) {
  return (
    <div className="mt-4 space-y-2">
      {reviews.map((r) => (
        <div key={r._id} className="border p-2 rounded">
          <p><b>{r.userId?.name}</b></p>  {/* ✅ username */}

          <p>⭐ {r.rating}</p>
          <p>{typeof r.text === "string" ? r.text : JSON.stringify(r.text)}</p>
        </div>
      ))}
    </div>
  );
}

export default ReviewList;