const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { name, email, password, leetcodeHandle } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      // Dono 'msg' aur 'message' bhej raha hoon taki frontend fail na ho
      return res.status(400).json({ msg: "User already exists", message: "User already exists" });
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create New User node
    user = new User({ 
      name, 
      email, 
      password: hashedPassword, 
      leetcodeHandle 
    });

    await user.save();

    res.status(201).json({ 
      msg: "Registration Successful! Welcome to AlgoPulse.",
      message: "Registration Successful! Welcome to AlgoPulse." 
    });
  } catch (err) {
    // Render logs mein error dekhne ke liye zaroori hai
    console.error("Registration Critical Error:", err.message);
    res.status(500).json({ msg: "Server Error", message: "Internal System Error" });
  }
};