import React from "react";
import {
    DarkTheme,
    SafeAreaView,
    ScrollView,
    StatusBar,
    useColorScheme,
} from "react-native";
import { global } from "../components/constant";

const Notification = () => {
    const scheme = useColorScheme();
    return (
        <>
            <SafeAreaView style={{ flex: 1 }}>
                <StatusBar
                    backgroundColor={
                        scheme === 'dark' ? DarkTheme.colors.background : 'white'
                    }
                    barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
                />
                <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: global.white }}>

                </ScrollView>
            </SafeAreaView>
        </>
    )
}
export default Notification;