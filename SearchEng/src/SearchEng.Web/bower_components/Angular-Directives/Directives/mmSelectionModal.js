//<selection-modal selecteditem="currentItem.SupplierID" itemssource="suppliers" columns="['CompanyName','ContactTitle','ContactName']" valuefield="'SupplierID'" textfield="'CompanyName'"></selection-modal>
(function () {
    //---Required Bootstrap 3---//
    angular.module('directives').directive("mmSelectionModal", ["$http", "$compile", function ($http, $compile) {
        return {
            restrict: "E",
            transclude: true,
            template: "<div class='modalcontainer'>" +
              "<input class='btn btn-default' type='button' value='...'  ng-click='buttonclicked()'/>"+
                "<div class='modal fade' id='myModal' tabindex='-1' role='dialog' aria-labelledby='myModalLabel' aria-hidden='true'>" +
    "<div class='modal-dialog modal-lg' style='max-height:100%' ><div class='modal-content'><div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</button>" +
                    "<h4 class='modal-title' id='myModalLabel'>{{title}}</h4></div><div class='modal-body'> <div class='filterhtml'></div> <div class='tablehtml'></div></div>" +
                "</div>",
            require: 'ngModel',
            scope: {
                itemssource: "=",
                itemTemplate: "=",
                columns: "=",
                valuefield: "@",
                textfield: "@",
                selecteditem: "=ngModel",
                message: "=",
                title:"@",
            },
            link: function (scope, element, attrs, ctrl, transclude) {
                var items = scope.itemssource;
                var q = scope.message;
                var filterhtml = $(".filter-template", element).html();
                if (!scope.filter) {scope.filter = {};}
                scope.$watch("filter.Name", function (newvalue) {
                    var data = newvalue;
                });
                transclude(scope, function(clone) {
                    angular.forEach(clone, function(elem) {
                        if (angular.element(elem).hasClass('filter-template')) {
                            filterhtml = "<div >" + elem.innerHTML + "</div>"
                        }
                    });
                });
                var tablehtml = function () {
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
                    scope.linkclicked = function (item) {
                        if (item[scope.valuefield] != null) {scope.selecteditem = item[scope.valuefield]}
                        if (item[scope.textfield] != null) {var text = item[scope.textfield]}
                        $('.modal', element).modal('hide');
                    };
                    var rowtext = "";
                    var hash = window.location.hash
                    var tablehead = "";
                    for (var i = 0; i < scope.columns.length; i++) {
                        prop = scope.columns[i];
                        if (scope.sort == "") {scope.sort = prop;}
                        title = prop.replace("_", " ").split(/(?=[A-Z])/).join(" ");
                        rowtext += '<td><a href="" ng-click="linkclicked(item)"> <span style="font-size:14px" data-ng-bind="item.' + prop + '"></span></a> </td>';
                        tablehead += "<th><a ng-click='sortit(\"" + prop + "\")' >  <h4>" + title + "<h4/> <span ng-show='sort == \"" + prop + "\"' > <span ng-show='descending'> <i class='fa fa-caret-square-o-down'></i>  </span>  <span ng-hide='descending'> <i class='fa fa-caret-square-o-up'></i> </span>  </span>  </a> </th>"
                    }
                    var headertext = "<thead> <tr> " + tablehead + "</tr> </thead>"
                    var start = "<table class='table'>" + headertext + " <tbody> <tr data-ng-repeat='item in itemssource |orderBy:sort:descending |  filter:filter '>";
                    var full = start + rowtext + '  </tr> </tbody> </table>';
                    return full;
                }
                var modalFooter=""
                var filtercontainer = angular.element(element[0].getElementsByClassName("filterhtml")[0]);
                filtercontainer.append(filterhtml);
                var tablecontainer = angular.element(element[0].getElementsByClassName("tablehtml")[0]);
                tablecontainer.append(tablehtml());
                $compile(tablecontainer)(scope);
                $compile(filtercontainer)(scope);

                scope.buttonclicked = function () {$('.modal', element).modal('show');};
            },

            controller: function ($scope, $element, $attrs)
            {

            },
        };
    }]);
})();