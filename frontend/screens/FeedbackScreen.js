// screens/FeedbackScreen.js
import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { GameContext } from '../context/GameContext'; // Import GameContext to potentially reset

function FeedbackScreen({ route, navigation }) {
  const { success, finalScore, levelReached, nextLevel: levelForNextRound } = route.params;
  const { resetGame } = useContext(GameContext); // Get reset function

  const handleContinue = () => {
    // If successful (and using Option 1 from GameModeScreen), prepare for next level
    // If failed, simply go back to let GameModeScreen handle retry
    navigation.goBack(); // GameModeScreen's focus listener should handle restart/next level logic
  };

  const handleQuit = () => {
      resetGame(); // Reset context state before going to score/home
      // Navigate to Score screen, passing the final score
      navigation.navigate('Score', { finalScore: finalScore, levelReached: levelReached });
  };


  return (
    <View style={[styles.container, success ? styles.successBg : styles.failureBg]}>
      <Text style={styles.title}>{success ? "Correct!" : "Incorrect!"}</Text>
      {/* Add icons here */}
      <Text style={styles.scoreText}>Score: {finalScore}</Text>
      <Text style={styles.levelText}>You reached level: {levelReached}</Text>

      <View style={styles.buttonWrapper}>
        <Button
            title={success ? "Continue to Next Level" : "Try Again"}
            onPress={handleContinue}
            color={success ? '#27ae60' : '#f39c12'}
        />
      </View>
       <View style={styles.buttonWrapper}>
        <Button
            title="Quit & View Final Score"
            onPress={handleQuit}
            color="#7f8c8d"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  successBg: {
    backgroundColor: '#d4edda',
  },
  failureBg: {
     backgroundColor: '#f8d7da',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
   scoreText: {
    fontSize: 24,
    marginBottom: 10,
    color: '#555',
  },
   levelText: {
    fontSize: 18,
    marginBottom: 40,
     color: '#555',
  },
  buttonWrapper: {
      width: '80%',
      marginVertical: 10,
  }
});

export default FeedbackScreen;