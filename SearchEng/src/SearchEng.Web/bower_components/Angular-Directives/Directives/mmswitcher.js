angular.module('directives')
    .constant('mmSwitcherConfig', {
        theme: null,
        on_state_content: 'ON',
        off_state_content: 'OFF'
    })
    .directive("mmSwitcher", [
        "$http", "$compile", "mmSwitcherConfig", function ($http, $compile, mmSwitcherConfig) {
            return {
                restrict: 'ACM',
                require: 'ngModel',
                transclude: true,
                link: function (scope, element, attrs, ctrl, transclude) {
                    var $el = $(element);
                    var box_class;
                    if (attrs.options == null) {
                        attrs.options = {};
                    } else {
                        attrs.options = scope.$eval(attrs.options) ? scope.$eval(attrs.options) : attrs.options;
                    }
                    if (attrs.theme) {
                        attrs.options.theme = attrs.theme ? attrs.theme : scope.$eval(attrs.theme);
                    }
                    var options = $.extend({}, mmSwitcherConfig, attrs.options);
                    var $checkbox = null;
                    var $box = null;
                    if ($el.is('input[type="checkbox"]')) {
                        box_class = $el.attr('data-class');
                        $checkbox = $el;
                        $box = $('<div class="switcher"><div class="switcher-toggler"></div><div class="switcher-inner"><div class="switcher-state-on">' + options.on_state_content + '</div><div class="switcher-state-off">' + options.off_state_content + '</div></div></div>');
                        if (options.theme) {
                            $box.addClass('switcher-theme-' + options.theme);
                        }
                        if (box_class) {
                            $box.addClass(box_class);
                        }
                        $box.insertAfter($checkbox).prepend($checkbox);
                    } else {
                        $box = $el;
                        $checkbox = $('input[type="checkbox"]', $box);
                    }
                    if ($checkbox.prop('disabled')) {
                        $box.addClass('disabled');
                    }
                    if ($checkbox.is(':checked')) {
                        $box.addClass('checked');
                    }
                    $checkbox.on('click', function (e) {
                        return e.stopPropagation();
                    });
                    $box.on('touchend click', (function (_this) {
                        return function (e) {
                            e.stopPropagation();
                            e.preventDefault();
                            return toggle(_this);
                        };
                    })(this));

                    var toggle = function (control) {
                        $checkbox.click();
                    };
                    var on = function () {
                        $checkbox[0].checked = true;
                        return $box.addClass('checked');
                    }
                    var off = function () {
                        $checkbox[0].checked = false;
                        return $box.removeClass('checked');
                    }

                    attrs.$observe('ngModel', function (value) {
                        scope.$watch(value, function (newValue) {
                            if (newValue) {
                                on();
                            } else {
                                off();
                            }
                        });
                    });
                }
            }
        }
    ]);