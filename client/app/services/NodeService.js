(function() {

    var app = angular.module("dapp");

    app.factory("NodeService", ["$q", "$http", function($q, $http) {

        return {
            node: function() {
                return $http.get("/api/node/").then(function(result) {
                    return result.data;
                }, function(error) {
                    console.error(error);
                    return $q.reject(error.data);
                });
            }
        };
    }]);

})();
