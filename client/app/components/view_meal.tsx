import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Alert, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Feather, Fontisto } from '@expo/vector-icons';
import { router } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { DateTime } from 'luxon';
import DateTimePicker from 'react-native-modal-datetime-picker';

interface Ingredient {
  food_id: number;
  food_name: string;
  food_description: string;
  calories: number;
  fats: number;
  carbs: number;
  protein: number;
  weight: number;
  quantity: number;
  allergens: string[];
  meal_time: string
}

const ViewMeal = () => {
  // Define useState variables
  // const [date, setDate] = useState(DateTime.now().setZone('Asia/Singapore').toISODate());
  const [date, setDate] = useState(new Date());
  const [showModal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [meals, setMeals] = useState<{ meal_id: number, meal_time: string }[]>([]);
  const [queriedmeals, setQueriedMeals] = useState<Ingredient[]>([]);
  const [filteredmeals, setFilteredMeals] = useState<Ingredient[]>([]);

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

  // Date Picker Icon; select the date to view meals eaten previously 
  const showDatePicker = () => {
    setModal(true);
  };

  const hideDatePicker = () => {
    setModal(false);
  };

  const handleConfirm = (date: Date) => {
    setDate(date)
    hideDatePicker();
  };

  const renderMealItem = ({ item }: { item: Ingredient }) => {
    return (
      <View style={styles.mealItem}>
        <Text style={styles.mealName}>{item.food_name}</Text>
        <Text>{item.food_description}</Text>
        <Text>Calories: {item.calories}</Text>
        <Text>Protein: {item.protein}g</Text>
        <Text>Carbs: {item.carbs}g</Text>
        <Text>Fats: {item.fats}g</Text>
      </View>
    );
  };

  const filterMealsByTime = (mealTime: string) => {
    return queriedmeals.filter(meal => meal.meal_time === mealTime);
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
        <Text style={{ textAlign: 'center', fontSize: 20, flex: 1, paddingLeft: 30 }}>{DateTime.fromJSDate(date).toFormat('yyyy-MM-dd')}</Text>
        <>
          <TouchableOpacity onPress={showDatePicker}>
            <Fontisto name="date" size={24} color="black" style={{ paddingRight: 5 }} />
          </TouchableOpacity>
          <DateTimePicker
            isVisible={showModal}
            date={date}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />
        </>
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