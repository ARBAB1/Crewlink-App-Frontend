import {
    TASK_REAPPLY_START,
    TASK_REAPPLY_END,
} from '../../actions/types'


const initState = {
    loading: false,
}

const ReApplyDocReducer = (state = initState, action) => {
    switch (action.type) {
        case TASK_REAPPLY_START:
            return {
                ...state,
                loading: action.loading,
            };
        case TASK_REAPPLY_END:
            return {
                ...state,
                loading: action.loading,
            };
        default:
            return state;
    }
};

export default ReApplyDocReducer