import { ThemedView } from "@/components/themed-view";
import { Table, TableBody, TableData, TableRow } from "@/components/ui/table";
import { Box, CloseIcon, HStack, Icon, Input, InputField, InputIcon, InputSlot, Pressable, SearchIcon, Text } from "@gluestack-ui/themed";
import { BadgePlus, Barcode } from 'lucide-react-native';
import React from 'react';
import { ScrollView } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import BarcodeScreen from '../foodSearch/barcode';
  import CreateFoodScreen from '../foodSearch/createFood';

// const Header = () => {
//   const navigation = useNavigation<NavigationProp<any>>();
//   return (
//     <Box
//       bg="$backgroundLight0"
//       width="100%"
//       px="$4"
//       py="$3"
//       borderBottomWidth={1}
//       borderColor="$backgroundLight0" // to blend with TopNavBar
//     >
//       <HStack justifyContent="space-between" alignItems="center">
//         <HStack alignItems="center" space="md">
//           <Box
//             bg="$backgroundLight200"
//             width={40}
//             height={40}
//             rounded="$full"
//             justifyContent="center"
//             alignItems="center"
//           >
//             <Pressable onPress={() => navigation.navigate('(tabs)', { screen: 'index'})}>
//               <Icon 
//                 as={CloseIcon} 
//                 color="$textLight500"/>
//             </Pressable>
//           </Box>
//           <Text fontSize="$lg" fontWeight="$bold" color="$textLight800">
//             Search
//           </Text>
//         </HStack>
//       </HStack>
//     </Box>
//   );
// };

const BUTTONS = [
  { key: 'search', icon: SearchIcon },
  { key: 'barcode', icon: Barcode },
  { key: 'create', icon: BadgePlus },
];

const BUTTON_SIZE = 60;
const HIGHLIGHT_SIZE = 44;
const BUTTON_PADDING = 12;

const TopNavBar = ({ activeButton, setActiveButton }: { 
  activeButton: string; 
  setActiveButton: (button: string) => void;
}) => {
  const [buttonLayouts, setButtonLayouts] = React.useState<Record<string, { x: number; width: number }>>({});
  
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
    setButtonLayouts(prev => ({
      ...prev,
      [key]: { x, width }
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
      <HStack justifyContent="space-around" alignItems="center" style={{ position: 'relative' }}>
        {/* Animated highlight */}
        {showHighlight && (
          <Animated.View
            style={[
              {
                position: 'absolute',
                left: 0,
                top: (BUTTON_SIZE - HIGHLIGHT_SIZE) / 2,
                width: HIGHLIGHT_SIZE,
                height: HIGHLIGHT_SIZE,
                borderRadius: HIGHLIGHT_SIZE / 2,
                backgroundColor: '#e5e7eb',
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
                justifyContent: 'center',
                alignItems: 'center',
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

  const [activeButton, setActiveButton] = React.useState('search');
  const [searchText, setSearchText] = React.useState('');

  // backend interaction states + base URL
  const API_BASE = "http://172.18.231.219:8000"; 
  const [results, setResults] = React.useState<any[]>([]);
  const [selectedFood, setSelectedFood] = React.useState<any | null>(null);
  const [loading, setLoading] = React.useState(false);

  // searchFoods + getFoodDetails functions
  const searchFoods = async () => {
    if (!searchText.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/search-food/?query=${encodeURIComponent(searchText)}`);
      const data = await res.json();
      setResults(data);
      setSelectedFood(null);
    } catch (error) {
      console.error("Error searching foods:", error);
    } finally {
      setLoading(false);
    }
  };

  const getFoodDetails = async (fdcId: number) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/food-details/${fdcId}`);
      const data = await res.json();
      setSelectedFood(data);
      setResults([]);
    } catch (error) {
      console.error("Error getting food details:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
      <TopNavBar activeButton={activeButton} setActiveButton={setActiveButton} />

      {activeButton === 'search' && (
        <ThemedView>
          <Input
            variant="rounded"
            size="lg"
            mx="$2"
            my="$2">
            <InputSlot px="$2">
              <InputIcon as={SearchIcon} color="$textLight500" />
            </InputSlot>

            {/* added onSubmitEditing to trigger search */}
            <InputField 
              placeholder="Enter food name here..."
              value={searchText}
              onChangeText={setSearchText}
              onSubmitEditing={searchFoods} 
            />

            {searchText.length > 0 && (
              <InputSlot px="$2">
                <Pressable onPress={() => setSearchText('')}>
                  <InputIcon as={CloseIcon} color="$textLight500" />
                </Pressable>
              </InputSlot>
            )}
          </Input>


          {/* show search results list */}
          {!selectedFood && !loading && results.length > 0 && (
            <Box mx="$2" my="$2">
              {results.map((item) => (
                <Pressable
                  key={item.fdcId}
                  onPress={() => getFoodDetails(item.fdcId)}
                  style={{
                    paddingVertical: 10,
                    borderBottomWidth: 1,
                    borderColor: '#eee'
                  }}
                >
                  <Box>
                    <HStack justifyContent="space-between" alignItems="center">
                      <Box>
                        <Text>{item.description}</Text>
                        {item.brandName && (
                          <Text style={{ color: '#ffffffff', fontSize: 12 }}>{item.brandName}</Text>
                        )}
                      </Box>
                    </HStack>
                  </Box>
                </Pressable>
              ))}
            </Box>
          )}

          {/* show selected food nutrients */}
          {selectedFood && !loading && (
            <Box mx="$2" my="$2">
              <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 8 }}>
                {selectedFood.description}
              </Text>

              {selectedFood.nutrients?.map((nutrient: any, index: number) => (
                <HStack key={index} justifyContent="space-between" mb="$2">
                  <Text>{nutrient.label}</Text>
                  <Text>{nutrient.amount} {nutrient.unit}</Text>
                </HStack>
              ))}

              <Pressable
                onPress={() => setSelectedFood(null)}
                style={{
                  marginTop: 10,
                  backgroundColor: '#e5e7eb',
                  padding: 10,
                  borderRadius: 8,
                }}
              >
                <Text>Back to Search</Text>
              </Pressable>
            </Box>
          )}

          {/* keep table placeholder for structure */}
          <Table>
            <TableBody>
              <TableRow>
                <TableData/>
              </TableRow>
            </TableBody>
          </Table>
        </ThemedView>
      )}

      {activeButton === 'barcode' && <BarcodeScreen />}
      {activeButton === 'create' && <CreateFoodScreen />}
    </ScrollView>
  );
}