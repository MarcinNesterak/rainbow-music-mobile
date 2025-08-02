import React from 'react';
import { View, StyleSheet, Text, FlatList, SafeAreaView, TouchableOpacity, ImageBackground, Platform, StatusBar } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useHeaderHeight } from '@react-navigation/elements';
import GlobalBackground from '../components/GlobalBackground';

const backArrowIconXml = `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill="black"/></svg>`;

const CATEGORY_FILES: { [key: string]: any } = {
  'do-nauki': require('../assets/images/categories/do-nauki.jpeg'),
  'dzien-ziemi': require('../assets/images/categories/dzien-ziemi.jpeg'),
  'po-angielsku': require('../assets/images/categories/po-angielsku.jpeg'),
  'dzien-babci-i-dziadka': require('../assets/images/categories/dzien-babci-i-dziadka.jpeg'),
  'do-zabawy': require('../assets/images/categories/do-zabawy.jpeg'),
  'wiosna': require('../assets/images/categories/wiosna.jpeg'),
  'dzien-mamy-i-taty': require('../assets/images/categories/dzien-mamy-i-taty.jpeg'),
  'tance': require('../assets/images/categories/tance.jpeg'),
  'powitania': require('../assets/images/categories/powitania.jpeg'),
  'mikolaj': require('../assets/images/categories/mikolaj.jpeg'),
  'polska': require('../assets/images/categories/polska.jpeg'),
  'swieta-wielkanocne': require('../assets/images/categories/swieta-wielkanocne.jpeg'),
  'spokojne-wieczory': require('../assets/images/categories/spokojne-wieczory.jpeg'),
  'instrumentacje': require('../assets/images/categories/instrumentacje.jpeg'),
  'lato': require('../assets/images/categories/lato.jpeg'),
  'energiczne-poranki': require('../assets/images/categories/energiczne-poranki.jpeg'),
  'jesien': require('../assets/images/categories/jesien.jpeg'),
  'boze-narodzenie': require('../assets/images/categories/boze-narodzenie.jpeg'),
  'zima': require('../assets/images/categories/zima.jpeg'),
  'podrozne-hity': require('../assets/images/categories/podrozne-hity.jpeg'),
};

const TITLE_MAP: { [key: string]: string } = {
  'dzien-ziemi': 'Dzień Ziemi',
  'dzien-babci-i-dziadka': 'Dzień Babci i Dziadka',
  'dzien-mamy-i-taty': 'Dzień Mamy i Taty',
  'tance': 'Tańce',
  'mikolaj': 'Mikołaj',
  'swieta-wielkanocne': 'Święta Wielkanocne',
  'jesien': 'Jesień',
  'boze-narodzenie': 'Boże Narodzenie',
  'podrozne-hity': 'Podróżne hity',
};

const CATEGORY_DATA = Object.keys(CATEGORY_FILES).map(key => {
    const defaultTitle = key.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    return {
      id: key,
      title: TITLE_MAP[key] || defaultTitle,
      image: CATEGORY_FILES[key],
    };
}).sort((a, b) => a.title.localeCompare(b.title, 'pl')); // Sortowanie alfabetyczne z polskimi znakami

const numColumns = 2;

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

const CategoryItem = ({ item }: { item: { id: string, title?: string, image?: any, empty?: boolean } }) => {
  if (item.empty) {
    return <View style={[styles.categoryItem, styles.itemEmpty]} />;
  }
  return (
    <TouchableOpacity style={styles.categoryItem}>
      <ImageBackground source={item.image} style={styles.itemImage} imageStyle={{ borderRadius: 15 }}>
        <View style={styles.textOverlay} />
        <Text style={styles.categoryTitle}>{item.title}</Text>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const CategoriesScreen = () => {
  const headerHeight = useHeaderHeight();

  return (
    <GlobalBackground>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={formatData(CATEGORY_DATA, numColumns)}
          renderItem={({ item }) => <CategoryItem item={item} />}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          contentContainerStyle={[styles.listContent, { paddingTop: headerHeight }]}
        />
      </SafeAreaView>
    </GlobalBackground>
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
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 10, // Dodajemy padding dla Androida
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
    paddingHorizontal: 15,
  },
  categoryItem: {
    flex: 1,
    aspectRatio: 1,
    margin: 8,
  },
  itemImage: {
    flex: 1,
    borderRadius: 15,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    padding: 10,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.7)',
  },
  itemEmpty: {
    backgroundColor: 'transparent',
  },
  textOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 15,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});

export default CategoriesScreen; 