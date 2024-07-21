import { View, Text, StyleSheet, TextInput, Dimensions, Alert, TouchableOpacity, FlatList } from 'react-native';
import React, { useContext, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { MaterialIcons } from '@expo/vector-icons';
import { UsernameContext } from '../context/UsernameContext';

// Define screen dimensions here
const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

const FindFriends = () => {
  // Define useState variables here
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [usersFound, setUsersFound] = useState<any[]>([]);

  // User's username, to exclude from friends search
  const user_username = useContext(UsernameContext);

  // Function to search for friend. Put this in backend when importing over to main app code
  const searchForUser = async (username: string) => {
    setLoading(true);
    // Search not allowed if search term is an empty string
    if (!username) {
      Alert.alert('Please enter a username!');
      setUsersFound([]);
      setLoading(false);
      return;
    };

    // implement logic to get friends list OR pass it from friendslist.tsx
    try {
      const { data, error } = await supabase.from('social').select('username').ilike('username', `%${username}%`);
      if (error) {
        Alert.alert(`Error searching for user ${username}: `, error.message);
      } else if (data) {
        if (data.length !== 0) {
          const usersWithFriendStatus = data.filter(user => user.username != user_username && !data.includes(user.username));
          setUsersFound(usersWithFriendStatus);
        } else {
          Alert.alert(`User ${username} not found!`);
        }
      }
    } catch (error) {
      console.error('Error searching for user: ', error);
    } finally {
      setLoading(false);
    };
  };

  // Function to send friend request
  const sendFriendRequest = async (receiver: string) => {
    setLoading(true);
    try {
      const { error: addFriendError } = await supabase.rpc('append_to_friend_requests', { receiver_username: receiver, sender_username: user_username });
      const { error: addPendingError } = await supabase.rpc('append_to_pending_requests', { receiver_username: receiver, sender_username: user_username });
      if (addFriendError) {
        Alert.alert('Error sending friend request: ', addFriendError.message);
      } if (addPendingError) {
        Alert.alert('Error displaying pending friend request: ', addPendingError.message);
      } else {
        setUsersFound(usersFound.filter(user => user.username != receiver));
        Alert.alert('Friend request sent!');
      }
    } catch (error) {
      console.error('Error sending friend request: ', error);
    } finally {
      setLoading(false);
    };
  };

  const renderUser = ({ item }) => {
    return (
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 }}>
        <Text>{item.username}</Text>
        <TouchableOpacity onPress={() => sendFriendRequest(item.username)}>
          <MaterialIcons name="person-add" size={24} color="black" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={{ paddingHorizontal: 20, borderBottomColor: 'black', borderBottomWidth: 1 }}>
        <TextInput
          style={styles.input}
          placeholder='Enter a username here'
          placeholderTextColor='#888'
          value={username}
          onChangeText={(value) => setUsername(value)}
        />
        <TouchableOpacity style={styles.searchButton} onPress={() => searchForUser(username)}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={usersFound}
        renderItem={renderUser}
        style={styles.flatlist}
        ItemSeparatorComponent={() => {
          return (
            <View style={styles.separator} />
          )
        }}
      />
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E4FBFF'
  },
  searchbar: {
    marginHorizontal: screenWidth * 0.05,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  searchButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  flatlist: {
    flex: 1,
    paddingTop: 5
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
  }
});

export default FindFriends;