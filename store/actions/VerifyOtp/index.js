import baseUrl from '../../config.json'
import {
    TASK_OTP_VERIFICATION_START,
    TASK_OTP_VERIFICATION_END,
} from '../types'


export const verifyOtp = (body) => async (dispatch) => {
    try {
        dispatch({
            type: TASK_OTP_VERIFICATION_START,
            loading: true,
        });
        const response = await fetch(`${baseUrl.baseUrl}/users/verify-otp`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': baseUrl.apiKey,
            },
            body: JSON.stringify(body)
        });
        const res = await response.json()
        dispatch({
            type: TASK_OTP_VERIFICATION_END,
            loading: false,
        });
        return res
    }
    catch (error) {
        dispatch({
            type: TASK_OTP_VERIFICATION_END,
            loading: false,
        });
        console.log(error)
    }
}


export const ResendOtp = (body) => async (dispatch) => {
    try {
        const response = await fetch(`${baseUrl.baseUrl}/users/resend-otp`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': baseUrl.apiKey,
            },
            body: JSON.stringify(body)
        });
        const res = await response.json()
        return res
    }
    catch (error) {
        console.log(error)
    }
}