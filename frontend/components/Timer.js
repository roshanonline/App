import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';

function Timer({ initialTime = 10, timeUp, isRunning = false }) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      // Start timer
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(intervalRef.current);
            if (timeUp) timeUp(); // Call callback when time is up
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      // Clear timer if not running or component unmounts
      clearInterval(intervalRef.current);
      setTimeLeft(initialTime); // Reset timer visually when stopped
    }

    // Cleanup function
    return () => clearInterval(intervalRef.current);
  }, [isRunning, initialTime, timeUp]); // Rerun effect if isRunning changes


  // Reset timer if initialTime changes while not running
   useEffect(() => {
    if (!isRunning) {
      setTimeLeft(initialTime);
    }
  }, [initialTime, isRunning]);


  return (
    <View style={styles.container}>
      <Text style={styles.time}>{timeLeft}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    // backgroundColor: '#f0f0f0',
    // borderRadius: 5,
  },
  time: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e74c3c', // Red color for timer
  },
});

export default Timer;