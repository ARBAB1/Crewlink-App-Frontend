import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Dimensions, SafeAreaView, StatusBar, StyleSheet, TouchableOpacity } from "react-native";
import { global, ResponsiveSize } from "../components/constant";
import { View,Text } from "react-native";
import FastImage from "react-native-fast-image";
import { ImageZoom } from '@likashefqet/react-native-image-zoom';
import TextC from "../components/text/text";
import Ionicons from "react-native-vector-icons/Ionicons"
import { useNavigation } from "@react-navigation/native";
import Video from 'react-native-video';


const ChatMediaDetail = ({ route }) => {
    const navigation = useNavigation();
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const [isLoading, setIsLoading] = useState(true)
    const videoRef = useRef(null);
    
 
    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false)
        }, 2000);
    }, [])

    const styles = StyleSheet.create({
         messageUser: {
            fontSize: ResponsiveSize(15),
            color: global.white,
            fontFamily: 'Montserrat-Regular',
        },
        ImageMessage: {
            // backgroundColor: global.secondaryColor,
            borderTopLeftRadius: ResponsiveSize(10),
            borderBottomLeftRadius: ResponsiveSize(10),
            borderBottomRightRadius: ResponsiveSize(10),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: ResponsiveSize(10),
            paddingVertical: ResponsiveSize(5),
            width: windowWidth * 0.7
        },
        FullContainer: {
            flex: 1,
            backgroundColor: global.black,
            paddingHorizontal: ResponsiveSize(0),
            justifyContent: 'center',
            alignItems: 'center'
        },
        TopBar: {
            width: windowWidth,
            height: ResponsiveSize(60),
            position: 'absolute',
            top: ResponsiveSize(30),
            left: 0,
            zIndex: 100,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: ResponsiveSize(15),
        },
        userInfo: {
            backgroundColor: global.white,
            height: ResponsiveSize(40),
            borderRadius: ResponsiveSize(40),
            paddingLeft: ResponsiveSize(2.5),
            paddingRight: ResponsiveSize(10),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        },
        closeBtn: {
            backgroundColor: global.white,
            height: ResponsiveSize(40),
            width: ResponsiveSize(40),
            borderRadius: ResponsiveSize(40),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        },
    })
    const [Winheight, setHeight] = useState(windowHeight * 0.4);
    const handleSetHeight = useCallback(e => {
      const naturalRatio = 16 / 13;
      const videoRatio = e.naturalSize.width / e.naturalSize.height;
      if (videoRatio !== naturalRatio) {
        setHeight(prevHeight => (prevHeight * naturalRatio) / videoRatio);
      }
    }, []);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar
                translucent={true}
                backgroundColor={'black'}
            />
            <View style={styles.FullContainer}>
                <View style={styles.TopBar}>
                    <View style={styles.userInfo}>
                        <FastImage
                            source={{ uri: route?.params?.profile_picture_url, priority: FastImage.priority.high }}
                            style={{
                                height: ResponsiveSize(35),
                                width: ResponsiveSize(35),
                                borderRadius: ResponsiveSize(35),
                            }}
                            resizeMode="cover"
                        />
                        <TextC text={route?.params?.user_name} font={"Montserrat-Bold"} style={{ marginLeft: ResponsiveSize(10) }} />
                    </View>

                    <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
                        <Ionicons name="close" size={ResponsiveSize(20)} color={global.black} />
                    </TouchableOpacity>
                </View>
                {/* <FastImage
                    source={{ uri: route?.params?.uri?.media_url, priority: FastImage.priority.high }}
                    resizeMode="cover"
                    style={{ aspectRatio: route?.params?.ratio, width: windowWidth }}
                /> */}


                <>
                    {route?.params?.isImage ?
                        <>
                            {isLoading ?
                                <ActivityIndicator size={'large'} />
                                :
                                <ImageZoom
                                    key={'1'}
                                    style={{ aspectRatio: route?.params?.ratio, width: windowWidth }}
                                    uri={route?.params?.uri?.media_url}
                                />
                            }
                        </>
                        :
                        <>

                            <Video
                                onLoad={handleSetHeight}
                                repeat={true}
                                source={{
                                    uri: route?.params?.uri?.media_url,
                                }}
                                ref={videoRef}
                                paused={true}
                                controls={true}
                                style={{ height: Winheight, width: windowWidth }}
                            />
                      
                        </>
                    }
                          <View style={styles.ImageMessage}>
                                                            <Text style={styles.messageUser}>{route?.params?.uri?.message}</Text>
                                                         
                                                        </View>
                </>

            </View>
        </SafeAreaView>
    )
}

export default ChatMediaDetail;