/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator, Alert } from 'react-native';
import { supabase } from './src/services/supabase';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import MainTabNavigator from './src/navigation/AppNavigator';
import GlobalBackground from './src/components/GlobalBackground';

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

// --- SKRÓT DEWELOPERSKI: Pomiń logowanie ---
const FORCE_LOGIN = true;

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    <GlobalBackground>
      <NavigationContainer theme={TransparentTheme}>
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
}
