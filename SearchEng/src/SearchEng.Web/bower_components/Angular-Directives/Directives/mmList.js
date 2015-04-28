angular.module("directives").directive("mmList", ["$http", "$compile","$parse", function ($http, $compile,$parse) {
    return {
        restrict: 'EA',
        transclude: true,
        template:'<div></div>',
        link: function (scope, element, attrs, ctrl, transclude) {
            var childscope = scope.$new();
            //copied from ng-repeat extact valueIdentifier and Collection Name (rhs)
            var expression = attrs.mmList;
            var match = expression.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);
            if (!match) { throw ('iexp', "Expected expression in form of '_item_ in _collection_[ track by _id_]' but got '{0}'.", expression); }
            var lhs = match[1];
            var rhs = match[2];
            var aliasAs = match[3];
            var trackByExp = match[4];
            match = lhs.match(/^(?:(\s*[\$\w]+)|\(\s*([\$\w]+)\s*,\s*([\$\w]+)\s*\))$/);
            if (!match) { throw ('iidexp', "'_item_' in '_item_ in _collection_' should be an identifier or '(_key_, _value_)' expression, but got '{0}'.", lhs); }
            var valueIdentifier = match[3] || match[1];

            //data-template extraction
            var datatemplate = null;
            transclude(childscope, function (clone) {
                angular.forEach(clone, function (elem) {
                    if (angular.element(elem).hasClass('data-template')) { datatemplate = elem.outerHTML;   }
                });
            });
            var parsedNgModel = $parse(attrs.selecteditem),
            parsedNgModelAssign = parsedNgModel.assign,
            ngModelGet = parsedNgModel,
            ngModelSet = parsedNgModelAssign;

            //Append ng-repeat 
            var createlist = function () {
                if (attrs.mmList) {
                    ngrepeatattr = attrs.mmList;
                }

                var datatemp = $(datatemplate);
                datatemp.attr("ng-repeat", ngrepeatattr);
                datatemp.attr("ng-click", "itemclicked(" + valueIdentifier + ")");
                datatemp.attr("data-ng-class", '{"active":mmlistselecteditem ==' + valueIdentifier + '}');
                datatemp.addClass("listitem");
                if (datatemp && datatemp[0] && datatemp[0].outerHTML) {
                    var listrepeater = datatemp[0].outerHTML;
                    element.append(listrepeater);
                    $compile(element.contents())(childscope);
                }
            };
            createlist();

            //Click Function and observes
            childscope.mmlistselecteditem = {};
            var selecteditemPropertyName = null;
            var itemselectedHandler = null;
          
            childscope.itemclicked = function (item) {

                var changedValue = childscope.mmlistselecteditem;
                childscope.mmlistselecteditem = item;
                //if (selecteditemPropertyName) { scope[selecteditemPropertyName] = item; }
                 if (ngModelSet) {
                    ngModelSet(scope, item);
                }
                if (itemselectedHandler) {
                    itemselectedHandler(item, changedValue);
                }
            };

            attrs.$observe("selecteditem", function (value, oldvalue) {
                //selecteditemPropertyName = value;
                if (ngModelSet) { ngModelSet(scope, newvalue); }
                scope.$watch(value, function (newvalue,oldValue) {
                    if (newvalue) {
                        if (newvalue !== childscope.mmlistselecteditem) {
                            childscope.mmlistselecteditem = newvalue;
                        }
                    }// else if (selecteditemPropertyName) { scope[selecteditemPropertyName] = {}; }
                    else if (ngModelSet) { ngModelSet(scope, {}); }
                });
            });

            attrs.$observe("itemselected", function (value) {
                if (value && scope[value] && angular.isFunction(scope[value])) { itemselectedHandler = scope[value]; }
            });

            element.bind('keydown', keydown);
            function  keydown (e) {
                if (e.keyCode == 13) { // enter
                    if ($(".services").is(":visible")) {
                        selectOption();
                    } else {
                        $(".services").show();
                    }
                    menuOpen = !menuOpen;
                }
                if (e.keyCode == 38) { // up
                    var selected = $(".selected");
                    $(".services li").removeClass("selected");
                    if (selected.prev().length == 0) {
                        selected.siblings().last().addClass("selected");
                    } else {
                        selected.prev().addClass("selected");
                    }
                }
                if (e.keyCode == 40) { // down
                    var selected = $(".active",element);
                    $(".services li").removeClass("selected");
                    if (selected.next().length == 0) {
                        selected.siblings().first().addClass("selected");
                    } else {
                        selected.next().addClass("selected");
                    }
                }
            };


          

        },

        controller: ["$scope", "$element", "$attrs", function ($scope, $element, $attrs) {

        }]
    }
}]);




















