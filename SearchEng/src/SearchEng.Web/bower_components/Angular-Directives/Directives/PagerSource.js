angular.module('directives').controller('mmPagerSourceController', ['$scope', '$attrs', '$parse', "$filter", function ($scope, $attrs, $parse, $filter) {
    var self = this,
        ngModelCtrl = { $setViewValue: angular.noop }, // nullModelCtrl
        setNumPages = $attrs.numPages ? $parse($attrs.numPages).assign : angular.noop;

    this.init = function (ngModelCtrl_, config) {
        ngModelCtrl = ngModelCtrl_;
        this.config = config;

        ngModelCtrl.$render = function () {
            self.render();
        };

        if ($attrs.itemsPerPage) {
            $scope.$parent.$watch($parse($attrs.itemsPerPage), function (value) {
                self.itemsPerPage = parseInt(value, 10);
                $scope.totalPages = self.calculateTotalPages();
                $scope.setResults($scope.page, self.itemsPerPage, $scope.itemssource, $scope.filter, $scope.sort, $scope.descending)

            });
        } else {
            this.itemsPerPage = config.itemsPerPage;
        }
    };

    this.calculateTotalPages = function () {
        var totalPages = this.itemsPerPage < 1 ? 1 : Math.ceil($scope.totalItems / this.itemsPerPage);
        return Math.max(totalPages || 0, 1);
    };

    this.render = function () {
        $scope.page = parseInt(ngModelCtrl.$viewValue, 10) || 1;
    };

    $scope.selectPage = function (page) {
        if ($scope.page !== page && page > 0 && page <= $scope.totalPages) {
            ngModelCtrl.$setViewValue(page);
            $scope.setResults(page, self.itemsPerPage, $scope.itemssource, $scope.filter,  $scope.sort, $scope.descending)
            ngModelCtrl.$render();
        }
    };

    $scope.getText = function (key) {
        return $scope[key + 'Text'] || self.config[key + 'Text'];
    };
    $scope.noPrevious = function () {
        return $scope.page === 1;
    };
    $scope.noNext = function () {
        return $scope.page === $scope.totalPages;
    };

    $scope.$watch('totalItems', function () {
        $scope.totalPages = self.calculateTotalPages();
    });

    $scope.$watchCollection('filter', function () {
        $scope.totalPages = self.calculateTotalPages();
        $scope.setResults($scope.page, self.itemsPerPage, $scope.itemssource, $scope.filter, $scope.sort, $scope.descending)
    });

    $scope.$watchCollection('sort', function () {
        $scope.totalPages = self.calculateTotalPages();
        $scope.setResults($scope.page, self.itemsPerPage, $scope.itemssource, $scope.filter, $scope.sort, $scope.descending)
    });

    $scope.$watchCollection('descending', function () {
        $scope.totalPages = self.calculateTotalPages();
        $scope.setResults($scope.page, self.itemsPerPage, $scope.itemssource, $scope.filter, $scope.sort, $scope.descending)
    });

    $scope.$watch('totalPages', function (value) {
        setNumPages($scope.$parent, value); // Readonly variable

        if ($scope.page > value) {
            $scope.selectPage(value);
        } else {
            ngModelCtrl.$render();
        }
    });

    $scope.$watch("itemssource", function (newvalue, oldvalue) {
        if ($scope.itemssource && self.itemsPerPage && $scope.itemssource.length && $scope.page) {
            $scope.setResults($scope.page, self.itemsPerPage, $scope.itemssource, $scope.filter, $scope.sort, $scope.descending)
        };
    });

    $scope.setResults = function (pagenumber, itemsPerPage, itemssource, filter, sort, descending) {
        if (pagenumber && itemssource && itemssource.length && itemsPerPage) {
            var filteredData = {};
            if (filter) {
                filteredData = $filter('filter')($scope.itemssource, $scope.filter);
            } else {
                filteredData = itemssource;
            }

            if (sort) {
                if ($scope.descending) {
                    filteredData = $filter('orderBy')(filteredData, $scope.sort, true);
                } else {
                    filteredData = $filter('orderBy')(filteredData, $scope.sort);
                }

            }
          
            $scope.totalItems = filteredData.length;
            var from = (pagenumber - 1) * itemsPerPage;
            var to = pagenumber * itemsPerPage
            $scope.totalPages = self.calculateTotalPages();
            $scope.results = filteredData.slice(from, to)
        }
    };
}])

