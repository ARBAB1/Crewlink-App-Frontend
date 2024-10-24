import baseUrl from '../../config.json'
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    TASK_GET_ALLEVENTS_START,
    TASK_GET_ALLEVENTS_END,
    TASK_GET_ALLEVENTS_END_ERROR,
    TASK_GET_JOINED_EVENTS_START,
    TASK_GET_JOINED_EVENTS_END,
    TASK_GET_JOINED_EVENTS_END_ERROR,
    TASK_GET_MY_EVENT_START,
    TASK_GET_MY_EVENT_END,
    TASK_GET_MY_EVENT_END_ERROR,
    TASK_DELETE_EVENT_START,
    TASK_DELETE_EVENT_END,
    TASK_CREATE_EVENT_START,
    TASK_CREATE_EVENT_END,
    TASK_UPDATE_EVENT_START,
    TASK_UPDATE_EVENT_END,
    TASK_UPDATE_EVENT_ERROR,
    TASK_JOIN_EVENT_START,
    TASK_JOIN_EVENT_END,
    TASK_LEAVE_EVENT_START,
    TASK_LEAVE_EVENT_END
} from '../types'



export const getAllEvents = ({ page }) => async (dispatch, getState) => {
    const Token = await AsyncStorage.getItem('Token');
    try {
        if (page == 1) {
            dispatch({
                type: TASK_GET_ALLEVENTS_START,
                loading: true,
            });
        }
        dispatch({
            type: TASK_GET_ALLEVENTS_END_ERROR,
            networkError: false,
        });
        const response = await fetch(`${baseUrl.baseUrl}/events/get-all-events/${page}/100`, {
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
                    type: TASK_GET_ALLEVENTS_END,
                    loading: false,
                });
                return res?.data
            }
            else if (res.message == 'No Event Found') {
                dispatch({
                    type: TASK_GET_ALLEVENTS_END,
                    payload: [],
                    loading: false,
                });
            }
        }
        else {
            dispatch({
                type: TASK_GET_ALLEVENTS_END_ERROR,
                networkError: true,
            });
            dispatch({
                type: TASK_GET_ALLEVENTS_END,
                loading: false,
            });
        }
    }
    catch (error) {
        dispatch({
            type: TASK_GET_ALLEVENTS_END_ERROR,
            networkError: true,
        });
        dispatch({
            type: TASK_GET_ALLEVENTS_END,
            loading: false,
        });
        console.log(error)
    }
}

export const getJoinedEvents = ({ page, refreash }) => async (dispatch, getState) => {
    const Token = await AsyncStorage.getItem('Token');
    const state = getState();
    try {
        dispatch({
            type: TASK_GET_JOINED_EVENTS_END_ERROR,
            networkError: false,
        });
        if (page <= 1) {
            dispatch({
                type: TASK_GET_JOINED_EVENTS_START,
                loading: true,
            });
        }
        const response = await fetch(`${baseUrl.baseUrl}/events/events-joined-by-user/${page}/100`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': baseUrl.apiKey,
                'accesstoken': `Bearer ${Token}`
            },
        });
        if (response.ok === true) {
            const res = await response.json()
            if (res?.events) {
                dispatch({
                    type: TASK_GET_JOINED_EVENTS_END,
                    loading: false,
                });
                return res?.events
            }
            else if (res?.events?.message == 'No Event Found') {
                dispatch({
                    type: TASK_GET_JOINED_EVENTS_END,
                    loading: false,
                });
            }
        }
        else {
            dispatch({
                type: TASK_GET_JOINED_EVENTS_END_ERROR,
                networkError: true,
            });
            dispatch({
                type: TASK_GET_JOINED_EVENTS_END,
                loading: false,
            });
        }
    }
    catch (error) {
        dispatch({
            type: TASK_GET_JOINED_EVENTS_END_ERROR,
            networkError: true,
        });
        dispatch({
            type: TASK_GET_JOINED_EVENTS_END,
            loading: false,
        });
        console.log(error)
    }
}

