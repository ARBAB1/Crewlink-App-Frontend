import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    TASK_GET_CONNECTION_SEARCH_START,
    TASK_GET_CONNECTION_SEARCH_END,
    TASK_GET_CONNECTION_SEARCH_ERROR,
    TASK_INCLUDE_CONNECTION,
    TASK_POST_COMMNET_OFF,
    TASK_POST_COMMNET_COUNT_OFF,
    TASK_POST_LIKE_COUNT_OFF,
    TASK_POST_CREATE_START,
    TASK_POST_CREATE_END,
    TASK_POST_CREATE_ERROR,

} from '../types'
import baseUrl from '../../config.json'



export const SearchConnection = (body) => async (dispatch) => {
    const Token = await AsyncStorage.getItem('Token');
    try {
        dispatch({
            type: TASK_GET_CONNECTION_SEARCH_END,
        });
        dispatch({
            type: TASK_GET_CONNECTION_SEARCH_START,
            searchConnectionLoading: true,
            searchConnectionError: false
        });
        const response = await fetch(`${baseUrl.baseUrl}/connect/get-my-connections?search=${body}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': baseUrl.apiKey,
                'accesstoken': `Bearer ${Token}`

            },
        });
        if (response.ok) {
            const res = await response.json()
            dispatch({
                type: TASK_GET_CONNECTION_SEARCH_END,
                searchConnectionLoading: false,
            });
            return res?.connections;
        }
        else {
            dispatch({
                type: TASK_GET_CONNECTION_SEARCH_ERROR,
                searchConnectionLoading: false,
                searchConnectionError: true
            });
        }
    }
    catch (error) {
        dispatch({
            type: TASK_GET_CONNECTION_SEARCH_ERROR,
            searchConnectionLoading: false,
            searchConnectionError: true
        });
        console.log(error)
    }
}
export const InclideConnection = (body) => async (dispatch) => {
    dispatch({
        type: TASK_INCLUDE_CONNECTION,
        searchConnectionData: body,
    });
}
export const ExludeConnection = (body) => async (dispatch, getState) => {
    const { searchConnectionData } = getState()?.PostCreationReducer;
    objectsArray = searchConnectionData.filter(obj => obj.user_id !== body?.user_id);
    dispatch({
        type: TASK_INCLUDE_CONNECTION,
        searchConnectionData: objectsArray,
    });
}
export const EmptyConnection = (body) => async (dispatch, getState) => {
    dispatch({
        type: TASK_INCLUDE_CONNECTION,
        searchConnectionData: [],
    });
}
export const CommentSwitch = (body) => async (dispatch, getState) => {
    dispatch({
        type: TASK_POST_COMMNET_OFF,
        isCommentOff: body,
    });
}
export const CommentCountSwitch = (body) => async (dispatch, getState) => {
    dispatch({
        type: TASK_POST_COMMNET_COUNT_OFF,
        isCommentCount: body,
    });
}
export const LikeCountSwitch = (body) => async (dispatch, getState) => {
    dispatch({
        type: TASK_POST_LIKE_COUNT_OFF,
        isLikeCount: body,
    });
}
export const CreatePostFunction = (FormData, path, goHome) => async (dispatch) => {
    const Token = await AsyncStorage.getItem('Token');
    dispatch({
        type: TASK_POST_CREATE_START,
        uploadLoading: true,
        uploadNetworkError: false,
        uploadFiles: path
    });
    try {
        goHome()
        const response = await fetch(`${baseUrl.baseUrl}/posts/createPost`, {
            method: "POST",
            headers: {
                'Content-Type': 'multipart/form-data',
                'x-api-key': baseUrl.apiKey,
                'accesstoken': `Bearer ${Token}`
            },
            body: FormData
        });
        console.log(response,'postResponce21')
        if (response.ok) {
            const res = await response?.json();
            dispatch({
                type: TASK_POST_CREATE_END,
                uploadLoading: false,
                uploadNetworkError: false,
                uploadFiles: path
            });
        }
        else {
            dispatch({
                type: TASK_POST_CREATE_ERROR,
                uploadLoading: false,
                uploadNetworkError: true,
                uploadFiles: path
            });
        }
    }
    catch (error) {
        dispatch({
            type: TASK_POST_CREATE_ERROR,
            uploadLoading: false,
            uploadNetworkError: true
        });
        console.log(error.message)
    }
}
export const LikeFunc = (body) => async () => {
    const Token = await AsyncStorage.getItem('Token');
    try {
        const response = await fetch(`${baseUrl.baseUrl}/posts/like-post`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': baseUrl.apiKey,
                'accesstoken': `Bearer ${Token}`
            },
            body: JSON.stringify(body)

        });
        const res = await response?.json();
    }
    catch (error) {
        console.log(error.message, "oken")
        return "Internal Server Error"
    }
}
export const DisLikeFunc = (body) => async () => {
    const Token = await AsyncStorage.getItem('Token');
    try {
        const response = await fetch(`${baseUrl.baseUrl}/posts/unlike-post`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': baseUrl.apiKey,
                'accesstoken': `Bearer ${Token}`
            },
            body: JSON.stringify(body)

        });
        const res = await response?.json();
    }
    catch (error) {
        console.log(error.message, "oken")
        return "Internal Server Error"
    }
}
export const LoadComments = (body) => async () => {
    const Token = await AsyncStorage.getItem('Token');
    try {
        const response = await fetch(`${baseUrl.baseUrl}/posts/get-posts-comment/${body?.post_id}/${body?.page}/${body?.limit}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': baseUrl.apiKey,
                'accesstoken': `Bearer ${Token}`
            },
        });
        if (response.ok) {
            const res = await response.json()
            console.log(res,body,baseUrl.baseUrl,'comment responce')
            return res;
        }
        else {
            return 'Something went wrong'
        }
    }
    catch (error) {
        return "Internal Server Error"
    }
}
export const LoadReplies = (body) => async () => {
    const Token = await AsyncStorage.getItem('Token');
    console.log(body)
    try {
        const response = await fetch(`${baseUrl.baseUrl}/posts/get-comment-replies/${body?.comment_id}/${body?.page}/${body?.limit}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': baseUrl.apiKey,
                'accesstoken': `Bearer ${Token}`
            },
        });
        if (response.ok) {
            const res = await response.json()
            return res;
        }
        else {
            return 'Something went wrong'
        }
    }
    catch (error) {
        return "Internal Server Error"
    }
}
export const AddComment = (body) => async () => {
    const Token = await AsyncStorage.getItem('Token');
    try {
        const response = await fetch(`${baseUrl.baseUrl}/posts/create-comment`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': baseUrl.apiKey,
                'accesstoken': `Bearer ${Token}`
            },
            body: JSON.stringify(body)
        });
        if (response.ok) {
            const res = await response.json()
            return res;
        }
        else {
            return 'Something went wrong'
        }
    }
    catch (error) {
        return "Internal Server Error"
    }
}
export const LikeCommentFunc = (body) => async () => {
    const Token = await AsyncStorage.getItem('Token');
    try {
        const response = await fetch(`${baseUrl.baseUrl}/posts/like-comment`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': baseUrl.apiKey,
                'accesstoken': `Bearer ${Token}`
            },
            body: JSON.stringify(body)

        });
        const res = await response?.json();
        console.log(res, 'like comment')
        return res
    }
    catch (error) {
        console.log(error.message, "oken")
        return "Internal Server Error"
    }
}
export const DisLikeCommentFunc = (body) => async () => {
    const Token = await AsyncStorage.getItem('Token');
    try {
        const response = await fetch(`${baseUrl.baseUrl}/posts/dislike-comment`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': baseUrl.apiKey,
                'accesstoken': `Bearer ${Token}`
            },
            body: JSON.stringify(body)

        });
        const res = await response?.json();
        console.log(res, 'unlike comment')
    }
    catch (error) {
        console.log(error.message, "oken")
        return "Internal Server Error"
    }
}
export const DeletComments = (body) => async () => {
    const Token = await AsyncStorage.getItem('Token');
    try {
        const response = await fetch(`${baseUrl.baseUrl}/posts/delete-comment`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': baseUrl.apiKey,
                'accesstoken': `Bearer ${Token}`
            },
            body: JSON.stringify(body)

        });
        const res = await response?.json();
        if (res?.statusCode == 200) {
            return res?.message
        }
    }
    catch (error) {
        console.log(error.message)
        return "Internal Server Error"
    }
}
