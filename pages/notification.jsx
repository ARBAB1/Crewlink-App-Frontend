import React, { useCallback, useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Pressable, SafeAreaView, StatusBar, ScrollView, Animated, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { connect } from "react-redux";
import * as NotificationAction from "../store/actions/Notification/index";
import { RefreshControl } from "react-native-gesture-handler";
import TextC from "../components/text/text";
import LinearGradient from 'react-native-linear-gradient';
import { global, ResponsiveSize } from "../components/constant";
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Easing } from 'react-native-reanimated';
import moment from 'moment'; // Import moment
import { color } from "@rneui/base";

const SkeletonPlaceholder = ({ style, refreshing }) => {
    const translateX = new Animated.Value(-350);
    const styles = StyleSheet.create({
        container: {
            overflow: 'hidden',
            backgroundColor: '#F5F5F5',
            padding: ResponsiveSize(10),
            borderRadius: ResponsiveSize(25),
            flexDirection: 'row',
            alignItems: 'center',
            position: 'relative',
            marginBottom: ResponsiveSize(10)
        },
        imageWrapper: {
            width: ResponsiveSize(100),
            height: ResponsiveSize(100),
            borderRadius: ResponsiveSize(25),
            overflow: 'hidden',
        },
        textWrapper: {
            paddingLeft: ResponsiveSize(10),
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'center',
        },
        titleStripe: {
            width: ResponsiveSize(140),
            height: ResponsiveSize(10),
            borderRadius: ResponsiveSize(5),
            overflow: 'hidden',
        },
        descriptionStripe: {
            width: ResponsiveSize(140),
            height: ResponsiveSize(40),
            borderRadius: ResponsiveSize(5),
            marginTop: ResponsiveSize(12),
            overflow: 'hidden',
        },
        gradient: {
            ...StyleSheet.absoluteFillObject,
        },
        linearGradient: {
            flex: 1,
            width: ResponsiveSize(350),
        },
        linearGradientLine: {
            flex: 1,
            width: ResponsiveSize(350),
        },
    });
    Animated.loop(
        Animated.timing(translateX, {
            toValue: 350,
            duration: 2000,
            easing: Easing.ease,
            useNativeDriver: true,
        })
    ).start();

    return (
        <View style={[styles.container, style]}>
            <View style={styles.imageWrapper}>
                <Animated.View style={[styles.gradient, { transform: [{ translateX }] }]}>
                    <LinearGradient
                        colors={['#F5F5F5', '#d5d5d5', '#F5F5F5']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.linearGradient}
                    />
                </Animated.View>
            </View>
            <View style={styles.textWrapper}>
                <View style={styles.titleStripe}>
                    <Animated.View style={[styles.gradient, { transform: [{ translateX }] }]}>
                        <LinearGradient
                            colors={['#F5F5F5', '#d5d5d5', '#F5F5F5']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.linearGradientLine}
                        />
                    </Animated.View>
                </View>
                <View style={styles.descriptionStripe}>
                    <Animated.View style={[styles.gradient, { transform: [{ translateX }] }]}>
                        <LinearGradient
                            colors={['#F5F5F5', '#d5d5d5', '#F5F5F5']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.linearGradientLine}
                        />
                    </Animated.View>
                </View>
            </View>
        </View>
    );
};

