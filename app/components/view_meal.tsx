import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Alert, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Feather, Fontisto } from '@expo/vector-icons';
import { router } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { DateTime } from 'luxon';

const ViewMeal = () => {
  // Define useState variables
  const [date, setDate] = useState(DateTime.now().setZone('Asia/Singapore').toISODate());
  const [loading, setLoading] = useState(false);
  const [meals, setMeals] = useState<[]>([])

  // Date Picker Icon; select the date to view meals eaten previously 
  const onChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };

  const showMode = (currentMode: any) => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: currentMode
    });
  };

  const showDatePicker = () => {
    showMode('date');
  };

  // Fetch meals data from supabase
  const getMeals = async () => {
    const user = await supabase.auth.getUser();
    if (!user) {
      console.error('No such user!');
      return;
    }
    const uuid = user.data.user?.id;
    setLoading(true);
    try {
      const { data: mealsData, error } = await supabase.from('meals').select('*').eq('id', uuid).eq('date', date);
      if (error) {
        Alert.alert('Error occured fetching meals: ', error.message);
      } else if (mealsData) {
        if (mealsData.length === 0) {
          console.log(`No recorded meals found on ${date}!`);
          setMeals([]);
        } else {
          setMeals(mealsData);
        }
      }
    } catch (error) {
      console.error('Error occured fetching meals: ', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMeals();
  }, [date])

  const renderMealItem = ({ item }) => {
    const mealName = item.meal_name || item.meal.food_name;
    const foodDescription = item.meal.food_description || item.meal[0].food_description;
    const calories = item.meal.calories || item.meal[0].calories;
    const protein = item.meal.protein || item.meal[0].protein;
    const carbs = item.meal.carbs || item.meal[0].protein;
    const fats = item.meal.fats || item.meal[0].fats;
    return (
      <View style={styles.mealItem}>
        <Text style={styles.mealName}>{mealName}</Text>
        <Text>{foodDescription}</Text>
        <Text>Calories: {calories}</Text>
        <Text>Protein: {protein}g</Text>
        <Text>Carbs: {carbs}g</Text>
        <Text>Fats: {fats}g</Text>
      </View>
    )
  };

  const filterMealsByTime = (mealTime) => {
    return meals.filter(meal => meal.meal_time === mealTime);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerarrow} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
        <Text style={{ flex: 1, textAlign: 'center', fontSize: 24, alignItems: 'center', paddingRight: 30 }}>View Meals</Text>
      </View>
      <View style={styles.dateheader}>
        <Text style={{ textAlign: 'center', fontSize: 20, flex: 1, paddingLeft: 30 }}>{date}</Text>
        <TouchableOpacity onPress={() => showDatePicker()}>
          <Fontisto name="date" size={24} color="black" style={{ paddingRight: 5 }} />
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1 }}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Breakfast</Text>
          {filterMealsByTime('Breakfast').length === 0 ? (
            <Text>No recorded meals found on {DateTime.fromJSDate(date).toFormat('yyyy-MM-dd')}!</Text>
          ) : (
            <FlatList
              data={filterMealsByTime('Breakfast')}
              renderItem={renderMealItem}
              keyExtractor={(item, index) => index.toString()}
            />
          )}
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lunch</Text>
          {filterMealsByTime('Lunch').length === 0 ? (
            <Text>No recorded meals found on {DateTime.fromJSDate(date).toFormat('yyyy-MM-dd')}!</Text>
          ) : (
            <FlatList
              data={filterMealsByTime('Lunch')}
              renderItem={renderMealItem}
              keyExtractor={(item, index) => index.toString()}
            />
          )}
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dinner</Text>
          {filterMealsByTime('Dinner').length === 0 ? (
            <Text>No recorded meals found on {DateTime.fromJSDate(date).toFormat('yyyy-MM-dd')}!</Text>
          ) : (
            <FlatList
              data={filterMealsByTime('Dinner')}
              renderItem={renderMealItem}
              keyExtractor={(item, index) => index.toString()}
            />
          )}
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Snacks</Text>
          {filterMealsByTime('Snacks').length === 0 ? (
            <Text>No recorded meals found on {DateTime.fromJSDate(date).toFormat('yyyy-MM-dd')}!</Text>
          ) : (
            <FlatList
              data={filterMealsByTime('Snacks')}
              renderItem={renderMealItem}
              keyExtractor={(item, index) => index.toString()}
            />
          )}
        </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5
  },
  headerarrow: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "flex-start"
  },
  dateheader: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexDirection: 'row',
    borderBottomColor: 'black',
    borderBottomWidth: 1
  },
  section: {
    flex: 1,
    marginVertical: 10,
    paddingHorizontal: 10,
    borderBottomColor: 'black',
    borderBottomWidth: 1
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  mealItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  mealName: {
    fontSize: 18,
    fontWeight: 'bold'
  }
});

export default ViewMeal;