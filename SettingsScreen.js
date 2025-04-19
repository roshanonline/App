import React, { useState, useContext } from 'react';
import { View, Text, Switch, Button, StyleSheet } from 'react-native';
import { GameContext } from '../context/GameContext'; // To set difficulty

function SettingsScreen({ navigation }) {
  const { difficulty, setDifficulty } = useContext(GameContext);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  // const [theme, setTheme] = useState('light'); // 'light' or 'dark'

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.settingItem}>
        <Text style={styles.label}>Sound Effects</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={soundEnabled ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => setSoundEnabled(previousState => !previousState)}
          value={soundEnabled}
        />
      </View>

      <View style={styles.settingItem}>
        <Text style={styles.label}>Notifications</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={notificationsEnabled ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => setNotificationsEnabled(previousState => !previousState)}
          value={notificationsEnabled}
        />
      </View>

       <View style={styles.settingItem}>
          <Text style={styles.label}>Difficulty</Text>
          {/* TODO: Replace with nicer Picker or Segmented Control */}
          <View style={styles.difficultyButtons}>
              <Button title="Easy" onPress={() => setDifficulty('Easy')} disabled={difficulty === 'Easy'}/>
              <Button title="Medium" onPress={() => setDifficulty('Medium')} disabled={difficulty === 'Medium'}/>
              <Button title="Hard" onPress={() => setDifficulty('Hard')} disabled={difficulty === 'Hard'}/>
          </View>
        </View>

      {/* TODO: Add Language Settings */}
      {/* TODO: Add Theme Toggle (Light/Dark) */}

      <View style={styles.buttonContainer}>
        <Button title="Back to Home" onPress={() => navigation.navigate('Home')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 18,
  },
  difficultyButtons: {
    flexDirection: 'row',
    gap: 5,
  },
  buttonContainer: {
    marginTop: 40,
  }
});

export default SettingsScreen;