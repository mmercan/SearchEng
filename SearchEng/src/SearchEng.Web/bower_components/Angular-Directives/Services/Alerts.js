(function () {
    angular.module('component').constant('alertDefaults', {
        type: 'warning',
        close_btn: true,
        classes: false,
        namespace: 'pa_page_alerts',
        animate: true,
        auto_close: false
    }).factory('alertService', ["alertDefaults", function (alertDefaults) {
     var   alertsContainerId = 'pa-page-alerts-box';
        var  typesHash = {
            warning: '',
            danger: 'alert-danger',
            success: 'alert-success',
            info: 'alert-info'
        };
        /* Add new alert.         * @param  {String} html     * @param  {Object} options */
        var add = function (html, options, type, autoClose) {
            var $alert, $alerts, $box, height, paddingBottom, paddingTop;
            options = $.extend({}, alertDefaults, options || {});
            if (type != null) {options.type = type;}
            if (autoClose != null && jQuery.isNumeric && jQuery && jQuery.isNumeric(autoClose)) {
                options['auto_close'] = autoClose;
            }
            $alert = $('<div class="alert alert-page ' + options.namespace + ' ' + typesHash[options.type] + '" />').html(html);
            if (options.classes) { $alert.addClass(options.classes);            }
            if (options.close_btn) {
                $alert.prepend($('<button type="button" data-dismiss="alert" class="close" />').html('&times;'));
            }
            if (options.animate) {                $alert.attr('data-animate', 'true');            }
            $box = $('#' + alertsContainerId);
            if (!$box.length) {
                $box = $('<div id="' + alertsContainerId + '" />').prependTo($('#alert-wrapper'));
            }
            $alerts = $('#' + alertsContainerId + ' .' + options.namespace);
            height = $alert.css({
                visibility: 'hidden',
                position: 'absolute',
                width: '100%'
            }).appendTo('body').outerHeight();
            paddingTop = $alert.css('padding-top');
            paddingBottom = $alert.css('padding-bottom');
            if (options.animate) {
                $alert.attr('style', '').css({
                    overflow: 'hidden',
                    height: 0,
                    'padding-top': 0,
                    'padding-bottom': 0
                });
            }
            if ($alerts.length) {
                $alerts.last().after($alert);
            } else {
                $box.append($alert);
            }
            if (options.animate) {
                return $alert.animate({
                    'height': height,
                    'padding-top': paddingTop,
                    'padding-bottom': paddingBottom
                }, 500, (function () {
                    return function () {
                        $alert.attr('style', '');
                        if (options.auto_close) {
                            return $.data($alert, 'timer', setTimeout(function () {
                                return close($alert);
                            }, options.auto_close * 1000));
                        }
                    };
                })(this));
            } else {
                return $alert.attr('style', '');
            }
        };

        var addDark = function(html, options, type,autoClose) {
            options = $.extend({}, alertDefaults, options || {});
            options.namespace = 'pa_page_alerts_dark';
            options.classes = 'alert-dark'; // add custom classes
            add(html, options, type,autoClose);
        };
        

        var addMoveTop = function (html, options, type, autoClose) {
            $('html,body').animate({ scrollTop: 0 }, 500);
            setTimeout(function () {
                add(html, options, type, autoClose);

            }, 800);
        }
        var addMoveTopDark = function (html, options, type, autoClose) {
            $('html,body').animate({ scrollTop: 0 }, 500);
            setTimeout(function () {
                addDark(html, options, type, autoClose);
            }, 800);
        }

        /* Close alert. @param  {jQuery Object} $alert          */

       var close = function ($alert) {
            if ($alert.attr('data-animate') === 'true') {
                return $alert.animate({
                    'height': 0,
                    'padding-top': 0,
                    'padding-bottom': 0
                }, 500, function () {
                    if ($.data($alert, 'timer')) {
                        clearTimeout($.data($alert, 'timer'));
                    }
                    return $alert.remove();
                });
            } else {
                if ($.data($alert, 'timer')) {
                    clearTimeout($.data($alert, 'timer'));
                }
                return $alert.remove();
            }
        };

        /* Close all alerts with specified namespace.     * @param  {Boolean} animate    * @param  {String} namespace         */

       var clear = function (animate, namespace) {
            var $alerts, self;
            if (animate == null) {
                animate = true;
            }
            if (namespace == null) {
                namespace = 'pa_page_alerts';
            }
            $alerts = $('#' + alertsContainerId + ' .' + namespace);
            if ($alerts.length) {
                self = this;
                if (animate) {
                    return $alerts.each(function () {
                        return self.close($(this));
                    });
                } else {
                    return $alerts.remove();
                }
            }
       };


        /* Close all alerts.         * @param  {Boolean} animate        */

        var clearAll = function (animate) {
            var self;
            if (animate == null) {
                animate = true;
            }
            if (animate) {
                self = this;
                return $('#' + alertsContainerId + ' .alert').each(function () {
                    return self.close($(this));
                });
            } else {
                return $('#' + alertsContainerId).remove();
            }
        };


        var AddSoundElement= function() {
            $('body').append('<audio style="display: none;" id="notificationSound" preload src="/NotificationSounds/sounds-882-solemn.mp3"></audio>');
        }
        AddSoundElement();

        var MakeSound = function (sound) {
            var soundfile = "/NotificationSounds/tick.mp3";
            switch (sound) {
            case "bell":
                soundfile = "/NotificationSounds/bell.mp3";
                break;
            case "harp":
                soundfile = "/NotificationSounds/harp.mp3";
                break;
                case "error":
                    soundfile = "/NotificationSounds/error.mp3";
                    break;
                case "no":
                    soundfile = "/NotificationSounds/no.mp3";
                    break;
                case "notify":
                    soundfile = "/NotificationSounds/notify.mp3";
                    break;
                case "success":
                    soundfile = "/NotificationSounds/success.mp3";
                    break;
                case "tick":
                    soundfile = "/NotificationSounds/tick.mp3";
                    break;
                case "warning":
                    soundfile = "/NotificationSounds/warning.mp3";
                    break;
                case "alien":
                    soundfile = "/NotificationSounds/alien.mp3";
                    break;
                case "cricket":
                    soundfile = "/NotificationSounds/cricket.mp3";
                    break;
                case "echo":
                    soundfile = "/NotificationSounds/echo.mp3";
                    break;
                case "knob":
                    soundfile = "/NotificationSounds/knob.mp3";
                    break;
            default:
            }
            var aud = document.getElementById("notificationSound");
            aud.src = soundfile;
            aud.play();
        }

        return {
            add: add,
            addDark:addDark,
            close: close,
            clear: clear,
            addMoveTop: addMoveTop,
            addMoveTopDark: addMoveTopDark,
            clearAll: clearAll,
            MakeSound: MakeSound,
        }


    }]);
})();