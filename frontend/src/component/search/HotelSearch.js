import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchHotels } from "../../services/hotelservice";

function HotelSearch() {
  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState({
    district: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
    try {
      if (!form.district.trim()) {
        alert("Please enter a district");
        return;
      }

      setLoading(true);

      await searchHotels(form);

       navigate(`/hotels?district=${form.district}`);

    } catch (error) {
      alert("Failed to fetch hotels");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div
    className="
      grid
      grid-cols-1
      sm:grid-cols-2
      lg:grid-cols-4
      gap-4
      w-full
      p-4
    "
  >
    <div className="border p-3 rounded-lg w-full">
      <p className="text-xs text-gray-400 mb-1">District</p>
      <input
        name="district"
        value={form.district}
        onChange={handleChange}
        placeholder="Goa"
        className="
          outline-none
          font-semibold
          w-full
          text-sm
          sm:text-base
          min-w-0
        "
      />
    </div>

    <div className="border p-3 rounded-lg w-full">
      <p className="text-xs text-gray-400 mb-1">Check In</p>
      <input
        type="date"
        min={today}
        className="
          outline-none
          font-semibold
          w-full
          text-sm
          sm:text-base
        "
      />
    </div>

    <div className="border p-3 rounded-lg w-full">
      <p className="text-xs text-gray-400 mb-1">Check Out</p>
      <input
        type="date"
        min={today}
        className="
          outline-none
          font-semibold
          w-full
          text-sm
          sm:text-base
        "
      />
    </div>

    <button
      className="
        font-semibold
        w-full
        text-white
        rounded-lg
        text-sm
        sm:text-base
        min-h-[52px]
      "
      type="button"
      onClick={handleSearch}
      disabled={loading}
    >
      {loading ? "Searching..." : "Search"}
    </button>
  </div>
);
}

export default HotelSearch;
