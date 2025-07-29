import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, ScrollView, Text, View, ActivityIndicator, FlatList, TouchableWithoutFeedback, SafeAreaView } from 'react-native';
import debounce from 'lodash.debounce';
import { searchSongs, Song } from '../services/api';
import ActionsSection from '../components/ActionsSection';
import AgeCategorySection from '../components/AgeCategorySection';
import SearchBar from '../components/SearchBar';
import CategoriesSection from '../components/CategoriesSection';
import AlbumsSection from '../components/AlbumsSection'; // Import nowej sekcji

// Komponent do wyświetlania wyników wyszukiwania
const SearchResults = ({ results, isLoading, error }: { results: Song[], isLoading: boolean, error: string | null }) => {
  if (isLoading) {
    return <ActivityIndicator style={{ marginVertical: 20 }} color="#6E44FF" />;
  }
  if (error) {
    return <Text style={styles.errorText}>Błąd wyszukiwania: {error}</Text>;
  }
  if (results.length === 0) {
    return null; // Nie pokazuj nic, jeśli nie ma wyników
  }

  return (
    <View style={styles.resultsContainer}>
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.resultItem}>
            <Text style={styles.resultTitle}>{item.title}</Text>
          </View>
        )}
      />
    </View>
  );
};

const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchBarLayout, setSearchBarLayout] = useState<{ y: number; height: number } | null>(null);

  const performSearch = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      setSearchError(null);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    setSearchError(null);
    try {
      const results = await searchSongs(query);
      setSearchResults(results);
    } catch (e: any) {
      setSearchError(e.message);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const debouncedSearch = useCallback(debounce(performSearch, 400), []);

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  const showResults = searchQuery.length > 1;

  return (
    <TouchableWithoutFeedback onPress={clearSearch} disabled={!showResults}>
      <SafeAreaView style={styles.container}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <Text style={styles.headerTitle}>Witaj, Marcin!</Text>
          <View onLayout={(event) => {
              const { y, height } = event.nativeEvent.layout;
              // Dodajemy 10 pikseli marginesu z góry nagłówka
              setSearchBarLayout({ y: y + 20, height });
            }}>
            <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
          </View>
          
          <ActionsSection />
          <AlbumsSection /> 
          <CategoriesSection /> 
          <AgeCategorySection />

        </ScrollView>

        {showResults && searchBarLayout && (
          <View
            style={[
              styles.resultsOverlay,
              { top: searchBarLayout.y + searchBarLayout.height }
            ]}
            onStartShouldSetResponder={() => true}
          >
            <SearchResults results={searchResults} isLoading={isSearching} error={searchError} />
          </View>
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent', // Przywracamy przezroczyste tło
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    margin: 20,
    marginBottom: 10,
  },
  resultsOverlay: {
    position: 'absolute',
    left: 20,
    right: 20,
    zIndex: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 10,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    margin: 15,
  },
  resultsContainer: {
    marginHorizontal: 0, // Usunięty margines, bo jest już w `resultsOverlay`
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    maxHeight: 300, // Zwiększona maksymalna wysokość
  },
  resultItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  resultTitle: {
    fontSize: 16,
  },
});

export default HomeScreen; 