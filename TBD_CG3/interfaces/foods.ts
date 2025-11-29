export interface Nutrients {
  calories: string;
  fat: string;
  'trans fat': string;
  'saturated fat': string;
  carbs: string;
  fiber: string;
  sugar: string;
  'added sugar': string;
  protein: string;
  cholesterol: string;
  sodium: string;
  'vitamin a': string;
  'vitamin c': string;
  calcium: string;
  iron: string;
  potassium: string;
  caffeine: string;
}

export interface NutrientField {
  key: keyof Nutrients;
  label: string;
  unit: string;
}

export interface FoodFormErrors {
  foodName?: string;
  [key: string]: string | undefined;
}

export interface DailyTotal {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  items_count: number;
}