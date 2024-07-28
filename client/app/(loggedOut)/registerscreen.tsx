import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Button, StatusBar, KeyboardAvoidingView } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';

const RegisterScreen = () => {
  const [username, setusername] = useState('');
  const [createpassword, setcreatepassword] = useState('');
  const [confirmpassword, setconfirmpassword] = useState('');
  const [email, setemail] = useState('');
  const [loading, setLoading] = useState(false);

  const signUp = async () => {
    setLoading(true);
    if (createpassword === confirmpassword) {
      const { error } = await supabase.auth.signUp({
        email: email,
        password: createpassword
      });
      if (error) {
        Alert.alert(error.message);
        console.error(error.message);
        setLoading(false);
        return;
      };

      // update username in the users table
      const user = await supabase.auth.getUser();
      const uuid = user.data.user?.id;
      if (!user) {
        Alert.alert('No such user!');
        setLoading(false);
        return;
      }
      const { error: updateError } = await supabase.from('users').update({
        username: username
      }).eq('id', uuid);

      Alert.alert('Sign up successful!', 'You have successfully signed up!', [{ text: 'OK', onPress: () => router.push('registrationdetails') }]);
      setLoading(false);
    }
    else {
      Alert.alert('Passwords do not match!');
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.keyboardcontainer}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => { router.back() }}>
          <Feather name='arrow-left' size={20} color='black' />
        </TouchableOpacity>
        <Text style={styles.registerfont}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder='Username'
          placeholderTextColor='#888'
          onChangeText={text => setusername(text)}
          value={username}
        />
        <Text style={styles.registerfont}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder='Email'
          placeholderTextColor='#888'
          onChangeText={text => setemail(text)}
          value={email}
        />
        <Text style={styles.registerfont}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder='Password'
          placeholderTextColor='#888'
          secureTextEntry
          value={createpassword}
          onChangeText={(value) => setcreatepassword(value)}
        />
        <Text style={styles.registerfont}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          placeholder='Confirm Password'
          placeholderTextColor='#888'
          secureTextEntry
          onChangeText={text => setconfirmpassword(text)}
          value={confirmpassword}
        />
        {
          loading ? (
            <ActivityIndicator size='large' color='#0000ff' />
          ) : (
            <TouchableOpacity style={styles.button} onPress={signUp}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          )
        }
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#E4FBFF',
    paddingTop: StatusBar.currentHeight
  },
  backButton: {
    position: 'absolute',
    top: StatusBar.currentHeight,
    left: 10,
    zIndex: 1
  },
  registerfont: {
    color: 'black',
    fontSize: 12,
    paddingVertical: 10,
    fontWeight: 'bold',
    alignSelf: 'flex-start'
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 20
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
})

export default RegisterScreen;