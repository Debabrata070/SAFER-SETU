import { useState, useEffect } from "react";
import {
  createOrder,
  verifyPayment,
  getRazorpayCheckoutKeyId,
} from "../services/paymentService";
import PaymentInput from "./PaymentInput";
import { API_BASE_URL } from "../config/apiBase.js";

import PaymentMethods from "./PaymentMethod"
const PaymentForm = ({ booking }) => {
  const [method, setMethod] = useState("UPI");
  const [input, setInput] = useState("");
  const [rzpKeyId, setRzpKeyId] = useState("");
  const [keyDiag, setKeyDiag] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const id = await getRazorpayCheckoutKeyId();
        if (!cancelled && id) {
          setRzpKeyId(String(id).trim());
          setKeyDiag("");
        }
      } catch (e) {
        const fallback =
          (process.env.REACT_APP_RAZORPAY_KEY ||
            process.env.REACT_APP_RAZORPAY_KEY_ID ||
            ""
          ).trim();
        if (!cancelled && fallback) {
          setRzpKeyId(fallback);
          setKeyDiag("");
        } else if (!cancelled) {
          setKeyDiag(
            `${e.message}. Backend URL in use: ${API_BASE_URL}. Open ${API_BASE_URL}/api/payment/checkout-config in the browser — expect {"keyId":"rzp_test_..."}.`
          );
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handlePayment = async () => {
    const key =
      rzpKeyId ||
      process.env.REACT_APP_RAZORPAY_KEY ||
      process.env.REACT_APP_RAZORPAY_KEY_ID;
    if (!key || String(key).includes("xxxx")) {
      alert(
        `Razorpay Key ID missing.\n\n1) Backend: set RAZORPAY_KEY_ID in Backend/.env and restart the API.\n2) Open ${API_BASE_URL}/api/payment/checkout-config — must return {"keyId":"rzp_test_..."}.\n3) frontend/.env: REACT_APP_API_URL=${API_BASE_URL} (must match your API).\n4) If you still see an OLD error about only REACT_APP_RAZORPAY_KEY: stop Parcel, delete folder frontend/.parcel-cache, start again.\n5) Optional fallback: REACT_APP_RAZORPAY_KEY=<same as RAZORPAY_KEY_ID> in frontend/.env`
      );
      return;
    }

    if (typeof window.Razorpay !== "function") {
      alert("Razorpay script failed to load. Check your network and index.html checkout.razorpay.com script.");
      return;
    }

    let order;
    try {
      order = await createOrder(booking.totalPrice);
    } catch (e) {
      console.error(e);
      alert(e.message || "Could not create payment order. Check backend Razorpay keys and server logs.");
      return;
    }

    if (!order?.id) {
      alert("Invalid order from server. Check backend logs and Razorpay credentials.");
      return;
    }

    const options = {
      key,
      amount: order.amount,
      currency: "INR",
      name: "Hotel Booking",
      order_id: order.id,

     handler: async function (response) {
  console.log("RAZORPAY RESPONSE:", response);

  try {
    const res = await verifyPayment({
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature,
      bookingId: booking._id,
      amount: booking.totalPrice,
      method: method.toLowerCase(),
    });

    console.log("VERIFY RESPONSE:", res);

    alert("Payment Success ✅");
    window.location.href = `/success/${booking._id}`;

  } catch (err) {
    console.error("Payment error:", err);
    alert("Payment verification failed ❌");
  }
}
    };

    const rzp = new window.Razorpay(options);
    
    rzp.open();
  };

  return (
    <div className="p-5 border rounded-lg shadow-md card-hover-lift bg-white">

      <h2 className="text-xl font-bold mb-4">Select Payment Method</h2>

      {keyDiag ? (
        <p className="text-sm text-red-800 bg-red-50 border border-red-200 rounded p-2 mb-3 whitespace-pre-wrap">
          {keyDiag}
        </p>
      ) : null}

       <PaymentMethods method={method} setMethod={setMethod} />

       <PaymentInput method={method} input={input} setInput={setInput} /> 
      <button
        onClick={handlePayment}
        className="success-btn text-white p-3 mt-4 w-full"
      >
        Pay ₹{booking.totalPrice}
      </button>

    </div>
  );
};

export default PaymentForm;