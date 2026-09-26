import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { serverApi } from '../api/server';
import { isApiConfigured } from '../config/env';
import { listsKey, readJSON, writeJSON } from '../utils/storage';

export interface WatchlistItem {
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
  /** True once the current account's lists (local + server) have loaded. */
  listsReady: boolean;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

function toItem(item: MediaItem, type: 'movie' | 'tv'): WatchlistItem {
  return {
    id: item.id,
    type,
    title: type === 'movie' ? item.title || '' : item.name || '',
    poster_path: item.poster_path,
    added_at: Date.now(),
  };
}

/** Union of two lists by type+id, newest first. */
function mergeLists(a: WatchlistItem[], b: WatchlistItem[]): WatchlistItem[] {
  const map = new Map<string, WatchlistItem>();
  for (const item of [...a, ...b]) {
    const key = `${item.type}:${item.id}`;
    const prev = map.get(key);
    if (!prev || (item.added_at || 0) > (prev.added_at || 0)) map.set(key, item);
  }
  return [...map.values()].sort((x, y) => (y.added_at || 0) - (x.added_at || 0));
}

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const { user, token, consumePendingAction } = useAuth();
  const userId = user?.id ?? null;
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [favorites, setFavorites] = useState<WatchlistItem[]>([]);
  const [listsReady, setListsReady] = useState(false);

  // Load the active account's lists (device cache merged with the server),
  // then complete any tracking tap that triggered the login.
  useEffect(() => {
    if (!user || !userId) {
      setWatchlist([]);
      setFavorites([]);
      setListsReady(true);
      return;
    }
    let cancelled = false;
    setListsReady(false);
    (async () => {
      const cached = await readJSON<{ watchlist: WatchlistItem[]; favorites: WatchlistItem[] }>(
        listsKey(userId)
      );
      let nextWatch = cached?.watchlist ?? [];
      let nextFav = cached?.favorites ?? [];
      if (token && isApiConfigured()) {
        try {
          const remote = await serverApi.getLists(token);
          nextWatch = mergeLists(nextWatch, remote.watchlist ?? []);
          nextFav = mergeLists(nextFav, remote.favorites ?? []);
        } catch {
          // Offline — device cache is the source of truth until next sync.
        }
      }
      const pending = consumePendingAction();
      if (pending) {
        const item = toItem(pending.item, pending.mediaType);
        if (pending.list === 'watchlist') nextWatch = mergeLists([item], nextWatch);
        else nextFav = mergeLists([item], nextFav);
      }
      if (!cancelled) {
        setWatchlist(nextWatch);
        setFavorites(nextFav);
        setListsReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // Persist every change to the device cache and push to the server (best-effort).
  useEffect(() => {
    if (!user || !userId || !listsReady) return;
    writeJSON(listsKey(userId), { watchlist, favorites });
    if (token && isApiConfigured()) {
      serverApi.putLists(token, watchlist, favorites).catch(() => {});
    }
  }, [watchlist, favorites, user, userId, token, listsReady]);

  const addToWatchlist = useCallback((item: MediaItem, type: 'movie' | 'tv') => {
    const next = toItem(item, type);
    setWatchlist((prev) => mergeLists([next], prev));
  }, []);

  const removeFromWatchlist = useCallback((id: number, type: 'movie' | 'tv') => {
    setWatchlist((prev) => prev.filter((i) => !(i.id === id && i.type === type)));
  }, []);

  const isInWatchlist = useCallback(
    (id: number, type: 'movie' | 'tv') => {
      return watchlist.some((i) => i.id === id && i.type === type);
    },
    [watchlist]
  );

  const addToFavorites = useCallback((item: MediaItem, type: 'movie' | 'tv') => {
    const next = toItem(item, type);
    setFavorites((prev) => mergeLists([next], prev));
  }, []);

  const removeFromFavorites = useCallback((id: number, type: 'movie' | 'tv') => {
    setFavorites((prev) => prev.filter((i) => !(i.id === id && i.type === type)));
  }, []);

  const isFavorite = useCallback(
    (id: number, type: 'movie' | 'tv') => {
      return favorites.some((i) => i.id === id && i.type === type);
    },
    [favorites]
  );

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
        listsReady,
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
