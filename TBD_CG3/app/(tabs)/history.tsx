import { useFocusEffect } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryScatter,
  VictoryTheme,
} from "victory-native";
import { fetchCalorieHistory } from "../services/historyService";

const weightData = [
  { x: new Date(2025, 10, 1), y: 180 },
  { x: new Date(2025, 10, 2), y: 182 },
  { x: new Date(2025, 10, 3), y: 177 },
  { x: new Date(2025, 10, 4), y: 179 },
  { x: new Date(2025, 10, 10), y: 173 },
  { x: new Date(2025, 10, 12), y: 175 },
  { x: new Date(2025, 10, 15), y: 172 },
  { x: new Date(2025, 10, 18), y: 171 },
  { x: new Date(2025, 10, 20), y: 169 },
  { x: new Date(2025, 10, 22), y: 168 },
  { x: new Date(2025, 10, 25), y: 167 },
];

const HorizontalLine = (yValue: number, color: string) => (
  <VictoryLine
    data={[
      { x: weightData[0].x, y: yValue },
      { x: weightData[weightData.length - 1].x, y: yValue },
    ]}
    style={{
      data: {
        stroke: color,
        strokeDasharray: "5,5",
        strokeWidth: 2,
      },
    }}
  />
);

interface CalorieDataPoint {
  x: Date;
  y: number;
}

