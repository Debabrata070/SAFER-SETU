const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const mongoose = require("mongoose");
const Hotel = require("../models/hotel");
const rawData = require("./data.json");

const MONGO_URI =
  (process.env.MONGO_URI && String(process.env.MONGO_URI).trim()) ||
  "mongodb://127.0.0.1:27017/travelDB";

/** Match frontend filter checkboxes (wifi, pool, parking) and backend $all search */
function normalizeAmenities(list) {
  if (!Array.isArray(list)) return [];
  return list
    .map((a) =>
      String(a)
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "")
    )
    .map((a) => {
      if (a === "wifi" || a === "wi-fi") return "wifi";
      if (a === "swimmingpool" || a === "pool") return "pool";
      if (a === "parking" || a === "park") return "parking";
      return a;
    })
    .filter(Boolean);
}

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    await Hotel.deleteMany({});

    const hotels = [];

    rawData.states.forEach((stateObj) => {
      const state = stateObj.name;

      stateObj.districts.forEach((districtObj) => {
        const district = districtObj.name;

        districtObj.hotels.forEach((hotel) => {
          hotels.push({
            name: hotel.name,
            address: hotel.address,
            state,
            district,
            country: "India",
            description: hotel.address,
            pricePerNight: hotel.price_per_night,
            rooms: hotel.rooms,
            amenities: normalizeAmenities(hotel.amenities),
            type: hotel.type,
            location: {
              lat: hotel.lat,
              lng: hotel.lng,
            },
            images: hotel.image ? [hotel.image] : [],
            averageRating: hotel.rating || 0,
            totalReviews: 1,
            rating: hotel.rating,
          });
        });
      });
    });

    await Hotel.insertMany(hotels);

    console.log(`Seeded ${hotels.length} hotels`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err.message);
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
  }
};

seedData();
