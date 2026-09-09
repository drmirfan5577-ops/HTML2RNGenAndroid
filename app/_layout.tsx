// Powered by OnSpace.AI
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AlertProvider } from '@/template';
import { HistoryProvider } from '@/contexts/HistoryContext';
import { FavoritesProvider } from '@/contexts/FavoritesContext';

export default function RootLayout() {
  return (
    <AlertProvider>
      <SafeAreaProvider>
        <FavoritesProvider>
          <HistoryProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="template-detail" options={{ headerShown: false, presentation: 'card' }} />
            </Stack>
          </HistoryProvider>
        </FavoritesProvider>
      </SafeAreaProvider>
    </AlertProvider>
  );
}
