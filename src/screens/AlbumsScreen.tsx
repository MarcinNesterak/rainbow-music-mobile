import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, FlatList, SafeAreaView, TouchableOpacity, ImageBackground, ActivityIndicator, Platform, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../navigation/HomeStackNavigator';
import { getAlbums, Album } from '../services/api';
import { supabase } from '../services/supabase';
import { useHeaderHeight } from '@react-navigation/elements';
import GlobalBackground from '../components/GlobalBackground';

const AlbumItem = ({ item }: { item: Album }) => {
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  
  const imageUrl = item.cover_image_path
    ? supabase.storage.from('album-art').getPublicUrl(item.cover_image_path).data.publicUrl
    : null;

  const imageSource = imageUrl
    ? { uri: imageUrl }
    : require('../assets/images/logo.png');

  return (
    <TouchableOpacity 
      style={styles.albumItem}
      onPress={() => navigation.navigate('SongList', { type: 'album', id: item.id, name: item.name, imageUrl: imageUrl })}
    >
      <ImageBackground source={imageSource} style={styles.itemImage} imageStyle={{ borderRadius: 15 }}>
        <View style={styles.textOverlay} />
        <Text style={styles.albumTitle}>{item.name}</Text>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const AlbumsScreen = () => {
  const headerHeight = useHeaderHeight();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const fetchedAlbums = await getAlbums();
        setAlbums(fetchedAlbums);
      } catch (error) {
        console.error("Failed to fetch albums:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAlbums();
  }, []);

  if (loading) {
    return (
      <GlobalBackground>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      </GlobalBackground>
    );
  }

  return (
    <GlobalBackground>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={albums}
          renderItem={({ item }) => <AlbumItem item={item} />}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={[styles.listContent, { paddingTop: headerHeight }]}
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
  listContent: {
    paddingHorizontal: 15,
  },
  albumItem: {
    flex: 1,
    margin: 8,
    aspectRatio: 1,
  },
  itemImage: {
    flex: 1,
    borderRadius: 15,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    padding: 15,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.7)',
  },
  textOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 15,
  },
  albumTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});

export default AlbumsScreen;
