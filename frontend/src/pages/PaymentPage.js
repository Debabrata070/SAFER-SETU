import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../config/apiBase.js";
import PaymentForm from "../component/PaymentForm";
import BookingSummary from "../component/BookingSummary";
import Hotelnav from "../component/filters/Hotelnav";
import Footer from "../component/footer";
const PaymentPage = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setError("");
        const res = await fetch(`${API_BASE_URL}/api/bookings/${id}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.error || data?.message || "Failed to load booking");
        }
        setBooking(data);
      } catch (e) {
        setError(e.message || "Failed to load booking");
      }
    };
    fetchBooking();
  }, [id]);

  if (error) return <div>{error}</div>;
  if (!booking) return <div>Loading...</div>;

  return (

    <>
    <div className="fixed left-0 right-0 top-0">
      <Hotelnav/>
    </div>
     
    <div className="flex  flex-wrap gap-5 p-6 items-center  justify-center mt-24 ">
       <PaymentForm booking={booking} />
       <BookingSummary booking={booking} />
    </div>
    <div>
      <Footer/>
    </div>
    </>
  );
};

export default PaymentPage;
