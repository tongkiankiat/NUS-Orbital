import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  FlatList,
  Modal,
} from "react-native";
import React, { useState } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import axios, { AxiosResponse } from "axios";
import { XMLParser } from "fast-xml-parser";
import { StackedBarChart } from "react-native-chart-kit";

interface CustomMeal {
  name: string;
  mealIngredients: Ingredient[];
}

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
}

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

interface Macros {
  calories: number;
  carbs: number;
  protein: number;
  fats: number;
}

//Details for logging into Fatsecret API
const clientID = "555862211cf4418197cbe3afef10a4f0";
const clientSecret = "8bc1bc3a25b84b49b5f6e9ec9d804ac4";
const targetMacros: Macros = {
  calories: 2200,
  carbs: 200,
  protein: 300,
  fats: 600,
};

const data = {
  labels: ["Test1", "Test2"],
  legend: ["L1", "L2", "L3"],
  data: [
    [60, 60, 60],
    [30, 30, 60],
  ],
  barColors: ["#dfe4ea", "#ced6e0", "#a4b0be"],
};

//Actual Component for Custom Meals Page
const CustomMeals = () => {
  const [mealName, setMealName] = useState<string>(""); //Hook for storing custom meal name
  const [ingredients, setIngredients] = useState<Ingredient[]>([]); //Hook for storing list of ingredients ADDED to custom meal
  const [searchResults, setSearchResults] = useState<Ingredient[]>([]); //Hook for storing search results for API search, is a list of foods returned
  const [selectedFood, setSelectedFood] = useState<Ingredient | null>(null); //Hook for storing selected food item when viewing details of specific food
  const [modalVisible, setModalVisible] = useState(false); //Hook for making modal visible when clicking plus icon for ingredients
  const [search, setSearch] = useState<string | null>(""); //Hook for storing search expression for API search
  const [loading, setLoading] = useState<Boolean>(false); //Hook for loading status
  const [noResults, setNoResults] = useState<Boolean>(false); //Hook for determining if results are found
  const [quantity, setQuantity] = useState(1); //Hook for storing quantity adjustments, may be removed
  const [totalMacros, setTotalMacros] = useState<Macros>({
    calories: 0,
    carbs: 0,
    fats: 0,
    protein: 0,
  });
  const [meal, setMeal] = useState<CustomMeal>();

  const closeModal = () => {
    setModalVisible(false);
    setSearchResults([]);
    setSelectedFood(null);
    setNoResults(false);
  };

  const handleMealName = (name: string) => {
    setMealName(name);
  };

  const createCustomMeal = () => {
    setMeal({
      name: mealName,
      mealIngredients: ingredients,
    });
    console.log(meal);
    //logic for sending meal over to db
  };
  const handleAddIngredient = (item: Ingredient) => {
    selectedFood && setIngredients(ingredients.concat([selectedFood]));
    ingredients.map((ingredient, index) => {
      if (selectedFood && selectedFood.food_id == ingredient.food_id) {
        console.log("duplicate item detected");
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
    // console.log(totalMacros);
    console.log("added");
    setModalVisible(false);
    setSearchResults([]);
    setSelectedFood(null);
    setNoResults(false);
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
    console.log("Selected item:", item);
  };

  const handleModalVisibility = () => {
    setModalVisible(true);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    if (value.trim().length == 0) {
      setSearch(null);
    }
  };

  const getIngredientData = async (): Promise<void> => {
    setLoading(true);
    setSelectedFood(null);
    setSearchResults([]);
    const options = {
      method: "POST",
      url: "https://oauth.fatsecret.com/connect/token",
      auth: {
        username: clientID,
        password: clientSecret,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: new URLSearchParams({
        grant_type: "client_credentials",
        scope: "basic",
      }),
    };

    try {
      const response: AxiosResponse<TokenResponse> = await axios(options);
      const accessToken = response.data.access_token;

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      };

      const url = "https://platform.fatsecret.com/rest/server.api";
      const params = {
        method: "foods.search",
        search_expression: search,
        max_results: 5,
      };

      const ingredientResponse = await axios.post(url, null, {
        headers,
        params,
      });
      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "",
        parseAttributeValue: true,
      });
      const xmlData = ingredientResponse.data;
      const jsonObj = parser.parse(xmlData);

      const ingredientsData = jsonObj.foods.food;
      const parsedingredients = Array.isArray(ingredientsData)
        ? ingredientsData
        : [ingredientsData];

      const ingredientItems: Ingredient[] = parsedingredients.map(
        (ingredient: any) => {
          const description = ingredient.food_description;
          const weightMatch = description.match(/Per (\d+)g/);
          const matches = description.match(/(\d+\.\d+g|\d+kcal)/g);

          let calories = 0;
          let fats = 0;
          let carbs = 0;
          let protein = 0;

          if (matches) {
            calories = parseFloat(matches[0].replace("kcal", ""));
            fats = parseFloat(matches[1].replace("g", ""));
            carbs = parseFloat(matches[2].replace("g", ""));
            protein = parseFloat(matches[3].replace("g", ""));
          }

          return {
            quantity: 1,
            food_id: ingredient.food_id,
            food_name: ingredient.food_name,
            food_description: ingredient.food_description,
            weight: weightMatch ? parseFloat(weightMatch[1]) : 0,
            calories,
            fats,
            carbs,
            protein,
          };
        }
      );

      setSearchResults(ingredientItems);
      setNoResults(false);
    } catch (TypeError) {
      console.log("type error");
      setNoResults(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Create Your Custom Meal</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Meal Name:</Text>
        <TextInput
          placeholder="Enter Name Here"
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
              <Text style={styles.foodName}>
                {item.food_name} {"\t\t"} Quantity: {item.quantity}
              </Text>
              <TouchableOpacity
                onPress={() => handleRemoveIngredient(item)}
                style={styles.removeButton}
              >
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          )}
          style={styles.list}
        />
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={handleModalVisibility}
      >
        <Icon name="add-circle" size={50} color="#28a745" />
      </TouchableOpacity>

      <Text style={styles.label}>Macros:</Text>
      <View style={styles.macrosContainer}>
        <Text style={styles.macro}>
          Calories:{" "}
          <Text style={styles.macroValue}>
            {ingredients.reduce(
              (acc, obj) => acc + obj.calories * obj.quantity,
              0
            )}
          </Text>
        </Text>
        <Text style={styles.macro}>
          Carbs:{" "}
          <Text style={styles.macroValue}>
            {ingredients.reduce(
              (acc, obj) => acc + obj.carbs * obj.quantity,
              0
            )}
          </Text>
        </Text>
        <Text style={styles.macro}>
          Protein:{" "}
          <Text style={styles.macroValue}>
            {ingredients.reduce(
              (acc, obj) => acc + obj.protein * obj.quantity,
              0
            )}
          </Text>
        </Text>
        <Text style={styles.macro}>
          Fats:{" "}
          <Text style={styles.macroValue}>
            {ingredients.reduce((acc, obj) => acc + obj.fats * obj.quantity, 0)}
          </Text>
        </Text>
      </View>
      <TouchableOpacity onPress={createCustomMeal}>
        <Text>Add Meal</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Icon name="close-circle" size={24} color="#007BFF" />
            </TouchableOpacity>
            <TextInput
              style={styles.modalInput}
              placeholder="Search for ingredients..."
              placeholderTextColor="#888"
              onChangeText={handleSearch}
            />
            <TouchableOpacity
              style={styles.searchButton}
              onPress={getIngredientData}
            >
              <Text style={styles.searchButtonText}>Search</Text>
            </TouchableOpacity>
            {loading && <Text>Loading...</Text>}
            {noResults && <Text>No results found.</Text>}
            {!selectedFood && (
              <FlatList
                data={searchResults}
                renderItem={({ item }) => (
                  <View style={styles.modalItem}>
                    <Text style={styles.foodName}>{item.food_name}</Text>
                    <TouchableOpacity onPress={() => handleSelect(item)}>
                      <Icon
                        name="add-circle-outline"
                        size={24}
                        color="#007BFF"
                      />
                    </TouchableOpacity>
                  </View>
                )}
                style={styles.modalList}
              />
            )}
            {selectedFood && (
              <View>
                <Text style={styles.selectedFoodText}>
                  <Text style={styles.macro}>Ingredient Name: </Text>
                  {selectedFood.food_name}
                  {"\n"}
                  <Text style={styles.macro}>Weight: </Text>
                  {selectedFood.weight === 0
                    ? "nill"
                    : selectedFood.weight * selectedFood.quantity}
                  {"g\n"}
                  <Text style={styles.macro}>Calories: </Text>
                  {selectedFood.calories * selectedFood.quantity}
                  {"kcal\n"}
                  <Text style={styles.macro}>Carbs: </Text>
                  {selectedFood.carbs * selectedFood.quantity}
                  {"g\n"}
                  <Text style={styles.macro}>Fats: </Text>
                  {selectedFood.fats * selectedFood.quantity}
                  {"g\n"}
                  <Text style={styles.macro}>Protein: </Text>
                  {selectedFood.protein * selectedFood.quantity}
                  {"g\n"}
                </Text>
                <View style={styles.quantityContainer}>
                  <Text style={styles.label}>Quantity: </Text>
                  <TextInput
                    style={styles.modalInput}
                    inputMode="numeric"
                    onChangeText={(text) =>
                      setSelectedFood({
                        ...selectedFood,
                        quantity: Number(text),
                      })
                    }
                  />
                </View>
                <TouchableOpacity
                  onPress={handleAddIngredient}
                  style={styles.confirmButton}
                >
                  <Text style={styles.confirmButtonText}>Confirm Add</Text>
                </TouchableOpacity>
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
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginLeft: 10,
  },
  list: {
    marginBottom: 20,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "#fff",
    marginVertical: 5,
    borderRadius: 5,
  },
  foodName: {
    fontSize: 16,
  },
  macrosContainer: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 20,
  },
  macro: {
    fontSize: 16,
    marginVertical: 5,
  },
  macroValue: {
    fontWeight: "bold",
    color: "#007BFF",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    elevation: 5,
  },
  closeButton: {
    alignSelf: "flex-end",
    marginBottom: 10,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  searchButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalList: {
    marginTop: 10,
  },
  modalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "#fff",
    marginVertical: 5,
    borderRadius: 5,
  },
  addButton: {
    alignItems: "center",
    marginBottom: 20,
  },
  confirmButton: {
    backgroundColor: "#28a745",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  removeButton: {
    backgroundColor: "#dc3545",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  removeButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  selectedFoodText: {
    fontSize: 16,
    marginBottom: 10,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
});

export default CustomMeals;
