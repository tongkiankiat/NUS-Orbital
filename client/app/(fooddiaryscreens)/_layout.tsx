import { Stack } from "expo-router";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

const FoodDiaryLayout = () => {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="updatediary"/>
        </Stack>
    )
}

export default FoodDiaryLayout;
