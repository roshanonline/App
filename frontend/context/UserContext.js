import React, { createContext, useState, useMemo, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; // For storing token/user info
import { setAuthToken } from '../utils/api'; // Import function to set auth header

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // To check async storage on load

  // Check storage on initial load
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('userToken');
        const storedUser = await AsyncStorage.getItem('userInfo');
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          setAuthToken(storedToken); // Set auth header for subsequent API calls
        }
      } catch (e) {
        console.error("Failed to load user data from storage", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadUserData();
  }, []);


  const login = async (userData, authToken) => {
    try {
        setUser(userData);
        setToken(authToken);
        setAuthToken(authToken); // Set auth header
        await AsyncStorage.setItem('userToken', authToken);
        await AsyncStorage.setItem('userInfo', JSON.stringify(userData));
        console.log('User logged in and data stored');
    } catch (e) {
        console.error("Failed to save user data during login", e);
    }
  };

  const logout = async () => {
    try {
        setUser(null);
        setToken(null);
        setAuthToken(null); // Clear auth header
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('userInfo');
        console.log('User logged out and data cleared');
    } catch (e) {
        console.error("Failed to clear user data during logout", e);
    }
  };

  // Use useMemo to prevent unnecessary re-renders
  const value = useMemo(() => ({
    user,
    token,
    isLoading, // Expose loading state for potential loading screens
    login,
    logout,
  }), [user, token, isLoading]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};