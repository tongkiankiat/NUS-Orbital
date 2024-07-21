import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Modal, TouchableOpacity, TextInput, Alert } from 'react-native';
import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import { router, useGlobalSearchParams } from 'expo-router';
import { supabase } from '../../../lib/supabase';
import Icon from 'react-native-vector-icons/Ionicons';
import { DateTime } from 'luxon';

interface Ingredient {
  food_id: string;
  food_name: string;
  food_description: string;
  calories: number;
  fats: number;
  carbs: number;
  protein: number;
  weight: number;
  quantity: number;
  allergens: string[]
}

const Meals = () => {
  // Set useState variables
  const [search, setSearch] = useState<string | null>('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [recipeData, setRecipeData] = useState<Ingredient[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Ingredient | null>(null);
  const [noResults, setNoResults] = useState<Boolean>(false);
  const [allergies, setAllergies] = useState<string[]>([]);

  // Retrieve meal time from fooddiary page
  const { meal_time } = useGlobalSearchParams();

  const getAllergies = async () => {
    const user = await supabase.auth.getUser();
    if (!user) {
      console.error('No such user!')
    };
    const uuid = user.data.user?.id;
    try {
      const { data, error: getError } = await supabase.from('users').select('allergies').eq('id', uuid).single();
      if (getError) {
        console.log('Error occured while fetching allergies: ', getError.message);
        setAllergies([]);
      } else if (data) {
        let cleanedAllergies = data?.allergies || '';
        cleanedAllergies = cleanedAllergies.replace(/[\[\]']+/g, ''); // Remove square brackets and quotes
        const userAllergies = cleanedAllergies.replace(/"/g, '').split(',');
        setAllergies(userAllergies);
      }
    } catch (error) {
      console.error('Error occured: ', error);
      setAllergies([]);
    };
  };

  useEffect(() => {
    getAllergies();
  }, []);

  const handleSearch = (value: string) => {
    setSearch(value);
    if (value.trim().length == 0) {
      setSearch(null);
    }
  };

  const CustomRecipe = () => {
    router.push({
      pathname: 'custommeals', params: {
        allergies: allergies
      }
    });
  };

  const handleSelect = (item: Ingredient) => {
    setModalVisible(true);
    setSelectedRecipe(item);
    console.log(item)
  };

  const LogMeal = async () => {
    setLoading(true);
    //send to database
    const user = await supabase.auth.getUser();
    if (!user) {
      console.error('No such user!');
    }
    const uuid = user.data.user?.id;
    try {
      const { error: sendError } = await supabase.from('meals').insert({ 'id': uuid, meal: selectedRecipe, meal_time: meal_time, date: DateTime.now().setZone('Asia/Singapore').toISODate()});
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

  const searchFood = async () => {
    setLoading(true);
    try {
      // ***IMPT, USE LOCALHOST FOR DEVELOPMENT PURPOSES, NOT RENDER SERVER***

      // const response = await axios.post('https://nus-orbital.onrender.com/api/proxy', {
      //   item: searchTerm,
      // });
      const ingredientResponse = await axios.post('http://192.168.1.141:3000/api/proxy', { item: search }); {/* For the IP address here, use your network's IP, use 'ipconfig' in powershell/terminal to check. Afterwards, whitelist your public IP address (https://www.whatismyip.com/) in FatSecretAPI website*/ }
      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '',
        parseAttributeValue: true,
      });
      const xmlData = ingredientResponse.data;
      const jsonObj = parser.parse(xmlData);
      const ingredientsData = jsonObj.foods_search.results.food;
      const parsedingredients = Array.isArray(ingredientsData) ? ingredientsData : [ingredientsData];

      const ingredientItems: Ingredient[] = parsedingredients.map((ingredient: any) => {
        const servings = Array.isArray(ingredient.servings.serving) ? ingredient.servings.serving : [ingredient.servings.serving];
        const mainServing = servings[0];

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
          weight: parseFloat(mainServing.metric_serving_amount),
          calories,
          fats,
          carbs,
          protein,
          allergens
        };
      });

      // Filter out the items that the user is allergic to
      const filteredIngredients = ingredientItems.filter((item) => {
        const allergenInName = allergies.some(allergen => item.food_name.toLowerCase().includes(allergen.toLowerCase()));
        return !item.allergens.some(allergen => allergies.includes(allergen)) && !allergenInName;
      });

      setRecipeData(filteredIngredients);
      setNoResults(filteredIngredients.length === 0);
    } catch (error) {
      setRecipeData([])
      setNoResults(true);
      console.error('Error occured: ', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchbar}>
        <TextInput
          placeholder='Search'
          value={search}
          onChangeText={handleSearch}
          style={{ flex: 1 }}
        />
        <TouchableOpacity onPress={searchFood} style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity onPress={() => router.push({pathname: 'add_custommeal', params: {
          meal_time: meal_time
        }})}>
          <Text style={{textAlign: 'center', color: 'blue', fontSize: 16}}>Add your custom meal!</Text>
        </TouchableOpacity>
      </View>
      {!loading && !noResults && (
        <View style={{ flex: 1 }}>
          <FlatList
            data={recipeData}
            keyExtractor={(item) => item.food_id.toString()} // Ensure the key is a string
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleSelect(item)} style={styles.item}>
                <Text>{item.food_name}</Text>
              </TouchableOpacity>
            )}
            style={styles.flatlist}
          />
        </View>
      )}
      {(!loading && recipeData.length == 0 && noResults) && (
        <View>
          <Text style={{ textAlign: 'center' }}>No results</Text>
        </View>
      )}
      {
        loading &&
        <View>
          <Text style={{ textAlign: 'center' }}>Loading...</Text>
        </View>
      }
      <View>
        <Text style={styles.centeredText}>
          Can't find your meal?{'\n'}{ }
          <Text style={styles.customText} onPress={CustomRecipe}>Create a custom meal </Text>
        </Text>
      </View>
      <Modal
        visible={modalVisible}
        animationType='slide'
        transparent={true}
        onDismiss={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
              <TouchableOpacity style={styles.log_button} onPress={LogMeal}>
                <Text style={{ textAlign: 'center', fontSize: 14 }}>Log Meal</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name='close-circle' size={24} color='#007BFF' />
              </TouchableOpacity>
            </View>
            {selectedRecipe && (
              <View>
                <Text style={{ fontWeight: 'bold' }}>
                  Recipe Name: {selectedRecipe.food_name}
                </Text>
                <Text>
                  Calories: {selectedRecipe.calories}
                  {'kcal\n'}
                  Carbs: {selectedRecipe.carbs}
                  {'g\n'}
                  Fats: {selectedRecipe.fats}
                  {'g\n'}
                  Protein: {selectedRecipe.protein}
                  {'g'}
                </Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E4FBFF'
  },
  customText: {
    textAlign: 'center', // Aligns text within the Text component
    fontSize: 16,
    color: '#0000FF',
    marginVertical: 20, // Adds space above and below the text
  },
  centeredText: {
    textAlign: 'center', // Aligns text within the Text component
    fontSize: 16,
    color: 'black',
    marginVertical: 20, // Adds space above and below the text
  },
  log_button: {
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: '#00F627',
    margin: 5,
    paddingHorizontal: 5
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    overflow: 'hidden'
  },
  flatlist: {
    backgroundColor: 'E4FBFF',
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
  },
  searchbar: {
    flexDirection: 'row',
    margin: 5,
    marginTop: 20,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 8,
  },
  searchButton: {
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#FFF',
  },
});

export default Meals;
