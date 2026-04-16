/* import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";



function HotelSearch() {
  const [form,setForm] = useState({
  city:""
 });

 const navigate = useNavigate();

 const handleChange=(e)=>{
   setForm({...form,[e.target.name]:e.target.value})
 }

 const handleSearch= async ()=>{
    if (!form.city) {
    alert("Please enter a city");
    return;
  }

  const res = await axios.post(
   "http://localhost:5000/api/hotels/search",
   form
  )

  navigate("/hotels",{state:res.data})

 }
  return (
    <div className="grid grid-cols-4 gap-4">

      <div className="border p-3 rounded-lg">
        <p className="text-xs text-gray-400">City</p>
        <div className="flex justify-between items-center">
          <input  name="city"
  value={form.city}
  onChange={handleChange}
  placeholder="Goa"
  className="outline-none font-semibold"/>
          ▼
        </div>
      </div>

      <div className="border p-3 rounded-lg">
        <p className="text-xs text-gray-400">Check In</p>
        <input type="date" className="outline-none font-semibold"/>
      </div>

      <div className="border p-3 rounded-lg">
        <p className="text-xs text-gray-400">Check Out</p>
        <input type="date" className="outline-none font-semibold"/>
      </div>

      <button className="bg-blue-600 text-white rounded-lg font-semibold"  type="button" onClick={handleSearch}>
        Search
      </button>

    </div>
  );
}

export default HotelSearch; */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchHotels } from "../../services/hotelservice";

function HotelSearch() {
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

      // ✅ calling service (NOT axios directly)
      const data = await searchHotels(form);

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
    {/* District */}
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

    {/* Check In */}
    <div className="border p-3 rounded-lg w-full">
      <p className="text-xs text-gray-400 mb-1">Check In</p>
      <input
        type="date"
        className="
          outline-none
          font-semibold
          w-full
          text-sm
          sm:text-base
        "
      />
    </div>

    {/* Check Out */}
    <div className="border p-3 rounded-lg w-full">
      <p className="text-xs text-gray-400 mb-1">Check Out</p>
      <input
        type="date"
        className="
          outline-none
          font-semibold
          w-full
          text-sm
          sm:text-base
        "
      />
    </div>

    {/* Search Button */}
    <button
      className="
        bg-blue-600
        text-white
        rounded-lg
        font-semibold
        p-3
        w-full
        hover:bg-blue-700
        transition
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