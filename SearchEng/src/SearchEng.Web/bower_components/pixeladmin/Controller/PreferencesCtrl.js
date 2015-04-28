angular.module("app").controller("PreferencesCtrl", ["$scope", "dataContext", "storage", function ($scope, dataContext, storage) {
    
  

    $scope.pro = {};
    $scope.pro.availableColumns = ["ProductNumber", "Name", "ProductModelName", "SubcategoryName", "ListPrice", "MakeFlag", "ProductLine", "ProductSubcategoryID", "Color", ];
    $scope.pro.sortList = ['Name', 'ProductNumber', 'ListPrice', 'ProductLine', 'Color']
    $scope.ProductStorage = new storage("ProductsView");
    $scope.ProductStorage.getitems();


    if (!$scope.ProductStorage.result.listcolumns) { $scope.ProductStorage.result.listcolumns = ["ProductNumber", "Name"]; }
    $scope.pro.showedAvailableColumns = $scope.pro.availableColumns.diff($scope.ProductStorage.result.listcolumns)


    $scope.$watch("ProductStorage.result.listcolumns", function (newdata, olddata) {
        if (newdata != olddata) {
            $scope.pro.showedAvailableColumns = $scope.pro.availableColumns.diff($scope.ProductStorage.result.listcolumns)
        }
    });
    //$scope.productResetFilter = function () {
     //    resetFilter()
     //};
     //$scope.productAddColumn = function (column) {
     //    Addcolumns("ProductsStorage", $scope.products, column);
     //};
     //$scope.productRemovecolumns = function (column) {
     //    Removecolumns("ProductsStorage", $scope.products, column)
     //}

     //$scope.savecolumns = function () {
     //    setItem("ProductsStorage", $scope.products)
     //}


}]);


Array.prototype.diff = function (a) {
    return this.filter(function (i) {
        return a.indexOf(i) < 0;
    });
};