export const getMyEvents = ({ page, refreash }) => async (dispatch, getState) => {
    const Token = await AsyncStorage.getItem('Token');
    const state = getState();
    try {
        dispatch({
            type: TASK_GET_MY_EVENT_END_ERROR,
            networkError: false,
        });
        if (page <= 1) {
            dispatch({
                type: TASK_GET_MY_EVENT_START,
                loading: true,
            });
        }
        const response = await fetch(`${baseUrl.baseUrl}/events/get-events-created-by-user/${page}/100`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': baseUrl.apiKey,
                'accesstoken': `Bearer ${Token}`
            },
        });
        if (response?.ok == true) {
            const res = await response.json()
            if (res?.data) {
                dispatch({
                    type: TASK_GET_MY_EVENT_END,
                    loading: false,
                });
                return res?.data
            }
            else if (res.message == 'No Event Found') {
                dispatch({
                    type: TASK_GET_MY_EVENT_END,
                    loading: false,
                });
            }
        }
        else {
            dispatch({
                type: TASK_GET_MY_EVENT_END_ERROR,
                networkError: true,
            });
            dispatch({
                type: TASK_GET_MY_EVENT_END,
                loading: false,
            });
        }
    }
    catch (error) {
        dispatch({
            type: TASK_GET_MY_EVENT_END_ERROR,
            networkError: true,
        });
        dispatch({
            type: TASK_GET_MY_EVENT_END,
            loading: false,
        });
        console.log(error)
    }
}

export const getEventDetail = ({ id }) => async (dispatch, getState) => {
    const Token = await AsyncStorage.getItem('Token');
    try {
        dispatch({
            type: TASK_UPDATE_EVENT_ERROR,
            networkError: false,
        });
        const response = await fetch(`${baseUrl.baseUrl}/events/get-event-details/${id}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': baseUrl.apiKey,
                'accesstoken': `Bearer ${Token}`
            },
        });
        if (response.ok == true) {
            const res = await response.json()
            if (res?.data) {
                return res?.data
            }
        }
        else {
            dispatch({
                type: TASK_UPDATE_EVENT_ERROR,
                networkError: true,
            });
        }
    }
    catch (error) {
        dispatch({
            type: TASK_UPDATE_EVENT_ERROR,
            networkError: true,
        });
        console.log(error)
    }
}

export const DeleteEvent = (id) => async (dispatch, getState) => {
    const Token = await AsyncStorage.getItem('Token');
    try {
        dispatch({
            type: TASK_DELETE_EVENT_START,
            loading: true,
        });
        const response = await fetch(`${baseUrl.baseUrl}/events/delete-event/${id}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': baseUrl.apiKey,
                'accesstoken': `Bearer ${Token}`
            },
        });
        const res = await response.json()
        if (res.message == "Event deleted successfully") {
            dispatch({
                type: TASK_DELETE_EVENT_END,
                loading: false,
            });
            return true
        }
        return false
    }
    catch (error) {
        dispatch({
            type: TASK_DELETE_EVENT_END,
            loading: false,
        });
        console.log(error)
    }
}

export const CreateEvent = (FormData) => async (dispatch, getState) => {
    const Token = await AsyncStorage.getItem('Token');
    try {
        dispatch({
            type: TASK_CREATE_EVENT_START,
            loading: true,
        });
        const response = await fetch(`${baseUrl.baseUrl}/events/create-event`, {
            method: "POST",
            headers: {
                'Content-Type': 'multipart/form-data',
                'x-api-key': baseUrl.apiKey,
                'accesstoken': `Bearer ${Token}`
            },
            body: FormData
        });
        const res = await response.json()
        if (res.statusCode == 201) {
            dispatch({
                type: TASK_CREATE_EVENT_END,
                loading: false,
            });
            return true
        }
        else {
            dispatch({
                type: TASK_CREATE_EVENT_END,
                loading: false,
            });
            return false
        }
    }
    catch (error) {
        dispatch({
            type: TASK_CREATE_EVENT_END,
            loading: false,
        });
        console.log(error)
    }
}

