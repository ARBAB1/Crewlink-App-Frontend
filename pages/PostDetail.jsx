import React, { useEffect, useState } from "react";
import { StatusBar, SafeAreaView, ScrollView, StyleSheet, Dimensions, View, Pressable, ActivityIndicator } from "react-native";
import { global, ResponsiveSize } from "../components/constant";
import { useNavigation } from "@react-navigation/native";
import TextC from "../components/text/text";
import AntDesign from 'react-native-vector-icons/AntDesign';
import * as PostDetailAction from '../store/actions/PostById/index';
import { connect } from 'react-redux';
import Post from "../components/post";

const PostDetail = ({ route, getPostDetail }) => {
    console.log(route?.params, 'route')
    let params
    let type
    if (!route?.params?.content_id) {
        params = route?.params
        type = 'NEW_POST'
    }
    else {
        params = parseInt(route?.params?.content_id)
        type = (route?.params?.content_type)?.toString()
    }


    const navigation = useNavigation();
    const windowWidth = Dimensions.get('window').width;
    const [post, setPost] = useState([]);
    const [loading, setLoading] = useState(false);
console.log(post, 'post112')
    const styles = StyleSheet.create({
        wrapper: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: windowWidth,
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
    })

    const LoadUserPosts = async () => {
        setLoading(true)
        const result = await getPostDetail({
            post_id: params
        })
        console.log(result, 'result')
        setPost([result?.data])

        setLoading(false)
    }

    useEffect(() => {
        LoadUserPosts()
    }, [])
    return (
        <>
            <SafeAreaView style={{ flex: 1 }}>
                <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />
                <View style={styles.wrapper}>
                    <Pressable onPress={() => navigation.goBack()} style={styles.logoSide1}>
                        <AntDesign name='left' color={"#05348E"} size={ResponsiveSize(18)} />
                    </Pressable>
                    <View style={styles.logoSide2}>
                        <TextC size={ResponsiveSize(16)} font={'Montserrat-Bold'} text={"Posts"} />
                    </View>
                    <View style={styles.logoSide3}></View>
                </View>
                {loading ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="large" color={global.primaryColor} />
                    </View>
                ) : (
                    <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: global.white }}>
                        {post !== undefined &&
                            post !== null &&
                            post !== '' &&
                            post.length > 0 ?
                            post?.map(data => (
                                <Post
                                    selfLiked={data?.selfLiked}
                                    postId={data?.post_id}
                                    timeAgo={data?.created_at}
                                    userLocation={`${data?.lastCheckin?.city} | ${data?.lastCheckin?.state}`}
                                    userName={data?.userDetails?.user_name}
                                    profileImage={data?.userDetails?.profile_picture_url}
                                    likeCount={data?.likes_count}
                                    commnetCount={data?.comments_count}
                                    description={data?.caption}
                                    content={data?.attachments}
                                    comments_show_flag={data?.comments_show_flag}
                                    allow_comments_flag={data?.allow_comments_flag}
                                    likes_show_flag={data?.likes_show_flag}
                                    type={type}
                                />
                            )) :
                            <View style={{ paddingTop: ResponsiveSize(30), flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                <TextC
                                    text={'No posts yet'}
                                    font={'Montserrat-SemiBold'}
                                    size={ResponsiveSize(18)}
                                    style={{ color: global.primaryColor }}
                                />
                            </View>
                        }
                    </ScrollView>
                )}
            </SafeAreaView>
        </>
    )
}

function mapStateToProps({ PostDetailReducer }) {
    return { PostDetailReducer };
}
export default connect(mapStateToProps, PostDetailAction)(PostDetail);
