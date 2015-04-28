//<ul class="list-unstyled col-sm-12 sortable" itemssource="products.value" orderfield="ProductID">
(function () {
    //---Jquery IU required---//
    angular.module('directives').directive("mmSortable", ["$http", "$compile", function ($http, $compile) {
        return {
            restrict: "C",
            scope: {
                itemssource: "=",
                orderfield: "@",
                sorted:"&",
                handle:"@"
            },
            link: function (scope, element, attrs) {
                scope.dragStart = function (e, ui) {
                    ui.item.data('start', ui.item.index());
                }
                scope.dragEnd = function (e, ui) {
                    if (scope.orderfield) {
                        $.map($(this).children(), function (el) {
                            var itemscope = angular.element(el).scope()
                            var num = itemscope.item[scope.orderfield] = $(el).index() + 1;
                        });
                        scope.$apply(scope.itemssource);
                        sortedHandler = scope.sorted()
                        if (sortedHandler) {
                            sortedHandler(scope.itemssource);
                        }
                    } else {
                        var start = ui.item.data('start'),
                            end = ui.item.index();
                        scope.itemssource.splice(end, 0,
                            scope.itemssource.splice(start, 1)[0]);

                        sortedHandler = scope.sorted()
                        if (sortedHandler) {
                            sortedHandler(scope.itemssource);
                        }
                    }
                    scope.$apply();
                }
                var handlekey= '';
if(scope.handle){
  handlekey=scope.handle;
}
                $(element).sortable({
                handle:handlekey,
                    start: scope.dragStart,
                    update: scope.dragEnd
                })
                $(element).disableSelection()
            },
        };
    }]);
})();