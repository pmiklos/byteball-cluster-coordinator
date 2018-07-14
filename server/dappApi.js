"use strict";

const express = require('express');
const network = require("byteballcore/network.js");

// lifted from byteball-cluster-dapp-runner/dappRuner.js
function readDappFromUnit(unitHash, callback) {
    network.requestFromLightVendor("get_joint", unitHash, (ws, request, response) => {
        console.log("[%s] Joint returned", unitHash);

        if (response.error) return callback(response.error);

        let validJoint = response && response.joint && response.joint.unit && response.joint.unit.messages;

        if (!validJoint) {
            return callback("Invalid unit");
        }

        let unit = response.joint.unit;
        let textMessage = unit.messages.find((message) => message.app == "text");

        if (textMessage) {
            callback(null, textMessage.payload);
        }
        else {
            callback("Not a DApp");
        }
    });
}

module.exports = function(coordinatorService) {

    var router = express.Router();

    router.get("/dapp/:unit", function(req, res) {
        let unit = req.params.unit;

        coordinatorService.dapp(unit, (err, result) => {
            if (err) {
                return res.status(500).send({
                    message: "DApp execution failed",
                    details: err
                });
            }
            res.header('Content-Type', 'text/plain');
            res.send('' + result);
        });
    });

    router.get("/dapp/:unit/source", function(req, res) {
        let unit = req.params.unit;

        readDappFromUnit(unit, (err, source) => {
            if (err) {
                return res.status(500).send({
                    message: "DApp source failed to load",
                    details: err
                });
            }

            res.header('Content-Type', 'text/plain');
            res.send('' + source);
        });
    });

    router.post('/dapp', function(req, res) {
        let unit = req.body.unit;

        console.error("dapp: " + unit);
        if (!unit) {
            return res.status(400).send({
                message: "Missing unit"
            });
        }

        coordinatorService.dapp(unit, (err, result) => {
            if (err) {
                return res.status(500).send({
                    message: "dApp execution failed",
                    details: err
                });
            }
            if (req.is("*/json")) return res.json({ result: result });
            res.header('Content-Type', 'text/plain');
            res.send(result);
        });
    });

    return router;
};
