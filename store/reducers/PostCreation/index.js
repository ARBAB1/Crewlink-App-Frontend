import {
    TASK_GET_CONNECTION_SEARCH_START,
    TASK_GET_CONNECTION_SEARCH_END,
    TASK_GET_CONNECTION_SEARCH_ERROR,
    TASK_INCLUDE_CONNECTION,
    TASK_EXCLUDE_CONNECTION,
    TASK_POST_COMMNET_OFF,
    TASK_POST_COMMNET_COUNT_OFF,
    TASK_POST_LIKE_COUNT_OFF,
    TASK_POST_CREATE_START,
    TASK_POST_CREATE_END,
    TASK_POST_CREATE_ERROR,
} from '../../actions/types'


const PostCreation = {
    searchConnectionData: [],
    searchConnectionLoading: false,
    searchConnectionError: false,
    isCommentOff: false,
    isCommentCount: false,
    isLikeCount: false,
    uploadLoading: false,
    uploadNetworkError: false,
    uploadFiles:""
}

const PostCreationReducer = (state = PostCreation, action) => {
    switch (action.type) {
        case TASK_GET_CONNECTION_SEARCH_START:
            return {
                ...state,
                searchConnectionLoading: action.searchConnectionLoading,
                searchConnectionError: action.searchConnectionError,
            };
        case TASK_GET_CONNECTION_SEARCH_END:
            return {
                ...state,
                searchConnectionLoading: action.searchConnectionLoading,
            };
        case TASK_GET_CONNECTION_SEARCH_ERROR:
            return {
                ...state,
                searchConnectionError: action.searchConnectionError,
                searchConnectionLoading: action.searchConnectionLoading,
            };
        case TASK_INCLUDE_CONNECTION:
            return {
                ...state,
                searchConnectionData: action.searchConnectionData
            };
        case TASK_EXCLUDE_CONNECTION:
            return {
                ...state,
                searchConnectionData: action.searchConnectionData
            };
        case TASK_POST_COMMNET_OFF:
            return {
                ...state,
                isCommentOff: action.isCommentOff
            };
        case TASK_POST_COMMNET_COUNT_OFF:
            return {
                ...state,
                isCommentCount: action.isCommentCount
            };
        case TASK_POST_LIKE_COUNT_OFF:
            return {
                ...state,
                isLikeCount: action.isLikeCount
            };
        case TASK_POST_CREATE_START:
            return {
                ...state,
                uploadLoading: action.uploadLoading,
                uploadNetworkError:action.uploadNetworkError,
                uploadFiles:action.uploadFiles
            };
        case TASK_POST_CREATE_END:
            return {
                ...state,
                uploadLoading: action.uploadLoading,
                uploadFiles:action.uploadFiles
            };
        case TASK_POST_CREATE_ERROR:
            return {
                ...state,
                uploadLoading: action.uploadLoading,
                uploadNetworkError:action.uploadNetworkError,
                uploadFiles:action.uploadFiles
            };
        default:
            return state;
    }
};


export default PostCreationReducer