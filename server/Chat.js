/*jslint node: true */
"use strict";

class Chat {

    constructor(handlers) {
        this.handlers = handlers;
        this.nomatchHandler = (text) => console.err("Unmatched message: " + text);
    }

    when(pattern, handler) {
        this.handlers.push({
            pattern: pattern,
            handler: handler
        });
    }

    otherwise(handler) {
        this.nomatchHandler = handler;
    }

    match(message, callback) {
        let handler = this.handlers.find((handler) => handler.pattern.test(message.text));

        if (handler) {
            let matches = message.text.match(handler.pattern);
            let args = matches.slice(1, matches.length);
            callback(null, handler.handler, args);
        }
        else {
            callback(null, this.nomatchHandler);
        }
    }

    receive(message, respond) {
        this.match(message, function(err, handler, args) {
            if (err) return console.error(err);
            message.args = args;
            message.logger = createLogger(message);
            handler(respond, message);
        });
    }

}

function createLogger(message) {
    let prefix = function() {
        return 'message: ' + JSON.stringify({
            device: message.device,
            args: message.args
        });
    };

    return {
        log: function(msg) { console.log(prefix() + ' ' + msg); },
        warn: function(msg) { console.warn(prefix() + ' ' + msg); },
        error: function(msg) { console.error(prefix() + ' ' + msg); }
    };
}

module.exports = Chat;