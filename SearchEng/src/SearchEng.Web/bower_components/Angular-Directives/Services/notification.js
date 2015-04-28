(function () {
    angular.module('component').constant('notificationDefaults', {
        "closeButton": false,
        "debug": false,
        "positionClass": "toast-top-right",
        "onclick": null,
        "showDuration": "3000",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }).factory('notificationService', ["notificationDefaults", function (notificationDefaults) {
        var success = function (title,message,options) {
            if (!title) { title = "Success"; }
            if (!message) { message = ""; }
            toastr.success("<h3 style='margin-top:0'>" + title + "</h3>" + message)
            options = $.extend({}, notificationDefaults, options || {});
            toastr.options = options;
        };
        var info = function (title, message, options) {
            if (!title) { title = "Info"; }
            if (!message) { message = ""; }
            toastr.info("<h3 style='margin-top:0'>" + title + "</h3>" + message)
            options = $.extend({}, notificationDefaults, options || {});
            toastr.options = options;
        };
        var warning = function (title,message,options) {
            if (!title) { title = "Warning"; }
            if (!message) { message = ""; }
            toastr.warning("<h3 style='margin-top:0'>" + title + "</h3>" + message)
            options = $.extend({}, notificationDefaults, options || {});
            toastr.options = options;
        };
        var error = function (title, message, options) {
            if (!title) { title = "Error"; }
            if (!message) { message = ""; }
            toastr.error("<h3 style='margin-top:0'>" + title + "</h3>" + message)
            options = $.extend({}, notificationDefaults, options || {});
            toastr.options = options;
        };

        return {
            success: success,
            info: info,
            warning: warning,
            error: error,
        }
    }])
})();