import React, { useState, useEffect } from 'react';
import { Tabs } from 'expo-router';
import { MaterialCommunityIcons, Entypo, FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { UsernameContext } from '../context/UsernameContext';
import { CoinsContext } from '../context/CoinsContext';

const loggedInLayout = () => {
  // Define useState variables
  const [username, setUsername] = useState<any>('');
  const [coins, setCoins] = useState<any>(0);
  const [loading, setLoading] = useState(false);

  // fetch username and coins from database
  const fetchUsernameCoins = async () => {
    setLoading(true);
    try {
      // initialize user from supabase.auth
      const user = await supabase.auth.getUser();
      if (!user) {
        console.log('No such user !');
        return;
      }
      const uuid = user.data.user?.id;

      const { data, error: error } = await supabase.from('users').select('username, coins').eq('id', uuid).single();
      if (error) {
        console.error('Error getting username and coins: ', error);
      } else {
        setUsername(data?.username);
        setCoins(data?.coins)
      }
    } catch (error) {
      console.error('Error fetching documents: ', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsernameCoins();
  }, []);


  return (
    <UsernameContext.Provider value={username}>
      <CoinsContext.Provider value={{ coins, setCoins }}>
        <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: 'blue', tabBarStyle: { backgroundColor: 'blue' } }}>
          <Tabs.Screen
            name='home'
            options={{
              tabBarIcon: ({ color, size }) => (
                <Entypo name='home' size={24} color='white' />
              ),
              tabBarShowLabel: false
            }}
          />
          <Tabs.Screen
            name='fooddiary'
            options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name='silverware-fork-knife' size={24} color='white' />
              ),
              tabBarShowLabel: false
            }}
          />
          <Tabs.Screen
            name='workout'
            options={{
              tabBarIcon: ({ color, size }) => (
                <FontAwesome6 name='dumbbell' size={24} color='white' />
              ),
              tabBarShowLabel: false
            }}
          />
          <Tabs.Screen
            name='friends'
            options={{
              tabBarIcon: ({ color, size }) => (
                <FontAwesome5 name='user-friends' size={24} color='white' />
              ),
              tabBarShowLabel: false
            }}
          />
          <Tabs.Screen
            name='rewards'
            options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name='ticket-percent' size={24} color='white' />
              ),
              tabBarShowLabel: false
            }}
          />
        </Tabs>
      </CoinsContext.Provider>
    </UsernameContext.Provider>
  );
}

export default loggedInLayout;
