import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../navigation/HomeStackNavigator';

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

type CategoryItemProps = {
  title: string;
  image: any;
};

const CategoryItem = ({ title, image }: CategoryItemProps) => {
  return (
    <TouchableOpacity>
      <ImageBackground source={image} style={styles.item} imageStyle={{ borderRadius: 15 }}>
        <View style={styles.textOverlay} />
        <Text style={styles.itemTitle}>{title}</Text>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const CategoriesSection = () => {
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  return (
    <View style={styles.sectionContainer}>
      <TouchableOpacity onPress={() => navigation.navigate('Categories')}>
        <Text style={styles.sectionTitle}>Kategorie</Text>
      </TouchableOpacity>
      <FlatList
        data={CATEGORY_DATA}
        renderItem={({ item }) => <CategoryItem title={item.title} image={item.image} />}
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
    overflow: 'hidden',
  },
  textOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 15,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});

export default CategoriesSection; 