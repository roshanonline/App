import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import Timer from '../components/Timer';
import ScoreCard from '../components/ScoreCard';
import { GameContext } from '../context/GameContext';

function GameModeScreen({ route, navigation }) {
  const { mode } = route.params; // Get the mode passed from HomeScreen
  const { score, level, nextLevel, updateScore, resetGame } = useContext(GameContext);

  const [timeLeft, setTimeLeft] = useState(10); // Example timer state
  const [sequence, setSequence] = useState([]);
  const [playerInput, setPlayerInput] = useState([]);
  const [isDisplayingSequence, setIsDisplayingSequence] = useState(true);
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);

  // --- Game Logic Placeholder ---
  useEffect(() => {
    // Reset game state when component mounts or mode changes
    resetGame();
    generateNewSequence(1); // Start level 1
    startSequenceDisplay();
  }, [mode]);

  const generateNewSequence = (currentLevel) => {
    // TODO: Implement logic to generate sequence based on mode and level
    console.log(`Generating sequence for mode: ${mode}, level: ${currentLevel}`);
    setSequence(['red', 'blue', 'green'].slice(0, currentLevel + 1)); // Example
  };

  const startSequenceDisplay = () => {
      setIsDisplayingSequence(true);
      setIsPlayerTurn(false);
      // TODO: Add visual display logic (e.g., flashing colors/shapes)
      console.log('Displaying sequence:', sequence);
      // After display finishes:
      // setTimeout(() => startPlayerTurn(), 2000); // Example delay
  };

   const startPlayerTurn = () => {
        setIsDisplayingSequence(false);
        setIsPlayerTurn(true);
        setPlayerInput([]);
        setTimeLeft(10); // Reset timer
        // TODO: Start actual countdown timer
   };

   const handlePlayerInput = (input) => {
       if (!isPlayerTurn) return;

       const newPlayerInput = [...playerInput, input];
       setPlayerInput(newPlayerInput);

       // Check if input is correct so far
       if (sequence[newPlayerInput.length - 1] !== input) {
           // Incorrect input
           navigation.navigate('Feedback', { success: false, score });
           return;
       }

       // Check if sequence is complete
       if (newPlayerInput.length === sequence.length) {
           // Correct sequence!
           updateScore(10 * level); // Example scoring
           nextLevel(); // Prepare for next level
           // Give feedback and start next round
           // navigation.navigate('Feedback', { success: true, score }); // Or handle directly
           generateNewSequence(level + 1);
           startSequenceDisplay();
       }
   };
  // --- End Game Logic Placeholder ---


  return (
    <View style={styles.container}>
      <View style={styles.header}>
          <Text style={styles.modeText}>Mode: {mode}</Text>
          <ScoreCard score={score} />
          <Timer initialTime={10} timeUp={() => navigation.navigate('Feedback', { success: false, score })} isRunning={isPlayerTurn} />
      </View>
      <Text style={styles.levelText}>Level: {level}</Text>

      <View style={styles.gameArea}>
        {isDisplayingSequence && <Text>Watch the sequence!</Text>}
        {isPlayerTurn && <Text>Your turn!</Text>}
        {/* TODO: Add actual game elements (buttons, grid etc.) */}
        {/* Example buttons for player input */}
        {isPlayerTurn && (
            <View style={styles.inputButtons}>
                <Button title="Red" onPress={() => handlePlayerInput('red')} />
                <Button title="Blue" onPress={() => handlePlayerInput('blue')} />
                <Button title="Green" onPress={() => handlePlayerInput('green')} />
            </View>
        )}

      </View>

      <Button title="Quit Game" onPress={() => navigation.navigate('Home')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
    alignItems: 'center',
  },
  modeText: {
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
   levelText: {
    fontSize: 20,
    marginBottom: 20,
  },
  gameArea: {
    flex: 1, // Take up remaining space
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    // Add border or background for clarity
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
    padding: 10,
  },
   inputButtons: {
    flexDirection: 'row',
    marginTop: 20,
  },
});

export default GameModeScreen;