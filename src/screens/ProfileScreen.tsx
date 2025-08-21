import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert, Platform, Linking } from 'react-native';
import GlobalBackground from '../components/GlobalBackground';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabase';

const ProfileScreen = () => {
  const { session, signOut } = useAuth();

  const handleSignOut = async () => {
    signOut();
  };

  const handleChangePassword = () => {
    Alert.alert(
      "Zmiana hasła",
      "Funkcja zmiany hasła jest w trakcie przygotowania. Wkrótce będzie dostępna."
    );
  };
  
  const handleDeleteAccount = () => {
    Alert.alert(
      "Usuwanie konta",
      "Czy na pewno chcesz trwale usunąć swoje konto? Tej operacji nie można cofnąć.",
      [
        { text: 'Anuluj', style: 'cancel' },
        {
          text: 'Usuń',
          style: 'destructive',
          onPress: async () => {
            Alert.alert(
              "Procedura usunięcia konta",
              "Funkcja usuwania konta jest w trakcie przygotowania. Prosimy o kontakt z administratorem."
            );
          },
        },
      ]
    );
  };

  return (
    <GlobalBackground>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profil</Text>
        </View>
        
        <View style={styles.content}>
          <View style={styles.infoSection}>
            <Text style={styles.label}>Adres e-mail</Text>
            <Text style={styles.value}>{session?.user?.email}</Text>
          </View>
          <View style={styles.infoSection}>
            <Text style={styles.label}>Status subskrypcji</Text>
            <Text style={styles.value}>Darmowa</Text>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
            <Text style={styles.buttonText}>Zmień hasło</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleSignOut}>
            <Text style={styles.buttonText}>Wyloguj się</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.destructiveButton]} onPress={handleDeleteAccount}>
            <Text style={[styles.buttonText, styles.destructiveButtonText]}>Usuń konto</Text>
          </TouchableOpacity>
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
    paddingTop: Platform.OS === 'android' ? 40 : 20,
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
  },
});

export default ProfileScreen;
