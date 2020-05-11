export const contractConstants = {
    ROLES: [
        "COORDINATOR",
        "MANUFACTURER",
        "COURIER",
        "ADMIN",
        "RECEIVER"
    ],

    STAGES: [
        "Not Started",
        "PLA Packed by Coordinator",
        "PLA Picked-up by Courier",
        "PLA Received by Manufacturer",
        "Masks Ready for Pick-up",
        "Masks Picked-up by Courier",
        "Masks Received by Receiver", 
        "Masks Verified for Quality"
    ],

    ADMIN_ROLE:
        "0xf23ec0bb4210edd5cba85afd05127efcd2fc6a781bfed49188da1081670b22d8",
    COORDINATOR_ROLE:
        "0xaf8c8b3d1b230c888f16d0aac400b28aa51e631d580aaa7cb46e571590ed44e7",
    COURIER_ROLE:
        "0x7fc3771f539a03c47afbbf258702c19273ef5e735e24ee7978081dc07288c687",
    MANUFACTURER_ROLE:
        "0xb528929ed79eb79a87ae6f578d3125509c91bfea9ac8b7fb9f69aa0bc28298dd",
    RECEIVER_ROLE:
        "0x5e784e45feb63c375016d4ce5c52a57b0a48b8a170bc2e31463be0d03d1c4db6",


    STARTED: "CONTRACT_STARTED",
    DONE: "CONTRACT_DONE",
    CLEAN: "CONTRACT_CLEAN",
    CLEAN_SELECTED: "CONTRACT_CLEAN_SELECTED",
    ERROR: "CONTRACT_ERROR",
    RESULT: "CONTRACT_RESULT"
};
