angular.module('directives')
    .constant('mmMaskConfig', {}).directive("mmMask", [
        "$http", "$compile", "mmMaskConfig", function($http, $compile, mmMaskConfig) {
            return {
                restrict: 'ACM',
                require: 'ngModel',
                transclude: true,
                link: function (scope, element, attrs, ctrl, transclude) {
                    // $("#masked-inputs-examples-date").mask("99/99/9999");
                    var mask = attrs.mmMask;

                   // var res = scope.$eval(attrs.mmMask);
                   // alert(res);

                    $(element).mask(mask);
                }
            }
        }
    ]);