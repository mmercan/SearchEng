//<mm-treeview itemssource="assemb" selected-id="selectidid" nullvalue="'749'" selectedtext="selectedText" idfield="ComponentID" textfield="ComponentName" parentfield="ProductAssemblyID"></mm-treeview>
/*
                                 <mm-treeview itemssource="productAssembly" selected-id="selectidid" nullvalue="productID" selectedtext="selectedText" idfield="ComponentID"  parentfield="ProductAssemblyID">
                                    <div class="data-template">
                                        <table class=" table table-bordered">
                                            <tr>
                                                <td>{{ node.ComponentName }}</td>
                                                <td>Qty : {{node.PerAssemblyQty }}</td>
                                            </tr>
                                        </table>
                                    </div>
                                </mm-treeview>
  
 */

(function () {
    //---Jquery IU required---//
    angular.module('directives').directive('mmTreeview', ["$compile", function ($compile) {
        return {
            template: '<ul class="uiTree"></ul>',
            replace: true,
            transclude: true,
            restrict: 'E',
            scope: {
                itemssource: '=',
                parentnodeid: '@',
                parentfield: "@",
                idfield: '@',
                textfield: '@',
                selectedtext: '=',
                //tree: '=ngModel',
                nullvalue: '=',

                //loadFn: '=',
                //expandTo: '=',
                selectedId: '=',
                selecteditem: '=ngModel',
            },
            link: function (scope, element, attrs, ctrl, transclude) {
                var treecontrol = element[0];//.find("ul");
                var datatemplate = "";
            transclude(scope, function (clone) {angular.forEach(clone, function (elem) {
            if (angular.element(elem).hasClass('data-template')) {
                datatemplate ="<div class='data-template''>" + elem.innerHTML + "</div>";
            }});});
            element.append('<mm-treeview-node ng-repeat="node in tree">' + datatemplate + '</mm-treeview-node>');
            $compile(element.contents())(scope);
            },

            controller: ["$scope", "$element", "$attrs", function ($scope, $element, $attrs) {

                $attrs.$observe("ngModel", function (value) {
                    if (value && !$scope.selecteditem) {
                        $scope.selecteditem = {};
                    }
                });

                $scope.$on("nodeSelected", function (event, node) {
                    $scope.$broadcast("selectNode", node);
                    if ($scope.selectedId) {
                        $scope.selectedId = node[$scope.idfield];
                    }
                    if ($scope.selectedtext) {
                        $scope.selectedtext = node[$scope.textfield];
                    }

                    if ($scope.selecteditem) {
                        $scope.selecteditem = node;
                    }
                });

                var findtheparent = function (id) {
                    var item = _.find($scope.itemssource, function (parentittem) { return (id == parentittem[$scope.idfield]) });

                    var parentids = id;

                    var findtheparentrec = function (item) {
                        if (item[$scope.parentfield]) {
                            parentids = item[$scope.parentfield] + "," + parentids;
                            var parent = _.find($scope.itemssource, function (parentittem) { return (item[$scope.parentfield] == parentittem[$scope.idfield]) });
                            if (parent) { findtheparentrec(parent) }
                        } else { return parentids; }
                    }
                    if (item) {
                        findtheparentrec(item);
                    }
                    return parentids;
                }

                $scope.$watch("itemssource", function (newVal, oldVal) {
                    drawtreeview();
                });

                $scope.$watch("nullvalue", function (newVal, oldVal) {
                    if (newVal) {
                        drawtreeview();
                    }
                });

                var drawtreeview = function () {
                    if ($scope.itemssource && $scope.itemssource.length && $scope.itemssource.length > 0) {
                        if ($scope.parentnodeid) {
                            var items = _.filter($scope.itemssource, function (item) { return item[$scope.parentfield] == $scope.parentnodeid });
                            $scope.tree = items;
                        } else {
                            if ($scope.nullvalue) {
                                var items = _.filter($scope.itemssource, function (item) {
                                    return item[$scope.parentfield] == $scope.nullvalue
                                });
                            } else {
                                var items = _.filter($scope.itemssource, function (item) { return item[$scope.parentfield] == null });
                            }
                            $scope.tree = items;
                        }

                        // TODO expandTo shouldn't be two-way, currently we're copying it
                        if (!$scope.expandTo) {
                            if (!$scope.selectedId) {
                                $scope.selectedId = {}
                            }
                            $scope.expandTo = findtheparent($scope.selectedId);
                        }
                        if ($scope.expandTo && $scope.expandTo.length) {
                            $scope.expansionNodes = angular.copy($scope.expandTo);
                            var arrExpandTo = $scope.expansionNodes.split(",");
                            $scope.nextExpandTo = arrExpandTo.shift();
                            $scope.expansionNodes = arrExpandTo.join(",");
                        }
                    }

                }
            }]
        };
    }])
.directive('mmTreeviewNode', ['$compile', '$timeout', function ($compile, $timeout) {
    return {
        restrict: 'E',
        replace: true,
        //template: '<li>' +
        //          '<div style="clear: both;" class="node" data-node-id="{{ nodeId() }}">' +
        //            '<a style="float: left;width:24px" class="icon" ng-click="toggleNode(nodeId())""></a>' +
        //            '<a style="float: left;" ng-hide="selectedId" ng-href="#/assets/{{ nodeId() }}">{{ node.name }}</a>' +
        //            '<span style="float: left" ng-show="selectedId" ng-class="css()" ng-click="setSelected(node)">' +
        //'<div style="float: left;" class="templateholder"></div>' +
        //    '{{ node[textfield] }}</span>' +
        //          '</div>' +
        //        '</li>',

        template: '<li>' +
          '<div style="clear: both;" class="node" data-node-id="{{ nodeId() }}">' +
            '<a style="float: left;width:24px" class="icon" ng-click="toggleNode(nodeId())""></a>' +
            '<a style="float: left;" ng-hide="selectedId" ng-href="#/assets/{{ nodeId() }}">{{ node.name }}</a>' +
            '<span style="float: left" ng-show="selectedId" ng-class="css()" ng-click="setSelected(node)">' +
            '<div style="float: left;" class="templateholder"></div>' +
                '{{ node[textfield] }}</span>' +
          '</div>' +
        '</li>',
        transclude: true,
        link: function (scope, elm, attrs, ctrl, transclude) {
            var template = null;
            transclude(scope, function (clone) {
                angular.forEach(clone, function (elem) {
                    if (angular.element(elem).hasClass('data-template')) {
                        var templateholder =  elm.find("div.templateholder");

                        template = elem.innerHTML;
                        
                        elm.append($compile(templateholder.append(elem.innerHTML))(scope))
                        // datatemplate.append(elem.innerHTML);
                    }
                });
            });

            scope.nodeId = function (node) {
                var localNode = node || scope.node;
                return localNode[scope.idfield];
            };
            scope.nodehaschildren = function () {
                var q = _.find(scope.itemssource, function (item) {
                    return scope.nodeId() == item[scope.parentfield]
                })
                if (q) return true;
                else return false;
            };

            scope.toggleNode = function (nodeId) {
                var isVisible = elm.children(".uiTree:visible").length > 0;
                var childrenTree = elm.children(".uiTree");
                if (isVisible) {
                    scope.$emit('nodeCollapsed', nodeId);
                } else if (nodeId) {
                    scope.$emit('nodeExpanded', nodeId);
                }
                if (!isVisible && childrenTree.length === 0) {
                    if (scope.tree) {
                        var id = scope.node[scope.idfield]

                        var content = _.find(scope.itemssource, function (item) { return item[scope.parentfield] == id })
                        if (content) {
                            scope.appendChildren();
                            elm.find("a.icon i").show();
                            elm.find("a.icon img").remove();
                            scope.toggleNode(); // show it
                        }
                    }
                } else {
                    childrenTree.toggle(!isVisible);
                    elm.find("a.icon i").toggleClass("fa fa-chevron-right");
                    elm.find("a.icon i").toggleClass("fa fa-chevron-down");
                }
            };

            scope.appendChildren = function () {
                // Add children by $compiling and doing a new ui-tree directive
                // We need the load-fn attribute in there if it has been provided
                var childrenHtml = '<mm-treeview parentnodeid="' + scope.node[scope.idfield] + '" itemssource="itemssource" idfield="' +
                    scope.idfield + '"';
                // pass along all the variables
                if (scope.expansionNodes) {
                    childrenHtml += ' expand-to="expansionNodes"';
                }
                if (scope.selectedId) {
                    childrenHtml += ' selected-id="selectedId"';
                }
                if (scope.parentfield) {
                    childrenHtml += ' parentfield="' + scope.parentfield + '"';
                }

                if (scope.textfield) {
                    childrenHtml += ' textfield="' + scope.textfield + '"';
                }
               
                //if (scope.selectedtext) {
                //    childrenHtml += ' selectedtext=""';
                //}

                childrenHtml += ' style="display: none">';
                if (template) {
                    childrenHtml += "<div class='data-template''>" + template + "</div>"
                }
                childrenHtml += '</mm-treeview>';
                return elm.append($compile(childrenHtml)(scope));
            };

            scope.css = function () {
                return {
                    nodeLabel: true,
                    selected: scope.selectedId && scope.nodeId() === scope.selectedId
                };
            };
            // emit an event up the scope.  Then, from the scope above this tree, a "selectNode"
            // event is expected to be broadcasted downwards to each node in the tree.
            // TODO this needs to be re-thought such that the controller doesn't need to manually
            // broadcast "selectNode" from outside of the directive scope.
            scope.setSelected = function (node) {
                scope.$emit("nodeSelected", node);
            };

            scope.$on("selectNode", function (event, node) {
                scope.selectedId = scope.nodeId(node);
            });
            if (scope.nodehaschildren()) {
                // if (scope.node.hasChildren) {
                elm.find("a.icon").append('<i class="fa fa-chevron-right"></i>');
                // }
            }

            if (scope.nextExpandTo && scope.nodeId() == parseInt(scope.nextExpandTo, 10)) {
                scope.toggleNode(scope.nodeId());
            }
        }
    };
}]);

})();


