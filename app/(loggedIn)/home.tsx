import { View, Text, TouchableOpacity, StyleSheet, Image, StatusBar } from 'react-native';
import React, { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { supabase } from '../../lib/supabase';

// read data for NUS gym capacity


const MainScreen = () => {
  const [username, setUsername] = useState<any>('');
  
  // signing out the user
  const logOut = async () => {
    const { error } = await supabase.auth.signOut();
    router.push("/");
  }

  // fetch username from database
  const fetchUsername = async () => {
    try {
      // initialize user from supabase.auth
      const user = await supabase.auth.getUser();
      const uuid = user.data.user?.id;
      if (!user) {
        console.log("No such user !");
        return;
      }

      const { data, error } = await supabase.from('users').select('username').eq('id', uuid).single();

      setUsername(data?.username);
    
    } catch (error) {
      console.error("Error fetching documents: ", error);
    }
  }

  useEffect(() => {
    fetchUsername();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../../assets/images/Logo.png')} style={styles.profileLogo} />
        <Text style={styles.welcomeText}>Welcome, {username}</Text>
        <Image source={require('../../assets/images/Logo.png')} style={styles.appLogo} />
      </View>

      <View style={styles.body}>
        <Text style={styles.bodyText}>What would you like to do today?</Text>
        <TouchableOpacity style={styles.button} onPress={logOut}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E4FBFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    paddingTop: StatusBar.currentHeight
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  appLogo: {
    width: 30,
    height: 30,
  },
  profileLogo: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bodyText: {
    fontSize: 20,
    textAlign: 'center',
  },
  bottomNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#CCCCCC',
  },
  navItem: {
    flex: 1,
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
});

export default MainScreen;
