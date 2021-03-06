import { contractConstants, authConstants } from "../constants";

export function contract(state = {}, action) {
    switch (action.type) {
        case contractConstants.TRANSACTION_STARTED:
            return {
                ...state,
                inProgress: true
            };
        case contractConstants.TRANSACTION_DONE:
            return {
                ...state,
                inProgress: false
            };
        case contractConstants.TRANSACTION_CLEAN:
            return {
                role: state.role,
                inProgress: false,
            };
        case contractConstants.TRANSACTION_ERROR:
            return {
                role: state.role,
                inProgress: false,
                error: action.error
            };
        case contractConstants.TRANSACTION_RESULT:
            return {
                ...state,
                inProgress: false,
                ...action
            };
        case authConstants.LOGOUT:
            return {};
        default:
            return state;
    }
}
