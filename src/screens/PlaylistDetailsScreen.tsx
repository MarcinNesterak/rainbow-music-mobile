import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useFocusEffect, RouteProp } from '@react-navigation/native';
import { HomeStackParamList } from '../navigation/HomeStackNavigator';
import { addSongToPlaylist, getSongsByPlaylist, Song } from '../services/api'; // getSongsByPlaylist to be created

type PlaylistDetailsScreenRouteProp = RouteProp<HomeStackParamList, 'PlaylistDetails'>;

const PlaylistDetailsScreen = () => {
  const route = useRoute<PlaylistDetailsScreenRouteProp>();
  const { playlistId, playlistName } = route.params;
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);

  // TODO: Create getSongsByPlaylist in api.ts
  const fetchSongs = useCallback(async () => {
    setLoading(true);
    try {
      const playlistSongs = await getSongsByPlaylist(playlistId);
      setSongs(playlistSongs);
    } catch (error) {
      Alert.alert('Błąd', 'Nie udało się wczytać piosenek z playlisty.');
    } finally {
      setLoading(false);
    }
  }, [playlistId]);

  useFocusEffect(
    useCallback(() => {
      fetchSongs();
    }, [fetchSongs])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.playlistName}>{playlistName}</Text>
      <FlatList
        data={songs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.songItem}>
            <Text style={styles.songTitle}>{item.title}</Text>
            <Text style={styles.songArtist}>{item.artist}</Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Ta playlista jest jeszcze pusta.</Text>
          </View>
        }
        contentContainerStyle={{ flexGrow: 1 }}
      />
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>Dodaj utwory</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  playlistName: {
    fontSize: 28,
    fontWeight: 'bold',
    padding: 20,
  },
  songItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  songTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  songArtist: {
    fontSize: 14,
    color: '#888',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
  addButton: {
    backgroundColor: '#6E44FF',
    margin: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PlaylistDetailsScreen; 