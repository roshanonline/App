const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  // Basic validation
  if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
  }
  if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
  }

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password, // Hashed by pre-save hook
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error('Registration Error:', error);
    // Handle potential validation errors from Mongoose
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Server Error during registration' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password presence
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password' });
  }

  try {
    // Check for user by email (case-insensitive)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password'); // Need password for comparison

    // Check user exists and password matches
    if (!user || !(await user.matchPassword(password))) {
       return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
     console.error('Login Error:', error);
     res.status(500).json({ success: false, message: 'Server Error during login' });
  }
};

// @desc    Get current logged in user (Example protected route)
// @route   GET /api/auth/me
// @access  Private (requires 'protect' middleware)
// exports.getMe = async (req, res, next) => {
//   // req.user is already attached by the protect middleware
//   // We excluded password when fetching in middleware
//   res.status(200).json({ success: true, data: req.user });
// };