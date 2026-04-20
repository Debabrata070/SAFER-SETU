import { useLocation } from "react-router-dom";
import { useState,useEffect } from "react";
import Hotelnav from "../component/filters/Hotelnav";
import FilterSidebar from "../component/filters/Hotelfilters";
import HotelCard from "../component/HotelCard";
import { searchHotels } from "../services/hotelservice";
import { isLoggedIn } from "../utils/auth";
import { getWishlist } from "../services/authService";
import Footer from "../component/footer";
function Hotels() {
  const location = useLocation();
  const [hotels, setHotels] = useState(() =>
    Array.isArray(location.state) ? location.state : []
  );
  const [wishlist, setWishlist] = useState([]);
  const [filters, setFilters] = useState({
    district: "",
    minPrice: "",
    maxPrice: "",
    rating: "",
    amenities: [],
  });
  const [visibleCount, setVisibleCount] = useState(6);

   const loadMoreHotels = () => {
  setVisibleCount((prev) => prev + 6);
   };
  useEffect(() => {
  fetchAllHotels();
}, [location.search]);

  const fetchAllHotels = async () => {
    try {
    const params = new URLSearchParams(location.search);

    const filters = {
      district: params.get("district"),
    };

    const data = await searchHotels(filters);
    setHotels(Array.isArray(data) ? data : []);

    if (isLoggedIn()) {
        const wishData = await getWishlist();
        const list = Array.isArray(wishData) ? wishData : [];
        setWishlist(
          list.map((h) => (h && h._id != null ? h._id : h)).filter(Boolean)
        );
    }
    } catch (err) {
      console.error(err);
    }
  };

  const applyFilters = async () => {
    try {
    const params = new URLSearchParams(location.search);
    const districtFromURL = params.get("district");

    const finalFilters = {
      ...filters,
      district: districtFromURL || filters.district,
    };

    Object.keys(finalFilters).forEach((key) => {
      const v = finalFilters[key];
      if (v === "" || v == null) {
        delete finalFilters[key];
      } else if (
        key === "amenities" &&
        Array.isArray(v) &&
        v.length === 0
      ) {
        delete finalFilters[key];
      }
    });

    const data = await searchHotels(finalFilters);
    setHotels(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error(err);
  }
  };

  return (
  <>
    <div className="fixed top-0 right-0 left-0 z-50 bg-white shadow-md h-16">
      <Hotelnav />
    </div>

    <div className="pt-20 mt-7 px-4 max-w-7xl mx-auto min-h-screen">

      <div className="flex flex-col lg:flex-row gap-6">

        <div className="
          w-full
          lg:w-1/4
          lg:sticky
          lg:top-29
          self-start
          bg-white
          z-10
        ">
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            applyFilters={applyFilters}
          />
        </div>

        <div className="w-full lg:w-3/4 mt-4">

          <div className="flex flex-wrap justify-center gap-6">
            {hotels.length > 0 ? (
              hotels.slice(0, visibleCount).map((hotel) => (
                <HotelCard
                  key={hotel._id}
                  hotel={hotel}
                  wishlist={wishlist}
                  setWishlist={setWishlist}
                />
              ))
            ) : (
              <p className="text-gray-500 text-center w-full">
                No hotels found
              </p>
            )}
          </div>

          {visibleCount < hotels.length && (
            <div className="flex justify-center mt-8">
              <button
                onClick={loadMoreHotels}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Show More ↓
              </button>
            </div>
          )}

        </div>
      </div>
    </div>

    <Footer />
  
  </>
);
}

export default Hotels;