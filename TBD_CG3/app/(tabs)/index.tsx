import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';
import { VictoryLabel, VictoryPie, VictoryTheme } from 'victory';
import React from 'react';


export default function HomeScreen() {
  const dailyGoal = 2000;
  // Object data for Pie chart to be used within a state (so it can dynamically update values)
  const [dailyTotalData, setDailyTotalData] = React.useState([
    { x: "calories", y: 0},
    { x: "remaining", y: dailyGoal, fill: "transparent"}
  ]);

  // Function to add calories and returns new state for dailyTotalData
  function addToDaily(amount: number) {
    setDailyTotalData(prevData => {
      let calories = prevData[0].y + amount;
      calories = Math.max(0, calories);
      const remaining = dailyGoal - calories;
      return [
        { x: "calories", y: calories },
        { x: "remaining", y: remaining, fill: "transparent"}
      ]
    })
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      
      {/*Portion for pie chart*/}
      <ThemedView style={{ alignItems: 'center', marginVertical: 16 }}>
        <svg viewBox="0 0 400 400" width={400} height={400}>
          <VictoryPie
            style={{
              data: {
                fill: ({ datum }) => 
                  datum.x === "remaining" ? "transparent" : "#4f37d8b9",
                  stroke: "none", 
              },
            }}
            standalone={false}
            width={400}
            height={400}
            animate={{duration: 300}}
            theme={VictoryTheme.clean}
            data={dailyTotalData}
            labels={[]}
            cornerRadius={10}
            startAngle={0}
            innerRadius={125}
          />
          <VictoryLabel
            textAnchor="middle"
            style={{ fontSize: 25, fill: '#ffffffff' }}
            x={200}
            y={175}
            text={`${dailyTotalData[0].y} \nconsumed`}
          />
          <VictoryLabel
            textAnchor="middle"
            style={{ fontSize: 20, fill: '#ffffffff' }}
            x={200}
            y={230}
            text={`${dailyGoal - dailyTotalData[0].y} \nremaining`}
          />
        </svg>
        {/*for testing dynamic updates to pie chart*/}
        <button onClick={() => addToDaily(250)}>Add 250 Calories</button>
        <button onClick={() => addToDaily(-250)}>Remove 250 Calories</button>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
