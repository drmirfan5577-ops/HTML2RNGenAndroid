// Powered by OnSpace.AI
import { useContext } from 'react';
import { HistoryContext } from '@/contexts/HistoryContext';

export function useHistory() {
  const context = useContext(HistoryContext);
  if (!context) throw new Error('useHistory must be used within HistoryProvider');
  return context;
}
