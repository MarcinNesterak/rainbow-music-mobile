import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import Sound from 'react-native-sound';
import { Song } from '../services/api';
import { supabase } from '../services/supabase';

// Włączamy obsługę audio z sieci
Sound.setCategory('Playback');

type VersionType = 'vocal' | 'instrumental';

interface PlayerContextType {
  isPlaying: boolean;
  currentTrack: Song | null;
  currentTrackArtUrl: string | null; // <-- Nowy stan na URL grafiki
  placeholderColor: string | null; // <-- Nowy stan na kolor
  isLoading: boolean;
  isPlayerVisible: boolean;
  progress: number; // Postęp jako wartość 0-1
  duration: number; // Czas trwania w sekundach
  currentTime: number; // Aktualny czas w sekundach
  currentVersion: VersionType;
  playSong: (song: Song, imageUrl?: string | null, color?: string) => void; // <-- Zmieniona funkcja
  pauseSong: () => void;
  resumeSong: () => void;
  showPlayer: () => void;
  hidePlayer: () => void;
  stopSong: () => void;
  seekTo: (position: number) => void; // <-- Nowa funkcja do przewijania
  switchVersion: (version: VersionType) => void;
  showLyrics: boolean; // <-- Dodajemy stan do kontekstu
  setShowLyrics: (show: boolean) => void; // <-- Dodajemy funkcję do zmiany stanu
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

// Tworzymy "globalną" instancję dźwięku, aby nie tworzyć nowej dla każdej piosenki
let soundInstance: Sound | null = null;
let progressInterval: NodeJS.Timeout | null = null; // Dodajemy to dla przyszłego paska postępu

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Song | null>(null);
  const [currentTrackArtUrl, setCurrentTrackArtUrl] = useState<string | null>(null); // <-- Nowy stan
  const [placeholderColor, setPlaceholderColor] = useState<string | null>(null); // <-- Nowy stan
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);
  const [currentVersion, setCurrentVersion] = useState<VersionType>('vocal');
  const [showLyrics, setShowLyrics] = useState(false); // <-- Stan jest teraz tutaj

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
    // Nie czyścimy currentTrack i art, aby umożliwić przełączanie wersji
    setIsLoading(false);
    setProgress(0);
    setDuration(0);
    setCurrentTime(0);
  };

  const _playAudioFromPath = useCallback(async (
    song: Song,
    path: string,
    version: VersionType,
    artUrl?: string | null,
    color?: string | null
  ) => {
    cleanup(); // Czyścimy poprzedni dźwięk i interwał
    setShowLyrics(false); // <-- Resetujemy stan przy odtwarzaniu

    setIsLoading(true);
    setCurrentTrack(song);
    setCurrentVersion(version);
    // Ustawiamy okładkę i kolor tylko, jeśli są jawnie przekazane (przy pierwszym odtworzeniu)
    if (artUrl !== undefined) setCurrentTrackArtUrl(artUrl);
    if (color !== undefined) setPlaceholderColor(color);

    const { data, error: urlError } = await supabase.storage
      .from('song-audio')
      .createSignedUrl(path, 60 * 5);

    if (urlError || !data?.signedUrl) {
      console.error('Błąd podczas tworzenia podpisanego URL:', urlError?.message);
      stopSong(); // Używamy stopSong do pełnego wyczyszczenia
      return;
    }

    const newSoundInstance = new Sound(data.signedUrl, undefined, (error) => {
      if (error) {
        console.log('Błąd podczas ładowania piosenki', error);
        stopSong();
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
        if (!success) console.log('Błąd odtwarzania');
        stopSong(); // Zatrzymuje i czyści wszystko po zakończeniu utworu
      });

      setIsPlaying(true);
      setIsLoading(false);
    });
  }, []);

  const playSong = useCallback((song: Song, imageUrl?: string | null, color?: string) => {
    if (!song.audio_file_path) {
      console.error('Piosenka nie ma ścieżki do pliku audio:', song.title);
      return;
    }
    _playAudioFromPath(song, song.audio_file_path, 'vocal', imageUrl, color);
  }, [_playAudioFromPath]);

  const switchVersion = useCallback((version: VersionType) => {
    if (!currentTrack) return;

    let path: string | null | undefined = null;
    if (version === 'instrumental') {
      path = currentTrack.instrumental_file_path;
    } else {
      path = currentTrack.audio_file_path;
    }

    if (!path) {
      Alert.alert('Brak wersji', `Dla tej piosenki nie ma dostępnej wersji "${version}".`);
      return;
    }

    _playAudioFromPath(currentTrack, path, version, currentTrackArtUrl, placeholderColor);
  }, [currentTrack, currentTrackArtUrl, placeholderColor, _playAudioFromPath]);

  const stopSong = useCallback(() => {
    cleanup();
    setCurrentTrack(null);
    setCurrentTrackArtUrl(null);
    setPlaceholderColor(null);
    hidePlayer();
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

  const seekTo = (position: number) => {
    if (soundInstance && duration > 0) {
      const newTime = position * duration;
      soundInstance.setCurrentTime(newTime);
      // Od razu zaktualizuj stany, żeby suwak się nie cofał
      setCurrentTime(newTime);
      setProgress(position);
    }
  };

  // Upewniamy się, że dźwięk jest czyszczony przy zamykaniu aplikacji
  useEffect(() => {
    return () => {
      cleanup(); // Pełne czyszczenie przy odmontowaniu komponentu
      setCurrentTrack(null);
    };
  }, []);

  const value = {
    isPlaying,
    currentTrack,
    currentTrackArtUrl, // <-- Upublicznij
    placeholderColor, // <-- Upublicznij
    isLoading,
    isPlayerVisible,
    progress, // <-- Upublicznij
    duration, // <-- Upublicznij
    currentTime, // <-- Upublicznij
    currentVersion,
    playSong,
    pauseSong,
    resumeSong,
    showPlayer,
    hidePlayer,
    stopSong, // <-- Upubliczniamy funkcję
    seekTo, // <-- Upublicznij funkcję
    switchVersion,
    showLyrics,
    setShowLyrics,
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
