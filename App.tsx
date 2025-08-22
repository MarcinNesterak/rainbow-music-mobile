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
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import MainTabNavigator from './src/navigation/AppNavigator';
import GlobalBackground from './src/components/GlobalBackground';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { FavoritesProvider } from './src/context/FavoritesContext';
import { PlayerProvider } from './src/context/PlayerContext';

const linking = {
  prefixes: ['com.rainbowmusicmobile://'],
  config: {
    screens: {
      Login: 'login',
    },
  },
};

// Definiujemy nasz własny motyw, aby tło nawigacji było przezroczyste
const TransparentTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
    card: 'transparent',
  },
};

// Definiujemy typy dla wszystkich ekranów w aplikacji
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainApp: undefined;
  // Usunięto resztę, bo są w HomeStackNavigator
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
            <>
              <Stack.Screen name="MainApp" component={MainTabNavigator} />
            </>
          ) : (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </GlobalBackground>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <PlayerProvider>
          <AppContent />
        </PlayerProvider>
      </FavoritesProvider>
    </AuthProvider>
  );
}
