//progressBar.show("Data Loading");
(function () {
    //---Required NProgress---//
    angular.module('component').factory('progressBar', function () {
        var show = function (message) {
            if (NProgress && NProgress.start) {
                NProgress.start();
            }
        };
        var hide = function (message) {
            if (NProgress && NProgress.start) {
                NProgress.done();
            }
        };

        var hideWithError = function (message) {
            if (NProgress && NProgress.start) {
                NProgress.done();
            }
        };

        return {
            show: show,
            hide: hide,
            hideWithError: hideWithError,
        };

    });
})();