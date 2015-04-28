angular.module('directives').directive("mmScroll", [
    "$http", "$compile", function($http, $compile) {
        return {
            restrict: 'CA',
            link: function (scope, element, attrs, ctrl, transclude) {
                var height = 300;


                attrs.$observe('mmScroll', function (value) {
                    if (value) {
                        height = value;
                        $(element).css("height", function (index) {
                            return height;
                        });
                    }
                });


                attrs.$observe('height', function (value) {
                    if (value) {
                        height = value;
                        $(element).css("height", function(index) {
                            return height;
                        });}});

                $(element).css("height", function (index) {
                    return height;
                });
                $(element).css("overflow-y", "scroll");

                // overflow-y: scroll; /* has to be scroll, not auto */
                $(element).css(" -webkit-overflow-scrolling", "touch");
               
                // style = "overflow-y: scroll; height:400px;"
                //$(element).slimScroll({ height: 300, alwaysVisible: true, color: '#888', allowPageScroll: true });
            }
        }
    }
]);