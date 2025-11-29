import {
  AlertCircleIcon,
  Box,
  Button,
  ButtonText,
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
  Heading,
  Input,
  InputField,
  Toast,
  ToastDescription,
  ToastTitle,
  VStack,
  useToast,
} from "@gluestack-ui/themed";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView as RNScrollView,
} from "react-native";
import { FoodFormErrors, NutrientField, Nutrients } from "../../interfaces";
import { getToken } from "../login";

const ip = "http://192.168.86.54:8000";

async function addCustomFoodToLog(foodData: {
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
      throw new Error("No authentication token found. Please log in again.");
    }

    const response = await fetch(`${ip}/food-log/`, {
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
    console.error("Error adding custom food to log:", error);
    throw error;
  }
}

const CreateFoodScreen: React.FC = () => {
  const [foodName, setFoodName] = useState<string>("");
  const [nutrients, setNutrients] = useState<Nutrients>({
    calories: "",
    fat: "",
    "trans fat": "",
    "saturated fat": "",
    carbs: "",
    fiber: "",
    sugar: "",
    "added sugar": "",
    protein: "",
    cholesterol: "",
    sodium: "",
    "vitamin a": "",
    "vitamin c": "",
    calcium: "",
    iron: "",
    potassium: "",
    caffeine: "",
  });

  const [errors, setErrors] = useState<FoodFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const toast = useToast();

  const nutrientFields: NutrientField[] = [
    { key: "calories", label: "Energy (kcal)", unit: "kcal" },
    { key: "fat", label: "Total Fat (g)", unit: "g" },
    { key: "trans fat", label: "Trans Fat (g)", unit: "g" },
    { key: "saturated fat", label: "Saturated Fat (g)", unit: "g" },
    { key: "carbs", label: "Carbohydrates (g)", unit: "g" },
    { key: "fiber", label: "Dietary Fiber (g)", unit: "g" },
    { key: "sugar", label: "Total Sugars (g)", unit: "g" },
    { key: "added sugar", label: "Added Sugars (g)", unit: "g" },
    { key: "protein", label: "Protein (g)", unit: "g" },
    { key: "cholesterol", label: "Cholesterol (mg)", unit: "mg" },
    { key: "sodium", label: "Sodium (mg)", unit: "mg" },
    { key: "vitamin a", label: "Vitamin A (mcg)", unit: "mcg" },
    { key: "vitamin c", label: "Vitamin C (mg)", unit: "mg" },
    { key: "calcium", label: "Calcium (mg)", unit: "mg" },
    { key: "iron", label: "Iron (mg)", unit: "mg" },
    { key: "potassium", label: "Potassium (mg)", unit: "mg" },
    { key: "caffeine", label: "Caffeine (mg)", unit: "mg" },
  ];

  const handleNutrientChange = (key: keyof Nutrients, value: string): void => {
    setNutrients((prev: Nutrients) => ({
      ...prev,
      [key]: value,
    }));

    if (errors[key]) {
      setErrors((prev: FoodFormErrors) => ({
        ...prev,
        [key]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FoodFormErrors = {};

    // Validate name is filled
    if (!foodName.trim()) {
      newErrors.foodName = "Food name is required";
    }

    // Validate only positive numbers
    Object.entries(nutrients).forEach(([key, value]: [string, string]) => {
      if (value && (isNaN(Number(value)) || Number(value) < 0)) {
        newErrors[key] = "Must be a positive number";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const foodLogData = {
        food_name: foodName,
        calories: Number(nutrients.calories) || 0,
        fat: Number(nutrients.fat) || 0,
        trans_fat: Number(nutrients["trans fat"]) || 0,
        saturated_fat: Number(nutrients["saturated fat"]) || 0,
        carbs: Number(nutrients.carbs) || 0,
        fiber: Number(nutrients.fiber) || 0,
        sugar: Number(nutrients.sugar) || 0,
        added_sugars: Number(nutrients["added sugar"]) || 0,
        protein: Number(nutrients.protein) || 0,
        cholesterol: Number(nutrients.cholesterol) || 0,
        sodium: Number(nutrients.sodium) || 0,
        vitamin_a: Number(nutrients["vitamin a"]) || 0,
        vitamin_c: Number(nutrients["vitamin c"]) || 0,
        calcium: Number(nutrients.calcium) || 0,
        iron: Number(nutrients.iron) || 0,
        potassium: Number(nutrients.potassium) || 0,
        caffeine: Number(nutrients.caffeine) || 0,
        quantity: 1,
      };

      console.log("Submitting custom food:", foodLogData);

      await addCustomFoodToLog(foodLogData);

      // Show success message
      toast.show({
        placement: "bottom",
        render: ({ id }) => {
          return (
            <Toast nativeID={id} action="success" variant="solid">
              <VStack space="xs">
                <ToastTitle>Success!</ToastTitle>
                <ToastDescription>
                  {foodName} has been added to your food log
                </ToastDescription>
              </VStack>
            </Toast>
          );
        },
      });

      // Reset form
      setFoodName("");
      setNutrients({
        calories: "",
        fat: "",
        "trans fat": "",
        "saturated fat": "",
        carbs: "",
        fiber: "",
        sugar: "",
        "added sugar": "",
        protein: "",
        cholesterol: "",
        sodium: "",
        "vitamin a": "",
        "vitamin c": "",
        calcium: "",
        iron: "",
        potassium: "",
        caffeine: "",
      });
    } catch (error: any) {
      console.error("Error submitting custom food:", error);
      Alert.alert(
        "Error",
        error.message || "Failed to add food to log. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <RNScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Box flex={1} p="$6" bg="$white">
          <VStack space="xl">
            <Heading size="2xl" mb="$4">
              Create a New Food
            </Heading>

            {/* Food Name Input */}
            <FormControl isInvalid={!!errors.foodName} isRequired>
              <FormControlLabel>
                <FormControlLabelText>Food Name</FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField
                  placeholder="Enter food name"
                  value={foodName}
                  onChangeText={(text: string) => {
                    setFoodName(text);
                    if (errors.foodName) {
                      setErrors((prev: FoodFormErrors) => ({
                        ...prev,
                        foodName: undefined,
                      }));
                    }
                  }}
                  onBlur={() => {
                    if (!foodName.trim()) {
                      setErrors((prev: FoodFormErrors) => ({
                        ...prev,
                        foodName: "Food name is required",
                      }));
                    }
                  }}
                />
              </Input>
              {errors.foodName && (
                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} />
                  <FormControlErrorText>{errors.foodName}</FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>

            {/* Nutrition Facts Header */}
            <Heading size="lg" mt="$4" mb="$2">
              Nutrition Facts
            </Heading>

            {/* Nutrient Input Fields */}
            <VStack space="md">
              {nutrientFields.map(({ key, label, unit }: NutrientField) => (
                <FormControl key={key} isInvalid={!!errors[key]}>
                  <FormControlLabel>
                    <FormControlLabelText>{label}</FormControlLabelText>
                  </FormControlLabel>
                  <Input>
                    <InputField
                      placeholder={`Enter ${label.toLowerCase()}`}
                      value={nutrients[key]}
                      onChangeText={(text: string) =>
                        handleNutrientChange(key, text)
                      }
                      onBlur={() => {
                        const value = nutrients[key];
                        if (
                          value &&
                          (isNaN(Number(value)) || Number(value) < 0)
                        ) {
                          setErrors((prev: FoodFormErrors) => ({
                            ...prev,
                            [key]: "Must be a positive number",
                          }));
                        }
                      }}
                      keyboardType="numeric"
                    />
                  </Input>
                  {errors[key] && (
                    <FormControlError>
                      <FormControlErrorIcon as={AlertCircleIcon} />
                      <FormControlErrorText>{errors[key]}</FormControlErrorText>
                    </FormControlError>
                  )}
                </FormControl>
              ))}
            </VStack>

            {/* Submit Button */}
            <Button
              size="lg"
              mt="$6"
              mb="$8"
              onPress={handleSubmit}
              bg="$primary600"
              isDisabled={isSubmitting}
            >
              <ButtonText>
                {isSubmitting ? "Adding..." : "Add to Food Log"}
              </ButtonText>
            </Button>
          </VStack>
        </Box>
      </RNScrollView>
    </KeyboardAvoidingView>
  );
};

export default CreateFoodScreen;
