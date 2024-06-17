import React, { useState } from 'react';
import { Text, View, StyleSheet, TextInput, Button, FlatList } from 'react-native';
import axios from 'axios';

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
      const response = await axios.post('http://fixie:LyLj5QglX9Ezjxa@velodrome.usefixie.com:80', {
        item: searchTerm,
      });

      setData(response.data.foods.food); // Adjust this depending on the structure of the response
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
