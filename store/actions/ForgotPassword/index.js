import baseUrl from '../../config.json'
import {
    TASK_FORGOT_PASSWORD_START,
    TASK_FORGOT_PASSWORD_END,
} from '../types'


export const sendEmail = (body) => async (dispatch) => {
    try {
        dispatch({
            type: TASK_FORGOT_PASSWORD_START,
            loading: true,
        });
        const response = await fetch(`${baseUrl.baseUrl}/users/forgot-password`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': baseUrl.apiKey,
            },
            body: JSON.stringify(body)
        });
        const res = await response.json()
        dispatch({
            type: TASK_FORGOT_PASSWORD_END,
            loading: false,
        });
        return res
    }
    catch (error) {
        dispatch({
            type: TASK_FORGOT_PASSWORD_END,
            loading: false,
        });
        console.log(error)
    }
}

