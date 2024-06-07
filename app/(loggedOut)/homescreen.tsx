import { router } from 'expo-router'
import React from 'react'
import { View, StyleSheet, Text, TouchableOpacity, Image} from 'react-native'

const HomeScreen = () => {
    return (
      <View style={styles.container}>
          <Image source={require('../../assets/images/Logo.png')} style = {styles.logo}/>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/loginscreen')}>
              <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/registerscreen')}>
              <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
      </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#E4FBFF',
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
    },
    logo: {
      width: 200,
      height: 200,
      resizeMode: 'stretch',
    }
})

export default HomeScreen;