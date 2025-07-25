import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';

// Na razie dane na sztywno, docelowo będą pochodzić z backendu
const CATEGORIES_DATA = [
  { id: '1', title: '0-6 m-cy', color: '#FFDDC1' }, // Pastelowy pomarańcz
  { id: '2', title: '6-18 m-cy', color: '#D4F1F4' }, // Pastelowy błękit
  { id: '3', title: '1,5-3 lata', color: '#F0E68C' }, // Pastelowy żółty
  { id: '4', title: '3-5 lat', color: '#D8BFD8' },   // Pastelowy fiolet
];

// Definicja pojedynczego elementu listy
const CategoryItem = ({ title, color }: { title: string, color: string }) => (
  <TouchableOpacity style={[styles.item, { backgroundColor: color }]}>
    {/* W przyszłości możemy tu dodać obrazek */}
    <Text style={styles.itemTitle}>{title}</Text>
  </TouchableOpacity>
);

// Główny komponent sekcji
const AgeCategorySection = () => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Zacznij tu</Text>
      <FlatList
        data={CATEGORIES_DATA}
        renderItem={({ item }) => <CategoryItem title={item.title} color={item.color} />}
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
  },
  item: {
    width: 120,
    height: 120,
    borderRadius: 60, // Idealne koło
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
});

export default AgeCategorySection; 