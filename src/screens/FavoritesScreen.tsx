import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform } from 'react-native';
import GlobalBackground from '../components/GlobalBackground';

const FavoritesScreen = () => {
  return (
    <GlobalBackground>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Ulubione</Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.placeholderText}>Twoje ulubione piosenki pojawią się tutaj.</Text>
        </View>
      </SafeAreaView>
    </GlobalBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: 'gray',
  },
});

export default FavoritesScreen;
