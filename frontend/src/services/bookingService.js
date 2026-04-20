import { API_BASE_URL } from "../config/apiBase.js";

export  const createBooking = async (bookingData) => {
  const res = await fetch(`${API_BASE_URL}/api/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bookingData),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error || data?.message || "Booking request failed");
  }
  return data;
};

export const getUserBookings = async (email) => {
  const res = await fetch(`${API_BASE_URL}/api/bookings/user/${email}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error || data?.message || "Failed to fetch user bookings");
  }
  return data;
};