import React from 'react';
import { View, StyleSheet, Text, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import { SvgXml } from 'react-native-svg';

const backArrowIconXml = `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill="black"/></svg>`;

const CATEGORY_COLORS = ['#FF6B6B', '#FFD166', '#06D6A0', '#118AB2', '#6E44FF'];
const CATEGORY_DATA = [
  { id: '1', title: 'Energiczne poranki' },
  { id: '2', title: 'Spokojne wieczory' },
  { id: '3', title: 'Do zabawy' },
  { id: '4', title: 'Do nauki' },
  { id: '5', title: 'Podróżne hity' },
];

const numColumns = 3;

// Funkcja dodająca puste elementy, aby wypełnić ostatni wiersz siatki
const formatData = (data: any[], columns: number) => {
  const dataCopy = [...data];
  const numberOfFullRows = Math.floor(dataCopy.length / columns);
  let numberOfElementsLastRow = dataCopy.length - (numberOfFullRows * columns);
  while (numberOfElementsLastRow !== columns && numberOfElementsLastRow !== 0) {
    dataCopy.push({ id: `blank-${numberOfElementsLastRow}`, empty: true });
    numberOfElementsLastRow++;
  }
  return dataCopy;
};

const CategoryItem = ({ item, color }: { item: { id: string, title?: string, empty?: boolean }, color: string }) => {
  if (item.empty) {
    return <View style={[styles.categoryItem, styles.itemEmpty]} />;
  }
  return (
    <TouchableOpacity style={[styles.categoryItem, { backgroundColor: color }]}>
      <Text style={styles.categoryTitle}>{item.title}</Text>
    </TouchableOpacity>
  );
};

const CategoriesScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <SvgXml xml={backArrowIconXml} width="28" height="28" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kategorie</Text>
      </View>
      <FlatList
        data={formatData(CATEGORY_DATA, numColumns)}
        renderItem={({ item, index }) => <CategoryItem item={item} color={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
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
  categoryItem: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 15,
    margin: 5,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    padding: 10,
  },
  itemEmpty: {
    backgroundColor: 'transparent',
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default CategoriesScreen; 