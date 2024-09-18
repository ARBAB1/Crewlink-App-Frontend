import baseUrl from '../../config.json'
import {
    TASK_REAPPLY_START,
    TASK_REAPPLY_END,
} from '../../actions/types'




// export const loginUser = (body) => async (dispatch) => {
//     try {
//         dispatch({
//             type: TASK_LOGIN_START,
//             loading: true,
//         });
//         const response = await fetch(`${baseUrl.baseUrl}/users/login`, {
//             method: "POST",
//             headers: {
//                 'Content-Type': 'application/json',
//                 'x-api-key': baseUrl.apiKey,
//             },
//             body: JSON.stringify(body)
//         });
//         const res = await response.json()
//         dispatch({
//             type: TASK_LOGIN_END,
//             loading: false,
//         });
//         return res
//     }
//     catch (error) {
//         dispatch({
//             type: TASK_LOGIN_END,
//             loading: false,
//         });
//         console.log(error)
//     }
// }

export const getAllAirline = () => async (dispatch) => {
    try {
        const response = await fetch(`${baseUrl.baseUrl}/airline/GetAllAirlines`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const res = await response.json()
        return res
    }
    catch (error) {
        console.log(error)
    }
}