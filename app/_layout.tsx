import { Stack } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import useAuth from "../hooks/useAuth";

const RootLayout = () => {
    // const [loading, setLoading] = useState(true);

    // const { user } = useAuth();

    // if (loading) {
    //     return (
    //         <View style={styles.loadingContainer}>
    //             <ActivityIndicator size="large" color="#0000ff" />
    //         </View>
    //     );
    // }
    // return (
    //     <Stack screenOptions={{headerShown:false}}>
    //         {user ? (
    //             <Stack.Screen name="(loggedIn)" options={{ headerShown: false }} />
    //         ) : (
    //             <Stack.Screen name="(loggedOut)" options={{ headerShown: false }} />
    //         )}
    //     </Stack>
    // );
    return (
        <Stack screenOptions={{headerShown:false}}>
            <Stack.Screen name="index" options={{headerShown:false}}/>
        </Stack>
    )
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default RootLayout;