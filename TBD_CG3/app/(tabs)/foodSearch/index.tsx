import { Box, CloseIcon, HStack, Icon, Pressable, SearchIcon, Text, View } from "@gluestack-ui/themed";
import { BadgePlus, Barcode } from 'lucide-react-native';
import React from 'react';
import { ScrollView } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import BarcodeScreen from './barcode';
import CreateFoodScreen from './createFood';


const Header = () => {
  return (
    <Box
      bg="$backgroundLight0"
      width="100%"
      px="$4"
      py="$3"
      borderBottomWidth={1}
      borderColor="$backgroundLight0" // to blend with TopNavBar
    >
      <HStack justifyContent="space-between" alignItems="center">
        <HStack alignItems="center" space="md">
          <Box
            bg="$backgroundLight200"
            width={40}
            height={40}
            rounded="$full"
            justifyContent="center"
            alignItems="center"
          >
            <Icon as={CloseIcon} color="$textLight500"/>
          </Box>
          <Text fontSize="$lg" fontWeight="$bold" color="$textLight800">
            Search
          </Text>
        </HStack>

        <Pressable>
          <Text fontSize="$md" color="$textLight700">
            macro
          </Text>
        </Pressable>
      </HStack>
    </Box>
  );
};

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
  const dailyGoal = 3500;
  const consumed = 1500;
  const remaining = dailyGoal - consumed;

  const data = [
    { x: "consumed", y: consumed },
    { x: "remaining", y: remaining },
  ];

  // Track active button for TopNavBar
  const [activeButton, setActiveButton] = React.useState('search');

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>

      <Header />
      <TopNavBar activeButton={activeButton} setActiveButton={setActiveButton} />

      {activeButton === 'search' && (
        <View>
          
        </View>
      )}

      {activeButton === 'barcode' && <BarcodeScreen />}
      {activeButton === 'create' && <CreateFoodScreen />}
    
    </ScrollView>
  );
}