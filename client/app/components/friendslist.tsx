import { View, Text, StyleSheet, Dimensions, Alert, TouchableOpacity, FlatList } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { UsernameContext } from '../context/UsernameContext';

// Define screen dimensions here
const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

const FriendsList = () => {
  // Get username from useContext
  const username = useContext(UsernameContext);

  // Define useState variables here
  const [loading, setLoading] = useState(false);
  const [friendsList, setFriendsList] = useState<string[]>([]);
  const [isWorkingOut, setIsWorkingOut] = useState(false);
  const [time, setTime] = useState(0);
  const [timer, setTimer] = useState(null);
  const [blogPosts, setBlogPosts] = useState<any>([]);

  // Variable to re-render screen in focus
  const isFocused = useIsFocused();

  useEffect(() => {
    const subscription = supabase.channel('blog_posts').on('postgres_changes', { event: '*', schema: 'public', table: 'blog_posts' }, fetchBlogPosts).subscribe();

    return () => { subscription.unsubscribe() };
  }, [blogPosts, isFocused]);

  const fetchBlogPosts = async () => {
    try {
      const currentDate = new Date().toISOString().split('T')[0];
      console.log(currentDate)
      const { data, error } = await supabase.from('blog_posts')
      .select('*')
      .in('username', friendsList)
      .gte('created_at', `${currentDate}T00:00:00+00:00`)
      .lt('created_at', `${currentDate}T23:59:59+00:00`)
      .order('created_at', { ascending: false });
      if (error) {
        console.error('Error fetching blog posts: ', error);
      } else if (data) {
        setBlogPosts(data);
      };
    } catch (error) {
      console.error('Error fetching blog posts: ', error);
    } finally {
      setLoading(false);
    };
  };

  useEffect(() => {
    fetchBlogPosts();
  }, [isFocused]);

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
        console.log(data[0].friends.concat(username))
        setFriendsList(data[0].friends.concat(username));
      }
    } catch (error) {
      console.error('Error getting friends list: ', error);
    } finally {
      setLoading(false);
    };
  };

  useEffect(() => {
    getFriendsList();
  }, [isFocused]);

  const startWorkingOut = async () => {
    setIsWorkingOut(true);
    setTimer(setInterval(() => {
      setTime(prevTime => prevTime + 1);
    }, 1000));

    const user = await supabase.auth.getUser();
    if (!user) {
      console.error('No such user!');
      return;
    };
    const uuid = user.data.user?.id;
    setLoading(true);
    try {
      const { error: usersError } = await supabase.from('users').update({ 'working_out': isWorkingOut }).eq('id', uuid);
      const { error: blogError } = await supabase.from('blog_posts').insert({ 'id': uuid, 'post': `${username} started working out !`, 'username': username })
      if (usersError || blogError) {
        Alert.alert('Error: ', usersError?.message || blogError?.message);
      };
    } catch (error) {
      console.error('Error updating working_out state: ', error);
    } finally {
      setLoading(false);
    };
  };

  const stopWorkout = async () => {
    setIsWorkingOut(false);
    clearInterval(timer);
    setTime(0);

    const user = await supabase.auth.getUser();
    if (!user) {
      console.error('No such user!');
      return;
    };
    const uuid = user.data.user?.id;
    setLoading(true);
    try {
      const { error: usersError } = await supabase.from('users').update({ 'working_out': isWorkingOut }).eq('id', uuid);
      const { error: blogError } = await supabase.from('blog_posts').insert({ 'id': uuid, 'post': `${username} finished working out ! Duration of workout: ${time} seconds.`, 'username': username });
      if (usersError || blogError) {
        Alert.alert('Error: ', usersError?.message || blogError?.message);
      };
    } catch (error) {
      console.error('Error updating working_out state: ', error);
    } finally {
      setLoading(false);
    };
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const renderPost = ({ item }: { item: any }) => {
    const { created_at, post } = item;
    const formattedTime = formatDate(created_at);
    
    return (
      <View style={styles.blogPostContainer}>
        <Text style={styles.blogPostTime}>{formattedTime}</Text>
        <Text style={styles.blogPostEvent}>{post}</Text>
      </View>
    );
  };

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
        data={friendsList.filter(user => user !== username)}
        renderItem={renderUser}
        style={styles.flatlist}
        ItemSeparatorComponent={() => {
          return (
            <View style={styles.separator} />
          )
        }}
      />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderTopColor: 'black', borderTopWidth: 1 }}>
        <View style={styles.blogContainer}>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity onPress={isWorkingOut ? stopWorkout : startWorkingOut} style={isWorkingOut ? styles.workoutButton_stop : styles.workoutButton_start}>
              <Text style={styles.workoutButtonText}>{isWorkingOut ? 'Stop Workout' : 'Start Workout'}</Text>
            </TouchableOpacity>
            <Text style={styles.timerText}>{`Timer: ${String(Math.floor(time / 3600)).padStart(2, '0')}:${String(Math.floor((time % 3600) / 60)).padStart(2, '0')}:${String(time % 60).padStart(2, '0')}`}</Text>
          </View>
          <FlatList
            data={blogPosts}
            renderItem={renderPost}
            keyExtractor={(item, index) => item.post_id.toString()}
          />
        </View>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E4FBFF',
  },
  flatlist: {
    flex: 1,
    paddingTop: 5,
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
    paddingHorizontal: 20,
  },
  workoutButton_start: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  workoutButton_stop: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  workoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  timerText: {
    textAlign: 'center',
    alignSelf: 'center',
    paddingHorizontal: 10,
    fontSize: 18,
  },
  blogContainer: {
    flex: 1,
    padding: 10,
  },
  blogPostContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderColor: '#ddd',
    borderWidth: 1,
    flex: 1
  },
  blogPostTime: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  blogPostEvent: {
    fontSize: 16,
    color: '#333',
    flexWrap: 'wrap',
    flex: 1
  },
});

export default FriendsList;