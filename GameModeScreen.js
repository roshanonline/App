// screens/GameModeScreen.js
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { View, Text, Button, StyleSheet, Alert, TextInput, TouchableOpacity } from 'react-native';
import Timer from '../components/Timer';
import ScoreCard from '../components/ScoreCard';
import ShapeDisplay from '../components/ShapeDisplay'; // Import the ShapeDisplay component
import { GameContext } from '../context/GameContext';

// --- Constants for Modes ---
const MODES = {
  NUMBERS: 'numbers',
  COLORS: 'colors',
  SHAPES: 'shapes',
};

// --- Helper Functions for Game Logic ---

// Generates a math problem based on level
function generateMathProblem(level) {
  const maxNumber = level * 5 + 5; // Increase numbers with level
  const num1 = Math.floor(Math.random() * maxNumber) + 1;
  const num2 = Math.floor(Math.random() * maxNumber) + 1;
  let operator = '+';
  let answer;

  // Introduce different operators at higher levels
  if (level > 3) {
    operator = Math.random() < 0.5 ? '+' : '-';
  }
  if (level > 6) {
     operator = ['+', '-', '*'][Math.floor(Math.random() * 3)];
  }

  switch (operator) {
    case '-':
      // Ensure non-negative result for simplicity
      answer = Math.max(num1, num2) - Math.min(num1, num2);
      return { question: `${Math.max(num1, num2)} - ${Math.min(num1, num2)} = ?`, answer: answer.toString() };
    case '*':
       answer = num1 * num2;
       return { question: `${num1} * ${num2} = ?`, answer: answer.toString() };
    case '+':
    default:
      answer = num1 + num2;
      return { question: `${num1} + ${num2} = ?`, answer: answer.toString() };
  }
}

// Generates a sequence of colors based on level
function generateColorSequence(level) {
  const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
  const sequenceLength = level + 2; // Sequence length increases with level
  let sequence = [];
  for (let i = 0; i < sequenceLength; i++) {
    sequence.push(colors[Math.floor(Math.random() * Math.min(colors.length, level + 2))]); // Introduce more colors gradually
  }
  return sequence;
}

// Generates a sequence of shapes based on level
function generateShapeSequence(level) {
    const shapes = ['circle', 'square', 'triangle', 'star', 'hexagon']; // Add more shapes
    const sequenceLength = level + 2;
    let sequence = [];
    for (let i = 0; i < sequenceLength; i++) {
        sequence.push(shapes[Math.floor(Math.random() * Math.min(shapes.length, level + 2))]);
    }
    return sequence;
}


