import { View, Text, TouchableOpacity, TextInput, StyleSheet, StatusBar, KeyboardAvoidingView, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { supabase } from '../../../lib/supabase';

interface CustomMeal {
  name: string;
  mealIngredients: Macros[];
}

interface Macros {
  food_name: string;
  calories: number;
  carbs: number;
  protein: number;
  fats: number;
}

const CustomMeals = () => {
  const [mealName, setMealName] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [customMeal, setMeal] = useState<CustomMeal>();
  const [calories, setCalories] = useState<string>('');
  const [carbs, setCarbs] = useState<string>('');
  const [protein, setProtein] = useState<string>('');
  const [fats, setFats] = useState<string>('');
  const [totalMacros, setTotalMacros] = useState<Macros[]>([]);
  
  useEffect(() => {
    setTotalMacros([{
      food_name: mealName,
      calories: parseFloat(calories) || 0,
      carbs: parseFloat(carbs) || 0,
      protein: parseFloat(protein) || 0,
      fats: parseFloat(fats) || 0,
    }]);
    setMeal({
      name: mealName,
      mealIngredients: totalMacros
    });
  }, [calories, carbs, protein, fats]);

  const createCustomMeal = async () => {
    setLoading(true);
    const user = await supabase.auth.getUser();
    if (!user) {
      console.error('No such user!');
      setLoading(false);
      return;
    };
    const uuid = user.data.user?.id;
    
    try {
      const {error: sendError} = await supabase.from('custom_meals').insert({'id': uuid, 'meal': customMeal, 'meal_name': mealName});
      if (!sendError) {
        Alert.alert('Success!', `Custom Food logged!`);
        setMealName('');
        setCalories('');
        setCarbs('');
        setProtein('');
        setFats('');
      } else {
        Alert.alert(`Error uploading custom meal: `, sendError.message);
      }
    } catch (error) {
      console.error('Error occurred logging custom food: ', error)
    } finally {
      setLoading(false);
    };
  };

  return (
    <KeyboardAvoidingView style={styles.keyboardcontainer}>
      <View style={styles.container}>
        <Text style={styles.heading}>Create Your Custom Food Item</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Food Name:</Text>
          <TextInput
            placeholder='Enter Name Here'
            value={mealName}
            onChangeText={setMealName}
            style={styles.input}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Calories:</Text>
          <TextInput
            placeholder='Enter Calories'
            keyboardType='numeric'
            value={calories}
            onChangeText={setCalories}
            style={styles.input}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Carbs:</Text>
          <TextInput
            placeholder='Enter Carbs'
            keyboardType='numeric'
            value={carbs}
            onChangeText={setCarbs}
            style={styles.input}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Protein:</Text>
          <TextInput
            placeholder='Enter Protein'
            keyboardType='numeric'
            value={protein}
            onChangeText={setProtein}
            style={styles.input}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Fats:</Text>
          <TextInput
            placeholder='Enter Fats'
            keyboardType='numeric'
            value={fats}
            onChangeText={setFats}
            style={styles.input}
          />
        </View>
        <TouchableOpacity onPress={createCustomMeal} style={styles.addmeal_button}>
          <Text style={{ color: 'white' }}>Add Meal</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.back()} style={styles.cancel_button}>
          <Text style={{ color: 'white' }}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardcontainer: {
    flex: 1,
    backgroundColor: '#f8f9fa'
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
    paddingTop: StatusBar.currentHeight
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  addmeal_button: {
    alignSelf: 'center',
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10,
  },
  cancel_button: {
    alignSelf: 'center',
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 27,
    borderRadius: 5,
    marginVertical: 10,
  }
});

export default CustomMeals;
