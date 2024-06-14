import React from 'react';
import { Tabs } from "expo-router";
import Entypo from '@expo/vector-icons/Entypo';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';

const loggedInLayout = () => {
    return (
        <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: 'blue' }}>
            <Tabs.Screen 
                name="home" 
                options={{ tabBarIcon: ({ color, size }) => (
                    <Entypo name="home" size={24} color="black" />
                ), title: "Home" }}
            />
            <Tabs.Screen 
                name="fooddiary" 
                options={{ tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="silverware-fork-knife" size={24} color="black" />
                ), title: "Diary" }}
            />
            <Tabs.Screen 
                name="workout" 
                options={{ tabBarIcon: ({ color, size }) => (
                    <FontAwesome6 name="dumbbell" size={24} color="black" />
                ), title: "Workout" }}
            />
            <Tabs.Screen 
                name="friends" 
                options={{ tabBarIcon: ({ color, size }) => (
                    <FontAwesome5 name="user-friends" size={24} color="black" />
                ), title: "Friends" }}
            />
            <Tabs.Screen 
                name="rewards" 
                options={{ tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="ticket-percent" size={24} color="black" />
                ), title: "Rewards" }}
            />
        </Tabs>
    );
}

export default loggedInLayout;
