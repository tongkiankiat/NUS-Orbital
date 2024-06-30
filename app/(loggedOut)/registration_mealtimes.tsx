import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Alert, KeyboardAvoidingView } from 'react-native';
import React, { useState } from 'react';
import { router } from 'expo-router';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';

const Register_mealtimes = () => {
  const [timeBfast, setBfastTime] = useState(new Date());
  const [timeLunch, setLunchTime] = useState(new Date());
  const [timeDinner, setDinnerTime] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const onChangeBfast = (event: any, selectedTime: any) => {
    if (selectedTime) {
      setBfastTime(selectedTime);
    }
  };

  const onChangeLunch = (event: any, selectedTime: any) => {
    if (selectedTime) {
      setLunchTime(selectedTime);
    }
  };

  const onChangeDinner = (event: any, selectedTime: any) => {
    if (selectedTime) {
      setDinnerTime(selectedTime);
    }
  };

  const showMode = (currentMode: any, value: any, onChange: any) => {
    DateTimePickerAndroid.open({
      value: value,
      onChange,
      mode: currentMode,
      is24Hour: true,
    });
  };

  const showTimePicker = (meal: any, onChange: any) => () => {
    showMode('time', meal, onChange);
  };

  const updateDetails = async () => {
    setLoading(false);
    const user = await supabase.auth.getUser();
    const uuid = user.data.user?.id;

    try {
      if (!user) {
        Alert.alert('Error', 'No user logged in!');
        setLoading(false);
        return;
      };

      const { error: updateError } = await supabase.from('users').update({
        breakfast_time: timeBfast.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
        lunch_time: timeLunch.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
        dinner_time: timeDinner.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      }).eq('id', uuid);

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
      Alert.alert('Success!', 'Registration Complete!', [
        { text: 'OK', onPress: () => router.push('../(loggedIn)/home') }
      ]);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.keyboardcontainer}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => { router.push('/') }} style={{ paddingHorizontal: 20 }}>
          <Feather name='arrow-left' size={20} color='black' />
        </TouchableOpacity>
        <View style={styles.body}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', paddingVertical: StatusBar.currentHeight }}>What time do you usually eat your meals?</Text>
          <View style={{ alignItems: 'center' }}>
            <View style={styles.meal_times}>
              <Text style={styles.text}>Breakfast</Text>
              <TouchableOpacity onPress={showTimePicker(timeBfast, onChangeBfast)}>
                <AntDesign name='pluscircle' size={18} color='black' />
              </TouchableOpacity>
            </View>
            <Text style={styles.text}>Selected: {timeBfast.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</Text>
            <View style={styles.meal_times}>
              <Text style={styles.text}>Lunch</Text>
              <TouchableOpacity onPress={showTimePicker(timeLunch, onChangeLunch)}>
                <AntDesign name='pluscircle' size={18} color='black' />
              </TouchableOpacity>
            </View>
            <Text style={styles.text}>Selected: {timeLunch.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</Text>
            <View style={styles.meal_times}>
              <Text style={styles.text}>Dinner</Text>
              <TouchableOpacity onPress={showTimePicker(timeDinner, onChangeDinner)}>
                <AntDesign name='pluscircle' size={18} color='black' />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.text}>Selected: {timeDinner.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</Text>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <TouchableOpacity style={styles.button} onPress={updateDetails}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

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
  body: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#E4FBFF',
  },
  meal_times: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 300,
    height: 100
  },
  button: {
    alignSelf: 'center',
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 18
  }
});

export default Register_mealtimes;
