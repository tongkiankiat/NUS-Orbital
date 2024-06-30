import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '../../lib/supabase';
import dayjs from 'dayjs';
import utc from '../../node_modules/dayjs/plugin/utc';
import timezone from '../../node_modules/dayjs/plugin/timezone';
import * as Notifications from 'expo-notifications';
import { FontAwesome5, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import Constants from 'expo-constants';
import SharedHeader from '../components/sharedheader';
import { VictoryPie } from 'victory-native';

// Add timezone and utc plugin for dayjs for Singapore timezone
dayjs.extend(utc);
dayjs.extend(timezone);

// Define window dimensions here
const windWidth = Dimensions.get('window').width;
const windHeight = Dimensions.get('window').height;

// meal times array
const meals = ['Breakfast', 'Lunch', 'Dinner'];

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
      title: 'NUtriSync',
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
  // Define useState variables
  const [loading, setLoading] = useState(false);
  const [meal_time_array, setMealTimeArray] = useState<string[]>([]);
  const [breakfast, setBreakfast] = useState(false);
  const [lunch, setLunch] = useState(false);
  const [dinner, setDinner] = useState(false);
  const [caloricGoal, setCaloricGoal] = useState(0);
  const [consumedcalories, setConsumed] = useState(0);

  // this function retrieves meal times from db, and also checks whether the meals of the day have been logged
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

      // This retrieves meal times
      const { data: mealTimes, error: getError } = await supabase.from('users').select('breakfast_time, lunch_time, dinner_time').eq('id', uuid);
      if (getError) {
        Alert.alert('Error occured retrieving meal times: ', getError.message);
      } else if (mealTimes) {
        setMealTimeArray(Object.values(mealTimes[0]));
      };
      // This checks if meals have been logged
      const { data: LoggedMeals, error: getError_log } = await supabase.from('meals').select('meal_time').eq('id', uuid).eq('date', new Date().toISOString().split('T')[0])
      if (getError_log) {
        Alert.alert('Error occured retrieving meal times: ', getError_log.message);
      } else if (LoggedMeals) {
        LoggedMeals.forEach((meal) => {
          if (meal.meal_time === 'Breakfast') setBreakfast(true);
          if (meal.meal_time === 'Lunch') setLunch(true);
          if (meal.meal_time === 'Dinner') setDinner(true);
        });
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

  // example data format: ['09:00', '17:00', '12:00'}]

  // Check for next meal
  const updateMeal = () => {
    const now = dayjs();
    const now_sg = now.utc(8);
    let nextMealIndex = meal_time_array.findIndex(time => {
      const [hour, minute] = time.split(':').map(Number);
      const mealTime = now_sg.hour(hour).minute(minute).second(0);
      return mealTime.isAfter(now_sg);
    });

    // If last meal (Dinner) is already over, set next meal to Breakfast
    if (nextMealIndex === -1) {
      nextMealIndex = 0;
    };
    return nextMealIndex;
  }

  useEffect(() => {
    updateMeal();
  }, []);

  const [meal_index, setIndex] = useState(0);
  const [nextmeal, setNextMeal] = useState('');

  useEffect(() => {
    if (meal_time_array.length > 0) {
      const initialMealIndex = updateMeal();
      setIndex(initialMealIndex);
      setNextMeal(meals[initialMealIndex]);
    }
  }, [meal_time_array]);

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
      const now = dayjs();
      const now_sg = now.utc(8);
      if (!targetTime) {
        return;
      };
      if (now_sg.format('HH:mm:ss') === '00:00:00') {
        setIndex(0);
      };
      const interval = setInterval(() => {
        const newTimeLeft = calculateTimeLeft();
        setTimeleft(newTimeLeft);
        if (newTimeLeft <= 0) {
          const newIndex = (updateMeal() + 1) % meal_time_array.length;
          generateNotification(meals[newIndex]);
          setIndex(newIndex);
          setNextMeal(meals[newIndex]);
        }
      }, 1000); // updates the timer countdown every second (1000 milliseconds)

      return () => clearInterval(interval);

    }, [targetTime]);

    return (
      <Text style={{ textAlign: 'center' }}>{convertMstoTime(timeleft)}</Text>
    );
  };

  // Calculate Calorie Goals based on biometrics and active level
  const Calc_Goal = async () => {
    const user = await supabase.auth.getUser();
    if (!user) {
      console.error('No such user!');
      return;
    };
    const uuid = user.data.user?.id;
    setLoading(true);

    try {
      const { data: userData, error } = await supabase.from('users').select('height, weight, age, active_level').eq('id', uuid).single();
      if (error) {
        Alert.alert('Error occured: ', error.message);
      } else if (userData) {
        const { weight, height, age, active_level } = userData;
        const BMR = 10 * weight + 6.25 * height - 5 * age + 5;
        let multiplier;
        if (active_level === 1) {
          multiplier = 1.2;
        } else if (active_level === 2) {
          multiplier = 1.375;
        } else {
          multiplier = 1.55;
        };
        setCaloricGoal(Math.ceil(BMR * multiplier));
      }
    } catch (error) {
      console.error('Error occured: ', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Calc_Goal();
  }, []);

  // Calculate calories consumed for the day
  const Calc_Consumed = async () => {
    const user = await supabase.auth.getUser();
    if (!user) {
      console.error('No such user!');
      return;
    };
    const uuid = user.data.user?.id;
    setLoading(true);

    try {
      const { data: meals, error } = await supabase.from('meals').select('meal').eq('id', uuid).eq('date', new Date().toISOString().split('T')[0]);
      if (error) {
        Alert.alert('Error occured retrieving calories: ', error.message);
      } else if (meals && meals.length > 0) {
        let totalCalories = 0;
        meals.forEach(meal => {
          const calories = meal.meal.calories;
          totalCalories += calories;
        });
        setConsumed(totalCalories);
      }
    } catch (error) {
      console.error('Error occured: ', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Calc_Consumed();
  }, []);

  // Button Checklist Component
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
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push({
              pathname: '../(fooddiaryscreens)/updatediary', params: {
                meal_time: nextmeal
              }
            })}>
            <Text style={{ textAlign: 'center' }}>{nextmeal}</Text>
            <CountdownTimer targetTime={meal_time_array[meal_index]} />
          </TouchableOpacity>
        </View>
        <View style={styles.roundedbackground_checklist}>
          <View style={{ flexDirection: 'column', justifyContent: 'space-evenly', flex: 1, width: 130 }}>
            <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between', alignItems: 'center', paddingRight: 5 }}>
              <TouchableOpacity onPress={() => router.push('../components/view_meal')}>
                <Text>Breakfast</Text>
              </TouchableOpacity>
              {breakfast === true ? (
                <AntDesign name="checkcircle" size={24} color="green" />
              ) : (
                <AntDesign name="closecircle" size={24} color="red" />
              )}
            </View>
            <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between', alignItems: 'center', paddingRight: 5 }}>
              <TouchableOpacity onPress={() => router.push('../components/view_meal')}>
                <Text>Lunch</Text>
              </TouchableOpacity>
              {lunch === true ? (
                <AntDesign name="checkcircle" size={24} color="green" />
              ) : (
                <AntDesign name="closecircle" size={24} color="red" />
              )}
            </View>
            <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between', alignItems: 'center', paddingRight: 5 }}>
              <TouchableOpacity onPress={() => router.push('../components/view_meal')}>
                <Text>Dinner</Text>
              </TouchableOpacity>
              {dinner === true ? (
                <AntDesign name="checkcircle" size={24} color="green" />
              ) : (
                <AntDesign name="closecircle" size={24} color="red" />
              )}
            </View>
            <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between', alignItems: 'center', paddingRight: 5 }}>
              <TouchableOpacity onPress={() => router.push('../components/view_meal')}>
                <Text>Snacks</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push({ pathname: '../(fooddiaryscreens)/updatediary', params: { meal_time: 'Snacks' } })}>
                <AntDesign name="pluscircle" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    )
  };

  // pie chart size to be 180

  const Calorie_tracker = () => {

    const consumedPercentage = (consumedcalories / caloricGoal) * 100;
    const remainingPercentage = 100 - consumedPercentage;

    return (
      <View style={styles.roundedbackground_piechart}>
        <Text style={{ textAlign: 'center' }}>Calorie Tracker</Text>
        <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', width: windWidth - 100 }}>
          <View>
            {loading ? (
              <Text>Loading...</Text>
            ) : (
              <View style={styles.pieChartContainer}>
                <View style={[styles.pieSlice, { backgroundColor: 'tomato', flex: consumedPercentage }]} />
                <View style={[styles.pieSlice, { backgroundColor: 'orange', flex: remainingPercentage }]} />
              </View>
            )}
          </View>
          <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'space-evenly', width: 200, height: 180 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', width: 90 }}>
              <MaterialCommunityIcons name='silverware-fork-knife' size={14} color='black' />
              <Text style={{ fontSize: 14, textAlign: 'center' }}>Consumed:</Text>
            </View>
            <View style={{ flexDirection: 'column' }}>
              <Text>{consumedcalories}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', width: 60 }}>
              <FontAwesome5 name='flag-checkered' size={14} color='black' />
              <Text style={{ fontSize: 14, textAlign: 'center' }}>Goal:</Text>
            </View>
            <View style={{ flexDirection: 'column' }}>
              <Text>{caloricGoal}</Text>
            </View>
          </View>
        </View>
      </View>
    )
  };

  return (
    <View style={styles.container}>
      <SharedHeader />
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
    backgroundColor: '#E4FBFF'
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
  },
  pieChartContainer: {
    flexDirection: 'row',
    width: '80%',
    height: 200,
    borderRadius: 100,
    overflow: 'hidden',
  },
  pieSlice: {
    height: '100%',
  },
  piechartlabel: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UpdateDiary;