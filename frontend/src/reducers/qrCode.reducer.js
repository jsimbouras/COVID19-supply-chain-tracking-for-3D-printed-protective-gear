import { qrCodeConstants } from "../constants";

export function qrCode(state = {open: false}, action) {
    switch (action.type) {
        case qrCodeConstants.DATA:
            return {
                data: action.data,
                open: false
            };
        case qrCodeConstants.TOGGLE:
            return {
                open: !state.open
            };
        case qrCodeConstants.CLEAR:
            return {
                open: false
            };
        default:
            return state;
    }
}
