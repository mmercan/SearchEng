angular.module('app', ['ngRoute','directives' ,'component','data']);
angular.module('app').config(["$routeProvider", "$locationProvider", function ($routeProvider, $locationProvider) {

    $routeProvider
     .when('/search', { templateUrl: '/App/Search/search.html', controller: 'SearchCtrl' })
         .when('/product/:id', { templateUrl: '/App/product/productdetail.html', controller: 'productCtrl' })
        .when('/book/:id', { templateUrl: '/App/book/bookdetail.html', controller: 'bookCtrl' })
     .otherwise({ redirectTo: '/search' });


}]);