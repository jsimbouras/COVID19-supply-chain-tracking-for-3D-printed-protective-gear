import { authConstants } from "../constants";

export const authActions = {
    logout,
};

function logout() {
    return dispatch => {
        dispatch({ type: authConstants.LOGOUT });
    };
}
