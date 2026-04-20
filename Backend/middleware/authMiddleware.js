const jwt = require("jsonwebtoken");
const User=require("../models/User");


const dotenv = require("dotenv");
dotenv.config();
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");

    next();
  } catch {
    res.status(401).json("Invalid token");
  }
};
module.exports = { verifyToken}