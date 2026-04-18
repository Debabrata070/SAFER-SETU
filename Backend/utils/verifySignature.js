 const crypto = require("crypto");
const dotenv = require("dotenv");
dotenv.config();
exports.verifySignature = (order_id, payment_id, signature, secret) => {
  const key = secret || process.env.RAZORPAY_KEY_SECRET;
  if (!key || !order_id || !payment_id || !signature) {
    return false;
  }
  const body = order_id + "|" + payment_id;
  const expected = crypto
    .createHmac("sha256", key)
    .update(body)
    .digest("hex");

  return expected === signature;
};