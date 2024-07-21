import React from 'react'
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'

// TODO: Under the 'NUS' tab, create buttons to each canteen in NUS, then add the respective food items inside each canteen tab

const CanteenButtons = () => {
  return (
    <View style={styles.rowcontainer}>
      <View style={styles.row}>
        <TouchableOpacity style={styles.button}>
          <Text>The Summit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text>PGPR Aircon FC</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text>Frontier (AC)</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity style={styles.button}>
          <Text>TechnoEdge (Non-AC)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text>TechnoEdge (AC)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text>Flavours
            @UTown</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity style={styles.button}>
          <Text>Fine Food (UTown)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text>The Deck</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text>The Terrace</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity style={styles.button}>
          <Text>Foodclique (PGP)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text>Frontier (Non-AC)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text>Central Square (YIH)</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const NUS = () => {
  return (
    <View style={styles.container}>
      <CanteenButtons/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#E4FBFF'
  },
  rowcontainer: {
    flex: 1,
    flexDirection: 'column'
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
  button: {
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    width: 110,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default NUS;
