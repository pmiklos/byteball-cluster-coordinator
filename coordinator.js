/*jslint node: true */
"use strict";

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const eventBus = require('byteballcore/event_bus.js');
const headlessWallet = require('headless-byteball');
const cluster = require("byteball-cluster");
const conversation = require('./server/conversation.js');
const repository = require("./server/repository.js");
const restApi = require("./server/restApi.js");
const service = require("./server/service.js");

const webapp = express();
const httpPort = process.env.PORT || 8080;
const httpHost = process.env.IP || "127.0.0.1";
const coordinator = cluster.Coordinator;
const coordinatorService = service(coordinator);
const coordinatorChat = conversation(coordinatorService);
const coordinatorRestApi = restApi(coordinatorService)
const jsonContent = (text) => text.match(/\{.*\}/);
const notJsonContent = (text) => !jsonContent(text);


function when(predicate, delegate) {
    return (peer, text) => {
        if (predicate(text)) {
            delegate(peer, text);
        }
    };
}

webapp.use(express.static(path.resolve(__dirname, 'client')));
webapp.use(bodyParser.urlencoded({ extended: true }));
webapp.use(bodyParser.json());
webapp.use('/api', coordinatorRestApi);


repository.insertPairingSecret('worker', () => {});

eventBus.once('headless_wallet_ready', function() {
    webapp.listen(httpPort, httpHost);
});


eventBus.on('paired', coordinatorChat.welcome);
eventBus.on('text', when(notJsonContent, coordinatorChat.respond));
eventBus.on('text', when(jsonContent, coordinator.listen));
