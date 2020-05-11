import { getStringFromRole, getRoleFromString } from "../helpers";
import { alertActions } from "./";
import { contractConstants } from "../constants";
import { contractService } from "../services";

export const contractActions = {
    clean,
    getRole,
    makeCoordinator,
    startCampaign,
    addManufacturers,
    addCouriers,
    getCampaignDetails,
    createNewBatch,
    getBatchDetails,
    getBatches,
    confirmPLAPickedUp,
    confirmPLAReceived,
    confirmMasksMade,
    confirmMasksPickedUp,
    confirmMasksReceived,
    getMyCampaigns,
    cleanMyBatches,
    getMyBatches
};

function clean() {
    return dispatch => {
        dispatch({
            type: contractConstants.CLEAN
        });
    };
}

function getRole() {
    return async (dispatch, getState) => {
        dispatch(started());
        let role;
        try {
            const { account, contract } = getState().web3;
            role = await contractService.getRole(contract, account);
        } catch (e) {
            console.log(e);
            dispatch(failure(e));
            dispatch(alertActions.error("Error Getting Role"));
            return;
        }
        dispatch(result({ role }));
        return role;
    };
}

function getCampaignDetails(campaignId) {
    return async (dispatch, getState) => {
        dispatch(started());
        let campaign;
        try {
            const { account, contract } = getState().web3;
            campaign = await contractService.getCampaignDetails(
                contract,
                account,
                campaignId
            );
        } catch (e) {
            console.log(e);
            dispatch(failure(e));
            dispatch(alertActions.error("Error Getting Campaign"));
            return;
        }
        dispatch(result({ data: { campaign } }));
    };
}

function getMyCampaigns() {
    return async (dispatch, getState) => {
        dispatch(started());
        let campaigns;
        try {
            const { account, contract } = getState().web3;
            campaigns = await contractService.getMyCampaigns(contract, account);
        } catch (e) {
            console.log(e);
            dispatch(failure(e));
            dispatch(alertActions.error("Error Getting Campaigns"));
            return;
        }
        dispatch(result({ data: { campaigns } }));
    };
}

function cleanMyBatches() {
    return async dispatch => {
        dispatch(cleanSelected({ data: { batches: undefined } }));
    }
}

function getMyBatches(campaignId) {
    return async (dispatch, getState) => {
        dispatch(started());
        let batches = undefined;
        try {
            const { account, contract } = getState().web3;
            batches = await contractService.getMyBatches(
                contract,
                account,
                campaignId
            );
        } catch (e) {
            console.log(e);
            dispatch(failure(e));
            dispatch(alertActions.error("Error Getting Batches"));
            return;
        }
        dispatch(result({ data: { batches } }));
        if (batches.length === 0) {
            dispatch(alertActions.success("No Batches Found"));
        }
    };
}

function getBatchDetails(campaignId, batchId) {
    return async (dispatch, getState) => {
        dispatch(started());
        let batch;
        try {
            const { account, contract } = getState().web3;
            batch = await contractService.getBatchDetails(
                contract,
                account,
                campaignId,
                batchId
            );
        } catch (e) {
            console.log(e);
            dispatch(failure(e));
            dispatch(alertActions.error("Error Getting Batch"));
            return;
        }
        dispatch(result({ data: { batch } }));
    };
}

function getBatches(campaignId, totalBatches) {
    return async (dispatch, getState) => {
        dispatch(started());
        let batches;
        try {
            const { account, contract } = getState().web3;
            batches = await contractService.getBatches(
                contract,
                account,
                campaignId,
                totalBatches
            );
        } catch (e) {
            console.log(e);
            dispatch(failure(e));
            dispatch(alertActions.error("Error Getting Batches"));
            return;
        }
        dispatch(result({ data: { batches } }));
    };
}

function makeCoordinator(address) {
    return async (dispatch, getState) => {
        dispatch(started());
        let data;
        try {
            const { account, contract } = getState().web3;
            data = await contractService.makeCoordinator(
                contract,
                account,
                address
            );
        } catch (e) {
            console.log(e);
            dispatch(failure(e));
            dispatch(alertActions.error("Error Making Coordinator"));
            return;
        }
        if (!data.error) {
            dispatch(alertActions.success("Made Coordinator"));
            dispatch(done());
        } else {
            dispatch(failure(data.error));
            dispatch(
                alertActions.error("Error Making Coordinator: " + data.error)
            );
        }
        return;
    };
}

