// Powered by OnSpace.AI
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@html_rn_favorites';

export async function getFavorites(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export async function toggleFavorite(id: string): Promise<boolean> {
  try {
    const favs = await getFavorites();
    const isFav = favs.includes(id);
    const updated = isFav ? favs.filter(f => f !== id) : [...favs, id];
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    return !isFav;
  } catch { return false; }
}

export async function isFavorite(id: string): Promise<boolean> {
  const favs = await getFavorites();
  return favs.includes(id);
}

export async function clearFavorites(): Promise<void> {
  await AsyncStorage.removeItem(FAVORITES_KEY);
}
