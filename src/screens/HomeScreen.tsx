import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, ScrollView, Text, View, ActivityIndicator, FlatList, TouchableWithoutFeedback, SafeAreaView, Platform, StatusBar, TouchableOpacity } from 'react-native';
import debounce from 'lodash.debounce';
import { searchSongs, Song, getNewSongsCount } from '../services/api';
import MyPlaylistsSection from '../components/MyPlaylistsSection';
import SearchBar from '../components/SearchBar';
import CategoriesSection from '../components/CategoriesSection';
import AlbumsSection from '../components/AlbumsSection';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext'; // Krok 1: Import usePlayer
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../navigation/HomeStackNavigator';
import NewReleasesSection from '../components/NewReleasesSection';
import LinearGradient from 'react-native-linear-gradient';

// Komponent do wyświetlania wyników wyszukiwania
const SearchResults = ({ results, isLoading, error, onSongPress }: { results: Song[], isLoading: boolean, error: string | null, onSongPress: (song: Song) => void }) => {
  if (isLoading) {
    return <ActivityIndicator style={{ marginVertical: 20 }} color="#6E44FF" />;
  }
  if (error) {
    return <Text style={styles.errorText}>Błąd wyszukiwania: {error}</Text>;
  }
  if (results.length === 0) {
    return null;
  }

  return (
    <View style={styles.resultsContainer}>
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          // Krok 2: Uczynienie elementu klikalnym
          <TouchableOpacity onPress={() => onSongPress(item)} style={styles.resultItem}>
            <Text style={styles.resultTitle}>{item.title}</Text>
            <Text style={styles.resultArtist}>{item.artist}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const HomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const { session } = useAuth();
  const { playSong, showPlayer } = usePlayer(); // Krok 3: Pobranie funkcji z kontekstu
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchBarLayout, setSearchBarLayout] = useState<{ y: number; height: number } | null>(null);
  const [newSongsCount, setNewSongsCount] = useState(0);

  // Używamy useFocusEffect, aby licznik odświeżał się przy powrocie na ekran
  useFocusEffect(
    useCallback(() => {
      const fetchCount = async () => {
        try {
          const count = await getNewSongsCount();
          setNewSongsCount(count);
        } catch (error) {
          console.error("Nie udało się pobrać liczby nowości:", error);
        }
      };
      fetchCount();
    }, [])
  );

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

  // Krok 4: Funkcja do obsługi naciśnięcia piosenki
  const handleSongPress = (song: Song) => {
    playSong(song);
    showPlayer();
    clearSearch(); // Opcjonalnie: wyczyść wyszukiwanie po wybraniu piosenki
  };

  const showResults = searchQuery.length > 1;

  return (
    <TouchableWithoutFeedback onPress={clearSearch} disabled={!showResults}>
      <SafeAreaView style={styles.container}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={styles.headerContainer}>
            <Text 
              style={styles.headerTitle}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              Witaj, {session?.user?.user_metadata.display_name || session?.user?.email || 'Gościu'}!
            </Text>
          </View>
          <View onLayout={(event) => {
              const { y, height } = event.nativeEvent.layout;
              setSearchBarLayout({ y: y + 20, height });
            }}>
            <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
          </View>
          
          <MyPlaylistsSection />
          <AlbumsSection /> 
          
          {/* Przycisk Nowości */}
          <TouchableOpacity 
            onPress={() => navigation.navigate('NewReleases')}
          >
            <LinearGradient
              colors={['#FFD1DC', '#FFFFB5', '#D1FFD1', '#B5E8FF', '#D1B5FF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.sectionButton}
            >
              <Text style={styles.sectionButtonText}>Nowości</Text>
              {newSongsCount > 0 && (
                <View style={styles.badgeContainer}>
                  <Text style={styles.badgeText}>{newSongsCount}</Text>
                </View>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <CategoriesSection /> 
        </ScrollView>

        {showResults && searchBarLayout && (
          <View
            style={[
              styles.resultsOverlay,
              { top: searchBarLayout.y + searchBarLayout.height }
            ]}
            onStartShouldSetResponder={() => true}
          >
            <SearchResults 
              results={searchResults} 
              isLoading={isSearching} 
              error={searchError} 
              onSongPress={handleSongPress} // Krok 5: Przekazanie funkcji
            />
          </View>
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  // Krok 6: Naprawa błędu - dodanie brakującego stylu
  headerContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000', // Zmiana koloru na czarny
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
    marginHorizontal: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    maxHeight: 300,
  },
  resultItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  resultArtist: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  sectionButton: {
    padding: 20,
    borderRadius: 15,
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
    flexDirection: 'row', // Aby badge pozycjonował się poprawnie
    justifyContent: 'center', // Wyśrodkowanie tekstu
  },
  sectionButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  badgeContainer: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default HomeScreen; 