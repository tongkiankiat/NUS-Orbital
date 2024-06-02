import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { firebase_auth } from '../../config/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';

const RegisterScreen = () => {
    const [createusername, setcreateusername] = useState('');
    const [createpassword, setcreatepassword] = useState('');
    const [confirmpassword, setconfirmpassword] = useState('');
    const [email, setemail] = useState('');
    const [loading, setLoading] = useState(false);

    const auth = firebase_auth;

    const signUp = async () => {
        setLoading(true);
        try {
          if (createpassword != confirmpassword) {
            alert("Passwords do not match!");
            setLoading(false);
            return;
          }
          const response = await createUserWithEmailAndPassword(auth, email, createpassword);
          console.log(response);

          // create a new entry in firestore with user's details
          const addNewUser = await setDoc(doc(db, "users", response.user.uid), {
            username: createusername,
            email: email,
          });

          alert("Signed up! You will now be redirected into the application");
        } catch (error: any) {
          console.log(error);
          alert('Sign up failed: ' + error.message);
        } finally {
          setLoading(false);
        }
      }

    return (
        <View style={styles.container}>
            <Text style={styles.font}>Create your account</Text>
            <Text style={styles.registerfont}>Username</Text>
            <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#888"
                value={createusername}
                onChangeText={(value) => setcreateusername(value)}
                
            />
            <Text style={styles.registerfont}>Password</Text>
            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#888"
                secureTextEntry
                value={createpassword}
                onChangeText={(value) => setcreatepassword(value)}
            />
            <Text style={styles.registerfont}>Confirm Password</Text>
            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor="#888"
                secureTextEntry
                onChangeText={text => setconfirmpassword(text)}
                value={confirmpassword}
            />
            <Text style={styles.registerfont}>Email</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#888"
                onChangeText={text => setemail(text)}
                value={email}
            />
            {
                loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <TouchableOpacity style={styles.button} onPress={signUp}>
                        <Text style={styles.buttonText}>Next</Text>
                    </TouchableOpacity>
                )
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#E4FBFF'
    },
    font: {
        color: 'black',
        fontSize: 24,
        fontWeight: 'bold',
        paddingBottom: 90,
        paddingTop: 20
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