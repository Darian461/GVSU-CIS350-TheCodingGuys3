import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { AddIcon, Box, CircleIcon, HStack, Icon, Pressable, SettingsIcon, Text } from "@gluestack-ui/themed";
import { Tabs, useRouter } from "expo-router";
import React from "react";
import { Platform, TouchableOpacity, View } from "react-native";

const Header = () => (
  <Box
    bg="$backgroundLight0"
    width="100%"
    px="$4"
    py="$3"
    borderBottomWidth={1}
    borderColor="$borderLight200"
  >
    <HStack justifyContent="space-between" alignItems="center">
      {/* Left side */}
      <HStack alignItems="center" space="md">
        <Box
          bg="$backgroundLight200"
          width={40}
          height={40}
          rounded="$full"
          justifyContent="center"
          alignItems="center"
        >
          <Icon as={AddIcon} color="$textLight500" />
        </Box>
        <Text fontSize="$lg" fontWeight="$bold" color="$textLight800">
          macal
        </Text>
      </HStack>

      {/* Right side */}
      <Pressable>
        <Text fontSize="$md" color="$textLight700">
          macro
        </Text>
      </Pressable>
    </HStack>
  </Box>
);

export default function Layout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const topPadding = Platform.OS === "web" ? 0 : 24;

  return (
    <View style={{ flex: 1, paddingTop: topPadding }}>
      {/* Global Header */}
      <Header />

      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          tabBarButton: HapticTab,
          tabBarStyle: {
            height: 70,
            position: "relative",
            paddingBottom: 10,
            paddingTop: 10,
          },
        }}
      >
        {/* Home */}
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={26} name="house.fill" color={color} />
            ),
          }}
        />

        {/* Stats */}
        <Tabs.Screen
          name="stats"
          options={{
            title: "Stats",
            tabBarIcon: ({ color }) => (
              <Icon as={CircleIcon} size="xl" color={color} />
            ),
          }}
        />

        {/* Food Search Home Page  */}
        <Tabs.Screen
          name="foodSearchHomePage"
          options={{
            title: "",
            tabBarButton: () => (
              <TouchableOpacity
                onPress={() => router.push("/foodSearchHomePage")}
                style={{
                  position: "absolute",
                  bottom: 20, // centers vertically relative to tab bar
                  alignSelf: "center", // centers horizontally
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: Colors[colorScheme ?? "light"].tint,
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  shadowColor: "#000",
                  shadowOpacity: 0.25,
                  shadowRadius: 5,
                  shadowOffset: { width: 0, height: 2 },
                  zIndex: 10,
                }}
              >
                <Icon as={AddIcon} size="xl" color="color" />              
              </TouchableOpacity>
            ),
          }}
        />

        {/* History */}
        <Tabs.Screen
          name="history"
          options={{
            title: "History",
            tabBarIcon: ({ color }) => (
              <Icon as={CircleIcon} size="xl" color={color} />
            ),
          }}
        />

        {/* Settings */}
        <Tabs.Screen
          name="setting"
          options={{
            title: "Settings",
            tabBarIcon: ({ color }) => (
              <Icon as={SettingsIcon} size="xl" color={color} />
            ),
          }}
        />

        {/* Login
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
            title: "Login",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={26} name="person.fill" color={color} />
            ),
          }}
        />
        */}
      </Tabs>
    </View>
  );
}