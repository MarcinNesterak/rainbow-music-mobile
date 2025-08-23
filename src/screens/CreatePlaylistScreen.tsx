import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../navigation/HomeStackNavigator';
import { useAuth } from '../context/AuthContext';
import { createPlaylist } from '../services/api';
import GlobalBackground from '../components/GlobalBackground';

const a_playlist_background_colors = [
  '#FF6B6B', '#FFD166', '#06D6A0', '#118AB2', '#073B4C',
  '#F08A5D', '#B83B5E', '#6A2C70', '#F3B49F', '#F8F1F1'
];

const getRandomColor = () => {
  return a_playlist_background_colors[Math.floor(Math.random() * a_playlist_background_colors.length)];
};

const CreatePlaylistScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const { session } = useAuth();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) {
      Alert.alert('Błąd', 'Nazwa playlisty nie może być pusta.');
      return;
    }
    if (!session?.user) {
      Alert.alert('Błąd', 'Musisz być zalogowany, aby tworzyć playlisty.');
      return;
    }

    setLoading(true);
    try {
      await createPlaylist(name, session.user.id, getRandomColor());
      Alert.alert('Sukces!', 'Twoja playlista została utworzona.');
      navigation.goBack(); // Wracamy do ekranu głównego
    } catch (error: any) {
      Alert.alert('Błąd', error.message || 'Nie udało się stworzyć playlisty.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlobalBackground>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Stwórz nową playlistę</Text>
        <TextInput
          style={styles.input}
          placeholder="Np. Wieczorne przeboje"
          value={name}
          onChangeText={setName}
          placeholderTextColor="#8E8E93"
        />
        <TouchableOpacity style={styles.button} onPress={handleCreate} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Zapisz playlistę</Text>}
        </TouchableOpacity>
      </ScrollView>
    </GlobalBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'transparent', // Upewniamy się, że tło jest przezroczyste
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#6E44FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CreatePlaylistScreen; 