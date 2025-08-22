/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import MainTabNavigator from './src/navigation/AppNavigator';
import GlobalBackground from './src/components/GlobalBackground';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { FavoritesProvider } from './src/context/FavoritesContext';
import { PlayerProvider, usePlayer } from './src/context/PlayerContext';
import FullScreenPlayer from './src/screens/FullScreenPlayer';
import MiniPlayer from './src/components/MiniPlayer';

const linking = {
  prefixes: ['yourapp://'],
  config: {
    screens: {
      Login: 'login',
      Register: 'register',
      MainApp: {
        screens: {
          Home: {
            screens: {
              Home: 'home',
              SongList: 'songlist',
            },
          },
        },
      },
    },
  },
};

const TransparentTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
  },
};

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainApp: undefined;
  // FullScreenPlayer nie jest już ekranem nawigacji
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppContent = () => {
  const { session, loading } = useAuth();
  
  if (loading) {
    return (
       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
         <ActivityIndicator size="large" color="#6E44FF" />
       </View>
    );
  }

  return (
    <GlobalBackground>
      <NavigationContainer theme={TransparentTheme} linking={linking}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right'
          }}
          initialRouteName={session && session.user ? "MainApp" : "Login"}
        >
          {session && session.user ? (
            <Stack.Screen name="MainApp" component={MainTabNavigator} />
          ) : (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
      <MiniPlayer />
      <FullScreenPlayer />
    </GlobalBackground>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <FavoritesProvider>
          <PlayerProvider>
            <AppContent />
          </PlayerProvider>
        </FavoritesProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
