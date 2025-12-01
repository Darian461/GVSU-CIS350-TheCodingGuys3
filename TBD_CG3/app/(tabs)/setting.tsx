// app/(tabs)/settings.tsx
import React from "react";
import {
  Box,
  HStack,
  VStack,
  Text,
  Icon,
  Pressable,
  Divider,
  Switch,
  useColorMode,
} from "@gluestack-ui/themed";
import { Moon, Sun, User, Settings, LogOut } from "lucide-react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SettingsScreen() {
  const { colorMode, setColorMode } = useColorMode();
  const isDarkMode = colorMode === "dark";

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      router.replace("/login"); // or "/"
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const toggleTheme = () => {
    setColorMode(isDarkMode ? "light" : "dark");
  };

  return (
    <Box flex={1} px="$5" py="$6" bg="$background0">
      <Text fontSize="$2xl" fontWeight="$bold" mb="$6" color="$text900">
        Profile
      </Text>

      {/* User Info */}
      <HStack alignItems="center" space="md" mb="$6">
        <Box
          w={52}
          h={52}
          rounded="$full"
          bg="$blue500"
          alignItems="center"
          justifyContent="center"
        >
          <Icon as={User} size="lg" color="$white" />
        </Box>

        <VStack>
          <Text fontSize="$lg" fontWeight="$medium" color="$text900">
            Todd Par
          </Text>
          <Text fontSize="$sm" color="$text500">
            todd@example.com
          </Text>
        </VStack>
      </HStack>

      <Divider mb="$6" />

      {/* Theme Toggle */}
      <HStack
        justifyContent="space-between"
        alignItems="center"
        mb="$6"
        py="$3"
      >
        <HStack alignItems="center" space="md">
          <Icon as={isDarkMode ? Moon : Sun} size="sm" color="$text500" />
          <Text fontWeight="$medium" color="$text900">
            {isDarkMode ? "Dark Mode" : "Light Mode"}
          </Text>
        </HStack>

        <Switch value={isDarkMode} onToggle={toggleTheme} />
      </HStack>

      <Divider mb="$6" />

      {/* Menu Options */}
      <VStack space="md">
        <Pressable onPress={() => router.push("../index")}>
          <HStack
            h={48}
            alignItems="center"
            space="md"
            px="$3"
            rounded="$xl"
            bg="$background50"
          >
            <Icon as={User} size="sm" color="$text900" />
            <Text color="$text900">Change User</Text>
          </HStack>
        </Pressable>

        <Pressable>
          <HStack
            h={48}
            alignItems="center"
            space="md"
            px="$3"
            rounded="$xl"
            bg="$background50"
          >
            <Icon as={Settings} size="sm" color="$text900" />
            <Text color="$text900">Settings</Text>
          </HStack>
        </Pressable>

        <Divider my="$2" />

        <Pressable onPress={handleLogout}>
          <HStack
            h={48}
            alignItems="center"
            space="md"
            px="$3"
            rounded="$xl"
            bg="$background50"
          >
            <Icon as={LogOut} size="sm" color="$red600" />
            <Text color="$red600">Sign Out</Text>
          </HStack>
        </Pressable>
      </VStack>
    </Box>
  );
}