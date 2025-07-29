import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

const MONTH_ORDER = [
  'styczeń', 'luty', 'marzec', 'kwiecień', 'maj', 'czerwiec', 
  'lipiec', 'sierpień', 'wrzesień', 'październik', 'listopad', 'grudzień'
];

// Mapowanie nazw plików (bez polskich znaków) na poprawne nazwy i ścieżki
const ALBUM_IMAGES: { [key: string]: any } = {
  'styczen': require('../assets/images/albums/styczen.jpeg'),
  'luty': require('../assets/images/albums/luty.jpeg'),
  'marzec': require('../assets/images/albums/marzec.jpeg'),
  'kwiecien': require('../assets/images/albums/kwiecien.jpeg'),
  'maj': require('../assets/images/albums/maj.jpeg'),
  'czerwiec': require('../assets/images/albums/czerwiec.jpeg'),
  'lipiec': require('../assets/images/albums/lipiec.jpeg'),
  'sierpien': require('../assets/images/albums/sierpien.jpeg'),
  'wrzesien': require('../assets/images/albums/wrzesien.jpeg'),
  'pazdziernik': require('../assets/images/albums/pazdziernik.jpeg'),
  'listopad': require('../assets/images/albums/listopad.jpeg'),
  'grudzien': require('../assets/images/albums/grudzien.jpeg'),
};

const ALBUM_DATA = MONTH_ORDER.map(month => {
  const fileKey = month.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace('ł', 'l');
  return {
    id: month,
    title: month.charAt(0).toUpperCase() + month.slice(1),
    image: ALBUM_IMAGES[fileKey],
  };
});

type AlbumItemProps = {
  title: string;
  image: any;
};

const AlbumItem = ({ title, image }: AlbumItemProps) => {
  return (
    <TouchableOpacity>
      <ImageBackground source={image} style={styles.item} imageStyle={{ borderRadius: 15 }}>
        <View style={styles.textOverlay} />
        <Text style={styles.itemTitle}>{title}</Text>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const AlbumsSection = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.sectionContainer}>
      <TouchableOpacity onPress={() => navigation.navigate('Albums')}>
        <Text style={styles.sectionTitle}>Albumy</Text>
      </TouchableOpacity>
      <FlatList
        data={ALBUM_DATA}
        renderItem={({ item }) => <AlbumItem title={item.title} image={item.image} />}
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
    // Usunięto backgroundColor, bo teraz mamy obraz
    borderRadius: 15,
    width: 140,
    height: 140,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    marginRight: 15,
    padding: 15,
    overflow: 'hidden', // Potrzebne dla borderRadius w ImageBackground na Androidzie
  },
  textOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)', // Lekka czarna warstwa dla czytelności tekstu
    borderRadius: 15,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF', // Biały tekst lepiej wygląda na obrazkach
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});

export default AlbumsSection; 