// screens/LeaderboardScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { fetchAllTimeLeaderboard, fetchDailyLeaderboard } from '../utils/api';

const LeaderboardScreen = ({ navigation }) => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeFilter, setTimeFilter] = useState('ALL_TIME'); // 'ALL_TIME' or 'DAILY'

  useEffect(() => {
    loadLeaderboardData();
  }, [timeFilter]);

  const loadLeaderboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let data;
      if (timeFilter === 'ALL_TIME') {
        data = await fetchAllTimeLeaderboard();
      } else {
        data = await fetchDailyLeaderboard();
      }
      
      setLeaderboardData(data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load leaderboard:', err);
      setError('Failed to load leaderboard');
      setLoading(false);
    }
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.scoreItem}>
      <Text style={styles.rank}>{index + 1}</Text>
      <Text style={styles.username}>{item.username}</Text>
      <Text style={styles.score}>{item.score}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Leaderboard</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.title}>Top Memory Masters</Text>
      
      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[styles.filterButton, timeFilter === 'ALL_TIME' && styles.activeFilter]}
          onPress={() => setTimeFilter('ALL_TIME')}
        >
          <Text style={styles.filterText}>ALL TIME</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.filterButton, timeFilter === 'DAILY' && styles.activeFilter]}
          onPress={() => setTimeFilter('DAILY')}
        >
          <Text style={styles.filterText}>TODAY</Text>
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <ActivityIndicator size="large" color="#0066cc" />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadLeaderboardData}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : leaderboardData.length === 0 ? (
        <Text style={styles.noScoresText}>No scores available</Text>
      ) : (
        <FlatList
          data={leaderboardData}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={styles.listContainer}
        />
      )}
      
      <TouchableOpacity 
        style={styles.homeButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.homeButtonText}>BACK TO HOME</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
  },
  backButton: {
    fontSize: 16,
    color: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
  },
  activeFilter: {
    backgroundColor: '#0066cc',
  },
  filterText: {
    fontWeight: '500',
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  scoreItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  rank: {
    width: 30,
    fontWeight: 'bold',
    fontSize: 16,
  },
  username: {
    flex: 1,
    fontSize: 16,
  },
  score: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#0066cc',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontWeight: '500',
  },
  noScoresText: {
    textAlign: 'center',
    padding: 20,
    color: '#666',
  },
  homeButton: {
    backgroundColor: '#0066cc',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  homeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default LeaderboardScreen;