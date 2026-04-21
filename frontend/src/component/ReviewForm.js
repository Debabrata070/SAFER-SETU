import { useState } from "react";
import { API_BASE_URL } from "../config/apiBase.js";




function ReviewForm({ hotelId,reviews, onReviewAdded }) {
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const user =JSON.parse(sessionStorage.getItem("user"));
  const alreadyReviewed =
   user &&
   reviews?.length > 0 &&
   reviews.some(
    (r) =>
      (r.userId?._id || r.userId) === user._id
   );

  const handleSubmit = async () => {
  try {
  const token = sessionStorage.getItem("token");

    const res = await fetch(`${API_BASE_URL}/api/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        hotelId,
        rating,
        text,
      }),
    });

    const data = await res.json();
    console.log("Review response:", data);

    setText("");
await onReviewAdded();

  } catch (err) {
    console.error(err);
    alert("Review failed");
  }
};

 

  return (
    <div className="flex gap-2 items-center mb-4">

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write review..."
        className="border p-2 flex-1 rounded"
      />

      <select value={rating} onChange={(e) => setRating(e.target.value)}>
        {[1,2,3,4,5].map(n => (
          <option key={n}>{n}</option>
        ))}
      </select>

      <button
        onClick={handleSubmit} disabled={alreadyReviewed}
        className="text-white rounded"
      >
        {alreadyReviewed ? "Already Reviewed" : "Add"}
      </button>

    </div>
  );
}

export default ReviewForm;
