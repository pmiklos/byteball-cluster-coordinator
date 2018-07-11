"use strict";

module.exports = function(coordinator) {

    function returnResult(delegate) {
        return (err, response) => {
            if (err) return delegate(err);
            return delegate(null, response.result);
        };
    }

    function info(callback) {
        let workerCount = 0;
        coordinator.forEachWorker((worker) => workerCount++);
        callback(null, `Cluster state
workers: ${workerCount}
`);
    }

    function ping(callback) {
        coordinator.sendAll({
            method: "ping"
        }, returnResult(callback));
    }

    function sum(a, b, callback) {
        coordinator.sendAll({
            method: "sum",
            a: a,
            b: b
        }, returnResult(callback));
    }

    function dapp(unit, callback) {
        coordinator.sendAll({
            method: "dapp",
            unit: unit
        }, returnResult(callback));
    }

    return {
        join: coordinator.join,
        info: info,
        ping: ping,
        sum: sum,
        dapp: dapp
    };
};
