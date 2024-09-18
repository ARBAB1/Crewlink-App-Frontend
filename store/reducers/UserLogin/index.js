import {
    TASK_LOGIN_START,
    TASK_LOGIN_END,
} from '../../actions/types'


const initState = {
    loading: false,
    Token:""
}

const LoginReducer = (state = initState, action) => {
    switch (action.type) {
        case TASK_LOGIN_START:
            return {
                ...state,
                loading: action.loading,
            };
        case TASK_LOGIN_END:
            return {
                ...state,
                Token:action.token,
                loading: action.loading,
            };
        default:
            return state;
    }
};

export default LoginReducer