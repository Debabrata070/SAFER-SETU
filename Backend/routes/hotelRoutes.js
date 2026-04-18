const express = require("express");
const router = express.Router();
const hotelController = require("../controllers/hotelController");

// Register specific paths before /:id so "search" is not parsed as an id
router.get("/search", hotelController.searchHotels);
router.get("/", hotelController.getHotelsByDistrict);
router.get("/:id", hotelController.getHotelById);

module.exports = router;
