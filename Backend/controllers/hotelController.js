const mongoose = require("mongoose");
const Hotel = require("../models/hotel");

const withComputedRating = (hotel) => {
  const item = hotel && typeof hotel.toObject === "function" ? hotel.toObject() : hotel;
  const defaultRating = Number(item?.rating) || 0;
  const userRatings = Array.isArray(item?.userRatings) ? item.userRatings : [];
  const computedCount = userRatings.length;
  const totalRatings = computedCount + (defaultRating > 0 ? 1 : 0);
  const sum = userRatings.reduce((acc, value) => acc + (Number(value) || 0), 0);
  const avgRating =
    totalRatings > 0
      ? (defaultRating + sum) / totalRatings
      : Number(item?.averageRating) || 0;

  return {
    ...item,
    averageRating: avgRating,
    ratingCount: computedCount,
    totalReviews:
      totalRatings > 0 ? totalRatings : Number(item?.totalReviews) || 0,
  };
};

const getHotelById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid hotel id" });
    }

    const hotel = await Hotel.findById(id);

    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    res.json(withComputedRating(hotel));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const searchHotels = async (req, res) => {
  try {
    const { district, minPrice, maxPrice, rating } = req.query;
    let { amenities } = req.query;
    if (typeof amenities === "string") {
      amenities = amenities
        .split(/[,;]/)
        .map((s) => s.trim())
        .filter(Boolean);
    }

    let query = {};

    if (district && district !== "null" && district.trim() !== "") {
      query.district = { $regex: district, $options: "i" };
    }

    if (minPrice || maxPrice) {
      query.pricePerNight = {};
      if (minPrice) query.pricePerNight.$gte = Number(minPrice);
      if (maxPrice) query.pricePerNight.$lte = Number(maxPrice);
    }

    if (rating) {
      query.averageRating = { $gte: Number(rating) };
    }

    if (Array.isArray(amenities) && amenities.length > 0) {
      query.amenities = { $all: amenities };
    }

    const hotels = await Hotel.find(query);
    res.json(hotels.map(withComputedRating));
  } catch (error) {
    console.error("❌ ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};
const getHotelsByDistrict = async (req, res) => {
  try {
    const { district } = req.query;

    if (district && String(district).trim() !== "" && district !== "null") {
      const hotels = await Hotel.find({
        district: new RegExp(district, "i"),
      });
        return res.json(hotels.map(withComputedRating));
    }

    const hotels = await Hotel.find({});
    res.json(hotels.map(withComputedRating));
  } catch (err) {
    res.status(500).json({ message: "Error fetching hotels" });
  }
};

module.exports = { searchHotels, getHotelById, getHotelsByDistrict};