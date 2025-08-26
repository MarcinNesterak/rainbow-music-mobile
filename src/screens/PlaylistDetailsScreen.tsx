import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, SafeAreaView, Platform } from 'react-native';
import { useRoute, useFocusEffect, RouteProp } from '@react-navigation/native';
import { HomeStackParamList } from '../navigation/HomeStackNavigator';
import { getSongsByPlaylist, Song, removeSongFromPlaylist } from '../services/api';
import GlobalBackground from '../components/GlobalBackground';
import { useHeaderHeight } from '@react-navigation/elements';
import Modal from 'react-native-modal';
import { SvgXml } from 'react-native-svg';
import { usePlayer } from '../context/PlayerContext'; // <-- Import

const moreIconXml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>`;

type PlaylistDetailsScreenRouteProp = RouteProp<HomeStackParamList, 'PlaylistDetails'>;

const PlaylistDetailsScreen = () => {
  const route = useRoute<PlaylistDetailsScreenRouteProp>();
  const headerHeight = useHeaderHeight();
  const { playlistId, imageUrl, coverColor } = route.params; // <-- Pobieramy coverColor
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const { playQueue } = usePlayer(); // <-- Pobieramy funkcje

  // Modal-related state
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);

  const openSongMenu = (song: Song) => {
    setSelectedSong(song);
    setModalVisible(true);
  };

  const closeSongMenu = () => {
    setModalVisible(false);
    setSelectedSong(null);
  };

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

  const handleSongPress = (index: number) => {
    playQueue(songs, index, imageUrl, coverColor);
  };

  const handleRemoveSong = (songToRemove: Song) => {
    closeSongMenu(); // Zamknij menu od razu
    Alert.alert(
      'Usuń piosenkę',
      `Czy na pewno chcesz usunąć "${songToRemove.title}" z tej playlisty?`,
      [
        { text: 'Anuluj', style: 'cancel' },
        {
          text: 'Usuń',
          style: 'destructive',
          onPress: async () => {
            // Optymistyczne usunięcie z UI
            setSongs(currentSongs => currentSongs.filter(song => song.id !== songToRemove.id));
            try {
              await removeSongFromPlaylist(playlistId, songToRemove.id);
            } catch (error) {
              Alert.alert('Błąd', 'Nie udało się usunąć piosenki.');
              // W razie błędu, odśwież listę z serwera, aby przywrócić piosenkę
              fetchSongs();
            }
          },
        },
      ]
    );
  };

  const renderSongItem = ({ item, index }: { item: Song, index: number }) => (
    <TouchableOpacity style={styles.songItem} onPress={() => handleSongPress(index)}>
      <View style={styles.songInfo}>
        <Text style={styles.songTitle}>{item.title}</Text>
        <Text style={styles.songArtist}>{item.artist}</Text>
      </View>
      <TouchableOpacity onPress={() => openSongMenu(item)} style={styles.iconButton}>
        <SvgXml xml={moreIconXml} width={26} height={26} fill="gray" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <GlobalBackground>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={songs}
          keyExtractor={(item) => item.id}
          renderItem={renderSongItem}
          ListHeaderComponent={<View style={{ height: headerHeight }} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Ta playlista jest jeszcze pusta.</Text>
            </View>
          }
          contentContainerStyle={{ flexGrow: 1 }}
        />
      </SafeAreaView>
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={closeSongMenu}
        onSwipeComplete={closeSongMenu}
        swipeDirection={['down']}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{selectedSong?.title}</Text>
          <Text style={styles.modalArtist}>{selectedSong?.artist}</Text>
          <View style={styles.separator} />
          <TouchableOpacity 
            style={styles.modalButton}
            onPress={() => {
              if (selectedSong) {
                handleRemoveSong(selectedSong);
              }
            }}
          >
            <Text style={[styles.modalButtonText, { color: 'red' }]}>Usuń z tej playlisty</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </GlobalBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(242, 242, 247, 0.8)',
    borderRadius: 15,
    marginVertical: 8,
    marginHorizontal: 20,
  },
  songInfo: {
    flex: 1,
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
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: 'gray',
  },
  iconButton: {
    padding: 5,
    marginLeft: 10,
  },
  // Modal Styles
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalArtist: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginBottom: 20,
  },
  modalButton: {
    padding: 15,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
  },
  modalButtonText: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default PlaylistDetailsScreen; 