import { View, Text, Linking, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import React from 'react';

const credits = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Credits</Text>
      
      <Text style={styles.creditItem}>FatSecret API:</Text>
      <TouchableOpacity onPress={() => Linking.openURL('https://www.fatsecret.com')}>
        <Text style={styles.link}>Powered by FatSecret</Text>
      </TouchableOpacity>
      
      <Text style={styles.creditItem}>Icons8:</Text>
      <TouchableOpacity onPress={() => Linking.openURL('http://icons8.com')}>
        <Text style={styles.link}>License Link</Text>
      </TouchableOpacity>
      
      <Text style={styles.creditItem}>IconFinder:</Text>
      <TouchableOpacity onPress={() => Linking.openURL('https://creativecommons.org/licenses/by/3.0/')}>
        <Text style={styles.link}>License: Creative Commons</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    paddingLeft: 10,
    backgroundColor: '#fff'
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
  },
  creditItem: {
    fontSize: 18,
    marginTop: 10,
    marginBottom: 5
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline'
  }
});

export default credits;