.constant('pagerSourceConfig', {
    itemsPerPage: 10,
    boundaryLinks: true,
    directionLinks: true,
    firstText: '<<',
    previousText: '<',
    nextText: '>',
    lastText: '>>',
    rotate: false,
    maxSize: 10,
})

.directive('pagerSource', ['$parse', 'pagerSourceConfig', "$filter", function ($parse, pagerSourceConfig, $filter) {
    return {
        restrict: 'EA',
        scope: {
            firstText: '@',
            previousText: '@',
            nextText: '@',
            lastText: '@',
            itemssource: '=',
            filter: '=',
            sort:'=',
            descending:'=',
            results:'=',
        },
        require: ['pagerSource', '?ngModel'],
        controller: 'mmPagerSourceController',
        template:'<ul class="pagination">'+
        '<li ng-if="boundaryLinks" ng-class="{disabled: noPrevious()}"><a href ng-click="selectPage(1)">{{getText("first")}}</a></li>'+
        '<li ng-if="directionLinks" ng-class="{disabled: noPrevious()}"><a href ng-click="selectPage(page - 1)">{{getText("previous")}}</a></li>'+
        '<li ng-repeat="page in pages track by $index" ng-class="{active: page.active}"><a href ng-click="selectPage(page.number)">{{page.text}}</a></li>'+
        '<li ng-if="directionLinks" ng-class="{disabled: noNext()}"><a href ng-click="selectPage(page + 1)">{{getText("next")}}</a></li>'+
        '<li ng-if="boundaryLinks" ng-class="{disabled: noNext()}"><a href ng-click="selectPage(totalPages)">{{getText("last")}}</a></li>'+
        '</ul>',

        //templateUrl: '/App/templates/pagination/pagination.html',
        replace: true,
        link: function (scope, element, attrs, ctrls) {
            var pagerSourceCtrl = ctrls[0], ngModelCtrl = ctrls[1];
          
            if (!ngModelCtrl) {
                return; // do nothing if no ng-model
            }

            // Setup configuration parameters
            var maxSize = angular.isDefined(attrs.maxSize) ? scope.$parent.$eval(attrs.maxSize) : pagerSourceConfig.maxSize,
                rotate = angular.isDefined(attrs.rotate) ? scope.$parent.$eval(attrs.rotate) : pagerSourceConfig.rotate;
            scope.boundaryLinks = angular.isDefined(attrs.boundaryLinks) ? scope.$parent.$eval(attrs.boundaryLinks) : pagerSourceConfig.boundaryLinks;
            scope.directionLinks = angular.isDefined(attrs.directionLinks) ? scope.$parent.$eval(attrs.directionLinks) : pagerSourceConfig.directionLinks;

            pagerSourceCtrl.init(ngModelCtrl, pagerSourceConfig);

            if (attrs.maxSize) {
                scope.$parent.$watch($parse(attrs.maxSize), function (value) {
                    maxSize = parseInt(value, 10);
                    pagerSourceCtrl.render();
                });
            }

            // Create page object used in template
            function makePage(number, text, isActive) {
                return {
                    number: number,
                    text: text,
                    active: isActive
                };
            }

            function getPages(currentPage, totalPages) {
                var pages = [];

                // Default page limits
                var startPage = 1, endPage = totalPages;
                var isMaxSized = (angular.isDefined(maxSize) && maxSize < totalPages);

                // recompute if maxSize
                if (isMaxSized) {
                    if (rotate) {
                        // Current page is displayed in the middle of the visible ones
                        startPage = Math.max(currentPage - Math.floor(maxSize / 2), 1);
                        endPage = startPage + maxSize - 1;

                        // Adjust if limit is exceeded
                        if (endPage > totalPages) {
                            endPage = totalPages;
                            startPage = endPage - maxSize + 1;
                        }
                    } else {
                        // Visible pages are paginated with maxSize
                        startPage = ((Math.ceil(currentPage / maxSize) - 1) * maxSize) + 1;

                        // Adjust last page if limit is exceeded
                        endPage = Math.min(startPage + maxSize - 1, totalPages);
                    }
                }

                // Add page number links
                for (var number = startPage; number <= endPage; number++) {
                    var page = makePage(number, number, number === currentPage);
                    pages.push(page);
                }

                // Add links to move between page sets
                if (isMaxSized && !rotate) {
                    if (startPage > 1) {
                        var previousPageSet = makePage(startPage - 1, '...', false);
                        pages.unshift(previousPageSet);
                    }

                    if (endPage < totalPages) {
                        var nextPageSet = makePage(endPage + 1, '...', false);
                        pages.push(nextPageSet);
                    }
                }

                return pages;
            }

            var originalRender = pagerSourceCtrl.render;
            pagerSourceCtrl.render = function () {
                originalRender();
                if (scope.page > 0 && scope.page <= scope.totalPages) {
                    scope.pages = getPages(scope.page, scope.totalPages);
                }
            };
        }
    };
}])




