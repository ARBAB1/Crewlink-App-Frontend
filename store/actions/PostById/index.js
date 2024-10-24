import baseUrl from '../../config.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    POST_GET_DETAIL_START,
    POST_GET_DETAIL_SUCCESS,
    POST_GET_DETAIL_ERROR,
} from '../types';

export const getPostDetail = ({ post_id }) => async (dispatch) => {
    const Token = await AsyncStorage.getItem('Token');
    try {
        dispatch({
            type: POST_GET_DETAIL_START,
            loading: true,
        });
        const response = await fetch(`${baseUrl.baseUrl}/posts/get-post-detail-by-post_id/${post_id}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': baseUrl.apiKey,
                'accesstoken': `Bearer ${Token}`,
            },
        });
        if (response.ok) {
            const res = await response.json();
            if (res) {
             
                dispatch({
                    type: POST_GET_DETAIL_SUCCESS,
                    payload: res,
                    loading: false,
                });
                return res;
            } else {
                dispatch({
                    type: POST_GET_DETAIL_SUCCESS,
                    payload: {},
                    loading: false,
                });
            }
        } else {
            dispatch({
                type: POST_GET_DETAIL_ERROR,
                networkError: true,
            });
        }
    } catch (error) {
        dispatch({
            type: POST_GET_DETAIL_ERROR,
            networkError: true,
        });
        console.error("Error fetching post detail: ", error);
    }
};



export const LoadComments = (body) => async () => {
    console.log(body)
    const Token = await AsyncStorage.getItem('Token');
    try {
        const response = await fetch(`${baseUrl.baseUrl}/posts/get-posts-comment/${body?.post_id}/${body?.page}/${body?.limit}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': baseUrl.apiKey,
                'accesstoken': `Bearer ${Token}`
            },
        });
        if (response.ok) {
            const res = await response.json()
            return res;
        }
        else {
            return 'Something went wrong'
        }
    }
    catch (error) {
        return "Internal Server Error"
    }
}
export const LoadReplies = (body) => async () => {
    const Token = await AsyncStorage.getItem('Token');
    try {
        const response = await fetch(`${baseUrl.baseUrl}/posts/get-comment-replies/${body?.comment_id}/${body?.page}/${body?.limit}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': baseUrl.apiKey,
                'accesstoken': `Bearer ${Token}`
            },
        });
        if (response.ok) {
            const res = await response.json()

            return res;
        }
        else {
            return 'Something went wrong'
        }
    }
    catch (error) {
        return "Internal Server Error"
    }
}