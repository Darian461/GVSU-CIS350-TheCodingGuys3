import { API_BASE_URL } from "@/app/config/apiConfig";
import { DailyTotal } from "@/interfaces";
import { getToken } from "./tokenService";

// CALORIE TAB
const API_URL = API_BASE_URL;

export const fetchCalorieHistory = async (startDate: string, endDate: string): Promise<DailyTotal[]> => {
  try {
    const token = await getToken();
    
    if (!token) {
      throw new Error("Not authenticated. Please log in.");
    }

    const url = `${API_URL}/food-log/history/daily-totals?start_date=${startDate}&end_date=${endDate}`;
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.detail || "Failed to fetch calorie history");
    }

    const dailyTotals: DailyTotal[] = await response.json();
    return dailyTotals;
  } catch (error) {
    console.error('Error fetching calorie history:', error);
    throw error;
  }
};