 import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Hotels from "./pages/hotel";
import HotelDetails from "./pages/hoteldetail";   // 👈 IMPORTANT
import Booking from "./pages/Booking";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import BookingDetails from "./pages/BookingDetails"
import Wishlist from "./pages/Wishlist";
import SuccessPage from "./pages/SuccessPage"; // ✅ NEW
import PaymentPage  from "./pages/PaymentPage";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hotels" element={<Hotels />} />
       { /* 👇 Hotel Detail Page (Dynamic ID) */}
        <Route path="/hotel/:id" element={<HotelDetails />} />

        {/* Booking */}
        <Route path="/booking/:id" element={<Booking />} />
        {/* Login */}
        <Route path="/login" element={<Login />} />
        {/* Register */}
        <Route path="/register" element={<Register />} />
        {/* Profile */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/success/:id" element={<SuccessPage />} />
        {/* paymentpage details */}
        <Route path="/payment/:id" element={<PaymentPage />} />
        <Route path="/wishlist" element={<Wishlist />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;