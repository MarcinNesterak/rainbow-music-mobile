import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Modal,
  Image,
  Linking,
  Alert,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { usePlayer } from '../context/PlayerContext';
import { useAuth } from '../context/AuthContext';
import { SvgXml } from 'react-native-svg';
import GlobalBackground from '../components/GlobalBackground';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const playIconXml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="64px" height="64px"><path d="M8 5v14l11-7z"/></svg>`;
const pauseIconXml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="64px" height="64px"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
const downArrowIconXml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="32px" height="32px"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg>`;
const closeIconXml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="28px" height="28px"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`;

// <-- 2. Nowe ikony SVG -->
const instrumentalIconXml = `<svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 0 24 24" width="28px" fill="#000000"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>`;
const lyricsIconXml = `<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="28px" viewBox="0 0 24 24" width="28px" fill="#000000"><g><rect fill="none" height="24" width="24"/></g><g><path d="M20,4H4C2.9,4,2,4.9,2,6v12c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2V6C22,4.9,21.1,4,20,4z M4,18V6h2v12H4z M13,18V6h2v12H13z M11,18V6h2v12H11z M8,18V6h2v12H8z M18,18h-2V6h2V18z"/></g></svg>`;
const storeIconXml = `<svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 0 24 24" width="28px" fill="#000000"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-1.99.9-1.99 2L3 20c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm0 10c-2.76 0-5-2.24-5-5H2l3.43 3.43L6 14l.57.57L9 17l2.43-2.43L12 14l.57.57L15 17l2.43-2.43L18 14l.57.57L22 11h-5c0 2.76-2.24 5-5 5z"/></svg>`;
const lockIconXml = `<svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24" width="18px" fill="#555555"><path d="M0 0h24v24H0z" fill="none"/><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>`;
const vocalIconXml = `<svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 0 24 24" width="28px" fill="#000000"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.49 6-3.31 6-6.72h-1.7z"/></svg>`

