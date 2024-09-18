import {
    TASK_GET_PROFILE_DETAIL_START,
    TASK_GET_PROFILE_DETAIL_END,
    TASK_GET_PROFILE_DETAIL_ERROR,
    LOGOUT,
    LOGIN
} from '../../actions/types'


const userProfile = {
    loading: false,
    data: [],
    networkError: false,
    isLogin: true,
}

const GetUserProfileReducer = (state = userProfile, action) => {
    switch (action.type) {
        case TASK_GET_PROFILE_DETAIL_START:
            return {
                ...state,
                loading: action.loading,
                networkError: action.networkError,
            };
        case TASK_GET_PROFILE_DETAIL_END:
            return {
                ...state,
                data: action.payload,
                loading: action.loading,
            };
        case TASK_GET_PROFILE_DETAIL_ERROR:
            return {
                ...state,
                networkError: action.networkError,
                loading: action.loading,
            };

        case LOGIN:
            return {
                ...state,
                isLogin: action.payload
            };
        case LOGOUT:
            return {
                ...state,
                isLogin: action.payload
            };
        default:
            return state;
    }
};

export { GetUserProfileReducer }