import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import {
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryTheme,
  VictoryScatter,
} from "victory-native";

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
  { x: new Date(2025, 10, 28), y: 165 },
  { x: new Date(2025, 10, 30), y: 164 },
];

const calorieData = [
  { x: new Date(2025, 9, 30), y: 2100 },
  { x: new Date(2025, 10, 1), y: 1950 },
  { x: new Date(2025, 10, 2), y: 2200 },
  { x: new Date(2025, 10, 3), y: 2000 },
  { x: new Date(2025, 10, 4), y: 1850 },
  { x: new Date(2025, 10, 5), y: 2500 },
  { x: new Date(2025, 10, 6), y: 2300 },
  { x: new Date(2025, 10, 7), y: 1900 },
  { x: new Date(2025, 10, 8), y: 2100 },
  { x: new Date(2025, 10, 9), y: 2250 },
  { x: new Date(2025, 10, 10), y: 1800 },
  { x: new Date(2025, 10, 11), y: 2400 },
  { x: new Date(2025, 10, 12), y: 2000 },
  { x: new Date(2025, 10, 13), y: 2150 },
  { x: new Date(2025, 10, 14), y: 2050 },
  { x: new Date(2025, 10, 15), y: 1900 },
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

export default function StatsPage() {
  const [selectedView, setSelectedView] = useState<"weight" | "calories">(
    "weight"
  );

  const firstY = weightData[0]?.y;
  const currentY = weightData[weightData.length - 1]?.y;
  const goalY = 170;
  const calGoal = 2000;
  const avgCal =
    calorieData.reduce((sum, entry) => sum + entry.y, 0) / calorieData.length;
  const avgCalRounded = Math.round(avgCal);
  const minCal = Math.min(...calorieData.map((entry) => entry.y));
  const maxCal = Math.max(...calorieData.map((entry) => entry.y));

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.sectionTitle}>History</Text>
      {/* Navigation Row */}
      <View style={styles.navRow}>
        <TouchableOpacity onPress={() => setSelectedView("weight")}>
          <Text
            style={{
              fontWeight: selectedView === "weight" ? "bold" : "normal",
            }}
          >
            Weight
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedView("calories")}>
          <Text
            style={{
              fontWeight: selectedView === "calories" ? "bold" : "normal",
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
                  axisLabel: { padding: 35, fontSize: 12 },
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
                  axisLabel: { padding: 35, fontSize: 12 },
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
                <Text style={styles.labelValue}>{avgCalRounded}</Text>
                <Text style={styles.labelUnits}>calories</Text>
              </View>
            </View>
            <View style={styles.labelRow}>
              <View style={styles.labelCell}>
                <Text style={styles.labelTitle}>Lowest Day</Text>
                <Text style={styles.labelValue}>{minCal}</Text>
              </View>
              <View style={styles.labelCell}>
                <Text style={styles.labelTitle}>Highest Day</Text>
                <Text style={styles.labelValue}>{maxCal}</Text>
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
    marginTop: 20,
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
    marginBottom: 8,
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
});
