
/*
 * @class Limiter
 */
angular.module('directives').directive('maxlength', [function () {
    return {
        //require: 'ngModel',
        //  replace: true,
    //transclude: true,
    //template: '<div class="input-group"><div ng-transclude></div></div>',
        link: function (scope, element, attrs, ngModelCtrl) {
           
    var wrapper = angular.element('<div class="input-group"><span class="input-group-addon"></span></div>');

        element.after(wrapper);
        wrapper.prepend(element);




var span = wrapper.find('span.input-group-addon');

        scope.$on("$destroy", function() {
          wrapper.after(element);
          wrapper.remove();
        });

            var $element = $(element);
            var isTextarea = $element.is('textarea');
            var limit = null;
            var mmCounterPropertyName = null;
            attrs.$observe('mmCounter', function(value) {
                mmCounterPropertyName = value;
                scope.$watch(value, function(newVal, oldVal) {
                })
            });

            attrs.$observe('maxlength', function (value) {
                scope.$watch(value, function (newvalue) {
                    if (newvalue) {
                        limit = newvalue;
                        limiter(newvalue);
                        if (scope && mmCounterPropertyName) {
                            scope[mmCounterPropertyName] = limit;
                        }
                         if(span && span.text) {
                            span.text( limit);
                        }
                    }
                });
            });
            var ison=true;
                attrs.$observe('ngModel', function (value) {
                scope.$watch(value, function (newvalue) {
                    if (newvalue) {



                        var chars_count, input_value;
                input_value = isTextarea ? $element[0].value.replace(/\r?\n/g, "\n") : $element.val();
                chars_count = input_value.length;
                if (chars_count > limit) {
                    $element.val(input_value.substr(0, limit));
                    chars_count = limit;
                }
                 console.log(limit - chars_count);
                if (scope && mmCounterPropertyName && scope[mmCounterPropertyName]!=null) {
                    scope[mmCounterPropertyName] = limit - chars_count;
                }
                if(span && span.text){
                    span.text( limit - chars_count);
                }


                       if(ison && (!isTextarea)){
                        $element.off("keyup focus", $.proxy(updateCounter, this));
                        ison=false;
                        }
                    }
                });
            });
            var updateCounter = function () {
                var chars_count, input_value;
                input_value = isTextarea ? $element[0].value.replace(/\r?\n/g, "\n") : $element.val();
                chars_count = input_value.length;
                if (chars_count > limit) {
                    $element.val(input_value.substr(0, limit));
                    chars_count = limit;
                }
                 console.log(limit - chars_count);
                if (scope && mmCounterPropertyName && scope[mmCounterPropertyName]!=null) {
                    scope.$apply(function() {
                        scope[mmCounterPropertyName] = limit - chars_count;
                    });
                }
                if(span && span.text){
                    span.text( limit - chars_count);
                }
            };

            var limiter = function (limit, options) {
                if (options == null) {
                    options = {};
                }
               
                $element.on("keyup focus", $.proxy(updateCounter, this));
            };

        }
    }
}]);
