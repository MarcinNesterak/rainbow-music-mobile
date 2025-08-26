import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../navigation/HomeStackNavigator';
import { useAuth } from '../context/AuthContext';
import { getUserPlaylists, Playlist } from '../services/api';
import AddPlaylistButton from './AddPlaylistButton'; // Importujemy nowy komponent

// Typ dla pojedynczej playlisty, przyda się w przyszłości
// Już zaimportowany z api.ts

// Na razie pusta tablica na playlisty, w przyszłości będzie pobierana z API
const DUMMY_PLAYLISTS: Playlist[] = [];

const a_playlist_background_colors = [
  '#FFC107', '#FF5722', '#E91E63', '#9C27B0', '#3F51B5', '#03A9F4', '#009688', '#8BC34A'
];

const getRandomColor = () => {
  return a_playlist_background_colors[Math.floor(Math.random() * a_playlist_background_colors.length)];
};


const PlaylistTile = ({ item }: { item: Playlist }) => {
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  // Używamy zapisanego koloru, z domyślnym szarym, jeśli go nie ma
  const backgroundColor = item.cover_color || '#8E8E93'; 

  return (
    <TouchableOpacity 
      style={[styles.item, { backgroundColor }]}
      onPress={() => navigation.navigate('PlaylistDetails', { 
        playlistId: item.id, 
        playlistName: item.name,
        coverColor: backgroundColor, // <-- Dodajemy kolor
        imageUrl: null // Na razie brak obrazka dla playlist
      })}
    >
      <Text style={styles.playlistTitle}>{item.name}</Text>
    </TouchableOpacity>
  );
};

const MyPlaylistsSection = () => {
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const { session } = useAuth(); // Zmieniamy user na session
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPlaylists = useCallback(async () => {
    if (!session?.user) { // Sprawdzamy, czy istnieje sesja i użytkownik
      setPlaylists([]); // Czyścimy playlisty, jeśli użytkownik nie jest zalogowany
      return;
    };
    try {
      setLoading(true);
      const userPlaylists = await getUserPlaylists(session.user.id);
      setPlaylists(userPlaylists);
    } catch (error: any) {
      Alert.alert('Błąd', 'Nie udało się pobrać playlist.');
    } finally {
      setLoading(false);
    }
  }, [session]); // Zależność od sesji, a nie od użytkownika

  useFocusEffect(
    useCallback(() => {
      fetchPlaylists();
    }, [fetchPlaylists])
  );

  const handleAddPlaylist = () => {
    navigation.navigate('CreatePlaylist');
  };

  return (
    <View style={styles.sectionContainer}>
      <TouchableOpacity onPress={() => navigation.navigate('Playlists')}>
        <Text style={styles.sectionTitle}>Moje playlisty</Text>
      </TouchableOpacity>
      <FlatList
        data={playlists}
        renderItem={({ item }) => <PlaylistTile item={item} />}
        ListHeaderComponent={<AddPlaylistButton onPress={handleAddPlaylist} />}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        // Usunięte onRefresh i refreshing, bo useFocusEffect załatwia sprawę
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 20,
    marginBottom: 10,
  },
  listContent: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  // Ten styl będzie używany dla prawdziwych playlist
  item: {
    borderRadius: 15,
    width: 140,
    height: 140,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    marginRight: 15,
    padding: 15,
    overflow: 'hidden',
  },
  playlistTitle: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16,
  }
});

export default MyPlaylistsSection; 