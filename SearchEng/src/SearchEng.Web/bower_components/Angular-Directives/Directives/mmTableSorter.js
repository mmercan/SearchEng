(function () {
    angular.module('directives').directive("mmTableSorter", ["$http", "$compile", function ($http, $compile) {
        return {
            //restrict: "E",
            //transclude: true,
            scope: {
                sort: "=",
                columns: "=",
                descending: "=",
            },
            link: function (scope, element, attrs) {
                var columns = scope.columns;
                var createtable = function () {
                    scope.sort = "";
                    scope.descending = false;
                    scope.fieldnames = [];
                    scope.sortit = function (item) {
                        if (scope.sort == item) {
                            scope.descending = !scope.descending;
                        } else {
                            scope.descending = false;
                            scope.sort = item;
                        }
                    };
                    for (var i = 0; i < columns.length; i++) {
                        prop = columns[i];
                        if (scope.sort == "") {
                            scope.sort = prop;
                        }
                        scope.fieldnames.push({ 'fieldname': prop, 'title': prop.replace("_", " ").split(/(?=[A-Z])/).join(" ") });
                    }
                    var headertext = "<thead class='tablecontainer'><tr> <th ng-repeat='item in fieldnames'><a ng-click='sortit(item.fieldname)' > {{item.title}} <span ng-show='sort == item.fieldname' > <span ng-show='descending'> <i class='fa fa-caret-square-o-down'></i>  </span>  <span ng-hide='descending'> <i class='fa fa-caret-square-o-up'></i> </span>  </span>  </a> </th> </tr></thead>";
                    var full = headertext;


                    $(element).append(headertext);
                    var tablecontainer = angular.element(element[0].getElementsByClassName("tablecontainer")[0]);
                    $compile(tablecontainer)(scope);
                };

                //if (columns != null) {
                //    scope.$watch("columns", function (newVal, oldVal) {
                //        tablecontainer.empty();
                //        columns = scope.columns;
                //        createtable();
                //    });
                //}
                createtable();
            },
            controller: function ($scope, $element, $attrs) {
                
            },
           
        };
    }]);
})();