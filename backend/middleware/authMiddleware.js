const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Check if token exists in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header (Format: Bearer <token>)
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token and attach to request object
      req.user = await User.findById(decoded.id).select('-password');

      next(); // "Next" ka matlab hai ki ab agle function (controller) par jao
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// authMiddleware.js ke andar:
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'Admin') { // 'Admin' match hona chahiye jo Atlas mein hai
        next();
    } else {
        res.status(401).json({ message: "Not authorized as an admin" });
    }
};

module.exports = { protect, admin };