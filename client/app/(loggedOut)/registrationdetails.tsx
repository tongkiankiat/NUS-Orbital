import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import { router } from 'expo-router';
import { supabase } from '../../lib/supabase';

const RegistrationDetails = () => {
  const [goals, setGoals] = useState('')
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('')
  const [loading, setLoading] = useState(false);

  const dropdown_data_gender = [
    { key: '1', value: 'Male' },
    { key: '2', value: 'Female' }
  ];

  const updateDetails = async () => {
    setLoading(true);
    const user = await supabase.auth.getUser();
    const uuid = user.data.user?.id;

    try {
      if (!user) {
        Alert.alert('Error', 'No user logged in!');
        setLoading(false);
        return;
      };

      const { error: updateError } = await supabase.from('users').update({
        height: parseInt(height, 10),
        weight: parseInt(weight, 10),
        age: parseInt(age, 10),
        gender: gender
      }).eq('id', uuid);

      if (updateError) {
        Alert.alert('Error', updateError.message);
        return;
      };
    } catch (error) {
      console.error('Error occured: ', error);
      setLoading(false);
      return;
    } finally {
      setLoading(false);
      router.push({pathname: 'registration_fitness', params: {
        height: height,
        weight: weight,
        age: age,
        gender: gender
      }});
    }
  };

  return (
    <KeyboardAvoidingView style={styles.keyboardcontainer}>
      <View style={styles.container}>
        <View style={{ marginHorizontal: 20 }}>
          <Text style={{ marginBottom: 10, alignSelf: 'center', marginTop: 10 }}>What is your gender?</Text>
          <SelectList
            setSelected={(value: any) => setGender(value)}
            data={dropdown_data_gender}
            save='value'
            search={false}
          />
        </View>
        <View style={{ marginHorizontal: 20 }}>
          <Text style={{ marginTop: 10, alignSelf: 'center' }}>What is your age?</Text>
          <TextInput
            style={styles.input}
            placeholder='Age'
            placeholderTextColor='#888'
            value={age}
            onChangeText={(value) => setAge(value)}
            keyboardType='numeric'
          />
        </View>
        <View style={{ marginHorizontal: 20 }}>
          <Text style={{ alignSelf: 'center' }}>What is your height?</Text>
          <TextInput
            style={styles.input}
            placeholder='Height (in cm)'
            placeholderTextColor='#888'
            value={height}
            onChangeText={(value) => setHeight(value)}
            keyboardType='numeric'
          />
        </View>
        <View style={{ marginHorizontal: 20 }}>
          <Text style={{ alignSelf: 'center' }}>What is your weight?</Text>
          <TextInput
            style={styles.input}
            placeholder='Weight (in kg)'
            placeholderTextColor='#888'
            value={weight}
            onChangeText={(value) => setWeight(value)}
            keyboardType='numeric'
          />
        </View>
        <View>
          <TouchableOpacity style={styles.button} onPress={updateDetails}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  keyboardcontainer: {
    flex: 1,
    backgroundColor: '#E4FBFF'
  },
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