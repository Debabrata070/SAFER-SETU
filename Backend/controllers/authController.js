 const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json("User already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.json({
      message: "User registered",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
   try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Passward Match:",isMatch)

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ message: "JWT_SECRET is not configured" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, jwtSecret, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

 const getProfile = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json("Server error");
  }
};



const toggleWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (!user.wishlist) {
      user.wishlist = [];
    }

    const hotelId = req.params.hotelId;

    const exists = user.wishlist.some(
      (id) => id.toString() === hotelId
    );

    if (exists) {
      user.wishlist = user.wishlist.filter(
        (id) => id.toString() !== hotelId
      );
    } else {
      user.wishlist.push(hotelId);
    }

    await user.save();

    res.json(user.wishlist);

  } catch (err) {
    console.log("Wishlist Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};
const getWishlist = async (req, res) => {
  const user = await User.findById(req.user._id).populate("wishlist");

  res.json(user.wishlist);
};
module.exports={register,login,getProfile,toggleWishlist,getWishlist}
