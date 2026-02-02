const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 

/**
 * @desc    Register a new user
 * @access  Public
 */
exports.register = async (req, res) => {
  // DEBUG: Check if data reaches backend
  console.log("📥 Registration hit with data:", req.body);

  try {
    const { name, email, password, leetcodeHandle } = req.body;

    // Validation
    if (!name || !email || !password || !leetcodeHandle) {
       return res.status(400).json({ message: "Bhai, saari details bharna zaroori hai!" });
    }

    // Check existing user
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create User
    user = new User({
      name,
      email,
      password: hashedPassword,
      leetcodeHandle
    });

    await user.save();
    console.log("✅ User saved successfully in Database!");
    res.status(201).json({ message: "User registered successfully!" });

  } catch (error) {
    console.error("❌ MONGODB SAVE ERROR:", error.message); 
    res.status(500).json({ 
        message: "Server Error during registration", 
        error: error.message 
    });
  }
};

/**
 * @desc    Login user & get token
 * @access  Public
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // Compare Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '30d' }
    );

    // Send Response
    res.json({
      token,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        role: user.role,
        profilePic: user.profilePic,
        points: user.points,
        rank: user.rank || "N/A" 
      }
    });

  } catch (error) {
    console.error("❌ Login Error:", error.message);
    res.status(500).json({ message: "Server Error during login" });
  }
};