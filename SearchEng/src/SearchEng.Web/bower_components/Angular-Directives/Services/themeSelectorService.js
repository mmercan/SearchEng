(function () {
    angular.module('component').factory('themeSelectorService', function () {
        var change = function (themename) {
            if (themename == "theme-adminflare" || value == "theme-asphalt" || value == "theme-clean" || value == "theme-default" || value == "theme-dust"
                || value == "theme-fresh" || value == "theme-frost" || value == "theme-purple-hills" || value == "theme-silver" || value == "theme-white") {
                var body = angular.element(document).find('body');
                $(body).removeClass("theme-adminflare theme-asphalt theme-clean theme-default theme-dust theme-fresh theme-frost theme-purple-hills theme-silver theme-white");
                $(body).addClass(themename);
            }
        };
       

        return {
            adminflare: change("theme-adminflare"),
            asphalt: change("theme-asphalt"),
            clean: change("theme-clean"),
            default: change("theme-default"),
            dust: change("theme-dust"),
            fresh: change("theme-fresh"),
            frost: change("theme-frost"),
            purplehills: change("theme-purple-hills"),
            silver: change("theme-silver"),
            white: change("theme-white"),
        };

    });
})();