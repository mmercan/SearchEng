angular.module("app").controller('SearchCtrl', ['$scope', '$http',  function ($scope, $http) {
 
    $scope.loading = false;
    $scope.noResult = false;
    $scope.keyword = "";
    $scope.results = [];

    $scope.suggestionsLoading = false;
    $scope.suggestions = [];
    $scope.nosuggestion = false;

    $scope.ProductsResultsTotal = "";

    $scope.products = [];
    $scope.books = [];
    $scope.people = [];
  
    $scope.showSuggestion = false;

    $scope.$watch('keyword', function (newVal, oldVal) {
        console.log(newVal, oldVal);
        suggestionCall($scope.searchType);
    });


    function suggestionCall(searchType) {
        if ($scope.keyword.length > 1) {
            $scope.showSuggestion = true;
            if (searchType == "Product") {
                var address = '/ProductSearch/Suggestions/' + $scope.keyword;
            }
            if (searchType == "Books") {
                var address = '/BookSearch/Suggestions/' + $scope.keyword;
            }
            if (searchType == "Movies") {
                var address = '/MovieSearch/Suggestions/' + $scope.keyword;
            }
            if (searchType == "People") {
                var address = '/PeopleSearch/Suggestions/' + $scope.keyword;
            }
            $scope.suggestionsLoading = true;
            $scope.nosuggestion = false;
            $http.get(address).success(
                function (result) {
                    $scope.showSuggestion = true;
                    $scope.suggestions = result;
                    $scope.suggestionsLoading = false;
                    if (result.length == 0) {
                        $scope.nosuggestion = true;
                    } else {
                        $scope.nosuggestion = false;
                    }
                });
        } else {
            $scope.suggestions = [];
        }
    }
   
    $scope.searchCall = function () {
        if ($scope.keyword.length > 1) {
            if ($scope.searchType == "Product") {
                var address = '/ProductSearch/search/' + $scope.keyword;

                $http.get(address).success(
                    function (result) {
                        $scope.products = result;
                        $scope.loading = false;
                        //if (result.length == 0) {
                        //    $scope.noResult = true;
                        //} else {
                        //    $scope.noResult = false;
                        //}
                    });

            }
            if ($scope.searchType == "Books") {
                var address = '/BookSearch/search/' + $scope.keyword;

                $http.get(address).success(function (result) {
                    $scope.books = result;
                    $scope.loading = false;
                    //if (result.length == 0) {
                    //    $scope.noResult = true;
                    //} else {
                    //    $scope.noResult = false;
                    //}
                });
            }
            if ($scope.searchType == "Movies") {
                var address = '/MovieSearch/search/' + $scope.keyword;
            }
            if ($scope.searchType == "People") {
                var address = '/PeopleSearch/search/' + $scope.keyword;

                $http.get(address).success(function (result) {
                    $scope.people = result;
                    $scope.loading = false;
                    //if (result.length == 0) {
                    //    $scope.noResult = true;
                    //} else {
                    //    $scope.noResult = false;
                    //}
                });
            }

            $scope.showSuggestion = false;
            $scope.loading = true;
            $scope.noResult = false;


        } else {
            $scope.results = [];
        }
    };
    $scope.searchType = "Product";
    $scope.tabclicked = function (tabname) {
        if (tabname != $scope.searchType) {
            suggestionCall(tabname);
           
        }
        $scope.searchType = tabname;
    };


    $scope.itemSelected =function(item){
        $scope.keyword = item;
        $scope.searchCall();
        $scope.showSuggestion = false;

    }
    $scope.inputClicked = function () {
        $scope.showSuggestion = true;
    }

    //Move it into a Directive
    $("body").click(function () {
        $scope.$apply(function () {
            $scope.showSuggestion = false;
        });
    });
    $("#searchsuggest").click(function (e) {
        e.stopPropagation();
    });
    $("form").click(function (e) {
        e.stopPropagation();
    });
   
    
}]);