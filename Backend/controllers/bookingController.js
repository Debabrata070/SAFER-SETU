const Booking = require("../models/Booking");

const createBooking = async (req, res) => {
  try {
    const booking = new Booking(req.body);
    const savedBooking = await booking.save();

    res.status(201).json({
      message: "Booking successful",
      data: savedBooking,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* Refund flow: use Razorpay with keys from process.env (same as paymentController), not hardcoded keys. */
/* const cancelBooking = async (req, res) => { ... }; */

module.exports = { createBooking };