angular.module("directives").directive("mmmTable", ["$http", "$compile", function ($http, $compile) {
    return {
        restrict: 'A',
        transclude: true,
        template: "<table class='table'><thead><tr class='headerholder'></tr></thead><tbody class='rowholder'></tbody></table> <div class='modalcontainer'></div>",
        // replace:true,
        link: function (scope, element, attrs, ctrl, transclude) {

            var rowholderNode = element.find("tbody.rowholder");
            var headerholderNode = element.find("tr.headerholder");
            var modalcontainer = element.find("div.modalcontainer");
            var templatetable = element.find("table.table");

            var childscope = scope.$new();
            var itemsourcePropertyName = "";

            //copied from ng-repeat extact valueIdentifier and Collection Name (rhs)
            var expression = attrs.mmmTable;
            var match = expression.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);
            if (!match) throw ('iexp', "Expected expression in form of '_item_ in _collection_[ track by _id_]' but got '{0}'.", expression);
            var lhs = match[1];
            var rhs = match[2];
            var aliasAs = match[3];
            var trackByExp = match[4];
            match = lhs.match(/^(?:(\s*[\$\w]+)|\(\s*([\$\w]+)\s*,\s*([\$\w]+)\s*\))$/);
            if (!match) throw ('iidexp', "'_item_' in '_item_ in _collection_' should be an identifier or '(_key_, _value_)' expression, but got '{0}'.", lhs);

            var valueIdentifier = match[3] || match[1];

            var orderedField = "mmtableSort";
            var isorderBy = false;
            var parts = rhs.split("|");
            itemsourcePropertyName = parts[0].trim();
            for (i = 0; i < parts.length; i++) {
                var filter = parts[i].split(':');
                if (filter && filter.length && filter.length > 1) {
                    var filtername = filter[0].trim();
                    if (filtername == "orderBy") {
                        isorderBy = true;
                        orderedField = filter[1].trim();
                    }
                }
            }
            if (!isorderBy) attrs.mmmTable = attrs.mmmTable + " | orderBy:mmtableSort:descending";
            //data-template extraction
            var datatemplate = "";
            var editTemplate = null;
            var detailTemplate = null;
            var deleteTemplate = null;
            var headertemplate = null;
            transclude(childscope, function (clone) {
                angular.forEach(clone, function (elem) {
                    if (angular.element(elem).hasClass('edit-template')) editTemplate = "<div class='edit-template'>" + elem.innerHTML + "</div>"
                    if (angular.element(elem).hasClass('detail-template')) detailTemplate = "<div class='detail-template'>" + elem.innerHTML + "</div>"
                    if (angular.element(elem).hasClass('delete-template')) deleteTemplate = "<div class='delete-template'>" + elem.innerHTML + "</div>"

                    if (angular.element(elem).hasClass('data-template')) {
                        var temp = $("td", elem).each(function (_, slide) {
                            datatemplate += slide.outerHTML;
                        });
                        datatemplate = "<tr>" + datatemplate + "</tr>";
                    }
                    var h = angular.element(clone, "thead")
                    var temp = $("th", h).each(function (_, slide) {
                        headertemplate += "<th>" + slide.innerHTML + "</th>";
                    });
                });
            });

            //Append ng-repeat 
            var idfieldPropertyName = null;
            function createheader(columns, orderField) {
                var tablehead = "";
                for (var i = 0; i < columns.length; i++) {
                    title = columns[i].replace("_", " ").split(/(?=[A-Z])/).join(" ");
                    tablehead += "<th><a class='pointer' ng-click='mmtableSortit(\"" + columns[i] + "\")' > " + title + " <span ng-show='mmtableSort == \"" + columns[i] + "\"' > <span ng-show='descending'> <i class='fa fa-caret-square-o-down'></i>  </span>  <span ng-hide='descending'> <i class='fa fa-caret-square-o-up'></i> </span>  </span>  </a> </th>"
                }
                if (editTemplate || detailTemplate || deleteTemplate) tablehead += "<th>Actions</th>"
                headerholderNode.html(tablehead);
            };

            function createtable(columns, linkpath) {
                if (!linkpath) { linkpath = window.location.hash }
                if (attrs.mmmTable) { ngrepeatattr = attrs.mmmTable; }

                if (datatemplate == "") {
                    rowtext = "";
                    for (var i = 0; i < columns.length; i++) {
                        if (i == 0 && idfieldPropertyName) {
                            rowtext += '<td><a ng-href=' + linkpath + '/{{' + valueIdentifier + '.' + idfieldPropertyName + '}}> <span data-ng-bind="' + valueIdentifier + '.' + columns[i] + '"></span></a> </td>';
                        } else {
                            rowtext += '<td><span data-ng-bind="' + valueIdentifier + '.' + columns[i] + '"></span></td>';
                        }
                    }
                    var datatemp = $("<tr>" + rowtext + "</tr>");
                } else {
                    var datatemp = $(datatemplate);
                }

                if (editTemplate || detailTemplate || deleteTemplate) {
                    var btngtroups = ""
                    btngtroups += "<td><div class='btn-group'><button type='button' class='btn btn-primary dropdown-toggle' data-toggle='dropdown'>Actions <span class='caret'></span></button><ul class='dropdown-menu' role='menu'>";
                    if (detailTemplate) btngtroups += "<li><a ng-click='mmtablebtnDetailItem(" + valueIdentifier + ")'>Detail</a></li>";
                    if (editTemplate) btngtroups += "<li><a ng-click='mmtablebtnSaveItem(" + valueIdentifier + ")'>Edit</a></li>";
                    if (deleteTemplate) btngtroups += "<li class='divider'></li> <li><a ng-click='mmtablebtnDeleteItem(" + valueIdentifier + ")'>Delete</a></li></ul></div></td>";

                    datatemp.append(btngtroups);
                    prepeareActions();
                }

                datatemp.attr("data-ng-repeat", ngrepeatattr);
                datatemp.attr("ng-click", "itemclicked(" + valueIdentifier + ")");
                datatemp.attr("data-ng-class", '{"active":mmlistselecteditem ==' + valueIdentifier + '}');
                // datatemp.addClass("listitem");
                if (datatemp && datatemp[0] && datatemp[0].outerHTML) {
                    var listrepeater = datatemp[0].outerHTML;
                    rowholderNode.html(listrepeater);
                    $compile(element.contents())(childscope);
                }
            };

            //Click Function and observes
            childscope.mmlistselecteditem = {};
            var selecteditemPropertyName = null;
            var itemselectedHandler = null;
            childscope.itemclicked = function (item) {
                childscope.mmlistselecteditem = item;
                if (selecteditemPropertyName) scope[selecteditemPropertyName] = item;
                if (itemselectedHandler) itemselectedHandler(item);
            };

            attrs.$observe("selecteditem", function (value, oldvalue) {
                selecteditemPropertyName = value;
                scope.$watch(value, function (newvalue) {
                    if (newvalue) {
                        if (newvalue !== childscope.mmlistselecteditem) childscope.mmlistselecteditem = newvalue;;
                    } else if (selecteditemPropertyName) {
                        scope[selecteditemPropertyName] = {};
                    }
                });
            });

            attrs.$observe("itemselected", function (value) {
                if (value && scope[value] && angular.isFunction(scope[value])) itemselectedHandler = scope[value];
            });

            attrs.$observe('idfield', function (value) {
                idfieldPropertyName = value;
            });

            //observe column or itemsource
            if (attrs.columns) {
                var firstime = true;
                attrs.$observe('columns', function (value) {
                    scope.$watch(value, function (newValue, oldVal) {
                        if (newValue && (newValue.toString() != oldVal.toString() || firstime)) {
                            firstime = false;
                            createheader(newValue, orderedField);
                            createtable(newValue);
                        }
                    });
                });
            }
            else {
                scope.$watch(itemssourcePropertyName, function (newVal, oldVal) {
                    if (newVal && !columns) {
                        if (newVal && newVal[0]) {
                            var columns = [];
                            for (prop in newVal[0]) { columns.push(prop); }
                            createheader(columns, orderedField);
                            createtable(columns);
                        }
                    }
                });
            };

            //Sorting and selection Functions
            childscope.mmtableSort = "";
            childscope.descending = false;
            childscope.mmtablecursor = "auto";

            childscope.mmtableSortit = function (item) {
                if (childscope.mmtableSort == item) {
                    childscope.descending = !childscope.descending;
                } else {
                    childscope.descending = false;
                    if (orderedField) {
                        scope[orderedField] = item;
                        childscope.mmtableSort = item;
                    }
                }
            };
            childscope.mmtableSelected = function (item) {
                childscope.mmtablecursor = "hand";
                if (childscope.mmtableIntSelectedItem != item) {
                    childscope.mmtableIntSelectedItem = item;
                }
                if (itemselectedHandler) itemselectedHandler(item);
                if (selecteditemPropertyName) scope[selecteditemPropertyName] = item;
            };

            function prepeareActions() {

                var detailClickedHandler = null;
                var saveClickedHandler = null;
                var deleteClickedHandler = null;

                attrs.$observe('detailClicked', function (value) {
                    if (value && scope[value] && angular.isFunction(scope[value])) { detailClickedHandler = scope[value]; }
                });
                attrs.$observe('saveClicked', function (value) {
                    if (value && scope[value] && angular.isFunction(scope[value])) { saveClickedHandler = scope[value]; }
                });
                attrs.$observe('deleteClicked', function (value) {
                    if (value && scope[value] && angular.isFunction(scope[value])) { deleteClickedHandler = scope[value]; }
                });
                if (editTemplate || detailTemplate || deleteTemplate) {
                    var actionModal = "<mm-action-modal selecteditem='mmtableselecteditem' calldetail='mmtablecalldetail' detail-clicked='mmtabledetailClicked'" +
                        "calledit='mmtablecalledit' save-clicked='mmtableSaveClicked' " + "calldelete='mmtablecalldelete' delete-clicked='mmtabledeleteClicked'>" +
                        editTemplate + detailTemplate + deleteTemplate + "</mm-action-modal>";
                    modalcontainer.html(actionModal);
                    $compile(modalcontainer)(childscope);
                }

                childscope.mmtablebtnDetailItem = function (item) {
                    childscope.mmtableselecteditem = item;
                    childscope.mmtablecalldetail = true;
                    if (detailClickedHandler) { detailClickedHandler(childscope.mmtableselecteditem); }
                };
                childscope.mmtablebtnSaveItem = function (item) {
                    childscope.originalitem = item;
                    childscope.mmtableselecteditem = angular.copy(item);
                    childscope.mmtablecalledit = true;
                };
                childscope.mmtableSaveClicked = function (item) { angular.copy(item, childscope.originalitem); if (saveClickedHandler) { saveClickedHandler(childscope.originalitem); } };

                childscope.mmtablebtnDeleteItem = function (item) { childscope.mmtableselecteditem = item; childscope.mmtablecalldelete = true; };
                childscope.mmtabledeleteClicked = function (item) { if (deleteClickedHandler) { deleteClickedHandler(item); } };
            }

        },

        controller: ["$scope", "$element", "$attrs", function ($scope, $element, $attrs) {
        }]
    }
}]);