/*  const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Hotel =require("./models/Hotel");
const hotelRoutes = require("./routes/hotelRoutes");
const reviewRoutes = require("./routes/reviewRoutes");


const app = express();

app.use(cors());
app.use(express.json());
app.use("/images", express.static("public/images")); 
mongoose.connect("mongodb://127.0.0.1:27017/travelDB");

app.use("/api/hotels", hotelRoutes);
app.use("/api/reviews", reviewRoutes);
{console.log("connect to api")}
app.listen(5000, () => {
  console.log("Server running on port 5000");
}); */
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const PORT = Number(process.env.PORT) || 5000;
const MONGO_URI =
  (process.env.MONGO_URI && String(process.env.MONGO_URI).trim()) ||
  "mongodb://127.0.0.1:27017/travelDB";

const hotelRoutes = require("./routes/hotelRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const authRoutes = require("./routes/authRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/images", express.static("public/images"));

// MongoDB Connection (do not exit the process — Atlas/local issues are common in dev)
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    console.error(
      "Fix MONGO_URI in .env, start local Mongo, or whitelist your IP in Atlas: https://www.mongodb.com/docs/atlas/security-whitelist/"
    );
  });

// Routes
console.log("Loading hotel routes...");
app.use("/api/hotels", hotelRoutes);
console.log("Loading review routes...");
app.use("/api/reviews", reviewRoutes);
console.log("Routes loaded");



app.use("/api/auth", authRoutes);

app.use("/api/bookings", bookingRoutes);

app.use("/api/payment", paymentRoutes);
// Test route
app.get("/", (req, res) => {
  res.send("API Working ✅");
});

// Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});