// screens/GameModeScreen.js
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import Timer from '../components/Timer';
import ScoreCard from '../components/ScoreCard';
import { GameContext } from '../context/GameContext';
// Import GameplayScreen here if using it as a component:
// import GameplayScreen from './GameplayScreen';

function GameModeScreen({ route, navigation }) {
  const { mode } = route.params;
  const { score, level, difficulty, nextLevel, updateScore, resetGame } = useContext(GameContext);

  // State specific to this screen instance
  const [currentSequence, setCurrentSequence] = useState([]);
  const [playerInput, setPlayerInput] = useState([]);
  const [isDisplayingSequence, setIsDisplayingSequence] = useState(true);
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [gameMessage, setGameMessage] = useState('Watch the sequence!');
  const [timerKey, setTimerKey] = useState(0); // Used to reset Timer component

  // --- Game Logic ---

  // Function to generate sequence (needs implementation)
  const generateSequence = useCallback((lvl) => {
    console.log(`Generating sequence for mode: ${mode}, level: ${lvl}, difficulty: ${difficulty}`);
    // Replace with actual sequence generation based on mode/difficulty/level
    const exampleSequence = ['red', 'blue', 'green', 'yellow', 'purple'].slice(0, lvl + 1);
    setCurrentSequence(exampleSequence);
    return exampleSequence;
  }, [mode, difficulty]); // Re-generate if mode/difficulty changes

  // Function to start displaying the generated sequence
  const displaySequence = (seq) => {
    setIsDisplayingSequence(true);
    setIsPlayerTurn(false);
    setPlayerInput([]);
    setGameMessage('Watch carefully...');
    console.log('Displaying sequence:', seq);
    // *** TODO: Implement visual display logic here (e.g., flash colors/shapes) ***
    // Example: After a delay, start player's turn
    const displayTime = seq.length * 1000 + 1000; // Example: 1s per item + 1s buffer
    setTimeout(() => {
      startPlayerTurn();
    }, displayTime);
  };

  // Function to start the player's input turn
  const startPlayerTurn = () => {
    setIsDisplayingSequence(false);
    setIsPlayerTurn(true);
    setGameMessage('Your turn!');
    setTimerKey(prevKey => prevKey + 1); // Reset timer by changing its key
  };

  // Function to handle player input (e.g., button press)
  const handlePlayerInput = (input) => {
    if (!isPlayerTurn) return;

    const newPlayerInput = [...playerInput, input];
    setPlayerInput(newPlayerInput);

    // Check if the current input is correct
    if (currentSequence[newPlayerInput.length - 1] !== input) {
      // Incorrect input - Navigate to FeedbackScreen (Failure)
      console.log('Incorrect input!');
      setIsPlayerTurn(false); // Stop timer etc.
      // Maybe save score before navigating if this counts as end? Or pass current score.
      navigation.navigate('Feedback', { success: false, finalScore: score, levelReached: level });
      return;
    }

    // Check if the sequence is complete
    if (newPlayerInput.length === currentSequence.length) {
      // Correct sequence - Update score, go to next level
      console.log('Correct sequence!');
      setIsPlayerTurn(false); // Stop timer
      const pointsEarned = 10 * level; // Example scoring
      updateScore(pointsEarned);

      // *** Option 1: Navigate to FeedbackScreen (Success) before next level ***
      // navigation.navigate('Feedback', { success: true, finalScore: score + pointsEarned, nextLevel: level + 1 });

      // *** Option 2: Go directly to next level (more seamless) ***
      setGameMessage('Correct! Prepare for next level...');
      nextLevel(); // Increment level in context
      // Add a small delay before showing the next sequence
      setTimeout(() => {
          const nextSequence = generateSequence(level + 1); // Generate for the *new* level
          displaySequence(nextSequence);
      }, 1500); // 1.5 second delay
    }
  };

  // Function to handle timer running out
  const handleTimeUp = () => {
    if (isPlayerTurn) { // Only trigger if it was the player's turn
        console.log('Time is up!');
        setIsPlayerTurn(false);
        navigation.navigate('Feedback', { success: false, finalScore: score, levelReached: level });
    }
  };

  // Function to handle quitting the game
  const handleQuitGame = () => {
    Alert.alert(
      "Quit Game?",
      "Are you sure you want to end the current game?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Quit", style: "destructive", onPress: () => {
            // Reset game state in context for next time
            resetGame();
            // Navigate to Score screen with the final score
            navigation.navigate('Score', { finalScore: score, levelReached: level });
          }
        }
      ]
    );
  };

  // Effect to run when the component mounts or mode/level changes
  useEffect(() => {
    // Reset game for the specific mode when screen focuses or mode changes
    const unsubscribe = navigation.addListener('focus', () => {
        console.log(`GameModeScreen focused for mode: ${mode}, starting level ${level}`);
        resetGame(); // Reset score/level in context (maybe only if coming from Home?)
        const initialSequence = generateSequence(level); // Start level 1 (or current level from context)
        displaySequence(initialSequence);
    });

    // Cleanup listener on unmount
    return unsubscribe;
  }, [navigation, mode, level, generateSequence, resetGame]); // Add dependencies

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.modeText}>Mode: {mode}</Text>
        <ScoreCard score={score} />
        {/* Use key to force Timer remount/reset */}
        <Timer key={timerKey} initialTime={10} timeUp={handleTimeUp} isRunning={isPlayerTurn} />
      </View>
      <Text style={styles.levelText}>Level: {level}</Text>

      <View style={styles.gameArea}>
         <Text style={styles.messageText}>{gameMessage}</Text>

        {/* *** TODO: Replace this Text with the actual GameplayScreen component or visual elements *** */}
        {/* Example: <GameplayScreen sequence={currentSequence} onInput={handlePlayerInput} isDisplaying={isDisplayingSequence} /> */}

        {/* Example buttons for player input (replace with actual game elements) */}
        {isPlayerTurn && (
            <View style={styles.inputButtons}>
                <Button title="Red" onPress={() => handlePlayerInput('red')} />
                <Button title="Blue" onPress={() => handlePlayerInput('blue')} />
                <Button title="Green" onPress={() => handlePlayerInput('green')} />
                <Button title="Yellow" onPress={() => handlePlayerInput('yellow')} />
                 <Button title="Purple" onPress={() => handlePlayerInput('purple')} />
            </View>
        )}

      </View>

      <View style={styles.quitButtonContainer}>
          <Button title="Quit Game" onPress={handleQuitGame} color="#c0392b" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 15,
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  modeText: {
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  levelText: {
    fontSize: 18,
    marginBottom: 10,
    color: '#2c3e50',
  },
  gameArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#bdc3c7',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 15,
    padding: 20,
  },
  messageText: {
      fontSize: 18,
      marginBottom: 20,
      fontStyle: 'italic',
      color: '#34495e',
  },
  inputButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Allow buttons to wrap
    justifyContent: 'center',
    marginTop: 20,
    gap: 10, // Add space between buttons
  },
  quitButtonContainer: {
      width: '60%', // Make quit button reasonably sized
  }
});

export default GameModeScreen;