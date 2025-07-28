/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator, Alert } from 'react-native';
import { supabase } from './src/services/supabase';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import MainTabNavigator from './src/navigation/AppNavigator'; // Zmieniona nazwa importu
import SongListScreen from './src/screens/SongListScreen';
import LibraryScreen from './src/screens/LibraryScreen'; // Importujemy nowy ekran
import AlbumsScreen from './src/screens/AlbumsScreen'; // Importujemy nowy ekran
import CategoriesScreen from './src/screens/CategoriesScreen'; // Importujemy nowy ekran

// Definiujemy typy dla wszystkich ekranów w aplikacji
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainApp: undefined;
  SongList: undefined;
  Library: undefined; // Dodajemy nowy ekran do typów
  Albums: undefined; // Dodajemy nowy ekran do typów
  Categories: undefined; // Dodajemy nowy ekran do typów
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// --- SKRÓT DEWELOPERSKI: Pomiń logowanie ---
const FORCE_LOGIN = true;

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ... (useEffect bez zmian)
    const fetchSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
      } catch (error) {
        Alert.alert("Błąd krytyczny", "Nie udało się połączyć z serwerem.");
      } finally {
        setLoading(false);
      }
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6E44FF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{ 
          headerShown: false, 
          animation: 'slide_from_right' 
        }}
        initialRouteName={FORCE_LOGIN || (session && session.user) ? "MainApp" : "Login"}
      >
        {FORCE_LOGIN || (session && session.user) ? (
          <>
            <Stack.Screen name="MainApp" component={MainTabNavigator} />
            <Stack.Screen name="SongList" component={SongListScreen} />
            <Stack.Screen name="Library" component={LibraryScreen} /> 
            <Stack.Screen name="Albums" component={AlbumsScreen} /> 
            <Stack.Screen name="Categories" component={CategoriesScreen} /> 
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
