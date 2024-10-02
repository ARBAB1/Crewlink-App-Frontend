import {
    TASK_GET_ALLCITIES_START,
    TASK_GET_ALLCITIES_END,
    TASK_GET_ALLCITIES_END_ERROR
} from '../../actions/types';

const initialCityState = {
    data: [], // Stores notifications
    loading: false,
    networkError: false,

};

const CityReducer = (state = initialCityState, action) => {
    switch (action.type) {
        case TASK_GET_ALLCITIES_START:
            return {
                ...state,
                loading: true,
                networkError: false,
            };
        case TASK_GET_ALLCITIES_END:
            return {
                ...state,
                loading: false,
                data: action.payload.data || [], // Storing notifications
               
            };
        case TASK_GET_ALLCITIES_END_ERROR:
            return {
                ...state,
                loading: false,
                networkError: true,
            };
        default:
            return state;
    }
};

export default CityReducer;
