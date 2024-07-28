import { View, Text, TouchableOpacity, TextInput, StyleSheet, FlatList, Modal, StatusBar, KeyboardAvoidingView, Alert } from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import axios, { all } from 'axios';
import { router, useLocalSearchParams } from 'expo-router';
import { supabase } from '../../../lib/supabase';

interface CustomMeal {
  name: string;
  mealIngredients: Ingredient[];
}

interface Ingredient {
  food_id: number;
  food_name: string;
  food_description: string;
  food_type: string;
  calories: number;
  fats: number;
  carbs: number;
  protein: number;
  weight: number;
  quantity: number;
  allergens: string[];
}

interface Macros {
  calories: number;
  carbs: number;
  protein: number;
  fats: number;
}

const CustomMeals = () => {
  const [mealName, setMealName] = useState<string>(''); //Hook for storing custom meal name
  const [ingredients, setIngredients] = useState<Ingredient[]>([]); //Hook for storing list of ingredients ADDED to custom meal
  const [searchResults, setSearchResults] = useState<Ingredient[]>([]); //Hook for storing search results for API search, is a list of foods returned
  const [selectedFood, setSelectedFood] = useState<Ingredient | null>(null); //Hook for storing selected food item when viewing details of specific food
  const [modalVisible, setModalVisible] = useState(false); //Hook for making modal visible when clicking plus icon for ingredients
  const [search, setSearch] = useState<string | null>(''); //Hook for storing search expression for API search
  const [loading, setLoading] = useState(false); //Hook for loading status
  const [noResults, setNoResults] = useState(false); //Hook for determining if results are found
  const [quantity, setQuantity] = useState(1); //Hook for storing quantity adjustments, may be removed
  const [totalMacros, setTotalMacros] = useState<Macros>({
    calories: 0,
    carbs: 0,
    fats: 0,
    protein: 0,
  });
  const [customMeal, setMeal] = useState<CustomMeal>();

  // Allergies array passed from Meals
  const allergies_params = useLocalSearchParams();
  const allergies = Object.values(allergies_params)[0]?.split(',');
  
  const closeModal = () => {
    setModalVisible(false);
    setSearchResults([]);
    setSelectedFood(null);
    setNoResults(false);
  };

  const handleMealName = (name: string) => {
    setMealName(name);
  };

  const createCustomMeal = async () => {
    // send custom meal to DB
    setLoading(true);
    const user = await supabase.auth.getUser();
    if (!user) {
      console.error('No such user!');
    };
    const uuid = user.data.user?.id;
    setMeal({
      name: mealName,
      mealIngredients: ingredients,
    });
    console.log(customMeal);
    //logic for sending meal over to db
    try {
      if (!customMeal) {
        console.error('customMeal is null or undefined:', customMeal);
        setLoading(false);
        return;
      }
      const { error: sendError } = await supabase.from('custom_meals').insert({'id': uuid, 'meal': customMeal, 'meal_name': mealName});
      if (!sendError) {
        Alert.alert('Success!', `Custom Meal logged!`);
        setMealName('');
        setIngredients([]);
        setTotalMacros({
          calories: 0,
          carbs: 0,
          protein: 0,
          fats: 0
        });
      } else {
        Alert.alert(`Error uploading custom meal: `, sendError.message);
      }
    } catch (error) {
      console.error('Error occured: ', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddIngredient = (mealName: string, item: Ingredient) => {
    selectedFood && setIngredients(ingredients.concat([selectedFood]));
    ingredients.map((ingredient, index) => {
      if (selectedFood && selectedFood.food_id == ingredient.food_id) {
        console.log('duplicate item detected');
        let new_ingredients = Array.from(ingredients);
        new_ingredients[index] = {
          ...ingredients[index],
          quantity: selectedFood.quantity + ingredient.quantity,
        };
        setIngredients(new_ingredients);
      }
    });
    setTotalMacros({
      calories: ingredients.reduce(
        (acc, obj) => acc + obj.calories * obj.quantity,
        0
      ),
      carbs: ingredients.reduce(
        (acc, obj) => acc + obj.carbs * obj.quantity,
        0
      ),
      protein: ingredients.reduce(
        (acc, obj) => acc + obj.protein * obj.quantity,
        0
      ),
      fats: ingredients.reduce((acc, obj) => acc + obj.fats * obj.quantity, 0),
    });
    const update_meal = {
      name: mealName,
      mealIngredients: ingredients
    }
    // console.log(totalMacros);
    console.log('added');
    setModalVisible(false);
    setSearchResults([]);
    setSelectedFood(null);
    setNoResults(false);
    setMeal(update_meal);
  };

  const handleQuantity = (quantity: number) => {
    if (selectedFood) {
      setSelectedFood({ ...selectedFood, quantity });
    }
  };

  const handleRemoveIngredient = (item: Ingredient) => {
    const isSelected = (element: Ingredient) => {
      return element.food_name == item.food_name;
    };
    const selectedIndex = ingredients.findIndex(isSelected);
    let new_ingredients = Array.from(ingredients);
    new_ingredients.splice(selectedIndex, 1);
    setIngredients(new_ingredients);
  };

  const handleSelect = (item: Ingredient) => {
    setSelectedFood(item);
    console.log('Selected item:', item);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    if (value.trim().length == 0) {
      setSearch(null);
    }
  };

  const searchRecipe = async () => {
    setLoading(true);
    try {
      // ***IMPT, USE LOCALHOST FOR DEVELOPMENT PURPOSES, NOT RENDER SERVER***

      // const response = await axios.post('https://nus-orbital.onrender.com/api/proxy', {
      //   item: searchTerm,
      // });
      const ingredientResponse = await axios.post('http://192.168.1.142:3000/api/proxy', { item: search });
      const jsonData = ingredientResponse.data;
      const ingredientsData = jsonData.foods_search.results.food;
      const parsedingredients = Array.isArray(ingredientsData) ? ingredientsData : [ingredientsData];

      const ingredientItems: Ingredient[] = parsedingredients.map((ingredient: any) => {
        console.log(ingredient)
        const servings = Array.isArray(ingredient.servings) ? ingredient.servings.serving : [ingredient.servings.serving];
        const mainServing = servings[0][0];

        const calories = parseFloat(mainServing.calories);
        const fats = parseFloat(mainServing.fat);
        const carbs = parseFloat(mainServing.carbohydrate);
        const protein = parseFloat(mainServing.protein);

        // Get the allergies of the ingredientItems
        const allergens = ingredient.food_attributes?.allergens?.allergen ? ingredient.food_attributes.allergens.allergen.filter((allergen: any) => allergen.value === 1).map((allergen: any) => allergen.name) : [];

        return {
          quantity: 1,
          food_id: ingredient.food_id,
          food_name: ingredient.food_name,
          food_description: mainServing.serving_description,
          food_type: ingredient.food_type,
          weight: parseFloat(mainServing.metric_serving_amount),
          calories,
          fats,
          carbs,
          protein,
          allergens
        };
      });

      // Filter out branded items from API search results, as they contain no allergy arrays
      const filterBranded = ingredientItems.filter((item) => {
        return !(item.food_type === "Brand")
      })

      // Filter out the items that the user is allergic to
      const filteredIngredients = filterBranded.filter((item) => {
        console.log(allergies)
        const allergenInName = allergies?.some(allergen => item.food_name.toLowerCase().includes(allergen.toLowerCase()));
        return !item.allergens.some(allergen => allergies?.includes(allergen)) && !allergenInName;
      });

      setSearchResults(filteredIngredients);
      setNoResults(filteredIngredients.length === 0);
    } catch (TypeError) {
      console.log('Error occured: ', TypeError);
      setNoResults(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.keyboardcontainer}>
      <View style={styles.container}>
        <Text style={styles.heading}>Create Your Custom Meal</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Meal Name:</Text>
          <TextInput
            placeholder='Enter Name Here'
            onChangeText={handleMealName}
            style={styles.input}
          />
        </View>
        <Text style={styles.label}>Ingredients:</Text>
        <View style={styles.macrosContainer}>
          {ingredients.length == 0 && (
            <Text style={styles.macro}>No Ingredients Added.</Text>
          )}
          <FlatList
            data={ingredients}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Text style={{ fontSize: 16, flex: 1 }}>
                  {item.food_name}
                </Text>
                <Text style={{flex: 1}}>Quantity: {item.quantity}</Text>
                <TouchableOpacity onPress={() => handleRemoveIngredient(item)} style={styles.removeButton}>
                  <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            )}
            style={{ marginBottom: 20 }}
          />
        </View>

        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Icon name='add-circle' size={50} color='#28a745' />
        </TouchableOpacity>

        <Text style={styles.label}>Macros:</Text>
        <View style={styles.macrosContainer}>
          <Text style={styles.macro}>
            Calories:{' '}
            <Text style={styles.macroValue}>
              {ingredients.reduce((acc, obj) => acc + obj.calories * obj.quantity, 0)}
            </Text>
          </Text>
          <Text style={styles.macro}>
            Carbs:{' '}
            <Text style={styles.macroValue}>
              {ingredients.reduce((acc, obj) => acc + obj.carbs * obj.quantity, 0)}
            </Text>
          </Text>
          <Text style={styles.macro}>
            Protein:{' '}
            <Text style={styles.macroValue}>
              {ingredients.reduce((acc, obj) => acc + obj.protein * obj.quantity, 0)}
            </Text>
          </Text>
          <Text style={styles.macro}>
            Fats:{' '}
            <Text style={styles.macroValue}>
              {ingredients.reduce((acc, obj) => acc + obj.fats * obj.quantity, 0)}
            </Text>
          </Text>
        </View>
        <TouchableOpacity onPress={() => createCustomMeal()} style={styles.addmeal_button}>
          <Text style={{ color: 'white' }}>Add Meal</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.back()} style={styles.cancel_button}>
          <Text style={{ color: 'white' }}>Cancel</Text>
        </TouchableOpacity>

        <Modal
          visible={modalVisible}
          animationType='slide'
          transparent={true}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Icon name='close-circle' size={24} color='#007BFF' />
              </TouchableOpacity>
              <TextInput
                style={styles.modalInput}
                placeholder='Search for ingredients...'
                placeholderTextColor='#888'
                onChangeText={handleSearch}
              />
              <TouchableOpacity style={styles.searchButton} onPress={searchRecipe}>
                <Text style={styles.searchButtonText}>Search</Text>
              </TouchableOpacity>
              {loading && <Text>Loading...</Text>}
              {(noResults && !loading) && <Text>No results found.</Text>}
              {(!selectedFood && !loading) && (
                <View style={{ maxHeight: 300 }}>
                  <FlatList
                    data={searchResults}
                    keyExtractor={(item) => item.food_id.toString()}
                    renderItem={({ item }) => (
                      <View style={styles.modalItem}>
                        <Text style={{ fontSize: 16, flex: 1 }}>{item.food_name}</Text>
                        <TouchableOpacity onPress={() => handleSelect(item)}>
                          <Icon
                            name='add-circle-outline'
                            size={24}
                            color='#007BFF'
                          />
                        </TouchableOpacity>
                      </View>
                    )}
                  />
                </View>
              )}
              {selectedFood && (
                <View>
                  <Text style={styles.selectedFoodText}>
                    <Text style={styles.macro}>Ingredient Name: </Text>
                    {selectedFood.food_name}
                    {'\n'}
                    <Text style={styles.macro}>Weight: </Text>
                    {selectedFood.weight === 0
                      ? 'nill'
                      : selectedFood.weight * selectedFood.quantity}
                    {'g\n'}
                    <Text style={styles.macro}>Calories: </Text>
                    {selectedFood.calories * selectedFood.quantity}
                    {'kcal\n'}
                    <Text style={styles.macro}>Carbs: </Text>
                    {selectedFood.carbs * selectedFood.quantity}
                    {'g\n'}
                    <Text style={styles.macro}>Fats: </Text>
                    {selectedFood.fats * selectedFood.quantity}
                    {'g\n'}
                    <Text style={styles.macro}>Protein: </Text>
                    {selectedFood.protein * selectedFood.quantity}
                    {'g\n'}
                  </Text>
                  <View style={styles.quantityContainer}>
                    <Text style={styles.label}>Quantity: </Text>
                    <TextInput
                      style={styles.modalInput}
                      inputMode='numeric'
                      onChangeText={(text) =>
                        setSelectedFood({
                          ...selectedFood,
                          quantity: Number(text),
                        })
                      }
                    />
                  </View>
                  <TouchableOpacity onPress={() => handleAddIngredient(mealName, selectedFood)} style={styles.confirmButton}>
                    <Text style={styles.confirmButtonText}>Add</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </Modal>
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginLeft: 10,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#fff',
    marginVertical: 5,
    borderRadius: 5,
  },
  macrosContainer: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 20,
    maxHeight: 300
  },
  macro: {
    fontSize: 16,
    marginVertical: 5,
  },
  macroValue: {
    fontWeight: 'bold',
    color: '#007BFF',
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
    elevation: 5
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20
  },
  searchButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#fff',
    marginVertical: 5,
    borderRadius: 5,
  },
  addButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  confirmButton: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  removeButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  selectedFoodText: {
    fontSize: 16,
    marginBottom: 10,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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