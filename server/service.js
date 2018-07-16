"use strict";

module.exports = function(coordinator) {

    function returnResult(delegate) {
        return (err, response) => {
            if (err) return delegate(err);
            return delegate(null, response.result);
        };
    }

    function getWorkerCount() {
        let workerCount = 0;
        coordinator.forEachWorker((worker) => workerCount++);
        return workerCount;
    }

    function info(callback) {
        callback(null, `Cluster state
workers: ${getWorkerCount()}
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

    function dapp(unit, params, callback) {
        coordinator.sendAll({
            method: "dapp",
            unit: unit,
            params: params
        }, returnResult(callback));
    }

    return {
        join: coordinator.join,
        info: info,
        ping: ping,
        sum: sum,
        dapp: dapp,
        getWorkerCount: getWorkerCount
    };
};
