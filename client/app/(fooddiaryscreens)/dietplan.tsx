import React from 'react'
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'

// TODO: Under the 'Diet Plan' tab, if user does not have a selected diet plan, add a text saying: 'No diet plan has been selected', then add a button below that says 'Add Diet Plan'. Else, input the food items for that meal according to that diet plan, and add a '+' sign for user to add it into the daily food intake

const DietPlan = () => {
  return (
    <View style={styles.container}>
      <Text>No Diet Plan Selected !</Text>
      <TouchableOpacity style={styles.button}>
        <Text>Select Diet Plan</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E4FBFF',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10
  }
})

export default DietPlan;
