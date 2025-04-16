import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { GameContext } from '../context/GameContext';
import { UserContext } from '../context/UserContext'; // Maybe show best score

function ScoreScreen({ navigation }) {
   const { score, resetGame } = useContext(GameContext);
   // TODO: Fetch best score from user context or API

  const handlePlayAgain = () => {
      resetGame();
      navigation.navigate('Home'); // Or navigate back to GameMode selection
  }

  const handleShare = () => {
      // TODO: Implement sharing functionality (React Native Share API)
      alert(`Sharing score: ${score}`);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Game Over!</Text>
      <Text style={styles.scoreLabel}>Your Final Score:</Text>
      <Text style={styles.scoreValue}>{score}</Text>

      {/* <Text style={styles.bestScore}>Your Best: {user?.highScore || 'N/A'}</Text> */}
      {/* TODO: Add Score History Graph/List */}

      <View style={styles.buttonContainer}>
          <Button title="Play Again" onPress={handlePlayAgain} />
          <Button title="Share Score" onPress={handleShare} />
          <Button title="Leaderboard" onPress={() => navigation.navigate('Leaderboard')} />
          <Button title="Home" onPress={() => navigation.navigate('Home')} />
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
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  scoreLabel: {
      fontSize: 20,
      color: '#555',
      marginBottom: 10,
  },
  scoreValue: {
      fontSize: 48,
      fontWeight: 'bold',
      marginBottom: 40,
      color: '#e67e22',
  },
  bestScore: {
      fontSize: 18,
      marginBottom: 30,
  },
  buttonContainer: {
      marginTop: 30,
      width: '80%',
      gap: 10, // Works in newer RN versions for spacing
  }
});

export default ScoreScreen;