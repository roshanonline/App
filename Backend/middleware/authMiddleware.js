const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - verify token
const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header (Bearer <token>)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token payload (we stored the id)
      // Attach user to the request object (excluding the password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
         // Handle case where user associated with token no longer exists
         return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
      }

      next(); // Proceed to the next middleware/controller
    } catch (error) {
      console.error('Token verification error:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };