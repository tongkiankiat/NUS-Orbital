import { View, StyleSheet, TouchableOpacity, Text, ActivityIndicator, Alert, FlatList, StatusBar } from 'react-native';
import React, { useState, useRef, useEffect, useContext } from 'react';
import SharedHeader from '../components/sharedheader';
import WebView from 'react-native-webview';
import { supabase } from '../../lib/supabase';
import { UsernameContext } from '../context/UsernameContext';

const MainScreen = () => {
  // Get username from useContext
  const username = useContext(UsernameContext);

  // Define useState variables here
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [renderScreen, setRenderScreen] = useState(false);
  const [isWorkingOut, setIsWorkingOut] = useState(false);
  const [time, setTime] = useState(0);
  const [timer, setTimer] = useState(null);
  const [blogPosts, setBlogPosts] = useState<any>([]);

  useEffect(() => {
    const subscription = supabase.channel('blog_posts').on('postgres_changes', { event: '*', schema: 'public', table: 'blog_posts' }, fetchBlogPosts).subscribe();

    return () => { supabase.removeChannel(subscription); };
  }, []);

  const fetchBlogPosts = async () => {
    try {
      const { data, error } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
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

  const webViewRef = useRef(null);

  // Retrieve data on NUS gyms
  const fetchCapacity = () => {
    webViewRef.current?.reload();
  };

  const injectedJavaScript = `
    (function() {
      const gyms = [];
      const gymElements = document.querySelectorAll('.gymbox');

      gymElements.forEach(gymElement => {
        const capacityText = gymElement.querySelector('b').innerText;
        const currentCount = parseInt(capacityText.split('/')[0], 10);
        const maxCapacity = parseInt(capacityText.split('/')[1], 10);
        const crowdedness = currentCount / maxCapacity;

        gyms.push({
          currentCount: currentCount,
          maxCapacity: maxCapacity,
          crowdedness: crowdedness
        });
      });

      window.ReactNativeWebView.postMessage(JSON.stringify(gyms));
    })();
  `;

  const handleMessage = (event: any) => {
    const scrapedData = JSON.parse(event.nativeEvent.data);
    setData(scrapedData);
  };

  useEffect(() => {
    fetchCapacity();
  }, []);

  const renderCrowdednessColor = (crowdedness: any) => {
    if (crowdedness >= 0.75) {
      return 'red';
    } else if (crowdedness >= 0.5) {
      return 'yellow';
    } else {
      return 'green';
    }
  };

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
      const { error: blogError } = await supabase.from('blog_posts').insert({ 'id': uuid, 'post': `${username} started working out !` })
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
      const { error: blogError } = await supabase.from('blog_posts').insert({ 'id': uuid, 'post': `${username} finished working out ! Duration of workout: ${time} seconds.` });
      if (usersError || blogError) {
        Alert.alert('Error: ', usersError?.message || blogError?.message);
      };
    } catch (error) {
      console.error('Error updating working_out state: ', error);
    } finally {
      setLoading(false);
    };
  }

  const renderPost = (item: any) => {
    return (
      <View>
        <Text key={item.item.post_id} style={styles.blogPost}>{item.item.post}</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <SharedHeader />
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderBottomColor: 'black', borderBottomWidth: 1 }}>
          <View style={styles.blogContainer}>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity onPress={isWorkingOut ? stopWorkout : startWorkingOut} style={isWorkingOut ? styles.workoutButton_stop : styles.workoutButton_start}>
                <Text style={styles.workoutButtonText}>{isWorkingOut ? 'Stop Workout' : 'Start Workout'}</Text>
              </TouchableOpacity>
              {isWorkingOut && <Text style={styles.timerText}>{`Duration: ${Math.floor(time / 60)}:${time % 60}`}</Text>}
            </View>
            <FlatList
              data={blogPosts}
              renderItem={renderPost}
              keyExtractor={(item, index) => item.post_id.toString()}
            />
          </View>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={styles.headerText}>NUS Gym Crowdedness</Text>
          {data.map((gym, index) => (
            <View key={index} style={styles.gymContainer}>
              <Text style={styles.gymName}>
                {index === 0 ? 'KR Gym' : index === 1 ? 'USC Gym' : 'UTown Gym'}
              </Text>
              <Text style={[styles.crowdedness, { color: renderCrowdednessColor(gym.crowdedness) }]}>
                {`${gym.currentCount} / ${gym.maxCapacity}`}
              </Text>
            </View>
          ))}
          <TouchableOpacity onPress={fetchCapacity} style={styles.refreshButton}>
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
          <WebView
            ref={webViewRef}
            source={{ uri: 'https://reboks.nus.edu.sg/nus_public_web/public/index.php/facilities/capacity' }}
            onMessage={handleMessage}
            injectedJavaScript={injectedJavaScript}
            javaScriptEnabled
            style={{ display: 'none' }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E4FBFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  gymContainer: {
    marginBottom: 15,
    alignItems: 'center',
  },
  gymName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  crowdedness: {
    fontSize: 18,
  },
  refreshButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  workoutButton_start: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  workoutButton_stop: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  workoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  timerText: {
    textAlign: 'center',
    alignSelf: 'center',
    paddingHorizontal: 10
  },
  blogContainer: {
    flex: 1,
    padding: 10,
  },
  blogPost: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default MainScreen;
