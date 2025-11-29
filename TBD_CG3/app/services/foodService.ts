import { getToken } from "./tokenService";

const API_URL = 'http://10.0.0.69:8000';

export const fetchFood = async (searchQuery: string) => {
  try {
    console.log('Attempting to fetch from:', `${API_URL}/search?q=${searchQuery}`);
    
    const response = await fetch(`${API_URL}/search-food/?query=${searchQuery}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Response received:', {
      status: response.status,
      ok: response.ok,
      statusText: response.statusText
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Failed to fetch food: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Data received:', data);
    return data;
  } catch (error) {
    console.error('Error in fetchFood:', error);
    // Log more details about the error
    if (error instanceof TypeError) {
      console.error('Network error - is the server running?');
    }
    throw error;
  }
};

export const fetchFoodDetails = async (fdcId: string) => {
  try {
    console.log('Fetching food details for:', fdcId);
    
    const response = await fetch(`${API_URL}/food-details/${fdcId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Food details response:', response.status);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch food details: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching food details:', error);
    throw error;
  }
};

export const addFoodToLog = async (foodData: {
  food_name: string;
  calories: number;
  fat: number;
  trans_fat?: number;
  saturated_fat?: number;
  carbs: number;
  fiber?: number;
  sugar?: number;
  added_sugars?: number;
  protein: number;
  cholesterol?: number;
  sodium?: number;
  vitamin_a?: number;
  vitamin_c?: number;
  calcium?: number;
  iron?: number;
  potassium?: number;
  caffeine?: number;
  quantity?: number;
}) => {
  try {
    const token = await getToken();

    if (!token) {
      throw new Error("No authentication token found. Please log in again.");
    }

    const response = await fetch(`${API_URL}/food-log/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(foodData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to add food to log");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding food to log:", error);
    throw error;
  }
};

export async function addCustomFoodToLog(foodData: {
  food_name: string;
  calories: number;
  fat: number;
  trans_fat?: number;
  saturated_fat?: number;
  carbs: number;
  fiber?: number;
  sugar?: number;
  added_sugars?: number;
  protein: number;
  cholesterol?: number;
  sodium?: number;
  vitamin_a?: number;
  vitamin_c?: number;
  calcium?: number;
  iron?: number;
  potassium?: number;
  caffeine?: number;
  quantity?: number;
}) {
  try {
    const token = await getToken();
    
    if (!token) {
      throw new Error('No authentication token found. Please log in again.');
    }
    
    const response = await fetch(`${API_URL}/food-log/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(foodData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to add food to log');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding custom food to log:', error);
    throw error;
  }
}