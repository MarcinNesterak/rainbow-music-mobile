import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, ScrollView, Text, View, ActivityIndicator } from 'react-native';
import debounce from 'lodash.debounce';
import { searchSongs, Song } from '../services/api';
import ActionsSection from '../components/ActionsSection';
import AgeCategorySection from '../components/AgeCategorySection';
import SearchBar from '../components/SearchBar';

const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const performSearch = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      setSearchError(null);
      return;
    }
    setIsSearching(true);
    setSearchError(null);
    console.log(`Searching for: "${query}"`);
    try {
      const results = await searchSongs(query);
      console.log('Search results:', results);
      setSearchResults(results);
    } catch (e: any) {
      console.error('Search failed:', e.message);
      setSearchError(e.message);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const debouncedSearch = useCallback(debounce(performSearch, 500), []);

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>Witaj, Marcin!</Text>
      <SearchBar value={searchQuery} onChangeText={setSearchQuery} />

      {isSearching && <ActivityIndicator style={{ marginVertical: 10 }} />}
      {searchError && <Text style={styles.errorText}>Błąd: {searchError}</Text>}

      {searchResults.length > 0 && (
        <View>
          {searchResults.map(song => (
            <Text key={song.id} style={styles.resultItem}>{song.title}</Text>
          ))}
        </View>
      )}

      <ActionsSection />
      <AgeCategorySection />
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
  errorText: {
    color: 'red',
    textAlign: 'center',
    margin: 10,
  },
  resultItem: {
    padding: 10,
    marginHorizontal: 20,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});

export default HomeScreen; 