angular.module("directives")
    .value('mmRatingConfig', {
    stars_count: 5,
    rating: 0,
    class_active: 'active',
    lower_limit: 0.35,
    onRatingChange: function (value) { }
    })
    .directive('mmRating', ['mmRatingConfig', '$timeout', "$compile", function (mmRatingConfig, $timeout, $compile) {
    return {
            restrict: 'ACM',
            require: 'ngModel',
            template:'<ul class="widget-rating"></ul>',
            link: function(scope, elem, attrs, ngModelCtrl) {
                var $elem = $(elem);
                var isDisabled = false;
                var container = elem.find("ul.widget-rating");
                var  _i, _ref;
                if (options == null) {
                   var options = {};
                }
                var options = angular.extend({}, mmRatingConfig, options);
                for (i = _i = 0, _ref = options.stars_count; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                    container.append($compile('<li><a class="pointer" title="" class="widget-rating-item"></a></li>')(scope));
                }
                var setRating = function(value) {
                    options.rating = value;
                    if ((value - Math.floor(value)) > options.lower_limit) { value = Math.ceil(value); }else {value = Math.floor(value);}
                    ngModelCtrl.$setViewValue(value);
                    return container.find('li').removeClass(options.class_active).slice(0, value).addClass(options.class_active);
                };
               
                    $elem.find('a')
                        .on('mouseenter', function() {
                            if (!isDisabled) {
                                $elem.find('li').removeClass(options.class_active);
                                return $(this).parents('li').addClass(options.class_active).prevAll('li').addClass(options.class_active);
                            }
                        })
                        .on('mouseleave', function() {
                            if (!isDisabled) {
                                return setRating(options.rating);
                            }
                        })
                        .on('click', function() {
                        if (!isDisabled) {
                            var currentRating = $(this).parents('li').prevAll('li').length + 1;
                            options.onRatingChange.call(this, currentRating);
                            ngModelCtrl.$setViewValue(currentRating);
                            scope.$apply();
                            return false;
                        }
                    });
               
                setRating(options.rating);
                
                attrs.$observe('ngModel', function (value) { scope.$watch(value, function (newValue) { if (newValue) { setRating(newValue); } }); });
                attrs.$observe('disabled', function (value) {
                    scope.$watch(value,
                        function(newValue) {
                            if (newValue) {
                                isDisabled = true;
                                container.find('li a').removeClass("pointer").addClass("disabled");
                            }
                        });
                });
            }
        }
    }
]);
