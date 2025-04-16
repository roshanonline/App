const mongoose = require('mongoose');

const ChallengeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Challenge name is required'],
        trim: true,
        unique: true // Ensure challenge names are unique? Maybe not.
    },
    description: {
        type: String,
        required: [true, 'Challenge description is required']
    },
    type: {
        type: String,
        enum: ['daily', 'distraction', 'memory_test', 'other'], // Example types
        required: [true, 'Challenge type is required']
    },
    difficulty: { // Optional difficulty rating
        type: Number,
        min: 1,
        max: 5
    },
    rewardPoints: { // Optional bonus points for completion
        type: Number,
        default: 0
    },
    isActive: { // Flag for enabling/disabling challenges (e.g., daily ones)
        type: Boolean,
        default: true
    },
     createdAt: {
        type: Date,
        default: Date.now
    }
});

// Optional index if you query challenges by type often
ChallengeSchema.index({ type: 1, isActive: 1 });

module.exports = mongoose.model('Challenge', ChallengeSchema);