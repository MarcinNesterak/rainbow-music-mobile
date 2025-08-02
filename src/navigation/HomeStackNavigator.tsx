import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import SongListScreen from '../screens/SongListScreen';
import LibraryScreen from '../screens/LibraryScreen';
import AlbumsScreen from '../screens/AlbumsScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import CreatePlaylistScreen from '../screens/CreatePlaylistScreen';
import PlaylistDetailsScreen from '../screens/PlaylistDetailsScreen';
import PlaylistsScreen from '../screens/PlaylistsScreen';

export type HomeStackParamList = {
  Home: undefined;
  Albums: undefined;
  Categories: undefined;
  Playlists: undefined;
  SongList: { type: 'album' | 'category'; id: string };
  CreatePlaylist: undefined;
  PlaylistDetails: { playlistId: string; playlistName: string };
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTransparent: true, // Ustawiamy nagłówek jako przezroczysty
        headerTitleStyle: {
          fontWeight: 'bold',
          color: '#000000' // Upewniamy się, że tytuł jest zawsze widoczny
        },
        headerTintColor: '#000000', // Ustawia kolor strzałki powrotnej
      }}>
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Albums" component={AlbumsScreen} options={{ title: 'Wszystkie albumy' }} />
      <Stack.Screen name="Categories" component={CategoriesScreen} options={{ title: 'Wszystkie kategorie' }} />
      <Stack.Screen name="Playlists" component={PlaylistsScreen} options={{ title: 'Moje playlisty' }} />
      <Stack.Screen name="CreatePlaylist" component={CreatePlaylistScreen} options={{ title: 'Nowa playlista', headerTransparent: false, headerStyle: { backgroundColor: 'white' } }} />
      <Stack.Screen name="PlaylistDetails" component={PlaylistDetailsScreen} options={({ route }) => ({ title: route.params.playlistName })} />
      <Stack.Screen name="SongList" component={SongListScreen} />
    </Stack.Navigator>
  );
};

export default HomeStackNavigator; 