"use strict";

const express = require('express');
const config = require("byteballcore/conf.js");
const device = require("byteballcore/device.js");
const constants = require("byteballcore/constants.js");

function isTestnet() {
    var byteballVersion = constants.version;
    return byteballVersion.endsWith("t");
}

function getProtocol() {
    return isTestnet() ? "byteball-tn" : "byteball";    
}

function getUserPairingCode() {
    return device.getMyDevicePubKey() + "@" + config.hub + "#" + config.permanent_pairing_secret;
}

function getWorkerPairingCode() {
    return device.getMyDevicePubKey() + "@" + config.hub + "#worker";
}

module.exports = function(coordinatorService) {

    var router = express.Router();

    router.get("/node", function(req, res) {
        res.json({
            network: isTestnet() ? "testnet" : "mainnet",
            protocol: getProtocol(),
            userPairingCode: getUserPairingCode(),
            workerPairingCode: getWorkerPairingCode(),
            workerCount: coordinatorService.getWorkerCount()
        });
    });

    return router;
};
