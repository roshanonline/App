import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import UserContext from '../context/UserContext';

const GameplayScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { mode } = route.params;
  const { updateScore } = useContext(UserContext);
  
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [sequence, setSequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [isShowingSequence, setIsShowingSequence] = useState(true);
  const [gameStatus, setGameStatus] = useState('watching'); // watching, input, success, failure
  const [maxLives, setMaxLives] = useState(10);
  const [lives, setLives] = useState(10);

  // Generate sequence based on selected mode
  const generateSequence = () => {
    const newSequence = [];
    const sequenceLength = level + 2; // Increase sequence length with level
    
    for (let i = 0; i < sequenceLength; i++) {
      if (mode === 'NUMBERS') {
        newSequence.push(Math.floor(Math.random() * 9) + 1); // 1-9
      } else if (mode === 'COLORS') {
        const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
        newSequence.push(colors[Math.floor(Math.random() * colors.length)]);
      } else if (mode === 'SHAPES') {
        const shapes = ['circle', 'square', 'triangle', 'star', 'diamond', 'hexagon'];
        newSequence.push(shapes[Math.floor(Math.random() * shapes.length)]);
      }
    }
    
    return newSequence;
  };

  // Start a new level
  const startNewLevel = () => {
    const newSequence = generateSequence();
    setSequence(newSequence);
    setUserSequence([]);
    setIsShowingSequence(true);
    setGameStatus('watching');
    
    // Show sequence with delay
    showSequence(newSequence);
  };

  // Show sequence to the user
  const showSequence = (seq) => {
    // Implementation of showing sequence with timing
    setTimeout(() => {
      setIsShowingSequence(false);
      setGameStatus('input');
    }, seq.length * 1000 + 1000); // Adjust timing based on sequence length
  };

  // Handle user input
  const handleInput = (value) => {
    if (gameStatus !== 'input') return;
    
    const newUserSequence = [...userSequence, value];
    setUserSequence(newUserSequence);
    
    // Check if user input is correct so far
    const currentIndex = newUserSequence.length - 1;
    if (newUserSequence[currentIndex] !== sequence[currentIndex]) {
      // Wrong input
      setLives(lives - 1);
      if (lives <= 1) {
        gameOver();
      } else {
        Alert.alert('Wrong!', 'Try again', [
          { text: 'OK', onPress: () => startNewLevel() }
        ]);
      }
      return;
    }
    
    // Check if sequence is complete
    if (newUserSequence.length === sequence.length) {
      // Sequence complete - level up
      setScore(score + (level * 10));
      setLevel(level + 1);
      setGameStatus('success');
      
      setTimeout(() => {
        startNewLevel();
      }, 1000);
    }
  };

  // Game over
  const gameOver = () => {
    updateScore(mode.toLowerCase(), score);
    Alert.alert('Game Over', `Your final score: ${score}`, [
      { text: 'OK', onPress: () => navigation.navigate('ScoreScreen', { score, mode }) }
    ]);
  };

  // Quit game
  const quitGame = () => {
    updateScore(mode.toLowerCase(), score);
    navigation.navigate('HomeScreen');
  };

  // Initialize game
  useEffect(() => {
    startNewLevel();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Mode</Text>
      </View>
      
      <View style={styles.gameInfo}>
        <Text style={styles.modeText}>Mode: {mode.charAt(0) + mode.slice(1).toLowerCase()}</Text>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>Score:</Text>
          <Text style={styles.scoreValue}>{score}</Text>
          <Text style={styles.livesValue}>{lives}</Text>
        </View>
        <Text style={styles.levelText}>Level: {level}</Text>
      </View>
      
      <View style={styles.gameArea}>
        {isShowingSequence ? (
          <Text style={styles.message}>Watch the sequence!</Text>
        ) : (
          <Text style={styles.message}>Your turn!</Text>
        )}
        
        {/* Game elements will render here based on mode */}
        {mode === 'NUMBERS' && (
          <View style={styles.numberPad}>
            {/* Number buttons would be rendered here */}
          </View>
        )}
        
        {/* Similar views for COLORS and SHAPES modes */}
      </View>
      
      <TouchableOpacity style={styles.quitButton} onPress={quitGame}>
        <Text style={styles.quitButtonText}>QUIT GAME</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f5ff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff6a33',
    padding: 15,
  },
  backButton: {
    color: 'white',
    fontSize: 24,
    marginRight: 15,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  gameInfo: {
    padding: 10,
  },
  modeText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 16,
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  livesValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
  },
  levelText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  gameArea: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  numberPad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  quitButton: {
    backgroundColor: '#3498db',
    padding: 10,
    margin: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  quitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default GameplayScreen;