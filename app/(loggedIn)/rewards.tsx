import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import SharedHeader from '../components/sharedheader'

export default function diary() {
  return (
    <View style={styles.container}>
      <SharedHeader />
      <View style={styles.rewards}>
        <Text style={styles.text}>Coins</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  text: {
    fontSize: 50,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10
  },
  rewards: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 20
  }
})