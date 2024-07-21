import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';

const RootLayout = () => {
    // const [loading, setLoading] = useState(true);

    // const { user } = useAuth();

    // if (loading) {
    //     return (
    //         <View style={styles.loadingContainer}>
    //             <ActivityIndicator size='large' color='#0000ff' />
    //         </View>
    //     );
    // }
    // return (
    //     <Stack screenOptions={{headerShown:false}}>
    //         {user ? (
    //             <Stack.Screen name='(loggedIn)' options={{ headerShown: false }} />
    //         ) : (
    //             <Stack.Screen name='(loggedOut)' options={{ headerShown: false }} />
    //         )}
    //     </Stack>
    // );
    return (
        <Stack screenOptions={{headerShown:false}}>
            <Stack.Screen name='index' options={{headerShown:false}}/>
        </Stack>
    )
};

export default RootLayout;