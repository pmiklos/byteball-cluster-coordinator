(function() {

    var app = angular.module("dapp");

    app.factory("DappService", ["$q", "$http", function($q, $http) {

        return {
            dapp: function(unit) {
                return $http.get("/api/dapp/" + encodeURIComponent(unit)).then(function(result) {
                    return result.data;
                }, function(error) {
                    console.error(error);
                    return $q.reject(error.data);
                });
            },
            fetch: function(unit) {
                return $http.get("/api/dapp/" + encodeURIComponent(unit) + "/source").then(function(result) {
                    return result.data;
                }, function(error) {
                    console.error(error);
                    return $q.reject(error.data);
                });
            }
        };
    }]);

})();
