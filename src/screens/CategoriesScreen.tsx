import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, FlatList, SafeAreaView, TouchableOpacity, ImageBackground, ActivityIndicator, Platform, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../navigation/HomeStackNavigator';
import { getCategories, Category } from '../services/api';
import { supabase } from '../services/supabase';
import { useHeaderHeight } from '@react-navigation/elements';
import GlobalBackground from '../components/GlobalBackground';

const CategoryItem = ({ item }: { item: Category & { empty?: boolean } }) => {
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  if (item.empty) {
    return <View style={[styles.categoryItem, styles.itemEmpty]} />;
  }

  const imageUrl = item.icon_image_path
    ? supabase.storage.from('category-icons').getPublicUrl(item.icon_image_path).data.publicUrl
    : null;

  const imageSource = imageUrl
    ? { uri: imageUrl }
    : require('../assets/images/logo.png');

  return (
    <TouchableOpacity 
      style={styles.categoryItem}
      onPress={() => navigation.navigate('SongList', { type: 'category', id: item.id, name: item.name, imageUrl: imageUrl })}
    >
      <ImageBackground source={imageSource} style={styles.itemImage} imageStyle={{ borderRadius: 15 }}>
        <View style={styles.textOverlay} />
        <Text style={styles.categoryTitle}>{item.name}</Text>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const CategoriesScreen = () => {
  const headerHeight = useHeaderHeight();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

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

  if (loading) {
    return (
      <GlobalBackground>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      </GlobalBackground>
    );
  }

  return (
    <GlobalBackground>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={formatData(categories, 2)}
          renderItem={({ item }) => <CategoryItem item={item} />}
          keyExtractor={(item) => item.id}
          numColumns={2}
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
