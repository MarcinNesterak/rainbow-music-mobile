import { supabase } from './supabase';

// --- GŁÓWNE INTERFEJSY ---

export interface Song {
  id: string;
  created_at: string;
  title: string;
  artist: string;
  audio_file_path: string | null;
  instrumental_file_path: string | null;
  lyrics_timed: any | null;
  duration_seconds: number | null;
  store_url?: string; // Link do sklepu z piosenką
}

export interface Album {
  id: string;
  name: string;
  cover_image_path: string | null;
  songs?: Song[]; // Opcjonalnie, jeśli pobieramy album z piosenkami
}

export interface Category {
  id: string;
  name: string;
  icon_image_path: string | null;
  songs?: Song[]; // Opcjonalnie
}

export interface Playlist {
  id: string;
  user_id: string;
  name: string;
  cover_color: string | null;
  songs?: Song[]; // Opcjonalnie
}


// --- OPERACJE NA PIOSENKACH (SONGS) ---

/**
 * Przeszukuje piosenki w bazie danych na podstawie tytułu.
 */
export const searchSongs = async (query: string): Promise<Song[]> => {
  if (!query) return [];
  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .ilike('title', `%${query}%`);
  if (error) throw new Error(error.message);
  return data || [];
};

/**
 * Pobiera wszystkie piosenki z bazy, sortując je alfabetycznie.
 */
export const getAllSongs = async (): Promise<Song[]> => {
  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .order('title', { ascending: true });
  if (error) throw new Error(error.message);
  return data || [];
};


// --- OPERACJE NA ALBUMACH (ALBUMS) ---

/**
 * Pobiera wszystkie albumy.
 */
export const getAlbums = async (): Promise<Album[]> => {
  const { data, error } = await supabase
    .from('albums')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw new Error(error.message);
  return data || [];
};

/**
 * Pobiera piosenki dla konkretnego albumu.
 */
export const getSongsByAlbum = async (albumId: string): Promise<Song[]> => {
    const { data, error } = await supabase
      .from('song_albums')
      .select('songs(*)')
      .eq('album_id', albumId);
  
    if (error) throw new Error(error.message);
    return data?.map(item => item.songs as unknown as Song).filter(Boolean) || [];
};
  
// --- OPERACJE NA KATEGORIACH (CATEGORIES) ---

/**
 * Pobiera wszystkie kategorie.
 */
export const getCategories = async (): Promise<Category[]> => {
    const { data, error } = await supabase.from('categories').select('*');
    if (error) throw new Error(error.message);
    return data || [];
};

/**
 * Pobiera piosenki dla konkretnej kategorii.
 */
export const getSongsByCategory = async (categoryId: string): Promise<Song[]> => {
    const { data, error } = await supabase
      .from('song_categories')
      .select('songs(*)')
      .eq('category_id', categoryId);

    if (error) throw new Error(error.message);
    return data?.map(item => item.songs as unknown as Song).filter(Boolean) || [];
};

// --- OPERACJE NA PLAYLISTACH (PLAYLISTS) ---

/**
 * Pobiera playlisty stworzone przez zalogowanego użytkownika.
 */
export const getUserPlaylists = async (userId: string): Promise<Playlist[]> => {
    const { data, error } = await supabase
      .from('playlists')
      .select('*')
      .eq('user_id', userId);

    if (error) throw new Error(error.message);
    return data || [];
}

/**
 * Tworzy nową playlistę.
 */
export const createPlaylist = async (name: string, userId: string, color: string) => {
  const { data, error } = await supabase
    .from('playlists')
    .insert([{ name, user_id: userId, cover_color: color }])
    .select();

  if (error) {
    throw new Error(error.message);
  }
  return data;
}

/**
 * Usuwa playlistę.
 */
export const deletePlaylist = async (playlistId: string) => {
    const { error } = await supabase
      .from('playlists')
      .delete()
      .eq('id', playlistId);
    
    if (error) throw new Error(error.message);
};

/**
 * Dodaje piosenkę do playlisty.
 */
export const addSongToPlaylist = async (playlistId: string, songId: string, order: number) => {
    const { error } = await supabase
        .from('playlist_songs')
        .insert({ playlist_id: playlistId, song_id: songId, song_order: order });
    
    if (error) throw new Error(error.message);
}

/**
 * Pobiera piosenki dla konkretnej playlisty, posortowane według kolejności.
 */
export const getSongsByPlaylist = async (playlistId: string): Promise<Song[]> => {
    const { data, error } = await supabase
      .from('playlist_songs')
      .select('songs(*)')
      .eq('playlist_id', playlistId)
      .order('song_order', { ascending: true });
  
    if (error) throw new Error(error.message);
    return data?.map(item => item.songs as unknown as Song).filter(Boolean) || [];
};

/**
 * Usuwa piosenkę z playlisty.
 */
export const removeSongFromPlaylist = async (playlistId: string, songId: string) => {
    const { error } = await supabase
        .from('playlist_songs')
        .delete()
        .eq('playlist_id', playlistId)
        .eq('song_id', songId);
    
    if (error) throw new Error(error.message);
};

// --- OPERACJE NA ULUBIONYCH (FAVORITES) ---

/**
 * Pobiera ulubione piosenki zalogowanego użytkownika.
 */
export const getFavoriteSongs = async (userId: string): Promise<Song[]> => {
    const { data, error } = await supabase
        .from('user_favorite_songs')
        .select('songs(*)')
        .eq('user_id', userId);
    
    if (error) throw new Error(error.message);
    return data?.map(item => item.songs as unknown as Song).filter(Boolean) || [];
}

/**
 * Dodaje piosenkę do ulubionych.
 */
export const addSongToFavorites = async (userId: string, songId: string) => {
    const { error } = await supabase
        .from('user_favorite_songs')
        .insert({ user_id: userId, song_id: songId });

    if (error) throw new Error(error.message);
}

/**
 * Usuwa piosenkę z ulubionych.
 */
export const removeSongFromFavorites = async (userId: string, songId: string) => {
    const { error } = await supabase
        .from('user_favorite_songs')
        .delete()
        .eq('user_id', userId)
        .eq('song_id', songId);
    
    if (error) throw new Error(error.message);
} 