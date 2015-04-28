angular.module('directives').directive('themeSelector', function () {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs, ngModelCtrl) {
            var selectedtheme = null;

            attrs.$observe('themeSelector', function (value) {
              
                if (value == "theme-adminflare" || value == "theme-asphalt" || value == "theme-clean" || value == "theme-default" || value == "theme-dust"
                    || value == "theme-fresh" || value == "theme-frost" || value == "theme-purple-hills" || value == "theme-silver" || value == "theme-white") {
                    selectedtheme = value;

                }

               


            });

            var $elem = $(elem);
            $elem.bind("click", function () {
                if (selectedtheme) {
                    var body = angular.element(document).find('body');
                    $(body).removeClass("theme-adminflare theme-asphalt theme-clean theme-default theme-dust theme-fresh theme-frost theme-purple-hills theme-silver theme-white");
                    $(body).addClass(selectedtheme);
                }
            });
        }
    };
});