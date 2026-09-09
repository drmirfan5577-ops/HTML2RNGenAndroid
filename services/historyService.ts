// Powered by OnSpace.AI
import AsyncStorage from '@react-native-async-storage/async-storage';

const HISTORY_KEY = '@html_rn_history';
const MAX_HISTORY = 50;

export interface HistoryItem {
  id: string;
  htmlInput: string;
  rnCode: string;
  elementsConverted: number;
  importsCount: number;
  warningsCount: number;
  createdAt: string;
  title: string;
}

export async function saveToHistory(item: Omit<HistoryItem, 'id' | 'createdAt'>): Promise<void> {
  try {
    const existing = await getHistory();
    const newItem: HistoryItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    const updated = [newItem, ...existing].slice(0, MAX_HISTORY);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('History save error:', e);
  }
}

export async function getHistory(): Promise<HistoryItem[]> {
  try {
    const raw = await AsyncStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function deleteHistoryItem(id: string): Promise<void> {
  try {
    const existing = await getHistory();
    const updated = existing.filter(i => i.id !== id);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('History delete error:', e);
  }
}

export async function clearAllHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(HISTORY_KEY);
  } catch (e) {
    console.warn('History clear error:', e);
  }
}

export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'ابھی';
  if (diffMins < 60) return `${diffMins} منٹ پہلے`;
  if (diffHours < 24) return `${diffHours} گھنٹے پہلے`;
  if (diffDays === 1) return 'کل';
  if (diffDays < 7) return `${diffDays} دن پہلے`;
  return date.toLocaleDateString('ur-PK');
}

export function generateTitle(html: string): string {
  const h1Match = html.match(/<h1[^>]*>([^<]*)<\/h1>/i);
  if (h1Match) return h1Match[1].trim().slice(0, 40);
  const h2Match = html.match(/<h2[^>]*>([^<]*)<\/h2>/i);
  if (h2Match) return h2Match[1].trim().slice(0, 40);
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  if (titleMatch) return titleMatch[1].trim().slice(0, 40);
  const firstTag = html.match(/<([a-z]+)/i);
  return firstTag ? `<${firstTag[1]}> کنورژن` : 'HTML کنورژن';
}
