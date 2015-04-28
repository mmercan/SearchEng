(function () {
    angular.module('component').filter('noparents', function () {
    return function (input) {

        var result = _.filter(input, function (item) {
            if (item && !item.ParentID ) {
                return true;
            }
        });
        return result;
        //return input ;
    }
});


angular.module('component').filter('children', function () {
    return function (input, array) {

        var result = _.filter(array, function (item) {
            if (item.ParentID  == input.ID) {
                return true;
            }
        });
        return result;
        //return input ;
    }
});
})();