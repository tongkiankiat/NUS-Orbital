import { Stack } from "expo-router";

const loggedInLayout = () => {
    return (
        <Stack>
            <Stack.Screen name="mainscreen"/>
        </Stack>
    )
}

export default loggedInLayout;