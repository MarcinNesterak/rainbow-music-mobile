import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SvgXml } from 'react-native-svg';

import HomeScreen from '../screens/HomeScreen';

// Pusty komponent jako placeholder
const PlaceholderScreen = () => <View />;

// --- IKONY SVG ---
const homeIconXml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>`;
const audioIconXml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v9.28c-.47-.17-.97-.28-1.5-.28C8.01 12 6 14.01 6 16.5S8.01 21 10.5 21s4.5-2.01 4.5-4.5V7h4V3h-6z"/></svg>`;
const heartIconXml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
const videoIconXml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>`;
const profileIconXml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`;

const TabBarIcon = ({ xml, color, size }: { xml: string, color: string, size: number }) => (
  <SvgXml xml={xml} width={size} height={size} fill={color} />
);

export type MainTabParamList = {
  Home: undefined;
  Audio: undefined;
  Ulubione: undefined;
  Wideo: undefined;
  Profil: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconXml = homeIconXml;
          if (route.name === 'Home') iconXml = homeIconXml;
          if (route.name === 'Audio') iconXml = audioIconXml;
          if (route.name === 'Ulubione') iconXml = heartIconXml;
          if (route.name === 'Wideo') iconXml = videoIconXml;
          if (route.name === 'Profil') iconXml = profileIconXml;
          return <TabBarIcon xml={iconXml} color={color} size={size} />;
        },
        tabBarActiveTintColor: '#6E44FF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Start' }} />
      <Tab.Screen name="Audio" component={PlaceholderScreen} />
      <Tab.Screen name="Ulubione" component={PlaceholderScreen} />
      <Tab.Screen name="Wideo" component={PlaceholderScreen} />
      <Tab.Screen name="Profil" component={PlaceholderScreen} />
    </Tab.Navigator>
  );
}

export default MainTabNavigator; 