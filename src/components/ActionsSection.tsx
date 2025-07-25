import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

// Na razie dane na sztywno, docelowo będą pochodzić z backendu
const ACTIONS_DATA = [
  { id: '1', title: 'Co nowego?' },
  { id: '2', title: 'Moje produkty' },
  { id: '3', title: 'Graj ulubione' },
  { id: '4', title: 'Subskrybuj' },
];

// Definicja pojedynczego elementu listy
const ActionItem = ({ title }: { title: string }) => (
  <TouchableOpacity style={styles.item}>
    <Text style={styles.itemTitle}>{title}</Text>
  </TouchableOpacity>
);

// Główny komponent sekcji
const ActionsSection = () => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Szybkie akcje</Text>
      <FlatList
        data={ACTIONS_DATA}
        renderItem={({ item }) => <ActionItem title={item.title} />}
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
    backgroundColor: '#F2F2F7',
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderRadius: 15,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ActionsSection; 