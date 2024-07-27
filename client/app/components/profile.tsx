import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Pressable, Alert, ScrollView, StatusBar } from 'react-native';
import { supabase } from '../../lib/supabase';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { SelectList, MultipleSelectList } from 'react-native-dropdown-select-list';

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [editinfo, setEditInfo] = useState(false);
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

  const dropdown_data = {
    'goals': [
      { key: 'Lose Weight', value: 'Lose Weight' },
      { key: 'Gain Weight', value: 'Gain Weight' },
      { key: 'Maintain Weight', value: 'Maintain Weight' }
    ],
    'active': [
      { key: 1, value: 'Sedentary (Little to no exercise)' },
      { key: 2, value: 'Lightly Active (Exercise/Sports 1-3 days per week)' },
      { key: 3, value: 'Moderately Active (Exercise/Sports 3-5 days per week or more)' }
    ],
    'gender': [
      { key: 'Male', value: 'Male' },
      { key: 'Female', value: 'Female' }
    ],
    'allergies': [
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
    ]
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    setLoading(true);
    const user = await supabase.auth.getUser();
    if (!user) {
      console.error('No such user!');
      return;
    };
    const uuid = user.data.user?.id;
    try {
      const { data, error } = await supabase.from('users').select('*').eq('id', uuid).single();
      if (error) {
        throw error;
      };
      setUserInfo(data);
    } catch (error: any) {
      console.error('Error fetching user info: ', error.message);
    } finally {
      setLoading(false);
    }
  };

  const display_allergies = () => {
    return userInfo.allergies.toString();
  }

  const handleInputChange = (field: any, value: any) => {
    setUserInfo({ ...userInfo, [field]: value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    const user = await supabase.auth.getUser();
    if (!user) {
      console.error('No such user!');
      return;
    };
    const uuid = user.data.user?.id;
    try {
      const { error } = await supabase.from('users').update(userInfo).eq('id', uuid);
      if (error) {
        throw error;
      }
      console.log(userInfo.allergies);
      Alert.alert('Success', 'Your information has been updated.');
      router.back();
    } catch (error: any) {
      console.error('Error updating user info: ', error.message);
      Alert.alert('Error', 'There was an error updating your information.');
    } finally {
      setEditInfo(false);
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
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Pressable style={styles.headerarrow} onPress={() => router.back()}>
            <Feather name="arrow-left" size={20} color="black" />
          </Pressable>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Update Profile Details</Text>
        </View>
        <View>
          <Text style={styles.label}>Username: </Text>
          <TextInput
            style={styles.input}
            value={userInfo.username}
            onChangeText={(value) => handleInputChange('username', value)}
            placeholder="Username"
            editable={editinfo}
          />
        </View>
        <View>
          <Text style={styles.label}>Email: </Text>
          <TextInput
            style={styles.input}
            value={userInfo.email}
            onChangeText={(value) => handleInputChange('email', value)}
            placeholder="Email"
            keyboardType="email-address"
            editable={editinfo}
          />
        </View>
        <Text style={styles.label}>Allergies:</Text>
        <MultipleSelectList
          setSelected={(value: string[]) => handleInputChange('allergies', value)}
          data={dropdown_data.allergies}
          save="value"
          search={false}
          label='Allergies'
        />
        <Text style={styles.label}>Current Allergies: {display_allergies()}</Text>
        <Text style={styles.label}>Goals:</Text>
        <SelectList
          setSelected={(value: string) => handleInputChange('goals', value)}
          data={dropdown_data.goals}
          save="value"
          defaultOption={{ key: userInfo.goals, value: userInfo.goals }}
          search={false}
        />
        <Text style={styles.label}>Active Level:</Text>
        <SelectList
          setSelected={(value: string) => handleInputChange('active_level', dropdown_data.active.find(item => item.value === value)!.key)}
          data={dropdown_data.active}
          save="value"
          defaultOption={{ key: dropdown_data.active.find(item => item.key === Number(userInfo.active_level))?.value, value: dropdown_data.active.find(item => item.key === Number(userInfo.active_level))?.value }}
          search={false}
        />
        <Text style={styles.label}>Gender</Text>
        <SelectList
          setSelected={(value: string) => handleInputChange('gender', value)}
          data={dropdown_data.gender}
          save="value"
          defaultOption={{ key: userInfo.gender, value: userInfo.gender }}
          search={false}
        />
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text>Breakfast Time: </Text>
          <TextInput
            style={styles.input}
            value={userInfo.breakfast_time}
            onChangeText={(value) => handleInputChange('breakfast_time', value)}
            placeholder="Breakfast Time"
            editable={editinfo}
          />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          <Text>Lunch Time: </Text>
          <TextInput
            style={styles.input}
            value={userInfo.lunch_time}
            onChangeText={(value) => handleInputChange('lunch_time', value)}
            placeholder="Lunch Time"
            editable={editinfo}
          />
        </View>
        <View style={styles.inputrow}>
          <Text>Dinner Time: </Text>
          <TextInput
            style={styles.input}
            value={userInfo.dinner_time}
            onChangeText={(value) => handleInputChange('dinner_time', value)}
            placeholder="Dinner Time"
            editable={editinfo}
          />
        </View>
        <View style={styles.inputrow}>
          <Text>Height (in cm): </Text>
          <TextInput
            style={styles.input}
            value={userInfo.height.toString()}
            onChangeText={(value) => handleInputChange('height', value)}
            placeholder="Height (in cm)"
            keyboardType="numeric"
            editable={editinfo}
          />
        </View>
        <View style={styles.inputrow}>
          <Text>Weight (in kg): </Text>
          <TextInput
            style={styles.input}
            value={userInfo.weight.toString()}
            onChangeText={(value) => handleInputChange('weight', value)}
            placeholder="Weight (in kg)"
            keyboardType="numeric"
            editable={editinfo}
          />
        </View>
        <View style={styles.inputrow}>
          <Text>Age: </Text>
          <TextInput
            style={styles.input}
            value={userInfo.age.toString()}
            onChangeText={(value) => handleInputChange('age', value)}
            placeholder="Age"
            keyboardType="numeric"
            editable={editinfo}
          />
        </View>
      </ScrollView>
      <View>
        {editinfo ?
          <Pressable style={styles.button_update} onPress={handleSubmit} disabled={loading}>
            <Text style={styles.buttonText}>Save Changes</Text>
          </Pressable>
          :
          <Pressable style={styles.button_update} onPress={() => setEditInfo(true)} disabled={loading}>
            <Text style={styles.buttonText}>Update Profile</Text>
          </Pressable>}
        <Pressable style={styles.button_logout} onPress={logOut} disabled={editinfo || loading}>
          <Text style={styles.buttonText}>Logout</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E4FBFF',
    paddingTop: StatusBar.currentHeight,
    paddingHorizontal: 16
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  button_logout: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10,
    alignSelf: 'center',
  },
  button_update: {
    backgroundColor: 'blue',
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
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  inputrow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  }
});

export default Profile;