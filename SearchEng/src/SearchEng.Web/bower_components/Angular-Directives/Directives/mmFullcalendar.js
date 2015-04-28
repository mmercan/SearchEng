(function () {
    angular.module("directives").directive("mmFullcalendar", ["$http", "$compile", function ($http, $compile) {
        return {
            //restrict: "A",
            scope: {
                itemssource: '=',
                selectedday: '=',
                daySelected: "&",
                selectedevent: '=',
                eventSelected: "&",
                viewChanged: "&",
                fetchItems: "&",
                rerender: '=',
            },
            link: function (scope, element, attrs, ctrls) {

                scope.$watch("rerender", function (newdata, olddata) {
                    if (scope.rerender && scope.rerender == true) {
                        $(element).fullCalendar('render')
                        scope.refreshrender = false;
                    }
                });

                scope.$watch("itemssource", function (newdata, olddata) {
                    var startParam = "start";
                    var endParam = "end";
                    if (attrs.startParam) { startParam = attrs.startParam; }
                    if (attrs.endParam) { endParam = attrs.endParam; }

                    if (newdata && newdata.length && newdata.length > 0) {
                        load(scope.itemssource, startParam, endParam);
                    } else {
                        load(null, startParam, endParam);
                    }
                });
                var lastview = {};
                var loaded = false;
                var daySelectedHandler = scope.daySelected();
                var eventSelectedHandler = scope.eventSelected();
                var viewChangedHandler = scope.viewChanged();
                var fetchItemsHandler = scope.fetchItems();
                var load = function (items, startParam, endParam) {
                    if (loaded) {
                        events = function (start, end, callback) {
                            if (fetchItemsHandler) {
                                var results = fetchItemsHandler(start, end);
                                if (results) { callback(results); }
                            } else { callback(items); }
                        };

                        // $(element).fullCalendar('rerenderEvents');
                        //$('#calendar').fullCalendar('removeEventSource', events);
                        //$('#calendar').fullCalendar('addEventSource', events);
                        if (items && items.length && items.length > 0) {

                            //Error happining Here

                            try {
                                $(element).fullCalendar('refetchEvents');
                            }
                            catch (err) {
                                console.log(err);
                               // alert(err);
                             //   document.getElementById("demo").innerHTML = err.message;
                            }
                            
                        }
                        return;
                    } else {
                        loaded = true;
                        $(element).fullCalendar({
                            disableDragging: true,
                            header: {
                                left: 'prev,next today',
                                center: 'title',
                                right: 'month,agendaWeek,agendaDay'
                            },
                            editable: true,
                            startParam: startParam,
                            endParam:endParam,
                            events: function (start, end, callback) {
                                if (fetchItemsHandler) {
                                    var results = fetchItemsHandler(start, end);
                                    if (results) {
                                        callback(results);
                                    }
                                } else {
                                    callback(scope.itemssource);
                                }
                            },
                            eventClick: function (calEvent, jsEvent, view) {
                                
                                if (scope.selectedevent != undefined) {
                                    scope.$apply(function () { scope.selectedevent = calEvent; });
                                } else if (attrs.selectedevent) {
                                    scope.$apply(function() {
                                        scope.selectedevent = {};
                                        scope.selectedevent = calEvent;
                                    });

                                    scope.$apply(function () {
                                        scope.selectedevent = {};
                                        scope.selectedevent = calEvent;
                                    });
                                }
                                if (eventSelectedHandler) {
                                    eventSelectedHandler(calEvent);
                                };
                            },
                            dayClick: function (a) {
                                if (scope.selectedday != undefined) {
                                    scope.$apply(function () { scope.selectedday = a; });
                                } else {
                                    if (attrs.selectedday) {
                                        scope.selectedday = {};
                                        scope.$apply(function () { scope.selectedday = a; });
                                    }
                                }
                                if (daySelectedHandler) {
                                    daySelectedHandler(a);
                                };
                            },
                            viewRender: function (view, element) {
                                if ((!lastview.visStart || !lastview.visEnd) || (lastview.visStart.toString() != view.visStart.toString() || lastview.visEnd.toString() != view.visEnd.toString())) {
                                    lastview.visStart = view.visStart;
                                    lastview.visEnd = view.visEnd;
                                    if (viewChangedHandler) {
                                        viewChangedHandler(view);
                                    }
                                }
                            },
                        });
                    }
                }
            },
            //controller: function ($scope, $element, $attrs) {},
        };
    }]);
})();