import React from "react";
import { Dimensions, Text, View, StyleSheet, Image } from 'react-native';
import { ScrollView } from "react-native-gesture-handler";
import { DefaultTheme, DarkTheme } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import TextC from "../text/text";


const CityScroll = () => {
    const scheme = useColorScheme();
    const width = Dimensions.get('window').width;
    const styles = StyleSheet.create({
        container: {
            paddingVertical: 20,
            paddingLeft: 15,
            paddingRight: 0,
            ...(scheme === 'dark' ? { backgroundColor: "#161616" } : { backgroundColor: '#F5F5F5' }),
        },
        ScrollCard: {
            height: 100,
            width: 70,
            backgroundColor: 'blue',
            borderRadius: 20,
            marginHorizontal: 5,
            overflow: 'hidden',
            marginBottom:5
            
        },
        ScrollCardWrapper:{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
        },
        cityContentImage: {
            width: 70,
            height: 100
        }
    })
    return (
        <>
            <View style={styles.container}>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    <View style={styles.ScrollCardWrapper}>
                        <View style={styles.ScrollCard}>
                            <Image source={require('../../assets/icons/cityImage1.png')} style={styles.cityContentImage} />
                        </View>
                        <TextC text={"NewYork"} font={'Montserrat-Medium'} size={12}  style={{width:60}} ellipsizeMode={"tail"} numberOfLines={1}/>
                    </View>
                    <View style={styles.ScrollCardWrapper}>
                        <View style={styles.ScrollCard}>
                            <Image source={require('../../assets/icons/cityImage2.png')} style={styles.cityContentImage} />
                        </View>
                        <TextC text={"Chicago"} font={'Montserrat-Medium'} size={12} style={{width:60}} ellipsizeMode={"tail"} numberOfLines={1}/>
                    </View>
                    <View style={styles.ScrollCardWrapper}>
                        <View style={styles.ScrollCard}>
                            <Image source={require('../../assets/icons/cityImage3.png')} style={styles.cityContentImage} />
                        </View>
                        <TextC text={"San Francisco"} font={'Montserrat-Medium'} size={12} style={{width:60}} ellipsizeMode={"tail"} numberOfLines={1}/>
                    </View>
                    <View style={styles.ScrollCardWrapper}>
                        <View style={styles.ScrollCard}>
                            <Image source={require('../../assets/icons/cityImage4.png')} style={styles.cityContentImage} />
                        </View>
                        <TextC text={"Los Angeles"} font={'Montserrat-Medium'} size={12} style={{width:60}} ellipsizeMode={"tail"} numberOfLines={1}/>
                    </View>
                    <View style={styles.ScrollCardWrapper}>
                        <View style={styles.ScrollCard}>
                            <Image source={require('../../assets/icons/cityImage1.png')} style={styles.cityContentImage} />
                        </View>
                        <TextC text={"NewYork"} font={'Montserrat-Medium'} size={12} style={{width:60}} ellipsizeMode={"tail"} numberOfLines={1}/>
                    </View>
                    <View style={styles.ScrollCardWrapper}>
                        <View style={styles.ScrollCard}>
                            <Image source={require('../../assets/icons/cityImage2.png')} style={styles.cityContentImage} />
                        </View>
                        <TextC text={"Chicago"} font={'Montserrat-Medium'} size={12} style={{width:60}} ellipsizeMode={"tail"} numberOfLines={1}/>
                    </View> 
                    <View style={styles.ScrollCardWrapper}>
                        <View style={styles.ScrollCard}>
                            <Image source={require('../../assets/icons/cityImage3.png')} style={styles.cityContentImage} />
                        </View>
                        <TextC text={"San Francisco"} font={'Montserrat-Medium'} size={12} style={{width:60}} ellipsizeMode={"tail"} numberOfLines={1}/>
                    </View>
                    <View style={styles.ScrollCardWrapper}>
                        <View style={styles.ScrollCard}>
                            <Image source={require('../../assets/icons/cityImage4.png')} style={styles.cityContentImage} />
                        </View>
                        <TextC text={"Los Angeles"} font={'Montserrat-Medium'} size={12} style={{width:60}} ellipsizeMode={"tail"} numberOfLines={1}/>
                    </View>
                </ScrollView>
            </View>
        </>
    )
}

export default CityScroll;

