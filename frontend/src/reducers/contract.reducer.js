import { contractConstants, authConstants } from "../constants";

export function contract(state = {data: {}}, action) {
    switch (action.type) {
        case contractConstants.STARTED:
            return {
                ...state,
                inProgress: true
            };
        case contractConstants.DONE:
            return {
                ...state,
                inProgress: false
            };
        case contractConstants.CLEAN:
            return {
                ...state,
                data: {},
                inProgress: false,
            };
        case contractConstants.ERROR:
            return {
                role: state.role,
                inProgress: false,
                error: action.error
            };
        case contractConstants.CLEAN_SELECTED:
            return {
                ...state,
                ...action,
                data: {
                    ...state.data,
                    ...action.data
                }
            };
        case contractConstants.RESULT:
            return {
                ...state,
                inProgress: false,
                ...action,
                data: {
                    ...state.data,
                    ...action.data
                }
            };
        case authConstants.LOGOUT:
        default:
            return state;
    }
}
