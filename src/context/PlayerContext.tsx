import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback, useRef } from 'react';
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
  queue: Song[];
  currentIndex: number | null;
  playQueue: (songs: Song[], startIndex?: number, imageUrl?: string | null, color?: string | null) => void;
  playNext: () => void;
  playPrevious: () => void;
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
  
  const [queue, setQueue] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  // Tworzymy ref, który będzie przechowywał najnowszą wersję funkcji playNext
  const playNextCallbackRef = useRef<() => void>();

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

  const showPlayer = () => setIsPlayerVisible(true);
  const hidePlayer = () => setIsPlayerVisible(false);

  // 1. Definiujemy `stopSong` jako pierwszą, ponieważ nie ma złożonych zależności.
  const stopSong = useCallback(() => {
    cleanup();
    setCurrentTrack(null);
    setCurrentTrackArtUrl(null);
    setPlaceholderColor(null);
    setQueue([]);
    setCurrentIndex(null);
    hidePlayer();
  }, []);

  // Definiujemy playNext - będzie ona aktualizowana i zapisywana w ref
  const playNext = useCallback(() => {
    if (currentIndex === null) {
      stopSong();
      return;
    }
    // Logika odtworzenia następnego utworu - przeniesiona tutaj dla jasności
    const nextIndex = currentIndex + 1;
    if (nextIndex >= 0 && nextIndex < queue.length) {
      const songToPlay = queue[nextIndex];
      if (songToPlay.audio_file_path) {
        setCurrentIndex(nextIndex);
        _playAudioFromPath(songToPlay, songToPlay.audio_file_path, 'vocal', currentTrackArtUrl, placeholderColor);
      } else {
        console.error(`Piosenka na indeksie ${nextIndex} nie ma ścieżki audio.`);
        // Rekurencyjne wywołanie, aby pominąć błędny utwór
        setCurrentIndex(nextIndex); // Musimy zaktualizować indeks, żeby przejść dalej
        playNextCallbackRef.current?.();
      }
    } else {
      stopSong(); // Koniec kolejki
    }
  }, [queue, currentIndex, stopSong, currentTrackArtUrl, placeholderColor]); // <-- Zależności playNext


  // Efekt, który aktualizuje ref za każdym razem, gdy `playNext` się zmienia
  useEffect(() => {
    playNextCallbackRef.current = playNext;
  }, [playNext]);


  // 2. Definiujemy funkcję do odtwarzania audio. Zależy tylko od `stopSong`.
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
      stopSong();
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
        if (success) {
          // Zawsze wywołujemy najnowszą wersję funkcji z refa
          playNextCallbackRef.current?.();
        } else {
          console.log('Błąd odtwarzania');
          stopSong();
        }
      });

      setIsPlaying(true);
      setIsLoading(false);
    });
  }, [stopSong]); // Usunęliśmy wszystkie inne zależności, bo są obsługiwane przez ref

  // 3. Definiujemy funkcję pomocniczą do odtwarzania piosenki z kolejki.
  const _playSongAtIndex = useCallback((index: number) => {
    if (index >= 0 && index < queue.length) {
      const songToPlay = queue[index];
      if (songToPlay.audio_file_path) {
        setCurrentIndex(index);
        _playAudioFromPath(songToPlay, songToPlay.audio_file_path, 'vocal', currentTrackArtUrl, placeholderColor);
      } else {
        console.error(`Piosenka na indeksie ${index} nie ma ścieżki audio.`);
        playNext?.(); // Próbuj następną
      }
    } else {
      stopSong(); // Koniec kolejki
    }
  }, [queue, _playAudioFromPath, currentTrackArtUrl, placeholderColor, stopSong]);

  // 4. Teraz możemy w pełni zdefiniować `playNext`.
  // playNext = useCallback(() => {
  //   if (currentIndex === null) {
  //     stopSong();
  //     return;
  //   }
  //   _playSongAtIndex(currentIndex + 1);
  // }, [currentIndex, _playSongAtIndex, stopSong]);

  // 5. Definiujemy resztę funkcji, które są już bezpieczne.
  const playPrevious = useCallback(() => {
    if (currentIndex === null) return;
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0 && prevIndex < queue.length) {
      const songToPlay = queue[prevIndex];
      if (songToPlay.audio_file_path) {
        setCurrentIndex(prevIndex);
        _playAudioFromPath(songToPlay, songToPlay.audio_file_path, 'vocal', currentTrackArtUrl, placeholderColor);
      } else {
        // Można dodać logikę do pomijania wstecz, ale na razie to upraszczamy
        console.error(`Piosenka na indeksie ${prevIndex} nie ma ścieżki audio.`);
      }
    }
  }, [currentIndex, queue, _playAudioFromPath, currentTrackArtUrl, placeholderColor]);


  const playQueue = useCallback((songs: Song[], startIndex: number = 0, imageUrl?: string | null, color?: string | null) => {
    setQueue(songs);
    const song = songs[startIndex];
    if (song && song.audio_file_path) {
      setCurrentIndex(startIndex);
      _playAudioFromPath(song, song.audio_file_path, 'vocal', imageUrl, color);
      showPlayer();
    } else {
      console.error('Piosenka startowa jest nieprawidłowa', song);
      stopSong();
    }
  }, [_playAudioFromPath, stopSong]);


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

  const pauseSong = useCallback(() => {
    if (soundInstance) {
      soundInstance.pause();
      setIsPlaying(false);
    }
  }, []);

  const resumeSong = useCallback(() => {
    if (soundInstance) {
      soundInstance.play((success) => {
        if (success) {
          playNextCallbackRef.current?.();
        } else {
          console.log('Błąd odtwarzania po wznowieniu');
          stopSong();
        }
      });
      setIsPlaying(true);
    }
  }, [stopSong]); // Zależność tylko od stopSong, playNext jest z refa

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
      setQueue([]);
      setCurrentIndex(null);
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
    queue,
    currentIndex,
    playQueue,
    playNext,
    playPrevious,
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
