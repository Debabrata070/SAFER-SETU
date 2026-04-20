const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const PORT = Number(process.env.PORT) || 5000;
const MONGO_URI = process.env.MONGO_URI;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";

if (!MONGO_URI) {
  console.error("❌ MONGO_URI is not defined");
  process.exit(1);
}

const hotelRoutes = require("./routes/hotelRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const authRoutes = require("./routes/authRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const app = express();

app.use(
  cors({
    origin: CORS_ORIGIN === "*" ? true : CORS_ORIGIN.split(",").map((o) => o.trim()),
  })
);
app.use(express.json());
app.use("/images", express.static("public/images"));

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    console.error(
      "Fix MONGO_URI in .env, start local Mongo, or whitelist your IP in Atlas: https://www.mongodb.com/docs/atlas/security-whitelist/"
    );
  });

console.log("Loading hotel routes...");
app.use("/api/hotels", hotelRoutes);
console.log("Loading review routes...");
app.use("/api/reviews", reviewRoutes);
console.log("Routes loaded");



app.use("/api/auth", authRoutes);

app.use("/api/bookings", bookingRoutes);

app.use("/api/payment", paymentRoutes);
app.get("/", (req, res) => {
  res.send("API Working ✅");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});