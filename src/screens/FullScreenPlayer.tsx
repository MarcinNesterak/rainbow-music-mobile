import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, SafeAreaView, Modal } from 'react-native';
import { usePlayer } from '../context/PlayerContext';
import { SvgXml } from 'react-native-svg';
import GlobalBackground from '../components/GlobalBackground';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const playIconXml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="64px" height="64px"><path d="M8 5v14l11-7z"/></svg>`;
const pauseIconXml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="64px" height="64px"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
const downArrowIconXml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="32px" height="32px"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg>`;
const closeIconXml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="28px" height="28px"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`;

const FullScreenPlayer = () => {
  const { isPlaying, currentTrack, isLoading, pauseSong, resumeSong, hidePlayer, isPlayerVisible, stopSong } = usePlayer();
  const insets = useSafeAreaInsets();
  
  const TAB_BAR_ESTIMATED_HEIGHT = 60; // Wysokość z CustomTabBar

  const handlePlayPause = () => {
    if (isPlaying) {
      pauseSong();
    } else {
      resumeSong();
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
        <TouchableOpacity style={styles.backdrop} onPress={hidePlayer} activeOpacity={1} />
        <View style={styles.playerSheet}>
          <GlobalBackground>
            <SafeAreaView style={styles.container}>
              {currentTrack ? (
                <>
                  {/* === NAGŁÓWEK === */}
                  <View style={styles.header}>
                    <TouchableOpacity style={styles.headerButton} onPress={hidePlayer}>
                      <SvgXml xml={downArrowIconXml} />
                    </TouchableOpacity>
                    <View style={styles.headerTextContainer}>
                      <Text style={styles.headerSubtitle}>TERAZ ODTWARZANE</Text>
                      <Text style={styles.headerTitle} numberOfLines={1}>{currentTrack.title}</Text>
                    </View>
                    <TouchableOpacity style={styles.headerButton} onPress={stopSong}>
                      <SvgXml xml={closeIconXml} />
                    </TouchableOpacity>
                  </View>
                  
                  {/* === OKŁADKA === */}
                  <View style={styles.artworkWrapper}>
                      <View style={styles.artworkPlaceholder} />
                  </View>
                  
                  {/* === INFO O PIOSENCE I KONTROLKI === */}
                  <View style={styles.bottomContainer}>
                      <View style={styles.songInfo}>
                          <Text style={styles.title}>{currentTrack.title}</Text>
                          <Text style={styles.artist}>{currentTrack.artist}</Text>
                      </View>

                      <View style={styles.controls}>
                          {isLoading ? (
                              <ActivityIndicator size="large" color="black" />
                          ) : (
                              <TouchableOpacity onPress={handlePlayPause}>
                                  <SvgXml xml={isPlaying ? pauseIconXml : playIconXml} />
                              </TouchableOpacity>
                          )}
                      </View>
                  </View>
                </>
              ) : (
                 <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator />
                 </View>
              )}
            </SafeAreaView>
          </GlobalBackground>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)'
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
    },
    artworkPlaceholder: {
        width: '90%',
        aspectRatio: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderRadius: 15,
    },
    // Dolna sekcja
    bottomContainer: {
        flex: 2,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    songInfo: {
        alignItems: 'center',
        marginBottom: 20,
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
        marginTop: 20,
    },
});

export default FullScreenPlayer;
