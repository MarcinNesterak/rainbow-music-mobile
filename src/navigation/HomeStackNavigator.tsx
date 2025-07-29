import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import SongListScreen from '../screens/SongListScreen';
import LibraryScreen from '../screens/LibraryScreen';
import AlbumsScreen from '../screens/AlbumsScreen';
import CategoriesScreen from '../screens/CategoriesScreen';

export type HomeStackParamList = {
  HomeInitial: undefined;
  SongList: undefined;
  Library: undefined;
  Albums: undefined;
  Categories: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeInitial" component={HomeScreen} />
      <Stack.Screen name="SongList" component={SongListScreen} />
      <Stack.Screen name="Library" component={LibraryScreen} />
      <Stack.Screen name="Albums" component={AlbumsScreen} />
      <Stack.Screen name="Categories" component={CategoriesScreen} />
    </Stack.Navigator>
  );
};

export default HomeStackNavigator; 