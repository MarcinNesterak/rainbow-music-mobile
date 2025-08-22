import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import Sound from 'react-native-sound';
import { Song } from '../services/api';
import { supabase } from '../services/supabase'; // Importujemy klienta Supabase

// Włączamy obsługę audio z sieci
Sound.setCategory('Playback');

interface PlayerContextType {
  isPlaying: boolean;
  currentTrack: Song | null;
  isLoading: boolean;
  isPlayerVisible: boolean;
  playSong: (song: Song) => void;
  pauseSong: () => void;
  resumeSong: () => void;
  showPlayer: () => void;
  hidePlayer: () => void;
  stopSong: () => void; // <-- Dodajemy nową funkcję
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

// Tworzymy "globalną" instancję dźwięku, aby nie tworzyć nowej dla każdej piosenki
let soundInstance: Sound | null = null;
let progressInterval: NodeJS.Timeout | null = null; // Dodajemy to dla przyszłego paska postępu

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Song | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0); // Dodajemy dla przyszłego paska postępu
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);

  const cleanup = () => {
    if (progressInterval) {
      clearInterval(progressInterval);
      progressInterval = null;
    }
    if (soundInstance) {
      soundInstance.release();
      soundInstance = null;
    }
    setIsPlaying(false);
    setCurrentTrack(null);
    setIsLoading(false);
    setProgress(0);
    // isPlayerVisible jest resetowane przez funkcje, które wołają cleanup
  };

  const stopSong = useCallback(() => {
    cleanup();
    hidePlayer(); // Używamy hidePlayer, żeby spójnie zarządzać widocznością
  }, []);

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
      .from('song-audio') // POPRAWIONA NAZWA WIADRA
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
      
      progressInterval = setInterval(() => {
        soundInstance?.getCurrentTime((seconds) => {
          const duration = soundInstance?.getDuration() ?? 1;
          setProgress(seconds / duration);
        });
      }, 250);

      soundInstance.play((success) => {
        if (success) {
          console.log('Piosenka odtworzona pomyślnie');
        } else {
          console.log('Błąd odtwarzania');
        }
        stopSong(); // Zatrzymaj i zamknij, gdy piosenka się skończy
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

  const resumeSong = useCallback(() => {
    if (soundInstance) {
      soundInstance.play((success) => {
        if (!success) {
          console.log('Błąd odtwarzania po wznowieniu');
          stopSong(); // Zatrzymaj i zamknij w razie błędu
        }
      });
      setIsPlaying(true);
    }
  }, []);

  const showPlayer = () => {
    setIsPlayerVisible(true);
  };

  const hidePlayer = () => {
    setIsPlayerVisible(false);
  };

  // Upewniamy się, że dźwięk jest czyszczony przy zamykaniu aplikacji
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  const value = {
    isPlaying,
    currentTrack,
    isLoading,
    isPlayerVisible,
    playSong,
    pauseSong,
    resumeSong,
    showPlayer,
    hidePlayer,
    stopSong, // <-- Upubliczniamy funkcję
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
