import baseUrl from '../../config.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    TASK_GET_ALLCITIES_START,
    TASK_GET_ALLCITIES_END,
    TASK_GET_ALLCITIES_END_ERROR,
} from '../types';

export const getAllCities = () => async (dispatch, getState) => {
    const Token = await AsyncStorage.getItem('Token');
    try {
       
            dispatch({
                type: TASK_GET_ALLCITIES_START,
                loading: true,
            });
        
        const response = await fetch(`${baseUrl.baseUrl}/check-in/get-checkin-city`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': baseUrl.apiKey,
                'accesstoken': `Bearer ${Token}`,
            },
        });

        if (response.ok) {
            const res = await response.json();

            if (res.data) {
          
                dispatch({
                    type: TASK_GET_ALLCITIES_END,
                    payload: res, // Pass the entire response to include unread count
                    loading: false,
                });
                return res.data; // Return the notifications to load into cache
            } else {
                dispatch({
                    type: TASK_GET_ALLCITIES_END,
                    payload: { res }, // Empty if no notifications
                    loading: false,
                });
            }
        } else {
            dispatch({
                type: TASK_GET_ALLCITIES_END_ERROR,
                networkError: true,
            });
        }
    } catch (error) {
        dispatch({
            type: TASK_GET_ALLCITIES_START,
            networkError: true,
        });
        console.log(error);
    }
};
