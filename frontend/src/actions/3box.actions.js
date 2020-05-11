import Box from "3box";
import { alertActions } from "./";
import { boxConstants } from "../constants";

export const boxActions = {
    login,
    loadProfile,
    getProfiles,
    clean
};

function login(account) {
    return async (dispatch, getState) => {
        dispatch(started());
        let box, space;
        // TODO: uncomment when you enable 3box
        //try {
        //    box = await Box.openBox(account, window.ethereum);
        //    space = await box.openSpace(boxConstants.SPACE_NAME);
        //} catch (e) {
        //    console.log(e);
        //    dispatch(failure(e.toString()));
        //    let error = "Could not load 3Box";
        //    dispatch(alertActions.error(error));
        //    return;
        //}
        dispatch(loaded({ box, space, loggedIn: true }));
        dispatch(alertActions.success("Login with 3Box Successful"));
    };
}

function loadProfile(account) {
    return async (dispatch, getState) => {
        dispatch(started());
        let profile;
        try {
            profile = await Box.getProfile(account);
        } catch (e) {
            console.log(e);
            dispatch(failure(e));
            let error = "Could not load 3Box Profile";
            dispatch(alertActions.error(error));
            return;
        }
        dispatch(loaded({ profile }));
    };
}

function getProfiles(accounts) {
    return async (dispatch, getState) => {
        dispatch(started());
        let profiles;
        try {
            profiles = await Promise.all(
                accounts.map(account => Box.getProfile(account))
            );
        } catch (e) {
            console.log(e);
            dispatch(failure(e));
            return;
        }
        dispatch(loaded({ data: { profiles } }));
    };
}

function clean() {
    return dispatch => {
        dispatch({
            type: boxConstants.CLEAN
        });
    };
}

function started() {
    return {
        type: boxConstants.STARTED
    };
}

function loaded(box) {
    return {
        type: boxConstants.LOADED,
        ...box
    };
}

function failure(error) {
    return {
        type: boxConstants.ERROR,
        error
    };
}
