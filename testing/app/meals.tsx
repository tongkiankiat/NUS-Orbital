import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
} from "react-native";
import axios, { AxiosResponse } from "axios";
import { XMLParser } from "fast-xml-parser";

const clientID = "555862211cf4418197cbe3afef10a4f0";
const clientSecret = "8bc1bc3a25b84b49b5f6e9ec9d804ac4";

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

interface Recipe {
  recipe_id: string;
  recipe_name: string;
  recipe_ingredients: string[];
  recipe_description: string;
  calories: Int16Array;
  carbs: Int16Array;
  protein: Int16Array;
  fat: Int16Array;
}

// interface AllProps {
//   search: string;
//   foodData: Food[];
// }

const Meals = () => {
  const [search, setSearch] = useState<string | null>("");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [recipeData, setRecipeData] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [noResults, setNoResults] = useState<Boolean>(false);
  // const [selectedFood, setSelectedFood] = useState<Recipe | null>(null);
  // const [weight, setWeight] = useState<string>("100"); // Default weight set to 100g
  // const [servingSize, setServingSize] = useState<string>(""); // Serving size extracted from description

  // useEffect(() => {
  //   // Extract serving size when selectedFood changes
  //   if (selectedFood) {
  //     setServingSize(getServingSizeFromDescription(selectedFood.recipe_description));
  //   }
  // }, [selectedFood]);

  const handleSearch = (value: string) => {
    setSearch(value);
    if (value.trim().length == 0) {
      setSearch(null);
    }
  };

  const CustomRecipe = () => {
    console.log("custom menu")
  }

  const handleSelect = (item: Recipe) => {
    setModalVisible(true);
    setSelectedRecipe(item);
  };

  const LogMeal = () => {
    //send to database
  };

  const getToken = async (): Promise<void> => {
    setLoading(true);
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
        method: "recipes.search.v3",
        search_expression: search,
        max_results: 5,
      };

      const recipeResponse = await axios.post(url, null, { headers, params });
      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "",
        parseAttributeValue: true,
      });
      const xmlData = recipeResponse.data;
      const jsonObj = parser.parse(xmlData);
      const recipesData = jsonObj.recipes.recipe;
      const parsedRecipes = Array.isArray(recipesData)
        ? recipesData
        : [recipesData];

      const recipeItems: Recipe[] = parsedRecipes
        .map((recipe: any) => {
          if (
            !recipe.recipe_id ||
            !recipe.recipe_name ||
            !recipe.recipe_nutrition
          ) {
            console.error("Incomplete recipe data:", recipe);
            return null;
          }
          return {
            recipe_id: recipe.recipe_id,
            recipe_name: recipe.recipe_name,
            recipe_ingredients: recipe.recipe_ingredients || [],
            recipe_description: recipe.recipe_description || "",
            calories: recipe.recipe_nutrition.calories || 0,
            carbs: recipe.recipe_nutrition.carbohydrates || 0,
            protein: recipe.recipe_nutrition.protein || 0,
            fat: recipe.recipe_nutrition.fat || 0,
          };
        })
        .filter((recipe): recipe is Recipe => recipe !== null);
      setRecipeData(recipeItems);
      console.log(recipeData);
      setNoResults(false)
    } catch ({TypeError}) {
      setRecipeData([])
      setNoResults(true);
      console.error("type error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <View style={styles.searchbar}>
        <TextInput
          placeholder="Search"
          value={search}
          onChangeText={handleSearch}
          style={{ flex: 1 }}
        />
        <TouchableOpacity onPress={getToken} style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>
    {!loading && !noResults && (
      <View>
        <FlatList
          data={recipeData}
          keyExtractor={(item) => item.recipe_id.toString()} // Ensure the key is a string
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleSelect(item)}
              style={styles.item}
            >
              <Text>{item.recipe_name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    )}
    {
        (!loading && recipeData.length == 0 && noResults) && (
          <View>
            <Text>No results.</Text>
          </View>
        )
    }
    {
      loading && 
      <View>
        <Text>Loading...</Text>
      </View>
    }

        <View>
        <Text style = {styles.centeredText}>
          Can't find your meal?{"\n"}Create a {}
            <Text style = {styles.customText} onPress={CustomRecipe}>custom </Text>
          meal
        </Text>
        </View>
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onDismiss={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text>Close Modal</Text>
              </TouchableOpacity>
              {selectedRecipe && (
                <Text>
                  Recipe Name: {selectedRecipe.recipe_name}
                  {"\n"}
                  Calories: {selectedRecipe.calories}
                  {"\n"}
                  Carbs: {selectedRecipe.carbs}
                  {"\n"}
                  Fats: {selectedRecipe.fat}
                  {"\n"}
                  Protein: {selectedRecipe.protein}
                </Text>
              )}
              <TouchableOpacity style={styles.closeButton} onPress={LogMeal}>
                <Text>Log Meal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
  );
};

const styles = StyleSheet.create({
  customText: {
    textAlign: 'center', // Aligns text within the Text component
    fontSize: 16,
    color: '#0000FF',
    marginVertical: 20, // Adds space above and below the text
  },
  centeredText: {
    textAlign: 'center', // Aligns text within the Text component
    fontSize: 16,
    color: 'Black',
    marginVertical: 20, // Adds space above and below the text
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
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
  foodName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    flex: 1,
    fontWeight: "bold",
  },
  input: {
    flex: 2,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 8,
    marginRight: 10,
    textAlign: "right",
  },
  unit: {
    fontWeight: "bold",
  },
  buttonText: {
    color: "#000",
    fontWeight: "bold",
  },
  searchbar: {
    flexDirection: "row",
    margin: 5,
    marginTop: 20,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 8,
  },
  searchButton: {
    padding: 10,
    backgroundColor: "#007BFF",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  searchButtonText: {
    color: "#FFF",
  },
});

export default Meals;

{
  /* Modal for displaying nutritional info and adjusting servings */
}
{
  /* <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        {selectedFood && ( // Check if selectedFood is not null
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.foodName}>{selectedFood.food_name}</Text>
              <Text>Calories: {calculateNutritionalInfo()?.calories.toFixed(2)} kcal</Text>
              <Text>Fat: {calculateNutritionalInfo()?.fat.toFixed(2)} g</Text>
              <Text>Carbs: {calculateNutritionalInfo()?.carbs.toFixed(2)} g</Text>
              <Text>Protein: {calculateNutritionalInfo()?.protein.toFixed(2)} g</Text>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Weight</Text>
                <TextInput
                  style={styles.input}
                  placeholder={`Enter weight (${weight}g)`}
                  value={weight}
                  onChangeText={(text) => {
                    // Limit input to 4 characters
                    if (text.length <= 4) {
                      setWeight(text);
                    }
                  }}
                  keyboardType="numeric"
                  maxLength={4} // Limit to 4 characters
                />
                <Text>g</Text>
              </View>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  setModalVisible(false);
                }}
              >
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Modal> */
}
