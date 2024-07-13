import { View, Text, StyleSheet, Dimensions, TouchableOpacity, FlatList, Alert } from 'react-native';
import React, { useContext, useState, useEffect } from 'react';
import { AntDesign } from '@expo/vector-icons';
import { FriendRequestsContext } from '../context/FriendRequestsContext';
import { UsernameContext } from '../context/UsernameContext';
import { supabase } from '../../lib/supabase';
import { PendingRequestsContext } from '../context/PendingRequestsContext';

// Define screen dimensions here
const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

const FriendRequests = () => {
  // Retrieve Friend Requests Array and username from useContext
  const { friendRequests, setFriendRequests } = useContext(FriendRequestsContext);
  const { pendingRequests, setPendingRequests } = useContext(PendingRequestsContext);
  const username = useContext(UsernameContext);

  // Define useState variables
  const [loading, setLoading] = useState(false);

  // Subscribe to realtime updates from supabase DB

  // Function to call when there are changes made to DB
  const handleUpdates = (payload: any) => {
    console.log('Change received: ', pendingRequests.filter(user => user != payload.old.receiver_username));
    setPendingRequests(pendingRequests.filter((user: string) => user != payload.old.receiver_username));
  };

  useEffect(() => {
    const subscription = supabase.channel('social').on('postgres_changes', {event: '*', schema: 'public', table: 'social'}, handleUpdates).subscribe();

    return () => {supabase.removeChannel(subscription)};
  }, [setPendingRequests]);

  // Accept Friend Request and then remove the request from the friend requests tab
  const AcceptRequest = async (new_friend: string) => {
    setLoading(true);
    try {
      const { error: addFriendError } = await supabase.rpc('append_to_friends_list', { receiver_username: username, new_friend: new_friend });
      const { error: removeRequestError } = await supabase.rpc('remove_from_friend_requests', { sender_username: new_friend, receiver_username: username });
      if (addFriendError) {
        console.error('Error adding friend: ', addFriendError.message)
        Alert.alert('Error adding friend: ', addFriendError.message);
      } if (removeRequestError) {
        console.error('Error removing friend request: ', removeRequestError.message);
        Alert.alert('Error removing friend request: ', removeRequestError.message);
      } else {
        setFriendRequests(friendRequests.filter((user: any) => user != new_friend));
        console.log(`You are now friends with ${new_friend}!`);
        Alert.alert(`You are now friends with ${new_friend}!`);
      }
    } catch (error) {
      console.error('Error occured: ', error);
    } finally {
      setLoading(false);
    };
  };

  // Reject Friend Request
  const RejectRequest = async (new_friend: string) => {
    setLoading(true);
    try {
      const { error: removeRequestError } = await supabase.rpc('remove_from_friend_requests', { sender_username: new_friend, receiver_username: username });
      if (removeRequestError) {
        Alert.alert('Error removing friend request: ', removeRequestError.message);
      } else {
        setFriendRequests(friendRequests.filter((user: any) => user != new_friend));
      }
    } catch (error) {
      console.error('Error occured: ', error);
    } finally {
      setLoading(false);
    };
  };

  const renderPending = ({ item }) => {
    return (
      <View style={styles.flatlist_render}>
        <Text>{item}</Text>
        <View>
          <Text>Pending...</Text>
        </View>
      </View>
    );
  };

  const renderRequest = ({ item }) => {
    return (
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 }}>
        <Text>{item}</Text>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity style={{ paddingHorizontal: screenWidth * 0.1 }} onPress={() => AcceptRequest(item)}>
            <AntDesign name="checkcircle" size={24} color="green" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => RejectRequest(item)}>
            <AntDesign name="closecircle" size={24} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.requestcontainer}>
        <Text style={styles.headertext}>Pending</Text>
        <FlatList
          data={pendingRequests}
          renderItem={renderPending}
          style={styles.flatlist}
          scrollEnabled={true}
          ItemSeparatorComponent={() => {
            return (
              <View style={styles.separator} />
            )
          }}
        />
      </View>
      <View style={styles.requestcontainer}>
        <Text style={styles.headertext}>Incoming</Text>
        <FlatList
          data={friendRequests}
          renderItem={renderRequest}
          style={styles.flatlist}
          scrollEnabled={true}
          ItemSeparatorComponent={() => {
            return (
              <View style={styles.separator} />
            )
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E4FBFF'
  },
  flatlist: {
    paddingTop: 5
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },
  requestcontainer: {
    flex: 1
  },
  headertext: {
    alignItems: 'center',
    paddingLeft: 10,
    opacity: 0.5,
    fontSize: 20,
    borderTopColor: 'grey',
    borderTopWidth: 1,
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
    paddingVertical: 10
  },
  flatlist_render: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10
  }
});

export default FriendRequests;
