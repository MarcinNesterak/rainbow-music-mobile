import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigatorScreenParams } from '@react-navigation/native';
import HomeStackNavigator, { HomeStackParamList } from './HomeStackNavigator';
import PlaceholderScreen from '../screens/PlaceholderScreen';
import CustomTabBar from '../components/CustomTabBar';
import FavoritesScreen from '../screens/FavoritesScreen';

export type MainTabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList>;
  Biblioteka: undefined;
  Playlisty: undefined;
  Ulubione: undefined;
  Profil: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeStackNavigator} 
        options={{ title: 'Start' }} 
      />
      <Tab.Screen 
        name="Biblioteka" 
        component={PlaceholderScreen}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate('Home', { 
              screen: 'SongList', 
              params: { type: 'all', name: 'Biblioteka' } 
            });
          },
        })}
      />
      <Tab.Screen 
        name="Playlisty" 
        component={PlaceholderScreen}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate('Home', { screen: 'Playlists' });
          },
        })}
      />
      <Tab.Screen name="Ulubione" component={FavoritesScreen} />
      <Tab.Screen name="Profil" component={PlaceholderScreen} />
    </Tab.Navigator>
  );
}
export default MainTabNavigator; 
