import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, Platform, StatusBar, Alert } from 'react-native';
import { useFocusEffect, useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { HomeStackParamList } from '../navigation/HomeStackNavigator';
import { useAuth } from '../context/AuthContext';
import { getUserPlaylists, Playlist, addSongToPlaylist, getSongsByPlaylist } from '../services/api';
import GlobalBackground from '../components/GlobalBackground';

type AddToPlaylistRouteProp = RouteProp<HomeStackParamList, 'AddToPlaylist'>;

const AddToPlaylistScreen = () => {
  const { session } = useAuth();
  const navigation = useNavigation();
  const route = useRoute<AddToPlaylistRouteProp>();
  const { songId } = route.params;

  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  const fetchPlaylists = useCallback(async () => {
    if (session?.user.id) {
      const userPlaylists = await getUserPlaylists(session.user.id);
      setPlaylists(userPlaylists);
    }
  }, [session]);

  useFocusEffect(
    useCallback(() => {
      fetchPlaylists();
    }, [fetchPlaylists])
  );
  
  const handlePlaylistSelect = async (playlist: Playlist) => {
    try {
      // Sprawdzamy, ile piosenek już jest na playliście, aby dodać nową na końcu
      const existingSongs = await getSongsByPlaylist(playlist.id);
      const newOrder = existingSongs.length + 1;
      
      await addSongToPlaylist(playlist.id, songId, newOrder);
      
      Alert.alert('Sukces', `Dodano piosenkę do playlisty "${playlist.name}"`);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Błąd', 'Nie udało się dodać piosenki do playlisty.');
      console.error(error);
    }
  };

  return (
    <GlobalBackground>
      <SafeAreaView style={styles.container}>
        <Text style={styles.headerTitle}>Dodaj do playlisty...</Text>
        <FlatList
          data={playlists}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.itemContainer} onPress={() => handlePlaylistSelect(item)}>
              <View style={[styles.colorSquare, { backgroundColor: item.cover_color || '#8E8E93' }]} />
              <Text style={styles.itemText}>{item.name}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>Nie masz jeszcze żadnych playlist.</Text>}
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
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        padding: 20,
    },
    itemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 15,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    colorSquare: {
      width: 50,
      height: 50,
      borderRadius: 8,
      marginRight: 15,
    },
    itemText: {
      fontSize: 16,
    },
    emptyText: {
      textAlign: 'center',
      marginTop: 50,
      fontSize: 16,
      color: 'gray',
    }
});

export default AddToPlaylistScreen;
