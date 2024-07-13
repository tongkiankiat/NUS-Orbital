import React, { useState, useEffect } from 'react';
import { Tabs } from 'expo-router';
import { MaterialCommunityIcons, Entypo, FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { UsernameContext } from '../context/UsernameContext';

const loggedInLayout = () => {
  // Define useState variables
  const [username, setUsername] = useState<any>('');
  const [loading, setLoading] = useState(false);

  // fetch username from database
  const fetchUsername = async () => {
    setLoading(true);
    try {
      // initialize user from supabase.auth
      const user = await supabase.auth.getUser();
      if (!user) {
        console.log('No such user !');
        return;
      }
      const uuid = user.data.user?.id;

      const { data, error } = await supabase.from('users').select('username').eq('id', uuid).single();
      if (error) {
        console.error('Error getting username: ', error);
      } else {
        setUsername(data?.username);
      }
    } catch (error) {
      console.error('Error fetching documents: ', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsername();
  }, []);


  return (
    <UsernameContext.Provider value={username}>
      <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: 'blue' }}>
        <Tabs.Screen
          name='home'
          options={{
            tabBarIcon: ({ color, size }) => (
              <Entypo name='home' size={24} color='black' />
            ), title: 'Home'
          }}
        />
        <Tabs.Screen
          name='fooddiary'
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name='silverware-fork-knife' size={24} color='black' />
            ), title: 'Diary'
          }}
        />
        <Tabs.Screen
          name='workout'
          options={{
            tabBarIcon: ({ color, size }) => (
              <FontAwesome6 name='dumbbell' size={24} color='black' />
            ), title: 'Workout'
          }}
        />
        <Tabs.Screen
          name='friends'
          options={{
            tabBarIcon: ({ color, size }) => (
              <FontAwesome5 name='user-friends' size={24} color='black' />
            ), title: 'Friends'
          }}
        />
        <Tabs.Screen
          name='rewards'
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name='ticket-percent' size={24} color='black' />
            ), title: 'Rewards'
          }}
        />
      </Tabs>
    </UsernameContext.Provider>
  );
}

export default loggedInLayout;
