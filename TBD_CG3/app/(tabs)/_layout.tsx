import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function Layout() {
  const colorScheme = useColorScheme();
  const topPadding = Platform.OS === 'web' ? 0 : 24;

  return (
    <View style={{ flex: 1, paddingTop: topPadding }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          tabBarButton: HapticTab,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="house.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Explore',
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="paperplane.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="foodSearch"
          options={{
            title: 'Food Search',
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="fork.knife" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="Login"
          options={{
            title:'Login'
       }}
       />
      </Tabs>
    </View>
  );
}

