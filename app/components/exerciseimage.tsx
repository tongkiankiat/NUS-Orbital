import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Dimensions, Alert, TouchableOpacity, ImageBackground, StatusBar } from 'react-native';
import { supabase } from '../../lib/supabase';
import { SelectList } from 'react-native-dropdown-select-list';
import { router } from 'expo-router';
import FlipCard from 'react-native-flip-card';

// Define screen dimensions here
const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

const AnatomyScreen = () => {
  // Define useState variables
  const [isflipped, setIsFlipped] = useState(false);

  // Toggle image flip
  const toggleFlip = () => {
    setIsFlipped(!isflipped);
  };

  // Move to muscle groups screen
  const nextScreen = (selectedMuscleGroup: string) => {
    router.push({
      pathname: '../components/musclegroup',
      params: {
        muscle: selectedMuscleGroup
      },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.flipcard}>
        <FlipCard
          friction={6}
          perspective={1000}
          flipVertical={false}
          flipHorizontal={true}
          flip={isflipped}
          clickable={false}
          style={{ width: '100%', height: '100%' }}
        >
          {/* Front Side */}
          <View style={{ flex: 1 }}>
            <ImageBackground style={styles.image} source={require('../../assets/images/muscular_system_front.png')}>
              {/* Neck */}
              <TouchableOpacity
                style={[styles.clickableArea, { top: '15%', left: '45%', width: '9%', height: '5%' }]}
                onPress={() => nextScreen('neck')}
              />
              {/* Traps */}
              <TouchableOpacity
                style={[styles.clickableArea, { top: '15%', left: '36%', width: '8%', height: '5%' }]}
                onPress={() => nextScreen('traps')}
              />
              <TouchableOpacity
                style={[styles.clickableArea, { top: '15%', left: '56%', width: '8%', height: '5%' }]}
                onPress={() => nextScreen('traps')}
              />
              {/* Shoulders */}
              <TouchableOpacity
                style={[styles.clickableArea, { top: '20%', left: '27%', width: '11%', height: '5%' }]}
                onPress={() => nextScreen('shoulders')}
              />
              <TouchableOpacity
                style={[styles.clickableArea, { top: '20%', left: '62%', width: '11%', height: '5%' }]}
                onPress={() => nextScreen('shoulders')}
              />
              {/* Chest */}
              <TouchableOpacity
                style={[styles.clickableArea, { top: '21%', left: '39%', width: '22%', height: '9%' }]}
                onPress={() => nextScreen('chest')}
              />
              {/* Abs */}
              <TouchableOpacity
                style={[styles.clickableArea, { top: '32%', left: '38%', width: '24%', height: '15%' }]}
                onPress={() => nextScreen('abdominals')}
              />
              {/* Biceps */}
              <TouchableOpacity
                style={[styles.clickableArea, { top: '30%', left: '25%', width: '10%', height: '7%' }]}
                onPress={() => nextScreen('biceps')}
              />
              <TouchableOpacity
                style={[styles.clickableArea, { top: '30%', left: '65%', width: '10%', height: '7%' }]}
                onPress={() => nextScreen('biceps')}
              />
              {/* Forearms */}
              <TouchableOpacity
                style={[styles.clickableArea, { top: '38%', left: '20%', width: '10%', height: '14%' }]}
                onPress={() => nextScreen('forearms')}
              />
              <TouchableOpacity
                style={[styles.clickableArea, { top: '38%', left: '70%', width: '10%', height: '14%' }]}
                onPress={() => nextScreen('forearms')}
              />
              {/* Quads */}
              <TouchableOpacity
                style={[styles.clickableArea, { top: '55%', left: '35%', width: '16%', height: '19%' }]}
                onPress={() => nextScreen('quadriceps')}
              />
              <TouchableOpacity
                style={[styles.clickableArea, { top: '55%', left: '50%', width: '16%', height: '19%' }]}
                onPress={() => nextScreen('quadriceps')}
              />
              {/* Calves */}
              <TouchableOpacity
                style={[styles.clickableArea, { top: '75%', left: '36%', width: '12%', height: '24%' }]}
                onPress={() => nextScreen('calves')}
              />
              <TouchableOpacity
                style={[styles.clickableArea, { top: '75%', left: '52%', width: '12%', height: '24%' }]}
                onPress={() => nextScreen('calves')}
              />
            </ImageBackground>
          </View>
          {/* Back Side */}
          <View style={{ flex: 1 }}>
            <ImageBackground style={styles.image} source={require('../../assets/images/muscular_system_back.png')}>
              {/* Middle Back */}
              <TouchableOpacity
                style={[styles.clickableArea, { top: '15%', left: '44%', width: '11%', height: '10%' }]}
                onPress={() => nextScreen('middle back')}
              />
              {/* Shoulders */}
              <TouchableOpacity
                style={[styles.clickableArea, { top: '19%', left: '24%', width: '11%', height: '7%' }]}
                onPress={() => nextScreen('shoulders')}
              />
              <TouchableOpacity
                style={[styles.clickableArea, { top: '19%', left: '65%', width: '11%', height: '7%' }]}
                onPress={() => nextScreen('shoulders')}
              />
              {/* Lats */}
              <TouchableOpacity
                style={[styles.clickableArea, { top: '26%', left: '36%', width: '10%', height: '9%' }]}
                onPress={() => nextScreen('lats')}
              />
              <TouchableOpacity
                style={[styles.clickableArea, { top: '26%', left: '54%', width: '10%', height: '9%' }]}
                onPress={() => nextScreen('lats')}
              />
              <TouchableOpacity
                style={[styles.clickableArea, { top: '35%', left: '38%', width: '7%', height: '4%' }]}
                onPress={() => nextScreen('lats')}
              />
              <TouchableOpacity
                style={[styles.clickableArea, { top: '35%', left: '55%', width: '7%', height: '4%' }]}
                onPress={() => nextScreen('lats')}
              />
              {/* Lower Back */}
              <TouchableOpacity
                style={[styles.clickableArea, { top: '36%', left: '46%', width: '8%', height: '9%' }]}
                onPress={() => nextScreen('lower back')}
              />
              {/* Triceps */}
              <TouchableOpacity
                style={[styles.clickableArea, { top: '30%', left: '25%', width: '10%', height: '7%' }]}
                onPress={() => nextScreen('triceps')}
              />
              <TouchableOpacity
                style={[styles.clickableArea, { top: '30%', left: '65%', width: '10%', height: '7%' }]}
                onPress={() => nextScreen('triceps')}
              />
              {/* Forearms */}
              <TouchableOpacity
                style={[styles.clickableArea, { top: '38%', left: '20%', width: '10%', height: '14%' }]}
                onPress={() => nextScreen('forearms')}
              />
              <TouchableOpacity
                style={[styles.clickableArea, { top: '38%', left: '70%', width: '10%', height: '14%' }]}
                onPress={() => nextScreen('forearms')}
              />
              {/* Glutes */}
              <TouchableOpacity
                style={[styles.clickableArea, { top: '46%', left: '38%', width: '24%', height: '12%' }]}
                onPress={() => nextScreen('glutes')}
              />
              {/* Hamstrings */}
              <TouchableOpacity
                style={[styles.clickableArea, { top: '59%', left: '36%', width: '28%', height: '15%' }]}
                onPress={() => nextScreen('hamstrings')}
              />
              {/* Calves */}
              <TouchableOpacity
                style={[styles.clickableArea, { top: '75%', left: '35%', width: '12%', height: '25%' }]}
                onPress={() => nextScreen('calves')}
              />
              <TouchableOpacity
                style={[styles.clickableArea, { top: '75%', left: '54%', width: '12%', height: '25%' }]}
                onPress={() => nextScreen('calves')}
              />
            </ImageBackground>
          </View>
        </FlipCard>
        <TouchableOpacity style={styles.button} onPress={toggleFlip}>
          <Text style={styles.buttonText}>{isflipped === false ? 'Back' : 'Front'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E4FBFF',
    paddingTop: StatusBar.currentHeight
  },
  flipcard: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: undefined,
    height: undefined,
    aspectRatio: 0.7,
    resizeMode: 'contain',
  },
  clickableArea: {
    position: 'absolute',
    // enable below for debugging purposes
    // backgroundColor: 'rgba(0, 0, 0, 0.3)',
    backgroundColor: 'rgba(0, 0, 0, 0)'
  },
  button: {
    alignSelf: 'center',
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10,
    marginBottom: 50,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AnatomyScreen;
