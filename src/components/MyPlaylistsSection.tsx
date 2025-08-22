import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../navigation/HomeStackNavigator';
import { useAuth } from '../context/AuthContext';
import { getUserPlaylists, Playlist } from '../services/api';

// Prosta ikona plusa w formacie SVG
const plusIcon = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 5V19" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M5 12H19" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

const AddPlaylistButton = ({ onPress }: { onPress: () => void }) => {
  return (
    <TouchableOpacity style={styles.addButtonItem} onPress={onPress}>
      <SvgXml xml={plusIcon} width="24" height="24" />
      <Text style={styles.addButtonTitle}>Dodaj playlistę</Text>
    </TouchableOpacity>
  );
};

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
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPlaylists = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const userPlaylists = await getUserPlaylists(user.id);
      setPlaylists(userPlaylists);
    } catch (error: any) {
      Alert.alert('Błąd', 'Nie udało się pobrać playlist.');
    } finally {
      setLoading(false);
    }
  }, [user]);

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
  addButtonItem: {
    backgroundColor: '#F2F2F7',
    borderRadius: 15,
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  addButtonTitle: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
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