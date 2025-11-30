import '@/global.css';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { config } from '@gluestack-ui/config';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import 'react-native-reanimated';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GluestackUIProvider config={config}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          {/* Login screen — HIDE HEADER */}
          <Stack.Screen 
            name="index" 
            options={{ headerShown: false }} 
          />

          {/* Main app tabs — HIDE HEADER */}
          <Stack.Screen 
            name="(tabs)" 
            options={{ headerShown: false }} 
          />

          {/* Modal example — keep or remove */}
          <Stack.Screen
            name="modal"
            options={{ 
              presentation: 'modal',
              title: 'Modal' 
            }}
          />
        </Stack>

        <StatusBar style="auto" />
      </ThemeProvider>
    </GluestackUIProvider>
  );
}
