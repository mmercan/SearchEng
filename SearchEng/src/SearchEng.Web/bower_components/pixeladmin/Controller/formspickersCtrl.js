angular.module("app").controller("formspickersCtrl", ["$scope", function ($scope) {

    $scope.componentDate = "";
    $scope.RangeDate={
        startdate:"",
        endDate:"",
    }
    //var options = {
    //    todayBtn: "linked",
       
    //}

    //$('#bs-datepicker-example').datepicker(options);

    //$('#bs-datepicker-component').datepicker();


    
    //$('#bs-datepicker-range').datepicker();

    //$('#bs-datepicker-inline').datepicker();


    $scope.changetotoday = function () {
        $scope.componentDate = new Date();
    }
}])