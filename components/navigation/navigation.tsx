import React from 'react';
import HomeScreen from '../../app/screens/homescreen'; 
import LogInScreen from '../../app/screens/loginscreen';
import MainScreen from '../../app/screens/mainscreen';
import RegisterScreen from '../../app/screens/registerscreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import useAuth from '../../hooks/useAuth'

const Stack = createNativeStackNavigator();

export default function AppNavigation() {
  const {user} = useAuth();
  
  if (user) {
    return (
      <NavigationContainer independent={true}>
        <Stack.Navigator initialRouteName='Main'>
          <Stack.Screen options={{headerShown:false}} name="Main" component={MainScreen}/>
        </Stack.Navigator>
      </NavigationContainer>
    )
  } else {
    return (
      <NavigationContainer independent={true}>
        <Stack.Navigator initialRouteName='Home'>
          <Stack.Screen options={{headerShown:false}} name="Home" component={HomeScreen}/>
          <Stack.Screen options={{headerShown:false}} name="Login" component={LogInScreen}/>
          <Stack.Screen options={{headerShown:false}} name="Register" component={RegisterScreen}/> 
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}