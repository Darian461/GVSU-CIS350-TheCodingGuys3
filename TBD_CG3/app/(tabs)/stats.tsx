import React, { useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { ScrollView, StyleSheet, Text, View, Dimensions } from "react-native";
import { Box, VStack, HStack } from "@gluestack-ui/themed";
import { VictoryPie } from "victory-native";
import Svg from "react-native-svg";
import { getToken } from "../login";

const ip = "http://192.168.86.54:8000";

export default function HomeScreen() {
  const [totals, setTotals] = useState<any>(null);

  async function loadTotals() {
    try {
      const token = await getToken();
      console.log("Fetching with token:", token);

      if (!token) return;

      const res = await fetch(`${ip}/food-log/today/totals`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const text = await res.text();
      console.log("Raw response:", text);

      if (!res.ok) return;

      const data = JSON.parse(text);
      setTotals(data);
    } catch (err) {
      console.error("Fetch failed:", err);
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      loadTotals();
    }, [])
  );

  if (!totals) return <Text>No totals...</Text>;

  const screenWidth = Dimensions.get("window").width;

  const macros = [
    {
      x: "Protein",
      y: Math.round(totals.total_protein) ?? 0,
      color: "#ef4444",
    },
    { x: "Carbs", y: Math.round(totals.total_carbs) ?? 0, color: "#22c55e" },
    { x: "Fat", y: Math.round(totals.total_fat) ?? 0, color: "#facc15" },
  ];

  const nutrients = [
    { name: "Calories", value: totals.total_calories, goal: 200 },
    { name: "Protein", value: totals.total_protein, goal: 150 },
    { name: "Carbs", value: totals.total_carbs, goal: 250 },
    { name: "Fat", value: totals.total_fat, goal: 22 },
    { name: "Tr Fat", value: totals.total_trans_fat, goal: 2 },
    { name: "Sat Fat", value: totals.total_saturated_fat, goal: 22 },
    { name: "Fiber", value: totals.total_fiber, goal: 25 },
    { name: "Chol", value: totals.total_cholesterol, goal: 300 },
    { name: "Sodium", value: totals.total_sodium, goal: 2300 },
    { name: "Calcium", value: totals.total_calcium, goal: 1000 },
    { name: "Iron", value: totals.total_iron, goal: 18 },
    { name: "Potassium", value: totals.total_potassium, goal: 3500 },
    { name: "Caffeine", value: totals.total_caffeine, goal: 400 },
  ];

  return (
    <ScrollView
      decelerationRate={0.9}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
      bounces={true}
    >
      <VStack alignItems="center" space="lg" p="$4">
        {/* ===== PIE CHART ===== */}
        <Box alignItems="center" mb="$5">
          <Text style={styles.sectionTitle}>Macro Distribution</Text>
          <Svg width={300} height={300} viewBox="0 0 400 400">
            <VictoryPie
              standalone={false}
              width={400}
              height={400}
              data={macros}
              innerRadius={100}
              padAngle={2}
              colorScale={macros.map((m) => m.color)}
              labels={() => ""} // remove labels around pie
            />
          </Svg>
        </Box>

        {/* ===== HORIZONTAL LEGEND ===== */}
        <HStack space="lg" flexWrap="wrap" justifyContent="center">
          {macros.map((m, idx) => (
            <HStack key={idx} space="sm" alignItems="center">
              {/* Color Box */}
              <Box
                w={18}
                h={18}
                borderRadius={4}
                style={{ backgroundColor: m.color }}
              />

              {/* Label + Amount */}
              <Text>
                {m.x}: {m.y}g
              </Text>
            </HStack>
          ))}
        </HStack>

        {/* ===== NUTRIENTS ===== */}
        <Box
          w="100%"
          bg="$backgroundLight100"
          rounded="$lg"
          p="$4"
          shadowColor="$backgroundDark950"
          shadowOpacity={0.1}
          mb={20}
        >
          <Text style={styles.sectionTitle}>Nutrient Breakdown</Text>
          <VStack space="md">
            {nutrients.map((n, index) => (
              <View key={index} style={styles.nutrientRow}>
                <HStack justifyContent="space-between">
                  <Text style={styles.nutrientLabel}>
                    {n.name}: {Math.round(n.value)} / {n.goal}
                  </Text>
                </HStack>

                {/* Example bar (fake visual %) */}
                <View style={styles.barBackground}>
                  <View
                    style={[
                      styles.barFill,
                      { width: `${Math.min((n.value / n.goal) * 100, 100)}%` },
                    ]}
                  />
                </View>
              </View>
            ))}
          </VStack>
        </Box>
      </VStack>
    </ScrollView>
  );
}

const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  nutrientRow: {
    marginBottom: 12,
  },
  nutrientLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  barBackground: {
    height: 10,
    backgroundColor: "#e5e7eb",
    borderRadius: 5,
    marginTop: 4,
    width: screenWidth * 0.9 - 32,
  },
  barFill: {
    height: 10,
    backgroundColor: "#4f46e5",
    borderRadius: 5,
  },
});
