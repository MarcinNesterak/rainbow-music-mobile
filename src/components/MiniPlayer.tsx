import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { usePlayer } from '../context/PlayerContext';
import { SvgXml } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const playIconXml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="24px" height="24px"><path d="M8 5v14l11-7z"/></svg>`;
const pauseIconXml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="24px" height="24px"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;

const MiniPlayer = () => {
  const { isPlaying, currentTrack, isLoading, isPlayerVisible, pauseSong, resumeSong, showPlayer } = usePlayer();
  const insets = useSafeAreaInsets();

  if (!currentTrack || isPlayerVisible) {
    return null;
  }

  const handlePlayPause = () => {
    if (isPlaying) {
      pauseSong();
    } else {
      resumeSong();
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.container, { bottom: insets.bottom > 0 ? insets.bottom : 10 }]}
      onPress={showPlayer}
      activeOpacity={0.9}
    >
        <View style={styles.songInfo}>
          <Text style={styles.title} numberOfLines={1}>{currentTrack.title}</Text>
          <Text style={styles.artist} numberOfLines={1}>{currentTrack.artist}</Text>
        </View>
        <View style={styles.controls}>
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <TouchableOpacity onPressIn={(e) => e.stopPropagation()} onPress={handlePlayPause}>
              <SvgXml xml={isPlaying ? pauseIconXml : playIconXml} />
            </TouchableOpacity>
          )}
        </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 10,
    right: 10,
    backgroundColor: 'rgba(50, 50, 50, 0.9)',
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  songInfo: {
    flex: 1,
    marginRight: 15,
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  artist: {
    color: '#B3B3B3',
    fontSize: 12,
  },
  controls: {
    paddingLeft: 10,
  },
});

export default MiniPlayer;
