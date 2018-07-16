(function() {

    var app = angular.module("dapp");

    app.factory("DappService", ["$q", "$http", function($q, $http) {

        function getDappUrl(unit, params) {
            let queryString = params.map(function(param) { return param.name + '=' + param.value }).join('&');
            return "/api/dapp/" + encodeURIComponent(unit) + '?' + queryString;
        };


        return {
            getDappUrl: getDappUrl,
            dapp: function(unit, params) {
                return $http.get(getDappUrl(unit, params)).then(function(result) {
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
