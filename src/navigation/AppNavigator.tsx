import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeStackNavigator from './HomeStackNavigator'; // Importujemy nasz nowy nawigator
import CustomTabBar from '../components/CustomTabBar'; // Importujemy nasz nowy pasek

// Pusty komponent jako placeholder dla pozostałych zakładek
const PlaceholderScreen = () => <View style={{ flex: 1, backgroundColor: 'transparent' }} />;

export type MainTabParamList = {
  Home: undefined; // Nazwa 'Home' odnosi się teraz do całego HomeStackNavigator
  Playlisty: undefined;
  Ulubione: undefined;
  Profil: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />} // Używamy naszego niestandardowego paska
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeStackNavigator} 
        options={{ title: 'Start' }} 
      />
      <Tab.Screen name="Playlisty" component={PlaceholderScreen} />
      <Tab.Screen name="Ulubione" component={PlaceholderScreen} />
      <Tab.Screen name="Profil" component={PlaceholderScreen} />
    </Tab.Navigator>
  );
}

export default MainTabNavigator; 