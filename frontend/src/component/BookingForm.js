 import { useState,useEffect } from "react";
 import { useNavigate } from "react-router-dom";
 import axios from "axios";
import { getUser } from "../utils/auth";

import { createBooking } from "../services/bookingService";

/* const handleProceedPayment = async () => {
  try {
    const res = await axios.post("http://localhost:5000/api/bookings", bookingData);

    const bookingId = res.data._id;

    // 👉 Redirect to payment page
    navigate(`/payment/${bookingId}`);
  } catch (err) {
    console.log(err);
  }
}; */
const BookingForm = ({ hotel }) => {
   const navigate=useNavigate();
   const user = getUser();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
    rooms: 1,
    specialRequests: "",
  });

   useEffect(() => {
  if (user) {
    setForm((prev) => ({
      ...prev,
      name: user.name || "",
      email: user.email || "",
    }));
  }
}, []);

  const [nights, setNights] = useState(1);

  // Handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Calculate nights
  const calculateNights = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 1;

    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    if (isNaN(inDate) || isNaN(outDate)) return 1;
    const diff = (outDate - inDate) / (1000 * 60 * 60 * 24);
    return diff > 0 ? diff : 1;
  };

  // Update nights when date changes
  const handleDateChange = (e) => {
    const updated = { ...form, [e.target.name]: e.target.value };
    setForm(updated);

    const nightsCount = calculateNights(
      updated.checkIn,
      updated.checkOut
    );
    setNights(nightsCount);
  };

  // Total price
  //const totalPrice = nights * hotel.price;
  const totalPrice = nights *(Number(form.rooms) || 1) * (hotel?.pricePerNight ? Number(hotel.pricePerNight) : 0);

  // Submit booking
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!user) {
  alert("Please login first");
  navigate("/login");
  return;
}
  const bookingData = {
    ...form,
    hotelId: hotel._id,
    hotelName: hotel.name,
    totalPrice,
    nights,
  };

  try {
    const res = await createBooking(bookingData);

    console.log("BOOKING RESPONSE:", res);

    // ✅ get correct id
    const bookingId = res.data?._id || res._id;

    if (!bookingId) {
      alert("Booking saved but ID missing ❌");
      return;
    }

    alert("Booking Successful ✅");

    // ✅ REDIRECT
    navigate(`/payment/${bookingId}`);

  } catch (err) {
    console.log(err);
    alert("Booking Failed ❌");
  }
};

 return (
  <div
    className="
      bg-white
      p-4 sm:p-5 md:p-6
      rounded-xl
      shadow-md
      w-full
      max-w-full
      sm:max-w-lg
      lg:max-w-md
      mx-auto
    "
  >
    <h2 className="text-lg sm:text-xl font-bold mb-4">
      Guest Details:
    </h2>

    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
    >
      {/* Name */}
      <div>
        <label className="text-sm font-medium">Full Name *</label>
        <input
          type="text"
          name="name"
          value={form.name}
          className="
            w-full
            border
            p-2
            sm:p-3
            rounded
            mt-1
            bg-gray-100
            text-sm
            sm:text-base
          "
          readOnly
        />
      </div>

      {/* Email */}
      <div>
        <label className="text-sm font-medium">Email *</label>
        <input
          type="email"
          name="email"
          value={form.email}
          className="
            w-full
            border
            p-2
            sm:p-3
            rounded
            mt-1
            bg-gray-100
            text-sm
            sm:text-base
          "
          readOnly
        />
      </div>

      {/* Phone */}
      <div>
        <label className="text-sm font-medium">Phone *</label>
        <input
          type="text"
          name="phone"
          placeholder="Enter your phone number"
          className="
            w-full
            border
            p-2
            sm:p-3
            rounded
            mt-1
            text-sm
            sm:text-base
          "
          onChange={handleChange}
          required
        />
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium">Check-in *</label>
          <input
            type="date"
            name="checkIn"
            className="
              w-full
              border
              p-2
              sm:p-3
              rounded
              mt-1
              text-sm
              sm:text-base
            "
            onChange={handleDateChange}
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium">Check-out *</label>
          <input
            type="date"
            name="checkOut"
            className="
              w-full
              border
              p-2
              sm:p-3
              rounded
              mt-1
              text-sm
              sm:text-base
            "
            onChange={handleDateChange}
            required
          />
        </div>
      </div>

      {/* Rooms */}
      <div>
        <label className="text-sm font-medium">Rooms</label>
        <input
          type="number"
          name="rooms"
          min="1"
          value={form.rooms}
          className="
            w-full
            border
            p-2
            sm:p-3
            rounded
            mt-1
            text-sm
            sm:text-base
          "
          onChange={(e) => {
            const rooms = Number(e.target.value);
            setForm({ ...form, rooms });

            if (form.guests > rooms * 3) {
              setForm((prev) => ({
                ...prev,
                rooms,
                guests: rooms * 3,
              }));
            }
          }}
        />
      </div>

      {/* Guests */}
      <div>
        <label className="text-sm font-medium">
          Guests (Max {form.rooms * 3})
        </label>
        <input
          type="number"
          name="guests"
          min="1"
          max={form.rooms * 3}
          value={form.guests}
          className="
            w-full
            border
            p-2
            sm:p-3
            rounded
            mt-1
            text-sm
            sm:text-base
          "
          onChange={(e) => {
            let guests = Number(e.target.value);

            if (guests > form.rooms * 3) {
              alert(`Max ${form.rooms * 3} guests allowed`);
              guests = form.rooms * 3;
            }

            setForm({ ...form, guests });
          }}
        />
      </div>

      {/* Special Requests */}
      <div>
        <label className="text-sm font-medium">
          Special Requests
        </label>
        <textarea
          name="specialRequests"
          placeholder="Any special requests..."
          className="
            w-full
            border
            p-2
            sm:p-3
            rounded
            mt-1
            text-sm
            sm:text-base
            resize-none
          "
          rows="3"
          onChange={handleChange}
        />
      </div>

      {/* Price Box */}
      <div className="bg-gray-100 p-4 rounded-lg text-sm sm:text-base">
        <div className="flex justify-between mb-1">
          <span>Price per night</span>
          <span>₹{hotel.pricePerNight}</span>
        </div>

        <div className="flex justify-between mb-1">
          <span>Nights</span>
          <span>{nights}</span>
        </div>

        <div className="flex justify-between mb-1">
          <span>Guests</span>
          <span>{form.guests}</span>
        </div>

        <hr className="my-2" />

        <div className="flex justify-between font-semibold text-base sm:text-lg">
          <span>Total</span>
          <span>₹{totalPrice}</span>
        </div>
      </div>

      {/* Button */}
      <button
        type="submit"
        className="
          bg-blue-600
          text-white
          py-3
          rounded-lg
          font-medium
          hover:bg-blue-700
          transition
          text-sm
          sm:text-base
          w-full
        "
      >
        Proceed to Payment
      </button>
    </form>
  </div>
);
};

export default BookingForm;