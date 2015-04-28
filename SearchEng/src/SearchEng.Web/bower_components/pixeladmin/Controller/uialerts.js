angular.module("app").controller("uialert", ["$scope", "alertService", "notificationService", function ($scope, alertService, notificationService) {

    $('#page-alerts-demo').on('click', 'button', function() {
        var $this = $(this);
        // Go to the top

        if ($this.hasClass('page-alerts-clear-btn')) {
            alertService.clear(
                true, // animate
                'pa_page_alerts_default' // namespace
            );
        } else {
            var options = {
                type: $this.attr('data-type'),
                //namespace: 'pa_page_alerts_default'
            };
            if ($this.hasClass('auto-close-alert'))
                options['auto_close'] = 3; // seconds
            alertService.addMoveTop($this.attr('data-text'), options);
        }
    });


    $('#page-alerts-dark-demo').on('click', 'button', function () {
        var $this = $(this);
        // Go to the top
            if ($this.hasClass('page-alerts-clear-btn')) {
                alertService.clear(
               true, // animate
               'pa_page_alerts_default' // namespace
           );
            } else {
                var options = {}
                //if ($this.hasClass('auto-close-alert'))
                    //options['auto_close'] = 3; // seconds
                alertService.addMoveTopDark($this.attr('data-text'), null, $this.attr('data-type'),30);
            }
    });

    $scope.showAlert = function (text,type,isdark) {
        if (isdark) {
            alertService.addMoveTopDark(text, null, type, 30);
        } else {
            var options = {
                type: type, 'auto_close': 3
            };
            //options['auto_close'] = 3;
            alertService.addMoveTop(text, options);
        }

    }

    $scope.notificationSuccess = function () {
        notificationService.success();
    };
    $scope.notificationInfo = function () {
        notificationService.info();
    };
    $scope.notificationWarning = function () {
        notificationService.warning();
    };
    $scope.notificationError = function () {
        notificationService.error();
    };
}]);