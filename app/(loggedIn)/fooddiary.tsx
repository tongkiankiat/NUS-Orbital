import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '../../lib/supabase';
import dayjs from 'dayjs';
import * as Notifications from 'expo-notifications';
import { Feather, MaterialIcons, Entypo, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';

// Define window dimensions here
const windWidth = Dimensions.get('window').width;
const windHeight = Dimensions.get('window').height;

const returntohome = () => {
  router.push("/(loggedIn)/home");
};

// meal times array
const meals = ['Breakfast' , 'Lunch', 'Dinner'];

// Configure Notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// this function will send the notification to the user's device
const generateNotification = async (meal) => {
  Notifications.scheduleNotificationAsync({
    content: {
      title: "NUtriSync",
      body: `Time to log your ${meal} !`
    },
    trigger: null,
  });
};

// function to convert milliseconds to hh:mm:ss format to display
const convertMstoTime = (milliseconds: number) => {
  const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
  const seconds = Math.floor((milliseconds / (1000)) % 60);
  return (hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds);
};

const UpdateDiary = () => {

  // const [selectedValue, setSelectedValue] = useState('Breakfast');
  // const options = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];
  const [loading, setLoading] = useState(false);
  const [meal_time_array, setMealTimeArray] = useState<string[]>([])

  // retrieve meal times from db
  const getData = async () => {
    const user = await supabase.auth.getUser();
    const uuid = user.data.user?.id;
    setLoading(true);

    try {
      if (!user) {
        Alert.alert('No such user!');
        setLoading(false);
        return;
      }

      const { data, error: getError } = await supabase.from('users').select('breakfast_time, lunch_time, dinner_time').eq('id', uuid);
      if (getError) {
        Alert.alert('Error occured: ', getError.message);
      } else if (data) {
        setMealTimeArray(Object.values(data[0]));
      };
    } catch (error) {
      console.error('Error occured: ', error);
    } finally {
      setLoading(false);
      return;
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // sample data stored: ["09:00", "17:00", "12:00"}]

  // Check for next meal
  const now = dayjs();
  let nextMealIndex = meal_time_array.findIndex(time => {
    const [hour, minute] = time.split(':').map(Number);
    const mealTime = now.hour(hour).minute(minute).second(0);
    return mealTime.isAfter(now);
  });

  // Last meal (Dinner) is already over, set next meal to Breakfast
  if (nextMealIndex === -1) {
    nextMealIndex = 0;
  }

  const [meal_index, setIndex] = useState(nextMealIndex);
  const [nextmeal, setNextMeal] = useState(meals[nextMealIndex]);

  const CountdownTimer = ({ targetTime }) => {

    // function to calculate remaining time left to next meal
    const calculateTimeLeft = () => {
      if (!targetTime) {
        return 1;
      };

      // time is calculated and returned in milliseconds
      const now = new Date();
      const targetTime_split = targetTime.split(':');
      const target = new Date(now);
      const diff = target.setHours(Number(targetTime_split[0]), Number(targetTime_split[1]), 0) - now.getTime();
      return diff >= 0 ? diff : 24 * 60 * 60 * 1000 + diff;
    };

    const [timeleft, setTimeleft] = useState(calculateTimeLeft());

    useEffect(() => {
      if (!targetTime) {
        return;
      };
      if (dayjs().format('HH:mm:ss') === "00:00:00") {
        setIndex(0);
      };
      const interval = setInterval(() => {
        const newTimeLeft = calculateTimeLeft();
        setTimeleft(newTimeLeft);
        if (newTimeLeft <= 0) {
          generateNotification(meal_time_array[nextMealIndex]);
          setIndex((nextMealIndex + 1) % meal_time_array.length);
        }
      }, 1000);

      return () => clearInterval(interval);

    }, [targetTime]);

    return (
      <Text style={{ textAlign: 'center' }}>{convertMstoTime(timeleft)}</Text>
    );
  };

  const Button_checklist = () => {

    // Get push token from Expo to send notifications
    async function registerForPushNotificationsAsync() {
      let token;

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification');
        return;
      }

      token = (await Notifications.getExpoPushTokenAsync({ 'projectId': Constants.expoConfig?.extra?.eas.projectId })).data;

      return token;
    };

    useEffect(() => {
      registerForPushNotificationsAsync();
    }, []);

    return (
      <View style={styles.button_checklist}>
        <View style={styles.buttonheader}>
          <TouchableOpacity style={styles.button} onPress={() => router.push('../(fooddiaryscreens)/updatediary')}>
            <Text style={{ textAlign: 'center' }}>{nextmeal}</Text>
            <CountdownTimer targetTime={meal_time_array[meal_index]}/>
          </TouchableOpacity>
        </View>
        <View style={styles.roundedbackground_checklist}>
          <View style={{ flexDirection: 'column', justifyContent: 'space-evenly', flex: 1, width: 130 }}>
            <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between', alignItems: 'center', paddingRight: 5 }}>
              <Text>Breakfast</Text>
              <TouchableOpacity>
                <Text>View</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between', alignItems: 'center', paddingRight: 5 }}>
              <Text>Lunch</Text>
              <TouchableOpacity>
                <Text>View</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between', alignItems: 'center', paddingRight: 5 }}>
              <Text>Dinner</Text>
              <TouchableOpacity>
                <Text>View</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between', alignItems: 'center', paddingRight: 5 }}>
              <Text>Snacks</Text>
              <TouchableOpacity>
                <Text>View</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    )
  };

  // pie chart size to be 180

  const Calorie_tracker = () => {
    return (
      <View style={styles.roundedbackground_piechart}>
        <Text style={{ textAlign: 'center' }}>Calorie Tracker</Text>
        <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', width: windWidth - 100 }}>
          <Entypo name="circle" size={180} color="black" style={{ flex: 2 }} />
          <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'space-evenly', width: 200, height: 180 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', width: 60 }}>
              <FontAwesome5 name="flag-checkered" size={14} color="black" />
              <Text style={{ fontSize: 14, textAlign: 'center' }}>Goal:</Text>
            </View>
            <View style={{ flexDirection: 'column' }}>
              <Text>1000</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', width: 90 }}>
              <MaterialCommunityIcons name="silverware-fork-knife" size={14} color="black" />
              <Text style={{ fontSize: 14, textAlign: 'center' }}>Consumed:</Text>
            </View>
            <View style={{ flexDirection: 'column' }}>
              <Text>2000</Text>
            </View>
          </View>
        </View>
      </View>
    )
  };

  return (
    <View style={styles.container}>
      <View style={styles.header_navigate}>
        <TouchableOpacity style={styles.headerarrow} onPress={returntohome}>
          <Feather name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
        <Text style={styles.label}>Diary</Text>
      </View>
      <View style={styles.header}>
        <TouchableOpacity>
          <MaterialIcons name="keyboard-arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text>Today</Text>
        <TouchableOpacity>
          <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'space-evenly' }}>
        <Button_checklist />
        <Calorie_tracker />
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: "#E4FBFF"
  },
  header_navigate: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'black',
    paddingTop: StatusBar.currentHeight
  },
  header: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'black',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  label: {
    fontWeight: 'bold',
    justifyContent: 'center'
  },
  headerarrow: {
    paddingRight: 10
  },
  buttonheader: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  button: {
    width: 150,
    height: 150,
    borderRadius: 150,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'black'
  },
  button_checklist: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    height: 200,
    width: windWidth - 60,
    backgroundColor: 'white',
    borderRadius: 20,
  },
  roundedbackground_checklist: {
    backgroundColor: 'white',
    width: 150,
    height: 200,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  roundedbackground_piechart: {
    backgroundColor: 'white',
    width: windWidth - 60,
    height: 200,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default UpdateDiary;