//.controller('PaginationController', ['$scope', '$attrs', '$parse', function ($scope, $attrs, $parse) {
//    var self = this,
//        ngModelCtrl = { $setViewValue: angular.noop }, // nullModelCtrl
//        setNumPages = $attrs.numPages ? $parse($attrs.numPages).assign : angular.noop;

//    this.init = function (ngModelCtrl_, config) {
//        ngModelCtrl = ngModelCtrl_;
//        this.config = config;

//        ngModelCtrl.$render = function () {
//            self.render();
//        };

//        if ($attrs.itemsPerPage) {
//            $scope.$parent.$watch($parse($attrs.itemsPerPage), function (value) {
//                self.itemsPerPage = parseInt(value, 10);
//                $scope.totalPages = self.calculateTotalPages();
//            });
//        } else {
//            this.itemsPerPage = config.itemsPerPage;
//        }
//    };

//    this.calculateTotalPages = function () {
//        var totalPages = this.itemsPerPage < 1 ? 1 : Math.ceil($scope.totalItems / this.itemsPerPage);
//        return Math.max(totalPages || 0, 1);
//    };

//    this.render = function () {
//        $scope.page = parseInt(ngModelCtrl.$viewValue, 10) || 1;
//    };

//    $scope.selectPage = function (page) {
//        if ($scope.page !== page && page > 0 && page <= $scope.totalPages) {
//            ngModelCtrl.$setViewValue(page);
//            ngModelCtrl.$render();
//        }
//    };

//    $scope.getText = function (key) {
//        return $scope[key + 'Text'] || self.config[key + 'Text'];
//    };
//    $scope.noPrevious = function () {
//        return $scope.page === 1;
//    };
//    $scope.noNext = function () {
//        return $scope.page === $scope.totalPages;
//    };

//    $scope.$watch('totalItems', function () {
//        $scope.totalPages = self.calculateTotalPages();
//    });

//    $scope.$watch('totalPages', function (value) {
//        setNumPages($scope.$parent, value); // Readonly variable

//        if ($scope.page > value) {
//            $scope.selectPage(value);
//        } else {
//            ngModelCtrl.$render();
//        }
//    });
//}])

