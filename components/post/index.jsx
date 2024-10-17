import ReadMore from '@fawazahmed/react-native-read-more';
import TimeAgo from '@manu_omg/react-native-timeago';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';
import Modal from 'react-native-modal';
import Carousel from 'react-native-reanimated-carousel';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import Video from 'react-native-video';
import { connect } from 'react-redux';
import CommnetLight from '../../assets/icons/Comment.png';
import ShareLight from '../../assets/icons/Share.png';
import * as PostCreationAction from '../../store/actions/PostCreation/index';
import { ResponsiveSize, global, notificationTypes } from '../constant';
import TextC from '../text/text';
import Comments from './comment';
import Reply from './Reply';
import FastImage from 'react-native-fast-image';
import { useNavigation } from '@react-navigation/native';
import baseUrl from '../../store/config.json'
import io from "socket.io-client";
import { launchImageLibrary } from 'react-native-image-picker';


const Post = ({
  userName,
  profileImage,
  selfLiked,
  LikeCommentFunc,
  DisLikeCommentFunc,
  postId,
  likeCount,
  commnetCount,
  description,
  content,
  post_city,
  timeAgo,
  LikeFunc,
  DisLikeFunc,
  LoadComments,
  AddComment,
  comments_show_flag,
  allow_comments_flag,
  likes_show_flag,
  LoadReplies,
  DeletComments,
  type,
  userLocation,
  getAllConnections,
  reshareUserDetails,
  content_type,
  user_idIn,

}) => {
  console.log(content?.length, 'post_city')
  const navigation = useNavigation();
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const [liked, setLike] = useState(selfLiked);
  const [likeCountPre, setLikeCountPre] = useState(likeCount);
  const videoRef = useRef(null);
  const commentScrollRef = useRef(null);
  const commentSectioLength = windowWidth - ResponsiveSize(30);
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentCrash, setCommentCrash] = useState(false);
  const [commentList, setCommentList] = useState([]);
  const [tempReplyId, setTempReplyId] = useState();
  const [ReplyList, setReplyList] = useState([]);
  const [commentInfo, setCommentInfo] = useState('');
  const [commentPage, setCommentPage] = useState(1);
  const [allDataLoaded, setAllDataLoaded] = useState(false);
  const [allReplyLoaded, setAllReplyLoaded] = useState(false);
  const [commentLoadingPage, setCommentLoadingPage] = useState(false);
  const [ReplyPages, setReplyPages] = useState(1);
  const [commentCrashPage, setCommentCrashPage] = useState(false);
  const [replyComment, setReplyComment] = useState('');
  const [replyCommentId, setReplyCommentId] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);
  const [replyAddLoader, setReplyAddLoader] = useState(false);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const [paused, setPause] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [commentAddLoading, setCommentAddLoading] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [likeLoader, setLikeLoader] = useState(false);
  const [isShareModal, setIsShareModal] = useState(false);


  const [isReportVisible, setIsReportVisible] = useState(false);
  const [isReportSecondVisible, setIsReportSecondVisible] = useState(false);




  useEffect(() => {
    if (type === notificationTypes.POST_COMMENT || type === notificationTypes.POST_COMMENT_REPLY) {
      toggleModal()
    }

  }, [type]);

  const [getLatestConnection, setGetLatestConnection] = useState([]);

  const getAllConnectionsFunc = async () => {
    const Token = await AsyncStorage.getItem('Token');
    try {
      const response = await fetch(`${baseUrl.baseUrl}/connect/get-my-connections-list/1/10`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': baseUrl.apiKey,
          'accesstoken': `Bearer ${Token}`
        },
      });
      if (response.ok === true) {
        const res = await response.json()
        setGetLatestConnection(res?.data?.connections);
      }
    }
    catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {
    getAllConnectionsFunc()
  }, [])


  useEffect(() => {
    if (commentPage !== 1) {
      openCommentSectionPagination();
    }
  }, [commentPage]);

  const openCommentSection = async Reload => {
    if (Reload) {
      setCommentLoading(true);
    }
    setCommentCrash(false);
    const result = await LoadComments({
      post_id: postId,
      page: 1,
      limit: 10,
    });

    if (result?.comments) {
      setCommentList(result?.comments);
      setCommentLoading(false);
      if (result.comments.length < 10) {
        setAllDataLoaded(true);
      }
    } else {
      setCommentCrash(true);
      setCommentLoading(false);
    }
  };
  const openCommentSectionPagination = async () => {
    if (allDataLoaded) return;
    setCommentLoadingPage(true);
    setCommentCrashPage(false);
    const result = await LoadComments({
      post_id: postId,
      page: commentPage,
      limit: 10,
    });
    if (result?.comments) {
      setCommentList(prev => [...prev, ...result?.comments]);
      if (result.comments.length < 10) {
        setAllDataLoaded(true);
      }
      setCommentLoadingPage(false);
    } else {
      setCommentCrashPage(true);
      setCommentLoadingPage(false);
    }
  };

  const handleLike = async () => {
    try {
      setLike(true);
      setLikeCountPre(prev => prev + 1);
      await LikeFunc({ post_id: postId });
    } catch (error) {
      console.error('Error liking the post:', error);
    }
  };
  const handleDislike = async () => {
    try {
      setLike(false);
      setLikeCountPre(prev => prev - 1);
      await DisLikeFunc({ post_id: postId });
    } catch (error) {
      console.error('Error disliking the post:', error);
    }
  };
  const toggleModal = () => {
    openCommentSection(true);
    setModalVisible(!isModalVisible);
  };

  const closeCommentFunction = () => {
    setModalVisible(false);
    setCommentLoading(false);
    setCommentCrash(false);
    setCommentList([]);
    setReplyList([]);
    setCommentInfo('');
    setCommentPage(1);
    setAllDataLoaded(false);
    setAllReplyLoaded(false);
    setCommentLoadingPage(false);
    setCommentCrashPage(false);
    setReplyComment('');
    setReplyCommentId('');
    setReplyLoading(false);
    setReplyAddLoader(false);
    setLoadMoreLoading(false);
    setPause(true);
    setModalVisible(false);
    setCommentAddLoading(false);
  };

  // deleteing comments and replies
  const DeleteComment = async comment_id => {
    setDeleteLoader(true);
    const filterCommentDat = commentList.map(comment => {
      if (comment.comment_id == comment_id) {
        return {
          ...comment,
          deleting: true,
        };
      }
      return comment;
    });
    setCommentList(filterCommentDat);
    const result = await DeletComments({
      comment_type: 'COMMENT',
      comment_id: comment_id,
    });
    if (result == 'Comment deleted successfully') {
      setCommentList(prevItems =>
        prevItems.filter(item => item.comment_id !== comment_id),
      );
      setDeleteLoader(false);
    }
    setDeleteLoader(false);
  };
  const DeleteReply = async (reply_id, comment_id) => {
    setDeleteLoader(true);
    const updatedComment = commentList.find(
      comment => comment.comment_id === comment_id,
    );
    if (updatedComment) {
      const newComment = {
        ...updatedComment,
        replies: {
          ...updatedComment.replies,
          reply: updatedComment.replies.reply.map(comment => {
            if (comment.comment_id == reply_id) {
              return {
                ...comment,
                deleting: true,
              };
            }
            return comment;
          }),
        },
      };
      const updatedCommentList = commentList.map(comment =>
        comment.comment_id === comment_id ? newComment : comment,
      );
      setCommentList(updatedCommentList);
      const result = await DeletComments({
        comment_type: 'REPLY',
        comment_id: reply_id,
      });
      if (result == 'Reply deleted successfully') {
        LoadRefreashReplies(comment_id, false);
      }
      setDeleteLoader(false);
    }
    setDeleteLoader(false);
  };
  // deleteing comments and replies

  // like unlike comment and reply functionality
  const LikeComment = async comment_id => {
    setLikeLoader(true);
    const filterCommentData = commentList.map(comment => {
      if (comment.comment_id == comment_id) {
        return {
          ...comment,
          likes_count: comment?.likes_count + 1,
          selfLiked: true,
        };
      }
      return comment;
    });
    setCommentList(filterCommentData);
    try {
      await LikeCommentFunc({
        comment_id: comment_id,
        comment_type: 'COMMENT',
      });
      setLikeLoader(false);
    } catch (error) {
      console.error('Error liking the post:', error);
      setLikeLoader(false);
    }
    setLikeLoader(false);
  };
  const DisLikeComment = async comment_id => {
    setLikeLoader(true);
    const filterCommentData = commentList.map(comment => {
      if (comment.comment_id == comment_id) {
        return {
          ...comment,
          likes_count: comment?.likes_count - 1,
          selfLiked: false,
        };
      }
      return comment;
    });
    setCommentList(filterCommentData);
    try {
      await DisLikeCommentFunc({
        comment_id: comment_id,
        comment_type: 'COMMENT',
      });
      setLikeLoader(false);
    } catch (error) {
      console.error('Error disliking the post:', error);
      setLikeLoader(false);
    }
    setLikeLoader(false);
  };
  const LikeReply = async (reply_id, comment_id) => {
    setLikeLoader(true);
    const updatedComment = commentList.find(
      comment => comment.comment_id === comment_id,
    );
    if (updatedComment) {
      const newComment = {
        ...updatedComment,
        replies: {
          ...updatedComment.replies,
          reply: updatedComment.replies.reply.map(comment => {
            if (comment.comment_id == reply_id) {
              return {
                ...comment,
                selfLiked: true,
                likes_count: comment?.likes_count + 1,
              };
            }
            return comment;
          }),
        },
      };
      const updatedCommentList = commentList.map(comment =>
        comment.comment_id === comment_id ? newComment : comment,
      );
      setCommentList(updatedCommentList);
      try {
        await LikeCommentFunc({
          comment_id: reply_id,
          comment_type: 'REPLY',
        });
        setLikeLoader(false);
      } catch (error) {
        console.error('Error disliking the post:', error);
        setLikeLoader(false);
      }
      setLikeLoader(false);
    }
    setLikeLoader(false);
  };
  const DisLikeReply = async (reply_id, comment_id) => {
    setLikeLoader(true);
    const updatedComment = commentList.find(
      comment => comment.comment_id === comment_id,
    );
    if (updatedComment) {
      const newComment = {
        ...updatedComment,
        replies: {
          ...updatedComment.replies,
          reply: updatedComment.replies.reply.map(comment => {
            if (comment.comment_id == reply_id) {
              return {
                ...comment,
                selfLiked: false,
                likes_count: comment?.likes_count - 1,
              };
            }
            return comment;
          }),
        },
      };
      const updatedCommentList = commentList.map(comment =>
        comment.comment_id === comment_id ? newComment : comment,
      );
      setCommentList(updatedCommentList);
      try {
        await DisLikeCommentFunc({
          comment_id: reply_id,
          comment_type: 'REPLY',
        });
        setLikeLoader(false);
      } catch (error) {
        console.error('Error disliking the post:', error);
        setLikeLoader(false);
      }
      setLikeLoader(false);
    }
    setLikeLoader(false);
  };
  // like unlike comment and reply functionality

  // Loading comments Replies
  const LoadCommentReplies = async comment_id => {
    const filterCommentData = commentList.map(comment => {
      if (comment.comment_id == comment_id) {
        return {
          ...comment,
          replyLoading: true,
        };
      }
      return comment;
    });
    setCommentList(filterCommentData);
    const result = await LoadReplies({
      comment_id: comment_id,
      page: 1,
      limit: 10,
    });
    if (result.message == 'Replies fetched successfully') {
      if (result.replies.length < 10) {
        const filterCommentData = commentList.map(comment => {
          if (comment.comment_id == comment_id) {
            return {
              ...comment,
              replyLoading: false,
              replyLoaded: true,
              replies: {
                reply: result?.replies,
                hasMore: false,
                page: 1,
              },
            };
          }
          return comment;
        });
        setCommentList(filterCommentData);
      } else {
        const filterCommentData = commentList.map(comment => {
          if (comment.comment_id == comment_id) {
            return {
              ...comment,
              replyLoading: false,
              replyLoaded: true,
              replies: {
                reply: result?.replies,
                hasMore: true,
                page: 1,
              },
            };
          }
          return comment;
        });
        setCommentList(filterCommentData);
      }
    } else {
      const filterCommentData = commentList.map(comment => {
        if (comment.comment_id == comment_id) {
          return {
            ...comment,
            replyLoading: false,
          };
        }
        return comment;
      });
      setCommentList(filterCommentData);
    }
  };
  const LoadMoreCommentReplies = async (comment_id, page) => {
    const filterCommentData = commentList.map(comment => {
      if (comment.comment_id == comment_id) {
        return {
          ...comment,
          replyLoading: true,
        };
      }
      return comment;
    });
    setCommentList(filterCommentData);
    const result = await LoadReplies({
      comment_id: comment_id,
      page: page,
      limit: 10,
    });
    if (result.replies.length < 10) {
      const filterCommentData = commentList.map(comment => {
        if (comment.comment_id == comment_id) {
          return {
            ...comment,
            replyLoading: false,
            replies: {
              page: page,
              reply: [...comment?.replies?.reply, ...result?.replies],
              hasMore: false,
            },
          };
        }
        return comment;
      });
      setCommentList(filterCommentData);
    } else {
      const filterCommentData = commentList.map(comment => {
        if (comment.comment_id == comment_id) {
          return {
            ...comment,
            replyLoading: false,
            replies: {
              page: page,
              reply: [...comment?.Replies, ...result?.replies],
              hasMore: true,
            },
          };
        }
        return comment;
      });
      setCommentList(filterCommentData);
      setLoadMoreLoading(false);
    }
  };
  const CloseCommentReplies = async comment_id => {
    const filterCommentData = commentList.map(comment => {
      if (comment.comment_id == comment_id) {
        return {
          ...comment,
          replyLoading: false,
          replyLoaded: false,
          replies: {
            page: 1,
            reply: [],
          },
        };
      }
      return comment;
    });
    setCommentList(filterCommentData);
  };
  const LoadRefreashReplies = async (comment_id, increase) => {
    const result = await LoadReplies({
      comment_id: comment_id,
      page: 1,
      limit: 10,
    });
    if (result.message == 'Replies fetched successfully') {
      if (result.replies.length < 10) {
        const filterCommentData = commentList.map(comment => {
          if (comment.comment_id == comment_id) {
            return {
              ...comment,
              replyLoading: false,
              replyLoaded: true,
              replies_count: increase
                ? comment.replies_count + 1
                : comment.replies_count - 1,
              replies: {
                reply: result?.replies,
                hasMore: false,
                page: 1,
              },
            };
          }
          return comment;
        });
        setCommentList(filterCommentData);
        setDeleteLoader(false);
      } else {
        const filterCommentData = commentList.map(comment => {
          if (comment.comment_id == comment_id) {
            return {
              ...comment,
              replyLoading: false,
              replyLoaded: true,
              replies_count: increase
                ? comment.replies_count + 1
                : comment.replies_count - 1,
              replies: {
                reply: result?.replies,
                hasMore: true,
                page: 1,
              },
            };
          }
          return comment;
        });
        setCommentList(filterCommentData);
        setDeleteLoader(false);
      }
    } else {
      const filterCommentData = commentList.map(comment => {
        if (comment.comment_id == comment_id) {
          return {
            ...comment,
            replyLoading: false,
            replyLoaded: true,
            replies_count: increase
              ? comment.replies_count + 1
              : comment.replies_count - 1,
            replies: {
              reply: result?.replies,
              hasMore: false,
              page: 1,
            },
          };
        }
        return comment;
      });
      setCommentList(filterCommentData);
      setDeleteLoader(false);
    }
  };
  // Loading comments Replies

  // commment add funtion
  const commentAdder = async () => {
    setCommentAddLoading(true);
    commentScrollRef.current.scrollTo(0);
    const user_name = await AsyncStorage.getItem('Name');
    const user_Picture = await AsyncStorage.getItem('Picture');
    setCommentList(prev => [
      {
        comment: commentInfo,
        user: {
          profile_picture_url: user_Picture,
          user_name: user_name,
        },
        posting: true,
      },
      ...prev,
    ]);
    const comments = await AddComment({
      comment_type: 'COMMENT',
      comment: commentInfo,
      parent_id: postId,
    });
    if (comments?.statusCode == 200) {
      setCommentPage(1);
      openCommentSection(false);
      setCommentInfo('');
      setCommentAddLoading(false);
    } else {
      setCommentAddLoading(false);
      setCommentList(prev => [
        {
          comment: commentInfo,
          user: {
            profile_picture_url: user_Picture,
            user_name: user_name,
          },
          posting: 'crash',
        },
        ...prev?.filter(d => d.posting !== true),
      ]);
    }
  };
  const commentRetry = async () => {
    setCommentAddLoading(true);
    commentScrollRef.current.scrollTo(0);
    const user_name = await AsyncStorage.getItem('Name');
    const user_Picture = await AsyncStorage.getItem('Picture');
    const modifiedComments = commentList.map(data => {
      if (data.posting === 'crash') {
        return {
          ...data,
          posting: true,
        };
      }
      return data;
    });
    setCommentList(modifiedComments);
    try {
      const comments = await AddComment({
        comment_type: 'COMMENT',
        comment: commentInfo,
        parent_id: postId,
      });
      if (comments?.statusCode == 200) {
        setCommentPage(1);
        openCommentSection(false);
        setCommentInfo('');
        setCommentAddLoading(false);
      } else {
        setCommentList(prev => [
          {
            comment: commentInfo,
            user: {
              profile_picture_url: user_Picture,
              user_name: user_name,
            },
            posting: 'crash',
          },
          ...prev.filter(d => d.posting !== true && d.posting !== 'crash'),
        ]);
        setCommentAddLoading(false);
      }
    } catch (error) {
      setCommentList(prev => [
        {
          comment: commentInfo,
          user: {
            profile_picture_url: user_Picture,
            user_name: user_name,
          },
          posting: 'crash',
        },
        ...prev.filter(d => d.posting !== true && d.posting !== 'crash'),
      ]);
      console.error('Error adding comment:', error);
      setCommentAddLoading(false);
    }
  };
  // commment add funtion

  // reply add funtion
  const ReplyAdder = async () => {
    setReplyAddLoader(true);
    commentScrollRef.current.scrollTo(0);
    const user_name = await AsyncStorage.getItem('Name');
    const user_Picture = await AsyncStorage.getItem('Picture');
    const updatedComment = commentList.find(
      comment => comment.comment_id === replyComment?.comment_id,
    );
    if (updatedComment) {
      const newComment = {
        ...updatedComment,
        replies_count: updatedComment.replies_count + 1,
        replies: {
          ...updatedComment.replies,
          reply: [
            {
              comment: commentInfo,
              user: {
                profile_picture_url: user_Picture,
                user_name: user_name,
              },
              posting: true,
            },
            ...updatedComment.replies.reply,
          ],
        },
      };
      const updatedCommentList = commentList.map(comment =>
        comment.comment_id === replyComment?.comment_id ? newComment : comment,
      );
      setCommentList(updatedCommentList);
      const comments = await AddComment({
        comment_type: 'REPLY',
        comment: commentInfo,
        parent_id: replyComment?.comment_id,
      });
      if (comments?.statusCode == 200) {
        setCommentInfo('');
        setReplyComment('');
        LoadRefreashReplies(replyComment?.comment_id, true);
        setReplyAddLoader(false);
      } else {
        setReplyAddLoader(false);
      }
    }
  };
  // reply add function

  const CommentItem = React.memo(
    ({
      likeLoader,
      deleteLoader,
      CloseCommentReplies,
      LikeComment,
      DisLikeComment,
      DeleteComment,
      replyCommentId,
      replyLoading,
      LoadCommentReplies,
      data,
      commentRetry,
      setReplyComment,
    }) => {
      return (
        <Comments
          likeLoader={likeLoader}
          deleteLoader={deleteLoader}
          CloseCommentReplies={CloseCommentReplies}
          LikeComment={LikeComment}
          DisLikeComment={DisLikeComment}
          DeleteComment={DeleteComment}
          replyCommentId={replyCommentId}
          replyLoading={replyLoading}
          LoadCommentReplies={LoadCommentReplies}
          data={data}
          commentRetry={commentRetry}
          setReplyComment={setReplyComment}
        />
      );
    },
  );
  const ReplyItem = React.memo(
    ({
      likeLoader,
      deleteLoader,
      LikeReply,
      DisLikeReply,
      data,
      commentRetry,
      setReplyComment,
      DeleteReply,
    }) => {
      return (
        <Reply
          likeLoader={likeLoader}
          deleteLoader={deleteLoader}
          LikeReply={LikeReply}
          DisLikeReply={DisLikeReply}
          DeleteReply={DeleteReply}
          data={data}
          commentRetry={commentRetry}
          setReplyComment={setReplyComment}
        />
      );
    },
  );


  const toggleShare = () => {
    setIsShareModal(!isShareModal);
  };
  const [Winheight, setHeight] = useState(windowHeight * 0.4);
  const handleSetHeight = useCallback(e => {
    const naturalRatio = 16 / 13;
    const videoRatio = e.naturalSize.width / e.naturalSize.height;
    if (videoRatio !== naturalRatio) {
      setHeight(prevHeight => (prevHeight * naturalRatio) / videoRatio);
    }
  }, []);


  const style = StyleSheet.create({
    PostHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: ResponsiveSize(10),
      paddingHorizontal: ResponsiveSize(15),
      width: windowWidth,
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
      height: commentSectioLength * 0.1,
      width: commentSectioLength * 0.1,
      borderRadius: commentSectioLength * 0.1,
      backgroundColor: global.description,
      marginRight: ResponsiveSize(10),
      overflow: 'hidden',
    },
    PostProfileImageBox: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'center',
    },
    PostActionDot: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    ActuallPost: {
      height: windowHeight * 0.48,
      width: windowWidth,
      borderRadius: 0,
    },
    postActionSection: {
      flexDirection: 'row',
      paddingVertical: ResponsiveSize(12),
      paddingHorizontal: ResponsiveSize(15),
      width: windowWidth,
    },
    PostDetail: {
      textAlign: 'left',
      paddingHorizontal: ResponsiveSize(15),
    },
    commentSectionProfile: {
      height: commentSectioLength * 0.1,
      width: commentSectioLength * 0.1,
      backgroundColor: 'red',
      borderRadius: commentSectioLength * 0.1,
      overflow: 'hidden',
      marginTop: ResponsiveSize(5),
    },
    PostIcons: {
      paddingHorizontal: ResponsiveSize(5),
    },
    PostIcons1: {
      paddingLeft: 0,
      paddingRight: ResponsiveSize(5),
    },
    CommnetAdd: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: ResponsiveSize(20),
      paddingVertical: ResponsiveSize(5),
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
      width: ResponsiveSize(21),
    },
    PostDate: {
      paddingHorizontal: ResponsiveSize(15),
      paddingVertical: ResponsiveSize(5),
    },
    DescriptionStyle: {
      fontFamily: 'Montserrat-Medium',
      fontSize: ResponsiveSize(10),
      marginTop: ResponsiveSize(5),
      color: global.black,
    },
    commentKeyBoard: {
      height: ResponsiveSize(90),
      width: windowWidth,
      backgroundColor: global.black,
      position: 'absolute',
      bottom: ResponsiveSize(10),
    },
    playPaused: {
      position: 'absolute',
      top: 0,
      left: 0,
      borderWidth: 0,
      alignItems: 'center',
      justifyContent: 'center',
      width: windowWidth,
      height: windowHeight * 0.43,
      flexDirection: 'row',
    },
    commentAdd: {
      position: 'absolute',
      bottom: 0,
      width: windowWidth,
    },
    commentInput: {
      backgroundColor: '#EEEEEE',
      borderTopColor: '#cccccc',
      borderTopWidth: 1,
      paddingLeft: ResponsiveSize(15),
      paddingVertical: ResponsiveSize(10),
      fontFamily: 'Montserrat-Medium',
      height: ResponsiveSize(45),
    },
    sendCommentBtn: {
      backgroundColor: global.secondaryColor,
      position: 'absolute',
      right: ResponsiveSize(10),
      top: ResponsiveSize(7.5),
      height: ResponsiveSize(30),
      width: ResponsiveSize(30),
      borderRadius: ResponsiveSize(30),
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: ResponsiveSize(15),
      paddingRight: ResponsiveSize(2),
    },
    modalTopLayer: {
      height: windowHeight * 0.7,
      width: windowWidth,
      paddingTop: 10,
      position: 'absolute',
      backgroundColor: 'white',
      bottom: ResponsiveSize(0),
      borderTopLeftRadius: ResponsiveSize(15),
      borderTopRightRadius: ResponsiveSize(15),
      overflow: 'hidden',
      zIndex: 999,
    },
    modalTopLayerReport: {
      height: windowHeight * 0.15,
      width: windowWidth,
      paddingTop: 10,
      position: 'absolute',
      backgroundColor: 'white',
      bottom: ResponsiveSize(0),
      borderTopLeftRadius: ResponsiveSize(15),
      borderTopRightRadius: ResponsiveSize(15),
      overflow: 'hidden',
      zIndex: 999,
    },

    modalTopLayerReportSecond: {
      height: windowHeight * 0.35,
      width: windowWidth * 0.8,
      paddingTop: 10,
      backgroundColor: 'white',
      borderRadius: ResponsiveSize(15),
      overflow: 'hidden',
      zIndex: 999,
      flexDirection: 'column',
      alignItems: 'center'
    },
    TopIndicator: {
      width: windowWidth,
      paddingVertical: ResponsiveSize(2),
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
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
    },
    replyBox: {
      height: ResponsiveSize(40),
      width: windowWidth,
      backgroundColor: '#EEEEEE',
      borderTopLeftRadius: ResponsiveSize(10),
      borderTopRightRadius: ResponsiveSize(10),
      paddingHorizontal: ResponsiveSize(15),
      elevation: 5,
      shadowColor: 'black',
      shadowOffset: { width: -2, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    ProfileReplyBoxProfile: {
      height: ResponsiveSize(25),
      width: ResponsiveSize(25),
      backgroundColor: 'gray',
      borderRadius: ResponsiveSize(50),
      overflow: 'hidden',
      marginRight: ResponsiveSize(5),
      flexDirection: 'row',
      alignItems: 'center',
    },
    ProfileReplyBox: {
      height: ResponsiveSize(25),
      width: windowWidth * 0.5,
      borderRadius: ResponsiveSize(50),
      overflow: 'hidden',
      marginRight: ResponsiveSize(5),
      flexDirection: 'row',
      alignItems: 'center',
    },
    DeleteBtn: {
      height: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: 'red',
    },
    ReportBtnComment: {
      width: ResponsiveSize(50),
      height: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'red',
    },
    DeleteBtnComment: {
      width: ResponsiveSize(50),
      height: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'red',
    },
    TextInputBackground: {
      backgroundColor: '#EEEEEE',
      marginTop: ResponsiveSize(20),
      height: ResponsiveSize(180),
      borderRadius: ResponsiveSize(20),
    },
    SharePostBackground: {
      paddingHorizontal: ResponsiveSize(10),
      fontFamily: 'Montserrat-Medium',
      paddingTop: ResponsiveSize(10)
    },
    ConnectionList: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: ResponsiveSize(15)
    },
    ConnectionListIcon: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: ResponsiveSize(60),
      textAlign: 'center'
    },
    ConnectionIconDp: {
      height: ResponsiveSize(45),
      width: ResponsiveSize(45),
      backgroundColor: 'gray',
      borderRadius: ResponsiveSize(50),
      overflow: 'hidden',
      marginLeft: ResponsiveSize(5),
      marginBottom: ResponsiveSize(3),
    },
    ConnectionIconDpAbdolute: {
      position: 'relative'
    },
    ConnectionSentBtn: {
      backgroundColor: global.secondaryColor,
      paddingHorizontal: ResponsiveSize(10),
      paddingVertical: ResponsiveSize(10),
      borderRadius: ResponsiveSize(10),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    ResharePostHeader: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: windowWidth,
      paddingHorizontal: ResponsiveSize(15),
      paddingVertical: ResponsiveSize(10),
      zIndex: 10000,
      flexDirection: 'row',
      alignItems: 'center',
    },
    ResharePostFooter: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: windowWidth,
      paddingHorizontal: ResponsiveSize(10),
      paddingVertical: ResponsiveSize(15),
      zIndex: 10000,
      flexDirection: 'row',
      alignItems: 'center',
    },
    ResharePostHeaderDp: {
      height: ResponsiveSize(35),
      width: ResponsiveSize(35),
      backgroundColor: 'gray',
      borderRadius: ResponsiveSize(50),
      overflow: 'hidden',
    }
  });


  const [reShareLoader, setReshareLoader] = useState(false)
  const [MsgReShareLoader, setMsgReshareLoader] = useState()
  const [reShareCaption, setReShareCaption] = useState("")
  const [reportPostDescription, setReportPostDescription] = useState("")
  const [reportLoading, setReportLoading] = useState(false)

  const ResharePost = async () => {
    setReshareLoader(true)
    console.log('step1')
    const Token = await AsyncStorage.getItem('Token');
    const formData = new FormData();
    formData.append('caption', reShareCaption);
    formData.append('privacy_setting', 'PUBLIC');
    formData.append('reshared_post_id', postId);
    const response = await fetch(`${baseUrl.baseUrl}/posts/createPost`, {
      method: "POST",
      headers: {
        'Content-Type': 'multipart/form-data',
        'x-api-key': baseUrl.apiKey,
        'accesstoken': `Bearer ${Token}`
      },
      body: formData
    });
    const jsonResponse = await response.json();
    setReshareLoader(false)
    setIsShareModal(false)
  }
  const sendMessage = async (message_Props, user_Id) => {
    setMsgReshareLoader({ user_Id: user_Id, value: true })
    const Token = await AsyncStorage.getItem('Token');
    const socket = io(`${baseUrl.baseUrl}/chat`, {
      transports: ['websocket'],
      extraHeaders: {
        'x-api-key': "TwillioAPI",
        'accesstoken': `Bearer ${Token}`
      }
    });
    socket.on('connect').emit('createDirectMessage', {
      "message": "Post shared",
      "receiverUserId": user_Id,
      "post_id": message_Props
    })
    setTimeout(() => {
      setMsgReshareLoader({ user_Id: user_Id, value: false })
    }, 2000);
  }


  const OpenRepostModal = () => {
    setIsReportVisible(false)
    setIsReportSecondVisible(true)
  }




  const [reportedPostId, setReportedPostId] = useState()
  const addReportPost = async () => {
    setReportLoading(true)
    const Token = await AsyncStorage.getItem('Token');
    const response = await fetch(`${baseUrl.baseUrl}/report/report-post`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': baseUrl.apiKey,
        'accesstoken': `Bearer ${Token}`
      },
      body: JSON.stringify({
        parent_id: postId,
        report_reason: reportPostDescription
      })

    });
    const res = await response?.json();
    if (res?.statusCode) {
      setReportLoading(false)
      setIsReportSecondVisible(false)
      setReportedPostId(postId)
      setTimeout(() => {
        setReportedPostId("")
      }, 5000);
    }
  }
  return (
    <>
      {reportedPostId == postId ?
        <View>
          <TextC font={"Montserrat-Bold"} size={ResponsiveSize(21)} text={"Post is Reported"} />
        </View>
        :
        <>
          {content?.length > 0 ?
            <View>
              <View style={style.PostHeader}>
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity onPress={() => navigation.navigate('UserProfileScreen', { user_id: user_idIn })}>
                    <FastImage
                      source={
                        profileImage == ''
                          ? require('../../assets/icons/avatar.png')
                          : { uri: profileImage, priority: FastImage.priority.high }
                      }
                      style={style.PostProfileImage}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                  <View style={style.PostProfileImageBox}>
                    <TouchableOpacity onPress={() => navigation.navigate('UserProfileScreen', { user_id: user_idIn })}>
                      <TextC
                        size={ResponsiveSize(12)}
                        text={userName}
                        font={'Montserrat-Bold'}
                      />
                    </TouchableOpacity>
                    <TextC
                      size={ResponsiveSize(10)}
                      text={userLocation}
                      font={'Montserrat-Medium'}
                    />
                  </View>
                </View>
                <View>
                  <TouchableOpacity onPress={() => setIsReportVisible(true)}>
                    <Entypo color={global.primaryColor} size={ResponsiveSize(17)} name='dots-three-vertical' />
                  </TouchableOpacity>
                </View>
              </View>
              {content?.length > 1 ? (
                <Carousel
                  loop={false}
                  width={windowWidth}
                  height={windowHeight * 0.4}
                  autoPlay={false}
                  data={content}
                  scrollAnimationDuration={1000}
                  renderItem={items => {
                    return (
                      <>
                        {items.item?.attachment_url.endsWith('.mp4') ? (
                          <View
                            style={{
                              height: windowHeight * 0.4,
                              width: windowWidth,
                              backgroundColor: 'red',
                              backgroundColor: global.description,
                            }}>
                            <Pressable
                              onPress={() => setPause(!paused)}
                              style={{ position: 'relative' }}>
                              <Video
                                repeat={true}
                                source={{
                                  uri: items.item?.attachment_thumbnail_url,
                                }}
                                ref={videoRef}
                                paused={paused}
                                style={{ height: windowHeight * 0.4, width: windowWidth }}
                              />
                              {paused && (
                                <View style={style.playPaused}>
                                  <Entypo
                                    size={ResponsiveSize(50)}
                                    name="controller-play"
                                    color={'white'}
                                  />
                                </View>
                              )}
                            </Pressable>
                          </View>
                        ) : (
                          <Image
                            source={{ uri: items.item?.attachment_thumbnail_url }}
                            style={style.ActuallPost}
                          />
                        )}
                      </>
                    );
                  }}
                />
              ) : (
                <>
                  {content[0]?.attachment_url.endsWith('.mp4') ? (
                    <View
                      style={{
                        height: Winheight,
                        width: windowWidth,
                        backgroundColor: 'red',
                      }}>
                      <Video
                        onLoad={handleSetHeight}
                        repeat={true}
                        source={{
                          uri: content[0]?.attachment_thumbnail_url,
                        }}
                        ref={videoRef}
                        paused={false}
                        style={{ height: Winheight, width: windowWidth }}
                      />
                    </View>
                  ) : (
                    <View style={{ position: 'relative' }}>
                      {content_type == "POST_RESHARE" ?
                        <>
                          <View style={style.ResharePostHeader}>
                            <FastImage
                              source={{
                                uri: reshareUserDetails?.profile_picture_url,
                                priority: FastImage.priority.high,
                              }}
                              style={style.ResharePostHeaderDp}
                            />
                            <TextC text={reshareUserDetails?.user_name} font={'Montserrat-Bold'} style={{ marginLeft: ResponsiveSize(8), color: global.white }} />
                          </View>
                          <FastImage
                            source={{
                              uri: content[0]?.attachment_thumbnail_url,
                              priority: FastImage.priority.high,
                            }}
                            style={style.ActuallPost}
                          />
                          <View style={style.ResharePostFooter}>
                            <TextC text={reshareUserDetails?.old_caption} font={'Montserrat-SemiBold'} style={{ marginLeft: ResponsiveSize(8), color: global.white }} />
                          </View>
                        </>
                        :
                        <FastImage
                          source={{
                            uri: content[0]?.attachment_thumbnail_url,
                            priority: FastImage.priority.high,
                          }}
                          resizeMode='cover'
                          style={style.ActuallPost}
                        />
                      }
                    </View>
                  )}
                </>
              )}
              <View style={style.postActionSection}>
                <Pressable
                  onPress={liked ? handleDislike : handleLike}
                  style={style.PostIcons1}>
                  <AntDesign
                    name={liked ? 'heart' : 'hearto'}
                    color={liked ? global.red : global.primaryColor}
                    size={ResponsiveSize(22)}
                  />
                </Pressable>
                {allow_comments_flag == 'Y' && (
                  <Pressable onPress={() => toggleModal()} style={style.PostIcons}>
                    <Image
                      source={CommnetLight}
                      style={{ height: ResponsiveSize(20), width: ResponsiveSize(20) }}
                    />
                  </Pressable>
                )}
                <Pressable onPress={() => toggleShare()} style={style.PostIcons}>
                  <Image
                    source={ShareLight}
                    style={{
                      height: ResponsiveSize(20),
                      width: ResponsiveSize(20),
                      marginTop: 1,
                    }}
                  />
                </Pressable>
              </View>
              <View style={style.PostDetail}>
                {likes_show_flag == 'Y' && (
                  <TextC
                    size={ResponsiveSize(10)}
                    text={`${likeCountPre} likes`}
                    font={'Montserrat-Medium'}
                  />
                )}
                {description !== '' ? (
                  <View style={{ paddingVertical: ResponsiveSize(3) }}>
                    <ReadMore
                      seeLessStyle={{
                        fontFamily: 'Montserrat-Bold',
                        color: global.primaryColor,
                      }}
                      seeMoreStyle={{
                        fontFamily: 'Montserrat-Bold',
                        color: global.primaryColor,
                      }}
                      numberOfLines={2}
                      style={style.DescriptionStyle}>
                      {description}
                    </ReadMore>
                  </View>
                ) : (
                  ''
                )}
                {allow_comments_flag == 'Y' ? (
                  <>
                  </>
                ) : (
                  <TouchableOpacity style={{ paddingTop: ResponsiveSize(3) }}>
                    <TextC
                      size={ResponsiveSize(10)}
                      text={'Comments are turned off'}
                      font={'Montserrat-Medium'}
                    />
                  </TouchableOpacity>
                )}
              </View>
              <View style={style.PostDate}>
                <TimeAgo
                  style={{
                    fontFamily: 'Montserrat-Medium',
                    fontSize: ResponsiveSize(10),
                    color: '#DADADA',
                  }}
                  time={timeAgo}
                  hideago={true}
                />
              </View>
            </View>
            : 
            <View>
              <View style={style.PostHeader}>
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity onPress={() => navigation.navigate('UserProfileScreen', { user_id: user_idIn })}>
                    <FastImage
                      source={
                        profileImage == ''
                          ? require('../../assets/icons/avatar.png')
                          : { uri: profileImage, priority: FastImage.priority.high }
                      }
                      style={style.PostProfileImage}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                  <View style={style.PostProfileImageBox}>
                    <TouchableOpacity onPress={() => navigation.navigate('UserProfileScreen', { user_id: user_idIn })}>
                      <TextC
                        size={ResponsiveSize(12)}
                        text={userName}
                        font={'Montserrat-Bold'}
                      />
                    </TouchableOpacity>
                    <TextC
                      size={ResponsiveSize(10)}
                      text={userLocation}
                      font={'Montserrat-Medium'}
                    />
                  </View>
                </View>
                <View>
                  <TouchableOpacity onPress={() => setIsReportVisible(true)}>
                    <Entypo color={global.primaryColor} size={ResponsiveSize(17)} name='dots-three-vertical' />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{paddingVertical:ResponsiveSize(5),paddingHorizontal:ResponsiveSize(15)}}>
                <TextC
                  size={ResponsiveSize(13)}
                  text={description}
                  font={'Montserrat-SemiBold'}
                  style={{color:global.placeholderColor,width:windowWidth - ResponsiveSize(30)}}
                />
              </View>
              <View style={style.postActionSection}>
                <Pressable
                  onPress={liked ? handleDislike : handleLike}
                  style={style.PostIcons1}>
                  <AntDesign
                    name={liked ? 'heart' : 'hearto'}
                    color={liked ? global.red : global.primaryColor}
                    size={ResponsiveSize(22)}
                  />
                </Pressable>
                {allow_comments_flag == 'Y' && (
                  <Pressable onPress={() => toggleModal()} style={style.PostIcons}>
                    <Image
                      source={CommnetLight}
                      style={{ height: ResponsiveSize(20), width: ResponsiveSize(20) }}
                    />
                  </Pressable>
                )}
                <Pressable onPress={() => toggleShare()} style={style.PostIcons}>
                  <Image
                    source={ShareLight}
                    style={{
                      height: ResponsiveSize(20),
                      width: ResponsiveSize(20),
                      marginTop: 1,
                    }}
                  />
                </Pressable>
              </View>
              <View style={style.PostDetail}>
                {likes_show_flag == 'Y' && (
                  <TextC
                    size={ResponsiveSize(10)}
                    text={`${likeCountPre} likes`}
                    font={'Montserrat-Medium'}
                  />
                )}
                {allow_comments_flag == 'Y' ? (
                  <>
                  </>
                ) : (
                  <TouchableOpacity style={{ paddingTop: ResponsiveSize(3) }}>
                    <TextC
                      size={ResponsiveSize(10)}
                      text={'Comments are turned off'}
                      font={'Montserrat-Medium'}
                    />
                  </TouchableOpacity>
                )}
              </View>
              <View style={style.PostDate}>
                <TimeAgo
                  style={{
                    fontFamily: 'Montserrat-Medium',
                    fontSize: ResponsiveSize(10),
                    color: '#DADADA',
                  }}
                  time={timeAgo}
                  hideago={true}
                />
              </View>
            </View>
          }
        </>
      }
      <Modal
        isVisible={isModalVisible}
        style={{ margin: 0 }}
        animationIn={'bounceInUp'}
        avoidKeyboard={true}
        onBackdropPress={() => closeCommentFunction()}
        statusBarTranslucent={false}>
        <View style={style.modalTopLayer}>
          <View style={style.TopIndicator}>
            <View style={style.modalIndicator}></View>
            <TextC
              text={'Comments'}
              style={{ color: global.black, paddingTop: ResponsiveSize(3) }}
              font={'Montserrat-Bold'}
              size={ResponsiveSize(12)}
            />
          </View>
          {commentLoading ? (
            <View
              style={{
                paddingTop: ResponsiveSize(50),
                width: windowWidth,
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <ActivityIndicator size="large" color={global.primaryColor} />
            </View>
          ) : (
            <ScrollView
              ref={commentScrollRef}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: ResponsiveSize(50),
                paddingTop: ResponsiveSize(10),
                flex: 1,
              }}>
              {commentList.length > 0 ? (
                <FlatList
                  showsVerticalScrollIndicator={false}
                  initialNumToRender={10}
                  data={commentList}
                  keyExtractor={(items, index) => index?.toString()}
                  maxToRenderPerBatch={10}
                  windowSize={10}
                  onEndReached={() => {
                    if (!allDataLoaded && !commentLoadingPage) {
                      setCommentPage(prev => prev + 1);
                    }
                  }}
                  onEndReachedThreshold={0.5}
                  renderItem={items => {
                    return (
                      <>
                        <CommentItem
                          likeLoader={likeLoader}
                          deleteLoader={deleteLoader}
                          CloseCommentReplies={CloseCommentReplies}
                          LikeComment={LikeComment}
                          DisLikeComment={DisLikeComment}
                          DeleteComment={DeleteComment}
                          replyCommentId={replyCommentId}
                          replyLoading={replyLoading}
                          LoadCommentReplies={LoadCommentReplies}
                          data={items.item}
                          commentRetry={commentRetry}
                          setReplyComment={setReplyComment}
                        />
                        <FlatList
                          showsVerticalScrollIndicator={false}
                          initialNumToRender={10}
                          data={items?.item?.replies?.reply}
                          keyExtractor={(items, index) => index?.toString()}
                          maxToRenderPerBatch={10}
                          windowSize={10}
                          renderItem={items => (
                            <>
                              <View
                                style={{
                                  width: windowWidth,
                                  paddingLeft: ResponsiveSize(40),
                                }}>
                                <ReplyItem
                                  likeLoader={likeLoader}
                                  deleteLoader={deleteLoader}
                                  LikeReply={LikeReply}
                                  DisLikeReply={DisLikeReply}
                                  DeleteReply={DeleteReply}
                                  data={items.item}
                                  commentRetry={commentRetry}
                                  setReplyComment={setReplyComment}
                                />
                              </View>
                            </>
                          )}
                          ListFooterComponent={() => {
                            return (
                              <>
                                {items?.item?.replies?.hasMore && (
                                  <>
                                    {items?.item?.replyLoading ? (
                                      <View
                                        style={{
                                          width: windowWidth,
                                          paddingLeft: ResponsiveSize(90),
                                          paddingTop: ResponsiveSize(10),
                                          paddingBottom: ResponsiveSize(20),
                                          flexDirection: 'row',
                                          alignItems: 'center',
                                          justifyContent: 'flex-start',
                                        }}>
                                        <ActivityIndicator
                                          size={ResponsiveSize(13)}
                                          color={global.primaryColor}
                                        />
                                      </View>
                                    ) : (
                                      <View
                                        style={{
                                          width: windowWidth,
                                          paddingLeft: ResponsiveSize(90),
                                          paddingTop: ResponsiveSize(10),
                                          paddingBottom: ResponsiveSize(20),
                                        }}>
                                        <TouchableOpacity
                                          onPress={() =>
                                            LoadMoreCommentReplies(
                                              items?.item?.comment_id,
                                              items?.item?.replies?.page + 1,
                                            )
                                          }>
                                          <TextC
                                            text={'Load more'}
                                            size={ResponsiveSize(10)}
                                            font={'Montserrat-SemiBold'}
                                            style={{
                                              color: global.primaryColor,
                                            }}
                                          />
                                        </TouchableOpacity>
                                      </View>
                                    )}
                                  </>
                                )}
                              </>
                            );
                          }}
                        />
                      </>
                    );
                  }}
                  ListFooterComponent={
                    commentLoadingPage ? (
                      <ActivityIndicator
                        size={'small'}
                        color={global.primaryColor}
                      />
                    ) : null
                  }
                />
              ) : (
                <View
                  style={{
                    width: windowWidth,
                    paddingTop: ResponsiveSize(100),
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <TextC
                    style={{
                      color: global.primaryColor,
                      paddingTop: ResponsiveSize(3),
                    }}
                    font={'Montserrat-Bold'}
                    size={ResponsiveSize(12)}
                    text={'No comments yet'}
                  />
                </View>
              )}
            </ScrollView>
          )}
          <View style={style.commentAdd}>
            {replyComment !== '' && (
              <View style={style.replyBox}>
                <View style={style.ProfileReplyBox}>
                  <Image
                    style={style.ProfileReplyBoxProfile}
                    source={{ uri: replyComment?.user?.profile_picture_url }}
                  />
                  <TextC
                    font={'Montserrat-Medium'}
                    size={ResponsiveSize(11)}
                    text={`Reply to ${replyComment?.user?.user_name}`}
                  />
                </View>
                <TouchableOpacity onPress={() => setReplyComment('')}>
                  <AntDesign
                    name="close"
                    color={global.black}
                    size={ResponsiveSize(13)}
                  />
                </TouchableOpacity>
              </View>
            )}
            <View
              keyboardShouldPersistTaps="handled"
              style={{ width: windowWidth, position: 'relative' }}>
              <TextInput
                editable={!commentAddLoading && !replyAddLoader}
                value={commentInfo}
                onChangeText={e => setCommentInfo(e)}
                placeholder="Comment here"
                style={style.commentInput}
              />
              <TouchableOpacity
                disabled={
                  commentInfo === '' || commentAddLoading || replyAddLoader
                }
                onPress={() => {
                  if (replyComment?.comment_id) {
                    ReplyAdder();
                  } else {
                    commentAdder();
                  }
                }}
                style={style.sendCommentBtn}>
                {replyAddLoader ? (
                  <ActivityIndicator color={'white'} size={'small'} />
                ) : (
                  <Feather
                    name="send"
                    color={'white'}
                    size={ResponsiveSize(15)}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        isVisible={isShareModal}
        style={{ margin: 0 }}
        animationIn={'bounceInUp'}
        avoidKeyboard={true}
        onBackdropPress={() => setIsShareModal(!isShareModal)}
        statusBarTranslucent={false}>
        <View style={style.modalTopLayer}>
          <View style={style.TopIndicator}>
            <View style={style.modalIndicator}></View>
            <TextC
              text={'Share Post'}
              style={{ color: global.black, paddingTop: ResponsiveSize(3) }}
              font={'Montserrat-Bold'}
              size={ResponsiveSize(12)}
            />
          </View>

          <View style={{ paddingHorizontal: ResponsiveSize(15), paddingTop: ResponsiveSize(15) }}>
            <TextC
              text={'Share in community'}
              style={{ color: global.black, paddingTop: ResponsiveSize(3) }}
              font={'Montserrat-Bold'}
              size={ResponsiveSize(12)}
            />

            <View style={style.TextInputBackground}>
              <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: ResponsiveSize(10), paddingTop: ResponsiveSize(10) }}>
                <FastImage
                  source={
                    profileImage == ''
                      ? require('../../assets/icons/avatar.png')
                      : { uri: profileImage, priority: FastImage.priority.high }
                  }
                  style={style.PostProfileImage}
                  resizeMode="cover"
                />
                <TextC text={userName} font={'Montserrat-Bold'}
                  size={ResponsiveSize(14)} style={{ color: global.black }} />
              </View>
              <TextInput style={style.SharePostBackground} placeholder='Write something about this..' onChangeText={(e) => setReShareCaption(e)} />
              <View style={{ paddingHorizontal: ResponsiveSize(15), flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', height: ResponsiveSize(120) }}>
                <TouchableOpacity style={{ backgroundColor: global.secondaryColor, paddingHorizontal: ResponsiveSize(15), paddingVertical: ResponsiveSize(5), borderRadius: ResponsiveSize(20), width: ResponsiveSize(100) }} disabled={reShareLoader} onPress={() => ResharePost()}>
                  {reShareLoader ?
                    <ActivityIndicator color={global.white} size={ResponsiveSize(12)} />
                    :
                    <TextC
                      text={'Share now'}
                      style={{ color: global.white }}
                      font={'Montserrat-Medium'}
                      size={ResponsiveSize(12)}
                    />
                  }

                </TouchableOpacity>
              </View>
            </View>

            <View style={{ paddingTop: ResponsiveSize(15) }}>
              <TextC
                text={'Share in message'}
                style={{ color: global.black, paddingTop: ResponsiveSize(3) }}
                font={'Montserrat-Bold'}
                size={ResponsiveSize(12)}
              />
            </View>
            <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} contentContainerStyle={style.ConnectionList}>
              {getLatestConnection !== undefined && getLatestConnection !== null && getLatestConnection !== "" && getLatestConnection?.length > 0 ? getLatestConnection?.map(data =>
                <TouchableOpacity disabled={MsgReShareLoader?.value} style={style.ConnectionListIcon} onPress={() => sendMessage(postId, data?.user_id)}>
                  <View style={style.ConnectionIconDpAbdolute}>
                    <FastImage
                      source={
                        data?.profile_picture_url == ''
                          ? require('../../assets/icons/avatar.png')
                          : { uri: data?.profile_picture_url, priority: FastImage.priority.high }
                      }
                      style={style.ConnectionIconDp}
                      resizeMode="cover"
                    />
                    {MsgReShareLoader?.user_Id == data?.user_id && MsgReShareLoader?.value == true ?
                      <ActivityIndicator size={ResponsiveSize(40)} color={global.white} style={{ position: 'absolute', top: ResponsiveSize(3), left: ResponsiveSize(7) }} />
                      : ""
                    }
                  </View>
                  <TextC text={data?.user_name} font={'Montserrat-Bold'} size={ResponsiveSize(11)} style={{ width: ResponsiveSize(50), textAlign: 'center' }} ellipsizeMode={"tail"} numberOfLines={1} />
                </TouchableOpacity>
              ) : ""}
            </ScrollView>
          </View>
        </View>
      </Modal>
      <Modal
        isVisible={isReportVisible}
        style={{ margin: 0 }}
        animationIn={'bounceInUp'}
        avoidKeyboard={true}
        onBackdropPress={() => setIsReportVisible(false)}
        statusBarTranslucent={false}>
        <View style={style.modalTopLayerReport}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <TextC
              text={'Report Post'}
              style={{ color: global.black, paddingTop: ResponsiveSize(3) }}
              font={'Montserrat-Bold'}
              size={ResponsiveSize(12)}
            />
          </View>

          <View style={{ paddingHorizontal: ResponsiveSize(15), paddingTop: ResponsiveSize(20), flexDirection: "row", alignItems: 'center', justifyContent: 'center' }}>
            <TouchableOpacity onPress={OpenRepostModal}>
              <TextC
                text={'Report this post for inappropriate content'}
                style={{ color: global.red, paddingTop: ResponsiveSize(3) }}
                font={'Montserrat-Medium'}
                size={ResponsiveSize(12)}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        isVisible={isReportSecondVisible}
        style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
        animationIn={'bounceInUp'}
        avoidKeyboard={true}
        onBackdropPress={() => setIsReportSecondVisible(false)}
        statusBarTranslucent={false}>
        <View style={style.modalTopLayerReportSecond}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <TextC text={"Report"} font={"Montserrat-Bold"} />
          </View>
          <View style={{ paddingTop: ResponsiveSize(20) }}>
            <TextInput onChangeText={(e) => setReportPostDescription(e)} placeholder='Enter some description about post' style={{ fontSize: ResponsiveSize(11), fontFamily: "Montserrat-Medium", borderWidth: ResponsiveSize(1), borderColor: "#EEEEEE", padding: ResponsiveSize(10), width: windowWidth * 0.7, height: ResponsiveSize(100), borderRadius: ResponsiveSize(10) }} />
          </View>
          <View style={{ paddingTop: ResponsiveSize(20) }}>
            <TouchableOpacity onPress={addReportPost} style={{ backgroundColor: global.primaryColor, padding: ResponsiveSize(10), borderRadius: ResponsiveSize(10), width: windowWidth * 0.7, justifyContent: 'center', alignItems: 'center' }}>
              {reportLoading ?
                <ActivityIndicator size={'small'} color={global.white} />
                :
                <TextC text={"Submit"} font={"Montserrat-Bold"} size={ResponsiveSize(11)} style={{ color: global.white }} />
              }
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

function mapStateToProps({ PostCreationReducer }) {
  return { PostCreationReducer };
}
export default connect(mapStateToProps, PostCreationAction)(Post);
