import React from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import ActionsSection from '../components/ActionsSection';
import AgeCategorySection from '../components/AgeCategorySection';

const HomeScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>Witaj, Marcin!</Text>
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