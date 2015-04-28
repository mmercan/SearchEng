angular.module('directives').directive("mmTable", ["$http", "$compile", function ($http, $compile) {
        return {
            restrict: "EA",
            transclude: true,
            template: "<table class='table'><thead><tr class='headerholder'></tr></thead><tbody class='rowholder'></tbody></table>" +
                "<div class='modalcontainer'></div>",
            link: function (scope, element, attrs, ctrl, transclude) {
                var rowholderNode = element.find("tbody.rowholder");
                var headerholderNode = element.find("tr.headerholder");
                var clearrowsandheaders =function() {
                    rowholderNode.empty();
                    headerholderNode.empty();
                }

                var childscope = scope.$new();
                var templatedata = "";
                var headertemplate = "";
                //will be removed
                var editTemplate = null;
                var detailTemplate = null;
                var deleteTemplate = null;
             
                //end of will be removed

         
                var modalcontainer = element.find("div.modalcontainer");
                var templatetable = element.find("table.table");
                transclude(childscope, function (clone) {
                    angular.forEach(clone, function (elem) {
                        //if (angular.element(elem).hasClass('create-template')) {
                        //    var createTemplate = elem.innerHTML; //createNode.append(createTemplate);
                        //}
                        if (angular.element(elem).hasClass('edit-template')) {
                             editTemplate = "<div class='edit-template'>" + elem.innerHTML +"</div>"
                        }
                        if (angular.element(elem).hasClass('detail-template')) {
                            detailTemplate = "<div class='detail-template'>" + elem.innerHTML +"</div>"
                        }
                        if (angular.element(elem).hasClass('delete-template')) { deleteTemplate = "<div class='delete-template'>" + elem.innerHTML +"</div>" }

                        if (angular.element(elem).hasClass('data-template')) {
                            var temp = $("td", elem).each(function (_, slide) {templatedata += "<td>" + slide.innerHTML + "</td>";});
                        }
                        //if (angular.element(elem).hasClass('header-template')) {
                        //   // var temp = $("th", elem).each(function (_, slide) { headertemplate += "<th>" + slide.innerHTML + "</th>"; });
                        //}
                    });
                    var h = angular.element(clone, "thead")
                    var temp = $("th", h).each(function(_, slide) {
                         headertemplate += "<th>" + slide.innerHTML + "</th>";
                    });
                    
                });

               // var items = scope.itemssource;
                var columns = null;//scope.columns;

                var createtable = function () {
                    var rowtext = "";
                    var linkpath = "";
                    var tablehead = ""
                    if (scope.linkpath) {
                        linkpath = scope.linkpath
                    } else {
                        linkpath = window.location.hash
                    }
                   
                    for (var i = 0; i < columns.length; i++) {
                        prop = columns[i];
                        if (scope.mmtableSort == "") { scope.mmtableSort = prop; }
                        title = prop.replace("_", " ").split(/(?=[A-Z])/).join(" ");
                        if (i == 0 && idfieldPropertyName) {
                            rowtext += '<td><a ng-href=' + linkpath + '/{{' + valueIdentifier + '.' + idfieldPropertyName + '}}> <span data-ng-bind="' + valueIdentifier + '.' + prop + '"></span></a> </td>';
                        } else {
                            rowtext += '<td><span data-ng-bind="' + valueIdentifier + '.' + prop + '"></span></td>';
                        }
                        tablehead += "<th><a class='pointer' ng-click='mmtableSortit(\"" + prop + "\")' > " + title + " <span ng-show='mmtableSort == \"" + prop + "\"' > <span ng-show='descending'> <i class='fa fa-caret-square-o-down'></i>  </span>  <span ng-hide='descending'> <i class='fa fa-caret-square-o-up'></i> </span>  </span>  </a> </th>"
                    }
                    if (templatedata != "") {
                        rowtext = templatedata;
                    }
                    if (headerholderNode && headerholderNode.length > 0) {
                        if (editTemplate || detailTemplate || deleteTemplate) {tablehead += "<th> Actions </th>"}
                        if (headertemplate != "") {
                            headerholderNode.append(headertemplate);
                        } else {
                            headerholderNode.append(tablehead);
                        }
                    }
                    if (rowholderNode && rowholderNode.length > 0) {
                        if (editTemplate || detailTemplate || deleteTemplate) {
                            rowtext += "<td><div class='btn-group'><button type='button' class='btn btn-primary dropdown-toggle' data-toggle='dropdown'>Actions <span class='caret'></span></button><ul class='dropdown-menu' role='menu'>";
                            if (detailTemplate) { rowtext += "<li><a ng-click='mmtablebtnDetailItem(" + valueIdentifier + ")'>Detail</a></li>"; }
                            if (editTemplate) { rowtext += "<li><a ng-click='mmtablebtnSaveItem(" + valueIdentifier + ")'>Edit</a></li>"; }
                            if (deleteTemplate) { rowtext += "<li class='divider'></li> <li><a ng-click='mmtablebtnDeleteItem(" + valueIdentifier + ")'>Delete</a></li></ul></div></td>"; }
                        }
                        if (ngrepeatattr) {
                            var fullrowtext = "<tr data-ng-class='{ \"active\":mmtableIntSelectedItem ==" + valueIdentifier + "}'  ng-click='mmtableSelected(" + valueIdentifier + ")' ng-attr-cursor='{{mmtablecursor}}'  data-ng-repeat='" + ngrepeatattr + "'>" + rowtext + "</tr>";
                        } else {
                            var fullrowtext = "<tr data-ng-class='{ \"active\":mmtableIntSelectedItem ==" + valueIdentifier + "}'  ng-click='mmtableSelected(" + valueIdentifier + ")' ng-attr-cursor='{{mmtablecursor}}'  data-ng-repeat='" + valueIdentifier + " in " + itemssourcePropertyName + " |orderBy:mmtableSort:descending |  filter : mmtableFilter'  >" + rowtext + "</tr>";
                        }
                        rowholderNode.append(fullrowtext);
                    }
                    //var modal = "";
                    //if (editTemplate || detailTemplate || deleteTemplate) {
                    //    modal = CreateModal();
                   // }
                   // var full = modal;
                   // tablecontainer.append($compile(full)(scope))
                    //$compile(element.contents())(childscope);
                    $compile(templatetable)(childscope);
                    
                };
                
                //controller Actions
                var firstime = true;
                var itemssourcePropertyName =null
                var idfieldPropertyName = null;
                var itemselectedHandler = null;
                var selecteditemPropertyName = null;
                //Events
                attrs.$observe('itemselected', function (value) {
                    if (value && scope[value] && angular.isFunction(scope[value])) {
                        itemselectedHandler = scope[value];
                    }
                });
             
                // End of events

                var ngrepeatattr = null;
                var valueIdentifier = "item";
                var expression = attrs.mmTable;
                if (expression) {
                    var match = expression.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);
                    if (!match) { throw ('iexp', "Expected expression in form of '_item_ in _collection_[ track by _id_]' but got '{0}'.", expression); }
                    var lhs = match[1];
                    var rhs = match[2];
                    var aliasAs = match[3];
                    var trackByExp = match[4];
                    match = lhs.match(/^(?:(\s*[\$\w]+)|\(\s*([\$\w]+)\s*,\s*([\$\w]+)\s*\))$/);
                    if (!match) { throw ('iidexp', "'_item_' in '_item_ in _collection_' should be an identifier or '(_key_, _value_)' expression, but got '{0}'.", lhs); }
                    valueIdentifier = match[3] || match[1];
                    ngrepeatattr = attrs.mmTable;
                }
                if (rhs) {
                    itemssourcePropertyName = rhs;
                    scope.$watch(itemssourcePropertyName, function (newVal, oldVal) {
                        if (newVal && !columns) {
                            if (newVal && newVal[0]) {
                                columns = [];
                                for (prop in newVal[0]) {
                                    columns.push(prop);
                                }
                                createtable();
                            }
                        }
                    });

                }

                attrs.$observe('itemssource', function (value) {
                    itemssourcePropertyName = value;
                    scope.$watch(value, function (newVal, oldVal) {
                        if (newVal && !columns) {
                            if (newVal && newVal[0]) {
                                columns = [];
                                for (prop in newVal[0]) {
                                    columns.push(prop);
                                }
                                createtable();
                            }
                        }
                    });
                });
              
                attrs.$observe('selecteditem', function (value) {
                    selecteditemPropertyName = value;
                    scope.$watch(value, function (newvalue) {
                        if (newvalue) {
                            if (newvalue !== childscope.mmtableIntSelectedItem) {
                                childscope.mmtableIntSelectedItem = newvalue;
                            }
                        } else if (selecteditemPropertyName) {
                            scope[selecteditemPropertyName] = {};
                        }
                    });

                });


                attrs.$observe('tableClass', function (value) {
                    if (value) {
                        $(templatetable).addClass(value);
                    }
                });

                attrs.$observe('filter', function (value) {
                    scope.$watch(value, function(newValue, oldVal) {
                        childscope.mmtableFilter = newValue;
                    });
                });
                attrs.$observe('columns', function (value) {
                    scope.$watch(value, function (newValue, oldVal) {
                        if (newValue && (newValue != oldVal || firstime)) {
                            firstime = false;
                            clearrowsandheaders();
                            columns = newValue;
                            createtable();
                        }
                    });
                });

                attrs.$observe('idfield', function (value) {
                    idfieldPropertyName = value;
                });

                
                childscope.mmtableSort = "";
                childscope.descending = false;
                childscope.mmtablecursor = "auto";

                childscope.mmtableSortit = function (item) {
                    if (childscope.mmtableSort == item) {
                        childscope.descending = !childscope.descending;
                    } else {
                        childscope.descending = false;
                        childscope.mmtableSort = item;
                    }
                };
                childscope.mmtableSelected = function (item) {
                    childscope.mmtablecursor = "hand";
                    if (childscope.mmtableIntSelectedItem != item) {
                        childscope.mmtableIntSelectedItem = item;
                    }
                    if (itemselectedHandler) {
                        itemselectedHandler(item);
                    }
                    if (selecteditemPropertyName) {
                        scope[selecteditemPropertyName] = item;
                    }
                };


                //Modal Actions
                var detailClickedHandler = null;
                var saveClickedHandler = null;
                var deleteClickedHandler = null;

                attrs.$observe('detailClicked', function (value) {
                    if (value && scope[value] && angular.isFunction(scope[value])) { detailClickedHandler = scope[value]; }
                });
                attrs.$observe('saveClicked', function (value) {
                    if (value && scope[value] && angular.isFunction(scope[value])) {saveClickedHandler = scope[value]; }
                });
                attrs.$observe('deleteClicked', function (value) {
                    if (value && scope[value] && angular.isFunction(scope[value])) { deleteClickedHandler = scope[value];}
                });
                if (editTemplate || detailTemplate || deleteTemplate) {
                    var actionModal = "<mm-action-modal selecteditem='mmtableselecteditem' calldetail='mmtablecalldetail' detail-clicked='mmtabledetailClicked'" +
                        "calledit='mmtablecalledit' save-clicked='mmtableSaveClicked' " + "calldelete='mmtablecalldelete' delete-clicked='mmtabledeleteClicked'>" +
                        editTemplate + detailTemplate + deleteTemplate + "</mm-action-modal>";
                    modalcontainer.append(actionModal);
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
                childscope.mmtableSaveClicked = function (item) {angular.copy(item, childscope.originalitem); if (saveClickedHandler) {saveClickedHandler(childscope.originalitem);}               };

                childscope.mmtablebtnDeleteItem = function (item) {childscope.mmtableselecteditem = item; childscope.mmtablecalldelete = true; };
                childscope.mmtabledeleteClicked = function (item) {if (deleteClickedHandler) { deleteClickedHandler(item);}};
            },

           

            controller: ["$scope", "$element", "$attrs", function ($scope, $element, $attrs) {
               

               

 
            }],

        };
    }]);