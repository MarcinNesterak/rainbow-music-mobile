import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import { getNewSongs, Song } from '../services/api';
import GlobalBackground from '../components/GlobalBackground';
import { useHeaderHeight } from '@react-navigation/elements';
import { usePlayer } from '../context/PlayerContext';

const NewReleasesScreen = () => {
  const headerHeight = useHeaderHeight();
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { playQueue } = usePlayer();

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setLoading(true);
        const fetchedSongs = await getNewSongs();
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

  const handleSongPress = (index: number) => {
    playQueue(songs, index);
  };

  const renderSongItem = ({ item, index }: { item: Song, index: number }) => (
    <TouchableOpacity onPress={() => handleSongPress(index)} style={styles.songItem}>
      <View style={styles.songInfo}>
        <Text style={styles.songTitle}>{item.title}</Text>
        <Text style={styles.songArtist}>{item.artist}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <GlobalBackground>
        <View style={[styles.container, styles.center]}>
          <ActivityIndicator size="large" color="#6E44FF" />
        </View>
      </GlobalBackground>
    );
  }

  if (error) {
    return (
      <GlobalBackground>
        <View style={[styles.container, styles.center]}>
          <Text style={styles.errorText}>Błąd ładowania nowości: {error}</Text>
        </View>
      </GlobalBackground>
    );
  }

  return (
    <GlobalBackground>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={songs}
          renderItem={renderSongItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <View style={[styles.center, { flex: 1 }]}>
              <Text style={styles.errorText}>Brak nowości w ostatnim miesiącu.</Text>
            </View>
          }
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
        />
      </SafeAreaView>
    </GlobalBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'black',
    textAlign: 'center',
    margin: 20,
    fontSize: 16
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(242, 242, 247, 0.8)',
    padding: 15,
    borderRadius: 15,
    marginVertical: 8,
    marginHorizontal: 20,
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

export default NewReleasesScreen;
