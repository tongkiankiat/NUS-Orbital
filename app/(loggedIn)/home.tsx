import { View, StyleSheet, StatusBar, TouchableOpacity, Text } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { router } from 'expo-router';
import { supabase } from '../../lib/supabase';
import SharedHeader from '../components/sharedheader';
import WebView from 'react-native-webview';

const MainScreen = () => {

  // read data for NUS gym capacity
  const [data, setData] = useState([]);
  const webViewRef = useRef(null);

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
    // Initial load
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

  return (
    <View style={styles.container}>
      <SharedHeader />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderBottomColor: 'black', borderBottomWidth: 1 }}>
        <Text>Social Corner (WIP!)</Text>
      </View>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={styles.headerText}>NUS Gym Crowdedness</Text>
        {data.map((gym, index) => (
          <View key={index} style={styles.gymContainer}>
            <Text style={styles.gymName}>{
              index === 0 ? 'KR Gym' : index === 1 ? 'USC Gym' : 'UTown Gym'
            }</Text>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E4FBFF',
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
});

export default MainScreen;
