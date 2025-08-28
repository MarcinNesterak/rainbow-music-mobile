import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, Platform, StatusBar, Alert } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useHeaderHeight } from '@react-navigation/elements';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../navigation/HomeStackNavigator';
import { useAuth } from '../context/AuthContext';
import { deletePlaylist, getUserPlaylists, Playlist } from '../services/api';
import GlobalBackground from '../components/GlobalBackground';
import AddPlaylistButton from '../components/AddPlaylistButton'; // Importujemy przycisk

const a_playlist_background_colors = [
  '#FFC107', '#FF5722', '#E91E63', '#9C27B0', '#3F51B5', '#03A9F4', '#009688', '#8BC34A'
];

const getRandomColor = () => {
  return a_playlist_background_colors[Math.floor(Math.random() * a_playlist_background_colors.length)];
};

const PlaylistItem = ({ item, onDelete }: { item: Playlist, onDelete: () => void }) => {
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const backgroundColor = item.cover_color || '#8E8E93';

  const handleDelete = () => {
    Alert.alert(
      'Usuń playlistę',
      `Czy na pewno chcesz usunąć playlistę "${item.name}"? Tej operacji nie można cofnąć.`,
      [
        {
          text: 'Anuluj',
          style: 'cancel',
        },
        {
          text: 'Usuń',
          onPress: onDelete,
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <TouchableOpacity 
      style={[styles.gridItem, { backgroundColor }]}
      onPress={() => navigation.navigate('PlaylistDetails', { playlistId: item.id, playlistName: item.name })}
      onLongPress={handleDelete}
    >
      <Text style={styles.gridItemTitle}>{item.name}</Text>
    </TouchableOpacity>
  );
};

const PlaylistsScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const { session } = useAuth(); // Zmieniamy user na session
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const headerHeight = useHeaderHeight();
  
  const fetchPlaylists = useCallback(async () => {
    if (session?.user) { // Sprawdzamy, czy istnieje sesja i użytkownik
      const userPlaylists = await getUserPlaylists(session.user.id);
      setPlaylists(userPlaylists);
    } else {
      setPlaylists([]); // Czyścimy, jeśli nie ma sesji
    }
  }, [session]); // Zależność od sesji

  useFocusEffect(
    useCallback(() => {
      fetchPlaylists();
    }, [fetchPlaylists])
  );

  const handleDeletePlaylist = async (playlistId: string) => {
    try {
      await deletePlaylist(playlistId);
      fetchPlaylists(); // Odświeżamy listę
    } catch (error) {
      Alert.alert('Błąd', 'Nie udało się usunąć playlisty.');
    }
  };

  const handleAddPlaylist = () => {
    navigation.navigate('CreatePlaylist');
  };

  // Dodajemy "przycisk" jako pierwszy element do danych
  const data = [{ id: 'add-button', name: '' }, ...playlists];

  return (
    <GlobalBackground>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={data}
          renderItem={({ item }) => {
            if (item.id === 'add-button') {
              return <AddPlaylistButton onPress={handleAddPlaylist} style={styles.gridItem} />;
            }
            return <PlaylistItem item={item} onDelete={() => handleDeletePlaylist(item.id)} />;
          }}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={<Text style={styles.headerTitle}>Moje playlisty</Text>}
        />
      </SafeAreaView>
    </GlobalBackground>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        paddingHorizontal: 20,
        paddingBottom: 10,
    },
    listContent: {
        paddingHorizontal: 12, // Drobna korekta paddingu
    },
    gridItem: {
        flex: 1,
        margin: 8,
        aspectRatio: 1, // Utrzymuje kwadratowy kształt
        borderRadius: 15,
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        padding: 15,
    },
    gridItemTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textShadowColor: 'rgba(0, 0, 0, 0.7)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
});

export default PlaylistsScreen; 