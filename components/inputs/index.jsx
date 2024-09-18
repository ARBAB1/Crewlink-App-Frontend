import React, { useState } from "react";
import { StyleSheet, TextInput, Text, View, TouchableOpacity, Dimensions } from "react-native";
import Feather from 'react-native-vector-icons/Feather'
import { global, ResponsiveSize } from "../constant";
import TextC from "../text/text";
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const InputC = ({ bgColor, secureTextEntry, placeholder, value, onChangeText, label, error, type, max }) => {
    const scale = windowWidth / 320;

    const style = StyleSheet.create({
        Input: {
            fontSize: ResponsiveSize(12),
            paddingHorizontal: global.inputPaddingH,
            backgroundColor: bgColor || '#FFFFFF',
            width: global.inputWidth,
            fontFamily: 'Montserrat-Regular',
            height: global.inputHeight,
            color: global.black,
            borderRadius: ResponsiveSize(30),
            borderWidth: ResponsiveSize(1),
            ...(error === undefined ? { borderColor: global.white } : { borderColor: 'red' })
        },
        labelS: {
            color: global.white,
            fontFamily: "Montserrat-Regular",
            fontSize: ResponsiveSize(11),
            paddingBottom: ResponsiveSize(4),
        },
    })

    const [isSecure, setIsSecure] = useState(true)
    return (
        <>
            <View>
                <View style={{ paddingHorizontal: ResponsiveSize(12) }}>
                    <TextC text={label} size={ResponsiveSize(11)} font={'Montserrat-Regular'} style={{ color: 'white', paddingBottom: ResponsiveSize(4) }} />
                </View>
                <View style={{ position: 'relative' }}>
                    <TextInput maxLength={max} theme={{ fonts: { fontFamily: "Montserrat-Regular" } }} keyboardType={type} value={value} onChangeText={onChangeText} style={style.Input} placeholder={placeholder} secureTextEntry={secureTextEntry == true ? isSecure : secureTextEntry} placeholderTextColor={global.placeholderColor} />
                    {secureTextEntry == true ?
                        <TouchableOpacity onPress={() => setIsSecure(!isSecure)} style={{ position: 'absolute', height: windowHeight * 0.07, width: windowWidth * 0.10, right: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Feather name={isSecure ? "eye-off" : "eye"} size={ResponsiveSize(12)} color={'black'} />
                        </TouchableOpacity>
                        : ""
                    }
                </View>
            </View>
        </>
    )
}


export default InputC;