const AuthReducer = {
    Logout: true,
}

const AuthReducerGlobal = (state = AuthReducer, action) => {
    switch (action.type) {
        default:
            return state;
    }
};


export default AuthReducerGlobal