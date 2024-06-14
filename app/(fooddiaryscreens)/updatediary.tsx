import React, { useState } from 'react'
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Modal, TextInput } from 'react-native'
import { Feather } from '@expo/vector-icons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import All from './all';
import NUS from './nus';
import DietPlan from './dietplan';
import { router } from 'expo-router';

const calories = () => {

  const Tab = createMaterialTopTabNavigator();

  const [isVisible, setIsVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState('Breakfast');
  const options = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];
  const [search, setSearch] = useState("");

  const toggleDropdown = () => {
    setIsVisible(!isVisible);
  };

  const onSelectItem = (item: any) => {
    setSelectedValue(item);
    setIsVisible(false);
  };

  const returntohome = () => {
    router.push("/(loggedIn)/fooddiary")
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.header_navigate}>
        <TouchableOpacity style={styles.headerarrow} onPress={returntohome}>
          <Feather name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
        <View style={{ flex: 1, flexDirection: 'row', alignContent: 'center', justifyContent: 'center', paddingRight: 35 }}>
          <Text>Breakfast</Text>
        </View>
      </View>
      <View style={styles.searchbar}>
        <TextInput
          placeholder='Search'
          value={search}
          onChangeText={(value) => setSearch(value)}
        />
      </View>
      <Tab.Navigator screenOptions={{
        tabBarStyle: { backgroundColor: "#E4FBFF" }
      }}>
        <Tab.Screen name="All" component={All} />
        <Tab.Screen name="NUS" component={NUS} />
        <Tab.Screen name="Diet Plan" component={DietPlan} />
      </Tab.Navigator>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: "#E4FBFF"
  },
  header_navigate: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'black',
    paddingTop: StatusBar.currentHeight,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 5
  },
  headerarrow: {
    paddingRight: 10,
    paddingLeft: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  searchbar: {
    margin: 5,
    marginTop: 20,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 8
  },
  tabscreen: {
    flex: 1,
    backgroundColor: "#E4FBFF"
  }
})

export default calories;