const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Initialize express app
const app = express();

// Middleware
app.use(cors()); // Enable CORS for all origins (restrict in production if needed)
app.use(express.json()); // Body parser for JSON requests

// Simple request logger middleware (optional)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// --- Mount Routers ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/game', require('./routes/gameRoutes'));
app.use('/api/leaderboard', require('./routes/leaderboardRoutes'));
// TODO: Add routes for challenges if needed
// app.use('/api/challenges', require('./routes/challengeRoutes'));

// Simple Root Route (Optional)
app.get('/', (req, res) => {
  res.send('Echo Memory API Running...');
});

// --- Basic Error Handling (Add more robust handling later) ---
app.use((err, req, res, next) => {
  console.error("Error Caught: ", err.stack);
  res.status(err.statusCode || 500).send({
      success: false,
      message: err.message || 'Something broke!'
    });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));