angular.module("app").controller("rottentomatoesCtrl", [
    "$scope", "rottentService", "$http", function ($scope, rottentService, $http) {
        $scope.moviesBoxOfficeCall = function() {
            $scope.moviesBoxOffice = [];
            rottentService.moviesBoxOfficeCall().then(function (data) {
                $scope.moviesBoxOffice = data.movies;
            });
        }
        $scope.moviesInTheatersCall= function() {
            $scope.moviesInTheaters = [];
            rottentService.moviesInTheatersCall().then(function (data) {
                $scope.moviesInTheaters = data.movies;
            });
        }

        $scope.moviesOpeningCall = function () {
            $scope.moviesOpening = [];
            rottentService.moviesOpeningCall().then(function (data) {
                $scope.moviesOpening = data.movies;
            });
        }

        $scope.moviesUpcomingCall = function () {
            rottentService.moviesUpcomingCall().then(function (data) {
                $scope.moviesUpcoming = data.movies;
            });
        }
        $scope.dvdsTopRentalsCall = function () {
            rottentService.dvdsTopRentalsCall().then(function (data) {
                $scope.dvdsTopRentals = data.movies;
            });
        }

        $scope.dvdsCurrentReleasesCall = function () {
            rottentService.dvdsCurrentReleasesCall().then(function (data) {
                $scope.dvdsCurrentReleases = data.movies;
            });
        }
        $scope.dvdsNewReleasesCall = function () {
            rottentService.dvdsNewReleasesCall().then(function (data) {
                $scope.dvdsNewReleases = data.movies;
            });
        }
        $scope.dvdsUpcomingCall = function () {
            rottentService.dvdsUpcomingCall().then(function (data) {
                $scope.dvdsUpcoming = data.movies;
            });
        }
        $scope.searchTerm = "";
        $scope.searchCall = function () {
            rottentService.searchCall($scope.searchTerm).then(function (data) {
                $scope.searchMovieResults = data.movies;
                $scope.searchMovieResultsTotal = data.total;
            });

            $http.get("/goodreads/Search?term=" + $scope.searchTerm).success(function (data) {
                $scope.searchBookResults = data.search.results.work;
                $scope.searchBookResultsTotal = data.search['total-results'];
            });
        }

        $scope.gotoBookdetail=function(bookid) {
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
      //  $("#bcTarget").barcode("1234567890128", "ean13");
      
        $scope.gotoBookdetail("11870085");
       
        $scope.moviesBoxOfficeCall();
        $scope.moviesInTheatersCall();
        $scope.moviesOpeningCall();
        $scope.moviesUpcomingCall();

        $scope.dvdsTopRentalsCall();
        $scope.dvdsCurrentReleasesCall();
        $scope.dvdsNewReleasesCall();
        $scope.dvdsUpcomingCall();

        //$scope.searchCall();
    }

]);