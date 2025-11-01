import { Image } from 'expo-image';
import { Platform, StyleSheet, View, Text } from 'react-native';
import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';
import { VictoryLabel, VictoryPie } from 'victory-native';
import Svg from "react-native-svg";
import React from 'react';
import { ScrollView } from 'react-native';
import { HStack, VStack, Box, Pressable, Divider, Icon, Button } from "@gluestack-ui/themed";
import { AddIcon } from "@gluestack-ui/themed";


const Header = () => {
  return (
    <Box
      bg="$backgroundLight0"
      width="100%"
      px="$4"
      py="$3"
      borderBottomWidth={1}
      borderColor="$borderLight200"
    >
      <HStack justifyContent="space-between" alignItems="center">
        {/* Left side: Logo + Title */}
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

        {/* Right side: Nav Button */}
        <Pressable>
          <Text fontSize="$md" color="$textLight700">
            macro
          </Text>
        </Pressable>
      </HStack>
    </Box>
  );
};


export default function HomeScreen() {
  const dailyGoal = 3500;
  const consumed = 1500;
  const remaining = dailyGoal - consumed;

  const data = [
    { x: "consumed", y: consumed },
    { x: "remaining", y: remaining },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header />

      {/* Outer container for chart and boxes */}
      <ThemedView style={styles.container}>
        <VStack alignItems="center" space="lg">

          {/* Row above the chart */}
          <HStack space="lg">
            <StatBox title="Protein" value="120g" color="#f87171" />
            <StatBox title="Carbs" value="200g" color="#3fe51eff" />
          </HStack>

          {/* Center pie chart */}
          <Box>
            <Svg width={300} height={300} viewBox="0 0 400 400">
              <VictoryPie
                standalone={false}
                width={400}
                height={400}
                data={data}
                innerRadius={120}
                cornerRadius={10}
                labels={() => null}
                style={{
                  data: {
                    fill: ({ datum }) =>
                      datum.x === "remaining" ? "transparent" : "#d83737b9",
                  },
                }}
              />
              <VictoryLabel
                textAnchor="middle"
                x={200}
                y={180}
                style={{
                  fontSize: 28,
                  fontWeight: "bold",
                  fill: "#000000ff",
                }}
                text={`${consumed} kcal`}
              />
              <VictoryLabel
                textAnchor="middle"
                x={200}
                y={220}
                style={{
                  fontSize: 20,
                  fill: "#000000cc",
                }}
                text={`${remaining} left`}
              />
            </Svg>
          </Box>

          {/* Row below the chart */}
          <HStack space="lg">
            <StatBox title="Fats" value="60g" color="#facc15" />
            <StatBox title="Water" value="100ml" color="#3517c9ff" />
          </HStack>

        </VStack>
      </ThemedView>
    </ScrollView>
  );
}


/* A reusable stat box */
const StatBox = ({ title, value, color }: { title: string; value: string; color: string }) => (
  <Box
    w={140}
    h={80}
    rounded="$lg"
    bg="$backgroundLight100"
    shadowColor="$backgroundDark950"
    shadowOpacity={0.1}
    justifyContent="center"
    alignItems="center"
    borderWidth={1}
    borderColor="$borderLight200"
  >
    <Text style={{ fontSize: 18, fontWeight: 'bold', color }}>{value}</Text>
    <Text style={{ fontSize: 14, color: '#555' }}>{title}</Text>
  </Box>
);


const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    backgroundColor: "#ffffffff",
    paddingVertical: 40,
  },
});