export const JoinEvents = (body) => async (dispatch, getState) => {
    const Token = await AsyncStorage.getItem('Token');
    try {
        dispatch({
            type: TASK_JOIN_EVENT_START,
            loading: true,
        });
        const response = await fetch(`${baseUrl.baseUrl}/events/join-event`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': baseUrl.apiKey,
                'accesstoken': `Bearer ${Token}`
            },
            body: JSON.stringify(body)
        });
        const res = await response.json()
        if (res.message == "Event joined successfully") {
            dispatch({
                type: TASK_JOIN_EVENT_END,
                loading: false,
            });
            return true
        }
        return false
    }
    catch (error) {
        dispatch({
            type: TASK_JOIN_EVENT_END,
            loading: false,
        });
        console.log(error)
    }
}

export const LeaveEvents = (body) => async (dispatch, getState) => {
    const Token = await AsyncStorage.getItem('Token');
    try {
        dispatch({
            type: TASK_LEAVE_EVENT_START,
            loading: true,
        });
        const response = await fetch(`${baseUrl.baseUrl}/events/leave-event`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': baseUrl.apiKey,
                'accesstoken': `Bearer ${Token}`
            },
            body: JSON.stringify(body)
        });
        const res = await response.json()
        if (res.message == "Event Left successfully") {
            dispatch({
                type: TASK_LEAVE_EVENT_END,
                loading: false,
            });
            return true
        }
        return false
    }
    catch (error) {
        dispatch({
            type: TASK_LEAVE_EVENT_END,
            loading: false,
        });
        console.log(error)
    }
}

export const UpdateEvent = (data) => async (dispatch, getState) => {
    const Token = await AsyncStorage.getItem('Token');
    try {
        dispatch({
            type: TASK_UPDATE_EVENT_START,
            loading: true,
        });
        dispatch({
            type: TASK_UPDATE_EVENT_ERROR,
            networkError: false,
        });
        const formData = new FormData();
        formData.append('event_title', data?.title);
        formData.append('event_id', data?.id);
        formData.append('event_location', data?.location);
        formData.append('event_details', data?.description);
        formData.append('event_longitude', 66.990501);
        formData.append('event_latitude', 24.860966);
        formData.append('event_start_time', data?.startTime);
        formData.append('event_end_time', data?.endTime);
        formData.append('event_date', data?.eventDate);
        if (data?.isImage) {
            formData.append('event_cover_image', {
                uri: data?.documentImage,
                name: 'photo.jpg',
                type: 'image/jpeg',
            });
        }
        const response = await fetch(`${baseUrl.baseUrl}/events/update-event`, {
            method: "POST",
            headers: {
                'Content-Type': 'multipart/form-data',
                'x-api-key': baseUrl.apiKey,
                'accesstoken': `Bearer ${Token}`
            },
            body: formData
        });
        if (response.ok == true) {
            const res = await response.json()
            if (res.message == "Event Updated successfully") {
                dispatch({
                    type: TASK_UPDATE_EVENT_END,
                    loading: false,
                });
                return true
            }
            else if (res.message == "Internal server error") {
                return "Server error"
            }
        }
        else {
            dispatch({
                type: TASK_UPDATE_EVENT_ERROR,
                networkError: true,
            });
            dispatch({
                type: TASK_UPDATE_EVENT_END,
                loading: false,
            });
        }
    }
    catch (error) {
        dispatch({
            type: TASK_UPDATE_EVENT_ERROR,
            networkError: true,
        });
        dispatch({
            type: TASK_UPDATE_EVENT_END,
            loading: false,
        });
        console.log(error)
        return false
    }
}


