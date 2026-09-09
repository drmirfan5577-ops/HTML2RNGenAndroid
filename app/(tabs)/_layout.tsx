// Powered by OnSpace.AI
import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import { Colors } from '@/constants/theme';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  const tabBarStyle = {
    height: Platform.select({ ios: insets.bottom + 60, android: insets.bottom + 60, default: 70 }),
    paddingTop: 8,
    paddingBottom: Platform.select({ ios: insets.bottom + 8, android: insets.bottom + 8, default: 8 }),
    paddingHorizontal: 4,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  };

  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarStyle,
      tabBarActiveTintColor: Colors.primary,
      tabBarInactiveTintColor: Colors.textMuted,
      tabBarLabelStyle: { fontSize: 9, fontWeight: '600', marginTop: 1 },
    }}>
      <Tabs.Screen name="index" options={{
        title: 'ہوم',
        tabBarIcon: ({ color, size }) => <MaterialIcons name="home" size={size} color={color} />,
      }} />
      <Tabs.Screen name="converter" options={{
        title: 'کنورٹر',
        tabBarIcon: ({ color, size }) => <MaterialIcons name="transform" size={size} color={color} />,
      }} />
      <Tabs.Screen name="templates" options={{
        title: 'ٹیمپلیٹس',
        tabBarIcon: ({ color, size }) => <MaterialIcons name="dashboard" size={size} color={color} />,
      }} />
      <Tabs.Screen name="url-tools" options={{
        title: 'URL',
        tabBarIcon: ({ color, size }) => <MaterialIcons name="link" size={size} color={color} />,
      }} />
      <Tabs.Screen name="history" options={{
        title: 'ہسٹری',
        tabBarIcon: ({ color, size }) => <MaterialIcons name="history" size={size} color={color} />,
      }} />
      <Tabs.Screen name="about" options={{
        title: 'معلومات',
        tabBarIcon: ({ color, size }) => <MaterialIcons name="info-outline" size={size} color={color} />,
      }} />
    </Tabs>
  );
}
