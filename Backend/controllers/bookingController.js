 const Booking = require("../models/Booking");
const Razorpay = require("razorpay");
const Payment =require("../models/Payment");

const razorpay = new Razorpay({
  key_id: "rzp_test_Sb6JI8cXbEv1MB",
  key_secret: "cO3K8jG57qaLMUj69Y026pPO",
});
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
/* const cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;

    const payment = await Payment.findOne({ bookingId });

    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    // Refund payment
    await razorpay.payments.refund(payment.razorpayPaymentId);

    payment.status = "refunded";
    await payment.save();

    res.json({ message: "Booking cancelled & refunded successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; */
module.exports={createBooking};