import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { ThemedView } from "@/components/themed-view";
import { Box, HStack, Text, VStack } from "@gluestack-ui/themed";
import Svg from "react-native-svg";
import { VictoryLabel, VictoryPie } from "victory-native";
import { getToken } from "../index";

// for development
const ip = "http://192.168.1.141:8000";
export default function HomeScreen() {
  const [totals, setTotals] = useState<any>(null);

  useEffect(() => {
    async function loadTotals() {
      try {
        const token = await getToken();
        if (!token) {
          console.log("No token found");
          return;
        }
        const res = await fetch(`${ip}/food_log/today/totals`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          console.log("Fetch error:", await res.text());
          return;
        }

        const data = await res.json();
        setTotals(data);
        console.log("DATA FROM API:", data);
      } catch (err) {
        console.error("Error loading totals:", err);
      }
    }

    loadTotals();
  }, []);

  if (!totals) {
    return <Text>Loading...</Text>;
  }

  const dailyGoal = 3500;
  const consumed = totals.total_calories;
  const remaining = dailyGoal - consumed;

  const data = [
    { x: "consumed", y: consumed },
    { x: "remaining", y: remaining },
  ];

  return (
    <ScrollView style={{ backgroundColor: "#ffffffff" }}>
      <ThemedView style={styles.container}>
        <VStack alignItems="center" space="lg">
          <Text style={styles.dateText}>
            {new Date().toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </Text>

          <HStack space="lg">
            <StatBox
              title="Protein"
              value={`${totals.total_protein}g`}
              color="#ef4444"
            />
            <StatBox
              title="Carbs"
              value={`${totals.total_carbs}g`}
              color="#22c55e"
            />
          </HStack>

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
                style={{ fontSize: 28, fontWeight: "bold", fill: "#000000ff" }}
                text={`${consumed} kcal`}
              />
              <VictoryLabel
                textAnchor="middle"
                x={200}
                y={220}
                style={{ fontSize: 20, fill: "#000000cc" }}
                text={`${remaining} left`}
              />
            </Svg>
          </Box>

          <HStack space="lg">
            <StatBox
              title="Fats"
              value={`${totals.total_fat}g`}
              color="#facc15"
            />
            <StatBox title="Water" value="100ml" color="#2d05f6ff" />
          </HStack>
        </VStack>
      </ThemedView>
    </ScrollView>
  );
}

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
