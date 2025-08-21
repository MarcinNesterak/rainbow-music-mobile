import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getFavoriteSongs, addSongToFavorites, removeSongFromFavorites } from '../services/api';

// Definiujemy kształt naszego kontekstu
interface FavoritesContextType {
  favoriteSongIds: string[];
  addFavorite: (songId: string) => Promise<void>;
  removeFavorite: (songId: string) => Promise<void>;
  isFavorite: (songId: string) => boolean;
  loading: boolean;
}

// Tworzymy kontekst
const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

// Tworzymy "Dostawcę" (Providera) stanu
export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const { session } = useAuth();
  const [favoriteSongIds, setFavoriteSongIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Efekt do pobierania ulubionych przy starcie i zmianie sesji
  useEffect(() => {
    const fetchFavorites = async () => {
      if (session?.user?.id) {
        setLoading(true);
        try {
          const favoriteSongs = await getFavoriteSongs(session.user.id);
          setFavoriteSongIds(favoriteSongs.map(song => song.id));
        } catch (error) {
          console.error("Błąd podczas pobierania ulubionych:", error);
        } finally {
          setLoading(false);
        }
      } else {
        // Jeśli użytkownik nie jest zalogowany, czyścimy ulubione
        setFavoriteSongIds([]);
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [session]);

  const addFavorite = async (songId: string) => {
    if (!session?.user?.id) return;
    try {
      await addSongToFavorites(session.user.id, songId);
      setFavoriteSongIds((prevIds) => [...prevIds, songId]);
    } catch (error) {
      console.error("Błąd podczas dodawania do ulubionych:", error);
    }
  };

  const removeFavorite = async (songId: string) => {
    if (!session?.user?.id) return;
    try {
      await removeSongFromFavorites(session.user.id, songId);
      setFavoriteSongIds((prevIds) => prevIds.filter((id) => id !== songId));
    } catch (error) {
      console.error("Błąd podczas usuwania z ulubionych:", error);
    }
  };

  const isFavorite = (songId: string) => {
    return favoriteSongIds.includes(songId);
  };

  const value = {
    favoriteSongIds,
    addFavorite,
    removeFavorite,
    isFavorite,
    loading,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

// Tworzymy własny "hak" (hook)
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
