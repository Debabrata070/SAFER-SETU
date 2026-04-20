 import { useNavigate } from "react-router-dom";
import { toggleWishlist } from "../services/authService";
import { isLoggedIn } from "../utils/auth";
import { getImageUrl } from "../config/apiBase.js";

function HotelCard({ hotel, wishlist=[], setWishlist }) {
  const navigate = useNavigate();
  const handleClick = () => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      navigate("/login", {
        state: { from: `/hotel/${hotel._id}` },
      });
    } else {
      navigate(`/hotel/${hotel._id}`);
    }
  };

  const liked = Array.isArray(wishlist) && 
               wishlist.map(String).includes(String(hotel._id));

  const handleWishlist = async () => {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }

    const updated = await toggleWishlist(hotel._id);

     if (setWishlist) {
    const ids = Array.isArray(updated)
      ? updated.map((id) => (id && id._id != null ? id._id : id))
      : [];
    setWishlist(ids);
  }
  };

  const getImageSrc = (img) => getImageUrl(img);
 return (
  <div
    className="
      cursor-pointer
      shadow-lg
      rounded-lg
      p-3
      bg-gray-100
      hover:shadow-xl
      transition
      duration-300
      w-full
      sm:w-[300px]
      md:w-[320px]
      lg:w-[340px]
      min-h-[400px]
      flex
      flex-col
      justify-between
    "
  >
    <div className="relative h-48 overflow-hidden rounded-lg">
      <img
        src={getImageSrc(hotel.images?.[0])}
        alt={hotel.name}
        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
      />

      <p className="absolute top-2 left-2 bg-gray-800 text-white font-bold py-1 px-2 rounded-xl text-xs sm:text-sm">
        ₹{hotel.pricePerNight}/per night
      </p>

      <p className="absolute bottom-2 right-2 bg-gray-800 text-white font-bold py-1 px-2 rounded-xl text-xs sm:text-sm">
        {hotel.type} type
      </p>
    </div>

    <div className="mt-3 flex-grow">
      <h2 className="font-bold text-lg truncate">{hotel.name}</h2>
      <p className="text-gray-700">{hotel.district}</p>

      <div className="mt-2">
        <p className="font-medium text-sm sm:text-base">
          <span>Price: </span>₹{hotel.pricePerNight}
        </p>
      </div>

      <div className="flex items-center gap-2 mt-2 flex-wrap">
        <span className="text-yellow-500 font-semibold">
          ⭐ {(hotel.averageRating ?? hotel.rating ?? 0).toFixed(1)}
        </span>
        <span className="text-gray-500 text-sm">
          ({hotel.totalReviews ?? hotel.ratingCount ?? 0} reviews)
        </span>
      </div>
    </div>

    <div className="mt-2 flex justify-between items-center gap-2">
      <button
        onClick={handleWishlist}
        className={`
          px-3 py-2 rounded text-sm sm:text-base whitespace-nowrap
          ${
            liked
              ? "bg-red-500 text-white"
              : "bg-gray-200 text-black"
          }
        `}
      >
        {liked ? "❤️ Added" : "🤍 Wishlist"}
      </button>

      <button
        onClick={handleClick}
        className="
          bg-blue-500
          text-white
          py-2
          px-4
          rounded
          hover:bg-blue-600 scale-104
          transition
          text-sm
          sm:text-base
          whitespace-nowrap
        "
      >
        View Details
      </button>
    </div>
  </div>
);

 }
export default HotelCard;