import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, SectionList, Alert, StatusBar } from 'react-native';
import axios from 'axios';
import { router, useLocalSearchParams } from 'expo-router';
import { supabase } from '../../lib/supabase';

const Generate_MealPlan = () => {
  const { height, weight, age, gender, goals, active_level, allergies } = useLocalSearchParams();

  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  const meals = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

  const finishRegistration = async () => {
    const user = await supabase.auth.getUser();
    if (!user) {
      console.error('No such user!');
      return;
    };
    const uuid = user.data.user?.id

    try {
      for (let i = 0; i < recommendations.length; i++) {
        const mealType = i === 0 ? 'Breakfast' : i === 1 ? 'Lunch' : i === 2 ? 'Dinner' : 'Snacks';
        for (const item of recommendations[i]) {
          const { error } = await supabase.from('recommended_diets').insert({
            id: uuid,
            food_name: item.Name,
            meal: mealType,
            calories: item.Calories,
            carbs: item.CarbohydrateContent,
            protein: item.ProteinContent,
            fats: item.FatContent,
          });
          if (error) {
            throw error;
          }
        }
      }
      Alert.alert('Success!', 'Registration successfully completed!', [{ text: 'OK', onPress: () => router.push('../(loggedIn)/home') }]);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while saving the data. Please try again.');
    }
  };

  const generateRecommendations = async () => {
    setLoading(true);
    try {
      const params = {
        height: height,
        weight: weight,
        age: age,
        gender: gender,
        activity: active_level,
        alleriges: allergies?.toString(),
        weight_change: goals,
        breakfast: 0.30,
        lunch: 0.40,
        dinner: 0.25,
        snacks: 0.05
      };

      const response = await axios.get('http://192.168.1.141:5000/generate_recommendations', { params });
      setRecommendations(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateRecommendations();
  }, []);

  const renderMealItem = ({ item }) => (
    <View style={styles.mealItem}>
      <Text style={styles.mealName}>{item.Name}</Text>
      <Text style={styles.mealMacros}>Calories: {item.Calories}</Text>
      <Text style={styles.mealMacros}>Carbs: {item.CarbohydrateContent}g</Text>
      <Text style={styles.mealMacros}>Protein: {item.ProteinContent}g</Text>
      <Text style={styles.mealMacros}>Fat: {item.FatContent}g</Text>
    </View>
  );

  const sectionData = [
    { title: 'Breakfast', data: recommendations[0] || [] },
    { title: 'Lunch', data: recommendations[1] || [] },
    { title: 'Dinner', data: recommendations[2] || [] },
    { title: 'Snacks', data: recommendations[3] || [] }
  ];

  const renderSeparator = () => (
    <View style={styles.separator} />
  );

  const renderSectionSeparator = () => (
    <View style={styles.sectionSeparator} />
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Generating Meal...</Text>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <SectionList
            sections={sectionData}
            renderItem={renderMealItem}
            renderSectionHeader={({ section: { title } }) => (
              <Text style={styles.sectionHeader}>{title}</Text>
            )}
            ItemSeparatorComponent={renderSeparator}
            SectionSeparatorComponent={renderSectionSeparator}
            keyExtractor={(item, index) => `${item.Name}-${index}`}
          />
          <View style={{ alignItems: 'center' }}>
            <TouchableOpacity style={styles.button} onPress={generateRecommendations}>
              <Text style={styles.buttonText}>Generate Another Meal Plan</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={finishRegistration}>
              <Text style={styles.buttonText}>This looks good!</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    backgroundColor: '#f0f0f0',
    padding: 5,
    marginTop: 10,
    borderRadius: 5,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginHorizontal: 20,
  },
  sectionSeparator: {
    height: 1,
    backgroundColor: 'black',
    marginVertical: 10,
  },
  mealItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  mealName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  mealMacros: {
    fontSize: 14,
    color: '#666',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default Generate_MealPlan;
