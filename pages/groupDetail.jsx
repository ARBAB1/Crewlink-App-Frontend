import { useNavigation } from "@react-navigation/native";
import React from "react";
import { KeyboardAvoidingView, Platform, SafeAreaView, StatusBar, StyleSheet, useColorScheme } from "react-native";
import { useHeaderHeight } from '@react-navigation/elements';
import { global } from "../components/constant";
import { ScrollView } from "react-native";


const groupDetail = () => {
    const navigation = useNavigation();
    const headerHeight = useHeaderHeight();
    const scheme = useColorScheme();

    const styles = StyleSheet.create({

    })

    return (

        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ flexGrow: 1 }}
            keyboardVerticalOffset={
                Platform.OS === 'ios' ? headerHeight + StatusBar.currentHeight : 0
            }>

            <SafeAreaView style={{ flex: 1, backgroundColor: global.white }}>
                <StatusBar
                    backgroundColor={global.white}
                    barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
                />
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, backgroundColor: global.red }}
                >

                </ScrollView>
            </SafeAreaView>
        </KeyboardAvoidingView>
    )
}

export default groupDetail;