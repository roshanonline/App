import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// IMPORTANT: Replace with your actual backend server address
// Use your computer's local network IP if testing on a physical device
// Example: 'http://192.168.1.100:5000' or your deployed backend URL
const API_BASE_URL = 'http://localhost:5000'; // CHANGE THIS

const apiClient = axios.create({
  baseURL: API_BASE_URL + '/api', // Add /api prefix if your backend routes use it
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Interceptor to automatically add token ---
// Use AsyncStorage to get token if needed, or rely on UserContext setting it.
// apiClient.interceptors.request.use(async (config) => {
//   const token = await AsyncStorage.getItem('userToken');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// }, (error) => {
//   return Promise.reject(error);
// });


// Function to manually set Authorization header (called from UserContext)
export const setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log("API Auth token SET");
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
    console.log("API Auth token CLEARED");
  }
};


// --- API Functions ---

// Auth
export const loginUser = async (credentials) => {
  try {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data; // Should contain { success: true, token: '...', user: {...} }
  } catch (error) {
    console.error("API Login Error:", error.response?.data || error.message);
    return { success: false, message: error.response?.data?.message || 'Login failed' };
  }
};

export const registerUser = async (userData) => {
   try {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  } catch (error) {
     console.error("API Register Error:", error.response?.data || error.message);
     return { success: false, message: error.response?.data?.message || 'Registration failed' };
  }
};

// Leaderboard
export const fetchLeaderboard = async (filter = 'all-time') => {
  try {
    const response = await apiClient.get(`/leaderboard?filter=${filter}`);
    return response.data; // Should be { success: true, count: ..., data: [...] }
  } catch (error) {
     console.error("API Fetch Leaderboard Error:", error.response?.data || error.message);
    // Return shape expected by the component on error
    return { success: false, message: 'Failed to load leaderboard', data: [] };
  }
};

// Score (Requires Auth)
export const saveScore = async (scoreData) => {
   try {
    // Assumes token is set via setAuthToken after login in UserContext
    const response = await apiClient.post('/game/save-score', scoreData);
    return response.data; // { success: true, message: 'Score saved' }
  } catch (error) {
     console.error("API Save Score Error:", error.response?.data || error.message);
     // Check for specific auth error
     if (error.response?.status === 401) {
         return { success: false, message: 'Not authorized. Please log in again.' };
     }
     return { success: false, message: error.response?.data?.message || 'Failed to save score' };
  }
};

// TODO: Add API functions for Challenges if needed
// export const fetchChallenges = async () => { ... }