import React, { useCallback, useEffect, useState } from "react";
import { View, StyleSheet, Image, ScrollView, Animated, FlatList, Pressable } from "react-native";
import TextC from "../text/text";
import { ResponsiveSize, global } from "../constant";
import LinearGradient from 'react-native-linear-gradient';
import { Easing } from 'react-native-reanimated';
import * as AllEventAction from "../../store/actions/Events/index";
import { connect } from "react-redux";
import TimeAgo from '@manu_omg/react-native-timeago';
import ButtonC from "../button/index";
import { useNavigation } from "@react-navigation/native";
import { RefreshControl } from "react-native-gesture-handler";
import FastImage from "react-native-fast-image";
import { useSWRConfig } from "swr";
import { Text } from "react-native-elements";

const SkeletonPlaceholder = ({ style }) => {
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


const Joined = ({ getJoinedEvents, JoinedEventReducer, tabActivator, }) => {
    const navigation = useNavigation()
    const [dataList, setDataList] = useState([])
    const { cache } = useSWRConfig()
    const [page, setPage] = useState(1)
    const [renderLength, setRenderLength] = useState(10)
    const [totalFetchLength, setTotalFetchLength] = useState(100)
    const threshold = totalFetchLength - 30
    const [refreshing, setRefreshing] = React.useState(false);

    const joinedEventDataLoader = async ({ refreshing, pageRe }) => {
        if (refreshing) {
            const loadAllevent = await getJoinedEvents({ page: pageRe })
            cacheloader(loadAllevent)
        }
        else if (!refreshing) {
            const loadAllevent = await getJoinedEvents({ page: page })
            cacheloader(loadAllevent)
        }
    }
    useEffect(() => {
        joinedEventDataLoader({ refreshing: false })
    }, [page]);
    useEffect(() => {
        if (renderLength > threshold) {
            setPage(page + 1)
            setTotalFetchLength(totalFetchLength + 100)
        }
    }, [renderLength])

    const cacheloader = async (loadAllevent) => {
        const preLoad = cache.get('JoinedEvent')
        const combinedData = [...preLoad || [], ...(loadAllevent || [])];
        const uniqueData = Array.from(
            combinedData.reduce((map, item) => {
                map.set(item?.event_id, item);
                return map;
            }, new Map()).values()
        );
        cache.set("JoinedEvent", uniqueData)
        setDataList(cache.get('JoinedEvent'))
    }

    const onRefresh = async () => {
        cache.delete('JoinedEvent')
        joinedEventDataLoader({ refreshing: true, pageRe: 1 })
        setRenderLength(10)
        setTotalFetchLength(100)
        setPage(1)
        setDataList([])
        cacheloader()
        setRefreshing(false);
    }
    const styles = StyleSheet.create({
        Wrapper: {
            backgroundColor: "#F5F5F5",
            padding: ResponsiveSize(10),
            borderRadius: ResponsiveSize(25),
            flexDirection: "row",
            alignItems: 'center',
            position: "relative",
            marginBottom: ResponsiveSize(10)
        },
        UpcomingImage: {
            width: ResponsiveSize(100),
            height: ResponsiveSize(100),
            borderRadius: ResponsiveSize(25)
        },
        UpcomingContent: {
            paddingLeft: ResponsiveSize(10)
        },
        profileImages1: {
            height: ResponsiveSize(23),
            width: ResponsiveSize(23),
            backgroundColor: "red",
            borderRadius: ResponsiveSize(23),
            position: 'absolute',
            left: 0
        },
        profileImages2: {
            height: ResponsiveSize(23),
            width: ResponsiveSize(23),
            backgroundColor: "teal",
            borderRadius: ResponsiveSize(23),
            position: 'absolute',
            left: ResponsiveSize(10)
        },
        profileImages3: {
            height: ResponsiveSize(23),
            width: ResponsiveSize(23),
            backgroundColor: "yellow",
            borderRadius: ResponsiveSize(23),
            position: 'absolute',
            left: ResponsiveSize(20)

        },
        profileImages4: {
            height: ResponsiveSize(23),
            width: ResponsiveSize(23),
            backgroundColor: "gray",
            borderRadius: ResponsiveSize(23),
            position: 'absolute',
            left: ResponsiveSize(30)
        },
        LikeBtn: {
            position: 'absolute',
            top: ResponsiveSize(15),
            right: ResponsiveSize(15),
            height: ResponsiveSize(23),
            width: ResponsiveSize(23),
        },
        timeAgo: {
            position: 'absolute',
            bottom: ResponsiveSize(10),
            right: ResponsiveSize(10),
            flexDirection: 'row',
            alignItems: 'center',
        },
        joinedBadge: {
            borderWidth: 1,
            borderColor: global.secondaryColor,
            paddingHorizontal: ResponsiveSize(15),
            borderRadius: ResponsiveSize(10),
            paddingVertical: ResponsiveSize(2),
            backgroundColor: global.secondaryColor,
            color: 'white',
            marginRight: ResponsiveSize(5),
        },
        notFound: {
            flex: 1,
        },
        timeAgoJoinedV: {
            paddingBottom: ResponsiveSize(5),
        },
    })


    const renderItem = useCallback((items) => {
        return (
            <Pressable onPress={() => navigation.navigate('EventDetail', { id: items?.item?.event_id })} style={{ ...styles.Wrapper, borderColor: global.description, borderWidth: 1, }}>
                <Image
                    style={{ width: ResponsiveSize(100), height: ResponsiveSize(100), borderRadius: ResponsiveSize(20),transform: [{rotate: '270deg'}]}}
                    source={{
                        uri: items?.item?.event_cover_image_thumbnail,
                    }}
                />
                <View style={styles.UpcomingContent}>
                    <View style={styles.timeAgoJoinedV}>
                        <TimeAgo
                            style={{ fontFamily: "Montserrat-Medium", fontSize: ResponsiveSize(8) }}
                            time={items?.item?.created_at}
                        />
                    </View>
                    <TextC text={items?.item?.event_title} font={"Montserrat-Bold"} size={ResponsiveSize(12)} style={{ width: ResponsiveSize(140) }} ellipsizeMode={"tail"} numberOfLines={1} />
                    <TextC text={items?.item?.event_details} font={"Montserrat-Medium"} size={ResponsiveSize(10)} style={{ width: ResponsiveSize(140), paddingTop: ResponsiveSize(5) }} ellipsizeMode={"tail"} numberOfLines={2} />
                    <View style={{ paddingTop: ResponsiveSize(5), flexDirection: 'row', alignItems: 'center' }}>
                        <Image style={{ height: ResponsiveSize(13), width: ResponsiveSize(13), marginRight: ResponsiveSize(3) }} source={require('../../assets/icons/calender.png')} />
                        <TextC text={items?.item?.event_date} font={'Montserrat-Medium'} size={ResponsiveSize(10)} />
                    </View>
                </View>
            </Pressable >
        );
    }, []);
    return (
        <>
            {JoinedEventReducer?.loading ? (
                <>
                    <SkeletonPlaceholder />
                    <SkeletonPlaceholder />
                    <SkeletonPlaceholder />
                    <SkeletonPlaceholder />
                    <SkeletonPlaceholder />
                    <SkeletonPlaceholder />
                    <SkeletonPlaceholder />
                </>
            ) : JoinedEventReducer?.loading === false && dataList?.length <= 0 ? (
                <ScrollView
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    } style={styles.notFound}>
                    <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: ResponsiveSize(180) }}>
                        {JoinedEventReducer?.networkError == true &&
                            <View style={{ paddingBottom: ResponsiveSize(5), paddingHorizontal: ResponsiveSize(50) }}>
                                <Image style={{ height: ResponsiveSize(80), width: ResponsiveSize(80) }} source={require('../../assets/icons/something-went-wrong.png')} />
                            </View>
                        }
                        {JoinedEventReducer?.networkError == true ?
                            <TextC text={"Something went wrong"} font={'Montserrat-Bold'} size={ResponsiveSize(15)} /> :
                            <TextC text={"No Joined Event Right Now"} font={'Montserrat-Bold'} size={ResponsiveSize(15)} />
                        }
                        {JoinedEventReducer?.networkError == true ?
                            <View style={{ paddingTop: ResponsiveSize(5), paddingHorizontal: ResponsiveSize(50) }}>
                                <TextC style={{ textAlign: 'center', color: global?.black }} text={"Brace yourself till we get the error fixed"} font={'Montserrat-Medium'} size={ResponsiveSize(10)} />
                            </View> :
                            <View style={{ paddingTop: ResponsiveSize(5), paddingHorizontal: ResponsiveSize(50) }}>
                                <TextC style={{ textAlign: 'center', color: global?.black }} text={"We couldn't find any joined event right now. Try to join again"} font={'Montserrat-Medium'} size={ResponsiveSize(10)} />
                            </View>
                        }
                        {JoinedEventReducer?.networkError !== true &&
                            <View style={{ paddingTop: ResponsiveSize(15), paddingHorizontal: ResponsiveSize(50) }}>
                                <ButtonC onPress={() => tabActivator(1)} title={"Join Events"} bgColor={global.primaryColor} TextStyle={{ color: global.white }} />
                            </View>
                        }
                    </View>
                </ScrollView>
            ) : (
                <>
                    <FlatList
                        onRefresh={onRefresh}
                        showsVerticalScrollIndicator={false}
                        initialNumToRender={10}
                        refreshing={refreshing}
                        data={dataList?.slice(0, renderLength)}
                        keyExtractor={(items, index) => index?.toString()}
                        maxToRenderPerBatch={10}
                        windowSize={10}
                        onEndReached={() => {
                            setRenderLength(renderLength + 10)
                        }}
                        onEndReachedThreshold={0.5}
                        renderItem={renderItem}
                    />
                </>
            )}
        </>
    );
}

function mapStateToProps({ JoinedEventReducer }) {
    return { JoinedEventReducer };
}
export default connect(mapStateToProps, AllEventAction)(React.memo(Joined));