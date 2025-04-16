import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { UserProvider } from './context/UserContext';
import { GameProvider } from './context/GameContext';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <UserProvider>
        <GameProvider>
          <AppNavigator />
          <StatusBar style="auto" />
        </GameProvider>
      </UserProvider>
    </SafeAreaProvider>
  );
}