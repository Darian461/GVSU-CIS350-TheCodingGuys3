import React from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";
import {
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryTheme,
  Style,
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

const HorizontalLine = (yValue, color) => (
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

export default function WeightChart() {
  const firstY = weightData[0]?.y;
  const currentY = weightData[weightData.length - 1]?.y;
  const goalY = 170;

  return (
    <View style={styles.chartContainer}>
      <View style={styles.navRow}>
        <Text>Weight History</Text>
      </View>
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
});
