const express = require('express');
const { getLeaderboard } = require('../controllers/leaderboardController');

const router = express.Router();

// Public route to get leaderboard data
router.get('/', getLeaderboard); // e.g., GET /api/leaderboard?limit=20&filter=weekly

module.exports = router;