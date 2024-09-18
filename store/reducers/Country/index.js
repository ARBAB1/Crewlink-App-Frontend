import {
    TASK_COUNTRY_LOAD_START,
    TASK_COUNTRY_LOAD_END,
    TASK_STATE_LOAD_START,
    TASK_STATE_LOAD_END,
    TASK_CITY_LOAD_START,
    TASK_CITY_LOAD_END,
    TASK_CHECKIN_START,
    TASK_CHECKIN_END,
} from '../../actions/types'


const countryState = {
    data: "",
    loading: false,
}

const StatesState = {
    data: "",
    loading: false,
}

const CityState = {
    data: "",
    loading: false,
}
const checkInState = {
    data: "",
    loading: false,
}

const CountryReducer = (state = countryState, action) => {
    switch (action.type) {
        case TASK_COUNTRY_LOAD_START:
            return {
                ...state,
                loading: action.loading,
            };
        case TASK_COUNTRY_LOAD_END:
            return {
                ...state,
                loading: action.loading,
            };
        default:
            return state;
    }
};


const StatesReducer = (state = StatesState, action) => {
    switch (action.type) {
        case TASK_STATE_LOAD_START:
            return {
                ...state,
                loading: action.loading,
            };
        case TASK_STATE_LOAD_END:
            return {
                ...state,
                loading: action.loading,
            };
        default:
            return state;
    }
};

const CityReducer = (state = CityState, action) => {
    switch (action.type) {
        case TASK_CITY_LOAD_START:
            return {
                ...state,
                loading: action.loading,
            };
        case TASK_CITY_LOAD_END:
            return {
                ...state,
                loading: action.loading,
            };
        default:
            return state;
    }
};

const CheckInReducer = (state = checkInState, action) => {
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




export { CountryReducer, StatesReducer, CityReducer, CheckInReducer }