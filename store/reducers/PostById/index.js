import {
    POST_GET_DETAIL_START,
    POST_GET_DETAIL_SUCCESS,
    POST_GET_DETAIL_ERROR,
} from '../../actions/types';

const initialPostDetailState = {
    postDetail: null, // Stores the detailed post data
    loading: false,
    networkError: false,
};

const PostDetailReducer = (state = initialPostDetailState, action) => {
    switch (action.type) {
        case POST_GET_DETAIL_START:
            return {
                ...state,
                loading: true,
                networkError: false,
            };
        case POST_GET_DETAIL_SUCCESS:
            return {
                ...state,
                loading: false,
                postDetail: action.payload || {}, // Storing the post detail
            };
        case POST_GET_DETAIL_ERROR:
            return {
                ...state,
                loading: false,
                networkError: true,
            };
        default:
            return state;
    }
};

export default PostDetailReducer;
