import React, { useState } from 'react';
import { Text, View, StyleSheet, TextInput, Button, FlatList } from 'react-native';
import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';

const All = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!searchTerm) {
      alert('Please enter a search term');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // ***IMPT, USE LOCALHOST FOR DEVELOPMENT PURPOSES, NOT RENDER SERVER***

      // const response = await axios.post('https://nus-orbital.onrender.com/api/proxy', {
      //   item: searchTerm,
      // });
      const response = await axios.post('http://10.32.28.207:3000/api/proxy', {
        item: searchTerm,
      });
      console.log(response.data)
      // Define parser
      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "",
        parseAttributeValue: true,
      });

      // Parse XML to JSON using fast-xml-parser
      const jsonData = parser.parse(response.data);
      const foodsData = jsonData.foods.food;
      const parsedFoods = Array.isArray(foodsData) ? foodsData : [foodsData];
      console.log(parsedFoods);

      setData(parsedFoods);
    } catch (err) {
      console.error('Error fetching data:', err);
      alert('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter food item"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
      <Button title="Search" onPress={handleSearch} />

      {loading && <Text>Loading...</Text>}
      {error && <Text style={styles.error}>{error}</Text>}
      {data && (
        <FlatList
          data={data}
          keyExtractor={(item) => item.food_id.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text>{item.food_name}</Text>
              <Text>{item.food_description}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E4FBFF',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: '100%',
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  error: {
    color: 'red',
  },
});

export default All;
