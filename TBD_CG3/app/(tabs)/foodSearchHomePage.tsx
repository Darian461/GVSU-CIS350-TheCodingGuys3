import { ThemedView } from "@/components/themed-view";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import {
  Box,
  CloseIcon,
  HStack,
  Icon,
  Input,
  InputField,
  InputIcon,
  InputSlot,
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pressable,
  SearchIcon,
  Spinner,
  Text,
} from "@gluestack-ui/themed";
import { BadgePlus, Barcode } from "lucide-react-native";
import React from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
//import BarcodeScreen from "../foodSearch/barcode";
//import CreateFoodScreen from "../foodSearch/createFood";
import { getToken } from "../index";

// for development
const ip = "http://192.168.86.54:8000";

async function fetchData(searchTerm: string) {
  try {
    const response = await fetch(`${ip}/search-food/?query=${searchTerm}`);
    const data = await response.json();
    return data;
  } catch (error) {
    // console.error('Error fetching data: ', error);
    return [];
  }
}

async function fetchFoodDetails(fdcId: number) {
  try {
    const response = await fetch(`${ip}/food-details/${fdcId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching food details:", error);
    return null;
  }
}

async function addFoodToLog(foodData: {
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
    console.error("Error adding food to log:", error);
    throw error;
  }
}

const getNutrientValue = (nutrients: any[], label: string): number => {
  const nutrient = nutrients?.find((n) => n.label === label);
  if (!nutrient || nutrient.amount === null || nutrient.amount === undefined) {
    return 0;
  }

  // Convert kJ to kcal for calories
  if (label === "Calories" && nutrient.unit?.toLowerCase() === "kj") {
    return parseFloat((nutrient.amount / 4.184).toFixed(1));
  }

  return parseFloat(nutrient.amount);
};

const BUTTONS = [
  { key: "search", icon: SearchIcon },
  { key: "barcode", icon: Barcode },
  { key: "create", icon: BadgePlus },
];

const BUTTON_SIZE = 60;
const HIGHLIGHT_SIZE = 44;
const BUTTON_PADDING = 12;

const TopNavBar = ({
  activeButton,
  setActiveButton,
}: {
  activeButton: string;
  setActiveButton: (button: string) => void;
}) => {
  const [buttonLayouts, setButtonLayouts] = React.useState<
    Record<string, { x: number; width: number }>
  >({});

  // Calculate position based on active button
  const getTargetPosition = () => {
    const activeLayout = buttonLayouts[activeButton];
    if (!activeLayout) return 0;
    return activeLayout.x + (activeLayout.width - HIGHLIGHT_SIZE) / 2;
  };

  const translateX = useSharedValue(getTargetPosition());

  // Animate when active button changes
  React.useEffect(() => {
    const target = getTargetPosition();
    translateX.value = withSpring(target, {
      damping: 450,
      stiffness: 900,
    });
  }, [activeButton, buttonLayouts]);

  const highlightStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const handleLayout = (key: string, event: any) => {
    const { x, width } = event.nativeEvent.layout;
    setButtonLayouts((prev) => ({
      ...prev,
      [key]: { x, width },
    }));
  };

  const showHighlight = Object.keys(buttonLayouts).length === BUTTONS.length;

  return (
    <Box
      bg="$backgroundLight0"
      width="100%"
      px="$4"
      py="$0"
      borderBottomWidth={1}
      borderColor="$borderLight200"
    >
      <HStack
        justifyContent="space-around"
        alignItems="center"
        style={{ position: "relative" }}
      >
        {/* Animated highlight */}
        {showHighlight && (
          <Animated.View
            style={[
              {
                position: "absolute",
                left: 0,
                top: (BUTTON_SIZE - HIGHLIGHT_SIZE) / 2,
                width: HIGHLIGHT_SIZE,
                height: HIGHLIGHT_SIZE,
                borderRadius: HIGHLIGHT_SIZE / 2,
                backgroundColor: "#e5e7eb",
                opacity: 0.4,
              },
              highlightStyle,
            ]}
          />
        )}

        {BUTTONS.map((btn) => {
          const isActive = btn.key === activeButton;

          return (
            <Pressable
              key={btn.key}
              onPress={() => setActiveButton(btn.key)}
              onLayout={(e) => handleLayout(btn.key, e)}
              style={{
                width: BUTTON_SIZE,
                height: BUTTON_SIZE,
                justifyContent: "center",
                alignItems: "center",
                marginHorizontal: BUTTON_PADDING,
              }}
            >
              <Icon
                as={btn.icon}
                color={isActive ? "$textLight700" : "$textLight500"}
                size="xl"
              />
            </Pressable>
          );
        })}
      </HStack>
    </Box>
  );
};

export default function FoodSearch() {
  // Track active button for TopNavBar
  const [activeButton, setActiveButton] = React.useState("search");
  const [searchText, setSearchText] = React.useState("");
  const [searchResults, setSearchResults] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);

  // Modal states
  const [showModal, setShowModal] = React.useState(false);
  const [selectedFood, setSelectedFood] = React.useState<any>(null);
  const [foodDetails, setFoodDetails] = React.useState<any>(null);
  const [loadingDetails, setLoadingDetails] = React.useState(false);

  React.useEffect(() => {
    if (!searchText.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      const data = await fetchData(searchText);
      setSearchResults(data);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchText]);

  const handleFoodPress = async (item: any) => {
    setSelectedFood(item);
    setFoodDetails(null);
    setShowModal(true);
    setLoadingDetails(true);

    const details = await fetchFoodDetails(item.fdcId);
    setFoodDetails(details);
    setLoadingDetails(false);
  };

  // Sort nutrients by calories, carbs, protein, then fats
  const sortNutrients = (nutrients: any[]) => {
    const order = ["Calories", "Carbs", "Protein", "Fat"];
    const nutrientMap = new Map(nutrients.map((n) => [n.label, n]));

    const sorted = [];

    // Add priority nutrients first
    for (const label of order) {
      if (nutrientMap.has(label)) {
        sorted.push(nutrientMap.get(label));
        nutrientMap.delete(label);
      }
    }

    for (const nutrient of nutrients) {
      if (nutrientMap.has(nutrient.label)) {
        sorted.push(nutrient);
      }
    }

    return sorted;
  };

  // Format nutrient display values for kj to kcals
  const formatNutrientValue = (nutrient: any) => {
    if (nutrient.amount === null || nutrient.amount === undefined) {
      return "N/A";
    }

    if (nutrient.label === "Calories") {
      const unit = nutrient.unit?.toLowerCase() || "";
      let calories = nutrient.amount;

      // Convert kj to kcals
      if (unit === "kj") {
        calories = (nutrient.amount / 4.184).toFixed(0);
      }

      return `${calories} kcal`;
    }

    return `${nutrient.amount}${nutrient.unit || ""}`;
  };

  return (
    <>
      <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
        <TopNavBar
          activeButton={activeButton}
          setActiveButton={setActiveButton}
        />

        {activeButton === "search" && (
          <ThemedView>
            <Input variant="rounded" size="lg" mx="$2" my="$2">
              <InputSlot px="$2">
                <InputIcon as={SearchIcon} color="$textLight500" />
              </InputSlot>

              <InputField
                placeholder="Enter food name here..."
                value={searchText}
                onChangeText={setSearchText}
              />

              {searchText.length > 0 && (
                <InputSlot px="$2">
                  <Pressable onPress={() => setSearchText("")}>
                    <InputIcon as={CloseIcon} color="$textLight500" />
                  </Pressable>
                </InputSlot>
              )}
            </Input>

            {loading && (
              <Box p="$4" alignItems="center">
                <Spinner />
              </Box>
            )}

            {!loading && searchResults.length > 0 && (
              <Box>
                {searchResults.map((item) => (
                  <TouchableOpacity
                    key={item.fdcId}
                    onPress={() => handleFoodPress(item)}
                    style={{
                      padding: 16,
                      borderBottomWidth: 1,
                      borderBottomColor: "#e5e7eb",
                    }}
                  >
                    <Text fontWeight="$medium">{item.description}</Text>
                    {item.brandName && (
                      <Text fontSize="$sm" color="$textLight500">
                        {item.brandName}
                      </Text>
                    )}
                  </TouchableOpacity>
                ))}
              </Box>
            )}

            {!loading &&
              searchText.length > 0 &&
              searchResults.length === 0 && (
                <Box p="$4" alignItems="center">
                  <Text color="$textLight500">No results found</Text>
                </Box>
              )}
          </ThemedView>
        )}

        {activeButton === "barcode" && <BarcodeScreen />}
        {activeButton === "create" && <CreateFoodScreen />}
      </ScrollView>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedFood(null);
          setFoodDetails(null);
        }}
        size="lg"
      >
        <ModalBackdrop />
        <ModalContent maxHeight="90%">
          <ModalHeader borderBottomWidth={1} borderColor="$borderLight200">
            <Box flex={1} pr="$8">
              <Heading size="lg" numberOfLines={2}>
                {selectedFood?.description || "Food Details"}
              </Heading>
              {selectedFood?.brandName && (
                <Text fontSize="$sm" color="$textLight500" mt="$1">
                  {selectedFood.brandName}
                </Text>
              )}
            </Box>
            <ModalCloseButton>
              <Icon as={CloseIcon} />
            </ModalCloseButton>
          </ModalHeader>

          <ScrollView style={{ maxHeight: "100%" }}>
            <ModalBody>
              {loadingDetails ? (
                <Box py="$8" alignItems="center">
                  <Spinner size="large" />
                  <Text mt="$4" color="$textLight500">
                    Loading nutrition info...
                  </Text>
                </Box>
              ) : foodDetails ? (
                <Box
                  bg="$white"
                  borderWidth={2}
                  borderColor="$black"
                  borderRadius="$md"
                  mx="$2"
                  my="$2"
                  p="$4"
                >
                  {/* Nutrition Facts Header */}
                  <Box
                    borderBottomWidth={8}
                    borderColor="$black"
                    pb="$2"
                    mb="$3"
                  >
                    <Heading size="xl">Nutrition Facts</Heading>
                  </Box>

                  {/* Serving Size */}
                  <Box
                    borderBottomWidth={4}
                    borderColor="$black"
                    pb="$2"
                    mb="$2"
                  >
                    <Text fontSize="$sm">Serving size</Text>
                    <Text fontSize="$md" fontWeight="$semibold">
                      1 serving
                    </Text>
                  </Box>

                  {/* Nutrients List */}
                  <Box>
                    {foodDetails.nutrients &&
                    foodDetails.nutrients.length > 0 ? (
                      sortNutrients(foodDetails.nutrients).map(
                        (nutrient: any, index: number) => {
                          const isCalories = nutrient.label === "Calories";
                          const isMajorNutrient = [
                            "Fat",
                            "Carbs",
                            "Protein",
                          ].includes(nutrient.label);

                          return (
                            <Box
                              key={index}
                              borderBottomWidth={1}
                              borderColor="$borderLight300"
                              py="$2"
                              flexDirection="row"
                              justifyContent="space-between"
                              alignItems="center"
                            >
                              <Text
                                fontWeight={
                                  isCalories || isMajorNutrient
                                    ? "$bold"
                                    : "$normal"
                                }
                                fontSize={isCalories ? "$xl" : "$md"}
                              >
                                {nutrient.label}
                              </Text>
                              <Text
                                fontWeight={
                                  isCalories || isMajorNutrient
                                    ? "$bold"
                                    : "$normal"
                                }
                                fontSize={isCalories ? "$xl" : "$md"}
                              >
                                {formatNutrientValue(nutrient)}
                              </Text>
                            </Box>
                          );
                        }
                      )
                    ) : (
                      <Text color="$textLight500" textAlign="center" py="$4">
                        No nutrition information available
                      </Text>
                    )}
                  </Box>
                </Box>
              ) : (
                <Box py="$4" alignItems="center">
                  <Text color="$textLight500">
                    Failed to load nutrition information
                  </Text>
                </Box>
              )}
            </ModalBody>
          </ScrollView>

          <ModalFooter borderTopWidth={1} borderColor="$borderLight200">
            <Button
              onPress={async () => {
                try {
                  if (!foodDetails || !selectedFood) return;

                  // Helper function to get nutrient value by label
                  const getNutrientByLabel = (label: string): number => {
                    return getNutrientValue(foodDetails.nutrients, label);
                  };

                  const foodLogData = {
                    food_name: selectedFood.description,
                    calories: getNutrientByLabel("Calories"),
                    fat: getNutrientByLabel("Fat"),
                    trans_fat: getNutrientByLabel("Trans Fat"),
                    saturated_fat: getNutrientByLabel("Saturated Fat"),
                    carbs: getNutrientByLabel("Carbs"),
                    fiber: getNutrientByLabel("Fiber"),
                    sugar: getNutrientByLabel("Sugar"),
                    added_sugars: getNutrientByLabel("Added Sugars"),
                    protein: getNutrientByLabel("Protein"),
                    cholesterol: getNutrientByLabel("Cholesterol"),
                    sodium: getNutrientByLabel("Sodium"),
                    vitamin_a: getNutrientByLabel("Vitamin A"),
                    vitamin_c: getNutrientByLabel("Vitamin C"),
                    calcium: getNutrientByLabel("Calcium"),
                    iron: getNutrientByLabel("Iron"),
                    potassium: getNutrientByLabel("Potassium"),
                    caffeine: getNutrientByLabel("Caffeine"),
                    quantity: 1,
                  };

                  console.log("Sending complete food data:", foodLogData);

                  await addFoodToLog(foodLogData);

                  setShowModal(false);
                  setSelectedFood(null);
                  setFoodDetails(null);
                } catch (error: any) {
                  alert(error.message || "Failed to add food to log");
                }
              }}
            >
              <ButtonText>Add to Log</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
