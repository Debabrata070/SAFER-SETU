 const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/authMiddleware");

const { getReviewsByHotel, addReview } = require("../controllers/reviewController");

// 📥 Get reviews for a hotel
router.get("/:hotelId", getReviewsByHotel);

// ✍️  Verify Token and Add review
  //router.post("/", addReview);

//
router.post("/", verifyToken, addReview);

module.exports = router;