const Notification = ({ getAllNotifications, NotificationReducer }) => {
    const navigation = useNavigation();
    
    const [page, setPage] = useState(1);  // Track current page for pagination
    const [totalFetchLength, setTotalFetchLength] = useState(100);  // Total fetch length
    const [renderLength, setRenderLength] = useState(10);  // Number of items to render
    const [dataList, setDataList] = useState([]);  // Combined notifications
    const threshold = 0.5;  // Threshold for loading new items (percentage of the list)
    const [refreshing, setRefreshing] = useState(false);  // Track refreshing state

    const { loading, data: notificationData, unreadCount } = NotificationReducer;  // Extract data from reducer

    // Cache loader to manage the cached notifications
    const cacheloader = (notifications) => {
        setDataList((prevDataList) => {
            const combinedData = [...prevDataList, ...(notifications || [])];  // Combine old and new data
            const uniqueData = Array.from(new Map(combinedData.map(item => [item.notification_id, item])).values());  // Remove duplicates
            return uniqueData;  // Return unique notifications
        });
    };

    // Asynchronous function to load notifications
    const allNotificationDataLoader = async ({ refreshing, pageRe }) => {
        const loadedNotifications = await getAllNotifications({ page: pageRe || page });
        if (loadedNotifications) {
            cacheloader(loadedNotifications);  // Load into cache
        }
    };

    // Effect to load notifications on component mount
    useEffect(() => {
        const loadNotifications = async () => {
            await allNotificationDataLoader({ refreshing: false });
        };
        loadNotifications();
    }, [page]);

    // Effect to trigger pagination and increase render length
    useEffect(() => {
        if (!loading && renderLength >= dataList.length && dataList.length > 0) {
            setPage((prevPage) => prevPage + 1);  // Increment page for pagination
            setTotalFetchLength(totalFetchLength + 100);  // Increase the total fetch length
        }
    }, [renderLength, dataList, loading]);

    // Refresh the data on pull to refresh
    const onRefresh = async () => {
        setRefreshing(true);
        setPage(1);  // Reset to page 1
        await allNotificationDataLoader({ refreshing: true, pageRe: 1 });
        setRefreshing(false);
    };

    // Render each notification item
    const renderItem = useCallback(({ item }) => {
        const navigate = () => {


            if (item?.notification_type === 'POST_TAG' || item?.notification_type === 'NEW_POST' || item?.notification_type === 'POST_RESHARE' || item?.notification_type === 'LIKE_POST' || item.notification_type === 'POST_COMMENT' || item.notification_type === 'POST_COMMENT_REPLY') {
                navigation.navigate('PostDetail',  item );
            }else if (item?.notification_type === 'CONNECTION' || item?.notification_type === 'ACCEPT_CONNECTION' ) {
               navigation.navigate('Profile', { screen: 'UserProfileScreen', params: { user_id: item?.content_id } }) //navigation.navigate('UserProfileScreen', { user_id: item?.content_id })
            }else if (item?.notification_type === 'EVENT_JOIN') {
                navigation.navigate('Event', { screen: 'EventDetail', params: { event_id: item?.content_id } })
            }else if(item?.notification_type === 'ANNOUNCEMENT_COMMENT'|| item?.notification_type === 'LIKE_ANNOUNCEMENT' || item?.notification_type === 'LIKE_ANNOUNCEMENT_COMMENT'){
                navigation.navigate('Reel', item)
            }
        }
        //navigation.navigate('StackB', { screen: 'ScreenB1' })
        return (
            <Pressable style={styles.NotificationBox} onPress={() => navigate()}>
                <Image 
                    source={{ uri: item?.userDetails?.profile_picture_url }}  // Assuming avatar image exists in assets
                    style={styles.NotificationDp}
                />
            
                <View style={{ paddingLeft: ResponsiveSize(8), flexDirection: 'column', alignItems: 'flex-start' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', maxWidth: '90%'}}>
                    
                    <TextC
                        size={ResponsiveSize(12)}
                        font={'Montserrat-Bold'}
                        text={item?.userDetails?.user_name}
                        numberOfLines={3}  // Limit content to three lines
                        ellipsizeMode="tail"
                        style={{ maxWidth: '90%' }}  // Limit text width for layout
                    />
                    <TextC
                        size={ResponsiveSize(12)}
                        font={'Montserrat-Medium'}
                        text={item?.content}
                        numberOfLines={3}  // Limit content to three lines
                        ellipsizeMode="tail"
                        style={{ maxWidth: '90%', color:'black' }}  // Limit text width for layout
                    />
                    </View>

                    <TextC
                        size={ResponsiveSize(10)}
                        font={'Montserrat-Regular'}
                        text={moment(item?.created_at).fromNow()}  // Use moment to format time
                        style={{ marginTop: ResponsiveSize(4), color: 'black' }}
                    />
                </View>
            </Pressable>
        );
    }, []);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar backgroundColor={global.white} />
            <View style={styles.wrapper}>
                <Pressable onPress={() => navigation.goBack()} style={styles.logoSide1}>
                    <AntDesign name='left' color={global.primaryColor} size={ResponsiveSize(22)} />
                </Pressable>
                <View style={styles.logoSide2}>
                    <TextC size={ResponsiveSize(13)} font={'Montserrat-Bold'} text={"Notification"} />
                </View>
                <View style={styles.logoSide3}>
                    <TextC size={ResponsiveSize(13)} font={'Montserrat-Regular'} text={`Unread: ${unreadCount}`} />
                </View>
            </View>

            {loading ? (
                <>
                    {/* Show loading placeholders */}
                    <SkeletonPlaceholder />
                    <SkeletonPlaceholder />
                    <SkeletonPlaceholder />
                </>
            ) : dataList.length === 0 ? (
                <ScrollView
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    contentContainerStyle={styles.notFound}
                >
                    <TextC size={ResponsiveSize(16)} text="No Notifications Found" />
                </ScrollView>
            ) : (
                <View style={{ flex: 1, backgroundColor: global.white }}>
                    <FlatList
                        data={dataList}  // Use the full dataList
                        renderItem={renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        onEndReached={() => setRenderLength(renderLength + 10)}  // Load more items when reaching the end
                        onEndReachedThreshold={threshold}  // Trigger when reaching 50% of the content
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    />
                </View>
            )}
        </SafeAreaView>
    );
};


// Define styles
const styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: ResponsiveSize(15),
        paddingVertical: ResponsiveSize(15),
        backgroundColor: global.white
    },
    logoSide1: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '33.33%',
    },
    logoSide2: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '33.33%',
    },
    logoSide3: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: '33.33%',
    },
    NotificationBox: {
        backgroundColor: '#EEEEEE',
        padding: ResponsiveSize(12),
        borderRadius: ResponsiveSize(10),
        flexDirection: 'row',
      
      
        alignItems: 'center',
        marginTop: ResponsiveSize(10),
        marginHorizontal: ResponsiveSize(15),
    },
    NotificationDp: {
        height: ResponsiveSize(50),
        width: ResponsiveSize(50),
   
        borderRadius: ResponsiveSize(30),
        justifyContent: 'center',
        alignItems: 'center',
    },
    notFound: {
        padding: ResponsiveSize(10),
        alignItems: 'center',
        justifyContent: 'center',
    },
});

// Map Redux state to component props
function mapStateToProps({ NotificationReducer }) {
    return { NotificationReducer };
}

// Connect component to Redux actions and state
export default connect(mapStateToProps, NotificationAction)(React.memo(Notification));

