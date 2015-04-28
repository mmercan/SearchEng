/*
 * Properties : itemssource: Array
 */
(function () {
    angular.module("directives").directive("mmTimelineCol", ["$compile", function ($compile) {
        return {
            restrict: 'E',
            replace: true,
            template: '<ul class="timeline-2col"></ul>',
            transclude: true,
            link: function (scope, element, attrs, ctrl, transclude) {
                var itemssourcePropertyName = null
                var create = function () {
                    var template = "";
                    transclude(scope, function (clone) {
                        template = "";
                        angular.forEach(clone, function (elem) { if (elem.outerHTML) { template += elem.outerHTML; } });
                    });
                    if (template) {
                        var templatefull = '<li class="mytemplate" ng-class-even="\'timeline-inverted\'" ng-repeat="item in ' + itemssourcePropertyName + '">' +
                            '<div class="timeline-badge primary"><i ng-class-even="\'glyphicon glyphicon-record invert\'" ng-class-odd="\'glyphicon glyphicon-record\'"></i></div>' +
                            '<div>' + template + '</div> </li>   <li class="clearfix" style="float: none;"></li>';
                        element.append($compile(templatefull)(scope))
                    }
                }
                attrs.$observe('itemssource', function (value) {
                    itemssourcePropertyName = value;
                    create();
                });
            },
            controller: ["$scope", "$element", "$attrs", function ($scope, $element, $attrs) {}],
        }
    }]);

    angular.module("directives").directive("mmTimeline", ["$compile", function ($compile) {
        return {
            restrict: 'E',
            replace: true,
            template: '<ul class="timeline-v2"></ul>',
            transclude: true,
            link: function (scope, element, attrs, ctrl, transclude) {
                var itemssourcePropertyName = null
                var create = function () {
                    var template = "";
                    transclude(scope, function (clone) {
                        template = "";
                        angular.forEach(clone, function(elem) {if (elem.outerHTML) {template += elem.outerHTML;}});
                    });
                    if (template) {
                        var templatefull = '<li ng-repeat="item in ' + itemssourcePropertyName + '"> <i class="cbp_tmicon rounded-x hidden-xs"></i> <div>' + template + '</div></li>';
                        element.append($compile(templatefull)(scope))
                    }
                }
                attrs.$observe('itemssource', function (value) {
                    itemssourcePropertyName = value;
                    create();
                });
            },
            controller: ["$scope", "$element", "$attrs", function ($scope, $element, $attrs) {}],
        }
    }]);
})();