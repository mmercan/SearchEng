(function () {
    angular.module('component').filter('momentfromnow', function () {
    return function (input) {

       var result = moment(input).fromNow();
       return result;
        //return input ;
    }});
})();