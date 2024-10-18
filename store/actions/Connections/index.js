import baseUrl from '../../config.json'
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    TASK_GET_ALLCONNECTIONS_START,
    TASK_GET_ALLCONNECTIONS_END,
    TASK_GET_ALLCONNECTIONS_END_ERROR,
    TASK_GET_ALLCLOSEDCONNECTIONS_START,
    TASK_GET_ALLCLOSEDCONNECTIONS_END,
    TASK_GET_ALLCLOSEDCONNECTIONS_END_ERROR,
    TASK_GET_ALLPRIVACY_START,
    TASK_GET_ALLPRIVACY_END,
    TASK_GET_ALLPRIVACY_END_ERROR,
  TASK_GET_PENDINGCONNECTIONS_START,
    TASK_GET_PENDINGCONNECTIONS_END,
    TASK_GET_PENDINGCONNECTIONS_END_ERROR,  
    TASK_CHECK_CUSTOMCONNECTIONS_START,
    TASK_CHECK_CUSTOMCONNECTIONS_END,
    TASK_CHECK_CUSTOMCONNECTIONS_END_ERROR,
    TASK_GET_ALLBLOCKEDCONNECTIONS_START,
    TASK_GET_ALLBLOCKEDCONNECTIONS_END,
    TASK_GET_ALLBLOCKEDCONNECTIONS_END_ERROR
} from '../types'


