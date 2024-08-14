import { View, StyleSheet, TouchableOpacity, Text, ActivityIndicator, FlatList } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import SharedHeader from '../components/sharedheader';
import WebView from 'react-native-webview';

const MainScreen = () => {
  // Define useState variables here
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [renderScreen, setRenderScreen] = useState(false);

  useEffect(() => {
    if (data.length >= 0) {
      setRenderScreen(true);
    };
  }, [data]);

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
      return '#FFD700';
    } else {
      return 'green';
    }
  };

  return (
    <View style={styles.container}>
      <SharedHeader />
      {renderScreen ?
        <View style={styles.contentContainer}>
          <Text style={styles.headerText}>NUS Gyms</Text>
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
        </View> :
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E4FBFF',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E4FBFF'
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingBottom: 20,
    textAlign: 'center',
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
  }
});

export default MainScreen;
