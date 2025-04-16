import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

function FeedbackScreen({ route, navigation }) {
  const { success, score } = route.params; // Get result from previous screen

  return (
    <View style={[styles.container, success ? styles.successBg : styles.failureBg]}>
      <Text style={styles.title}>{success ? "Well Done!" : "Try Again!"}</Text>
      {/* TODO: Add icons (checkmark/cross) */}
      <Text style={styles.scoreText}>Your Score: {score}</Text>

      {success ? (
        <Button title="Next Level / Continue" onPress={() => navigation.goBack()} /> // Go back to GameMode screen
      ) : (
        <Button title="Retry Level" onPress={() => navigation.goBack()} /> // Go back to GameMode screen (logic there should restart level)
      )}
      <View style={{marginTop: 20}}>
          <Button title="Back to Home" onPress={() => navigation.navigate('Home')} color={success ? '#333' : '#eee'} />
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
  },
  successBg: {
    backgroundColor: '#d4edda', // Light green
  },
  failureBg: {
     backgroundColor: '#f8d7da', // Light red
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
  },
   scoreText: {
    fontSize: 24,
    marginBottom: 40,
  },
});

export default FeedbackScreen;