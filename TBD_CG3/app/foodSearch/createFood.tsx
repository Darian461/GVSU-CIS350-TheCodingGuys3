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
  VStack
} from '@gluestack-ui/themed';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView as RNScrollView } from 'react-native';
import { FoodFormErrors, NutrientField, Nutrients } from '../../interfaces';

const CreateFoodScreen: React.FC = () => {
  const [foodName, setFoodName] = useState<string>('');
  const [nutrients, setNutrients] = useState<Nutrients>({
    calories: '',
    fat: '',
    'trans fat': '',
    'saturated fat': '',
    carbs: '',
    fiber: '',
    sugar: '',
    'added sugar': '',
    protein: '',
    cholesterol: '',
    sodium: '',
    'vitamin a': '',
    'vitamin c': '',
    calcium: '',
    iron: '',
    potassium: '',
    caffeine: '',
  });

  const [errors, setErrors] = useState<FoodFormErrors>({});

  const nutrientFields: NutrientField[] = [
    { key: 'calories', label: 'Energy (kcal)', unit: 'kcal' },
    { key: 'fat', label: 'Total Fat (g)', unit: 'g' },
    { key: 'trans fat', label: 'Trans Fat (g)', unit: 'g' },
    { key: 'saturated fat', label: 'Saturated Fat (g)', unit: 'g' },
    { key: 'carbs', label: 'Carbohydrates (g)', unit: 'g' },
    { key: 'fiber', label: 'Dietary Fiber (g)', unit: 'g' },
    { key: 'sugar', label: 'Total Sugars (g)', unit: 'g' },
    { key: 'added sugar', label: 'Added Sugars (g)', unit: 'g' },
    { key: 'protein', label: 'Protein (g)', unit: 'g' },
    { key: 'cholesterol', label: 'Cholesterol (mg)', unit: 'mg' },
    { key: 'sodium', label: 'Sodium (mg)', unit: 'mg' },
    { key: 'vitamin a', label: 'Vitamin A (mcg)', unit: 'mcg' },
    { key: 'vitamin c', label: 'Vitamin C (mg)', unit: 'mg' },
    { key: 'calcium', label: 'Calcium (mg)', unit: 'mg' },
    { key: 'iron', label: 'Iron (mg)', unit: 'mg' },
    { key: 'potassium', label: 'Potassium (mg)', unit: 'mg' },
    { key: 'caffeine', label: 'Caffeine (mg)', unit: 'mg' },
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
      newErrors.foodName = 'Food name is required';
    }

    // Validate only positive numbers
    Object.entries(nutrients).forEach(([key, value]: [string, string]) => {
      if (value && (isNaN(Number(value)) || Number(value) < 0)) {
        newErrors[key] = 'Must be a positive number';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (): void => {
    if (validateForm()) {
      const foodData = {
        name: foodName,
        nutrients: Object.entries(nutrients).reduce((acc: Record<string, number>, [key, value]: [string, string]) => {
          if (value) {
            acc[key] = Number(value);
          }
          return acc;
        }, {}),
      };
      
      console.log('Food data to submit:', foodData);
      // api call to add food to db
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
                      setErrors((prev: FoodFormErrors) => ({ ...prev, foodName: undefined }));
                    }
                  }}
                  onBlur={() => {
                    if (!foodName.trim()) {
                      setErrors((prev: FoodFormErrors) => ({ 
                        ...prev, 
                        foodName: 'Food name is required' 
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
                      onChangeText={(text: string) => handleNutrientChange(key, text)}
                      onBlur={() => {
                        const value = nutrients[key];
                        if (value && (isNaN(Number(value)) || Number(value) < 0)) {
                          setErrors((prev: FoodFormErrors) => ({
                            ...prev,
                            [key]: 'Must be a positive number',
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
            >
              <ButtonText>Create Food</ButtonText>
            </Button>
          </VStack>
        </Box>
      </RNScrollView>
    </KeyboardAvoidingView>
  );
};

export default CreateFoodScreen;