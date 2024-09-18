import {
    TASK_CHECKIN_START,
    TASK_CHECKIN_END,
} from '../../actions/types'


const countryState = {
    data: "",
    loading: false,
}

const CheckInReducer = (state = countryState, action) => {
    switch (action.type) {
        case TASK_CHECKIN_START:
            return {
                ...state,
                loading: action.loading,
            };
        case TASK_CHECKIN_END:
            return {
                ...state,
                loading: action.loading,
            };
        default:
            return state;
    }
};


export default CheckInReducer