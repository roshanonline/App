const express = require('express');
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
// Example protected route: Get user profile (requires valid token)
// router.get('/me', protect, getMe);

module.exports = router;