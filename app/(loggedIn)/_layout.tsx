import { Tabs } from "expo-router";
import Entypo from '@expo/vector-icons/Entypo';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';

const loggedInLayout = () => {
    return (
        <Tabs screenOptions={{headerShown:false, tabBarActiveTintColor:'blue'}}>
            <Tabs.Screen name="Home" options={{tabBarIcon: ({color, size}) => (
                <Entypo name="home" size={24} color="black" />
            )}}/>
            <Tabs.Screen name="Diary" options={{tabBarIcon: ({color, size}) => (
                <MaterialCommunityIcons name="silverware-fork-knife" size={24} color="black" />
            )}}/>
            <Tabs.Screen name="Workout" options={{tabBarIcon: ({color, size}) => (
                <FontAwesome6 name="dumbbell" size={24} color="black" />
            )}}/>
            <Tabs.Screen name="Friends" options={{tabBarIcon: ({color, size}) => (
                <FontAwesome5 name="user-friends" size={24} color="black" />
            )}}/>
            <Tabs.Screen name="Rewards" options={{tabBarIcon: ({color, size}) => (
                <MaterialCommunityIcons name="ticket-percent" size={24} color="black" />
            )}}/>
        </Tabs>
    )
}

export default loggedInLayout;