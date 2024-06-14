import { Stack } from "expo-router";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import All from './all';
import NUS from './nus';
import DietPlan from './dietplan';

const Tab = createMaterialTopTabNavigator();

const FoodDiaryLayout = () => {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="updatediary"/>
        </Stack>
    )
}

export default FoodDiaryLayout;
