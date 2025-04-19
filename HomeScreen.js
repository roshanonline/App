// Frontend/screens/HomeScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Import gradient
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Example icon set

// Define color constants for easier theme management
const COLORS = {
  primary: '#4A90E2', // A nice blue
  primaryDark: '#0E4B9E',
  secondary: '#50E3C2', // A teal/turquoise accent
  lightGradientStart: '#E0F2F7', // Light blue/cyan
  lightGradientEnd: '#B3E0F2',   // Slightly darker blue/cyan
  white: '#FFFFFF',
  darkText: '#333333',
  lightText: '#FFFFFF',
  greyText: '#888888',
  iconColor: '#5A6A7A',
};

const GAME_MODES = [
  { id: 'numbers', label: 'Numbers', icon: 'numeric' }, // Added icons
  { id: 'colors', label: 'Colors', icon: 'palette' },
  { id: 'shapes', label: 'Shapes', icon: 'shape-outline' },
];

function HomeScreen({ navigation }) {

  const handleStartGame = (modeId) => {
    navigation.navigate('GameMode', { mode: modeId });
  };

  return (
    // Use SafeAreaView for notches and status bars
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      {/* Apply gradient background */}
      <LinearGradient
        colors={[COLORS.lightGradientStart, COLORS.lightGradientEnd]}
        style={styles.container}
      >
        {/* Header Section (Optional) */}
        {/* <View style={styles.header}>
            <Text style={styles.headerTitle}>Welcome</Text>
        </View> */}

        {/* Main Content Area */}
        <View style={styles.mainContent}>
            <Text style={styles.title}>Echo Memory</Text>
            <Text style={styles.subtitle}>Select Mode:</Text>

            {/* Mode Selection Buttons */}
            <View style={styles.modesContainer}>
                {GAME_MODES.map((mode) => (
                <TouchableOpacity
                    key={mode.id}
                    style={styles.modeButton}
                    onPress={() => handleStartGame(mode.id)}
                    activeOpacity={0.7} // Visual feedback on press
                >
                    <Icon name={mode.icon} size={24} color={COLORS.lightText} style={styles.modeIcon} />
                    <Text style={styles.modeButtonText}>{mode.label}</Text>
                </TouchableOpacity>
                ))}
            </View>
        </View>


        {/* Footer Navigation Area */}
        <View style={styles.footerContainer}>
          <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Settings')}>
            <Icon name="cog-outline" size={28} color={COLORS.iconColor} />
            <Text style={styles.footerButtonText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Leaderboard')}>
            <Icon name="trophy-variant-outline" size={28} color={COLORS.iconColor} />
            <Text style={styles.footerButtonText}>Leaderboard</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Challenges')}>
            <Icon name="target" size={28} color={COLORS.iconColor} />
            <Text style={styles.footerButtonText}>Challenges</Text>
          </TouchableOpacity>
        </View>

      </LinearGradient>
    </SafeAreaView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1, // Takes full height
    alignItems: 'center', // Center items horizontally
    justifyContent: 'space-between', // Pushes header/footer to top/bottom
    paddingVertical: 30, // Add some padding top and bottom
    paddingHorizontal: 20, // Add side padding
  },
  mainContent: {
      width: '100%',
      alignItems: 'center',
      flex: 1, // Allow main content to grow
      justifyContent: 'center', // Center mode buttons vertically
  },
  title: {
    fontSize: 42, // Larger title
    fontWeight: 'bold', // Bolder
    color: COLORS.primaryDark, // Use dark primary color
    marginBottom: 20, // Space below title
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18, // Slightly larger subtitle
    color: COLORS.darkText, // Darker text
    marginBottom: 30, // More space before buttons
    textAlign: 'center',
  },
  modesContainer: {
    width: '90%', // Buttons take up most width
    alignItems: 'center', // Center buttons if container is wider
  },
  modeButton: {
    flexDirection: 'row', // Icon and text side-by-side
    alignItems: 'center',
    backgroundColor: COLORS.primary, // Use primary color
    paddingVertical: 18, // More padding vertically
    paddingHorizontal: 25, // More padding horizontally
    borderRadius: 30, // Fully rounded ends
    marginBottom: 18, // Space between buttons
    width: '100%', // Make buttons fill container width
    justifyContent: 'center', // Center content inside button
    // Shadow for depth
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Elevation for Android shadow
  },
  modeIcon: {
      marginRight: 10, // Space between icon and text
  },
  modeButtonText: {
    color: COLORS.lightText, // White text on button
    fontSize: 18,
    fontWeight: '600', // Semi-bold
  },
  // Footer Styles
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    paddingTop: 15, // Space above footer buttons
    // Optional: Add a border top or different background
    // borderTopWidth: 1,
    // borderTopColor: '#DDDDDD',
    // backgroundColor: 'rgba(255, 255, 255, 0.5)', // Semi-transparent white
    // borderRadius: 15,
    // paddingBottom: 10,
  },
  footerButton: {
    alignItems: 'center', // Center icon and text vertically
    padding: 10,
  },
  footerButtonText: {
    color: COLORS.iconColor, // Use consistent icon color
    fontSize: 12, // Smaller text for footer
    marginTop: 4, // Space between icon and text
  },
});

export default HomeScreen;