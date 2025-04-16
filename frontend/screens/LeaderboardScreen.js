import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Button } from 'react-native';
import { fetchLeaderboard } from '../utils/api'; // Import API function

function LeaderboardScreen({ navigation }) {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all-time'); // Example filter state

  const loadScores = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchLeaderboard(filter);
      if (result.success) {
          setScores(result.data);
      } else {
          setError(result.message || 'Failed to load scores');
      }
    } catch (err) {
      setError('An error occurred while fetching scores.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filter]); // Reload when filter changes

  useEffect(() => {
    loadScores();
  }, [loadScores]); // Dependency array includes loadScores

  const renderScoreItem = ({ item, index }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.rank}>{index + 1}.</Text>
      <Text style={styles.name}>{item.userName}</Text>
      <Text style={styles.score}>{item.score}</Text>
      {/* <Text style={styles.mode}>({item.gameMode})</Text> */}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Top Memory Masters</Text>
      {/* Add Filter Buttons Here */}
      <View style={styles.filterContainer}>
         <Button title="All Time" onPress={() => setFilter('all-time')} disabled={filter === 'all-time'}/>
         {/* <Button title="Weekly" onPress={() => setFilter('weekly')} disabled={filter === 'weekly'}/>
         <Button title="Daily" onPress={() => setFilter('daily')} disabled={filter === 'daily'}/> */}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={scores}
          renderItem={renderScoreItem}
          keyExtractor={(item) => item._id || Math.random().toString()} // Use _id from DB if available
          style={styles.list}
        />
      )}
        <Button title="Back to Home" onPress={() => navigation.navigate('Home')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  filterContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 15,
      gap: 10,
  },
  list: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  rank: {
    fontWeight: 'bold',
    width: 30,
  },
  name: {
    flex: 1, // Take remaining space
    fontSize: 16,
  },
  score: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  mode: {
      fontSize: 12,
      color: '#666',
      marginLeft: 5,
  },
  errorText: {
      color: 'red',
      textAlign: 'center',
      marginTop: 20,
  }
});

export default LeaderboardScreen;