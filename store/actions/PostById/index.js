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
        // Dispatch the start action to indicate the loading state
        dispatch({
            type: POST_GET_DETAIL_START,
            loading: true,
        });

        // Fetch the post detail from the API
        const response = await fetch(`${baseUrl.baseUrl}/posts/get-post-detail-by-post_id/${post_id}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': baseUrl.apiKey,
                'accesstoken': `Bearer ${Token}`,
            },
        });

        // If the response is successful
        if (response.ok) {
      
            const res = await response.json();
            if (res) {
             
                dispatch({
                    type: POST_GET_DETAIL_SUCCESS,
                    payload: res, // Pass the fetched post detail data
                    loading: false,
                });
                return res; // Optionally return the data for further use
            } else {
                dispatch({
                    type: POST_GET_DETAIL_SUCCESS,
                    payload: {}, // Empty payload if no data is received
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
