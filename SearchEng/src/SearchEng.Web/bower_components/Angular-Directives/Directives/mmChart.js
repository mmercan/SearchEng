(function () {
    angular.module('directives').directive("mmChart", ["$http", "$compile", function ($http, $compile) {
        return {
            //restrict: 'E',
            template:  "<div class='chart'></div>",
            replace: true,
            scope:{
                itemssource: '=',
                url:"@",
                type: '@',
                title: '@',
                seriesDefaults: '=',
                series: '=',
                config: "=",
                height: "=",
                width:"=",

            },
            link: function (scope, element, attrs, ngModelCtrl) {
                scope.$watch('itemssource', function (newdata, olddata) {
                    if (newdata ) {
                        var itemssource = scope.itemssource;
                        var datasource = { data: itemssource }
                        loadthechart(datasource);
                    }
                });

                var onit = true;
                $(element).mouseover(function () {
                    if (onit) {
                        var chart = $(element).data("kendoChart");
                        chart.redraw();
                    }
                    onit = false;
                })

                scope.$watch('url', function (newdata, olddata) {
                    if (newdata) {
                        var datasource = {
                            transport: {
                                read: {
                                    url: scope.url,
                                    dataType: "json"
                                }
                            }
                        };

                        loadthechart(datasource);
                    }
                });

                var chart = null;
                var loadthechart = function (datasource) {
                    //TODO:default ayarlar icin bi constant yaz
                    var title = scope.title;
                    var type = scope.type;
                    //var items = datasource;
                    var seriesDefaults = {type: type,labels: {visible: true, format: "{0}", background: "transparent" }}
                    
                    var series = scope.series;
                    if (!series) { series = [{ field: "value" }];}
                    var valueAxis = scope.valueAxis;
                    var categoryAxis = scope.categoryAxis;
                    if (!categoryAxis) { categoryAxis = { field: "text" };}

                    if (scope.config && scope.config.seriesDefaults) { seriesDefaults = scope.config.seriesDefaults; }
                    if (scope.config && scope.config.title) { title = scope.config.title; }
                    if (scope.config && scope.config.series) { series = scope.config.series; }
                    if (scope.config && scope.config.valueAxis) { valueAxis = scope.config.valueAxis; }
                    if (scope.config && scope.config.categoryAxis) { categoryAxis = scope.config.categoryAxis; }
                    if (scope.config && scope.config.legend){}
                    elem = $(element);
                    if (scope.height) {
                        elem = elem.height(scope.height);
                    }
                    if (scope.width) {
                        elem = elem.width(scope.width);
                    }
                    //  height(200)
                    //width(200)

                        chart = elem.kendoChart({
                        dataSource: datasource,
                        title: {
                            text: title,
                },
                        legend: scope.config.legend,
                        seriesColors: scope.config.seriesColors,
                        seriesDefaults: seriesDefaults,
                        series: series,
                        valueAxis: valueAxis,
                        chartArea: scope.config.chartArea,
                      
                        categoryAxis: categoryAxis,
                        tooltip: scope.config.tooltip,
                    });


                }
            },
        }
    }]);
})();