// --- Main Component ---
function GameModeScreen({ route, navigation }) {
  const { mode } = route.params; // 'numbers', 'colors', or 'shapes'
  const { score, level, difficulty, nextLevel, updateScore, resetGame } = useContext(GameContext);

  // --- State for all modes ---
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [gameMessage, setGameMessage] = useState('');
  const [timerKey, setTimerKey] = useState(0); // Used to reset Timer component
  const [isLoadingNext, setIsLoadingNext] = useState(true); // Track if preparing next round

  // --- State specific to Numbers mode ---
  const [mathQuestion, setMathQuestion] = useState(null); // { question: '5+3=?', answer: '8' }
  const [playerAnswer, setPlayerAnswer] = useState('');

  // --- State specific to Colors/Shapes mode ---
  const [visualSequence, setVisualSequence] = useState([]); // Array of colors or shapes
  const [displayIndex, setDisplayIndex] = useState(-1); // Which item in sequence is being shown
  const [playerVisualInput, setPlayerVisualInput] = useState([]);
  const [activeItem, setActiveItem] = useState(null); // For visual feedback during display

  // --- Available items for Colors/Shapes modes ---
  const availableColors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange']; // Should match generator
  const availableShapes = ['circle', 'square', 'triangle', 'star', 'hexagon']; // Should match generator

  // --- Shape colors for visual distinction ---
  const shapeColors = {
    circle: '#3498db',    // Blue
    square: '#e74c3c',    // Red
    triangle: '#2ecc71',  // Green
    star: '#f39c12',      // Orange
    hexagon: '#9b59b6'    // Purple
  };

  // --- Game Logic Functions ---

  const prepareNextRound = useCallback(() => {
    setIsLoadingNext(true);
    setIsPlayerTurn(false);
    setPlayerAnswer(''); // Reset number input
    setPlayerVisualInput([]); // Reset visual input
    setActiveItem(null);
    setDisplayIndex(-1);

    let newChallenge;
    if (mode === MODES.NUMBERS) {
      newChallenge = generateMathProblem(level);
      setMathQuestion(newChallenge);
      setGameMessage("Solve the problem:");
      // For numbers, player turn starts immediately after generation
       setTimeout(() => {
          setIsLoadingNext(false);
          startPlayerTurn();
       }, 500); // Short delay

    } else { // Colors or Shapes
      newChallenge = mode === MODES.COLORS ? generateColorSequence(level) : generateShapeSequence(level);
      setVisualSequence(newChallenge);
      setGameMessage("Watch the sequence...");
       // Start displaying the visual sequence after a short delay
      setTimeout(() => {
          setIsLoadingNext(false);
          startSequenceDisplay(newChallenge);
      }, 1000); // 1 second delay
    }
  }, [mode, level, difficulty]); // Dependencies

  // --- Visual Sequence Display Logic ---
  const startSequenceDisplay = (sequence) => {
      setDisplayIndex(0); // Start showing the first item
      setActiveItem(sequence[0]);
      console.log('Displaying sequence:', sequence);

      // Use intervals/timeouts to show each item
      let currentIndex = 0;
      const intervalId = setInterval(() => {
          setActiveItem(null); // Turn off previous item briefly

          setTimeout(() => { // Brief pause before next item
              currentIndex++;
              if (currentIndex < sequence.length) {
                  setActiveItem(sequence[currentIndex]);
                  setDisplayIndex(currentIndex);
              } else {
                  // Sequence finished displaying
                  clearInterval(intervalId);
                  setActiveItem(null);
                  setDisplayIndex(-1);
                  startPlayerTurn(); // Start player's turn
              }
          }, 200); // Pause between items

      }, 800); // How long each item is displayed
  };

  // --- Start Player's Turn ---
  const startPlayerTurn = () => {
    setIsPlayerTurn(true);
    setGameMessage("Your turn!");
    setTimerKey(prevKey => prevKey + 1); // Reset timer
  };

  // --- Handle Player Input (Unified) ---
  const handlePlayerInput = (input) => {
    if (!isPlayerTurn) return;

    if (mode === MODES.NUMBERS) {
      // Logic for numbers mode is handled by checkAnswer button/submission
      // This function is not directly called by number input change
    } else { // Colors or Shapes
      const newPlayerInput = [...playerVisualInput, input];
      setPlayerVisualInput(newPlayerInput);

      // Check correctness step-by-step
      if (visualSequence[newPlayerInput.length - 1] !== input) {
        handleIncorrectInput();
        return;
      }

      // Check if sequence is complete
      if (newPlayerInput.length === visualSequence.length) {
        handleCorrectSequence();
      }
    }
  };

   // --- Handle Number Answer Submission ---
   const checkNumberAnswer = () => {
       if (!isPlayerTurn || mode !== MODES.NUMBERS) return;
        setIsPlayerTurn(false); // Stop timer

       if (playerAnswer.trim() === mathQuestion.answer) {
            handleCorrectSequence(); // Use the same function for success flow
       } else {
            handleIncorrectInput();
       }
   };

   // --- Handle Correct Sequence/Answer ---
   const handleCorrectSequence = () => {
        setIsPlayerTurn(false);
        console.log('Correct!');
        const pointsEarned = 10 * level * (difficulty === 'Hard' ? 2 : 1); // Example scoring
        updateScore(pointsEarned);
        setGameMessage('Correct! Prepare for next level...');
        nextLevel(); // Increment level in context
        // Add a delay before preparing the next round
        setTimeout(() => {
            prepareNextRound();
        }, 1500); // 1.5 second delay
   };

    // --- Handle Incorrect Input/Answer ---
    const handleIncorrectInput = () => {
        setIsPlayerTurn(false);
        console.log('Incorrect!');
        // Navigate to FeedbackScreen (Failure)
        navigation.navigate('Feedback', { success: false, finalScore: score, levelReached: level });
    };

  // --- Handle Timer Running Out ---
  const handleTimeUp = () => {
    if (isPlayerTurn) {
        console.log('Time is up!');
        handleIncorrectInput(); // Treat time up as incorrect
    }
  };

  // --- Handle Quitting --- Fixed quit game function
  const handleQuitGame = () => {
    // Make sure Alert is properly imported at the top
    Alert.alert(
      "Quit Game?",
      "Are you sure you want to quit?",
      [
        { 
          text: "Cancel", 
          style: "cancel" 
        },
        { 
          text: "Quit", 
          style: "destructive", 
          onPress: () => {
            console.log("User confirmed quit");
            resetGame();
            navigation.navigate('Score', { finalScore: score, levelReached: level });
          }
        }
      ]
    );
  };

  // --- Initial Setup Effect ---
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
        console.log(`GameModeScreen focused for mode: ${mode}`);
        resetGame(); // Reset score/level in context when screen focuses
        prepareNextRound(); // Start the first round
    });
    return unsubscribe; // Cleanup listener
  }, [navigation, mode]); // Rerun if mode changes (though usually component remounts)

  // --- Render Game Area based on Mode ---
  const renderGameArea = () => {
    if (isLoadingNext) {
        return <Text style={styles.messageText}>Loading next round...</Text>;
    }

    // Render common message text
    let messageElement = <Text style={styles.messageText}>{gameMessage}</Text>;

    // --- Numbers Mode UI ---
    if (mode === MODES.NUMBERS) {
      return (
        <>
          {messageElement}
          {mathQuestion && <Text style={styles.mathQuestion}>{mathQuestion.question}</Text>}
          <TextInput
            style={styles.numberInput}
            value={playerAnswer}
            onChangeText={setPlayerAnswer}
            keyboardType="number-pad" // Use numeric keyboard
            placeholder="Your Answer"
            editable={isPlayerTurn} // Only allow input on player's turn
            onSubmitEditing={checkNumberAnswer} // Allow submitting with keyboard 'done'/'enter'
          />
          <Button title="Submit Answer" onPress={checkNumberAnswer} disabled={!isPlayerTurn || !playerAnswer} />
        </>
      );
    }

    // --- Colors/Shapes Mode UI ---
    // Display Area (Shows the sequence flashing)
    let displayElement = null;
    if (!isPlayerTurn && displayIndex >= 0 && activeItem) {
        if (mode === MODES.COLORS) {
            displayElement = <View style={[styles.displayBox, { backgroundColor: activeItem }]} />;
        } else if (mode === MODES.SHAPES) {
            // Use ShapeDisplay component to display the shape
            displayElement = (
                <View style={styles.shapeDisplayContainer}>
                    <ShapeDisplay 
                        shape={activeItem} 
                        size={150}
                        color={shapeColors[activeItem] || '#3498db'} 
                        stroke="#2c3e50"
                        strokeWidth={3}
                    />
                </View>
            );
        }
    }

    // Input Area (Buttons for player)
    let inputElement = null;
    if (isPlayerTurn) {
        const items = mode === MODES.COLORS ? availableColors : availableShapes;

        inputElement = (
            <View style={styles.inputGrid}>
                {items.map((item) => {
                    if (mode === MODES.COLORS) {
                        // Color buttons
                        return (
                            <TouchableOpacity
                                key={item}
                                style={[styles.colorButton, { backgroundColor: item }]}
                                onPress={() => handlePlayerInput(item)}
                                disabled={!isPlayerTurn}
                            />
                        );
                    } else {
                        // Shape buttons with ShapeDisplay component
                        return (
                            <TouchableOpacity
                                key={item}
                                style={styles.shapeButton}
                                onPress={() => handlePlayerInput(item)}
                                disabled={!isPlayerTurn}
                            >
                                <ShapeDisplay
                                    shape={item}
                                    size={50}
                                    color={shapeColors[item] || '#3498db'}
                                    stroke="#2c3e50"
                                    strokeWidth={2}
                                />
                            </TouchableOpacity>
                        );
                    }
                })}
            </View>
        );
    }

    return (
      <>
         {messageElement}
         <View style={styles.visualArea}>
             {displayElement}
             {inputElement}
         </View>
      </>
    );
  };


  // --- Main Render ---
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.modeText}>Mode: {mode}</Text>
        <ScoreCard score={score} />
        <Timer key={timerKey} initialTime={mode === MODES.NUMBERS ? 15 : 10} timeUp={handleTimeUp} isRunning={isPlayerTurn} />
      </View>
      <Text style={styles.levelText}>Level: {level}</Text>

      <View style={styles.gameArea}>
        {renderGameArea()}
      </View>

      {/* Modified quit button for better touch response */}
      <TouchableOpacity 
        style={styles.quitButtonContainer} 
        onPress={handleQuitGame}>
        <Text style={styles.quitButtonText}>QUIT GAME</Text>
      </TouchableOpacity>
    </View>
  );
}

