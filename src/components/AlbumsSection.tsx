import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ImageBackground, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../navigation/HomeStackNavigator';
import { getAlbums, Album } from '../services/api';
import { supabase } from '../services/supabase'; // Krok 1: Import Supabase

type AlbumItemProps = {
  item: Album;
};

const AlbumItem = ({ item }: AlbumItemProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const imageUrl = item.cover_image_path
    ? supabase.storage.from('album-art').getPublicUrl(item.cover_image_path).data.publicUrl
    : null;

  const imageSource = imageUrl
    ? { uri: imageUrl }
    : require('../assets/images/logo.png');

  return (
    <TouchableOpacity onPress={() => navigation.navigate('SongList', { type: 'album', id: item.id, name: item.name, imageUrl: imageUrl })}>
      <ImageBackground source={imageSource} style={styles.item} imageStyle={{ borderRadius: 15 }}>
        <View style={styles.textOverlay} />
        <Text style={styles.itemTitle}>{item.name}</Text>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const AlbumsSection = () => {
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const fetchedAlbums = await getAlbums();
        setAlbums(fetchedAlbums);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAlbums();
  }, []);

  if (loading) {
    return <ActivityIndicator style={{ height: 140 }} />;
  }
  
  if (error) {
    return <Text style={{ color: 'red', marginLeft: 20 }}>Błąd ładowania albumów.</Text>;
  }

  return (
    <View style={styles.sectionContainer}>
      <TouchableOpacity onPress={() => navigation.navigate('Albums')}>
        <Text style={styles.sectionTitle}>Albumy</Text>
      </TouchableOpacity>
      <FlatList
        data={albums}
        renderItem={({ item }) => <AlbumItem item={item} />}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
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
  textOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)', // Lekka czarna warstwa dla czytelności tekstu
    borderRadius: 15,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF', // Biały tekst lepiej wygląda na obrazkach
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});

export default AlbumsSection; 