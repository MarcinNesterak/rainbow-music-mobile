import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { usePlayer } from '../context/PlayerContext';

interface Word {
  text: string;
  start: number;
  end: number;
}

const KaraokeView = () => {
  const { currentTrack, currentTime } = usePlayer();
  const [lyrics, setLyrics] = useState<Word[]>([]);

  useEffect(() => {
    if (currentTrack?.lyrics_timed) {
      // AssemblyAI podaje czas w milisekundach, konwertujemy na sekundy
      const formattedLyrics = (currentTrack.lyrics_timed as any[]).map(word => ({
        ...word,
        start: word.start / 1000,
        end: word.end / 1000,
      }));
      setLyrics(formattedLyrics);
    }
  }, [currentTrack]);

  const findCurrentWordIndex = () => {
    return lyrics.findIndex(word => currentTime >= word.start && currentTime <= word.end);
  };

  const currentWordIndex = findCurrentWordIndex();

  if (!lyrics.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.placeholderText}>Brak tekstu dla tej piosenki.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <Text>
          {lyrics.map((word, index) => (
            <Text 
              key={index} 
              style={[
                styles.word, 
                index === currentWordIndex && styles.highlightedWord
              ]}
            >
              {word.text}{' '}
            </Text>
          ))}
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 15,
    padding: 20,
  },
  placeholderText: {
    fontSize: 18,
    color: '#333',
  },
  scrollView: {
    width: '100%',
  },
  scrollViewContent: {
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
  },
  word: {
    fontSize: 24,
    color: '#333',
    fontWeight: '600',
    lineHeight: 40,
  },
  highlightedWord: {
    color: '#6E44FF',
  },
});

export default KaraokeView;
