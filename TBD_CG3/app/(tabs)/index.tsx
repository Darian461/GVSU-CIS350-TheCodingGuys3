import { ThemedView } from "@/components/themed-view";
import {
  AddIcon,
  Box,
  HStack,
  Icon,
  Pressable,
  Text,
  VStack,
} from "@gluestack-ui/themed";
import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import Svg from "react-native-svg";
import { VictoryLabel, VictoryPie } from "victory-native";

const today = new Date().toLocaleDateString(undefined, {
  weekday: "long", // e.g., "Monday"
  month: "long", // e.g., "October"
  day: "numeric", // e.g., "27"
});

export default function HomeScreen() {
  const dailyGoal = 3500;
  const consumed = 1500;
  const remaining = dailyGoal - consumed;

  const data = [
    { x: "consumed", y: consumed },
    { x: "remaining", y: remaining },
  ];

  return (
    <ScrollView style={{ backgroundColor: "#ffffffff" }}>
      {/* Outer container for chart and boxes */}
      <ThemedView style={styles.container}>
        <VStack alignItems="center" space="lg">
          {/* Date in middle */}
          <Text style={styles.dateText}>{today}</Text>

          {/* Row above the chart */}
          <HStack space="lg">
            <StatBox title="Protein" value="120g" color="#ef4444" />
            <StatBox title="Carbs" value="200g" color="#22c55e" />
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
                      datum.x === "remaining" ? "transparent" : "#4f46e5",
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
            <StatBox title="Water" value="100ml" color="#2d05f6ff" />
          </HStack>
        </VStack>
      </ThemedView>
    </ScrollView>
  );
}

/* A reusable stat box */
const StatBox = ({
  title,
  value,
  color,
}: {
  title: string;
  value: string;
  color: string;
}) => (
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
    <Text style={{ fontSize: 14, fontWeight: "600", color, marginBottom: 4 }}>
      {title}
    </Text>
    <Text style={{ fontSize: 18, fontWeight: "bold", color: "#000" }}>
      {value}
    </Text>
  </Box>
);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    backgroundColor: "#ffffffff",
    paddingTop: 40,
    paddingBottom: 0,
  },
  dateText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
});
