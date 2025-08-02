import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../navigation/HomeStackNavigator';
import { useAuth } from '../context/AuthContext';
import { createPlaylist } from '../services/api';

const a_playlist_background_colors = [
  '#FFC107', '#FF5722', '#E91E63', '#9C27B0', '#3F51B5', '#03A9F4', '#009688', '#8BC34A'
];

const getRandomColor = () => {
  return a_playlist_background_colors[Math.floor(Math.random() * a_playlist_background_colors.length)];
};

const CreatePlaylistScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) {
      Alert.alert('Błąd', 'Nazwa playlisty nie może być pusta.');
      return;
    }
    if (!user) {
      Alert.alert('Błąd', 'Musisz być zalogowany, aby tworzyć playlisty.');
      return;
    }

    setLoading(true);
    try {
      await createPlaylist(name, user.id, getRandomColor());
      Alert.alert('Sukces!', 'Twoja playlista została utworzona.');
      navigation.goBack(); // Wracamy do ekranu głównego
    } catch (error: any) {
      Alert.alert('Błąd', error.message || 'Nie udało się stworzyć playlisty.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stwórz nową playlistę</Text>
      <TextInput
        style={styles.input}
        placeholder="Np. Wieczorne przeboje"
        value={name}
        onChangeText={setName}
      />
      <TouchableOpacity style={styles.button} onPress={handleCreate} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Zapisz playlistę</Text>}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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