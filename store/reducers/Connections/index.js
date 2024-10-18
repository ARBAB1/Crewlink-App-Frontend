
import {
    TASK_GET_ALLCONNECTIONS_START,
    TASK_GET_ALLCONNECTIONS_END,
    TASK_GET_ALLCONNECTIONS_END_ERROR,
    TASK_GET_ALLCLOSEDCONNECTIONS_START,
    TASK_GET_ALLCLOSEDCONNECTIONS_END,
    TASK_GET_ALLCLOSEDCONNECTIONS_END_ERROR,
    TASK_GET_PENDINGCONNECTIONS_START,
    TASK_GET_PENDINGCONNECTIONS_END,
    TASK_GET_PENDINGCONNECTIONS_END_ERROR,
    TASK_CHECK_CUSTOMCONNECTIONS_START,
    TASK_CHECK_CUSTOMCONNECTIONS_END,
    TASK_CHECK_CUSTOMCONNECTIONS_END_ERROR,
    TASK_GET_ALLPRIVACY_START,
    TASK_GET_ALLPRIVACY_END,
    TASK_GET_ALLPRIVACY_END_ERROR,
    TASK_GET_ALLBLOCKEDCONNECTIONS_START,
    TASK_GET_ALLBLOCKEDCONNECTIONS_END,
    TASK_GET_ALLBLOCKEDCONNECTIONS_END_ERROR
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

const PrivacySetting = {
    data: [],
    loading: false,
    networkError: false,
}

const allClosedConnections = {
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
const AllBlockedConnectionsReducer = (state = allConnections, action) => {
    switch (action.type) {
        case TASK_GET_ALLBLOCKEDCONNECTIONS_START:
            return {
                ...state,
                loading: action.loading,
            };

        case TASK_GET_ALLBLOCKEDCONNECTIONS_END:
            return {
                ...state,
                data: action.payload,
                loading: action.loading,
            };
        case TASK_GET_ALLBLOCKEDCONNECTIONS_END_ERROR:
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
const CustomConnectionsReducer = (state = PendingConnections, action) => {
    switch (action.type) {
        case TASK_CHECK_CUSTOMCONNECTIONS_START:
            return {
                ...state,
                loading: action.loading,
            };

        case TASK_CHECK_CUSTOMCONNECTIONS_END:
            return {
                ...state,
                data: action.payload,
                loading: action.loading,
            };
        case TASK_CHECK_CUSTOMCONNECTIONS_END_ERROR:
            return {
                ...state,
                networkError: action.networkError,
            };
        default:
            return state;
    }
};
const AllPrivacyReducer = (state = PrivacySetting, action) => {
    switch (action.type) {
        case TASK_GET_ALLPRIVACY_START:
            return {
                ...state,
                loading: action.loading,
            };

        case TASK_GET_ALLPRIVACY_END:
            return {
                ...state,
                data: action.payload,
                loading: action.loading,
            };
        case TASK_GET_ALLPRIVACY_END_ERROR:
            return {
                ...state,
                networkError: action.networkError,
            };
        default:
            return state;
    }
};
const AllClosedConnectionsReducer = (state = allClosedConnections, action) => {
    switch (action.type) {
        case TASK_GET_ALLCLOSEDCONNECTIONS_START:
            return {
                ...state,
                loading: action.loading,
            };

        case TASK_GET_ALLCLOSEDCONNECTIONS_END:
            return {
                ...state,
                data: action.payload,
                loading: action.loading,
            };
        case TASK_GET_ALLCLOSEDCONNECTIONS_END_ERROR:
            return {
                ...state,
                networkError: action.networkError,
            };
        default:
            return state;
    }
};
export { AllConnectionsReducer, PendingConnectionsReducer, CustomConnectionsReducer, AllPrivacyReducer, AllClosedConnectionsReducer,AllBlockedConnectionsReducer };