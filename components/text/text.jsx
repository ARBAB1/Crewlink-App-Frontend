import React from 'react'
import { StyleSheet, Text } from 'react-native'
import { DefaultTheme, DarkTheme } from '@react-navigation/native';
import { useColorScheme } from 'react-native';


const TextC = ({ text, size, font, style, isTime, ...props }) => {
    const scheme = useColorScheme();
    const styles = StyleSheet.create({
        text: {
            ...(scheme === 'dark' ? { color: DarkTheme.colors.text } : { color: "#05348E" }),
            fontFamily: font,
            fontSize: size,
            ...style
        }
    })
    return (
        <>
            {isTime ?
                <Text {...props} style={styles.text}>{`${text?.getHours()}:${text?.getMinutes()}`}</Text>
                :
                <Text {...props} style={styles.text}>{text}</Text>}
        </>
    )
}

export default TextC;