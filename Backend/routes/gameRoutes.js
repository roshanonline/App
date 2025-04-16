const express = require('express');
const { saveScore /*, other game controllers... */ } = require('../controllers/gameController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Route to save score (requires user to be logged in)
router.post('/save-score', protect, saveScore);

// TODO: Add other game-related routes if needed
// router.get('/config', getGameConfig); // Example

module.exports = router;