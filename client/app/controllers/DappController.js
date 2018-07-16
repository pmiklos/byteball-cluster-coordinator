(function() {

    var app = angular.module("dapp");

    app.controller("DappController", ["$scope", "DappService", "NodeService", function($scope, DappService, NodeService) {
        $scope.unit = "";
        $scope.params = [];
        $scope.running = false;

        function fetchNodeInfo() {
            NodeService.node().then(function(nodeInfo) {
                $scope.nodeInfo = nodeInfo;
            }, function(error) {
                console.error("Failed to retrieve node info: " + error.message);
            });
        }

        $scope.run = function() {
            $scope.running = true;
            DappService.dapp($scope.unit, $scope.params).then(function(result) {
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
            return DappService.getDappUrl($scope.unit, $scope.params);
        };

        $scope.getDappSource = function() {
            DappService.fetch($scope.unit).then(function(source) {
                $scope.source = source;
            }, function(error) {
                console.error(error);
            });
        };

        $scope.addParam = function() {
            $scope.params.push({
                name: "",
                value: ""
            });
        };

        $scope.deleteParam = function(name) {
            let idx = $scope.params.findIndex(function(param) { return param.name == name });
            delete $scope.params.splice(idx, 1);
        };

        //        $scope.$watch("source", function(newVal, oldVal) {});

        fetchNodeInfo();
    }]);

})();
