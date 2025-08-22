import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Text, FlatList, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { getFavoriteSongs, Song } from '../services/api'; // Użyjemy getFavoriteSongs
import { SvgXml } from 'react-native-svg';
import GlobalBackground from '../components/GlobalBackground';
import { useFocusEffect } from '@react-navigation/native';
import { useFavorites } from '../context/FavoritesContext'; // Wciąż potrzebne dla isFavorite
import { usePlayer } from '../context/PlayerContext';

const heartIconXml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#6E44FF"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;

const FavoritesScreen = () => {
  const { session } = useAuth();
  const { removeFavorite } = useFavorites(); // Pobieramy tylko funkcję do usuwania
  const { playSong, showPlayer } = usePlayer();
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    try {
      const favoriteSongs = await getFavoriteSongs(session.user.id);
      setSongs(favoriteSongs);
    } catch (error) {
      console.error("Failed to fetch favorite songs:", error);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useFocusEffect(
    useCallback(() => {
      fetchFavorites();
    }, [fetchFavorites])
  );

  const handleRemoveFavorite = async (songId: string) => {
    // Optymistyczne usunięcie z UI
    setSongs(prevSongs => prevSongs.filter(s => s.id !== songId));
    // Usunięcie z bazy danych w tle
    await removeFavorite(songId);
  };

  const handleSongPress = (song: Song) => {
    playSong(song);
    showPlayer();
  };

  const renderFavoriteItem = ({ item }: { item: Song }) => (
    <TouchableOpacity style={styles.songItem} onPress={() => handleSongPress(item)}>
      <View style={styles.songInfo}>
        <Text style={styles.songTitle}>{item.title}</Text>
        <Text style={styles.songArtist}>{item.artist}</Text>
      </View>
      <TouchableOpacity onPress={() => handleRemoveFavorite(item.id)} style={styles.iconButton}>
        <SvgXml xml={heartIconXml} width={26} height={26} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator size="large" color="#6E44FF" />;
    }
    if (songs.length === 0) {
      return <Text style={styles.placeholderText}>Twoje ulubione piosenki pojawią się tutaj.</Text>;
    }
    return (
      <FlatList
        data={songs}
        renderItem={renderFavoriteItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
      />
    );
  };

  return (
    <GlobalBackground>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Ulubione</Text>
        </View>
        <View style={styles.content}>
          {renderContent()}
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
  },
  placeholderText: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
  },
  // Style skopiowane i dostosowane z SongListScreen
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(242, 242, 247, 0.8)',
    padding: 15,
    borderRadius: 15,
    marginVertical: 8,
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
  heartIcon: {
    marginLeft: 15,
  }
});

export default FavoritesScreen;
