// screens/ScoreScreen.js
import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { GameContext } from '../context/GameContext';
// import { UserContext } from '../context/UserContext'; // To potentially save high score

function ScoreScreen({ route, navigation }) {
   const { finalScore, levelReached } = route.params;
   const { resetGame } = useContext(GameContext);
   // const { user, token } = useContext(UserContext); // If saving score

   // TODO: Add logic here or in a useEffect to save the finalScore to the backend if user is logged in

   const handlePlayAgain = () => {
      resetGame(); // Ensure context is reset
      // Pop everything off the stack and go back to the first screen (Home)
      navigation.popToTop();
   }

   const handleGoToLeaderboard = () => {
      // Navigate to leaderboard, potentially replacing this screen
      // or allowing back navigation. Simple navigate for now.
      navigation.navigate('Leaderboard');
   }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Game Over!</Text>
      <Text style={styles.scoreLabel}>Your Final Score:</Text>
      <Text style={styles.scoreValue}>{finalScore}</Text>
      <Text style={styles.levelText}>You reached Level {levelReached}</Text>

      {/* <Text style={styles.bestScore}>Your Best: {user?.highScore || 'N/A'}</Text> */}

      <View style={styles.buttonContainer}>
          <Button title="Play Again" onPress={handlePlayAgain} />
          <Button title="View Leaderboard" onPress={handleGoToLeaderboard} />
          {/* Add Share button if desired */}
          {/* <Button title="Share Score" onPress={() => {}} /> */}
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
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  scoreLabel: {
      fontSize: 20,
      color: '#555',
      marginBottom: 10,
  },
  scoreValue: {
      fontSize: 52,
      fontWeight: 'bold',
      marginBottom: 15,
      color: '#e67e22',
  },
  levelText: {
      fontSize: 18,
      marginBottom: 40,
      color: '#555',
  },
  bestScore: {
      fontSize: 18,
      marginBottom: 30,
  },
  buttonContainer: {
      marginTop: 20,
      width: '80%',
      gap: 15,
  }
});

export default ScoreScreen;