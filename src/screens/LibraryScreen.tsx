import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, FlatList, SafeAreaView, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { getSongsAlphabetically, Song } from '../services/api'; // Zmieniony import
import { SvgXml } from 'react-native-svg';

// Ikona strzałki "wstecz"
const backArrowIconXml = `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill="black"/></svg>`;

const LibraryScreen = ({ navigation }: any) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setLoading(true);
        const fetchedSongs = await getSongsAlphabetically(); // Użycie nowej funkcji
        setSongs(fetchedSongs);
        setError(null);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  const renderSongItem = ({ item }: { item: Song }) => (
    <View style={styles.songItem}>
      <View style={styles.albumArtPlaceholder} />
      <View style={styles.songInfo}>
        <Text style={styles.songTitle}>{item.title}</Text>
        <Text style={styles.songArtist}>{item.artist}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#6E44FF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>Błąd ładowania piosenek: {error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <SvgXml xml={backArrowIconXml} width="28" height="28" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Biblioteka</Text>
      </View>
      <FlatList
        data={songs}
        renderItem={renderSongItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 10, // Dodajemy padding dla Androida
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    margin: 20,
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    padding: 15,
    borderRadius: 15,
    marginVertical: 8,
    marginHorizontal: 20,
  },
  albumArtPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#E0E0E0',
    marginRight: 15,
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  songArtist: {
    fontSize: 15,
    color: 'gray',
    marginTop: 2,
  },
});

export default LibraryScreen; 