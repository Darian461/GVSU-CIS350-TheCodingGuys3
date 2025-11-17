import { ThemedView } from "@/components/themed-view";
import { Table, TableBody, TableData, TableRow } from "@/components/ui/table";
import { Box, CloseIcon, HStack, Icon, Input, InputField, InputIcon, InputSlot, Pressable, SearchIcon, Spinner } from "@gluestack-ui/themed";
import { BadgePlus, Barcode } from 'lucide-react-native';
import React from 'react';
import { ScrollView } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import BarcodeScreen from '../foodSearch/barcode';
import CreateFoodScreen from '../foodSearch/createFood';
import { Text } from "@gluestack-ui/themed";

// for development
const ip = 'use your ip';

async function fetchData(searchTerm: string) {
  try {
    const response = await fetch(`${ip}/search-food/?query=${searchTerm}`);
    const data = await response.json();
    return data;
  }
  catch (error) {
    console.error('Error fetching data: ', error);
    return [];
  }
}

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

  // Track active button for TopNavBar
  const [activeButton, setActiveButton] = React.useState('search');
  const [searchText, setSearchText] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);

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


  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>

      {/* <Header /> -> commented out "Search" header to keep original header*/}
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
            
            <InputField 
              placeholder="Enter food name here..."
              value={searchText}
              onChangeText={setSearchText}
            />
            
            {searchText.length > 0 && (
              <InputSlot px="$2">
                <Pressable onPress={() => setSearchText('')}>
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
            <Table>
              <TableBody>
                { searchResults.map((item) => (
                  <TableRow key={item.fdcId}>
                    <TableData>
                      <Text fontWeight="$medium">{ item.description } </Text>
                      { item.brandName && (
                        <Text fontSize="$sm" color="$textLight500">
                          { item.brandName }
                        </Text>
                      )}
                    </TableData>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          { !loading && searchText.length > 0 && searchResults.length === 0 && (
            <Box p="$4" alignItems="center">
              <Text color="$textLight500">No results found</Text>
            </Box>
          )}
        </ThemedView>
      )}

      {activeButton === 'barcode' && <BarcodeScreen />}
      {activeButton === 'create' && <CreateFoodScreen />}
    
    </ScrollView>
  );
}