export const getAllBlockedConnections = ({ page }) => async (dispatch, getState) => {
    const Token = await AsyncStorage.getItem('Token');
    try {
        if (page == 1) {
            dispatch({
                type: TASK_GET_ALLBLOCKEDCONNECTIONS_START,
                loading: true,
            });
        }
        dispatch({
            type: TASK_GET_ALLBLOCKEDCONNECTIONS_END_ERROR,
            networkError: false,
        });
        const response = await fetch(`${baseUrl.baseUrl}/block/get-all-blocked-users/${page}/100`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': baseUrl.apiKey,
                'accesstoken': `Bearer ${Token}`
            },
        });
       
        if (response.ok === true) {
            const res = await response.json()
        
            if (res?.blockedUsers) {
                dispatch({
                    type: TASK_GET_ALLBLOCKEDCONNECTIONS_END,
                    loading: false,
                });
                return res?.blockedUsers
            }
            else if (res.message == 'No Blocked Connections Data Found') {
                dispatch({
                    type: TASK_GET_ALLBLOCKEDCONNECTIONS_END,
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



export const RejectInvitation = (body) => async () => {
    const Token = await AsyncStorage.getItem('Token');
    try {
        const response = await fetch(`${baseUrl.baseUrl}/connect/reject-connection-request`, {
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
export const CheckCustomConnections = () => async (dispatch, getState) => {
    const Token = await AsyncStorage.getItem('Token');
    try {
     
            dispatch({
                type: TASK_CHECK_CUSTOMCONNECTIONS_START,
                loading: true,
            });
        
    
        const response = await fetch(`${baseUrl.baseUrl}/privacy-setting/check-custom-settings-flag`, {
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
            if (res) {
                dispatch({
                    type: TASK_CHECK_CUSTOMCONNECTIONS_END,
                    loading: false,
                });
                return res
            }
          
        }
        else {
            dispatch({
                type: TASK_GET_ALLCONNECTIONS_END_ERROR,
                networkError: true,
            });
            dispatch({
                type: TASK_CHECK_CUSTOMCONNECTIONS_END,
                loading: false,
            });
        }
    }
    catch (error) {
        dispatch({
            type: TASK_CHECK_CUSTOMCONNECTIONS_END_ERROR,
            networkError: true,
        });
        dispatch({
            type: TASK_CHECK_CUSTOMCONNECTIONS_END,
            loading: false,
        });
        console.log(error)
    }
}
export const AddCustomConnections = (body) => async () => {
    const Token = await AsyncStorage.getItem('Token');
    try {
        const response = await fetch(`${baseUrl.baseUrl}/privacy-setting/add-custom-users`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': baseUrl.apiKey,
                'accesstoken': `Bearer ${Token}`
            },
            body: JSON.stringify({
                addedUserIds: body
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
export const AddAccountPrivacy = (body) => async () => {
    console.log(body, 'body')
    const Token = await AsyncStorage.getItem('Token');
    try {
        const response = await fetch(`${baseUrl.baseUrl}/privacy-setting/profile_privacy`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': baseUrl.apiKey,
                'accesstoken': `Bearer ${Token}`
            },
            body: JSON.stringify({
              "profile_visibility": body,
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
export const AddCheckInPrivacy = (body) => async () => {
    console.log(body, 'body')
    const Token = await AsyncStorage.getItem('Token');
    try {
        const response = await fetch(`${baseUrl.baseUrl}/privacy-setting/profile_privacy`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': baseUrl.apiKey,
                'accesstoken': `Bearer ${Token}`
            },
            body: JSON.stringify({
              "checkin_visibility":body,
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
export const getAllPrivacy  = () => async (dispatch, getState) => {
    const Token = await AsyncStorage.getItem('Token');
    try {
        
            dispatch({
                type: TASK_GET_ALLPRIVACY_START,
                loading: true,
            });
        
       
        const response = await fetch(`${baseUrl.baseUrl}/privacy-setting/check-custom-privacy-by-userId`, {
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
            if (res?.statusCode == 200) {
                dispatch({
                    type: TASK_GET_ALLPRIVACY_END,
                    loading: false,
                });
                return res?.privacy_settings
            }
            else if (res.message == 'Privacy Settings Not Found') {
                dispatch({
                    type: TASK_GET_ALLPRIVACY_END,
                    payload: [],
                    loading: false,
                });
            }
        }
        else {
            dispatch({
                type: TASK_GET_ALLPRIVACY_END_ERROR,
                networkError: true,
            });
            dispatch({
                type: TASK_GET_ALLPRIVACY_END,
                loading: false,
            });
        }
    }
    catch (error) {
        dispatch({
            type: TASK_GET_ALLPRIVACY_END_ERROR,
            networkError: true,
        });
        dispatch({
            type: TASK_GET_ALLPRIVACY_END,
            loading: false,
        });
        console.log(error)
    }
}
export const getAllClosedConnections = () => async (dispatch, getState) => {
    const Token = await AsyncStorage.getItem('Token');
    try {
      
            dispatch({
                type: TASK_GET_ALLCLOSEDCONNECTIONS_START,
                loading: true,
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
                    type: TASK_GET_ALLCLOSEDCONNECTIONS_END,
                    loading: false,
                });
                return res?.data?.connections
            }
            else if (res.message == 'No Connections Data Found') {
                dispatch({
                    type: TASK_GET_ALLCLOSEDCONNECTIONS_END,
                    payload: [],
                    loading: false,
                });
            }
        }
        else {
            dispatch({
                type: TASK_GET_ALLCLOSEDCONNECTIONS_END_ERROR,
                networkError: true,
            });
            dispatch({
                type: TASK_GET_ALLCLOSEDCONNECTIONS_END,
                loading: false,
            });
        }
    }
    catch (error) {
        dispatch({
            type: TASK_GET_ALLCLOSEDCONNECTIONS_END_ERROR,
            networkError: true,
        });
        dispatch({
            type: TASK_GET_ALLCLOSEDCONNECTIONS_END,
            loading: false,
        });
        console.log(error)
    }
}
export const DeleteCustomConnections = (body) => async () => {
    console.log(body, 'body')
    const Token = await AsyncStorage.getItem('Token');
    try {
        const response = await fetch(`${baseUrl.baseUrl}/privacy-setting/remove-custom-users`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': baseUrl.apiKey,
                'accesstoken': `Bearer ${Token}`
            },
            body: JSON.stringify({
                removedUserIds: body
            })
        });
        if (response.ok === true) {
            console.log(response, 'response')
            const res = await response.json()
            return res
        }
    }
    catch (error) {
        console.log(error)
    }
}
export const UpdateCustomConnections = (body) => async () => {
    const Token = await AsyncStorage.getItem('Token');
    try {
        const response = await fetch(`${baseUrl.baseUrl}/privacy-setting/update-custom-users`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': baseUrl.apiKey,
                'accesstoken': `Bearer ${Token}`
            },
            body: JSON.stringify({
                addedUserIds: body
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