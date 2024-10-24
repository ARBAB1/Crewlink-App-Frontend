import TimeAgo from '@manu_omg/react-native-timeago';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, ImageBackground, StyleSheet, TouchableOpacity, View } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ResponsiveSize, global } from '../constant';
import TextC from '../text/text';
import { connect } from 'react-redux';
import * as PostCreationAction from '../../store/actions/PostCreation/index';



const Reply = ({deleteLoader, data, commentRetry, LikeReply, DisLikeReply, DeleteReply,likeLoader }) => {
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const commentSectioLength = windowWidth - ResponsiveSize(30)

    const style = StyleSheet.create({
        PostHeader: {
            flexDirection: 'row',
            paddingVertical: ResponsiveSize(10),
            paddingHorizontal: ResponsiveSize(15),
            width: windowWidth * 0.88,
        },
        PostProfileImage: {
            height: ResponsiveSize(40),
            width: ResponsiveSize(40),
            borderRadius: ResponsiveSize(40),
            backgroundColor: global.description,
            marginRight: ResponsiveSize(10),
            overflow: 'hidden',
        },
        PostProfileImage2: {
            height: commentSectioLength * 0.08,
            width: commentSectioLength * 0.08,
            borderRadius: commentSectioLength * 0.08,
            backgroundColor: global.description,
            marginRight: ResponsiveSize(10),
            overflow: 'hidden',
        },
        PostProfileImageBox: {
            flexDirection: "column",
            alignItems: 'flex-start',
            justifyContent: 'center'
        },
        PostActionDot: {
            flexDirection: "row",
            alignItems: 'center',
        },
        ActuallPost: {
            height: windowHeight * 0.40,
            width: windowWidth * 0.88,
            borderRadius: 0
        },
        postActionSection: {
            flexDirection: 'row',
            paddingVertical: ResponsiveSize(12),
            paddingHorizontal: ResponsiveSize(15),
            width: windowWidth * 0.88,
        },
        PostDetail: {
            textAlign: "left",
            paddingHorizontal: ResponsiveSize(15),
        },
        commentSectionProfile: {
            height: commentSectioLength * 0.08,
            width: commentSectioLength * 0.08,
            backgroundColor: 'gray',
            borderRadius: commentSectioLength * 0.08,
            overflow: 'hidden',
            marginTop: ResponsiveSize(5),
        },
        PostIcons: {
            paddingHorizontal: ResponsiveSize(5)
        },
        PostIcons1: {
            paddingLeft: 0,
            paddingRight: ResponsiveSize(5)
        },
        CommnetAdd: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: ResponsiveSize(20),
            paddingVertical: ResponsiveSize(5)
        },
        CommenterProfile: {
            height: ResponsiveSize(21),
            width: ResponsiveSize(21),
            backgroundColor: 'blue',
            borderRadius: ResponsiveSize(40),
            overflow: 'hidden',
        },
        CommenterProfileImage: {
            height: ResponsiveSize(21),
            width: ResponsiveSize(21)
        },
        PostDate: {
            paddingHorizontal: ResponsiveSize(15),
            paddingVertical: ResponsiveSize(5)
        },
        DescriptionStyle: {
            fontFamily: 'Montserrat-Medium',
            fontSize: ResponsiveSize(10),
            marginTop: ResponsiveSize(5),
            color: global.black,
        },
        commentKeyBoard: {
            height: ResponsiveSize(90),
            width: windowWidth * 0.88,
            backgroundColor: global.black,
            position: 'absolute',
            bottom: ResponsiveSize(10)
        },
        playPaused: {
            position: 'absolute',
            top: 0,
            left: 0,
            borderWidth: 0,
            alignItems: 'center',
            justifyContent: 'center',
            width: windowWidth * 0.88,
            height: windowHeight * 0.43,
            flexDirection: 'row',
        },
        commentAdd: {
            position: 'absolute',
            bottom: 0,
            width: windowWidth * 0.88,
        },
        commentInput: {
            backgroundColor: "#EEEEEE",
            borderTopColor: '#cccccc',
            borderTopWidth: 1,
            paddingLeft: ResponsiveSize(15),
            paddingVertical: ResponsiveSize(10),
            fontFamily: 'Montserrat-Medium',
        },
        sendCommentBtn: {
            backgroundColor: global.secondaryColor,
            position: 'absolute',
            right: ResponsiveSize(10),
            top: ResponsiveSize(7),
            height: ResponsiveSize(30),
            width: ResponsiveSize(30),
            borderRadius: ResponsiveSize(30),
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: ResponsiveSize(15),
            paddingRight: ResponsiveSize(2),
            paddingTop: ResponsiveSize(2),
        },
        modalTopLayer: {
            height: windowHeight * 0.6,
            width: windowWidth * 0.88,
            paddingTop: 10,
            position: 'absolute',
            backgroundColor: 'white',
            bottom: ResponsiveSize(0),
            borderTopLeftRadius: ResponsiveSize(15),
            borderTopRightRadius: ResponsiveSize(15),
            overflow: 'hidden',
            zIndex: 999
        },
        TopIndicator: {
            width: windowWidth * 0.88,
            paddingVertical: ResponsiveSize(2),
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
        },
        modalIndicator: {
            width: ResponsiveSize(30),
            paddingVertical: ResponsiveSize(2),
            borderRadius: ResponsiveSize(20),
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#EEEEEE',
        },
        CommentCrashBtn: {
            backgroundColor: global.red,
            paddingHorizontal: ResponsiveSize(10),
            paddingVertical: ResponsiveSize(5),
            borderRadius: ResponsiveSize(10),
        }
    })

    return (
        <>
            <View key={data?.post_id} style={{ flexDirection: 'row', alignItems: 'flex-start', width: windowWidth * 0.88, paddingVertical: ResponsiveSize(0), backgroundColor: data?.posting == true ? '#EEEEEE' : 'white', paddingHorizontal: ResponsiveSize(15), paddingVertical: ResponsiveSize(5), position: 'relative' }}>
                <View style={style.commentSectionProfile}>
                    <ImageBackground
                        source={data?.user?.profile_picture_url === '' ? require('../../assets/icons/avatar.png') : { uri: data?.user?.profile_picture_url }}
                        style={style.PostProfileImage2}
                        resizeMode="cover"
                    />
                </View>
                <View style={{ paddingHorizontal: ResponsiveSize(8), paddingTop: ResponsiveSize(5), width: windowWidth * 0.88 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: ResponsiveSize(3) }}>
                        <TextC text={data?.user?.user_name} font={'Montserrat-SemiBold'} size={ResponsiveSize(11)} style={{ includeFontPadding: false }} />
                        <TimeAgo style={{
                            fontFamily: 'Montserrat-Regular',
                            fontSize: ResponsiveSize(8),
                            includeFontPadding: false,
                            color: "#999999",
                            marginLeft: 6
                        }} time={data?.commented_at} />
                    </View>
                    <TextC text={data?.comment} font={'Montserrat-Regular'} style={{ includeFontPadding: false, fontSize: ResponsiveSize(10), color: global.black, paddingVertical: ResponsiveSize(2), width: windowWidth * 0.68 }} />
                    <View style={{ flexDirection: "row", alignItems: 'center', paddingTop: 5 }}>
                        {data?.posting == true ?
                            <TextC style={{
                                fontFamily: 'Montserrat-Regular',
                                fontSize: ResponsiveSize(8),
                                includeFontPadding: false,
                                color: "#999999",
                                marginLeft: 0
                            }} text={"Posting..."} />
                            : data?.posting == 'crash' ?
                                <TouchableOpacity onPress={commentRetry} style={style.CommentCrashBtn}>
                                    <TextC style={{
                                        fontFamily: 'Montserrat-Regular',
                                        fontSize: ResponsiveSize(8),
                                        includeFontPadding: false,
                                        color: global.white,
                                        marginLeft: 0
                                    }} text={"Retry"} />
                                </TouchableOpacity>
                                :
                                <>
                                    <TouchableOpacity disabled={likeLoader} onPress={() => data?.selfLiked ? DisLikeReply(data?.comment_id, data?.parent_id) : LikeReply(data?.comment_id, data?.parent_id)} style={{ flexDirection: "row", alignItems: 'center' }}>
                                        <AntDesign name={data?.selfLiked ? 'heart' : 'hearto'} color={data?.selfLiked ? global.red : global.black} size={ResponsiveSize(11)} />
                                        <TextC text={data?.likes_count || 0} size={ResponsiveSize(10)} font={'Montserrat-Medium'} style={{ color: "#999999", paddingLeft: ResponsiveSize(3) }} />
                                    </TouchableOpacity>
                                </>
                        }
                    </View>
                </View>
                {data?.myComment &&
                    <View style={{ height: '100%', width: ResponsiveSize(40), position: 'absolute', right: 0, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <>
                            {data?.deleting ?
                                <ActivityIndicator size={'small'} color={global.red} />
                                :
                                <TouchableOpacity disabled={deleteLoader} onPress={() => DeleteReply(data?.comment_id, data?.parent_id)}>
                                    <AntDesign name='delete' size={ResponsiveSize(15)} color={global.red} />
                                </TouchableOpacity>
                            }
                        </>
                    </View>
                }
            </View>
        </>
    )
}

export default Reply;
