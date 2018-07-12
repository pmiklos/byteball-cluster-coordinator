(function() {

    var app = angular.module("dapp");

    app.controller("DappController", ["$scope", "DappService", function($scope, DappService) {
        $scope.unit = "";
        $scope.running = false;

        $scope.run = function() {
            $scope.running = true;
            DappService.dapp($scope.unit).then(function(result) {
                $scope.running = false;
                $scope.result = result;
                $scope.error = "";
            }, function(error) {
                $scope.running = false;
                $scope.result = "";
                $scope.error = error.message;
            });
        };

        $scope.getDappUrl = function() {
            return "/api/dapp/" + encodeURIComponent($scope.unit);
        };

        $scope.getDappSource = function() {
            DappService.fetch($scope.unit).then(function(source) {
                $scope.source = source;
            }, function(error) {
                console.error(error);
            });
        };

//        $scope.$watch("source", function(newVal, oldVal) {});

    }]);

})();
