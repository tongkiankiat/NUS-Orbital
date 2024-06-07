import { Stack } from "expo-router";

const loggedInLayout = () => {
    return (
        <Stack screenOptions={{headerShown:false}}>
            <Stack.Screen name="homescreen"/>
        </Stack>
    )
}

export default loggedInLayout;