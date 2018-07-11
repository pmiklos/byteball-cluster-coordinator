/*jslint node: true */
"use strict";

const Chat = require('./Chat.js');
const device = require('byteballcore/device.js');


const chat = new Chat([]);
const usage = `Available commands:

[info](command:info) - statistics about the computing network
[dapp](command:dapp wJEV6k+WJ5vI0lolUe4CbqrMH8HnuBaaNqMI4E/R1ng=) - executes a dApp by it's hash
[ping](command:ping) - requests status check from each worker
[help](command:help) - prints this message
`;

module.exports = function(coordinatorService) {

    chat.when(/^info/, info);
    chat.when(/^ping/, ping);
    chat.when(/^(\d+)\+(\d+)/, sum);
    chat.when(/^dapp ([a-zA-Z0-9+/=]{44})/, dapp);
    chat.when(/^help/i, function(respond, message) {
        respond(usage);
    });
    chat.otherwise(function(respond, message) {
        respond("Not sure how to help with that.\n\n" + usage);
    });

    function info(respond, message) {
        coordinatorService.info((err, result) => {
            if (err) return respond(err.message);
            respond(result);
        });
    }

    function ping(respond, message) {
        coordinatorService.ping((err, result) => {
            if (err) return respond(err.message);
            respond(result);
        });
    }

    function sum(respond, message) {
        coordinatorService.sum(message.args[0], message.args[1], (err, result) => {
            if (err) return respond(err.message);
            respond("" + result);
        });
    }

    function dapp(respond, message) {
        coordinatorService.dapp(message.args[0], (err, result) => {
            if (err) return respond(err.message);
            respond(JSON.stringify(result));
        });
    }

    return {
        welcome: function(from_address, pairingSecret) {
            if (pairingSecret === 'worker') {
                coordinatorService.join(from_address);
            }
            else {
                device.sendMessageToDevice(from_address, "text", "Welcome to Distribute GA Coordinator!\n\n" + usage);
            }
        },

        respond: function(from_address, text) {
            var message = {
                device: from_address,
                text: text
            };
            chat.receive(message, function(response) {
                if (response) {
                    device.sendMessageToDevice(from_address, "text", response);
                }
            });
        }
    };
};
