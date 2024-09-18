import {
    TASK_FORGOT_PASSWORD_START,
    TASK_FORGOT_PASSWORD_END,
} from '../../actions/types'


const initState = {
    loading: false,
}

const ForgotPasswordReducer = (state = initState, action) => {
    switch (action.type) {
        case TASK_FORGOT_PASSWORD_START:
            return {
                ...state,
                loading: action.loading,
            };
        case TASK_FORGOT_PASSWORD_END:
            return {
                ...state,
                loading: action.loading,
            };
        default:
            return state;
    }
};


export default ForgotPasswordReducer