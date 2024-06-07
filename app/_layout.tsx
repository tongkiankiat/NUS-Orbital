import { Stack } from "expo-router";

const RootLayout = () => {
    return (
        <Stack>
            <Stack.Screen name="(loggedIn)" options={{headerShown:false}}/>
            <Stack.Screen name="(loggedOut)" options={{headerShown:false}}/>
        </Stack>
    )
}

export default RootLayout;