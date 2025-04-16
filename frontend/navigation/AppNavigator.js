import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import Screens
import HomeScreen from '../screens/HomeScreen';
import GameModeScreen from '../screens/GameModeScreen';
import ChallengesScreen from '../screens/ChallengesScreen';
import FeedbackScreen from '../screens/FeedbackScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import ScoreScreen from '../screens/ScoreScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ // Example: Consistent header style
          headerStyle: { backgroundColor: '#f4511e' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Echo Memory' }}
        />
        <Stack.Screen
            name="GameMode"
            component={GameModeScreen}
            // Options can be set dynamically based on route params
            // options={({ route }) => ({ title: `Mode: ${route.params?.mode || 'Select'}` })}
             options={{ title: 'Select Mode' }}
        />
        <Stack.Screen
            name="Challenges"
            component={ChallengesScreen}
            options={{ title: 'Challenges' }}
        />
        <Stack.Screen
            name="Feedback"
            component={FeedbackScreen}
            options={{ title: 'Round Results' }}
        />
        <Stack.Screen
            name="Leaderboard"
            component={LeaderboardScreen}
            options={{ title: 'Leaderboard' }}
        />
        <Stack.Screen
            name="Score"
            component={ScoreScreen}
            options={{ title: 'Your Score' }}
        />
        <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ title: 'Settings' }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;