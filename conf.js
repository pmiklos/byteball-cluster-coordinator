/*jslint node: true */
"use strict";

exports.bServeAsHub = false;
exports.bLight = true;

exports.storage = 'sqlite';

exports.hub = 'byteball.org/bb-test';
exports.deviceName = 'Byteball Cluster Coordinator';
exports.permanent_pairing_secret = 'user';
exports.KEYS_FILENAME = 'keys.json';

console.log('finished headless conf');
