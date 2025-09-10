import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, FlatList, SafeAreaView, Platform, StatusBar, TouchableOpacity, Image } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SvgXml } from 'react-native-svg';
import Modal from 'react-native-modal';
import { getAllSongs, getSongsByAlbum, getSongsByCategory, Song } from '../services/api';
import { HomeStackParamList } from '../navigation/HomeStackNavigator';
import GlobalBackground from '../components/GlobalBackground';
import { useHeaderHeight } from '@react-navigation/elements';
import { useFavorites } from '../context/FavoritesContext';
import { usePlayer } from '../context/PlayerContext';

const heartIconXml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
const heartOutlineIconXml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"/></svg>`;
const moreIconXml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>`;

type SongListScreenRouteProp = RouteProp<HomeStackParamList, 'SongList'>;

const SongListScreen = () => {
  const route = useRoute<SongListScreenRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const { type, id, name, imageUrl } = route.params; 
  const headerHeight = useHeaderHeight();

  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const { playQueue } = usePlayer();
  
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

  const handleSongPress = (index: number) => {
    playQueue(songs, index, imageUrl);
  };

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setLoading(true);
        let fetchedSongs: Song[] = [];
        if (type === 'all') {
            fetchedSongs = await getAllSongs();
        } else if (type === 'album' && id) {
          fetchedSongs = await getSongsByAlbum(id);
        } else if (type === 'category' && id) {
          fetchedSongs = await getSongsByCategory(id);
        }
        setSongs(fetchedSongs);
        setError(null);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, [id, type]);
  
  useEffect(() => {
    navigation.setOptions({ title: name });
  }, [name, navigation]);


  const renderSongItem = ({ item, index }: { item: Song, index: number }) => {
    const isSongFavorite = isFavorite(item.id);

    const toggleFavorite = () => {
      if (isSongFavorite) {
        removeFavorite(item.id);
      } else {
        addFavorite(item.id);
      }
    };

    return (
      <TouchableOpacity onPress={() => handleSongPress(index)} style={styles.songItem}>
        {(type === 'album' || type === 'category') && (
           <Image 
            source={imageUrl ? { uri: imageUrl } : require('../assets/images/logo.png')}
            style={styles.albumArt} 
          />
        )}
        <View style={styles.songInfo}>
          <Text style={styles.songTitle}>{item.title}</Text>
          <Text style={styles.songArtist}>{item.artist}</Text>
        </View>
        <TouchableOpacity onPress={toggleFavorite} style={styles.iconButton}>
          <SvgXml 
            xml={isSongFavorite ? heartIconXml : heartOutlineIconXml} 
            width={26} 
            height={26} 
            fill={isSongFavorite ? '#6E44FF' : 'gray'} 
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => openSongMenu(item)} style={styles.iconButton}>
            <SvgXml xml={moreIconXml} width={26} height={26} fill="gray" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <GlobalBackground>
        <View style={[styles.container, styles.center, { paddingTop: Platform.OS === 'android' ? headerHeight : 0 }]}>
          <ActivityIndicator size="large" color="#6E44FF" />
        </View>
      </GlobalBackground>
    );
  }

  if (error) {
    return (
      <GlobalBackground>
        <View style={[styles.container, styles.center, { paddingTop: Platform.OS === 'android' ? headerHeight : 0 }]}>
          <Text style={styles.errorText}>Błąd ładowania piosenek: {error}</Text>
        </View>
      </GlobalBackground>
    );
  }

  return (
    <GlobalBackground>
      <SafeAreaView style={[styles.container, { paddingTop: Platform.OS === 'android' ? headerHeight : 0 }]}>
        <FlatList
          data={songs}
          renderItem={renderSongItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <View style={[styles.center, { flex: 1 }]}>
                <Text style={styles.errorText}>Brak piosenek w tej kolekcji.</Text>
            </View>
          }
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
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
                navigation.navigate('AddToPlaylist', { songId: selectedSong.id });
                closeSongMenu();
              }
            }}
          >
            <Text style={styles.modalButtonText}>Dodaj do playlisty</Text>
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
  albumArt: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 15,
    backgroundColor: '#E0E0E0',
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

export default SongListScreen;
