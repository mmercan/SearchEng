angular.module('app', ['ngRoute','directives' ,'component','data']);
angular.module('app').config(["$routeProvider", "$locationProvider", function ($routeProvider, $locationProvider) {

    $routeProvider
     .when('/search', { templateUrl: '/App/Search/search.html', controller: 'SearchCtrl' })
     .otherwise({ redirectTo: '/search' });


}]);