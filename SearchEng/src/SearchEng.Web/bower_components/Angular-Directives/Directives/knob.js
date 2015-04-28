angular.module('directives').directive('knob', function () {
    return {
        restrict: 'ACM',
        require: 'ngModel',
        link: function (scope, elem, attrs, ngModelCtrl) {

         var  $elem = $(elem);
         $elem.knob();
         $elem.knob();
         $elem.trigger('configure', {
             'change': function (v) {
                 ngModelCtrl.$setViewValue(v);
                 scope.$apply();
             }
         });

         attrs.$observe('ngModel', function (value) {
             scope.$watch(value, function (newValue) {
                 if (newValue) {
                     $elem.val(ngModelCtrl.$viewValue).trigger('change');
                 }
             });
         });
        }
    };
});