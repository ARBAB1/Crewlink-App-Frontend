import baseUrl from '../../config.json'
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    TASK_GET_ALLCONNECTIONS_START,
    TASK_GET_ALLCONNECTIONS_END,
    TASK_GET_ALLCONNECTIONS_END_ERROR,
    TASK_GET_PENDINGCONNECTIONS_START,
    TASK_GET_PENDINGCONNECTIONS_END,
    TASK_GET_PENDINGCONNECTIONS_END_ERROR,
} from '../types'



export const getAllConnections = ({ page }) => async (dispatch, getState) => {
    const Token = await AsyncStorage.getItem('Token');
    try {
        if (page == 1) {
            dispatch({
                type: TASK_GET_ALLCONNECTIONS_START,
                loading: true,
            });
        }
        dispatch({
            type: TASK_GET_ALLCONNECTIONS_END_ERROR,
            networkError: false,
        });
        const response = await fetch(`${baseUrl.baseUrl}/connect/get-my-connections-list/${page}/100`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': baseUrl.apiKey,
                'accesstoken': `Bearer ${Token}`
            },
        });
        if (response.ok === true) {
            const res = await response.json()
            console.log(res,'"Response');
            if (res?.data) {
                dispatch({
                    type: TASK_GET_ALLCONNECTIONS_END,
                    loading: false,
                });
                return res?.data?.connections
            }
            else if (res.message == 'No Connections Data Found') {
                dispatch({
                    type: TASK_GET_ALLCONNECTIONS_END,
                    payload: [],
                    loading: false,
                });
            }
        }
        else {
            dispatch({
                type: TASK_GET_ALLCONNECTIONS_END_ERROR,
                networkError: true,
            });
            dispatch({
                type: TASK_GET_ALLCONNECTIONS_END,
                loading: false,
            });
        }
    }
    catch (error) {
        dispatch({
            type: TASK_GET_ALLCONNECTIONS_END_ERROR,
            networkError: true,
        });
        dispatch({
            type: TASK_GET_ALLCONNECTIONS_END,
            loading: false,
        });
        console.log(error)
    }
}

export const getPendingConnections = ({ page }) => async (dispatch, getState) => {
    const Token = await AsyncStorage.getItem('Token');
    try {
        if (page == 1) {
            dispatch({
                type: TASK_GET_PENDINGCONNECTIONS_START,
                loading: true,
            });
        }
        dispatch({
            type: TASK_GET_PENDINGCONNECTIONS_END_ERROR,
            networkError: false,
        });
        const response = await fetch(`${baseUrl.baseUrl}/connect/get-connection-requests/${page}/100`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': baseUrl.apiKey,
                'accesstoken': `Bearer ${Token}`
            },
        });
        if (response.ok === true) {
            const res = await response.json()
            console.log(res,'ahemd is Gay')
            if (res?.connectionRequests) {
                dispatch({
                    type: TASK_GET_PENDINGCONNECTIONS_END,
                    loading: false,
                });
                return res
            }
            else if (res.message == 'No Connection Found') {
                dispatch({
                    type: TASK_GET_PENDINGCONNECTIONS_END,
                    payload: [],
                    loading: false,
                });
            }
        }
        else {
            dispatch({
                type: TASK_GET_PENDINGCONNECTIONS_END_ERROR,
                networkError: true,
            });
            dispatch({
                type: TASK_GET_PENDINGCONNECTIONS_END,
                loading: false,
            });
        }
    }
    catch (error) {
        dispatch({
            type: TASK_GET_PENDINGCONNECTIONS_END_ERROR,
            networkError: true,
        });
        dispatch({
            type: TASK_GET_PENDINGCONNECTIONS_END,
            loading: false,
        });
        console.log(error)
    }
}

export const AcceptInvitation = (body) => async () => {
    const Token = await AsyncStorage.getItem('Token');
    try {
        const response = await fetch(`${baseUrl.baseUrl}/connect/accept-connection-request`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': baseUrl.apiKey,
                'accesstoken': `Bearer ${Token}`
            },
            body: JSON.stringify({
                user_id: body
            })
        });
        if (response.ok === true) {
            const res = await response.json()
            return res
        }
    }
    catch (error) {
        console.log(error)
    }
}