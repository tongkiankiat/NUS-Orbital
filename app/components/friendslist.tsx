import { View, Text, StyleSheet, Dimensions, Alert, TouchableOpacity, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';

// Define screen dimensions here
const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

const FriendsList = () => {
  // Define useState variables here
  const [loading, setLoading] = useState(false);
  const [friendsList, setFriendsList] = useState<string[]>([]);

  // Variable to re-render screen in focus
  const isFocused = useIsFocused();

  // Function to retrieve friends list. Put this in backend when importing over to main app code
  const getFriendsList = async () => {
    setLoading(true);
    const user = await supabase.auth.getUser();
    if (!user) {
      console.error('No such user!');
      return;
    };
    const uuid = user.data.user?.id;

    try {
      const { data, error } = await supabase.from('social').select('friends').eq('id', uuid);
      if (error) {
        Alert.alert('Error getting friends list: ', error.message);
      } else if (data) {
        setFriendsList(data[0].friends);
      }
    } catch (error) {
      console.error('Error getting friends list: ', error);
    } finally {
      setLoading(false);
    };
  };

  useEffect(() => {
    getFriendsList();
  }, [isFocused === true]);

  const renderUser = ({ item }) => {
    return (
      <View style={styles.renderUser}>
        <Text>{item}</Text>
        <TouchableOpacity>
          <Ionicons name="reorder-three-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={friendsList}
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
  flatlist: {
    flex: 1,
    paddingTop: 5
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },
  renderUser: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20
  }
});

export default FriendsList;