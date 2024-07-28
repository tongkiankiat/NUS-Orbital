import { View, Text, Pressable, StyleSheet, StatusBar } from 'react-native'
import React from 'react'
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { supabase } from '../../lib/supabase';

const Profile = () => {
  const logOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      router.push('/');
    } else {
      console.error('Error logging out:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.headerarrow} onPress={() => router.back()}>
        <Feather name="arrow-left" size={20} color="black" />
      </Pressable>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', position: 'relative'}}>
        <Pressable style={styles.button} onPress={() => router.push('./update_user_info')}>
          <Text style={styles.buttonText}>Update Profile</Text>
        </Pressable>
        <Pressable style={styles.button_logout} onPress={logOut}>
          <Text style={styles.buttonText}>Logout</Text>
        </Pressable>
        <Pressable onPress={() => router.push('./credits')}>
          <Text style={{ color: 'blue' }}>Credits</Text>
        </Pressable>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E4FBFF',
    paddingTop: StatusBar.currentHeight,
    paddingHorizontal: 16
  },
  headerarrow: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  button: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10,
    alignSelf: 'center',
  },
  button_logout: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10,
    alignSelf: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default Profile;