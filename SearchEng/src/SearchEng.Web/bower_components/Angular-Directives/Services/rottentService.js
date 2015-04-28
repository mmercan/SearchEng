angular.module("data").factory('rottentService',[
    "$http", "$q", "$rootScope", function ($http, $q, $rootScope) {

        var getcontent= function(address) {
            var deferred = $q.defer();
            $.ajax({
                type: 'GET',
                dataType: "jsonp",
                url: address,
                success: function (responseData, textStatus, jqXHR) {
                    moviesBoxOffice = responseData;
                    //.movies
                    $rootScope.$apply(function () {
                        moviesBoxOffice = responseData;
                    });
                    deferred.resolve(responseData);
                },
                error: function (responseData, textStatus, errorThrown) {
                    deferred.reject(new Error(errorThrown));
                    console.log("something went wrong!! Error: " + textStatus);
                }
            });
            return deferred.promise;
        }

        var moviesBoxOffice = {};
        var moviesBoxOfficeCall = function() {
            var address = "http://api.rottentomatoes.com/api/public/v1.0/lists/movies/box_office.json?apikey=75svr8r6hpjhsfu63pk8erkf";
            return getcontent(address);
        }
        var moviesInTheatersCall = function () {
            var address = "http://api.rottentomatoes.com/api/public/v1.0/lists/movies/in_theaters.json?apikey=75svr8r6hpjhsfu63pk8erkf";
            return getcontent(address);
        }
        var moviesOpeningCall = function () {
            var address = "http://api.rottentomatoes.com/api/public/v1.0/lists/movies/opening.json?apikey=75svr8r6hpjhsfu63pk8erkf";
            return getcontent(address);
        }
        var moviesUpcomingCall = function () {
            var address = "http://api.rottentomatoes.com/api/public/v1.0/lists/movies/upcoming.json?apikey=75svr8r6hpjhsfu63pk8erkf";
            return getcontent(address);
        }


        var dvdsTopRentalsCall = function () {
            var address = "http://api.rottentomatoes.com/api/public/v1.0/lists/dvds/top_rentals.json?apikey=75svr8r6hpjhsfu63pk8erkf";
            return getcontent(address);
        }

        var dvdsCurrentReleasesCall = function () {
            var address = "http://api.rottentomatoes.com/api/public/v1.0/lists/dvds/current_releases.json?apikey=75svr8r6hpjhsfu63pk8erkf";
            return getcontent(address);
        }
        var dvdsNewReleasesCall = function () {
            var address = "http://api.rottentomatoes.com/api/public/v1.0/lists/dvds/new_releases.json?apikey=75svr8r6hpjhsfu63pk8erkf";
            return getcontent(address);
        }
        var dvdsUpcomingCall = function () {
            var address = "http://api.rottentomatoes.com/api/public/v1.0/lists/dvds/upcoming.json?apikey=75svr8r6hpjhsfu63pk8erkf";
            return getcontent(address);
        }

    var searchCall = function (term,resultsperpage,pagenumber) {
            if (!resultsperpage) { resultsperpage = 50; }
            if (!pagenumber) { pagenumber = 1; }
            var address = "http://api.rottentomatoes.com/api/public/v1.0/movies.json?apikey=75svr8r6hpjhsfu63pk8erkf&q=" + term + "&page_limit=" + resultsperpage + "&page=" + pagenumber;
            return getcontent(address);
        }


        return{
            moviesBoxOffice: moviesBoxOffice,
            moviesBoxOfficeCall:moviesBoxOfficeCall,
            moviesInTheatersCall: moviesInTheatersCall,
            moviesOpeningCall: moviesOpeningCall,
            moviesUpcomingCall: moviesUpcomingCall,

            dvdsTopRentalsCall: dvdsTopRentalsCall,
            dvdsCurrentReleasesCall: dvdsCurrentReleasesCall,
            dvdsNewReleasesCall: dvdsNewReleasesCall,
            dvdsUpcomingCall: dvdsUpcomingCall,
            searchCall: searchCall,
        }
  }]);