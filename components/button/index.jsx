import React from "react";
import { StyleSheet, Text, TouchableOpacity, ActivityIndicator, Dimensions } from "react-native"
import { ResponsiveSize } from "../constant";
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ButtonC = ({ title, bgColor, TextStyle, BtnStyle, loading, onPress, IsImage, disabled, onpress2}) => {
    const style = StyleSheet.create({
        button: {
            backgroundColor: bgColor,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: ResponsiveSize(30),
            height: windowHeight * 0.07,
            width:windowWidth * 0.5,  
            ...BtnStyle,
        },
        btnText: {
            fontFamily: 'Montserrat-Bold',
            fontSize: ResponsiveSize(13),
            ...TextStyle
        }
    })
    return (
        <>
            <TouchableOpacity onPress={onPress} disabled={disabled} style={style.button} onPressIn={onpress2}>
                {loading ?
                    <ActivityIndicator style={style.btnText} size={ResponsiveSize(20)} color="white" />
                    :
                    <Text style={style.btnText}>{title}</Text>
                }
            </TouchableOpacity>
        </>
    )
}

export default ButtonC;
