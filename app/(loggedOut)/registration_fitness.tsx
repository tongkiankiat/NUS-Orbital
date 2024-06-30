import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert, KeyboardAvoidingView } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import { router } from 'expo-router';
import { supabase } from '../../lib/supabase';

const RegistrationDetails = () => {
  const [goals, setGoals] = useState('');
  const [active_level, setActiveLevel] = useState(0);
  const [loading, setLoading] = useState(false);

  const dropdown_data_goals = [
    { key: '1', value: 'Lose Weight' },
    { key: '2', value: 'Gain Weight' },
    { key: '3', value: 'Maintain Weight' }
  ];

  const dropdown_data_active = [
    { key: 1, value: 'Sedentary (Little to no exercise)' },
    { key: 2, value: 'Lightly Active (Exercise/Sports 1-3 days per week)' },
    { key: 3, value: 'Moderately Active (Exercise/Sports 3-5 days per week or more)' },
  ]

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
        goals: goals,
        active_level: active_level
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
      router.push('registration_allergies');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.keyboardcontainer}>
      <View style={styles.container}>
        <View style={{ marginHorizontal: 20 }}>
          <Text style={{ marginBottom: 10, alignSelf: 'center' }}>What are your fitness goals?</Text>
          <SelectList
            setSelected={(value: string) => setGoals(value)}
            data={dropdown_data_goals}
            save='value'
            search={false}
          />
        </View>
        <View style={{ marginHorizontal: 20 }}>
          <Text style={{ marginBottom: 10, marginTop: 10, alignSelf: 'center' }}>How active are you?</Text>
          <SelectList
            setSelected={(key: number) => setActiveLevel(key)}
            data={dropdown_data_active}
            save='key'
            search={false}
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