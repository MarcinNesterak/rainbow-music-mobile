import React from 'react';
import { View, StyleSheet, Text, FlatList, SafeAreaView, TouchableOpacity, ImageBackground } from 'react-native';
import { SvgXml } from 'react-native-svg';

const backArrowIconXml = `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill="black"/></svg>`;

const MONTH_ORDER = [
  'styczeń', 'luty', 'marzec', 'kwiecień', 'maj', 'czerwiec', 
  'lipiec', 'sierpień', 'wrzesień', 'październik', 'listopad', 'grudzień'
];

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

const AlbumItem = ({ title, image }: { title: string, image: any }) => (
  <TouchableOpacity style={styles.albumItem}>
    <ImageBackground source={image} style={styles.itemImage} imageStyle={{ borderRadius: 15 }}>
      <View style={styles.textOverlay} />
      <Text style={styles.albumTitle}>{title}</Text>
    </ImageBackground>
  </TouchableOpacity>
);

const AlbumsScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <SvgXml xml={backArrowIconXml} width="28" height="28" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Albumy</Text>
      </View>
      <FlatList
        data={ALBUM_DATA}
        renderItem={({ item }) => <AlbumItem title={item.title} image={item.image} />}
        keyExtractor={(item) => item.id}
        numColumns={2} // Zmieniamy na dwie kolumny
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
    paddingHorizontal: 15, // Większy padding dla 2 kolumn
  },
  albumItem: {
    flex: 1,
    margin: 8, // Większy margines
    aspectRatio: 1,
  },
  itemImage: {
    flex: 1,
    borderRadius: 15,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    padding: 15, // Większy padding wewnątrz
    overflow: 'hidden',
  },
  textOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 15,
  },
  albumTitle: {
    fontSize: 16, // Większa czcionka dla lepszej czytelności
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});

export default AlbumsScreen; 