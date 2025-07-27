import React, { useState } from 'react';
import { StyleSheet, ScrollView, Text } from 'react-native';
import ActionsSection from '../components/ActionsSection';
import AgeCategorySection from '../components/AgeCategorySection';
import SearchBar from '../components/SearchBar';

const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>Witaj, Marcin!</Text>
      <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
      <ActionsSection />
      <AgeCategorySection />
      {/* Tutaj w przyszłości dodamy kolejne sekcje */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    margin: 20,
  },
});

export default HomeScreen; 