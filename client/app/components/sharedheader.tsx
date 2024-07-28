import { View, Text, StatusBar, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useContext } from 'react';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import { UsernameContext } from '../context/UsernameContext';
import { CoinsContext } from '../context/CoinsContext';

const SharedHeader = () => {
  // Retrieve username
  const username = useContext(UsernameContext);
  const { coins, setCoins } = useContext(CoinsContext);

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.push('../components/profile')}>
        <Ionicons name='person-circle' size={26} color='white' />
      </TouchableOpacity>
      <Text style={styles.welcomeText}>Welcome, {username}</Text>
      <View style={styles.coinsborder}>
        <FontAwesome5 name="coins" size={20} color="gold" />
        <Text style={{color: 'white'}}>{coins}</Text>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    paddingTop: StatusBar.currentHeight,
    backgroundColor: 'blue'
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    justifyContent: 'center',
    paddingLeft:60,
    color: 'white'
  },
  coinsborder: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'black',
    width: 80
  }
});

export default SharedHeader;