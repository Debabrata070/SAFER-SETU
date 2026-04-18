const Razorpay = require("razorpay");
const Payment = require("../models/Payment");
const Booking = require("../models/Booking");
const { verifySignature } = require("../utils/verifySignature");
const generateOrderId = require("../utils/generateOrderId");
const dotenv = require("dotenv");
dotenv.config();

const generateInvoicePDF = require("../utils/generateInvoicePDF");
const sendInvoiceEmail = require("../utils/sendInvoiceEmail");

/** Trim, strip quotes, and remove invisible chars from copy-paste (common Razorpay auth failures). */
function cleanEnv(name) {
  let s = process.env[name];
  if (s == null) return "";
  s = String(s).trim();
  s = s.replace(/[\u200B-\u200D\uFEFF]/g, "");
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    s = s.slice(1, -1).trim();
  }
  return s;
}

function razorpayErrorMessage(err) {
  if (err?.error?.description) return err.error.description;
  if (typeof err?.error === "string") return err.error;
  if (err?.message) return err.message;
  return "Razorpay request failed";
}

function getRazorpayClient() {
  const key_id = cleanEnv("RAZORPAY_KEY_ID");
  const key_secret = cleanEnv("RAZORPAY_KEY_SECRET");
  if (!key_id || !key_secret) {
    throw new Error(
      "Razorpay keys missing. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in Backend/.env (no spaces around =)."
    );
  }
  return new Razorpay({ key_id, key_secret });
}

/** Key ID is public (used by Razorpay Checkout). */
exports.getCheckoutConfig = (req, res) => {
  const keyId = cleanEnv("RAZORPAY_KEY_ID");
  if (!keyId) {
    return res.status(503).json({
      error: "RAZORPAY_KEY_ID missing in Backend/.env",
    });
  }
  res.json({ keyId });
};

/**
 * Safe diagnostics for "Authentication failed" — never exposes the secret.
 * GET /api/payment/integration-status
 */
exports.getIntegrationStatus = (req, res) => {
  const keyId = cleanEnv("RAZORPAY_KEY_ID");
  const secret = cleanEnv("RAZORPAY_KEY_SECRET");
  const mode =
    keyId.startsWith("rzp_live_") ? "live" : keyId.startsWith("rzp_test_") ? "test" : "unknown";

  res.json({
    razorpayKeyIdConfigured: Boolean(keyId),
    razorpayKeyIdPrefix: keyId ? `${keyId.slice(0, 10)}…` : null,
    razorpayKeyMode: mode,
    razorpaySecretConfigured: Boolean(secret && secret.length > 8),
    help:
      "Create-order uses ONLY Backend/.env (RAZORPAY_KEY_ID + RAZORPAY_KEY_SECRET). If Razorpay returns Authentication failed, open Razorpay Dashboard → API Keys → Regenerate Key Secret, then paste the NEW secret with the Key Id shown there (same test or same live mode). Restart the Node server after saving .env.",
  });
};

// Create order
exports.createOrder = async (req, res) => {
  try {
    const keyId = cleanEnv("RAZORPAY_KEY_ID");
    const keySecret = cleanEnv("RAZORPAY_KEY_SECRET");
    if (!keyId || !keySecret) {
      return res.status(500).json({
        error:
          "Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in Backend/.env",
      });
    }

    const { amount } = req.body;
    const rupees = Number(amount);
    if (!Number.isFinite(rupees) || rupees <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const paise = Math.round(rupees * 100);
    if (paise < 100) {
      return res.status(400).json({
        error: "Amount too small: Razorpay needs at least ₹1.00 (100 paise)",
      });
    }

    const rp = getRazorpayClient();
    const order = await rp.orders.create({
      amount: paise,
      currency: "INR",
      receipt: `bk_${Date.now()}`.slice(0, 40),
    });

    res.json(order);
  } catch (err) {
    const msg = razorpayErrorMessage(err);
    console.error("Razorpay createOrder:", msg, err);
    const authFailed =
      typeof msg === "string" && msg.toLowerCase().includes("authentication");
    res.status(500).json({
      error: msg,
      ...(authFailed && {
        hint:
          "Razorpay rejected Key ID + Key Secret from Backend/.env. Regenerate Key Secret in Dashboard → API Keys, copy BOTH values again (test/live must match), save Backend/.env, restart nodemon. GET /api/payment/integration-status checks that both are set.",
      }),
    });
  }
};

// Save payment
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId,
      amount,
      method,
    } = req.body;

    // 🔐 USE UTIL FUNCTION HERE
    const isValid = verifySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      cleanEnv("RAZORPAY_KEY_SECRET")
    );

    if (!isValid) {
      return res.status(400).json({ success: false });
    }

    const data = req.body;
    const booking = await Booking.findById(data.bookingId);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    const payment = new Payment({
      bookingId,
      amount,
      paymentMethod: method,
      razorpayPaymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
      status: "success",

      orderNumber: generateOrderId(),
      hotelName: booking.hotelName,
      guests: booking.guests,
      rooms: booking.rooms,
      nights: booking.nights,

      name: booking.name,
      email: booking.email,
    
    });

    await payment.save();

    try {
      const pdfPath = await generateInvoicePDF(payment);
      await sendInvoiceEmail(payment.email, pdfPath);
    } catch (sideErr) {
      console.error("Invoice/email (non-fatal):", sideErr.message);
    }

    res.json({ message: "Payment Successful" });

  } catch (err) {
     console.error("ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};


exports.cancelBookingRefund = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found"
      });
    }

    payment.status = "refunded";
    payment.refundDate = new Date();
    payment.refundAmount = payment.amount;

    await payment.save();

    res.json({
      success: true,
      message: "Refund successful"
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Refund failed"
    });
  }
};