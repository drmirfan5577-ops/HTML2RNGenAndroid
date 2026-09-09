// Powered by OnSpace.AI
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  getHistory,
  saveToHistory,
  deleteHistoryItem,
  clearAllHistory,
  HistoryItem,
  generateTitle,
} from '@/services/historyService';
import { ConversionResult } from '@/services/htmlConverter';

interface HistoryContextType {
  history: HistoryItem[];
  isLoading: boolean;
  addToHistory: (htmlInput: string, result: ConversionResult) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  clearHistory: () => Promise<void>;
  refresh: () => Promise<void>;
}

export const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export function HistoryProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    const data = await getHistory();
    setHistory(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, []);

  const addToHistory = useCallback(async (htmlInput: string, result: ConversionResult) => {
    if (!htmlInput.trim() || !result.code) return;
    await saveToHistory({
      htmlInput,
      rnCode: result.code,
      elementsConverted: result.stats.elementsConverted,
      importsCount: result.imports.length,
      warningsCount: result.warnings.length,
      title: generateTitle(htmlInput),
    });
    await refresh();
  }, [refresh]);

  const removeItem = useCallback(async (id: string) => {
    await deleteHistoryItem(id);
    setHistory(prev => prev.filter(i => i.id !== id));
  }, []);

  const clearHistory = useCallback(async () => {
    await clearAllHistory();
    setHistory([]);
  }, []);

  return (
    <HistoryContext.Provider value={{ history, isLoading, addToHistory, removeItem, clearHistory, refresh }}>
      {children}
    </HistoryContext.Provider>
  );
}
