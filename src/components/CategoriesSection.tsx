import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ImageBackground, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../navigation/HomeStackNavigator';
import { getCategories, Category } from '../services/api'; // Nowe importy
import { supabase } from '../services/supabase';

type CategoryItemProps = {
  item: Category;
};

const CategoryItem = ({ item }: CategoryItemProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const imageUrl = item.icon_image_path
    ? supabase.storage.from('category-icons').getPublicUrl(item.icon_image_path).data.publicUrl
    : null;

  const imageSource = imageUrl
    ? { uri: imageUrl }
    : require('../assets/images/logo.png');

  return (
    <TouchableOpacity onPress={() => navigation.navigate('SongList', { type: 'category', id: item.id, name: item.name, imageUrl: imageUrl })}>
      <ImageBackground source={imageSource} style={styles.item} imageStyle={{ borderRadius: 15 }}>
        <View style={styles.textOverlay} />
        <Text style={styles.itemTitle}>{item.name}</Text>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const CategoriesSection = () => {
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);
  
  if (loading) {
    return <ActivityIndicator style={{ height: 140 }} />;
  }

  if (error) {
    return <Text style={{ color: 'red', marginLeft: 20 }}>Błąd ładowania kategorii.</Text>;
  }


  return (
    <View style={styles.sectionContainer}>
      <TouchableOpacity onPress={() => navigation.navigate('Categories')}>
        <Text style={styles.sectionTitle}>Kategorie</Text>
      </TouchableOpacity>
      <FlatList
        data={categories}
        renderItem={({ item }) => <CategoryItem item={item} />}
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