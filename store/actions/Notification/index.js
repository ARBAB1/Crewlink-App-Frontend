import baseUrl from '../../config.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    TASK_GET_ALLNOTIFICATIONS_START,
    TASK_GET_ALLNOTIFICATIONS_END,
    TASK_GET_ALLNOTIFICATIONS_END_ERROR,
} from '../types';

export const getAllNotifications = ({ page }) => async (dispatch, getState) => {
    const Token = await AsyncStorage.getItem('Token');
    try {
        if (page === 1) {
            dispatch({
                type: TASK_GET_ALLNOTIFICATIONS_START,
                loading: true,
            });
        }
        const response = await fetch(`${baseUrl.baseUrl}/notifications/get-users-notifications/${page}/5`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': baseUrl.apiKey,
                'accesstoken': `Bearer ${Token}`,
            },
        });

        if (response.ok) {
            const res = await response.json();
            
            if (res.notifications) {
          
                dispatch({
                    type: TASK_GET_ALLNOTIFICATIONS_END,
                    payload: res, // Pass the entire response to include unread count
                    loading: false,
                });
                return res.notifications; // Return the notifications to load into cache
            } else {
                dispatch({
                    type: TASK_GET_ALLNOTIFICATIONS_END,
                    payload: { notifications: [] }, // Empty if no notifications
                    loading: false,
                });
            }
        } else {
            dispatch({
                type: TASK_GET_ALLNOTIFICATIONS_END_ERROR,
                networkError: true,
            });
        }
    } catch (error) {
        dispatch({
            type: TASK_GET_ALLNOTIFICATIONS_END_ERROR,
            networkError: true,
        });
        console.log(error);
    }
};
