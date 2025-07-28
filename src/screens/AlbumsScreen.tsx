import React from 'react';
import { View, StyleSheet, Text, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import { SvgXml } from 'react-native-svg';

const backArrowIconXml = `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill="black"/></svg>`;

// Używamy tych samych danych co w sekcji na HomeScreen
const ALBUM_DATA = [
  { id: '1', title: 'Album Pierwszy' },
  { id: '2', title: 'Album Drugi' },
  { id: '3', title: 'Album Trzeci' },
  { id: '4', title: 'Album Czwarty' },
  { id: '5', title: 'Album Piąty' },
  { id: '6', title: 'Album Szósty' },
];

const AlbumItem = ({ title }: { title: string }) => (
  <TouchableOpacity style={styles.albumItem}>
    <Text style={styles.albumTitle}>{title}</Text>
  </TouchableOpacity>
);

const AlbumsScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <SvgXml xml={backArrowIconXml} width="28" height="28" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Albumy</Text>
      </View>
      <FlatList
        data={ALBUM_DATA}
        renderItem={({ item }) => <AlbumItem title={item.title} />}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  listContent: {
    paddingHorizontal: 10,
  },
  albumItem: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: '#E0E0E0',
    borderRadius: 15,
    margin: 5,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    padding: 10,
  },
  albumTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default AlbumsScreen; 