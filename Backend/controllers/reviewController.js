 const Review = require("../models/Revie");
const Hotel = require("../models/hotel");

function getUpdatedRatingFields(hotel) {
  const defaultRating = Number(hotel.rating) || 0;
  const userRatings = Array.isArray(hotel.userRatings) ? hotel.userRatings : [];
  const ratingCount = userRatings.length;
  const totalRatings = ratingCount + (defaultRating > 0 ? 1 : 0);
  const sum = userRatings.reduce((acc, value) => acc + (Number(value) || 0), 0);
  const avgRating =
    totalRatings > 0 ? (defaultRating + sum) / totalRatings : 0;

  return {
    userRatings,
    ratingCount,
    avgRating,
    totalRatings,
  };
}

const getReviewsByHotel = async (req, res) => {
  try {
    const reviews = await Review.find({
       hotelId: req.params.hotelId }).populate("userId", "name");
     res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};

const addReview = async (req, res) => {
     try {
     
    const { hotelId, text, rating  } = req.body;
    const userId = req.user.id;
    const existing = await Review.findOne({ hotelId, userId });

    if (existing) {
      return res.status(400).json("You already reviewed this hotel");
    }

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ error: "Hotel not found" });
    }

   const review = new Review({
      hotelId,
      userId: req.user.id,
      text,
      rating: Number(rating),
});

    await review.save();
    hotel.userRatings = [...(hotel.userRatings || []), Number(rating)];
    const { ratingCount, avgRating, totalRatings } = getUpdatedRatingFields(hotel);
    hotel.ratingCount = ratingCount;
    hotel.averageRating = avgRating;
    hotel.totalReviews = totalRatings;
    await hotel.save();

    res.json({
      ...review.toObject(),
      avgRating,
      ratingCount: totalRatings,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Review failed" });
  }
};

module.exports = { getReviewsByHotel, addReview };