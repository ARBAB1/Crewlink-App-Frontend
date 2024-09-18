import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, PanResponder } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

const windowWidth = Dimensions.get('window').width;

const Toast = ({ title, message, visible, iconName, iconColor, bg, onDismiss }) => {
    const slideAnim = useRef(new Animated.Value(-100)).current;
    const pan = useRef(new Animated.ValueXY()).current;

    useEffect(() => {
        if (visible) {
            slideIn();
        } else {
            slideOut();
        }
    }, [visible]);

    const slideIn = () => {
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
        }).start();
    };

    const slideOut = () => {
        Animated.timing(slideAnim, {
            toValue: -100,
            duration: 500,
            useNativeDriver: true,
        }).start();
    };

    const panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: Animated.event(
            [
                null,
                { dx: pan.x, dy: pan.y }
            ],
            { useNativeDriver: false }
        ),
        onPanResponderRelease: (e, gestureState) => {
            if (Math.abs(gestureState.dx) > 100) {
                Animated.timing(pan, {
                    toValue: { x: gestureState.dx > 0 ? windowWidth : -windowWidth, y: 0 },
                    duration: 200,
                    useNativeDriver: true,
                }).start(() => {
                    onDismiss();
                    pan.setValue({ x: 0, y: 0 });
                });
            } else {
                Animated.spring(pan, {
                    toValue: { x: 0, y: 0 },
                    useNativeDriver: true,
                }).start();
            }
        }
    });

    const styles = StyleSheet.create({
        IconSide: {
            height: 35,
            width: 35,
            backgroundColor: bg,
            borderRadius: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
        },
        toastContainer: {
            position: 'absolute',
            top: 40,
            paddingVertical: 8,
            paddingHorizontal: 8,
            left: 15,
            right: 15,
            backgroundColor: 'white',
            borderRadius: 10,
            zIndex: 1000,
            flexDirection: 'row',
            alignItems: "center",
            borderWidth: 0,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
        },
        toastText: {
            color: '#727b9c',
            fontFamily: 'Montserrat-Regular',
            fontSize: 10,
            paddingTop: 2
        },
        toastTitle: {
            color: '#000033',
            fontFamily: 'Montserrat-Medium',
            fontSize: 11
        }
    });

    return visible ? (
        <Animated.View
            {...panResponder.panHandlers}
            style={[
                styles.toastContainer,
                { transform: [{ translateY: slideAnim }, { translateX: pan.x }] }
            ]}
        >
            <View style={styles.IconSide}>
                <AntDesign color={iconColor} size={20} name={iconName} />
            </View>
            <View style={{ paddingLeft: 8 }}>
                <Text style={styles.toastTitle}>{title}</Text>
                <Text style={styles.toastText}>{message}</Text>
            </View>
        </Animated.View>
    ) : null;
};

export default Toast;
