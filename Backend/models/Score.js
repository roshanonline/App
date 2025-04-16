const mongoose = require('mongoose');

const ScoreSchema = new mongoose.Schema({
  score: {
    type: Number,
    required: [true, 'Score value is required'],
  },
  gameMode: {
    type: String,
    required: [true, 'Game mode is required'],
    enum: ['numbers', 'colors', 'shapes', 'unknown'], // Define possible modes
  },
  levelReached: {
      type: Number,
      default: 1
  },
  user: { // ID of the user who achieved the score
    type: mongoose.Schema.ObjectId,
    ref: 'User', // Reference to the User model
    required: [true, 'User reference is required'],
  },
   userName: { // Store userName for easier/faster leaderboard fetching
    type: String,
    required: [true, 'User name is required for leaderboard'],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster leaderboard queries (sort by score descending)
ScoreSchema.index({ score: -1 });
// Index for potentially finding scores by user
ScoreSchema.index({ user: 1 });

module.exports = mongoose.model('Score', ScoreSchema);