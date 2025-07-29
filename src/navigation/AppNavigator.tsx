import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SvgXml } from 'react-native-svg';

import HomeScreen from '../screens/HomeScreen';

// Pusty komponent jako placeholder
const PlaceholderScreen = () => <View />;

// --- IKONY SVG ---
const homeIconXml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>`;
const playlistIconXml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3 10h11v2H3zm0-4h11v2H3zm0 8h7v2H3zm13-1v-6c0-1.1-.9-2-2-2h-2V3h3c.55 0 1 .45 1 1v6h2V3c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2z"/></svg>`;
const heartIconXml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
const profileIconXml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`;

const TabBarIcon = ({ xml, color, size }: { xml: string, color: string, size: number }) => (
  <SvgXml xml={xml} width={size} height={size} fill={color} />
);

// --- TYPY NAWIGACJI ---
export type MainTabParamList = {
  Home: undefined;
  Playlisty: undefined;
  Ulubione: undefined;
  Profil: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

// --- NAWIGATOR ZAKŁADEK (wewnętrzny) ---
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconXml;
          if (route.name === 'Home') {
            iconXml = homeIconXml;
          } else if (route.name === 'Playlisty') {
            iconXml = playlistIconXml;
          } else if (route.name === 'Ulubione') {
            iconXml = heartIconXml;
          } else if (route.name === 'Profil') {
            iconXml = profileIconXml;
          }
          return <TabBarIcon xml={iconXml!} color={color} size={size} />;
        },
        tabBarActiveTintColor: '#6E44FF',
        tabBarInactiveTintColor: 'gray',
        sceneContainerStyle: {
          backgroundColor: 'transparent' // Ustawiamy tło dla sceny na przezroczyste
        }
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Start' }} />
      <Tab.Screen name="Playlisty" component={PlaceholderScreen} />
      <Tab.Screen name="Ulubione" component={PlaceholderScreen} />
      <Tab.Screen name="Profil" component={PlaceholderScreen} />
    </Tab.Navigator>
  );
}

export default MainTabNavigator; 