const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { name, email, password, leetcodeHandle } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ name, email, password: hashedPassword, leetcodeHandle });
    await user.save();

    res.status(201).json({ msg: "Registration Successful! Welcome to AlgoPulse." });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};