import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function ScoreCard({ score }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Score:</Text>
      <Text style={styles.score}>{score}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#eee',
    borderRadius: 5,
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    color: '#666',
  },
  score: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default ScoreCard;