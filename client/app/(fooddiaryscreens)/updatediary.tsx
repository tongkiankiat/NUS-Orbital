import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, StatusBar, TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Meals from './(tabs)/meals';
import { supabase } from '../../lib/supabase';
import DietPlan from './(tabs)/dietplan';
import { router, useGlobalSearchParams } from 'expo-router';

interface Food {
  food_id: string;
  food_name: string;
  food_description: string;
  calories: string;
  fat: string;
  carbs: string;
  protein: string;
};

const Tab = createMaterialTopTabNavigator();

const returnToHome = () => {
  router.back();
};

const Calories = () => {
  // Get meal_time from fooddiary
  const { meal_time } = useGlobalSearchParams();

  // Define useState variables
  const [loading, setLoading] = useState(false);
  const [allergies, setAllergies] = useState<[]>([]);

  const getAllergies = async () => {
    const user = await supabase.auth.getUser();
    if (!user) {
      console.error('No such user!');
    };
    const uuid = user.data.user?.id;
    setLoading(true);
    try {
      const { data, error } = await supabase.from('users').select('allergies').eq('id', uuid).single();
      setAllergies(data?.allergies || []);
    } catch (error) {
      console.error('Error occured: ', error);
    } finally {
      setLoading(false);
    };
  };

  useEffect(() => {
    getAllergies;
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header_navigate}>
        <TouchableOpacity style={styles.headerarrow} onPress={returnToHome}>
          <Feather name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Text>{meal_time}</Text>
        </View>
      </View>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: { backgroundColor: "#E4FBFF" },
        }}
      >
        <Tab.Screen name="Meals">
          {() => <Meals meal_time={meal_time} />}
        </Tab.Screen>
        <Tab.Screen name="Diet Plan">
          {() => <DietPlan meal_time={meal_time} />}
        </Tab.Screen>
      </Tab.Navigator>
      {loading && <Text>Loading...</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#E4FBFF",
  },
  header_navigate: {
    flexDirection: "row",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "black",
    paddingTop: StatusBar.currentHeight,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 5,
  },
  headerarrow: {
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingRight: 35,
  },
  searchbar: {
    flexDirection: "row",
    margin: 5,
    marginTop: 20,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 8,
  },
  searchButton: {
    padding: 10,
    backgroundColor: "#007BFF",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  searchButtonText: {
    color: "#FFF",
  },
});

export default Calories;