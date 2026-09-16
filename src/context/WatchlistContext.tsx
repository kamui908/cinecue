import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface WatchlistItem {
  id: number;
  type: 'movie' | 'tv';
  title: string;
  poster_path: string | null;
  added_at: number;
}

interface MediaItem {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
}

interface WatchlistContextType {
  watchlist: WatchlistItem[];
  addToWatchlist: (item: MediaItem, type: 'movie' | 'tv') => void;
  removeFromWatchlist: (id: number, type: 'movie' | 'tv') => void;
  isInWatchlist: (id: number, type: 'movie' | 'tv') => boolean;
  favorites: WatchlistItem[];
  addToFavorites: (item: MediaItem, type: 'movie' | 'tv') => void;
  removeFromFavorites: (id: number, type: 'movie' | 'tv') => void;
  isFavorite: (id: number, type: 'movie' | 'tv') => boolean;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [favorites, setFavorites] = useState<WatchlistItem[]>([]);

  const addToWatchlist = useCallback((item: MediaItem, type: 'movie' | 'tv') => {
    const title = type === 'movie' ? (item.title || '') : (item.name || '');
    setWatchlist(prev => [
      { id: item.id, type, title, poster_path: item.poster_path, added_at: Date.now() },
      ...prev.filter(i => !(i.id === item.id && i.type === type)),
    ]);
  }, []);

  const removeFromWatchlist = useCallback((id: number, type: 'movie' | 'tv') => {
    setWatchlist(prev => prev.filter(i => !(i.id === id && i.type === type)));
  }, []);

  const isInWatchlist = useCallback((id: number, type: 'movie' | 'tv') => {
    return watchlist.some(i => i.id === id && i.type === type);
  }, [watchlist]);

  const addToFavorites = useCallback((item: MediaItem, type: 'movie' | 'tv') => {
    const title = type === 'movie' ? (item.title || '') : (item.name || '');
    setFavorites(prev => [
      { id: item.id, type, title, poster_path: item.poster_path, added_at: Date.now() },
      ...prev.filter(i => !(i.id === item.id && i.type === type)),
    ]);
  }, []);

  const removeFromFavorites = useCallback((id: number, type: 'movie' | 'tv') => {
    setFavorites(prev => prev.filter(i => !(i.id === id && i.type === type)));
  }, []);

  const isFavorite = useCallback((id: number, type: 'movie' | 'tv') => {
    return favorites.some(i => i.id === id && i.type === type);
  }, [favorites]);

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
}
