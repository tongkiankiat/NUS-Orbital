import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import {createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useNavigationState } from '@react-navigation/native';
import axios, { AxiosResponse } from "axios";
import { XMLParser } from "fast-xml-parser";
import Meals from "./meals";
import NUS from "./nus";
import Recipes from "./recipes";

const clientID = "555862211cf4418197cbe3afef10a4f0";
const clientSecret = "8bc1bc3a25b84b49b5f6e9ec9d804ac4";

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
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

const Tab = createMaterialTopTabNavigator();

const Calories = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState("Breakfast");
  const options = ["Breakfast", "Lunch", "Dinner", "Snacks"];
  const [search, setSearch] = useState("");
  const [foodData, setFoodData] = useState<Food[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleDropdown = () => {
    setIsVisible(!isVisible);
  };

  const onSelectItem = (item: string) => {
    setSelectedValue(item);
    setIsVisible(false);
  };

  // const handleSearch = (value: string) => {
  //   setSearch(value);
  // };

  // const getToken = async (): Promise<void> => {
  //   setLoading(true);
  //   const options = {
  //     method: "POST",
  //     url: "https://oauth.fatsecret.com/connect/token",
  //     auth: {
  //       username: clientID,
  //       password: clientSecret,
  //     },
  //     headers: {
  //       "Content-Type": "application/x-www-form-urlencoded",
  //     },
  //     data: new URLSearchParams({
  //       grant_type: "client_credentials",
  //       scope: "basic",
  //     }),
  //   };

  //   try {
  //     const response: AxiosResponse<TokenResponse> = await axios(options);
  //     const accessToken = response.data.access_token;

  //     const headers = {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${accessToken}`,
  //     };

  //     const url = "https://platform.fatsecret.com/rest/server.api";
  //     const params = {
  //       method: "foods.search",
  //       search_expression: search,
  //       max_results: 5,
  //     };

  //     const foodResponse = await axios.post(url, null, { headers, params });
  //     const xmlData = foodResponse.data;

  //     const parser = new XMLParser({
  //       ignoreAttributes: false,
  //       attributeNamePrefix: "",
  //       parseAttributeValue: true,
  //     });
  //     const jsonObj = parser.parse(xmlData);
  //     const foodsData = jsonObj.foods.food;
  //     const parsedFoods = Array.isArray(foodsData) ? foodsData : [foodsData];

  //     const foodItems: Food[] = parsedFoods.map((food: any) => {
  //       const description = food.food_description;
  //       const [calories, fat, carbs, protein] = description
  //         .match(/(\d+\.\d+g|\d+kcal)/g)
  //         .map((item: string) => item);

  //       return {
  //         food_id: food.food_id,
  //         food_name: food.food_name,
  //         food_description: food.food_description,
  //         calories,
  //         fat,
  //         carbs,
  //         protein,
  //       };
  //     });

  //     setFoodData(foodItems);
  //   } catch (error) {
  //     console.error("Error fetching token or food data:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const returnToHome = () => {
    // Implement navigation logic to return to home screen
  };

  return (
    <View style={styles.container}>
      <View style={styles.header_navigate}>
        <TouchableOpacity style={styles.headerarrow} onPress={returnToHome}>
          <Feather name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Text>{selectedValue}</Text>
        </View>
      </View>
      {/* <View style={styles.searchbar}>
        <TextInput
          placeholder="Search"
          value={search}
          onChangeText={handleSearch}
          style={{ flex: 1 }}
        />
        <TouchableOpacity onPress={getToken} style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity> */}
      {/* </View> */}
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: { backgroundColor: "#E4FBFF" },
        }}
      >
        <Tab.Screen name="Meals" component={Meals}/>
          {/* {(props) => <Meals {...props}  search={search} foodData={foodData} />} */}
        <Tab.Screen name="NUS">
          {(props) => <NUS {...props} search={search} foodData={foodData} />}
        </Tab.Screen>
        {/* <Tab.Screen name = "Recipes">
          {(props) => <Recipes {...props} search={search} foodData={foodData} />}
        </Tab.Screen> */}
      </Tab.Navigator>
      {loading && <Text>Loading...</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#E4FBFF",
  },
  header_navigate: {
    flexDirection: "row",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "black",
    paddingTop: StatusBar.currentHeight || 0,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 5,
  },
  headerarrow: {
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingRight: 35,
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

export default Calories;