//.constant('paginationConfig', {
//    itemsPerPage: 10,
//    boundaryLinks: false,
//    directionLinks: true,
//    firstText: 'First',
//    previousText: 'Previous',
//    nextText: 'Next',
//    lastText: 'Last',
//    rotate: true
//})
//.directive('pagination', ['$parse', 'pagerSourceConfig', function ($parse, paginationConfig) {
//    return {
//        restrict: 'EA',
//        scope: {
//            totalItems: '=',
//            firstText: '@',
//            previousText: '@',
//            nextText: '@',
//            lastText: '@'
//        },
//        require: ['pagination', '?ngModel'],
//        controller: 'PaginationController',
//        template: '<ul class="pagination">' +
//    '<li ng-if="boundaryLinks" ng-class="{disabled: noPrevious()}"><a href ng-click="selectPage(1)">{{getText("first")}}</a></li>' +
//    '<li ng-if="directionLinks" ng-class="{disabled: noPrevious()}"><a href ng-click="selectPage(page - 1)">{{getText("previous")}}</a></li>' +
//    '<li ng-repeat="page in pages track by $index" ng-class="{active: page.active}"><a href ng-click="selectPage(page.number)">{{page.text}}</a></li>' +
//    '<li ng-if="directionLinks" ng-class="{disabled: noNext()}"><a href ng-click="selectPage(page + 1)">{{getText("next")}}</a></li>' +
//    '<li ng-if="boundaryLinks" ng-class="{disabled: noNext()}"><a href ng-click="selectPage(totalPages)">{{getText("last")}}</a></li>' +
//    '</ul>',
//        //templateUrl: 'template/pagination/pagination.html',
//        replace: true,
//        link: function (scope, element, attrs, ctrls) {
//            var paginationCtrl = ctrls[0], ngModelCtrl = ctrls[1];

//            if (!ngModelCtrl) {
//                return; // do nothing if no ng-model
//            }

//            // Setup configuration parameters
//            var maxSize = angular.isDefined(attrs.maxSize) ? scope.$parent.$eval(attrs.maxSize) : paginationConfig.maxSize,
//                rotate = angular.isDefined(attrs.rotate) ? scope.$parent.$eval(attrs.rotate) : paginationConfig.rotate;
//            scope.boundaryLinks = angular.isDefined(attrs.boundaryLinks) ? scope.$parent.$eval(attrs.boundaryLinks) : paginationConfig.boundaryLinks;
//            scope.directionLinks = angular.isDefined(attrs.directionLinks) ? scope.$parent.$eval(attrs.directionLinks) : paginationConfig.directionLinks;

//            paginationCtrl.init(ngModelCtrl, paginationConfig);

//            if (attrs.maxSize) {
//                scope.$parent.$watch($parse(attrs.maxSize), function (value) {
//                    maxSize = parseInt(value, 10);
//                    paginationCtrl.render();
//                });
//            }

//            // Create page object used in template
//            function makePage(number, text, isActive) {
//                return {
//                    number: number,
//                    text: text,
//                    active: isActive
//                };
//            }

//            function getPages(currentPage, totalPages) {
//                var pages = [];

//                // Default page limits
//                var startPage = 1, endPage = totalPages;
//                var isMaxSized = (angular.isDefined(maxSize) && maxSize < totalPages);

//                // recompute if maxSize
//                if (isMaxSized) {
//                    if (rotate) {
//                        // Current page is displayed in the middle of the visible ones
//                        startPage = Math.max(currentPage - Math.floor(maxSize / 2), 1);
//                        endPage = startPage + maxSize - 1;

//                        // Adjust if limit is exceeded
//                        if (endPage > totalPages) {
//                            endPage = totalPages;
//                            startPage = endPage - maxSize + 1;
//                        }
//                    } else {
//                        // Visible pages are paginated with maxSize
//                        startPage = ((Math.ceil(currentPage / maxSize) - 1) * maxSize) + 1;

//                        // Adjust last page if limit is exceeded
//                        endPage = Math.min(startPage + maxSize - 1, totalPages);
//                    }
//                }

//                // Add page number links
//                for (var number = startPage; number <= endPage; number++) {
//                    var page = makePage(number, number, number === currentPage);
//                    pages.push(page);
//                }

//                // Add links to move between page sets
//                if (isMaxSized && !rotate) {
//                    if (startPage > 1) {
//                        var previousPageSet = makePage(startPage - 1, '...', false);
//                        pages.unshift(previousPageSet);
//                    }

//                    if (endPage < totalPages) {
//                        var nextPageSet = makePage(endPage + 1, '...', false);
//                        pages.push(nextPageSet);
//                    }
//                }

//                return pages;
//            }

//            var originalRender = paginationCtrl.render;
//            paginationCtrl.render = function () {
//                originalRender();
//                if (scope.page > 0 && scope.page <= scope.totalPages) {
//                    scope.pages = getPages(scope.page, scope.totalPages);
//                }
//            };
//        }
//    };
//}])
