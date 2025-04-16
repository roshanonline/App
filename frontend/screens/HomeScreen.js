import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

// Placeholder - Replace with actual CustomButton later
// import CustomButton from '../components/Buttons/CustomButton';

const GAME_MODES = [
  { id: 'numbers', label: 'Numbers' },
  { id: 'colors', label: 'Colors' },
  { id: 'shapes', label: 'Shapes' },
];

function HomeScreen({ navigation }) {

  const handleStartGame = (modeId) => {
    navigation.navigate('GameMode', { mode: modeId });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Echo Memory</Text>

      <View style={styles.modesContainer}>
        <Text style={styles.subtitle}>Select Mode:</Text>
        {GAME_MODES.map((mode) => (
          <View key={mode.id} style={styles.buttonWrapper}>
            <Button
                title={mode.label}
                onPress={() => handleStartGame(mode.id)}
            />
          </View>
        ))}
      </View>

      <View style={styles.footerButtons}>
         <Button title="Settings" onPress={() => navigation.navigate('Settings')} />
         <Button title="Leaderboard" onPress={() => navigation.navigate('Leaderboard')} />
         <Button title="Challenges" onPress={() => navigation.navigate('Challenges')} />
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
    backgroundColor: '#f0f8ff', // Light background
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 15,
    color: '#555',
  },
  modesContainer: {
    marginBottom: 40,
    alignItems: 'center',
    width: '100%',
  },
  buttonWrapper: {
    marginVertical: 8,
    width: '70%',
  },
  footerButtons: {
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
  },
});

export default HomeScreen;