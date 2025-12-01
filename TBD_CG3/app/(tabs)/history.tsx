import { useFocusEffect } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  Button,
  Alert,
} from "react-native";
import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryScatter,
  VictoryTheme,
} from "victory-native";
import { getToken } from "../services/tokenService";
import { fetchCalorieHistory } from "../services/historyService";
import { WEIGHT_ENDPOINT } from "../config/apiConfig";

interface DataPoint {
  x: Date;
  y: number;
}

export default function StatsPage() {
  const [selectedView, setSelectedView] = useState<"weight" | "calories">(
    "weight"
  );

  // Weight states
  const [weightData, setWeightData] = useState<DataPoint[]>([]);
  const [weightLoading, setWeightLoading] = useState(false);
  const [weightError, setWeightError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newWeight, setNewWeight] = useState("");

  // Calorie states
  const [calorieData, setCalorieData] = useState<DataPoint[]>([]);
  const [calorieLoading, setCalorieLoading] = useState(false);
  const [calorieError, setCalorieError] = useState<string | null>(null);

  const goalWeight = 170;
  const calGoal = 2000;

  // Fetch weight history
  const loadWeightHistory = async () => {
    setWeightLoading(true);
    setWeightError(null);
    try {
      const token = await getToken();
      if (!token) throw new Error("No auth token");

      const res = await fetch(WEIGHT_ENDPOINT, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch weight history");

      const data = await res.json();
      const formatted: DataPoint[] = data
        .map((item: any) => ({
          x: new Date(item.logged_at),
          y: item.weight,
        }))
        .sort((a, b) => a.x.getTime() - b.x.getTime());

      setWeightData(formatted);
    } catch (err) {
      console.error("loadWeightHistory error:", err);
      setWeightError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setWeightLoading(false);
    }
  };

  // Log a new weight
  const logWeight = async (weight: number) => {
    try {
      const token = await getToken();
      if (!token) throw new Error("No auth token");

      const res = await fetch(WEIGHT_ENDPOINT, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ weight }),
      });

      if (!res.ok) throw new Error("Failed to log weight");

      setModalVisible(false);
      setNewWeight("");
      loadWeightHistory();
    } catch (err) {
      console.error("logWeight error:", err);
      Alert.alert(
        "Error",
        err instanceof Error ? err.message : "Unknown error"
      );
    }
  };

  // Fetch calorie history
  const fetchCalorieHistoryData = async () => {
    setCalorieLoading(true);
    setCalorieError(null);
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const formatDate = (date: Date) => date.toISOString().split("T")[0];

      const dailyTotals = await fetchCalorieHistory(
        formatDate(startOfMonth),
        formatDate(endOfMonth)
      );

      const formatted: DataPoint[] = dailyTotals.map((day) => ({
        x: new Date(day.date),
        y: Math.round(day.calories),
      }));

      setCalorieData(formatted);
    } catch (err) {
      console.error("fetchCalorieHistoryData error:", err);
      setCalorieError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setCalorieLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      if (selectedView === "weight") loadWeightHistory();
      else fetchCalorieHistoryData();
    }, [selectedView])
  );

  useEffect(() => {
    if (selectedView === "weight") loadWeightHistory();
    else fetchCalorieHistoryData();
  }, [selectedView]);

  // Goals
  const HorizontalLine = (data: DataPoint[], yValue: number, color: string) => (
    <VictoryLine
      data={[
        { x: data[0]?.x ?? new Date(), y: yValue },
        { x: data[data.length - 1]?.x ?? new Date(), y: yValue },
      ]}
      style={{
        data: { stroke: color, strokeDasharray: "5,5", strokeWidth: 2 },
      }}
    />
  );

  // Weight stats
  const firstWeight = weightData[0]?.y ?? 0;
  const currentWeight = weightData[weightData.length - 1]?.y ?? 0;

  // Calorie stats
  const avgCal =
    calorieData.length > 0
      ? calorieData.reduce((sum, entry) => sum + entry.y, 0) /
        calorieData.length
      : 0;
  const avgCalRounded = Math.round(avgCal);
  const minCal =
    calorieData.length > 0 ? Math.min(...calorieData.map((e) => e.y)) : 0;
  const maxCal =
    calorieData.length > 0 ? Math.max(...calorieData.map((e) => e.y)) : 0;

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.sectionTitle}>History</Text>

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

      {/* Weight View */}
      {selectedView === "weight" && (
        <>
          <View style={styles.chartBox}>
            {weightLoading ? (
              <ActivityIndicator size="large" color="#007AFF" />
            ) : weightError ? (
              <Text style={styles.errorText}>{weightError}</Text>
            ) : weightData.length === 0 ? (
              <Text style={styles.noDataText}>No weight data available</Text>
            ) : (
              <>
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
                      tickLabels: { fontSize: 10 },
                    }}
                  />
                  <VictoryLine
                    data={weightData}
                    style={{ data: { stroke: "#007AFF", strokeWidth: 3 } }}
                  />
                  {HorizontalLine(weightData, firstWeight, "red")}
                  {HorizontalLine(weightData, goalWeight, "green")}
                </VictoryChart>
              </>
            )}
          </View>

          <View style={styles.displayBox}>
            <View style={styles.labelRow}>
              <View style={styles.labelCell}>
                <Text style={styles.labelTitle}>Starting</Text>
                <Text style={styles.labelValue}>{firstWeight} lbs</Text>
              </View>
              <View style={styles.labelCell}>
                <Text style={styles.labelTitle}>Current</Text>
                <Text style={styles.labelValue}>{currentWeight} lbs</Text>
              </View>
              <View style={styles.labelCell}>
                <Text style={styles.labelTitle}>Goal</Text>
                <Text style={styles.labelValue}>{goalWeight} lbs</Text>
              </View>
            </View>
            <Text style={styles.difference}>
              Remaining till Goal: {Math.abs(currentWeight - goalWeight)} lbs
            </Text>
          </View>

          <TouchableOpacity
            style={styles.logWeightButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={{ color: "#f9f9f9" }}>+ Log New Weight</Text>
          </TouchableOpacity>

          <Modal visible={modalVisible} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text>Enter new weight (lbs):</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={newWeight}
                  onChangeText={setNewWeight}
                />
                <Button
                  title="Submit"
                  onPress={() => logWeight(Number(newWeight))}
                />
                <Button
                  title="Cancel"
                  color="red"
                  onPress={() => setModalVisible(false)}
                />
              </View>
            </View>
          </Modal>
        </>
      )}

      {/* Calorie View */}
      {selectedView === "calories" && (
        <>
          <View style={styles.chartBox}>
            {calorieLoading ? (
              <ActivityIndicator size="large" color="#007AFF" />
            ) : calorieError ? (
              <Text style={styles.errorText}>{calorieError}</Text>
            ) : calorieData.length === 0 ? (
              <Text style={styles.noDataText}>No calorie data available</Text>
            ) : (
              <>
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
                    domain={[
                      Math.floor(minCal / 100) * 100,
                      Math.ceil(maxCal / 100) * 100,
                    ]}
                    tickFormat={(t) => Math.round(t)}
                    style={{
                      axisLabel: { padding: 40, fontSize: 11 },
                      tickLabels: { fontSize: 10 },
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
              </>
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
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 8,
  },
  labelCell: { alignItems: "center", flex: 1 },
  labelTitle: { fontSize: 14, fontWeight: "600" },
  labelValue: { fontSize: 16, fontWeight: "700", color: "#007AFF" },
  labelUnits: { fontSize: 12, color: "#555" },
  difference: { fontSize: 14, color: "#555", marginTop: 5 },
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
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
  },
  modalContent: { backgroundColor: "#fff", borderRadius: 10, padding: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginVertical: 10,
    borderRadius: 5,
    fontSize: 16,
  },
  errorText: { color: "red", textAlign: "center" },
  noDataText: { color: "#555", textAlign: "center", marginVertical: 20 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
});
