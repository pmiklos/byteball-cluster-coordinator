(function() {

    var app = angular.module("dapp", []);

    app.config(function($compileProvider, $httpProvider) {
        $compileProvider.imgSrcSanitizationWhitelist(/^\s*((https?|ftp|file|blob|chrome-extension|byteball|byteball-tn):|data:image\/)/);
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|byteball|byteball-tn):/);
    });

    angular.element(document).ready(function() {
        angular.bootstrap(document, ["dapp"]);
    });

})();
