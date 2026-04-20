 const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema({
name: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
    index: true, // important for fast search
  },
  district: {
    type: String,
    required: true,
    index: true, // important for fast search
  },
   location: {
    lat: Number,
    lng: Number,
  },

  // ⭐ NEW FIELDS
  averageRating: {
    type: Number,
    default: 0,
  },
  totalReviews: {
    type: Number,
    default: 0,
  },
  userRatings: {
    type: [Number],
    default: [],
  },
  ratingCount: {
    type: Number,
    default: 0,
  },
  country: String,
  address: String,
  pricePerNight: Number,
  rating: Number,
  images: [String],
  description: String,
  type: String,

  amenities: [String], // wifi, pool, etc

  rooms: Number,
}, { timestamps: true });



module.exports = mongoose.model("Hotel", hotelSchema);