import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import GlobalBackground from '../components/GlobalBackground';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../services/supabase'; // Import supabase
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ProfileStackParamList } from '../navigation/ProfileStackNavigator';

type ProfileScreenNavigationProp = StackNavigationProp<
  ProfileStackParamList,
  'Profile'
>;

const ProfileScreen = () => {
  const { session, profile } = useAuth();
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Błąd', 'Wystąpił błąd podczas wylogowywania.');
      console.error('Błąd wylogowywania:', error);
    }
    // AuthContext samoczynnie wykryje zmianę stanu i przełączy widok na ekran logowania
  };

  const handlePasswordChange = () => {
    navigation.navigate('ChangePassword');
  };

  return (
    <GlobalBackground>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.mainContent}>
            <Text style={styles.title}>Twój Profil</Text>
            <View style={styles.infoContainer}>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>{session?.user?.email || 'Brak danych'}</Text>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.label}>Status subskrypcji:</Text>
              <Text style={[styles.value, styles.statusValue]}>
                {profile?.subscription_status === 'premium' ? 'Premium' : 'Darmowa'}
              </Text>
            </View>

            <TouchableOpacity style={styles.button} onPress={handlePasswordChange}>
              <Text style={styles.buttonText}>Zmień hasło</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
              <Text style={[styles.buttonText, styles.logoutButtonText]}>Wyloguj się</Text>
            </TouchableOpacity>
          </View>

        </View>
      </SafeAreaView>
    </GlobalBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20, // Changed from Platform.OS === 'android' ? 40 : 20
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start', // Zmiana justowania
  },
  mainContent: {
    // Usunięcie flex: 1
  },
  infoSection: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    color: 'gray',
  },
  value: {
    fontSize: 18,
    marginTop: 5,
  },
  button: {
    backgroundColor: '#F0F0F0',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  destructiveButton: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
  },
  destructiveButtonText: {
    color: '#FF3B30',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoContainer: {
    marginBottom: 20,
  },
  statusValue: {
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    marginTop: 10,
  },
  logoutButtonText: {
    color: 'white',
  },
});

export default ProfileScreen;
