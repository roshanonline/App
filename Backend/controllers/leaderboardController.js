const Score = require('../models/Score');

// @desc    Get leaderboard scores
// @route   GET /api/leaderboard
// @access  Public
exports.getLeaderboard = async (req, res, next) => {
  // Sanitize and validate query parameters
  const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100); // Limit between 1 and 100
  const filter = req.query.filter || 'all-time'; // daily, weekly, all-time (add more?)
  const gameModeFilter = req.query.mode; // Optional: filter by game mode

  try {
    let queryOptions = {};

    // Add date filtering logic
    const now = new Date();
    if (filter === 'daily') {
      const today = new Date(now.setHours(0, 0, 0, 0));
      queryOptions.createdAt = { $gte: today };
    } else if (filter === 'weekly') {
       const oneWeekAgo = new Date(now.setDate(now.getDate() - 7));
       oneWeekAgo.setHours(0, 0, 0, 0);
       queryOptions.createdAt = { $gte: oneWeekAgo };
    } // else 'all-time' needs no date filter

    // Add game mode filtering logic
    if (gameModeFilter && ['numbers', 'colors', 'shapes'].includes(gameModeFilter)) {
        queryOptions.gameMode = gameModeFilter;
    }


    const scores = await Score.find(queryOptions)
                     .sort({ score: -1, createdAt: 1 }) // Sort by score desc, then oldest first for ties
                     .limit(limit)
                     .select('userName score gameMode createdAt levelReached'); // Select fields

    res.status(200).json({ success: true, count: scores.length, data: scores });

  } catch (error) {
     console.error('Error fetching leaderboard:', error);
     res.status(500).json({ success: false, message: 'Server Error fetching leaderboard' });
  }
};