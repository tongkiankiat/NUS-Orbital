import { Text, TouchableOpacity, View, StyleSheet, StatusBar, Alert, KeyboardAvoidingView } from 'react-native';
import React, { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { MultipleSelectList } from 'react-native-dropdown-select-list';
import { Feather } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';

const Register_allergies = () => {
  // Get params from previous screen: 'registrationfitness'
  const { height, weight, age, gender, goals, active_level } = useLocalSearchParams();

  // Define useState variables
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const data = [
    { key: '1', value: 'Egg' },
    { key: '2', value: 'Fish' },
    { key: '3', value: 'Gluten' },
    { key: '4', value: 'Lactose' },
    { key: '5', value: 'Milk' },
    { key: '6', value: 'Nuts' },
    { key: '7', value: 'Peanuts' },
    { key: '8', value: 'Sesame' },
    { key: '9', value: 'Shellfish' },
    { key: '10', value: 'Soy' }
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
        allergies: selected
      }).eq('id', uuid);
      console.log(typeof(selected), selected);
      if (updateError) {
        Alert.alert('Error occured: ', updateError.message);
        return;
      };
    } catch (error) {
      console.error('Error occured: ', error);
      setLoading(false);
      return;
    } finally {
      setLoading(false);
      router.push({pathname: 'registration_mealtimes', params: {
        height: height,
        weight: weight,
        age: age,
        gender: gender,
        goals: goals,
        active_level: active_level,
        allergies: selected
      }});
    }
  };

  return (
    <KeyboardAvoidingView style={styles.keyboardcontainer}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => { router.back() }} style={{ paddingHorizontal: 20 }}>
          <Feather name='arrow-left' size={20} color='black' />
        </TouchableOpacity>
        <View style={styles.multipleselectlist}>
          <Text style={{ alignSelf: 'center', paddingBottom: 10 }}>Do you have any allergies?</Text>
          <MultipleSelectList
            setSelected={(value: string[]) => setSelected(value)}
            data={data}
            save='value'
            label='Allergies'
            placeholder='Allergies'
          // search = {false}
          />
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
    paddingTop: StatusBar.currentHeight,
    backgroundColor: '#E4FBFF'
  },
  multipleselectlist: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
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

export default Register_allergies;