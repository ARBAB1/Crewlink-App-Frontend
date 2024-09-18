import {
    TASK_REGISTER_START,
    TASK_REGISTER_COMPLETE,
    TASK_REGISTER_END,
} from '../../actions/types'


const initState = {
    loading: false,
}

const registerUserReducer = (state = initState, action) => {
    switch (action.type) {
        case TASK_REGISTER_START:
            return {
                ...state,
                loading: action.loading,
            };
        case TASK_REGISTER_COMPLETE:
            return {
                ...state,
                loading: action.loading,
            };
        case TASK_REGISTER_END:
            return {
                ...state,
                loading: action.loading,
            };
        default:
            return state;
    }
};

export default registerUserReducer