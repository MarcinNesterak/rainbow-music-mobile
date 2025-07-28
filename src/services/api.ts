import { supabase } from './supabase';

export interface Song {
  id: string;
  created_at: string;
  title: string;
  artist: string;
  audio_file_path: string | null;
  instrumental_file_path: string | null;
  album_art_path: string | null;
  lyrics_timed: any | null;
  duration_seconds: number | null;
  age_category: string | null;
}

/**
 * Pobiera listę wszystkich piosenek z bazy danych,
 * sortując je od najnowszych do najstarszych.
 */
export const getSongs = async (): Promise<Song[]> => {
  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .order('created_at', { ascending: false }); // Sortowanie od najnowszych

  if (error) {
    console.error('Error fetching songs:', error);
    throw new Error(error.message);
  }

  return data || [];
};

/**
 * Pobiera listę wszystkich piosenek z bazy danych,
 * sortując je alfabetycznie według tytułu.
 */
export const getSongsAlphabetically = async (): Promise<Song[]> => {
  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .order('title', { ascending: true }); // Sortowanie alfabetyczne A-Z

  if (error) {
    console.error('Error fetching songs alphabetically:', error);
    throw new Error(error.message);
  }

  return data || [];
};

/**
 * Przeszukuje piosenki w bazie danych na podstawie tytułu.
 * @param query Tekst do wyszukania w tytule piosenki.
 */
export const searchSongs = async (query: string): Promise<Song[]> => {
  if (!query) {
    return [];
  }

  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .ilike('title', `%${query}%`); // ilike jest niewrażliwe na wielkość liter

  if (error) {
    console.error('Error searching songs:', error);
    // Rzucamy błędem, aby komponent mógł na niego zareagować
    throw new Error(error.message);
  }

  return data || [];
}; 