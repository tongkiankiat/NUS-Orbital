import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, SectionList } from 'react-native';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';

const Generate_MealPlan = () => {
  // Get params from previous screen: 'registration_mealtimes'
  const { height, weight, age, gender, goals, active_level, allergies } = useLocalSearchParams();

  // Define useState variables
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

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
      }

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
    { title: 'Snacks', data: recommendations[3] || [] },
  ]

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Generating Meal...</Text>
        </View>
      ) : (
        <SectionList
          sections={sectionData}
          renderItem={renderMealItem}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionHeader}>{title}</Text>
          )}
          keyExtractor={(item, index) => item.Name + index}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
  }
});

export default Generate_MealPlan;
