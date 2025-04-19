// navigation/AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import Screens
import HomeScreen from '../screens/HomeScreen';
import GameModeScreen from '../screens/GameModeScreen';
import ChallengesScreen from '../screens/ChallengesScreen';
import FeedbackScreen from '../screens/FeedbackScreen'; // <-- Import
import LeaderboardScreen from '../screens/LeaderboardScreen';
import ScoreScreen from '../screens/ScoreScreen';     // <-- Import
import SettingsScreen from '../screens/SettingsScreen';
// Import GameplayScreen if you decide to use it as a separate screen
// import GameplayScreen from '../screens/GameplayScreen';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        {/* Define screens and their corresponding components */}
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Echo Memory' }}/>
        <Stack.Screen name="GameMode" component={GameModeScreen} options={{ title: 'Select Mode' }} />
        <Stack.Screen name="Challenges" component={ChallengesScreen} options={{ title: 'Challenges' }}/>
        {/* Add FeedbackScreen to the navigator */}
        <Stack.Screen
            name="Feedback"
            component={FeedbackScreen}
            options={{ title: 'Round Results', headerBackVisible: false }} // Hide back button maybe
        />
        <Stack.Screen name="Leaderboard" component={LeaderboardScreen} options={{ title: 'Leaderboard' }}/>
        {/* Add ScoreScreen to the navigator */}
        <Stack.Screen
            name="Score"
            component={ScoreScreen}
            options={{ title: 'Final Score', headerBackVisible: false }} // Hide back button maybe
        />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }}/>
        {/* Add GameplayScreen if using it as a screen */}
        {/* <Stack.Screen name="Gameplay" component={GameplayScreen} options={{ title: 'Play!' }}/> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;  