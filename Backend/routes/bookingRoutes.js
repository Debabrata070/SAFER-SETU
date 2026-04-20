const express = require("express");
const router = express.Router();
const { createBooking  } = require("../controllers/bookingController");
const Booking = require("../models/Booking"); // ✅ FIX

router.post("/", createBooking);
/* router.post("/cancel/:id", cancelBooking); */
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find({}).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/user/:email", async (req, res) => {
  try {
    const bookings = await Booking.find({ email: req.params.email }).sort({
      createdAt: -1,
    });
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ GET booking by ID
router.get("/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(booking);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;