import {
    TASK_GET_ALLNOTIFICATIONS_START,
    TASK_GET_ALLNOTIFICATIONS_END,
    TASK_GET_ALLNOTIFICATIONS_END_ERROR
} from '../../actions/types';

const initialNotificationState = {
    data: [], // Stores notifications
    loading: false,
    networkError: false,
    unreadCount: 0, // For unread notifications count
};

const NotificationReducer = (state = initialNotificationState, action) => {
    switch (action.type) {
        case TASK_GET_ALLNOTIFICATIONS_START:
            return {
                ...state,
                loading: true,
                networkError: false,
            };
        case TASK_GET_ALLNOTIFICATIONS_END:
            return {
                ...state,
                loading: false,
                data: action.payload.notifications || [], // Storing notifications
                unreadCount: action.payload.unread_notifications || 0, // Storing unread count
            };
        case TASK_GET_ALLNOTIFICATIONS_END_ERROR:
            return {
                ...state,
                loading: false,
                networkError: true,
            };
        default:
            return state;
    }
};

export default NotificationReducer;
