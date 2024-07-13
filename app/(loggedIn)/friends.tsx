import { View, StyleSheet, Dimensions, Text, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import SharedHeader from '../components/sharedheader';
import FindFriends from '../components/findfriends';
import FriendsList from '../components/friendslist';
import FriendRequests from '../components/friendrequests';
import { supabase } from '../../lib/supabase';
import { FriendRequestsContext } from '../context/FriendRequestsContext';
import { PendingRequestsContext } from '../context/PendingRequestsContext';
import { useFocusEffect } from 'expo-router';

// Define screen dimensions here
const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

const Tab = createMaterialTopTabNavigator();

// Define new component for the Badge Icons
const Badge = ({ badgeCounter_incoming, badgeCounter_pending }) => {
  return (
    <View>
      {badgeCounter_incoming > 0 && (
        <View style={styles.badgeContainer_incoming}>
          {badgeCounter_incoming > 0 ? <Text style={styles.badgeText}>{badgeCounter_incoming}</Text> : undefined}
        </View>
      )}
      {badgeCounter_pending > 0 && (
        <View style={styles.badgeContainer_pending}>
          {badgeCounter_pending > 0 ? <Text style={styles.badgeText}>{badgeCounter_pending}</Text> : undefined}
        </View>
      )}
    </View>
  );
};

const Friends = () => {
  // Define useState variables
  const [loading, setLoading] = useState(false);
  const [friendRequests, setFriendRequests] = useState<string[]>([]);
  const [pendingRequests, setPendingRequests] = useState<string[]>([]);

  // Get Incoming Friend Requests and Pending Friend Requests
  const getRequests = async () => {
    setLoading(true);
    const user = await supabase.auth.getUser();
    if (!user) {
      console.error('No such user!');
      return;
    };
    const uuid = user.data.user?.id;

    try {
      const { data: incomingRequests, error: addincomingError } = await supabase.from('social').select('friend_requests').eq('id', uuid);
      const { data: pendingRequests, error: addPendingError } = await supabase.from('social').select('pending_requests').eq('id', uuid);
      if (addincomingError) {
        Alert.alert('Error getting friend requests: ', addincomingError.message);
      } if (addPendingError) {
        Alert.alert('Error getting pending friend requests: ', addPendingError.message);
      } else if (incomingRequests) {
        setFriendRequests(incomingRequests[0].friend_requests);
      } if (pendingRequests) {
        setPendingRequests(pendingRequests[0].pending_requests);
      }
    } catch (error) {
      console.error('Error getting requests: ', error);
    } finally {
      setLoading(false);
    };
  };

  useEffect(() => {
    getRequests();
  }, []);

  const badgeCounter_incoming = friendRequests.length;
  const badgeCounter_pending = pendingRequests.length;

  return (
    <FriendRequestsContext.Provider value={{ friendRequests, setFriendRequests }}>
      <PendingRequestsContext.Provider value={{ pendingRequests, setPendingRequests }}>
        <View style={styles.container}>
          <SharedHeader />
          <Tab.Navigator
            screenOptions={{
              tabBarStyle: { backgroundColor: "#E4FBFF" },
            }}
          >
            <Tab.Screen name="Friends" component={FriendsList} />
            <Tab.Screen name="Find Friends" component={FindFriends} />
            <Tab.Screen
              name="Friend Requests"
              component={FriendRequests}
              options={{
                tabBarBadge: () => (<Badge badgeCounter_incoming={badgeCounter_incoming} badgeCounter_pending={badgeCounter_pending} />)
              }}
            />
          </Tab.Navigator>
        </View>
      </PendingRequestsContext.Provider>
    </FriendRequestsContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E4FBFF',
  },
  badgeContainer_incoming: {
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 2,
    right: 2
  },
  badgeContainer_pending: {
    backgroundColor: 'grey',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 2,
    right: 115
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default Friends;
