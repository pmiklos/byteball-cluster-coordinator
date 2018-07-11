"use strict";

const express = require('express');

module.exports = function(coordinatorService) {

    var router = express.Router();

    router.get("/dapp/:unit", function(req, res) {
        let unit = req.params.unit;

        coordinatorService.dapp(unit, (err, result) => {
            if (err) {
                return res.status(500).send({
                    message: "dApp execution failed",
                    details: err
                });
            }
            res.send(result);
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
            res.send(result);
        });
    });

    return router;
};
