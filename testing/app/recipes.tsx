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
import { FadingTransition } from "react-native-reanimated";

interface Meal {
  name: string;
  ingredients: Food[];
  calories: string;
  fat: string;
  carbs: string;
  protein: string;
}

interface Food {
  food_id: string;
  food_name: string;
  food_description: string;
  calories: string;
  fat: string;
  carbs: string;
  protein: string;
}

interface AllProps {
  search: string;
  foodData: Food[];
}

const Recipes: React.FC<AllProps> = ({ search, foodData }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [weight, setWeight] = useState<string>("100"); // Default weight set to 100g
  const [servingSize, setServingSize] = useState<string>(""); // Serving size extracted from description

  useEffect(() => {
    // Extract serving size when selectedFood changes
    if (selectedFood) {
      setServingSize(
        getServingSizeFromDescription(selectedFood.food_description)
      );
    }
  }, [selectedFood]);

  // Function to handle item press in the list
  const handleItemPress = (item: Food) => {
    setSelectedFood(item);
    setModalVisible(true);
    setWeight("100"); // Reset weight to default when a new item is selected
  };

  // Function to extract serving size from food description
  const getServingSizeFromDescription = (description: string): string => {
    // Example pattern to extract serving size, adjust as per your food description format
    const match = description.match(/Per (\d+g)/i);
    return match ? match[1] : "100g"; // Default to 100g if no match found
  };

  // Function to calculate nutritional info based on serving size and weight
  const calculateNutritionalInfo = () => {
    if (!selectedFood || !servingSize) return null;

    const servingSizeValue = parseFloat(servingSize.replace(/[^\d.]/g, "")); // Extract numeric value from serving size

    const weightValue = parseFloat(weight); // Convert weight to number

    // Calculate factor based on serving size and weight
    const factor = weightValue / servingSizeValue;

    return {
      calories: parseFloat(selectedFood.calories) * factor,
      fat: parseFloat(selectedFood.fat) * factor,
      carbs: parseFloat(selectedFood.carbs) * factor,
      protein: parseFloat(selectedFood.protein) * factor,
    };
  };

  return (
    <View style={styles.searchbar}>
      <TextInput
        placeholder="Search"
        value={search}
        onChangeText={handleSearch}
        style={{ flex: 1 }}
      />
      <FlatList
        data={foodData}
        keyExtractor={(item) => item.food_id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleItemPress(item)}
            style={styles.item}
          >
            <Text>{item.food_name}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Modal for displaying nutritional info and adjusting servings */}
      <Modal
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
              <Text>
                Calories: {calculateNutritionalInfo()?.calories.toFixed(2)} kcal
              </Text>
              <Text>Fat: {calculateNutritionalInfo()?.fat.toFixed(2)} g</Text>
              <Text>
                Carbs: {calculateNutritionalInfo()?.carbs.toFixed(2)} g
              </Text>
              <Text>
                Protein: {calculateNutritionalInfo()?.protein.toFixed(2)} g
              </Text>

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
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
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
  closeButton: {
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
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
});

export default Recipes;
