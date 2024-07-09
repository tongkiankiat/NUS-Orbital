import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import SharedHeader from '../components/sharedheader';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AnatomyScreen from '../components/exerciseimage';
import CategorySearch from '../components/exercisecategorysearch';

const Tab = createMaterialTopTabNavigator();

const Workout = () => {

  return (
    <View style={styles.container}>
      <SharedHeader />
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: { backgroundColor: "#E4FBFF" },
        }}
      >
        <Tab.Screen name="Image" component={AnatomyScreen} />
        <Tab.Screen name="Categories" component={CategorySearch} />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E4FBFF',
  }
});

export default Workout;
