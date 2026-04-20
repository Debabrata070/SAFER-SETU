const express = require("express");
const router = express.Router();
const {
  createOrder,
  verifyPayment,
  cancelBookingRefund,
  getCheckoutConfig,
  getIntegrationStatus,
} = require("../controllers/paymentController");
const Payment=require("../models/Payment");

router.get("/checkout-config", getCheckoutConfig);
router.get("/integration-status", getIntegrationStatus);
router.post("/create-order", createOrder);
router.post("/verify", verifyPayment);
router.get("/receipt/:bookingId", async (req, res) => {
  try {
    const Payment = require("../models/Payment");

    const payment = await Payment.findOne({
      bookingId: req.params.bookingId,
    });

    if (!payment) {
      return res.status(404).json({ error: "Receipt not found" });
    }

    res.json(payment);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/user/:email", async (req, res) => {
  try {
    const payments = await Payment.find({ email: req.params.email }).sort({
      createdAt: -1,
    });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/refund/:paymentId", cancelBookingRefund);
module.exports = router;