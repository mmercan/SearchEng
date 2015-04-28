angular.module("directives").directive("popover", [function () {
    return {
        link: function (scope, element) {
            $(element).popover(
                { trigger: 'focus' }
                );
        }
    }
}])