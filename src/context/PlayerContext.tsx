import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import Sound from 'react-native-sound';
import { Song } from '../services/api';
import { supabase } from '../services/supabase'; // Importujemy klienta Supabase

// Włączamy obsługę audio z sieci
Sound.setCategory('Playback');

interface PlayerContextType {
  isPlaying: boolean;
  currentTrack: Song | null;
  playSong: (song: Song) => void;
  pauseSong: () => void;
  isLoading: boolean;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

// Tworzymy "globalną" instancję dźwięku, aby nie tworzyć nowej dla każdej piosenki
let soundInstance: Sound | null = null;

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Song | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const cleanup = () => {
    if (soundInstance) {
      soundInstance.release();
      soundInstance = null;
    }
    setIsPlaying(false);
    setCurrentTrack(null);
    setIsLoading(false);
  };

  const playSong = useCallback(async (song: Song) => {
    cleanup(); // Zawsze czyścimy przed odtworzeniem nowej piosenki

    if (!song.audio_file_path) {
      console.error('Piosenka nie ma ścieżki do pliku audio:', song.title);
      return;
    }
    
    setIsLoading(true);
    setCurrentTrack(song);

    // Krok 1: Wygeneruj bezpieczny, tymczasowy URL
    const { data, error: urlError } = await supabase.storage
      .from('songs') // Nazwa Twojego wiadra (bucket)
      .createSignedUrl(song.audio_file_path, 60 * 5); // Ważny przez 5 minut

    if (urlError || !data?.signedUrl) {
      console.error('Błąd podczas tworzenia podpisanego URL:', urlError?.message);
      cleanup();
      return;
    }

    const signedUrl = data.signedUrl;

    // Krok 2: Użyj tymczasowego URL do odtworzenia dźwięku
    const newSoundInstance = new Sound(signedUrl, undefined, (error) => {
      if (error) {
        console.log('Błąd podczas ładowania piosenki', error);
        cleanup();
        return;
      }

      soundInstance = newSoundInstance;
      soundInstance.play((success) => {
        if (success) {
          console.log('Piosenka odtworzona pomyślnie');
        } else {
          console.log('Błąd odtwarzania');
        }
        // Po zakończeniu odtwarzania
        cleanup();
      });
      setIsPlaying(true);
      setIsLoading(false);
    });
  }, []);

  const pauseSong = useCallback(() => {
    if (soundInstance) {
      soundInstance.pause();
      setIsPlaying(false);
    }
  }, []);

  // Upewniamy się, że dźwięk jest czyszczony przy zamykaniu aplikacji
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  const value = {
    isPlaying,
    currentTrack,
    playSong,
    pauseSong,
    isLoading,
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
