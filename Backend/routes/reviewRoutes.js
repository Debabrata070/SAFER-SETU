 const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/authMiddleware");

const { getReviewsByHotel, addReview } = require("../controllers/reviewController");

router.get("/:hotelId", getReviewsByHotel);
router.post("/", verifyToken, addReview);

module.exports = router;