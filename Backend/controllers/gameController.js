const Score = require('../models/Score');
// User model might not be strictly needed here if req.user from protect middleware is sufficient

// @desc    Save a game score
// @route   POST /api/game/save-score
// @access  Private (requires login/token via protect middleware)
exports.saveScore = async (req, res, next) => {
  const { score, gameMode, levelReached } = req.body;
  // req.user should be attached by the protect middleware
  const userId = req.user?._id;
  const userName = req.user?.name; // Get name from the user object attached by middleware

  // Validation
  if (!userId || !userName) {
      return res.status(401).json({ success: false, message: 'User not found or not properly authenticated' });
  }
   if (score === undefined || !gameMode) {
     return res.status(400).json({ success: false, message: 'Missing required score or gameMode' });
  }
   if (typeof score !== 'number') {
       return res.status(400).json({ success: false, message: 'Score must be a number'});
   }

  try {
     const newScore = await Score.create({
       score,
       gameMode,
       levelReached: levelReached || 1,
       user: userId,
       userName: userName
     });

     console.log(`Score saved for user ${userName} (${userId}): ${score}`);
     res.status(201).json({ success: true, message: 'Score saved successfully', data: newScore });

  } catch (error) {
     console.error('Error saving score:', error);
     if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ success: false, message: messages.join(', ') });
    }
     res.status(500).json({ success: false, message: 'Server Error saving score' });
  }
};

// TODO: Add controllers for fetching/saving game state or settings if needed
// exports.getGameConfig = async (req, res, next) => { ... };