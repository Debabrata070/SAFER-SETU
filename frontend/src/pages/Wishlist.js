 import { useEffect, useState } from "react";
import { getWishlist } from "../services/authService";
import HotelCard from "../component/HotelCard";

const Wishlist = () => {
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    const fetchWishlist = async () => {
      const data = await getWishlist();
      setHotels(data);
    };

    fetchWishlist();
  }, []);

  return (
    <div className="p-6">
      <div className="shadow-lg p-4 relative rounded-xl border border-blue-100 bg-white">
        <div>
           <h1 className="text-xl font-bold mb-4  ">❤️ My Wishlist</h1>
        </div>
       
        <div className="absolute right-2 top-4">
         <svg
      width="160"
      height="50"
      viewBox="0 0 160 50"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Icon */}
      <g transform="translate(0,5)">
        <circle cx="25" cy="20" r="18" fill="#3B82F6" />

        <path
          d="M5 28 C18 5, 32 5, 45 20"
          stroke="white"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />

        <polygon
          points="28,10 42,16 28,20 32,26 24,20 12,22"
          fill="white"
        />
      </g>

      {/* Text */}
      <text
        x="50"
        y="31"
        fontFamily="Poppins, Arial, sans-serif"
        fontSize="20"
        fontWeight="600"
        fill="#3B82F6"
        display="flex"
      >
       SafarSetu
      </text>
       </svg> 
           </div>
      </div>
      

      {hotels.length === 0 ? (
        <p>No items in wishlist</p>
      ) : (
        <div className="grid grid-cols-3 gap-4 mt-2">
          {hotels.map((hotel) => (
            <HotelCard key={hotel._id} hotel={hotel} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
