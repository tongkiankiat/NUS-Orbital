import { Stack } from 'expo-router';

const loggedInLayout = () => {
    return (
        <Stack screenOptions={{headerShown:false}}>
            <Stack.Screen name='loginscreen'/>
            <Stack.Screen name='registerscreen'/>
            <Stack.Screen name='registrationdetails'/>
        </Stack>
    )
}

export default loggedInLayout;