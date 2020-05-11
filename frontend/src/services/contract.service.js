import { getStringFromRole, getRoleFromString, logReceipt } from "../helpers";

export const contractService = {
    getRole,
    getCampaignDetails,
    getBatchDetails,
    getBatches,
    makeCoordinator,
    confirmPLAPickedUp,
    confirmPLAReceived,
    confirmMasksMade,
    confirmMasksPickedUp,
    confirmMasksReceived,
    startCampaign,
    addManufacturers,
    addCouriers,
    createNewBatch,
    getMyCampaigns,
    getMyBatches
};

async function getRole(contract, account) {
    const role = await contract.methods
        .getRole(account)
        .call({ from: account });
    return getStringFromRole(role);
}

async function getCampaignDetails(contract, account, campaignId) {
    return contract.methods
        .getCampaignDetalis(campaignId)
        .call({ from: account });
}

async function getBatchDetails(contract, account, campaignId, batchId) {
    return contract.methods
        .getBatchDetails(campaignId, batchId)
        .call({ from: account });
}

async function getBatches(contract, account, campaignId, totalBatches) {
    return Promise.all(
        Array(totalBatches)
            .fill(1)
            .map((el, i) =>
                contract.methods
                    .getBatchDetails(campaignId, i + 1)
                    .call({ from: account })
            )
    );
}

async function makeCoordinator(contract, account, address) {
    const receipt = await contract.methods
        .makeCoordinator(address)
        .send({ from: account });
    if (!receipt.status) {
        logReceipt(receipt);
        return { error: "Transaction failed" };
    }
    return {};
}

async function confirmPLAPickedUp(contract, account, campaignId, batchId) {
    const receipt = await contract.methods
        .confirmPLAPickedUpByCourier1(campaignId, batchId)
        .send({ from: account });
    if (!receipt.status) {
        logReceipt(receipt);
        return { error: "Transaction failed" };
    }
    return { event: receipt.events["PLAPickedUpByCourier1"] };
}

async function confirmPLAReceived(contract, account, campaignId, batchId) {
    const receipt = await contract.methods
        .confirmPLARecivedByManufacturer(campaignId, batchId)
        .send({ from: account });
    if (!receipt.status) {
        logReceipt(receipt);
        return { error: "Transaction failed" };
    }
    return { event: receipt.events["PLARecivedByManufacturer"] };
}

async function confirmMasksMade(
    contract,
    account,
    campaignId,
    batchId,
    amoutOfMasks
) {
    const receipt = await contract.methods
        .confirmMasksMade(campaignId, batchId, amountOfMasks)
        .send({ from: account });
    if (!receipt.status) {
        logReceipt(receipt);
        return { error: "Transaction failed" };
    }

    return { event: receipt.events["MasksReady"] };
}

async function confirmMasksPickedUp(contract, account, campaignId, batchId) {
    const receipt = await contract.methods
        .confirmMasksPickedUpByCourier2(campaignId, batchId)
        .send({ from: account });
    if (!receipt.status) {
        logReceipt(receipt);
        return { error: "Transaction failed" };
    }
    return { event: receipt.events["MasksPickedUpByCourier2"] };
}

async function confirmMasksReceived(contract, account, campaignId, batchId) {
    const receipt = await contract.methods
        .confirmMasksRceivedByReceiver(campaignId, batchId)
        .send({ from: account });
    if (!receipt.status) {
        logReceipt(receipt);
        return { error: "Transaction failed" };
    }
    return { event: receipt.events["MasksRceivedByReceiver"] };
}

async function startCampaign(contract, account, campaign) {
    const receipt = await contract.methods
        .startCampaign(
            campaign.manufacturers,
            campaign.couriers,
            campaign.receiver,
            campaign.totalPLA
        )
        .send({ from: account });
    if (!receipt.status) {
        logReceipt(receipt);
        return { error: "Transaction failed" };
    }
    return { event: receipt.events["CampaignStarted"] };
}

async function addManufacturers(contract, account, data) {
    const receipt = await contract.methods
        .addManufacturers(data.campaignId, data.manufacturers)
        .send({ from: account });
    if (!receipt.status) {
        logReceipt(receipt);
        return { error: "Transaction failed" };
    }
    return { event: receipt.events["RoleGranted"] };
}

async function addCouriers(contract, account, data) {
    const receipt = await contract.methods
        .addCouriers(data.campaignId, data.couriers)
        .send({ from: account });
    if (!receipt.status) {
        logReceipt(receipt);
        return { error: "Transaction failed" };
    }
    return { event: receipt.events["RoleGranted"] };
}

async function createNewBatch(contract, account, batch) {
    const {
        campaignId,
        amountOfPLA,
        expectedAmountOfMasks,
        tfForDeliveryToManufacturer,
        tfForMakingMasks,
        tfForDeliveryToReceiver,
        courier1,
        courier2,
        manufacturer
    } = batch;
    const receipt = await contract.methods
        .createNewBatch(
            campaignId,
            amountOfPLA,
            expectedAmountOfMasks,
            tfForDeliveryToManufacturer,
            tfForMakingMasks,
            tfForDeliveryToReceiver,
            courier1,
            courier2,
            manufacturer
        )
        .send({ from: account });
    if (!receipt.status) {
        logReceipt(receipt);
        return { error: "Transaction failed" };
    }
    return { event: receipt.events["PLAPacked"] };
}

async function getMyCampaigns(contract, account) {
    const campaignIds = await contract.methods
        .partOfWhichCampaigns(account)
        .call({ from: account });
    const result = await Promise.all(
        campaignIds.map(id => getCampaignDetails(contract, account, id))
    );
    return result;
}

async function getMyBatches(contract, account, campaignId) {
    const batchIds = await contract.methods
        .partOfWhichBatches(campaignId, account)
        .call({ from: account });
    return Promise.all(
        batchIds.map(id =>
            getBatchDetails(contract, account, campaignId, id)
        )
    );
}
