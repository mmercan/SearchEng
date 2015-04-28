(function () {
    angular.module('data').factory("dataContext", ["$http", "progressBar","dxTest" , function ($http, progressBar, dxTest) {
          dxTest: dxTest
       
        return {
            Products: dxTest,
        };
    }]);
})();