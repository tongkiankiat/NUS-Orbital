import { View, Text, StatusBar, TouchableOpacity, StyleSheet, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { supabase } from '../../lib/supabase';

const SharedHeader = () => {
  const [username, setUsername] = useState<any>('');
  const [modalvisible, setVisible] = useState(false);
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
    <View style={styles.header}>
      <TouchableOpacity>
        <Ionicons name='notifications' size={24} color='black' />
      </TouchableOpacity>
      <Text style={styles.welcomeText}>Welcome, {username}</Text>
      <TouchableOpacity onPress={() => router.push('../components/profile')}>
        <Ionicons name='person-circle' size={26} color='black' />
      </TouchableOpacity>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E4FBFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    paddingTop: StatusBar.currentHeight
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    justifyContent: 'center'
  },
});

export default SharedHeader;