function confirmPLAPickedUp(campaignId, batchId) {
    return async (dispatch, getState) => {
        dispatch(started());
        let data;
        let otherRole = "COURIER";
        try {
            const { account, contract } = getState().web3;
            const { role } = getState().contract;
            if (role === "COURIER") {
                otherRole = "COORDINATOR";
            }
            data = await contractService.confirmPLAPickedUp(
                contract,
                account,
                campaignId,
                batchId
            );
        } catch (e) {
            console.log(e);
            dispatch(failure(e));
            dispatch(alertActions.error("Error Confirming Pickup"));
            return;
        }
        if (!data.error) {
            if (data.event) {
                dispatch(alertActions.success("PLA Picked Up Confirmed"));
            } else {
                dispatch(
                    alertActions.success("Success. Waiting For " + otherRole)
                );
            }
            dispatch(done());
        } else {
            dispatch(failure(data.error));
            dispatch(
                alertActions.error("Error Confirming Pickup: " + data.error)
            );
        }
    };
}

function confirmPLAReceived(campaignId, batchId) {
    return async (dispatch, getState) => {
        dispatch(started());
        let data;
        let otherRole = "COURIER";
        try {
            const { account, contract } = getState().web3;
            const { role } = getState().contract;
            if (role === "COURIER") {
                otherRole = "MANUFACTURER";
            }
            data = await contractService.confirmPLAReceived(
                contract,
                account,
                campaignId,
                batchId
            );
        } catch (e) {
            console.log(e);
            dispatch(failure(e));
            dispatch(alertActions.error("Error Confirming Received"));
            return;
        }
        if (!data.error) {
            if (data.event) {
                dispatch(alertActions.success("PLA Received Confirmed"));
            } else {
                dispatch(
                    alertActions.success("Success. Waiting For " + otherRole)
                );
            }
            dispatch(done());
        } else {
            dispatch(failure(data.error));
            dispatch(
                alertActions.error("Error Confirming Received: " + data.error)
            );
        }
    };
}

function confirmMasksMade(campaignId, batchId, amountOfMasks) {
    return async (dispatch, getState) => {
        dispatch(started());
        let data;
        try {
            const { account, contract } = getState().web3;
            data = await contractService.confirmMasksMade(
                contract,
                account,
                campaignId,
                batchId,
                amountOfMasks
            );
        } catch (e) {
            console.log(e);
            dispatch(failure(e));
            dispatch(alertActions.error("Error Confirming Masks Made"));
            return;
        }
        if (!data.error) {
            if (data.event) {
                dispatch(alertActions.success("Confirmed Masks Made"));
            }
            dispatch(done());
        } else {
            dispatch(failure(data.error));
            dispatch(
                alertActions.error("Error Confirming Masks Made: " + data.error)
            );
        }
    };
}

function confirmMasksPickedUp(campaignId, batchId) {
    return async (dispatch, getState) => {
        dispatch(started());
        let data;
        let otherRole = "COURIER";
        try {
            const { account, contract } = getState().web3;
            const { role } = getState().contract;
            if (role === "COURIER") {
                otherRole = "MANUFACTURER";
            }
            data = await contractService.confirmMasksPickedUp(
                contract,
                account,
                campaignId,
                batchId
            );
        } catch (e) {
            console.log(e);
            dispatch(failure(e));
            dispatch(alertActions.error("Error Confirming Pickup"));
            return;
        }
        if (!data.error) {
            if (data.event) {
                dispatch(alertActions.success("Masks Picked Up Confirmed"));
            } else {
                dispatch(
                    alertActions.success("Success. Waiting For " + otherRole)
                );
            }
            dispatch(done());
        } else {
            dispatch(failure(data.error));
            dispatch(
                alertActions.error("Error Confirming Pickup: " + data.error)
            );
        }
    };
}

