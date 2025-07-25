import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';

// Ekrany dostępne w dolnym pasku
export type MainTabParamList = {
  Home: undefined;
};

// Wszystkie ekrany w głównej nawigacji stosu
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Main: { screen: string }; 
};


const RootStack = createNativeStackNavigator<RootStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();

const MainNavigator = () => {
  return (
    <MainTab.Navigator>
      <MainTab.Screen name="Home" component={HomeScreen} options={{ title: 'Start' }} />
    </MainTab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <RootStack.Navigator 
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <RootStack.Screen name="Login" component={LoginScreen} />
        <RootStack.Screen name="Register" component={RegisterScreen} />
        <RootStack.Screen name="Main" component={MainNavigator} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 