import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Dimensions, Pressable } from "react-native"
import { global, ResponsiveSize } from "../constant";
import { TouchableOpacity } from "react-native-gesture-handler";
import Feather from 'react-native-vector-icons/Feather'


const TextInputC = ({ placeholder, error, onChangeText, multiline, value, numberOfLines, height, textAlignVertical, style, disable, secureTextEntry }) => {
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    const styles = StyleSheet.create({
        Input: {
            fontSize: ResponsiveSize(11),
            paddingHorizontal: global.inputPaddingH,
            backgroundColor: "#EEEEEE",
            width: global.inputWidth,
            fontFamily: 'Montserrat-Regular',
            height: height ? height : global.inputHeight,
            color: global.black,
            borderRadius: ResponsiveSize(30),
            borderWidth: 1,
            textAlignVertical: textAlignVertical,
            ...style,
            ...(error === undefined ? { borderColor: global.description } : { borderColor: 'red' })
        },
    })
    const [isSecure, setIsSecure] = useState(true)

    return (
        <>
            <View style={{paddingTop:ResponsiveSize(15)}}>
                <View style={{ position: 'relative' }}>
                    <TextInput editable={!disable} multiline={multiline} secureTextEntry={secureTextEntry == true ? isSecure : secureTextEntry} numberOfLines={numberOfLines} onChangeText={onChangeText} value={value} style={styles.Input} placeholder={placeholder} placeholderTextColor={global.placeholderColor} />
                    {secureTextEntry == true ?
                        <Pressable onPress={() => setIsSecure(!isSecure)} style={{ position: 'absolute', zIndex: 99, height: windowHeight * 0.07, width: windowWidth * 0.10, right: 10, top: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Feather name={isSecure ? "eye-off" : "eye"} size={ResponsiveSize(12)} color={'black'} />
                        </Pressable>
                        : ""
                    }
                </View>
            </View>
        </>
    )
}

export default TextInputC;