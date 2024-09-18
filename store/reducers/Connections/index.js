import {
    TASK_GET_ALLCONNECTIONS_START,
    TASK_GET_ALLCONNECTIONS_END,
    TASK_GET_ALLCONNECTIONS_END_ERROR,
    TASK_GET_PENDINGCONNECTIONS_START,
    TASK_GET_PENDINGCONNECTIONS_END,
    TASK_GET_PENDINGCONNECTIONS_END_ERROR
} from '../../actions/types'


const allConnections = {
    data: [],
    loading: false,
    networkError: false,
}

const PendingConnections = {
    data: [],
    loading: false,
    networkError: false,
}

const AllConnectionsReducer = (state = allConnections, action) => {
    switch (action.type) {
        case TASK_GET_ALLCONNECTIONS_START:
            return {
                ...state,
                loading: action.loading,
            };

        case TASK_GET_ALLCONNECTIONS_END:
            return {
                ...state,
                data: action.payload,
                loading: action.loading,
            };
        case TASK_GET_ALLCONNECTIONS_END_ERROR:
            return {
                ...state,
                networkError: action.networkError,
            };
        default:
            return state;
    }
};

const PendingConnectionsReducer = (state = PendingConnections, action) => {
    switch (action.type) {
        case TASK_GET_PENDINGCONNECTIONS_START:
            return {
                ...state,
                loading: action.loading,
            };

        case TASK_GET_PENDINGCONNECTIONS_END:
            return {
                ...state,
                data: action.payload,
                loading: action.loading,
            };
        case TASK_GET_PENDINGCONNECTIONS_END_ERROR:
            return {
                ...state,
                networkError: action.networkError,
            };
        default:
            return state;
    }
};
export { AllConnectionsReducer, PendingConnectionsReducer };