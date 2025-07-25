import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';

// Definiujemy typy dla naszych ekranów, aby mieć silne typowanie
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Logowanie' }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Rejestracja' }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Start' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 