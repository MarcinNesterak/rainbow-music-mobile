import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const ALBUM_DATA = [
  { id: '1', title: 'Album Pierwszy' },
  { id: '2', title: 'Album Drugi' },
  { id: '3', title: 'Album Trzeci' },
  { id: '4', title: 'Album Czwarty' },
];

type AlbumItemProps = {
  title: string;
};

const AlbumItem = ({ title }: AlbumItemProps) => {
  return (
    <TouchableOpacity style={styles.item}>
      <Text style={styles.itemTitle}>{title}</Text>
    </TouchableOpacity>
  );
};

const AlbumsSection = () => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Albumy</Text>
      <FlatList
        data={ALBUM_DATA}
        renderItem={({ item }) => <AlbumItem title={item.title} />}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 20,
    marginBottom: 10,
  },
  listContent: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  item: {
    backgroundColor: '#E0E0E0', // Szare tło jako placeholder
    borderRadius: 15,
    width: 140,
    height: 140,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    marginRight: 15,
    padding: 15,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333', // Ciemniejszy tekst dla szarego tła
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default AlbumsSection; 