import { firebase_auth } from "../../config/firebaseConfig";
import React, { useState } from "react";
import { doc, updateDoc } from 'firebase/firestore';
import { db } from "../../config/firebaseConfig";
import { View, StyleSheet, Text, TouchableOpacity, TextInput } from "react-native";
import { SelectList } from 'react-native-dropdown-select-list';
import { router } from "expo-router";

const RegistrationDetails = () => {
    const [goals, setGoals] = useState('')
    const [height, setHeight] = useState('')
    const [weight, setWeight] = useState('')
    const [loading, setLoading] = useState(false);

    const dropdown_data = [
      {key:'1', value:'Lose Weight'},
      {key:'2', value:'Gain Weight'},
      {key:'3', value:'Maintain Weight'}
    ]

    const addDetails = async () => {
        setLoading(true);
        if (height && weight && goals) {
            try {
                const details = doc(db, "users", firebase_auth.currentUser?.uid);
                await updateDoc(details, {
                    height: height,
                    weight: weight,
                    fitness_goals: goals,
                    firstlogin: false
                });
                router.push("../(loggedIn)/home");
            } catch (error: any) {
                alert('Registration failed! ' + error.message);
            } finally {
                setLoading(false);
            }
        }
        else {
            alert("Please fill up all the details!");
            return;
        }
    }
    return (
        <View style={styles.container}>
          <View style={{marginHorizontal:20}}>
            <Text style={{marginBottom:10, alignSelf:'center'}}>What are your fitness goals?</Text>
            <SelectList 
              setSelected={(value: any) => setGoals(value)} 
              data={dropdown_data} 
              save="value"
              search={false}
            />
          </View>
          <View style={{marginHorizontal:20}}>
            <Text style={{marginTop:10, alignSelf:'center'}}>What is your height?</Text>
            <TextInput
              style={styles.input}
              placeholder="Height (in cm)"
              placeholderTextColor="#888"
              value={height}
              onChangeText={(value) => setHeight(value)}
              keyboardType="numeric"
            />
          </View>
          <View style={{marginHorizontal:20}}>
            <Text style={{alignSelf:'center'}}>What is your weight?</Text>
            <TextInput
              style={styles.input}
              placeholder="Weight (in kg)"
              placeholderTextColor="#888"
              value={weight}
              onChangeText={(value) => setWeight(value)}
              keyboardType="numeric"
            />
          </View>
          <View>
            <TouchableOpacity style={styles.button} onPress={addDetails}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#E4FBFF',
      justifyContent: 'center',
    },
    input: {
      width: '100%',
      height: 50,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      marginTop: 10,
      marginBottom: 10,
      paddingHorizontal: 20
    },
    button: {
      alignSelf: 'center',
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

export default RegistrationDetails;