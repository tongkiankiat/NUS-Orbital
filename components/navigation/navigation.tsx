import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import useAuth from '../../hooks/useAuth';
import { firebase_auth } from '@/config/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebaseConfig';
import HomeScreen from '../../app/screens/homescreen'; 
import LogInScreen from '../../app/screens/loginscreen';
import MainScreen from '../../app/screens/mainscreen';
import RegisterScreen from '../../app/screens/registerscreen';
import RegistrationDetails from '@/app/screens/registrationdetails';

const Stack = createNativeStackNavigator();

export default function AppNavigation() {
  const { user } = useAuth();
  const [firstLogin, setFirstLogin] = useState(null);

  useEffect(() => {
    const fetchFirstLogin = async () => {
      try {
        const docRef = doc(db, "users", firebase_auth.currentUser?.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFirstLogin(docSnap.data().firstlogin);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document: ", error);
      }
    };

    if (user) {
      fetchFirstLogin();
    }
  }, [user]);

  if (user) {
    return (
      <NavigationContainer independent={true}>
        <Stack.Navigator initialRouteName={firstLogin ? 'RegistrationDetails' : 'Main'}>
          <Stack.Screen name="RegistrationDetails" component={RegistrationDetails} options={{ headerShown: false }} />
          <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  } else {
    return (
      <NavigationContainer independent={true}>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={LogInScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
