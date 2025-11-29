import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE = "http://10.0.0.69:8000";

export const storeToken = async (token: string) => {
  try {
    await AsyncStorage.setItem("authToken", token);
  } catch (error) {
    console.error("Error storing token:", error);
  }
};

export const getToken = async () => {
  try {
    return await AsyncStorage.getItem("authToken");
  } catch (error) {
    console.error("Error getting token:", error);
    return null;
  }
};

export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem("authToken");
  } catch (error) {
    console.error("Error removing token:", error);
  }
};