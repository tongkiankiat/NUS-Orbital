import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Alert, FlatList, Modal } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { supabase } from '../../../lib/supabase';
import Icon from 'react-native-vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { DateTime } from 'luxon';

const add_custommeal = () => {
  // Define useState variables
  const [loading, setLoading] = useState(false);
  const [customMeals, setCustomMeals] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState([]);
  const [selectedMealName, setSelectedMealName] = useState('');

  // Get the meal_time from meals page
  const { meal_time } = useLocalSearchParams();

  // Retrieve custom meals from db
  const getCustomMeals = async () => {
    const user = await supabase.auth.getUser();
    if (!user) {
      console.error('No such user!');
      return;
    }
    const uuid = user.data.user?.id;
    setLoading(true);

    try {
      const { data: customMeals, error } = await supabase.from('custom_meals').select('meal').eq('id', uuid);
      if (error) {
        Alert.alert('Error retrieving custom meals: ', error.message);
      } else if (customMeals) {
        setCustomMeals(customMeals);
      }
    } catch (error) {
      console.error('Error retrieving custom meals: ', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getCustomMeals();
  }, []);

  // Log Custom Meal to DB
  const LogMeal = async () => {
    setLoading(true);
    //send to database
    const user = await supabase.auth.getUser();
    if (!user) {
      console.error('No such user!');
    }
    const uuid = user.data.user?.id;
    try {
      const { error: sendError } = await supabase.from('meals').insert({ 'id': uuid, meal: selectedMeal[0], meal_time: meal_time, date: DateTime.now().setZone('Asia/Singapore').toISODate(), custom_meal: true, 'food_name': selectedMealName});
      if (!sendError) {
        Alert.alert('Success!', `Meal Logged for ${meal_time}`);
      } else {
        Alert.alert(`Error logging meal for ${meal_time}: `, sendError.message);
      }
    } catch (error) {
      console.error('Error occured: ', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.item} onPress={() => handlePress(item)}>
        <Text>{item.meal.name}</Text>
      </TouchableOpacity>
    )
  }

  const renderMeals = ({ item }) => {
    return (
      <View>
        <Text>Food Item: {item.food_name}</Text>
        <Text>Calories: {item.calories}kcal</Text>
        <Text>Carbs: {item.carbs}g</Text>
        <Text>Fats: {item.fats}g</Text>
        <Text>Protein: {item.protein}g</Text>
      </View>
    )
  }

  const handlePress = (item) => {
    setSelectedMeal(item.meal.mealIngredients);
    setSelectedMealName(item.meal.name)
    setModalVisible(true);
  }

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerarrow} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontSize: 16, textAlign: 'center', alignItems: 'center', paddingRight: 30 }}>Add Your Custom Meal!</Text>
      </View>
      <FlatList
        data={customMeals}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        style={styles.flatlist}
      />
      <Modal
        visible={modalVisible}
        animationType='slide'
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
              <Text style={{fontSize: 18, fontWeight: 'bold', flex: 1, alignItems: 'flex-start'}}>{selectedMealName}</Text>
              <TouchableOpacity style={styles.log_button} onPress={LogMeal}>
                <Text style={{ textAlign: 'center', fontSize: 14 }}>Log Meal</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { closeModal() }}>
                <Icon name='close-circle' size={24} color='#007BFF' />
              </TouchableOpacity>
            </View>
            <FlatList
              data={selectedMeal}
              renderItem={renderMeals}
              keyExtractor={(item, index) => index.toString()}
              ItemSeparatorComponent={() => {
                return (
                  <View style={styles.separator} />
                )
              }}
            />
          </View>
        </View>
      </Modal>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E4FBFF',
    paddingTop: StatusBar.currentHeight
  },
  headerarrow: {
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  flatlist: {
    flex: 1,
    marginTop: 20,
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    elevation: 5,
    maxHeight: 300
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },
  log_button: {
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: '#00F627',
    margin: 5,
    paddingHorizontal: 5
  },
})

export default add_custommeal;