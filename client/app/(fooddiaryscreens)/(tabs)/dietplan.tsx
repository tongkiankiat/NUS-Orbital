import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Alert, FlatList, ActivityIndicator } from 'react-native';
import { supabase } from '../../../lib/supabase';
import { DateTime } from 'luxon';

const DietPlan = ({meal_time}) => {
  // Define useState variables
  const [loading, setLoading] = useState(false);
  const [dietplan, setDietPlan] = useState<any[]>([]);
  const [selectedMeal, setSelectedMeal] = useState<any>();
  const [renderScreen, setRenderScreen] = useState(false);

  // Render screen when all diet details are retrieved
  useEffect(() => {
    if (dietplan.length > 0) {
      setRenderScreen(true);
    }
  }, [dietplan]);

  // Retrieve generated meal plans from database
  const getData = async () => {
    setLoading(true);
    const user = await supabase.auth.getUser();
    if (!user) {
      console.error('No such user!');
      setLoading(false);
      return;
    };
    const uuid = user.data.user?.id;

    try {
      const { data, error } = await supabase.from('recommended_diets').select('*').eq('id', uuid);
      if (error) {
        Alert.alert('Error retrieving diet plan: ', error.message);
      } else if (data) {
        setDietPlan(data.filter(item => item.meal === meal_time));
      };
    } catch (error) {
      console.error('Error retrieving diet plan: ', error);
    } finally {
      setLoading(false);
    };
  };

  useEffect(() => {
    getData();
  }, []);

  const select_meal = (meal) => {
    setSelectedMeal(meal);
    Alert.alert('Log Meal', 'Are you sure you want to log this meal?', [{ text: 'Yes', onPress: logMeal}, { text: 'No' }]);
  }

  // Log meal
  const logMeal = async () => {
    console.log('Selected Meal:', selectedMeal)
    const user = await supabase.auth.getUser();
    if (!user) {
      console.error('No such user!');
      return;
    };
    const uuid = user.data.user?.id;
    setLoading(true);
    try {
      const {error} = await supabase.from('meals').insert({'id': uuid, food_name: selectedMeal?.food_name, meal: selectedMeal, meal_time: meal_time, date: DateTime.now().setZone('Asia/Singapore').toISODate()});
      if (error) {
        Alert.alert('Error occured while logging meal: ', error.message);
      } else {
        Alert.alert('Success!', 'Meal Logged Successfully');
      };
    } catch (error) {
      console.error('Error occured while logging meal: ', error);
    } finally {
      setLoading(false);
    };
  };

  const renderDiet = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity onPress={() => {select_meal(item)}}>
        <Text style={styles.mealName}>{item.food_name}</Text>
        <Text style={styles.mealMacros}>Calories: {item.calories}</Text>
        <Text style={styles.mealMacros}>Carbs: {item.carbs}</Text>
        <Text style={styles.mealMacros}>Fats: {item.fats}</Text>
        <Text style={styles.mealMacros}>Protein: {item.protein}</Text>
      </TouchableOpacity>
    );
  };

  return (
    renderScreen ?
      <View style={styles.container}>
        <FlatList
          data={dietplan}
          renderItem={renderDiet}
          keyExtractor={item => item.diet_id.toString()}
          ItemSeparatorComponent={() => {
            return (
              <View style={styles.separator} />
            )
          }}
        />
      </View>
      :
      <View style={styles.loadingcontainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E4FBFF',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 10
  },
  loadingcontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10
  },
  mealName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333'
  },
  mealMacros: {
    fontSize: 14,
    color: '#666'
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
  }
})

export default DietPlan;
