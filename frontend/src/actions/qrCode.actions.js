import Web3 from "web3";
import config from "config";
import { alertActions } from "./";
import { qrCodeConstants } from "../constants";
import campaignGenerator from "../assets/contracts/CampaignGenerator.json";

export const qrCodeActions = {
    toggle,
    data,
    clean
};

function toggle() {
    return async (dispatch, getState) => {
        dispatch({
            type: qrCodeConstants.TOGGLE
        });
    };
}

function data() {
    return async (dispatch, getState) => {
        dispatch({
            type: qrCodeConstants.DATA,
            data
        });
    };
}

function clean() {
    return async (dispatch, getState) => {
        dispatch({
            type: qrCodeConstants.CLEAR
        });
    };
}
