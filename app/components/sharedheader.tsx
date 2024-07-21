import { View, Text, StatusBar, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useContext } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { UsernameContext } from '../context/UsernameContext';

const SharedHeader = () => {
  // Retrieve username
  const username = useContext(UsernameContext);

  return (
    <View style={styles.header}>
      <TouchableOpacity>
        <Ionicons name='notifications' size={24} color='black' />
      </TouchableOpacity>
      <Text style={styles.welcomeText}>Welcome, {username}</Text>
      <TouchableOpacity onPress={() => router.push('../components/profile')}>
        <Ionicons name='person-circle' size={26} color='black' />
      </TouchableOpacity>
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
    backgroundColor: '#092840'
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    justifyContent: 'center'
  },
});

export default SharedHeader;