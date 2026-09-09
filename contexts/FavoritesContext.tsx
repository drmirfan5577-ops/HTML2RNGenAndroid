// Powered by OnSpace.AI
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { getFavorites, toggleFavorite } from '@/services/favoritesService';

interface FavoritesContextType {
  favorites: string[];
  isFav: (id: string) => boolean;
  toggle: (id: string) => Promise<void>;
  count: number;
}

export const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    getFavorites().then(setFavorites);
  }, []);

  const isFav = (id: string) => favorites.includes(id);

  const toggle = async (id: string) => {
    await toggleFavorite(id);
    const updated = await getFavorites();
    setFavorites(updated);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, isFav, toggle, count: favorites.length }}>
      {children}
    </FavoritesContext.Provider>
  );
}