export default function StatsPage() {
  const [selectedView, setSelectedView] = useState<"weight" | "calories">(
    "weight"
  );
  const [calorieData, setCalorieData] = useState<CalorieDataPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      if (selectedView === "calories") {
        fetchCalorieHistoryData();
      }
    }, [selectedView])
  );

  useEffect(() => {
    if (selectedView === "calories") {
      fetchCalorieHistoryData();
    }
  }, [selectedView]);

  const fetchCalorieHistoryData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get current month's start and end dates
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      // Format dates as YYYY-MM-DD
      const formatDate = (date: Date) => date.toISOString().split("T")[0];

      const dailyTotals = await fetchCalorieHistory(
        formatDate(startOfMonth),
        formatDate(endOfMonth)
      );

      const chartData = dailyTotals.map((day) => ({
        x: new Date(day.date),
        y: Math.round(day.calories),
      }));

      setCalorieData(chartData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching calorie history:", err);
    } finally {
      setLoading(false);
    }
  };

  const firstY = weightData[0]?.y;
  const currentY = weightData[weightData.length - 1]?.y;
  const goalY = 170;
  const calGoal = 2000;

  // Calculate statistics from calorie data
  const avgCal =
    calorieData.length > 0
      ? calorieData.reduce((sum, entry) => sum + entry.y, 0) /
        calorieData.length
      : 0;
  const avgCalRounded = Math.round(avgCal);
  const minCal =
    calorieData.length > 0
      ? Math.min(...calorieData.map((entry) => entry.y))
      : 0;
  const maxCal =
    calorieData.length > 0
      ? Math.max(...calorieData.map((entry) => entry.y))
      : 0;

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.sectionTitle}>History</Text>
      {/* Navigation Row */}
      <View style={styles.navRow}>
        <TouchableOpacity onPress={() => setSelectedView("weight")}>
          <Text
            style={{
              fontWeight: selectedView === "weight" ? "bold" : "normal",
              fontSize: 16,
            }}
          >
            Weight
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedView("calories")}>
          <Text
            style={{
              fontWeight: selectedView === "calories" ? "bold" : "normal",
              fontSize: 16,
            }}
          >
            Calories
          </Text>
        </TouchableOpacity>
      </View>

      {/* WEIGHT Page */}
      {selectedView === "weight" && (
        <>
          <View style={styles.chartBox}>
            <Text style={styles.chartTitle}>Weight Progress</Text>
            <VictoryChart
              width={Dimensions.get("window").width - 20}
              theme={VictoryTheme.material}
              scale={{ x: "time" }}
              padding={{ top: 20, bottom: 50, left: 50, right: 60 }}
            >
              <VictoryAxis
                tickFormat={(t) => `${t.getMonth() + 1}/${t.getDate()}`}
                style={{
                  tickLabels: { fontSize: 10, angle: -45, padding: 15 },
                }}
              />
              <VictoryAxis
                dependentAxis
                label="lbs"
                style={{
                  axisLabel: { padding: 35, fontSize: 11 },
                  tickLabels: { fontSize: 10, padding: 5 },
                }}
              />
              <VictoryLine
                data={weightData}
                style={{ data: { stroke: "#007AFF", strokeWidth: 3 } }}
              />
              {HorizontalLine(firstY, "red")}
              {HorizontalLine(170, "green")}
            </VictoryChart>
          </View>

          <View style={styles.displayBox}>
            <Text style={styles.recapTitle}></Text>
            <View style={styles.labelRow}>
              <View style={styles.labelCell}>
                <Text style={styles.labelTitle}>Starting</Text>
                <Text style={styles.labelValue}>{firstY} lbs</Text>
                <Text style={styles.labelUnits}>lbs</Text>
              </View>
              <View style={styles.labelCell}>
                <Text style={styles.labelTitle}>Current</Text>
                <Text style={styles.labelValue}>{currentY} lbs</Text>
                <Text style={styles.labelUnits}>lbs</Text>
              </View>
              <View style={styles.labelCell}>
                <Text style={styles.labelTitle}>Goal</Text>
                <Text style={styles.labelValue}>{goalY} lbs</Text>
                <Text style={styles.labelUnits}>lbs</Text>
              </View>
            </View>
            <Text style={styles.difference}>
              Remaining till Goal: {Math.abs(currentY - goalY)} lbs
            </Text>
          </View>

          <View style={styles.logWeightButton}>
            <Text style={{ color: "#f9f9f9" }}>+ Log New Weight</Text>
          </View>
        </>
      )}

      {/* CALORIES Page */}
      {selectedView === "calories" && (
        <>
          <View style={styles.chartBox}>
            <Text style={styles.chartTitle}>Calories History</Text>

            {loading ? (
              <ActivityIndicator
                size="large"
                color="#007AFF"
                style={{ marginVertical: 50 }}
              />
            ) : error ? (
              <View style={{ paddingVertical: 30 }}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : calorieData.length === 0 ? (
              <Text style={styles.noDataText}>No calorie data available</Text>
            ) : (
              <VictoryChart
                width={Dimensions.get("window").width - 20}
                theme={VictoryTheme.material}
                scale={{ x: "time" }}
                padding={{ top: 20, bottom: 50, left: 50, right: 60 }}
              >
                <VictoryAxis
                  tickFormat={(t) => `${t.getMonth() + 1}/${t.getDate()}`}
                  style={{
                    tickLabels: { fontSize: 10, angle: -45, padding: 15 },
                  }}
                />
                <VictoryAxis
                  dependentAxis
                  label="Calories"
                  style={{
                    axisLabel: { padding: 40, fontSize: 11 },
                    tickLabels: { fontSize: 10, padding: 5 },
                  }}
                />
                <VictoryScatter
                  data={calorieData}
                  size={5}
                  style={{
                    data: {
                      fill: "#FF9500",
                      stroke: "#FF9500",
                      strokeWidth: 1.5,
                    },
                  }}
                />
              </VictoryChart>
            )}
          </View>

          <View style={styles.displayBox}>
            <View style={styles.labelRow}>
              <View style={styles.labelCell}>
                <Text style={styles.labelTitle}>Daily Goal</Text>
                <Text style={styles.labelValue}>{calGoal}</Text>
                <Text style={styles.labelUnits}>calories</Text>
              </View>
              <View style={styles.labelCell}>
                <Text style={styles.labelTitle}>Average</Text>
                <Text style={styles.labelValue}>
                  {calorieData.length > 0 ? avgCalRounded : "-"}
                </Text>
                <Text style={styles.labelUnits}>calories</Text>
              </View>
            </View>
            <View style={styles.labelRow}>
              <View style={styles.labelCell}>
                <Text style={styles.labelTitle}>Lowest Day</Text>
                <Text style={styles.labelValue}>
                  {calorieData.length > 0 ? minCal : "-"}
                </Text>
              </View>
              <View style={styles.labelCell}>
                <Text style={styles.labelTitle}>Highest Day</Text>
                <Text style={styles.labelValue}>
                  {calorieData.length > 0 ? maxCal : "-"}
                </Text>
              </View>
            </View>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  chartContainer: {
    margin: 20,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  chartBox: {
    width: "100%",
    maxWidth: Dimensions.get("window").width - 20,
    padding: 15,
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  displayBox: {
    marginTop: 15,
    width: "100%",
    maxWidth: Dimensions.get("window").width - 20,
    padding: 15,
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    alignItems: "center",
  },
  recapTitle: {
    fontSize: 1,
    fontWeight: "700",
    marginBottom: 5,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 8,
  },
  labelCell: {
    alignItems: "center",
    flex: 1,
  },
  labelTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  labelValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#007AFF",
  },
  labelUnits: {
    fontSize: 12,
    color: "#555",
  },
  difference: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
  },
  logWeightButton: {
    marginTop: 15,
    backgroundColor: "#000000ff",
    alignItems: "center",
    borderRadius: 8,
    maxWidth: Dimensions.get("window").width - 20,
    width: "100%",
    height: 35,
    justifyContent: "center",
  },
  navRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 12,
    borderRadius: 4,
  },
  errorText: {
    color: "red",
    textAlign: "center",
  },
  noDataText: {
    color: "#555",
    textAlign: "center",
    marginVertical: 20,
  },
});