function confirmMasksReceived(campaignId, batchId) {
    return async (dispatch, getState) => {
        dispatch(started());
        let data;
        let otherRole = "COURIER";
        try {
            const { account, contract } = getState().web3;
            const { role } = getState().contract;
            if (role === "COURIER") {
                otherRole = "RECEIVER";
            }
            data = await contractService.confirmMasksReceived(
                contract,
                account,
                campaignId,
                batchId
            );
        } catch (e) {
            console.log(e);
            dispatch(failure(e));
            dispatch(alertActions.error("Error Confirming Received"));
            return;
        }
        if (!data.error) {
            if (data.event) {
                dispatch(alertActions.success("Masks Received Confirmed"));
            } else {
                dispatch(
                    alertActions.success("Success. Waiting For " + otherRole)
                );
            }
            dispatch(done());
        } else {
            dispatch(failure(data.error));
            dispatch(
                alertActions.error("Error Confirming Received: " + data.error)
            );
        }
    };
}

function startCampaign(campaign) {
    return async (dispatch, getState) => {
        dispatch(started());
        let data;
        try {
            const { account, contract } = getState().web3;
            data = await contractService.startCampaign(
                contract,
                account,
                campaign
            );
        } catch (e) {
            console.log(e);
            dispatch(failure(e));
            dispatch(alertActions.error("Error Starting Campaign"));
            return;
        }
        if (!data.error) {
            if (data.event) {
                dispatch(
                    alertActions.success(
                        "Started Campaign ID: " +
                            data.event.returnValues.campaignId
                    )
                );
            }
            dispatch(done());
        } else {
            dispatch(failure(data.error));
            dispatch(
                alertActions.error("Error Starting Campaign: " + data.error)
            );
        }
    };
}

function addManufacturers(data) {
    return async (dispatch, getState) => {
        dispatch(started());
        let result;
        try {
            const { account, contract } = getState().web3;
            result = await contractService.addManufacturers(
                contract,
                account,
                data
            );
        } catch (e) {
            console.log(e);
            dispatch(failure(e));
            dispatch(alertActions.error("Error Adding Manufacturers"));
            return;
        }
        if (!result.error) {
            if (result.event) {
                let number = Array.isArray(event) ? event.length : 1;
                dispatch(
                    alertActions.success(number + " Manufacturer Roles Granted")
                );
            } else {
                dispatch(alertActions.success("No Roles Granted"));
            }
            dispatch(alertActions.success("Added Manufacturers"));
            dispatch(done());
        } else {
            dispatch(failure(result.error));
            dispatch(
                alertActions.error(
                    "Error Adding Manufacturers: " + result.error
                )
            );
        }
    };
}

function addCouriers(data) {
    return async (dispatch, getState) => {
        dispatch(started());
        let result;
        try {
            const { account, contract } = getState().web3;
            result = await contractService.addCouriers(contract, account, data);
        } catch (e) {
            console.log(e);
            dispatch(failure(e));
            dispatch(alertActions.error("Error Adding Couriers"));
            return;
        }
        if (!result.error) {
            if (result.event) {
                let number = Array.isArray(events) ? events.length : 1;
                dispatch(
                    alertActions.success(number + " Courier Roles Granted")
                );
            } else {
                dispatch(alertActions.success("No Roles Granted"));
            }
            dispatch(alertActions.success("Added Couriers"));
            dispatch(done());
        } else {
            dispatch(failure(result.error));
            dispatch(
                alertActions.error("Error Adding Couriers: " + result.error)
            );
        }
    };
}

function createNewBatch(batch) {
    return async (dispatch, getState) => {
        dispatch(started());
        let result;
        try {
            const { account, contract } = getState().web3;
            result = await contractService.createNewBatch(
                contract,
                account,
                batch
            );
        } catch (e) {
            console.log(e);
            dispatch(failure(e));
            dispatch(alertActions.error("Error Creating Batch"));
            return;
        }
        if (!result.error) {
            dispatch(alertActions.success("Created & Packed New Batch ID"));
            dispatch(
                result({
                    data: {
                        newBatchId: result.event.returnValues.branchId,
                        newCampaignId: result.event.returnValues.campaignId
                    }
                })
            );
        } else {
            dispatch(failure(result.error));
            dispatch(
                alertActions.error("Error Creating Batch: " + result.error)
            );
        }
    };
}

function started() {
    return {
        type: contractConstants.STARTED
    };
}

function done() {
    return {
        type: contractConstants.DONE
    };
}

function cleanSelected(result) {
    return {
        type: contractConstants.CLEAN_SELECTED,
        ...result
    };
}

function result(result) {
    return {
        type: contractConstants.RESULT,
        ...result
    };
}

function failure(error) {
    return {
        type: contractConstants.ERROR,
        error
    };
}
