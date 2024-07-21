import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, ActivityIndicator, AppState, Alert, KeyboardAvoidingView } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { Feather } from '@expo/vector-icons';

AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})

const LogInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const signIn = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (error) {
      alert(error.message);
    }
    else {
      Alert.alert('Success!', 'Successfully logged in!', [{ text: 'OK', onPress: () => router.push('../(loggedIn)/home') }]);
    }
    setLoading(false);
  }

  return (
    <KeyboardAvoidingView style={styles.keyboardcontainer}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => { router.back() }} style={{ paddingHorizontal: 20 }}>
          <Feather name='arrow-left' size={20} color='black' />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder='Email'
          placeholderTextColor='#888'
          value={email}
          onChangeText={(value) => setEmail(value)}
        />
        <TextInput
          style={styles.input}
          placeholder='Password'
          placeholderTextColor='#888'
          secureTextEntry
          value={password}
          onChangeText={(value) => setPassword(value)}
        />
        {
          loading ? (
            <ActivityIndicator size='large' color='#0000ff' />
          ) : (
            <TouchableOpacity style={styles.button} onPress={signIn}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          )
        }
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#E4FBFF',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
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

export default LogInScreen;