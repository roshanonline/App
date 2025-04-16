import React, { createContext, useState, useMemo } from 'react';

export const GameContext = createContext(null);

export const GameProvider = ({ children }) => {
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [difficulty, setDifficulty] = useState('Medium'); // Easy, Medium, Hard
  // Add more game state as needed: currentSequence, playerInput, feedbackMessage etc.

  const updateScore = (points) => {
    setScore(prevScore => prevScore + points);
  };

  const nextLevel = () => {
    setLevel(prevLevel => prevLevel + 1);
  };

  const resetGame = () => {
      setScore(0);
      setLevel(1);
      // Reset other relevant game state here
      console.log('Game Reset');
  };

  const value = useMemo(() => ({
    score,
    level,
    difficulty,
    setDifficulty, // Allow settings screen to change it
    updateScore,
    nextLevel,
    resetGame,
  }), [score, level, difficulty]); // Dependencies for useMemo

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};