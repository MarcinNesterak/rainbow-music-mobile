import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, FlatList, SafeAreaView, Platform, StatusBar, TouchableOpacity, Image } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { getSongsByAlbum, getSongsByCategory, Song } from '../services/api';
import { HomeStackParamList } from '../navigation/HomeStackNavigator';
import GlobalBackground from '../components/GlobalBackground';
import { useHeaderHeight } from '@react-navigation/elements';

type SongListScreenRouteProp = RouteProp<HomeStackParamList, 'SongList'>;

const SongListScreen = () => {
  const route = useRoute<SongListScreenRouteProp>();
  const navigation = useNavigation();
  const { type, id, name, imageUrl } = route.params; 
  const headerHeight = useHeaderHeight();

  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setLoading(true);
        let fetchedSongs: Song[] = [];
        if (type === 'album') {
          fetchedSongs = await getSongsByAlbum(id);
        } else if (type === 'category') {
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


  const renderSongItem = ({ item }: { item: Song }) => (
    <TouchableOpacity style={styles.songItem}>
       <Image 
        source={imageUrl ? { uri: imageUrl } : require('../assets/images/logo.png')}
        style={styles.albumArt} 
      />
      <View style={styles.songInfo}>
        <Text style={styles.songTitle}>{item.title}</Text>
        <Text style={styles.songArtist}>{item.artist}</Text>
      </View>
    </TouchableOpacity>
  );

  const ListHeader = () => (
    <View style={{ height: headerHeight }} />
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
          <Text style={styles.errorText}>Błąd ładowania piosenek: {error}</Text>
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
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={
            <View style={[styles.center, { flex: 1 }]}>
                <Text style={styles.errorText}>Brak piosenek w tej kolekcji.</Text>
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
});

export default SongListScreen;
