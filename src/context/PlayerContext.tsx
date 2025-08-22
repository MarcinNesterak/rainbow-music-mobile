import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import Sound from 'react-native-sound';
import { Song } from '../services/api';
import { supabase } from '../services/supabase'; // Importujemy klienta Supabase

// Włączamy obsługę audio z sieci
Sound.setCategory('Playback');

interface PlayerContextType {
  isPlaying: boolean;
  currentTrack: Song | null;
  currentTrackArtUrl: string | null; // <-- Nowy stan na URL grafiki
  isLoading: boolean;
  isPlayerVisible: boolean;
  progress: number; // Postęp jako wartość 0-1
  duration: number; // Czas trwania w sekundach
  currentTime: number; // Aktualny czas w sekundach
  playSong: (song: Song, imageUrl?: string | null) => void; // <-- Zmieniona funkcja
  pauseSong: () => void;
  resumeSong: () => void;
  showPlayer: () => void;
  hidePlayer: () => void;
  stopSong: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

// Tworzymy "globalną" instancję dźwięku, aby nie tworzyć nowej dla każdej piosenki
let soundInstance: Sound | null = null;
let progressInterval: NodeJS.Timeout | null = null; // Dodajemy to dla przyszłego paska postępu

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Song | null>(null);
  const [currentTrackArtUrl, setCurrentTrackArtUrl] = useState<string | null>(null); // <-- Nowy stan
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
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
    setCurrentTrackArtUrl(null); // <-- Resetuj grafikę
    setIsLoading(false);
    setProgress(0);
    setDuration(0);
    setCurrentTime(0);
    // isPlayerVisible jest resetowane przez funkcje, które wołają cleanup
  };

  const stopSong = useCallback(() => {
    cleanup();
    hidePlayer(); // Używamy hidePlayer, żeby spójnie zarządzać widocznością
  }, []);

  const playSong = useCallback(async (song: Song, imageUrl?: string | null) => {
    cleanup(); // Zawsze czyścimy przed odtworzeniem nowej piosenki

    if (!song.audio_file_path) {
      console.error('Piosenka nie ma ścieżki do pliku audio:', song.title);
      return;
    }
    
    setIsLoading(true);
    setCurrentTrack(song);
    setCurrentTrackArtUrl(imageUrl || null); // <-- Ustaw grafikę

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
      const songDuration = Math.round(soundInstance.getDuration());
      setDuration(songDuration);
      
      progressInterval = setInterval(() => {
        soundInstance?.getCurrentTime((seconds) => {
          setCurrentTime(seconds);
          if (songDuration > 0) {
            setProgress(seconds / songDuration);
          }
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
    currentTrackArtUrl, // <-- Upublicznij
    isLoading,
    isPlayerVisible,
    progress, // <-- Upublicznij
    duration, // <-- Upublicznij
    currentTime, // <-- Upublicznij
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
