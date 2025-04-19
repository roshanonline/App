import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

function ChallengesScreen({ navigation }) {
  // TODO: Fetch challenges from backend or define static ones
  const challenges = [
    { id: '1', name: 'Daily Dose of Digits', description: 'Memorize 10 numbers!', type: 'daily' },
    { id: '2', name: 'Color Chaos', description: 'Colors flash faster!', type: 'distraction' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Challenges</Text>
      {challenges.map(challenge => (
        <View key={challenge.id} style={styles.challengeItem}>
            <Text style={styles.challengeName}>{challenge.name} ({challenge.type})</Text>
            <Text>{challenge.description}</Text>
            <Button title="Attempt" onPress={() => alert(`Starting ${challenge.name}`)} />
        </View>
      ))}
      <Button title="Back to Home" onPress={() => navigation.navigate('Home')} />
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
    marginBottom: 20,
    textAlign: 'center',
  },
  challengeItem: {
      marginBottom: 15,
      padding: 15,
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 5,
  },
   challengeName: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 5,
   }
});

export default ChallengesScreen;