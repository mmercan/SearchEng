angular.module("app").controller('bookCtrl', ['$scope', '$http', "$routeParams", function ($scope, $http, $routeParams) {

    $scope.gotoBookdetail = function (bookid) {
        $http.get("/goodreads/BookDetail/" + bookid).success(function (data) {
            $scope.bookdetail = data.book;
            $('#uidemo-tabs-default-demo li:eq(3) a').tab('show');

            var authorid = $scope.bookdetail.authors.author.id;
            if (authorid) {
                $http.get("/goodreads/Author/" + authorid).success(function (authordata) {
                    $scope.authordetail = authordata.author;
                    $('#uidemo-tabs-default-demo li:eq(3) a').tab('show');
                });
            }

        });
    }


    if ($routeParams.id && $routeParams.id != "new") {
        $scope.gotoBookdetail($routeParams.id);
    }

  

}]);