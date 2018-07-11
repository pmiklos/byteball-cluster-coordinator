/*jslint node: true */
"use strict";

const db = require('byteballcore/db.js');

function insertPairingSecret(pairingSecret, callback) {
    db.query('INSERT ' + db.getIgnore() + " INTO pairing_secrets (pairing_secret, is_permanent, expiry_date) VALUES (?, 1, '2038-01-01')", [pairingSecret], () => {
        callback();
    });
}

module.exports.insertPairingSecret = insertPairingSecret;
