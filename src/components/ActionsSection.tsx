import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App'; // Importujemy typy z App.tsx

// Dodajemy 'targetScreen', aby wiedzieć, dokąd nawigować
const ACTIONS_DATA = [
  { id: '1', title: 'Co nowego?', targetScreen: 'SongList' },
  { id: '2', title: 'Biblioteka', targetScreen: 'Library' }, // Zmieniona nazwa i docelowy ekran
  { id: '3', title: 'Graj ulubione', targetScreen: null },
  { id: '4', title: 'Subskrybuj', targetScreen: null },
];

type ActionItemProps = {
  title: string;
  targetScreen: keyof RootStackParamList | null;
};

const ActionItem = ({ title, targetScreen }: ActionItemProps) => {
  // Pobieramy obiekt nawigacji za pomocą hooka
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handlePress = () => {
    // Nawigujemy tylko jeśli cel jest zdefiniowany
    if (targetScreen) {
      navigation.navigate(targetScreen);
    }
  };

  return (
    <TouchableOpacity style={styles.item} onPress={handlePress}>
      <Text style={styles.itemTitle}>{title}</Text>
    </TouchableOpacity>
  );
};

const ActionsSection = () => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Szybkie akcje</Text>
      <FlatList
        data={ACTIONS_DATA}
        renderItem={({ item }) => <ActionItem title={item.title} targetScreen={item.targetScreen as keyof RootStackParamList | null} />}
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