
(function () {
    'use strict';


    angular.module('app', ['ngRoute', 'component', 'directives', 'data']);
    angular.module('app').config(["$routeProvider", "$locationProvider", function ($routeProvider, $locationProvider) {
       
        $routeProvider
        .when('/test', { templateUrl: '/lib/pixeladmin/templates/tests.html', controller: 'testCtrl' })
        .when('/test/:id', { templateUrl: '/lib/pixeladmin/templates/test.html', controller: 'testCtrl' })
        .when('/charts', { templateUrl: '/lib/pixeladmin/templates/charts.html', controller: 'testCtrl' })
        .when('/completeui', { templateUrl: '/lib/pixeladmin/templates/completeui.html', controller: 'testCtrl' })
        .when('/formcomponents', { templateUrl: '/lib/pixeladmin/templates/formComponents.html', controller: 'testCtrl' })
        .when('/formsadvanced', { templateUrl: '/lib/pixeladmin/templates/formsadvanced.html', controller: 'testCtrl' })
        .when('/layouts', { templateUrl: '/lib/pixeladmin/templates/layouts.html', controller: 'testCtrl' })
        .when('/pages1', { templateUrl: '/lib/pixeladmin/templates/pages1.html', controller: 'testCtrl' })
        .when("/elements", { templateUrl: '/lib/pixeladmin/templates/elements.html', controller: 'testCtrl' })
        .when('/pagessignup', { templateUrl: '/lib/pixeladmin/templates/pagessignup.html', controller: 'testCtrl' })
        .when('/pagessignin', { templateUrl: '/lib/pixeladmin/templates/pagessignin.html', controller: 'testCtrl' })
        .when('/index', { templateUrl: '/lib/pixeladmin/templates/index.html', controller: 'testCtrl' })
      
        .when('/angularcomponents', { templateUrl: '/lib/pixeladmin/templates/angularcomponents.html', controller: 'testCtrl' })
        .when('/rottentomatoes', { templateUrl: '/lib/pixeladmin/templates/RottenTomatoes.html', controller: 'rottentomatoesCtrl' })
	.otherwise({ redirectTo: '/test' });
    }]);

    angular.module('app').run(["storage", "$rootScope", "$route", "$location", "mainMenuService", function (storage, $rootScope, $route, $location, mainMenuService) {

        var initStorage = function (storageitem) {
            storageitem.getitems();
            if (!storageitem.result.listcolumns) {
                storageitem.result.listcolumns = ["Name"];
                storageitem.result.viewMode = 'list';
                storageitem.setrootItem(storageitem.result);
            }
        }


        var productStorage = new storage("ProductsView");
        var cultureStorage = new storage("CultureView");
        var locStorage = new storage("LocationView");
        initStorage(productStorage);
        initStorage(cultureStorage);
        initStorage(locStorage);


        //Main Menu items
        mainMenuService.init();
        var setactive = function (address) {
            $("#main-menu  li").removeClass("active");
            $("#top-menu li").removeClass("active");

            var addr = "a[href='/" + address + "']";
            var elem = $(addr).parent().addClass("active");
        }
        $rootScope.$on('$locationChangeStart', function (ev, next, current) {
            var nextPath = $location.path();
            var nextRoute = $route.routes[nextPath];

            setactive("#" + nextPath);
        });
    }]);



})();