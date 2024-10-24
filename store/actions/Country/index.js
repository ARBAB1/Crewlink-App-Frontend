import AsyncStorage from '@react-native-async-storage/async-storage';
import baseUrl from '../../config.json'
import {
    TASK_CHECKIN_START,
    TASK_CHECKIN_END,
} from '../types'

export const getAllCountries = (body) => async (dispatch) => {
    const Token = await AsyncStorage.getItem('Token');
    try {
        const response = await fetch(`${baseUrl.baseUrl}/check-in/get-all-countries`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': baseUrl.apiKey,
                'accesstoken': `Bearer ${Token}`
            },
        });
        const res = await response.json()
        
        return res?.data
    }
    catch (error) {
        console.log(error)
    }
}

export const getAllStates = (body) => async () => {
    const Token = await AsyncStorage.getItem('Token');
    try {
        const response = await fetch(`${baseUrl.baseUrl}/check-in/get-all-states/${body?.country}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': baseUrl.apiKey,
                'accesstoken': `Bearer ${Token}`
            },
        });
        const res = await response.json()
    
        return res?.data
    }
    catch (error) {
        console.log(error)
    }
}

export const getAllCities = (body) => async (dispatch) => {
    const Token = await AsyncStorage.getItem('Token');
    try {
        const response = await fetch(`${baseUrl.baseUrl}/check-in/get-all-cities/${body?.state}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': baseUrl.apiKey,
                'accesstoken': `Bearer ${Token}`
            },
        });
        const res = await response.json()
        return res?.data
    }
    catch (error) {
        console.log(error)
    }
}

export const CheckInInApp = (body) => async (dispatch) => {
    const Token = await AsyncStorage.getItem('Token');
    try {
        dispatch({
            type: TASK_CHECKIN_START,
            loading: true,
        });
        const response = await fetch(`${baseUrl.baseUrl}/check-in/update-checkin`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'accesstoken': `Bearer ${Token}`,
                'x-api-key':baseUrl.apiKey
            },
            body: JSON.stringify(body)
        });
        const res = await response.json()
        dispatch({
            type: TASK_CHECKIN_END,
            loading: false,
        });
        return res
    }
    catch (error) {
        dispatch({
            type: TASK_CHECKIN_END,
            loading: false,
        });
        console.log(error)
    }
}