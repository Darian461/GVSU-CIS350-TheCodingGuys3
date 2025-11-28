import React, { useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { ScrollView, StyleSheet, Text, View, Dimensions } from 'react-native';
import { Box, VStack, HStack } from '@gluestack-ui/themed';
import { VictoryPie } from 'victory-native';
import Svg from 'react-native-svg';
import { getToken } from "../index";


const ip = "http://192.168.86.54:8000";
export default function HomeScreen() {
  const [totals, setTotals] = useState<any>(null);

  async function loadTotals() {
    try {
      const token = await getToken();
      console.log("Fetching with token:", token);

      if (!token) {
        console.log("No token found");
        return;
      }

      const res = await fetch(`${ip}/food-log/today/totals`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Status:", res.status);
      const text = await res.text();
      console.log("Raw response:", text);

      if (!res.ok) return;

      const data = JSON.parse(text);
      setTotals(data);
    } catch (err) {
      console.error("Fetch failed:", err);
    }
  }

  // This runs every time the screen becomes active again
  useFocusEffect(
    React.useCallback(() => {
      loadTotals();
    }, [])
  );

  if (!totals) {
    return <Text>No totals...</Text>;
  }

const screenWidth = Dimensions.get('window').width;

export default function MealDetailsPage() {
  const macros = [
    { x: 'Protein', y: 90, color: '#ef4444' },
    { x: 'Carbs', y: 180, color: '#22c55e' },
    { x: 'Fats', y: 60, color: '#facc15' },
  ];

  const nutrients = [
    { name: 'Calories', percent: 70 },
    { name: 'Fat', percent: 65 },
    { name: 'Tr. Fat', percent: 20 },
    { name: 'Sat. Fat', percent: 45 },
    { name: 'Carbs', percent: 80 },
    { name: 'Fiber', percent: 50 },
    { name: 'Sugar', percent: 90 },
    { name: 'Added Sugar', percent: 60 },
    { name: 'Protein', percent: 75 },
    { name: 'Chol', percent: 30 },
    { name: 'Sodium', percent: 55 },
    { name: 'Vitamin A', percent: 40 },
    { name: 'Vitamin C', percent: 65 },
    { name: 'Calcium', percent: 35 },
    { name: 'Iron', percent: 25 },
    { name: 'Potassium', percent: 50 },
    { name: 'Caffeine', percent: 10 },
  ];

  return (
    
    <ScrollView
  decelerationRate={0.9} // smaller = slower deceleration; try 0.9 for even slower
  scrollEventThrottle={16}
  showsVerticalScrollIndicator={false}
  bounces={true} // optional, for smooth iOS bounce
>
      <VStack alignItems="center" space="lg" p="$4">
        <Box alignItems="center" mb={30}>
          <Svg width={300} height={300} viewBox="0 0 400 400">
            <VictoryPie
              standalone={false}
              width={400}
              height={400}
              data={macros}
              innerRadius={100}
              padAngle={2}
              colorScale={macros.map((m) => m.color)}
              labels={({ datum }) => `${datum.x}\n${datum.y}g`}
              style={{ labels: { fill: 'black', fontSize: 18, fontWeight: '500' } }}
            />
          </Svg>
        </Box>

        <Box w="100%" bg="$backgroundLight100" rounded="$lg" p="$4" shadowColor="$backgroundDark950" shadowOpacity={0.1} mb={20}>
          <Text style={styles.sectionTitle}>Nutrient Breakdown</Text>
          <VStack space="md">
            {nutrients.map((nutrient, index) => (
              <View key={index} style={styles.nutrientRow}>
                <HStack justifyContent="space-between" alignItems="center">
                  <Text style={styles.nutrientLabel}>{nutrient.name}</Text>
                  <Text style={styles.nutrientPercent}>{nutrient.percent}%</Text>
                </HStack>
                <View style={styles.barBackground}>
                  <View style={[styles.barFill, { width: `${nutrient.percent}%` }]} />
                </View>
              </View>
            ))}
          </VStack>
        </Box>
      </VStack>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  nutrientRow: {
    marginBottom: 12,
  },
  nutrientLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  nutrientPercent: {
    fontSize: 14,
    color: '#555',
  },
  barBackground: {
    height: 10,
    backgroundColor: '#e5e7eb',
    borderRadius: 5,
    marginTop: 4,
    width: screenWidth * 0.9 - 32, // extend across the box width
  },
  barFill: {
    height: 10,
    backgroundColor: '#4f46e5',
    borderRadius: 5,
  },
});

