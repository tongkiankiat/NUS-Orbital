import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { supabase } from '../../lib/supabase';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { SelectList, MultipleSelectList } from 'react-native-dropdown-select-list';

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({
    username: '',
    email: '',
    allergies: [],
    goals: '',
    active_level: '',
    breakfast_time: '',
    lunch_time: '',
    dinner_time: '',
    height: '',
    weight: '',
    age: '',
    gender: ''
  });

  const dropdown_data_goals = [
    { key: 'Lose Weight', value: 'Lose Weight' },
    { key: 'Gain Weight', value: 'Gain Weight' },
    { key: 'Maintain Weight', value: 'Maintain Weight' }
  ];

  const dropdown_data_active = [
    { key: '1', value: '1' },
    { key: '2', value: '2' },
    { key: '3', value: '3' }
  ];

  const dropdown_data_gender = [
    { key: 'Male', value: 'Male' },
    { key: 'Female', value: 'Female' }
  ];

  const allergy_data = [
    { key: 'Egg', value: 'Egg' },
    { key: 'Fish', value: 'Fish' },
    { key: 'Gluten', value: 'Gluten' },
    { key: 'Lactose', value: 'Lactose' },
    { key: 'Milk', value: 'Milk' },
    { key: 'Nuts', value: 'Nuts' },
    { key: 'Peanuts', value: 'Peanuts' },
    { key: 'Sesame', value: 'Sesame' },
    { key: 'Shellfish', value: 'Shellfish' },
    { key: 'Soy', value: 'Soy' }
  ];

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    setLoading(true);
    setLoading(true);
    const user = await supabase.auth.getUser();
    if (!user) {
      console.error('No such user!');
      return;
    };
    const uuid = user.data.user?.id;
    try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', uuid)
          .single();
        if (error) {
          throw error;
        }
        let cleanedAllergies = data?.allergies || '';
        cleanedAllergies = cleanedAllergies.replace(/[\[\]']+/g, ''); // Remove square brackets and quotes
        const userAllergies = cleanedAllergies.replace(/"/g, '').split(',');
        setUserInfo({
          ...data,
          allergies: userAllergies
        });
        console.log(data);

    } catch (error) {
      console.error('Error fetching user info: ', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setUserInfo({ ...userInfo, [field]: value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setLoading(true);
    const user = await supabase.auth.getUser();
    if (!user) {
      console.error('No such user!');
      return;
    };
    const uuid = user.data.user?.id;
    try {
      const user = await supabase.auth.getUser();
      if (user) {
        // const updatedUserInfo = {
        //   ...userInfo,
        //   allergies: userInfo.allergies.join(',') // Convert allergies array to string
        // };
        
        const { error } = await supabase
          .from('users')
          .update(userInfo)
          .eq('id', uuid);
        if (error) {
          throw error;
        }
        console.log(userInfo.allergies);
        Alert.alert('Success', 'Your information has been updated.');
        router.push('../(loggedIn)/home'); // Redirect to home page after update
      }
    } catch (error) {
      console.error('Error updating user info: ', error.message);
      Alert.alert('Error', 'There was an error updating your information.');
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      router.push('/');
    } else {
      console.error('Error logging out:', error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.headerarrow} onPress={() => router.back()}>
        <Feather name="arrow-left" size={20} color="black" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={logOut}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        value={userInfo.username}
        onChangeText={(value) => handleInputChange('username', value)}
        placeholder="Username"
      />
      <TextInput
        style={styles.input}
        value={userInfo.email}
        onChangeText={(value) => handleInputChange('email', value)}
        placeholder="Email"
        keyboardType="email-address"
        editable={false}
      />

      <Text style={styles.label}>Allergies</Text>
      <MultipleSelectList
        setSelected={(value) => handleInputChange('allergies', value)}
        data={allergy_data}
        save="value"
        // defaultOption={userInfo.allergies.map(allergy => ({ key: allergy, value: allergy }))}
        defaultOption={{key: "Egg", value: "Egg"}}
      />

      <Text style={styles.label}>Goals</Text>
      <SelectList
        setSelected={(value) => handleInputChange('goals', value)}
        data={dropdown_data_goals}
        save="value"
        defaultOption={{ key: userInfo.goals, value: userInfo.goals }}
      />

      <Text style={styles.label}>Activity Level</Text>
      <SelectList
        setSelected={(value) => handleInputChange('active_level', value)}
        data={dropdown_data_active}
        save="value"
        defaultOption={{ key: userInfo.active_level.toString(), value: userInfo.active_level.toString() }}
      />

      <Text style={styles.label}>Gender</Text>
      <SelectList
        setSelected={(value) => handleInputChange('gender', value)}
        data={dropdown_data_gender}
        save="value"
        defaultOption={{ key: userInfo.gender, value: userInfo.gender }}
      />

      <TextInput
        style={styles.input}
        value={userInfo.breakfast_time}
        onChangeText={(value) => handleInputChange('breakfast_time', value)}
        placeholder="Breakfast Time"
      />
      <TextInput
        style={styles.input}
        value={userInfo.lunch_time}
        onChangeText={(value) => handleInputChange('lunch_time', value)}
        placeholder="Lunch Time"
      />
      <TextInput
        style={styles.input}
        value={userInfo.dinner_time}
        onChangeText={(value) => handleInputChange('dinner_time', value)}
        placeholder="Dinner Time"
      />
      <TextInput
        style={styles.input}
        value={userInfo.height.toString()}
        onChangeText={(value) => handleInputChange('height', value)}
        placeholder="Height (in cm)"
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        value={userInfo.weight.toString()}
        onChangeText={(value) => handleInputChange('weight', value)}
        placeholder="Weight (in kg)"
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        value={userInfo.age.toString()}
        onChangeText={(value) => handleInputChange('age', value)}
        placeholder="Age"
        keyboardType="numeric"
      />
      <Button title="Update Profile" onPress={handleSubmit} disabled={loading} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E4FBFF',
    padding: 16,
  },
  button: {
    backgroundColor: '#007bff',
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
  },
  headerarrow: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
});

export default Profile;