// --- Styles ---
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
    flexShrink: 1, // Allow text to shrink if needed
    marginRight: 10,
  },
  levelText: {
    fontSize: 18,
    marginBottom: 10,
    color: '#2c3e50',
  },
  gameArea: {
    flex: 1, // Take up remaining space
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
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
      marginBottom: 25,
      fontStyle: 'italic',
      color: '#34495e',
      textAlign: 'center',
  },
  // --- Numbers Mode Styles ---
  mathQuestion: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2980b9',
  },
  numberInput: {
    borderWidth: 1,
    borderColor: '#95a5a6',
    padding: 15,
    fontSize: 20,
    width: '80%',
    textAlign: 'center',
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  // --- Colors/Shapes Mode Styles ---
  visualArea: {
    flex: 1, // Allow this area to grow
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  displayBox: { // For displaying single color
      width: 150,
      height: 150,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: '#7f8c8d',
  },
  shapeDisplayContainer: {
      width: 150,
      height: 150,
      justifyContent: 'center',
      alignItems: 'center',
  },
  inputGrid: { // Container for color/shape buttons
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    width: '100%', // Ensure it takes width
  },
  colorButton: {
    width: 80,
    height: 80,
    borderRadius: 10,
    margin: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    // Background color set dynamically
  },
  shapeButton: {
     width: 80,
     height: 80,
     borderRadius: 10,
     margin: 10,
     borderWidth: 1,
     borderColor: '#7f8c8d',
     backgroundColor: '#ecf0f1',
     justifyContent: 'center',
     alignItems: 'center',
  },
  // --- Quit Button --- Updated styles
  quitButtonContainer: {
      width: '60%',
      marginBottom: 15,
      backgroundColor: '#c0392b',
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
  },
  quitButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
  }
});

export default GameModeScreen;