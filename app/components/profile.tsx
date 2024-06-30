import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { supabase } from '../../lib/supabase';
import { router } from 'expo-router';

const profile = () => {
  // signing out the user
  const logOut = async () => {
    const { error } = await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={logOut}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
})

export default profile