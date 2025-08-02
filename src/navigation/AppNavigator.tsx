import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigatorScreenParams } from '@react-navigation/native';
import HomeStackNavigator, { HomeStackParamList } from './HomeStackNavigator';
import PlaceholderScreen from '../screens/PlaceholderScreen';
import CustomTabBar from '../components/CustomTabBar';

export type MainTabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList>;
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
      {/* 
        Ta zakładka jest teraz "wirtualna". 
        Nawigacja do niej jest obsługiwana przez CustomTabBar,
        który przenosi do ekranu Playlists wewnątrz HomeStackNavigator.
      */}
      <Tab.Screen 
        name="Playlisty" 
        component={PlaceholderScreen} // Komponent nie ma znaczenia, bo nawigacja jest przechwytywana
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate('Home', { screen: 'Playlists' });
          },
        })}
      />
      <Tab.Screen name="Ulubione" component={PlaceholderScreen} />
      <Tab.Screen name="Profil" component={PlaceholderScreen} />
    </Tab.Navigator>
  );
}

export default MainTabNavigator; 