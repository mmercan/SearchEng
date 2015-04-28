angular.module('directives').value("htmlconfig", {}).directive("mmHtml", ['$compile', function ($scompile) {
    return{
        restrict: 'ACM',
      
        link: function(scope, elem, attrs, ngModelCtrl) {
            var $elem = $(elem);
            attrs.$observe('mmHtml', function (value) {
                scope.$watch(value, function (newValue) {
                    if (newValue) {
                        $elem.empty();
                        $elem.append(newValue);
                    }
                });
            });

        }
    }
    }
]);