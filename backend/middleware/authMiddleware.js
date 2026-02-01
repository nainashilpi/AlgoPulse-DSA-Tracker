const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * @desc    Middleware to protect routes and verify JWT token
 * @access  Private
 */
const protect = async (req, res, next) => {
  let token;

  // Verify if the authorization header exists and follows the Bearer schema
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract the token from the Bearer string
      token = req.headers.authorization.split(' ')[1];

      // Verify and decode the token using the secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the user to the request object while excluding the password field
      req.user = await User.findById(decoded.id).select('-password');

      next(); 
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // Fallback if no token is provided in the headers
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

/**
 * @desc    Middleware to restrict access to Admin users only
 * @access  Private/Admin
 */
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'Admin') { 
    next();
  } else {
    res.status(401).json({ message: "Not authorized as an admin" });
  }
};

module.exports = { protect, admin };