// Funkcja pomocnicza do formatowania czasu
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const FullScreenPlayer = () => {
  const { profile } = useAuth();
  const {
    isPlaying,
    currentTrack,
    currentTrackArtUrl,
    isLoading,
    pauseSong,
    resumeSong,
    hidePlayer,
    isPlayerVisible,
    stopSong,
    progress,
    duration,
    currentTime,
    placeholderColor, // <-- Pobieramy kolor
    seekTo, // <-- 1. Pobieramy funkcję seekTo
    currentVersion,
    switchVersion,
  } = usePlayer();
  const insets = useSafeAreaInsets();
  const [isStoreModalVisible, setStoreModalVisible] = useState(false);

  const TAB_BAR_ESTIMATED_HEIGHT = 60; // Wysokość z CustomTabBar

  const handlePlayPause = () => {
    if (isPlaying) {
      pauseSong();
    } else {
      resumeSong();
    }
  };

  const imageSource = currentTrackArtUrl
    ? { uri: currentTrackArtUrl }
    : require('../assets/images/logo.png');

  const isPremium = profile?.subscription_status === 'premium';

  const handleStorePress = () => {
    if (currentTrack?.store_url || currentTrack?.store_url_instrumental) {
      setStoreModalVisible(true);
    } else {
      Alert.alert('Brak linku', 'Dla tej piosenki nie zdefiniowano linku do sklepu.');
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isPlayerVisible}
      onRequestClose={hidePlayer}
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity
          style={styles.backdrop}
          onPress={hidePlayer}
          activeOpacity={1}
        />
        <View style={styles.playerSheet}>
          <GlobalBackground>
            <SafeAreaView style={styles.container}>
              {currentTrack ? (
                <>
                  {/* === NAGŁÓWEK === */}
                  <View style={styles.header}>
                    <TouchableOpacity
                      style={styles.headerButton}
                      onPress={hidePlayer}
                    >
                      <SvgXml xml={downArrowIconXml} />
                    </TouchableOpacity>
                    <View style={styles.headerTextContainer}>
                      <Text style={styles.headerSubtitle}>
                        TERAZ ODTWARZANE
                      </Text>
                      <Text style={styles.headerTitle} numberOfLines={1}>
                        {currentTrack.title}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.headerButton}
                      onPress={stopSong}
                    >
                      <SvgXml xml={closeIconXml} />
                    </TouchableOpacity>
                  </View>

                  {/* === OKŁADKA === */}
                  <View style={styles.artworkWrapper}>
                    {currentTrackArtUrl ? (
                      <Image
                        source={{ uri: currentTrackArtUrl }}
                        style={styles.artworkImage}
                      />
                    ) : (
                      <View
                        style={[
                          styles.artworkImage,
                          {
                            backgroundColor:
                              placeholderColor || 'rgba(255, 255, 255, 0.2)',
                          },
                        ]}
                      />
                    )}
                  </View>

                  {/* === INFO O PIOSENCE I KONTROLKI === */}
                  <View style={styles.bottomContainer}>
                    <View style={styles.songInfo}>
                      <Text style={styles.title}>{currentTrack.title}</Text>
                      <Text style={styles.artist}>{currentTrack.artist}</Text>
                    </View>

                    {/* === PASEK POSTĘPU === */}
                    <View style={styles.progressContainer}>
                      <Slider
                        style={styles.slider}
                        value={progress}
                        minimumValue={0}
                        maximumValue={1}
                        minimumTrackTintColor="#000000"
                        maximumTrackTintColor="#C4C4C4"
                        thumbTintColor="#000000"
                        onSlidingComplete={value => seekTo(value)} // <-- 2. Podpinamy funkcję
                      />
                      <View style={styles.timeContainer}>
                        <Text style={styles.timeText}>
                          {formatTime(currentTime)}
                        </Text>
                        <Text style={styles.timeText}>
                          {formatTime(duration)}
                        </Text>
                      </View>
                    </View>

                    {/* === PRZYCISKI FUNKCYJNE === */}
                    <View style={styles.featuresRow}>

                      {currentVersion === 'vocal' ? (
                        <TouchableOpacity
                          style={styles.featureButton}
                          onPress={() => isPremium ? switchVersion('instrumental') : Alert.alert('Funkcja Premium', 'Wersja instrumentalna jest dostępna tylko w subskrypcji Premium.')}
                        >
                          <SvgXml xml={instrumentalIconXml} />
                          <Text style={styles.featureText}>Instrumental</Text>
                          {!isPremium && <View style={styles.lockIconContainer}><SvgXml xml={lockIconXml} /></View>}
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          style={styles.featureButton}
                          onPress={() => switchVersion('vocal')}
                        >
                          <SvgXml xml={vocalIconXml} />
                          <Text style={styles.featureText}>Wokal</Text>
                        </TouchableOpacity>
                      )}

                      <TouchableOpacity style={styles.featureButton} onPress={() => Alert.alert('Wkrótce!', 'Teksty piosenek będą dostępne w przyszłości.')}>
                        <SvgXml xml={lyricsIconXml} />
                        <Text style={styles.featureText}>Tekst</Text>
                        {!isPremium && <View style={styles.lockIconContainer}><SvgXml xml={lockIconXml} /></View>}
                      </TouchableOpacity>

                      <TouchableOpacity style={styles.featureButton} onPress={handleStorePress}>
                        <SvgXml xml={storeIconXml} />
                        <Text style={styles.featureText}>Sklep</Text>
                      </TouchableOpacity>

                    </View>

                    <View style={styles.controls}>
                      {isLoading ? (
                        <ActivityIndicator size="large" color="black" />
                      ) : (
                        <TouchableOpacity onPress={handlePlayPause}>
                          <SvgXml
                            xml={isPlaying ? pauseIconXml : playIconXml}
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </>
              ) : (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <ActivityIndicator />
                </View>
              )}
            </SafeAreaView>
          </GlobalBackground>

          {currentTrack && (
            <Modal
              animationType="fade"
              transparent={true}
              visible={isStoreModalVisible}
              onRequestClose={() => setStoreModalVisible(false)}
            >
              <TouchableOpacity style={styles.storeModalBackdrop} onPress={() => setStoreModalVisible(false)} activeOpacity={1}>
                <TouchableOpacity activeOpacity={1} style={styles.storeModalContainer}>
                  <Text style={styles.storeModalTitle}>Wybierz wersję</Text>

                  {currentTrack.store_url && (
                    <TouchableOpacity
                      style={styles.storeModalButton}
                      onPress={() => {
                        Linking.openURL(currentTrack.store_url!).catch(err => Alert.alert('Błąd', 'Nie można otworzyć linku.'));
                        setStoreModalVisible(false);
                      }}
                    >
                      <Text style={styles.storeModalButtonText}>Kup wersję wokalną</Text>
                    </TouchableOpacity>
                  )}

                  {currentTrack.store_url_instrumental && (
                    <TouchableOpacity
                      style={styles.storeModalButton}
                      onPress={() => {
                        Linking.openURL(currentTrack.store_url_instrumental!).catch(err => Alert.alert('Błąd', 'Nie można otworzyć linku.'));
                        setStoreModalVisible(false);
                      }}
                    >
                      <Text style={styles.storeModalButtonText}>Kup wersję instrumentalną</Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    style={[styles.storeModalButton, styles.storeModalCancelButton]}
                    onPress={() => setStoreModalVisible(false)}
                  >
                    <Text style={styles.storeModalCancelButtonText}>Anuluj</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              </TouchableOpacity>
            </Modal>
          )}

        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  playerSheet: {
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  // Nagłówek
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: 10,
    flex: 0.5,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#555',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
  },
  // Okładka
  artworkWrapper: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  artworkImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Jaśniejszy placeholder
  },
  // Dolna sekcja
  bottomContainer: {
    flex: 2,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-around', // Lepsze rozmieszczenie
  },
  songInfo: {
    alignItems: 'center',
  },
  progressContainer: {
    width: '100%',
    marginTop: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: -10,
  },
  timeText: {
    color: '#333',
    fontSize: 12,
  },
  title: {
    color: 'black',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  artist: {
    color: '#333333',
    fontSize: 16,
    marginTop: 5,
  },
  controls: {
    marginTop: 10,
  },
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 15,
  },
  featureButton: {
    alignItems: 'center',
  },
  featureText: {
    marginTop: 5,
    fontSize: 12,
    color: '#333',
  },
  lockIconContainer: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 10,
    padding: 2,
  },
  // Style dla modala sklepu
  storeModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  storeModalContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  storeModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  storeModalButton: {
    backgroundColor: '#6E44FF',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  storeModalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  storeModalCancelButton: {
    backgroundColor: '#EFEFEF',
  },
  storeModalCancelButtonText: {
    color: '#6E44FF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FullScreenPlayer;
