//<div class="http-get" address="'/Api/Categoryjson'" results="categories"></div>
(function () {
    
    angular.module('directives').directive('mmHttpGet', ["$http", function ($http) {
        return {
            restrict: 'C',
            require: 'ngModel',
            //scope: {
            //    address: "@",
            //    results: "=",
            //},
            link: function (scope, element, attrs, ngModelCtrl) {
                if (!attrs.address) return;
                $http.get(attrs.address, { cache: true }).then(
                  function (results) {
                      ngModelCtrl.$setViewValue(results.data);
                  });
            }
        }
    }]);
})();