angular.module('directives')
    .directive("tooltip", [
        "$http", "$compile", function ($http, $compile) {
            return {
                restrict: 'AC',
                link: function (scope, element, attrs, ctrl, transclude) {
                    if ($(element).tooltip) {
                        $(element).tooltip();
                    }
        },
    }
}
]);