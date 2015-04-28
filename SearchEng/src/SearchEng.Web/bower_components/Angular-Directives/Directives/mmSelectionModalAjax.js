//<selection-modal selecteditem="currentItem.SupplierID" itemssource="suppliers" columns="['CompanyName','ContactTitle','ContactName']" valuefield="'SupplierID'" textfield="'CompanyName'"></selection-modal>
(function () {
    //---Required Bootstrap 3---//
    angular.module('directives').directive("mmSelectionModalAjax", ["$http", "$compile", function ($http, $compile) {
        return {
            restrict: "E",
            scope: {
                itemTemplate: "=",
                columns: "=",
                valuefield: "=",
                textfield: "=",
                //filter: "=",
                selecteditem: "=",
                selectedText:"=",
                selectedId:"=",
                message: "=",
                url:"@",
            },
            link: function (scope, element, attrs) {

                var items = scope.itemssource;
                var q = scope.message;
                element.append('<div class="modalcontainer"></div>');
                var filterhtml = $(".filter-template", element).html();
                var modalcontainer = angular.element(element[0].getElementsByClassName("modalcontainer")[0]);
              

                var tablehtml = function () {
                    var rowtext = "";
                    var hash = window.location.hash
                    for (var i = 0; i < scope.columns; i++) {
                        prop = scope.columns[i];
                        if (scope.sort == "") {
                            scope.sort = prop;
                        }
                        scope.fieldnames.push({ 'fieldname': prop, 'title': prop.replace("_", " ").split(/(?=[A-Z])/).join(" ") });
                        rowtext += '<td><a href="" ng-click="linkclicked(item)"> <span style="font-size:14px" data-ng-bind="item.' + prop + '"></span></a> </td>';
                    }
                    var headertext = "<thead> <tr> <th ng-repeat='item in fieldnames'><a ng-click='sortit(item.fieldname)' > {{item.title}} <span ng-show='sort == item.fieldname' > <span ng-show='descending'> <i class='fa fa-caret-square-o-down'></i>  </span>  <span ng-hide='descending'> <i class='fa fa-caret-square-o-up'></i> </span>  </span>  </a> </th> </tr> </thead>";
                    var start = "<table class='table'>" + headertext + " <tbody> <tr data-ng-repeat='item in itemssource |orderBy:sort:descending |  filter:filter '>";
                   
                    var full = start + rowtext + '  </tr> </tbody> </table>';
                    return full;
                }
                //var select = "<select class='form-control' ng-model='selecteditem." + scope.valuefield + "' data-ng-options='c.Category_ID as c.Category_Name  for c in Categories'></select>";
                var triggerbutton = "<input class='btn btn-default' type='button' value='...'  ng-click='buttonclicked()'/>";
                var modalheader = "<div class='modal fade' id='myModal' tabindex='-1' role='dialog' aria-labelledby='myModalLabel' aria-hidden='true'>" +
                "<div class='modal-dialog' style='max-height:100%' ><div class='modal-content'><div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</button>" +
                "<h4 class='modal-title' id='myModalLabel'>Modal title</h4></div><div class='modal-body'>";
                modalheader += '<div ng-show="dataloading" class="progress progress-striped active"><div class="progress-bar"  role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" style="width: 100%"></div></div>';
                var modelFilterPanel = "<div class='row'>" + filterhtml + "</div> <div class='row'><input ng-click='searchclicked()' value='Search' class='btn btn-default' type='button' /></div>"
                var modalBody = "<div ng-bind-html-unsafe='template'> " + tablehtml() + "</div></div>";
                //var modalFooter = "<div class='modal-footer'><button type='button' class='btn btn-default' data-dismiss='modal'>Close</button><button type='button' class='btn btn-primary'>Save changes</button></div></div></div></div>";
                var modalFooter=""

                var fullmodal = triggerbutton + modalheader + modelFilterPanel + modalBody + modalFooter;
                modalcontainer.append(fullmodal);
                $compile(modalcontainer)(scope);


             
            },
            controller: ["$scope", "$element", "$attrs", function ($scope, $element, $attrs) {
               
                
                $scope.searchclicked = function () {
                    if ($scope.url && $scope.filter) {
                        $scope.dataloading = true;
                        $http.post($scope.url, $scope.filter)
                            .success(function (result) {
                                $scope.itemssource = result;
                                $scope.dataloading = false;
                            })
                            .error(function (data) {
                                $scope.dataloading = false;
                            })
                    }
                };
                $scope.sort = "";
                $scope.descending = false;
                $scope.fieldnames = [];
                $scope.sortit = function (item) {
                    if ($scope.sort == item) {
                        $scope.descending = !$scope.descending;
                    } else {
                        $scope.descending = false;
                        $scope.sort = item;
                    }
                };

                $scope.linkclicked = function (item) {
                    if (item[$scope.valuefield] != null) {
                        $scope.selecteditem = item[$scope.valuefield]
                    }
                    if (item[$scope.textfield] != null) {
                        var text = item[$scope.textfield]
                        if ($scope.selectedText) {
                            $scope.selectedText = item[$scope.textfield]
                        }
                    }
                    $('.modal', $element).modal('hide');
                };

                $scope.buttonclicked = function () {
                    $('.modal', $element).modal('show');
                };
            }]
        };
    }]);
})();