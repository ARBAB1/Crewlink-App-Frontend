import {
    TASK_OTP_VERIFICATION_START,
    TASK_OTP_VERIFICATION_END,
} from '../../actions/types'


const initState = {
    loading: false,
}

const otpVerificationReducer = (state = initState, action) => {
    switch (action.type) {
        case TASK_OTP_VERIFICATION_START:
            return {
                ...state,
                loading: action.loading,
            };
        case TASK_OTP_VERIFICATION_END:
            return {
                ...state,
                loading: action.loading,
            };
        default:
            return state;
    }
};

export default otpVerificationReducer