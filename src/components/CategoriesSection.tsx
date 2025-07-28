import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const PLAYLIST_COLORS = ['#FF6B6B', '#FFD166', '#06D6A0', '#118AB2', '#6E44FF'];

const PLAYLIST_DATA = [
  { id: '1', title: 'Energiczne poranki' },
  { id: '2', title: 'Spokojne wieczory' },
  { id: '3', title: 'Do zabawy' },
  { id: '4', title: 'Do nauki' },
  { id: '5', title: 'Podróżne hity' },
];

type PlaylistItemProps = {
  title: string;
  color: string;
};

const PlaylistItem = ({ title, color }: PlaylistItemProps) => {
  return (
    <TouchableOpacity style={[styles.item, { backgroundColor: color }]}>
      <Text style={styles.itemTitle}>{title}</Text>
    </TouchableOpacity>
  );
};

const CategoriesSection = () => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Kategorie</Text>
      <FlatList
        data={PLAYLIST_DATA}
        renderItem={({ item, index }) => (
          <PlaylistItem title={item.title} color={PLAYLIST_COLORS[index % PLAYLIST_COLORS.length]} />
        )}
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
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default CategoriesSection; 