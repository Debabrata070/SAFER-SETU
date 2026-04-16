 const Review = require("../models/Revie");

// 📥 Get reviews by hotel ID
const getReviewsByHotel = async (req, res) => {
 /*  try {
    const reviews = await Review.find({
      hotelId: req.params.hotelId,
    });

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } */
  try {
    const reviews = await Review.find({
       hotelId: req.params.hotelId }).populate("userId", "name"); // ✅ important
     res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};

// ✍️ Add review
const addReview = async (req, res) => {
 /*  try {
    const review = new Review(req.body);
    await review.save();

    res.json({ message: "Review added", review });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } */

     try {
     
    const { hotelId, text, rating  } = req.body;
          // ❌ Check if already reviewed
           const userId=req.user.id;  // ✅ KEY FIX
    const existing = await Review.findOne({ hotelId, userId });

    if (existing) {
      return res.status(400).json("You already reviewed this hotel");
    }

    // 🔍 DEBUG (IMPORTANT)
    // console.log("BODY:", req.body);

   const review = new Review({
      hotelId,
      userId: req.user.id,   // ✅ KEY FIX
      text,
      rating: Number(rating),
});

    await review.save();

    res.json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Review failed" });
  }
};

module.exports = { getReviewsByHotel, addReview };