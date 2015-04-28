angular.module('directives', []);
angular.module('directives').directive('knob', function () {
    return {
        restrict: 'ACM',
        require: 'ngModel',
        link: function (scope, elem, attrs, ngModelCtrl) {

         var  $elem = $(elem);
         $elem.knob();
         $elem.knob();
         $elem.trigger('configure', {
             'change': function (v) {
                 ngModelCtrl.$setViewValue(v);
                 scope.$apply();
             }
         });

         attrs.$observe('ngModel', function (value) {
             scope.$watch(value, function (newValue) {
                 if (newValue) {
                     $elem.val(ngModelCtrl.$viewValue).trigger('change');
                 }
             });
         });
        }
    };
});
/*
  <mm-action-modal selecteditem="activeCultures" calldetail="calldetail" detail-clicked="detailClicked"
                         callcreate="callcreate" create-clicked="createClicked"
                         calledit="calledit" save-clicked="saveClicked"
                         calldelete="calldelete" delete-clicked="deleteClicked">
            <div class="create-template">
                <form role="form">
                    <div class="form-group">
                        <label>Name</label>
                        <input type="text" class="form-control" ng-model="item.Name" placeholder="Name">
                    </div>
                    <div class="form-group">
                        <select ng-model="incorrectlySelected" ng-options="cat.CategoryID as cat.Name for cat in categories"></select>
                    </div>
                </form>
            </div>

            <div class="edit-template">
                <form role="form">
                    <div class="form-group">
                        <label>Name</label>
                        <input type="text" class="form-control" ng-model="item.Name" placeholder="Name">
                    </div>
                    <div class="form-group">
                        <select class="form-control" ng-model="item.$id" ng-options="cat.$id as cat.Name for cat in categories"></select>
                    </div>
                </form>
            </div>

            <div class="detail-template">
                <form role="form">
                    <div class="form-group">
                        <label>Name</label>
                        <input type="text" class="form-control" ng-model="item.Name" placeholder="Name" disabled="">
                    </div>
                </form>
            </div>
            <div class="delete-template">
                <br />
                <h4 class="text-center">Are you sure want to delete {{item.Name}} ?</h4>
            </div>
        </mm-action-modal>
*/
angular.module("directives").directive("mmActionModal", ["$compile", function ($compile) {
    return{
        restrict: "E",
        //transclude: 'element',
        transclude: true,
        template: '<div class="modal fade "  tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"><div class="modal-dialog modal-lg" style="max-height:100%" ><div class="modal-content" data-ng-class="{ \'panel-warning\':mode ==\'delete\'}"><div class="modal-header panel-heading"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
            '<h4 class="modal-title" id="myModalLabel">Mode is :{{mode}}</h4></div><div class="modal-body">' +
            '<div class="createnode" ng-show="mode==\'create\'">Create</div>' +
            '<div class="editnode" ng-show="mode==\'edit\'">Edit</div>' +
            '<div class="detailnode" ng-show="mode==\'detail\'">Detail</div>' +
            '<div class="deletenode" ng-show="mode==\'delete\'">Delete</div>'+
        '</div><div class="modal-footer" > <button type="button" class="btn btn-default" data-dismiss="modal" ng-hide="mode==\'detail\'">Cancel</button>  <button type="button" class="btn btn-primary" ng-click="modalCreateItem()" ng-show="mode==\'create\'">Create</button> <button type="button" class="btn btn-primary" ng-click="modalSaveItem()" ng-show="mode==\'edit\'">Save changes</button> <button type="button" class="btn btn-danger" ng-click="modalDeleteItem()" ng-show="mode==\'delete\'">Delete</button> </div></div>',
        link: function (scope, element, attrs, ctrl, transclude) {
            var childscope = scope.$new();
            //var childscope = scope;

            childscope.selecteditem = {};
            var createNode = element.find("div.createnode");
            var editNode = element.find("div.editnode");
            var detailNode = element.find("div.detailnode");
            var deleteNode = element.find("div.deletenode");

            transclude(childscope, function (clone) {
                angular.forEach(clone, function (elem) {
                    if (angular.element(elem).hasClass('create-template')) {
                        var createTemplate = elem.innerHTML;
                        createNode.append(createTemplate);
                    }
                    if (angular.element(elem).hasClass('edit-template')) {
                        var editTemplate = elem.innerHTML;
                        editNode.append(editTemplate);
                    }
                    if (angular.element(elem).hasClass('detail-template')) {
                        var detailTemplate = elem.innerHTML;
                        detailNode.append(detailTemplate);
                    }
                    if (angular.element(elem).hasClass('delete-template')) {
                        var deleteTemplate = elem.innerHTML;
                        deleteNode.append(deleteTemplate);
                    }
                }); 
            });

                    var saveClickedName = "";
            var detailClickedName = "";
            var createClickedName = "";
            var deleteClickedName = "";
            attrs.$observe("saveClicked", function (value) {saveClickedName = value;});
            attrs.$observe("detailClicked", function (value) {detailClickedName = value;});
            attrs.$observe("createClicked", function (value) {createClickedName = value;});
            attrs.$observe("deleteClicked", function (value) {deleteClickedName = value;});

            attrs.$observe('selecteditem', function (value) {
                scope.$watch(value, function (newValue) {
                    childscope.selecteditem = newValue;
                    childscope.item = childscope.selecteditem;
                });
            });

            attrs.$observe('calldetail', function (value) {
                scope.$watch(value, function (newValue) {
                    if (newValue == true) {
                        scope[value] = false;
                        if (childscope.selecteditem) {
                            childscope.item = childscope.selecteditem;
                            childscope.mode = "detail";
                            $('.modal', element).modal('show');
                            if (scope[detailClickedName]) { scope[detailClickedName](childscope.item); }
                        }}});});

            attrs.$observe('calledit', function (value) {
                scope.$watch(value, function(newValue) {
                    if (newValue == true) {
                        scope[value] = false;
                        if (childscope.selecteditem) {
                            childscope.originalitem = childscope.selecteditem;
                            childscope.item = angular.copy(childscope.selecteditem);
                            childscope.mode = "edit";
                            $('.modal', element).modal('show');
                        }}});});
            childscope.modalSaveItem = function() {
                angular.copy(childscope.item, childscope.originalitem);
                if (scope[saveClickedName]) {scope[saveClickedName](childscope.item);}
                $('.modal', element).modal('hide');
            };
            
            attrs.$observe('callcreate', function(value) {
                scope.$watch(value, function (newval) {
                    if (newval == true) {
                        scope[value] = false;
                        if (childscope.selecteditem) {
                            childscope.originalitem = childscope.selecteditem;
                            childscope.item = angular.copy(childscope.selecteditem);
                            childscope.mode = "create";
                            $('.modal', element).modal('show');
                        }
                    }
                });
            });
            childscope.modalCreateItem = function () {
                angular.copy(childscope.item, childscope.originalitem);
                if (scope[createClickedName]) {scope[createClickedName](childscope.item);}
                $('.modal', element).modal('hide');
            };

            attrs.$observe('calldelete', function(value) {
                scope.$watch(value, function (newval) {
                    if (newval == true) {
                        scope[value] = false;
                        if (childscope.selecteditem) {
                            childscope.item = childscope.selecteditem;
                            childscope.mode = "delete";
                            childscope.delete = true;
                            $('.modal', element).modal('show');
                        }}});
            });
            childscope.modalDeleteItem = function () {
                if (scope[deleteClickedName]) { scope[deleteClickedName](childscope.item); }
                $('.modal', element).modal('hide');
            };


            $compile(element.contents())(childscope);
        },
       // controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs) {}],
    };
}]);
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
//<input type="date" class="form-control datepicker" ng-model="currentItem.OrderDate" />
(function () {
    //---Jquery IU required---//
    angular.module('directives').directive('mmDatepicker', function () {
        return {
            restrict: 'C',
            require: 'ngModel',
            link: function (scope, element, attrs, ngModelCtrl) {

                $(function () {
                    $(element).datepicker({
                        dateFormat: 'yy/mm/dd',
                        format: "dd/mm/yyyy",
                        todayBtn: "linked",
                        onSelect: function (date) {
                            ngModelCtrl.$setViewValue(date);
                            scope.$apply();
                        }
                    });
                    
                    attrs.$observe('ngModel', function (value) {
                        scope.$watch(value, function (newValue,oldValue) { 
                            if (newValue) {
                                if (newValue.getMonth) {
                                    if (!oldValue) {
                                        $(element).datepicker("setDate", ngModelCtrl.$viewValue);
                                    } else {
                                        olddate = new Date(oldValue);
                                        if (olddate.getMonth && (newValue.toUTCString() != olddate.toUTCString())) {
                                            $(element).datepicker("setDate", ngModelCtrl.$viewValue);
                                        }
                                    }
                                } else {
                                    var dt = new Date(ngModelCtrl.$viewValue)
                                    if (dt.getMonth) {
                                        ngModelCtrl.$setViewValue(dt);//ngmodel will be changed and  $watch will trigirred
                                    }
                                }
                                
                            }
                        });
                    });
                });
            }
        };
    });
})();
//(function () {
//    angular.module('component').directive('dropZone', function () {
//        return function (scope, element, attrs) {
//            element.dropzone({
//                //url: "/upload",
//                maxFilesize: 100,
//                paramName: "uploadfile",
//                maxThumbnailFilesize: 5
//            });
//        }
//    });
//})();


(function() {
    'use strict';
    angular.module('directives').directive('fileDropzone', function () {
        return {
            restrict: 'A',
            scope: {
                files: '=',
                fileAdded: '&',
            },
            link: function(scope, element, attrs) {
                var checkSize, isTypeValid, processDragOverOrEnter, validMimeTypes;
                processDragOverOrEnter = function(event) {
                    if (event != null) {
                        event.preventDefault();
                    }
                    event.originalEvent.dataTransfer.dropEffect = 'copy';
                    return false;
                };
                validMimeTypes = attrs.fileDropzone;
                checkSize = function(size) {
                    var _ref;
                    if (((_ref = attrs.maxFileSize) === (void 0) || _ref === '') || (size / 1024) / 1024 < attrs.maxFileSize) {
                        return true;
                    } else {
                        alert("File must be smaller than " + attrs.maxFileSize + " MB");
                        return false;
                    }
                };
                isTypeValid = function(type) {
                    if ((validMimeTypes === (void 0) || validMimeTypes === '') || validMimeTypes.indexOf(type) > -1) {
                        return true;
                    } else {
                        alert("Invalid file type.  File must be one of following types " + validMimeTypes);
                        return false;
                    }
                };
                $(element).attr('draggable', 'true');
                $(element).bind('dragover', processDragOverOrEnter);
                $(element).bind('dragenter', processDragOverOrEnter);
                return element.bind('drop', function(event) {

                    if (event != null) {
                        event.preventDefault();
                    }

                    for (var i = 0; i < event.originalEvent.dataTransfer.files.length; i++) {

                        (function(fileinput) {

                            var file, name, reader, size, type;
                            reader = new FileReader();
                            reader.onload = function(evt, reader) {
                                if (checkSize(size) && isTypeValid(type)) {
                                    return scope.$apply(function() {
                                        var currentfile = { file: evt.target.result, fileName: file.name, type: file.type, size: file.size }
                                        if (scope.fileAdded()) {
                                            var fileAddedHandler = scope.fileAdded(); fileAddedHandler(currentfile);
                                        };
                                        if (scope.files && scope.files.push) {
                                            scope.files.push(currentfile);
                                        }
                                    });
                                }
                            };

                            file = fileinput;
                            name = file.name;
                            type = file.type;
                            size = file.size;
                            reader.readAsDataURL(file);
                        })(event.originalEvent.dataTransfer.files[i]);


                    }
                    return false;
                });
            }
        };
    });

}).call(this);


//<input class="form-control" type="file" data-fileread="currentItem.Base64Picture" name="file" id="file" />
(function () {
    angular.module('directives').directive('mmFileRead', function () {
        return {

            restrict: 'C',
            require: 'ngModel',
            link: function (scope, element, attributes, ngModelCtrl) {
                element.bind("change", function (changeEvent) {
                    var reader = new FileReader();
                    reader.onload = function (loadEvent) {
                        ngModelCtrl.$setViewValue(loadEvent.target.result);
                        scope.$apply();
                    };
                    reader.readAsDataURL(changeEvent.target.files[0]);
                });
            }
        };
    });
})();



(function () {
    angular.module('directives').directive('mmFileUpload', function () {
        return {
            restrict: 'C',
            scope: {
                progress: '=',
                uploadfiles: '=',
                iscompleted: "=",
                completed: '&',
            },
            //require: 'ngModel',
            link: function (scope, element, attributes, ngModelCtrl) {
                element.append('<input type="button" value="Upload"/>');

                element.bind("change", function (changeEvent) {
                    scope.$apply(function (scope) {
                        console.log('files:', element.files);
                        scope.files = []
                        for (var i = 0; i < changeEvent.target.files.length; i++) {
                            scope.files.push(changeEvent.target.files[i])
                        }
                        scope.progressVisible = false
                        scope.uploadFile();
                    });
                });

                scope.uploadFile = function () {
                    var fd = new FormData()
                    for (var i in scope.files) {
                        fd.append("uploadedFile", scope.files[i])
                    }
                    var xhr = new XMLHttpRequest()
                    xhr.upload.addEventListener("progress", uploadProgress, false)
                    xhr.addEventListener("load", uploadComplete, false)
                    xhr.addEventListener("error", uploadFailed, false)
                    xhr.addEventListener("abort", uploadCanceled, false)
                    xhr.open("POST", "/Api/Upload")
                    scope.progressVisible = true
                    xhr.send(fd)
                }

                function uploadProgress(evt) {
                    scope.$apply(function () {
                        if (evt.lengthComputable) {
                            scope.progress = Math.round(evt.loaded * 100 / evt.total)
                        } else {
                            scope.progress = 'unable to compute'
                        }
                    })
                }
                function uploadComplete(evt) {
                    //alert(evt.target.responseText)
                    scope.$apply(function () {
                        scope.iscompleted = true;
                    });

                    if (scope.completed()) {
                        var completedHandler = scope.completed();
                        completedHandler(evt);
                    };

                }

                function uploadFailed(evt) {
                    alert("There was an error attempting to upload the file.")
                }

                function uploadCanceled(evt) {
                    scope.$apply(function () {
                        scope.progressVisible = false
                    })
                    alert("The upload has been canceled by the user or the browser dropped the connection.")
                }
            }
        };
    });


    angular.module('directives').directive('mmFileUploader', function () {
        return {
            template: '<div class="panel"><div class="panel-heading"><span class="panel-title">Uploads</span>' +
            '<div class="panel-heading-controls" style="width: 30%"><div ng-show="processing" class="progress progress-striped active" style="width: 100%">' +
                    '<div class="progress-bar progress-bar-danger" ng-style="percentageStyle"></div></div></div></div>' +
            '<div ng-show="errorMessage" class="alert alert-page alert-danger alert-dark"><button type="button" class="close" id="hideerroralert">×</button>' +
           '<strong>Error</strong> {{errorMessage}}' +
        '</div>' +
        '<div ng-show="iscompletedinternal" class="alert alert-page alert-success alert-dark"><button type="button" class="close" id="hidecompletealert">×</button>' +
         '<strong>Success</strong> Files are successfully uploaded.' +

        '</div>' +
        '<div class="panel-body">' +
            '<div class="row">' +
                '<input type="file"  ng-model-instant id="files" name="files" class="form-control" progress="progress" />' +
                '{{progress}}' +
                '<table class="table"><tr ><th>Name</th><th>size</th><th>Type</th></tr></thead><tbody><tr data-ng-repeat="file in files"><td>{{file.name}}</td><td>{{file.size}}</td><td>{{file.type}}</td></tr></tbody></table>' +
                '<input type="button" id="btnupload" value="Upload" class="btn btn-primary" />' +

                 '</div></div></div>',


            restrict: 'C',
            scope: {
                progress: '=',
                uploadfiles: '=',
                iscompleted: "=",
                filesuploaded: '&',
                uploadedfiles: '=',
                multiple: '@',
                uploadlocation:'@'
            },
            //require: 'ngModel',
            link: function (scope, element, attributes, ngModelCtrl) {
                scope.processing = false;
                var serverlocation = "/Api/Upload";
                if (scope.uploadlocation) {
                    serverlocation = scope.uploadlocation;
                }
                scope.hidecompletealert = function () {
                    scope.$apply(function () {
                        scope.errorMessage = null;
                    });
                }

                scope.hidecompletealert = function () {
                    scope.$apply(function () {

                    });
                }

                scope.iscompletedinternal = false;

                scope.percentageStyle = {
                    width: 0 + '%'
                };


                var files = element.find("#files");
                var uploadButton = element.find("#btnupload");
                var completeButton = element.find("#hidecompletealert");
                var errorButton = element.find("#hideerroralert");
                completeButton.bind("click", function (changeEvent) {
                    scope.$apply(function (scope) {
                        scope.iscompletedinternal = null;
                    });
                });

                errorButton.bind("click", function (changeEvent) {
                    scope.$apply(function (scope) {
                        scope.errorMessage = null;
                    });
                });
                if (scope.multiple == "true") {
                    files.attr("multiple", "multiple");
                }
                files.bind("change", function (changeEvent) {
                    scope.$apply(function (scope) {
                        console.log('files:', element.files);
                        scope.files = []
                        for (var i = 0; i < changeEvent.target.files.length; i++) {
                            scope.files.push(changeEvent.target.files[i])
                        }
                        scope.progressVisible = false

                    });
                });

                uploadButton.bind("click", function (changeEvent) {
                    scope.processing = true;
                    var fd = new FormData()
                    for (var i in scope.files) {
                        fd.append("uploadedFile", scope.files[i])
                    }
                    var xhr = new XMLHttpRequest()
                    xhr.upload.addEventListener("progress", uploadProgress, false)
                    xhr.addEventListener("load", uploadComplete, false)
                    xhr.addEventListener("error", uploadFailed, false)
                    xhr.addEventListener("abort", uploadCanceled, false)
                    xhr.open("POST", serverlocation)
                    scope.progressVisible = true
                    xhr.send(fd)
                });

                function uploadProgress(evt) {
                    scope.$apply(function () {
                        if (evt.lengthComputable) {
                            scope.percentageStyle = {
                                width: Math.round(evt.loaded * 100 / evt.total) + '%'
                            };
                            if (scope.progress) {
                                scope.progress = Math.round(evt.loaded * 100 / evt.total)
                            }
                        } else {
                            scope.progress = 'unable to compute'
                        }
                    })
                }

                function uploadComplete(evt) {
                    scope.processing = false;
                    if (evt.target.status == 404) {
                        scope.$apply(function () {
                            scope.errorMessage = "File is too big or format is not OK to upload (like exe files)";
                        });
                    } else if (evt.target.status == 500) {
                        scope.$apply(function () {
                            scope.errorMessage = "Internal Server Error ";
                        });
                    } else if (evt.target.status == 200) {
                        var response = evt.target.response;
                        var result
                        try {
                            if (JSON.parse(response)) {
                                result = JSON.parse(response);
                                if (scope.multiple != "true") {
                                    if (result[0]) {
                                        result = result[0];
                                    }
                                }
                                result = result;
                            }
                        } catch (exception) {
                            result = evt;
                        }
                        //alert(evt.target.responseText)

                        scope.$apply(function () {
                            if (scope.iscompleted) {
                                scope.iscompleted = true;
                            }
                            if (scope.uploadedfiles) {
                                scope.uploadedfiles = result;
                            }
                            scope.iscompletedinternal = true;
                        });
                        scope.$apply(function () {
                            if (scope.filesuploaded()) {
                                var filesuploadedHandler = scope.filesuploaded();
                                filesuploadedHandler(result);
                            };
                        });

                    }
                }
                function uploadFailed(evt) {
                    scope.processing = false;
                    scope.errorMessage = "There was an error attempting to upload the file.";
                }
                function uploadCanceled(evt) {
                    scope.processing = false;
                    scope.$apply(function () {
                        scope.progressVisible = false
                        scope.errorMessage = "The upload has been canceled by the user or the browser dropped the connection.";
                    })
                }
            }
        }
    });
})();


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
angular.module('directives').value("htmlconfig", {}).directive("mmHtml", ['$compile', function ($scompile) {
    return{
        restrict: 'ACM',
      
        link: function(scope, elem, attrs, ngModelCtrl) {
            var $elem = $(elem);
            attrs.$observe('mmHtml', function (value) {
                scope.$watch(value, function (newValue) {
                    if (newValue) {
                        $elem.empty();
                        $elem.append(newValue);
                    }
                });
            });

        }
    }
    }
]);
//<div class="http-get" address="'/Api/Categoryjson'" results="categories"></div>
(function () {
    
    angular.module('directives').directive('mmHttpGet', ["$http", function ($http) {
        return {
            restrict: 'C',
            require: 'ngModel',
            //scope: {
            //    address: "@",
            //    results: "=",
            //},
            link: function (scope, element, attrs, ngModelCtrl) {
                if (!attrs.address) return;
                $http.get(attrs.address, { cache: true }).then(
                  function (results) {
                      ngModelCtrl.$setViewValue(results.data);
                  });
            }
        }
    }]);
})();

/*
 * @class Limiter
 */
angular.module('directives').directive('maxlength', [function () {
    return {
        //require: 'ngModel',
        //  replace: true,
    //transclude: true,
    //template: '<div class="input-group"><div ng-transclude></div></div>',
        link: function (scope, element, attrs, ngModelCtrl) {
           
    var wrapper = angular.element('<div class="input-group"><span class="input-group-addon"></span></div>');

        element.after(wrapper);
        wrapper.prepend(element);




var span = wrapper.find('span.input-group-addon');

        scope.$on("$destroy", function() {
          wrapper.after(element);
          wrapper.remove();
        });

            var $element = $(element);
            var isTextarea = $element.is('textarea');
            var limit = null;
            var mmCounterPropertyName = null;
            attrs.$observe('mmCounter', function(value) {
                mmCounterPropertyName = value;
                scope.$watch(value, function(newVal, oldVal) {
                })
            });

            attrs.$observe('maxlength', function (value) {
                scope.$watch(value, function (newvalue) {
                    if (newvalue) {
                        limit = newvalue;
                        limiter(newvalue);
                        if (scope && mmCounterPropertyName) {
                            scope[mmCounterPropertyName] = limit;
                        }
                         if(span && span.text) {
                            span.text( limit);
                        }
                    }
                });
            });
            var ison=true;
                attrs.$observe('ngModel', function (value) {
                scope.$watch(value, function (newvalue) {
                    if (newvalue) {



                        var chars_count, input_value;
                input_value = isTextarea ? $element[0].value.replace(/\r?\n/g, "\n") : $element.val();
                chars_count = input_value.length;
                if (chars_count > limit) {
                    $element.val(input_value.substr(0, limit));
                    chars_count = limit;
                }
                 console.log(limit - chars_count);
                if (scope && mmCounterPropertyName && scope[mmCounterPropertyName]!=null) {
                    scope[mmCounterPropertyName] = limit - chars_count;
                }
                if(span && span.text){
                    span.text( limit - chars_count);
                }


                       if(ison && (!isTextarea)){
                        $element.off("keyup focus", $.proxy(updateCounter, this));
                        ison=false;
                        }
                    }
                });
            });
            var updateCounter = function () {
                var chars_count, input_value;
                input_value = isTextarea ? $element[0].value.replace(/\r?\n/g, "\n") : $element.val();
                chars_count = input_value.length;
                if (chars_count > limit) {
                    $element.val(input_value.substr(0, limit));
                    chars_count = limit;
                }
                 console.log(limit - chars_count);
                if (scope && mmCounterPropertyName && scope[mmCounterPropertyName]!=null) {
                    scope.$apply(function() {
                        scope[mmCounterPropertyName] = limit - chars_count;
                    });
                }
                if(span && span.text){
                    span.text( limit - chars_count);
                }
            };

            var limiter = function (limit, options) {
                if (options == null) {
                    options = {};
                }
               
                $element.on("keyup focus", $.proxy(updateCounter, this));
            };

        }
    }
}]);

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
                selecteditemPropertyName = value;
                scope.$watch(value, function (newvalue,oldValue) {
                    if (newvalue) {
                        if (newvalue !== childscope.mmlistselecteditem) {
                            childscope.mmlistselecteditem = newvalue;
                        }
                    }// else if (selecteditemPropertyName) { scope[selecteditemPropertyName] = {}; }
                    else if (ngModelSet) { ngModelSet(scope, item); }
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
//moved in to storage Service file
//<mm-treeview itemssource="assemb" selected-id="selectidid" nullvalue="'749'" selectedtext="selectedText" idfield="ComponentID" textfield="ComponentName" parentfield="ProductAssemblyID"></mm-treeview>
(function () {
    //---Jquery IU required---//
    angular.module('directives').directive('mmMap', function () {
        return {
            restrict: 'A',
            scope: {
                itemssource: '=',
                latitudefield: '@',
                longitudefield: '@',
                center: '=',
                isgeojson: '@',
                itemselected: "&",
                selecteditem: '=',
                rerender:'=',
            },
            link: function (scope, element, attrs) {

                //var mapOptions = {
                //    center: new google.maps.LatLng(-34.397, 150.644),
                //    zoom: 8
                //};
                //var map = new google.maps.Map(element[0],
                //    mapOptions);


                if (!window.google) {
                    return;
                }
                var geocoder = new window.google.maps.Geocoder();
                var myOptions = { zoom: 2, center: new window.google.maps.LatLng(12.24, 24.54), mapTypeId: 'terrain' };
                var map = new window.google.maps.Map($(element)[0], myOptions);

                try {
                    map.clearOverlays();
                } catch (err) {
                }
                var draggable = true;
                if (attrs.draggable == "false") {
                    draggable = false
                }

                scope.$watch("rerender", function (newvalue) {
                    if (newvalue && newvalue == true) {
                        window.google.maps.event.trigger(map, 'resize');
                        map.setZoom(map.getZoom());
                        scope.rerender = false;
                    }
                });

                var AddValueToLocation = function (value, map, scope) {
                    var Latitude = null; scope.latitudefield ? Latitude = value[scope.latitudefield] : value.Latitude;
                    var Longitude = null; scope.longitudefield ? Longitude = value[scope.longitudefield] : value.LatitudeLongitude;
                    var position = new window.google.maps.LatLng(Latitude, Longitude);

                    var marker = new window.google.maps.Marker({
                        map: map,
                        draggable: draggable,
                        position: position,
                        title: name
                    });
                    //value.Longitude.subscribe(function (val) {
                    //    var lat = value.Latitude();
                    //    var lng = value.Longitude();
                    //    var newLatLng = new google.maps.LatLng(lat, lng);
                    //    marker.setPosition(newLatLng);
                    //});

                    value._mapMarker = marker;
                    if (!scope.markersArray) { scope.markersArray = []; }
                    scope.markersArray[value.ID] = value;

                    window.google.maps.event.addListener(marker, 'position_changed',
                        function () {
                            scope.latitudefield ? value[scope.latitudefield] = marker.position.lat() : value.Latitude = marker.position.lat();
                            scope.longitudefield ? value[scope.longitudefield] = marker.position.lng() : value.LatitudeLongitude = marker.position.lng();

                        });

                    if (scope.itemselected || scope.selecteditem) {
                        window.google.maps.event.addListener(marker, 'click',
                           function () {
                               if (scope.selecteditem) {
                                   scope.selecteditem = value;
                               }

                               scope.$apply(function () {
                                   scope.selecteditem = value;
                               });

                               if (scope.itemselected) {
                                   var itemselectedHandler = scope.itemselected();
                                   if (itemselectedHandler) {
                                       itemselectedHandler(value);
                                   }
                               }

                           });
                    }
                };



                scope.$watch("itemssource", function (newValue) {
                    if (scope.itemssource) {

                        try {
                            map.clearOverlays();
                        } catch (err) {
                        }


                        $.each(scope.itemssource, function (index, value) {
                            AddValueToLocation(value, map, scope);
                        });
                    }

                });





                //var mapdetail = new google.maps.Map($('#mapDetail_canvas')[0], myOptions);
                //allBindingsAccessor().GoogleMap.clearOverlays();
                //AddValueToLocation(allBindingsAccessor().map, allBindingsAccessor().GoogleMap);
                // var position = new google.maps.LatLng(allBindingsAccessor().latitude(), allBindingsAccessor().longitude());
                // var marker = new google.maps.Marker({
                //     map: allBindingsAccessor().map,
                //     draggable: true,
                //     position: position,
                //     title: name
                // });

                // value._mapMarker = marker;
                //// markersArray.push(value);
                // markersArray[value.ID()] = value;
                // google.maps.event.addListener(marker, 'position_changed',
                //     function () {
                //         viewModel.Latitude(marker.position.lat());
                //         viewModel.Longitude(marker.position.lng());
                //     });



            },
            controller: function ($scope, $element, $attrs) {

            },
        }
    });


    angular.module('directives').directive('mmMapCollection', function () {
        return {
            restrict: 'E',
            scope: {
            },
            link: function (scope, element, attrs) {



            },
            controller: function ($scope, $element, $attrs) {

            },
        }
    });

    if (window.google && window.google.maps) {
        window.google.maps.Map.prototype.clearOverlays = function () {
            if (markersArray) {
                //for (var i = 0; i < markersArray.length; i++) {
                //    markersArray[i]._mapMarker.setMap(null);
                //    markersArray[i]._mapMarker=null;

                //}
                for (var item in markersArray) {
                    markersArray[item]._mapMarker.setMap(null);
                    markersArray[item]._mapMarker = null;
                }
            }
            markersArray = [];
        }
    }


    //var GeoJSON = function (geojson, options) {

    //    var _geometryToGoogleMaps = function (geojsonGeometry, options, geojsonProperties) {

    //        var googleObj, opts = _copy(options);

    //        switch (geojsonGeometry.type) {
    //            case "Point":
    //                opts.position = new google.maps.LatLng(geojsonGeometry.coordinates[1], geojsonGeometry.coordinates[0]);
    //                googleObj = new google.maps.Marker(opts);
    //                if (geojsonProperties) {
    //                    googleObj.set("geojsonProperties", geojsonProperties);
    //                }
    //                break;

    //            case "MultiPoint":
    //                googleObj = [];
    //                for (var i = 0; i < geojsonGeometry.coordinates.length; i++) {
    //                    opts.position = new google.maps.LatLng(geojsonGeometry.coordinates[i][1], geojsonGeometry.coordinates[i][0]);
    //                    googleObj.push(new google.maps.Marker(opts));
    //                }
    //                if (geojsonProperties) {
    //                    for (var k = 0; k < googleObj.length; k++) {
    //                        googleObj[k].set("geojsonProperties", geojsonProperties);
    //                    }
    //                }
    //                break;

    //            case "LineString":
    //                var path = [];
    //                for (var i = 0; i < geojsonGeometry.coordinates.length; i++) {
    //                    var coord = geojsonGeometry.coordinates[i];
    //                    var ll = new google.maps.LatLng(coord[1], coord[0]);
    //                    path.push(ll);
    //                }
    //                opts.path = path;
    //                googleObj = new google.maps.Polyline(opts);
    //                if (geojsonProperties) {
    //                    googleObj.set("geojsonProperties", geojsonProperties);
    //                }
    //                break;

    //            case "MultiLineString":
    //                googleObj = [];
    //                for (var i = 0; i < geojsonGeometry.coordinates.length; i++) {
    //                    var path = [];
    //                    for (var j = 0; j < geojsonGeometry.coordinates[i].length; j++) {
    //                        var coord = geojsonGeometry.coordinates[i][j];
    //                        var ll = new google.maps.LatLng(coord[1], coord[0]);
    //                        path.push(ll);
    //                    }
    //                    opts.path = path;
    //                    googleObj.push(new google.maps.Polyline(opts));
    //                }
    //                if (geojsonProperties) {
    //                    for (var k = 0; k < googleObj.length; k++) {
    //                        googleObj[k].set("geojsonProperties", geojsonProperties);
    //                    }
    //                }
    //                break;

    //            case "Polygon":
    //                var paths = [];
    //                var exteriorDirection;
    //                var interiorDirection;
    //                for (var i = 0; i < geojsonGeometry.coordinates.length; i++) {
    //                    var path = [];
    //                    for (var j = 0; j < geojsonGeometry.coordinates[i].length; j++) {
    //                        var ll = new google.maps.LatLng(geojsonGeometry.coordinates[i][j][1], geojsonGeometry.coordinates[i][j][0]);
    //                        path.push(ll);
    //                    }
    //                    if (!i) {
    //                        exteriorDirection = _ccw(path);
    //                        paths.push(path);
    //                    } else if (i == 1) {
    //                        interiorDirection = _ccw(path);
    //                        if (exteriorDirection == interiorDirection) {
    //                            paths.push(path.reverse());
    //                        } else {
    //                            paths.push(path);
    //                        }
    //                    } else {
    //                        if (exteriorDirection == interiorDirection) {
    //                            paths.push(path.reverse());
    //                        } else {
    //                            paths.push(path);
    //                        }
    //                    }
    //                }
    //                opts.paths = paths;
    //                googleObj = new google.maps.Polygon(opts);
    //                if (geojsonProperties) {
    //                    googleObj.set("geojsonProperties", geojsonProperties);
    //                }
    //                break;

    //            case "MultiPolygon":
    //                googleObj = [];
    //                for (var i = 0; i < geojsonGeometry.coordinates.length; i++) {
    //                    var paths = [];
    //                    var exteriorDirection;
    //                    var interiorDirection;
    //                    for (var j = 0; j < geojsonGeometry.coordinates[i].length; j++) {
    //                        var path = [];
    //                        for (var k = 0; k < geojsonGeometry.coordinates[i][j].length; k++) {
    //                            var ll = new google.maps.LatLng(geojsonGeometry.coordinates[i][j][k][1], geojsonGeometry.coordinates[i][j][k][0]);
    //                            path.push(ll);
    //                        }
    //                        if (!j) {
    //                            exteriorDirection = _ccw(path);
    //                            paths.push(path);
    //                        } else if (j == 1) {
    //                            interiorDirection = _ccw(path);
    //                            if (exteriorDirection == interiorDirection) {
    //                                paths.push(path.reverse());
    //                            } else {
    //                                paths.push(path);
    //                            }
    //                        } else {
    //                            if (exteriorDirection == interiorDirection) {
    //                                paths.push(path.reverse());
    //                            } else {
    //                                paths.push(path);
    //                            }
    //                        }
    //                    }
    //                    opts.paths = paths;
    //                    googleObj.push(new google.maps.Polygon(opts));
    //                }
    //                if (geojsonProperties) {
    //                    for (var k = 0; k < googleObj.length; k++) {
    //                        googleObj[k].set("geojsonProperties", geojsonProperties);
    //                    }
    //                }
    //                break;

    //            case "GeometryCollection":
    //                googleObj = [];
    //                if (!geojsonGeometry.geometries) {
    //                    googleObj = _error("Invalid GeoJSON object: GeometryCollection object missing \"geometries\" member.");
    //                } else {
    //                    for (var i = 0; i < geojsonGeometry.geometries.length; i++) {
    //                        googleObj.push(_geometryToGoogleMaps(geojsonGeometry.geometries[i], opts, geojsonProperties || null));
    //                    }
    //                }
    //                break;

    //            default:
    //                googleObj = _error("Invalid GeoJSON object: Geometry object must be one of \"Point\", \"LineString\", \"Polygon\" or \"MultiPolygon\".");
    //        }

    //        return googleObj;

    //    };

    //    var _error = function (message) {

    //        return {
    //            type: "Error",
    //            message: message
    //        };

    //    };

    //    var _ccw = function (path) {
    //        var isCCW;
    //        var a = 0;
    //        for (var i = 0; i < path.length - 2; i++) {
    //            a += ((path[i + 1].lat() - path[i].lat()) * (path[i + 2].lng() - path[i].lng()) - (path[i + 2].lat() - path[i].lat()) * (path[i + 1].lng() - path[i].lng()));
    //        }
    //        if (a > 0) {
    //            isCCW = true;
    //        }
    //        else {
    //            isCCW = false;
    //        }
    //        return isCCW;
    //    };

    //    var _copy = function (obj) {
    //        var newObj = {};
    //        for (var i in obj) {
    //            if (obj.hasOwnProperty(i)) {
    //                newObj[i] = obj[i];
    //            }
    //        }
    //        return newObj;
    //    };

    //    var obj;

    //    var opts = options || {};

    //    switch (geojson.type) {

    //        case "FeatureCollection":
    //            if (!geojson.features) {
    //                obj = _error("Invalid GeoJSON object: FeatureCollection object missing \"features\" member.");
    //            } else {
    //                obj = [];
    //                for (var i = 0; i < geojson.features.length; i++) {
    //                    obj.push(_geometryToGoogleMaps(geojson.features[i].geometry, opts, geojson.features[i].properties));
    //                }
    //            }
    //            break;

    //        case "GeometryCollection":
    //            if (!geojson.geometries) {
    //                obj = _error("Invalid GeoJSON object: GeometryCollection object missing \"geometries\" member.");
    //            } else {
    //                obj = [];
    //                for (var i = 0; i < geojson.geometries.length; i++) {
    //                    obj.push(_geometryToGoogleMaps(geojson.geometries[i], opts));
    //                }
    //            }
    //            break;

    //        case "Feature":
    //            if (!(geojson.properties && geojson.geometry)) {
    //                obj = _error("Invalid GeoJSON object: Feature object missing \"properties\" or \"geometry\" member.");
    //            } else {
    //                obj = _geometryToGoogleMaps(geojson.geometry, opts, geojson.properties);
    //            }
    //            break;

    //        case "Point": case "MultiPoint": case "LineString": case "MultiLineString": case "Polygon": case "MultiPolygon":
    //            obj = geojson.coordinates
    //                ? obj = _geometryToGoogleMaps(geojson, opts)
    //                : _error("Invalid GeoJSON object: Geometry object missing \"coordinates\" member.");
    //            break;

    //        default:
    //            obj = _error("Invalid GeoJSON object: GeoJSON object must be one of \"Point\", \"LineString\", \"Polygon\", \"MultiPolygon\", \"Feature\", \"FeatureCollection\" or \"GeometryCollection\".");

    //    }

    //    return obj;

    //};

})();
angular.module('directives')
    .constant('mmMaskConfig', {}).directive("mmMask", [
        "$http", "$compile", "mmMaskConfig", function($http, $compile, mmMaskConfig) {
            return {
                restrict: 'ACM',
                require: 'ngModel',
                transclude: true,
                link: function (scope, element, attrs, ctrl, transclude) {
                    // $("#masked-inputs-examples-date").mask("99/99/9999");
                    var mask = attrs.mmMask;

                   // var res = scope.$eval(attrs.mmMask);
                   // alert(res);

                    $(element).mask(mask);
                }
            }
        }
    ]);
angular.module("directives")
    .value('mmRatingConfig', {
    stars_count: 5,
    rating: 0,
    class_active: 'active',
    lower_limit: 0.35,
    onRatingChange: function (value) { }
    })
    .directive('mmRating', ['mmRatingConfig', '$timeout', "$compile", function (mmRatingConfig, $timeout, $compile) {
    return {
            restrict: 'ACM',
            require: 'ngModel',
            template:'<ul class="widget-rating"></ul>',
            link: function(scope, elem, attrs, ngModelCtrl) {
                var $elem = $(elem);
                var isDisabled = false;
                var container = elem.find("ul.widget-rating");
                var  _i, _ref;
                if (options == null) {
                   var options = {};
                }
                var options = angular.extend({}, mmRatingConfig, options);
                for (i = _i = 0, _ref = options.stars_count; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                    container.append($compile('<li><a class="pointer" title="" class="widget-rating-item"></a></li>')(scope));
                }
                var setRating = function(value) {
                    options.rating = value;
                    if ((value - Math.floor(value)) > options.lower_limit) { value = Math.ceil(value); }else {value = Math.floor(value);}
                    ngModelCtrl.$setViewValue(value);
                    return container.find('li').removeClass(options.class_active).slice(0, value).addClass(options.class_active);
                };
               
                    $elem.find('a')
                        .on('mouseenter', function() {
                            if (!isDisabled) {
                                $elem.find('li').removeClass(options.class_active);
                                return $(this).parents('li').addClass(options.class_active).prevAll('li').addClass(options.class_active);
                            }
                        })
                        .on('mouseleave', function() {
                            if (!isDisabled) {
                                return setRating(options.rating);
                            }
                        })
                        .on('click', function() {
                        if (!isDisabled) {
                            var currentRating = $(this).parents('li').prevAll('li').length + 1;
                            options.onRatingChange.call(this, currentRating);
                            ngModelCtrl.$setViewValue(currentRating);
                            scope.$apply();
                            return false;
                        }
                    });
               
                setRating(options.rating);
                
                attrs.$observe('ngModel', function (value) { scope.$watch(value, function (newValue) { if (newValue) { setRating(newValue); } }); });
                attrs.$observe('disabled', function (value) {
                    scope.$watch(value,
                        function(newValue) {
                            if (newValue) {
                                isDisabled = true;
                                container.find('li a').removeClass("pointer").addClass("disabled");
                            }
                        });
                });
            }
        }
    }
]);

angular.module('directives').directive("mmScroll", [
    "$http", "$compile", function($http, $compile) {
        return {
            restrict: 'CA',
            link: function (scope, element, attrs, ctrl, transclude) {
                var height = 300;


                attrs.$observe('mmScroll', function (value) {
                    if (value) {
                        height = value;
                        $(element).css("height", function (index) {
                            return height;
                        });
                    }
                });


                attrs.$observe('height', function (value) {
                    if (value) {
                        height = value;
                        $(element).css("height", function(index) {
                            return height;
                        });}});

                $(element).css("height", function (index) {
                    return height;
                });
                $(element).css("overflow-y", "scroll");

                // overflow-y: scroll; /* has to be scroll, not auto */
                $(element).css(" -webkit-overflow-scrolling", "touch");
               
                // style = "overflow-y: scroll; height:400px;"
                //$(element).slimScroll({ height: 300, alwaysVisible: true, color: '#888', allowPageScroll: true });
            }
        }
    }
]);
/**
 * Enhanced Select2 Dropmenus
 *
 * @AJAX Mode - When in this mode, your value will be an object (or array of objects) of the data used by Select2
 *     This change is so that you do not have to do an additional query yourself on top of Select2's own query
 * @params [options] {object} The configuration options passed to $.fn.select2(). Refer to the documentation
 */
angular.module('directives').value('mmSelect2Config', {}).directive('mmSelect2', ['mmSelect2Config', '$timeout', function (mmSelect2Config, $timeout) {
    var options = {};
    if (mmSelect2Config) {
        angular.extend(options, mmSelect2Config);
    }
    return {
        require: 'ngModel',
        priority: 1,
        compile: function (tElm, tAttrs) {
            var watch,
              repeatOption,
              repeatAttr,
              isSelect = tElm.is('select'),
              isMultiple = angular.isDefined(tAttrs.multiple);
            // Enable watching of the options dataset if in use
            if (tElm.is('select')) {
                repeatOption = tElm.find('optgroup[ng-repeat], optgroup[data-ng-repeat], option[ng-repeat], option[data-ng-repeat]');
                if (repeatOption.length) {
                    repeatAttr = repeatOption.attr('ng-repeat') || repeatOption.attr('data-ng-repeat');
                    watch = jQuery.trim(repeatAttr.split('|')[0]).split(' ').pop();
                }
            }

            return function (scope, elm, attrs, controller) {
                // instance-specific options
                var opts = angular.extend({}, options, scope.$eval(attrs.mmSelect2));
                /*  Convert from Select2 view-model to Angular view-model.  */
                var convertToAngularModel = function (select2_data) {
                    var model;
                    if (opts.simple_tags) {
                        model = [];
                        angular.forEach(select2_data, function (value, index) {
                            model.push(value.id);
                        });
                    } else {
                        model = select2_data;
                    }
                    return model;
                };
                /* Convert from Angular view-model to Select2 view-model. */
                var convertToSelect2Model = function (angular_data) {
                    var model = [];
                    if (!angular_data) {
                        return model;
                    }

                    if (opts.simple_tags) {
                        model = [];
                        angular.forEach(
                          angular_data,
                          function (value, index) {
                              model.push({ 'id': value, 'text': value });
                          });
                    } else {
                        model = angular_data;
                    }
                    return model;
                };

                if (isSelect) {
                    // Use <select multiple> instead
                    delete opts.multiple;
                    delete opts.initSelection;
                } else if (isMultiple) {
                    opts.multiple = true;
                }

                if (controller) {
                    // Watch the model for programmatic changes
                    scope.$watch(tAttrs.ngModel, function (current, old) {
                        if (!current) {
                            return;
                        }
                        if (current === old) {
                            return;
                        }
                        controller.$render();
                    }, true);
                    controller.$render = function () {
                        if (isSelect) {
                            elm.select2('val', controller.$viewValue);
                        } else {
                            if (opts.multiple) {
                                controller.$isEmpty = function (value) {
                                    return !value || value.length === 0;
                                };
                                var viewValue = controller.$viewValue;
                                if (angular.isString(viewValue)) {
                                    viewValue = viewValue.split(',');
                                }
                                elm.select2('data', convertToSelect2Model(viewValue));
                                if (opts.sortable) {
                                    elm.select2("container").find("ul.select2-choices").sortable({
                                        containment: 'parent',
                                        start: function () {elm.select2("onSortStart");},
                                        update: function () {elm.select2("onSortEnd"); elm.trigger('change');}
                                    });
                                }
                            } else {
                                if (angular.isObject(controller.$viewValue)) {
                                    elm.select2('data', controller.$viewValue);
                                } else if (!controller.$viewValue) {
                                    elm.select2('data', null);
                                } else {
                                    elm.select2('val', controller.$viewValue);
                                }
                            }
                        }
                    };

                    // Watch the options dataset for changes
                    if (watch) {
                        scope.$watch(watch, function (newVal, oldVal, scope) {
                            if (angular.equals(newVal, oldVal)) {
                                return;
                            }
                            // Delayed so that the options have time to be rendered
                            $timeout(function () {
                                elm.select2('val', controller.$viewValue);
                                // Refresh angular to remove the superfluous option
                                controller.$render();
                                if (newVal && !oldVal && controller.$setPristine) {
                                    controller.$setPristine(true);
                                }
                            });
                        });
                    }

                    // Update valid and dirty statuses
                    controller.$parsers.push(function (value) {
                        var div = elm.prev();
                        div
                          .toggleClass('ng-invalid', !controller.$valid)
                          .toggleClass('ng-valid', controller.$valid)
                          .toggleClass('ng-invalid-required', !controller.$valid)
                          .toggleClass('ng-valid-required', controller.$valid)
                          .toggleClass('ng-dirty', controller.$dirty)
                          .toggleClass('ng-pristine', controller.$pristine);
                        return value;
                    });

                    if (!isSelect) {
                        // Set the view and model value and update the angular template manually for the ajax/multiple select2.
                        elm.bind("change", function (e) {
                           e.stopImmediatePropagation();

                            if (scope.$$phase || scope.$root.$$phase) {
                                return;
                            }
                            scope.$apply(function () {
                                controller.$setViewValue(
                                  convertToAngularModel(elm.select2('data')));
                            });
                        });

                        if (opts.initSelection) {
                            var initSelection = opts.initSelection;
                            opts.initSelection = function (element, callback) {
                                initSelection(element, function (value) {
                                    var isPristine = controller.$pristine;
                                    controller.$setViewValue(convertToAngularModel(value));
                                    callback(value);
                                    if (isPristine) {
                                        controller.$setPristine();
                                    }
                                    elm.prev().toggleClass('ng-pristine', controller.$pristine);
                                });
                            };
                        }
                    }
                }

                elm.bind("$destroy", function () {
                    elm.select2("destroy");
                });

                attrs.$observe('disabled', function (value) {
                    elm.select2('enable', !value);
                });

                attrs.$observe('readonly', function (value) {
                    elm.select2('readonly', !!value);
                });

                if (attrs.ngMultiple) {
                    scope.$watch(attrs.ngMultiple, function (newVal) {
                        attrs.$set('multiple', !!newVal);
                        elm.select2(opts);
                    });
                }

                // Initialize the plugin late so that the injected DOM does not disrupt the template compiler
                $timeout(function () {
                    elm.select2(opts);

                    // Set initial value - I'm not sure about this but it seems to need to be there
                    elm.select2('data', controller.$modelValue);
                    // important!
                    controller.$render();

                    // Not sure if I should just check for !isSelect OR if I should check for 'tags' key
                    if (!opts.initSelection && !isSelect) {
                        var isPristine = controller.$pristine;
                        controller.$pristine = false;
                        controller.$setViewValue(
                            convertToAngularModel(elm.select2('data'))
                        );
                        if (isPristine) {
                            controller.$setPristine();
                        }
                        elm.prev().toggleClass('ng-pristine', controller.$pristine);
                    }
                });
            };
        }
    };
}]);
//<selection-modal selecteditem="currentItem.SupplierID" itemssource="suppliers" columns="['CompanyName','ContactTitle','ContactName']" valuefield="'SupplierID'" textfield="'CompanyName'"></selection-modal>
(function () {
    //---Required Bootstrap 3---//
    angular.module('directives').directive("mmSelectionModal", ["$http", "$compile", function ($http, $compile) {
        return {
            restrict: "E",
            transclude: true,
            template: "<div class='modalcontainer'>" +
              "<input class='btn btn-default' type='button' value='...'  ng-click='buttonclicked()'/>"+
                "<div class='modal fade' id='myModal' tabindex='-1' role='dialog' aria-labelledby='myModalLabel' aria-hidden='true'>" +
    "<div class='modal-dialog modal-lg' style='max-height:100%' ><div class='modal-content'><div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</button>" +
                    "<h4 class='modal-title' id='myModalLabel'>{{title}}</h4></div><div class='modal-body'> <div class='filterhtml'></div> <div class='tablehtml'></div></div>" +
                "</div>",
            require: 'ngModel',
            scope: {
                itemssource: "=",
                itemTemplate: "=",
                columns: "=",
                valuefield: "@",
                textfield: "@",
                selecteditem: "=ngModel",
                message: "=",
                title:"@",
            },
            link: function (scope, element, attrs, ctrl, transclude) {
                var items = scope.itemssource;
                var q = scope.message;
                var filterhtml = $(".filter-template", element).html();
                if (!scope.filter) {scope.filter = {};}
                scope.$watch("filter.Name", function (newvalue) {
                    var data = newvalue;
                });
                transclude(scope, function(clone) {
                    angular.forEach(clone, function(elem) {
                        if (angular.element(elem).hasClass('filter-template')) {
                            filterhtml = "<div >" + elem.innerHTML + "</div>"
                        }
                    });
                });
                var tablehtml = function () {
                    scope.sort = "";
                    scope.descending = false;
                    scope.fieldnames = [];
                    scope.sortit = function (item) {
                        if (scope.sort == item) {
                            scope.descending = !scope.descending;
                        } else {
                            scope.descending = false;
                            scope.sort = item;
                        }
                    };
                    scope.linkclicked = function (item) {
                        if (item[scope.valuefield] != null) {scope.selecteditem = item[scope.valuefield]}
                        if (item[scope.textfield] != null) {var text = item[scope.textfield]}
                        $('.modal', element).modal('hide');
                    };
                    var rowtext = "";
                    var hash = window.location.hash
                    var tablehead = "";
                    for (var i = 0; i < scope.columns.length; i++) {
                        prop = scope.columns[i];
                        if (scope.sort == "") {scope.sort = prop;}
                        title = prop.replace("_", " ").split(/(?=[A-Z])/).join(" ");
                        rowtext += '<td><a href="" ng-click="linkclicked(item)"> <span style="font-size:14px" data-ng-bind="item.' + prop + '"></span></a> </td>';
                        tablehead += "<th><a ng-click='sortit(\"" + prop + "\")' >  <h4>" + title + "<h4/> <span ng-show='sort == \"" + prop + "\"' > <span ng-show='descending'> <i class='fa fa-caret-square-o-down'></i>  </span>  <span ng-hide='descending'> <i class='fa fa-caret-square-o-up'></i> </span>  </span>  </a> </th>"
                    }
                    var headertext = "<thead> <tr> " + tablehead + "</tr> </thead>"
                    var start = "<table class='table'>" + headertext + " <tbody> <tr data-ng-repeat='item in itemssource |orderBy:sort:descending |  filter:filter '>";
                    var full = start + rowtext + '  </tr> </tbody> </table>';
                    return full;
                }
                var modalFooter=""
                var filtercontainer = angular.element(element[0].getElementsByClassName("filterhtml")[0]);
                filtercontainer.append(filterhtml);
                var tablecontainer = angular.element(element[0].getElementsByClassName("tablehtml")[0]);
                tablecontainer.append(tablehtml());
                $compile(tablecontainer)(scope);
                $compile(filtercontainer)(scope);

                scope.buttonclicked = function () {$('.modal', element).modal('show');};
            },

            controller: function ($scope, $element, $attrs)
            {

            },
        };
    }]);
})();
//<selection-modal selecteditem="currentItem.SupplierID" itemssource="suppliers" columns="['CompanyName','ContactTitle','ContactName']" valuefield="'SupplierID'" textfield="'CompanyName'"></selection-modal>
(function () {
    //---Required Bootstrap 3---//
    angular.module('directives').directive("mmSelectionModalAjax", ["$http", "$compile", function ($http, $compile) {
        return {
            restrict: "E",
            scope: {
                itemTemplate: "=",
                columns: "=",
                valuefield: "=",
                textfield: "=",
                //filter: "=",
                selecteditem: "=",
                selectedText:"=",
                selectedId:"=",
                message: "=",
                url:"@",
            },
            link: function (scope, element, attrs) {

                var items = scope.itemssource;
                var q = scope.message;
                element.append('<div class="modalcontainer"></div>');
                var filterhtml = $(".filter-template", element).html();
                var modalcontainer = angular.element(element[0].getElementsByClassName("modalcontainer")[0]);
              

                var tablehtml = function () {
                    var rowtext = "";
                    var hash = window.location.hash
                    for (var i = 0; i < scope.columns; i++) {
                        prop = scope.columns[i];
                        if (scope.sort == "") {
                            scope.sort = prop;
                        }
                        scope.fieldnames.push({ 'fieldname': prop, 'title': prop.replace("_", " ").split(/(?=[A-Z])/).join(" ") });
                        rowtext += '<td><a href="" ng-click="linkclicked(item)"> <span style="font-size:14px" data-ng-bind="item.' + prop + '"></span></a> </td>';
                    }
                    var headertext = "<thead> <tr> <th ng-repeat='item in fieldnames'><a ng-click='sortit(item.fieldname)' > {{item.title}} <span ng-show='sort == item.fieldname' > <span ng-show='descending'> <i class='fa fa-caret-square-o-down'></i>  </span>  <span ng-hide='descending'> <i class='fa fa-caret-square-o-up'></i> </span>  </span>  </a> </th> </tr> </thead>";
                    var start = "<table class='table'>" + headertext + " <tbody> <tr data-ng-repeat='item in itemssource |orderBy:sort:descending |  filter:filter '>";
                   
                    var full = start + rowtext + '  </tr> </tbody> </table>';
                    return full;
                }
                //var select = "<select class='form-control' ng-model='selecteditem." + scope.valuefield + "' data-ng-options='c.Category_ID as c.Category_Name  for c in Categories'></select>";
                var triggerbutton = "<input class='btn btn-default' type='button' value='...'  ng-click='buttonclicked()'/>";
                var modalheader = "<div class='modal fade' id='myModal' tabindex='-1' role='dialog' aria-labelledby='myModalLabel' aria-hidden='true'>" +
                "<div class='modal-dialog' style='max-height:100%' ><div class='modal-content'><div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</button>" +
                "<h4 class='modal-title' id='myModalLabel'>Modal title</h4></div><div class='modal-body'>";
                modalheader += '<div ng-show="dataloading" class="progress progress-striped active"><div class="progress-bar"  role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" style="width: 100%"></div></div>';
                var modelFilterPanel = "<div class='row'>" + filterhtml + "</div> <div class='row'><input ng-click='searchclicked()' value='Search' class='btn btn-default' type='button' /></div>"
                var modalBody = "<div ng-bind-html-unsafe='template'> " + tablehtml() + "</div></div>";
                //var modalFooter = "<div class='modal-footer'><button type='button' class='btn btn-default' data-dismiss='modal'>Close</button><button type='button' class='btn btn-primary'>Save changes</button></div></div></div></div>";
                var modalFooter=""

                var fullmodal = triggerbutton + modalheader + modelFilterPanel + modalBody + modalFooter;
                modalcontainer.append(fullmodal);
                $compile(modalcontainer)(scope);


             
            },
            controller: ["$scope", "$element", "$attrs", function ($scope, $element, $attrs) {
               
                
                $scope.searchclicked = function () {
                    if ($scope.url && $scope.filter) {
                        $scope.dataloading = true;
                        $http.post($scope.url, $scope.filter)
                            .success(function (result) {
                                $scope.itemssource = result;
                                $scope.dataloading = false;
                            })
                            .error(function (data) {
                                $scope.dataloading = false;
                            })
                    }
                };
                $scope.sort = "";
                $scope.descending = false;
                $scope.fieldnames = [];
                $scope.sortit = function (item) {
                    if ($scope.sort == item) {
                        $scope.descending = !$scope.descending;
                    } else {
                        $scope.descending = false;
                        $scope.sort = item;
                    }
                };

                $scope.linkclicked = function (item) {
                    if (item[$scope.valuefield] != null) {
                        $scope.selecteditem = item[$scope.valuefield]
                    }
                    if (item[$scope.textfield] != null) {
                        var text = item[$scope.textfield]
                        if ($scope.selectedText) {
                            $scope.selectedText = item[$scope.textfield]
                        }
                    }
                    $('.modal', $element).modal('hide');
                };

                $scope.buttonclicked = function () {
                    $('.modal', $element).modal('show');
                };
            }]
        };
    }]);
})();
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
angular.module('directives')
    .constant('mmSwitcherConfig', {
        theme: null,
        on_state_content: 'ON',
        off_state_content: 'OFF'
    })
    .directive("mmSwitcher", [
        "$http", "$compile", "mmSwitcherConfig", function ($http, $compile, mmSwitcherConfig) {
            return {
                restrict: 'ACM',
                require: 'ngModel',
                transclude: true,
                link: function (scope, element, attrs, ctrl, transclude) {
                    var $el = $(element);
                    var box_class;
                    if (attrs.options == null) {
                        attrs.options = {};
                    } else {
                        attrs.options = scope.$eval(attrs.options) ? scope.$eval(attrs.options) : attrs.options;
                    }
                    if (attrs.theme) {
                        attrs.options.theme = attrs.theme ? attrs.theme : scope.$eval(attrs.theme);
                    }
                    var options = $.extend({}, mmSwitcherConfig, attrs.options);
                    var $checkbox = null;
                    var $box = null;
                    if ($el.is('input[type="checkbox"]')) {
                        box_class = $el.attr('data-class');
                        $checkbox = $el;
                        $box = $('<div class="switcher"><div class="switcher-toggler"></div><div class="switcher-inner"><div class="switcher-state-on">' + options.on_state_content + '</div><div class="switcher-state-off">' + options.off_state_content + '</div></div></div>');
                        if (options.theme) {
                            $box.addClass('switcher-theme-' + options.theme);
                        }
                        if (box_class) {
                            $box.addClass(box_class);
                        }
                        $box.insertAfter($checkbox).prepend($checkbox);
                    } else {
                        $box = $el;
                        $checkbox = $('input[type="checkbox"]', $box);
                    }
                    if ($checkbox.prop('disabled')) {
                        $box.addClass('disabled');
                    }
                    if ($checkbox.is(':checked')) {
                        $box.addClass('checked');
                    }
                    $checkbox.on('click', function (e) {
                        return e.stopPropagation();
                    });
                    $box.on('touchend click', (function (_this) {
                        return function (e) {
                            e.stopPropagation();
                            e.preventDefault();
                            return toggle(_this);
                        };
                    })(this));

                    var toggle = function (control) {
                        $checkbox.click();
                    };
                    var on = function () {
                        $checkbox[0].checked = true;
                        return $box.addClass('checked');
                    }
                    var off = function () {
                        $checkbox[0].checked = false;
                        return $box.removeClass('checked');
                    }

                    attrs.$observe('ngModel', function (value) {
                        scope.$watch(value, function (newValue) {
                            if (newValue) {
                                on();
                            } else {
                                off();
                            }
                        });
                    });
                }
            }
        }
    ]);
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
(function () {
    angular.module('directives').directive("mmTableSorter", ["$http", "$compile", function ($http, $compile) {
        return {
            //restrict: "E",
            //transclude: true,
            scope: {
                sort: "=",
                columns: "=",
                descending: "=",
            },
            link: function (scope, element, attrs) {
                var columns = scope.columns;
                var createtable = function () {
                    scope.sort = "";
                    scope.descending = false;
                    scope.fieldnames = [];
                    scope.sortit = function (item) {
                        if (scope.sort == item) {
                            scope.descending = !scope.descending;
                        } else {
                            scope.descending = false;
                            scope.sort = item;
                        }
                    };
                    for (var i = 0; i < columns.length; i++) {
                        prop = columns[i];
                        if (scope.sort == "") {
                            scope.sort = prop;
                        }
                        scope.fieldnames.push({ 'fieldname': prop, 'title': prop.replace("_", " ").split(/(?=[A-Z])/).join(" ") });
                    }
                    var headertext = "<thead class='tablecontainer'><tr> <th ng-repeat='item in fieldnames'><a ng-click='sortit(item.fieldname)' > {{item.title}} <span ng-show='sort == item.fieldname' > <span ng-show='descending'> <i class='fa fa-caret-square-o-down'></i>  </span>  <span ng-hide='descending'> <i class='fa fa-caret-square-o-up'></i> </span>  </span>  </a> </th> </tr></thead>";
                    var full = headertext;


                    $(element).append(headertext);
                    var tablecontainer = angular.element(element[0].getElementsByClassName("tablecontainer")[0]);
                    $compile(tablecontainer)(scope);
                };

                //if (columns != null) {
                //    scope.$watch("columns", function (newVal, oldVal) {
                //        tablecontainer.empty();
                //        columns = scope.columns;
                //        createtable();
                //    });
                //}
                createtable();
            },
            controller: function ($scope, $element, $attrs) {
                
            },
           
        };
    }]);
})();
/*
 * Properties : itemssource: Array
 */
(function () {
    angular.module("directives").directive("mmTimelineCol", ["$compile", function ($compile) {
        return {
            restrict: 'E',
            replace: true,
            template: '<ul class="timeline-2col"></ul>',
            transclude: true,
            link: function (scope, element, attrs, ctrl, transclude) {
                var itemssourcePropertyName = null
                var create = function () {
                    var template = "";
                    transclude(scope, function (clone) {
                        template = "";
                        angular.forEach(clone, function (elem) { if (elem.outerHTML) { template += elem.outerHTML; } });
                    });
                    if (template) {
                        var templatefull = '<li class="mytemplate" ng-class-even="\'timeline-inverted\'" ng-repeat="item in ' + itemssourcePropertyName + '">' +
                            '<div class="timeline-badge primary"><i ng-class-even="\'glyphicon glyphicon-record invert\'" ng-class-odd="\'glyphicon glyphicon-record\'"></i></div>' +
                            '<div>' + template + '</div> </li>   <li class="clearfix" style="float: none;"></li>';
                        element.append($compile(templatefull)(scope))
                    }
                }
                attrs.$observe('itemssource', function (value) {
                    itemssourcePropertyName = value;
                    create();
                });
            },
            controller: ["$scope", "$element", "$attrs", function ($scope, $element, $attrs) {}],
        }
    }]);

    angular.module("directives").directive("mmTimeline", ["$compile", function ($compile) {
        return {
            restrict: 'E',
            replace: true,
            template: '<ul class="timeline-v2"></ul>',
            transclude: true,
            link: function (scope, element, attrs, ctrl, transclude) {
                var itemssourcePropertyName = null
                var create = function () {
                    var template = "";
                    transclude(scope, function (clone) {
                        template = "";
                        angular.forEach(clone, function(elem) {if (elem.outerHTML) {template += elem.outerHTML;}});
                    });
                    if (template) {
                        var templatefull = '<li ng-repeat="item in ' + itemssourcePropertyName + '"> <i class="cbp_tmicon rounded-x hidden-xs"></i> <div>' + template + '</div></li>';
                        element.append($compile(templatefull)(scope))
                    }
                }
                attrs.$observe('itemssource', function (value) {
                    itemssourcePropertyName = value;
                    create();
                });
            },
            controller: ["$scope", "$element", "$attrs", function ($scope, $element, $attrs) {}],
        }
    }]);
})();
angular.module('directives')

.constant('timepickerConfig', {
    hourStep: 1,
    minuteStep: 1,
    showMeridian: true,
    meridians: null,
    readonlyInput: false,
    mousewheel: true
})

.controller('TimepickerController', ['$scope', '$attrs', '$parse', '$log', '$locale', 'timepickerConfig', function ($scope, $attrs, $parse, $log, $locale, timepickerConfig) {
    var selected = new Date(),
        ngModelCtrl = { $setViewValue: angular.noop }, // nullModelCtrl
        meridians = angular.isDefined($attrs.meridians) ? $scope.$parent.$eval($attrs.meridians) : timepickerConfig.meridians || $locale.DATETIME_FORMATS.AMPMS;

    this.init = function (ngModelCtrl_, inputs) {
        ngModelCtrl = ngModelCtrl_;
        ngModelCtrl.$render = this.render;

        var hoursInputEl = inputs.eq(0),
            minutesInputEl = inputs.eq(1);

        var mousewheel = angular.isDefined($attrs.mousewheel) ? $scope.$parent.$eval($attrs.mousewheel) : timepickerConfig.mousewheel;
        if (mousewheel) {
            this.setupMousewheelEvents(hoursInputEl, minutesInputEl);
        }

        $scope.readonlyInput = angular.isDefined($attrs.readonlyInput) ? $scope.$parent.$eval($attrs.readonlyInput) : timepickerConfig.readonlyInput;
        this.setupInputEvents(hoursInputEl, minutesInputEl);
    };

    var hourStep = timepickerConfig.hourStep;
    if ($attrs.hourStep) {
        $scope.$parent.$watch($parse($attrs.hourStep), function (value) {
            hourStep = parseInt(value, 10);
        });
    }

    var minuteStep = timepickerConfig.minuteStep;
    if ($attrs.minuteStep) {
        $scope.$parent.$watch($parse($attrs.minuteStep), function (value) {
            minuteStep = parseInt(value, 10);
        });
    }

    // 12H / 24H mode
    $scope.showMeridian = timepickerConfig.showMeridian;
    if ($attrs.showMeridian) {
        $scope.$parent.$watch($parse($attrs.showMeridian), function (value) {
            $scope.showMeridian = !!value;

            if (ngModelCtrl.$error.time) {
                // Evaluate from template
                var hours = getHoursFromTemplate(), minutes = getMinutesFromTemplate();
                if (angular.isDefined(hours) && angular.isDefined(minutes)) {
                    selected.setHours(hours);
                    refresh();
                }
            } else {
                updateTemplate();
            }
        });
    }

    // Get $scope.hours in 24H mode if valid
    function getHoursFromTemplate() {
        var hours = parseInt($scope.hours, 10);
        var valid = ($scope.showMeridian) ? (hours > 0 && hours < 13) : (hours >= 0 && hours < 24);
        if (!valid) {
            return undefined;
        }

        if ($scope.showMeridian) {
            if (hours === 12) {
                hours = 0;
            }
            if ($scope.meridian === meridians[1]) {
                hours = hours + 12;
            }
        }
        return hours;
    }

    function getMinutesFromTemplate() {
        var minutes = parseInt($scope.minutes, 10);
        return (minutes >= 0 && minutes < 60) ? minutes : undefined;
    }

    function pad(value) {
        return (angular.isDefined(value) && value.toString().length < 2) ? '0' + value : value;
    }
    // Respond on mousewheel spin
    this.setupMousewheelEvents = function (hoursInputEl, minutesInputEl) {
        var isScrollingUp = function (e) {
            if (e.originalEvent) {
                e = e.originalEvent;
            }
            //pick correct delta variable depending on event
            var delta = (e.wheelDelta) ? e.wheelDelta : -e.deltaY;
            return (e.detail || delta > 0);
        };

        hoursInputEl.bind('mousewheel wheel', function (e) {
            $scope.$apply((isScrollingUp(e)) ? $scope.incrementHours() : $scope.decrementHours());
            e.preventDefault();
        });

        minutesInputEl.bind('mousewheel wheel', function (e) {
            $scope.$apply((isScrollingUp(e)) ? $scope.incrementMinutes() : $scope.decrementMinutes());
            e.preventDefault();
        });

    };

    this.setupInputEvents = function (hoursInputEl, minutesInputEl) {
        if ($scope.readonlyInput) {
            $scope.updateHours = angular.noop;
            $scope.updateMinutes = angular.noop;
            return;
        }

        var invalidate = function (invalidHours, invalidMinutes) {
            ngModelCtrl.$setViewValue(null);
            ngModelCtrl.$setValidity('time', false);
            if (angular.isDefined(invalidHours)) {
                $scope.invalidHours = invalidHours;
            }
            if (angular.isDefined(invalidMinutes)) {
                $scope.invalidMinutes = invalidMinutes;
            }
        };

        $scope.updateHours = function () {
            var hours = getHoursFromTemplate();

            if (angular.isDefined(hours)) {
                selected.setHours(hours);
                refresh('h');
            } else {
                invalidate(true);
            }
        };

        hoursInputEl.bind('blur', function (e) {
            if (!$scope.invalidHours && $scope.hours < 10) {
                $scope.$apply(function () {
                    $scope.hours = pad($scope.hours);
                });
            }
        });

        $scope.updateMinutes = function () {
            var minutes = getMinutesFromTemplate();

            if (angular.isDefined(minutes)) {
                selected.setMinutes(minutes);
                refresh('m');
            } else {
                invalidate(undefined, true);
            }
        };

        minutesInputEl.bind('blur', function (e) {
            if (!$scope.invalidMinutes && $scope.minutes < 10) {
                $scope.$apply(function () {
                    $scope.minutes = pad($scope.minutes);
                });
            }
        });

    };

    this.render = function () {
        var date = ngModelCtrl.$modelValue ? new Date(ngModelCtrl.$modelValue) : null;

        if (isNaN(date)) {
            ngModelCtrl.$setValidity('time', false);
            $log.error('Timepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.');
        } else {
            if (date) {
                selected = date;
            }
            makeValid();
            updateTemplate();
        }
    };

    // Call internally when we know that model is valid.
    function refresh(keyboardChange) {
        makeValid();
        ngModelCtrl.$setViewValue(new Date(selected));
        updateTemplate(keyboardChange);
    }

    function makeValid() {
        ngModelCtrl.$setValidity('time', true);
        $scope.invalidHours = false;
        $scope.invalidMinutes = false;
    }

    function updateTemplate(keyboardChange) {
        var hours = selected.getHours(), minutes = selected.getMinutes();

        if ($scope.showMeridian) {
            hours = (hours === 0 || hours === 12) ? 12 : hours % 12; // Convert 24 to 12 hour system
        }

        $scope.hours = keyboardChange === 'h' ? hours : pad(hours);
        $scope.minutes = keyboardChange === 'm' ? minutes : pad(minutes);
        $scope.meridian = selected.getHours() < 12 ? meridians[0] : meridians[1];
    }

    function addMinutes(minutes) {
        var dt = new Date(selected.getTime() + minutes * 60000);
        selected.setHours(dt.getHours(), dt.getMinutes());
        refresh();
    }

    $scope.incrementHours = function () {
        addMinutes(hourStep * 60);
    };
    $scope.decrementHours = function () {
        addMinutes(-hourStep * 60);
    };
    $scope.incrementMinutes = function () {
        addMinutes(minuteStep);
    };
    $scope.decrementMinutes = function () {
        addMinutes(-minuteStep);
    };
    $scope.toggleMeridian = function () {
        addMinutes(12 * 60 * ((selected.getHours() < 12) ? 1 : -1));
    };
}])

.directive('timepicker', function () {
    return {
        restrict: 'EA',
        require: ['timepicker', '?^ngModel'],
        controller: 'TimepickerController',
        replace: true,
        scope: {},
        template: "<table>" +
            "<tbody>" +
            "<tr class='text-center'>" +
            "<td><a ng-click='incrementHours()' class='btn btn-outline btn-link' style='border: 0px; border-image: none;'><span class='glyphicon glyphicon-chevron-up'></span></a></td>" +
            "<td>&nbsp;</td>" +
            "<td><a ng-click='incrementMinutes()' class='btn btn-outline btn-link btn-default' style='border: 0px; border-image: none;'><span class='glyphicon glyphicon-chevron-up'></span></a></td>" +
            "<td ng-show='showMeridian'></td>" +
            "</tr>" +
            "<tr>" +
            "<td style='width:50px;' class='form-group' ng-class=\"{'has-error': invalidHours}\">" +
            "<input type='text' ng-model='hours' ng-change='updateHours()' class='form-control text-center' ng-mousewheel='incrementHours()' ng-readonly='readonlyInput' maxlength='2'>" +
            "</td>" +
            "<td>:</td>" +
            "<td style='width:50px;' class='form-group' ng-class=\"{'has-error': invalidMinutes}\">" +
            "<input type='text' ng-model='minutes' ng-change='updateMinutes()' class='form-control text-center' ng-readonly='readonlyInput' maxlength='2'>" +
            "</td>" +
            "<td ng-show='showMeridian'><button type='button' class='btn btn-outline btn-default text-center' ng-click='toggleMeridian()'>{{meridian}}</button></td>" +
            "</tr>" +
            "<tr class='text-center'>" +
            "<td><a ng-click='decrementHours()' class='btn btn-outline btn-link' style='border: 0px; border-image: none;'><span class='glyphicon glyphicon-chevron-down'></span></a></td>" +
            "<td>&nbsp;</td>" +
            "<td><a ng-click='decrementMinutes()' class='btn btn-outline btn-link' style='border: 0px; border-image: none;'><span class='glyphicon glyphicon-chevron-down'></span></a></td>" +
            "<td ng-show='showMeridian'></td>" +
            "</tr>" +
            "</tbody>" +
            "</table>",
        link: function (scope, element, attrs, ctrls) {
            var timepickerCtrl = ctrls[0], ngModelCtrl = ctrls[1];

            if (ngModelCtrl) {
                timepickerCtrl.init(ngModelCtrl, element.find('input'));
            }
        }
    };
});
angular.module('directives')
    .value('uiTinymceConfig', {})
    .directive('mmTinymce', ['uiTinymceConfig', function (uiTinymceConfig) {
        uiTinymceConfig = uiTinymceConfig || {};
        var generatedIds = 0;
        return {
            priority: 10,
            require: '?ngModel',
            link: function (scope, elm, attrs, ngModel) {
                var expression, options, tinyInstance;
                // generate an ID if not present
                if (!attrs.id) {
                    attrs.$set('id', 'uiTinymce' + generatedIds++);
                }
                options = {
                    // Update model when calling setContent (such as from the source editor popup)
                    setup: function (ed) {
                        ed.on('init', function (args) {
                            ngModel.$render();
                        });
                        // Update model on button click
                        ed.on('ExecCommand', function (e) {
                            ed.save();
                            ngModel.$setViewValue(elm.val());
                            if (!scope.$$phase) {
                                scope.$apply();
                            }
                        });
                        // Update model on keypress
                        ed.on('KeyUp', function (e) {
                            //console.log(ed.isDirty());
                            //ed.save();
                            //ngModel.$setViewValue(elm.val());
                            //if (!scope.$$phase) {
                            //    scope.$apply();
                            //}
                        });
                        ed.on("Change",function (e) {
                           // console.log(ed.isDirty());
                            ed.save();
                                ngModel.$setViewValue(elm.val());
                            if (!scope.$$phase) {
                                scope.$apply();
                            }
                        });
                    },
                    mode: 'exact',
                    elements: attrs.id
                };
                if (attrs.uiTinymce) {
                    expression = scope.$eval(attrs.uiTinymce);
                } else {
                    expression = {};
                }
                angular.extend(options, uiTinymceConfig, expression);
                setTimeout(function () {
                    options.plugins = 'advlist autolink link image lists charmap print preview code';
                    tinymce.init(options);
                });


                ngModel.$render = function () {
                   // console.log("render");
                    if (!tinyInstance) {
                        tinyInstance = tinymce.get(attrs.id);
                    }
                    if (tinyInstance) {
                        tinyInstance.setContent(ngModel.$viewValue || '');
                    }
                };
            }
        };
    }]);






//    .directive('wysihtml5', ['$timeout',
//function ($timeout) {
//    return {
//        restrict: 'E',
//        require: 'ngModel',
//        template: "<textarea></textarea>", // A template you create as a HTML file (use templateURL) or something else...
//        link: function ($scope, $element, attrs, ngModel) {

//            // Find the textarea defined in your Template
//            var textarea = $element.find("textarea");

//            // When your model changes from the outside, use ngModel.$render to update the value in the textarea
//            ngModel.$render = function () {
//                textarea.val(ngModel.$viewValue);
//            };

//            // Create the editor itself, use TinyMCE in your case
//            var editor = new wysihtml5.Editor(textarea[0],
//                {
//                    stylesheets: ["/style.css"],
//                    parserRules: wysihtml5ParserRules,
//                    toolbar: true,
//                    autoLink: true,
//                    useLineBreaks: false,
//                });

//            // Ensure editor is rendered before binding to the change event
//            $timeout(function () {

//                // On every change in the editor, get the value from the editor (textarea in case of Wysihtml5)
//                // and set your model
//                editor.on('change', function () {
//                    var newValue = textarea.val();

//                    if (!$scope.$$phase) {
//                        $scope.$apply(function () {
//                            ngModel.$setViewValue(newValue);
//                        });
//                    }
//                });

//            }, 500);
//        }
//    };
//}]);
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



angular.module('directives').directive('mmValidator', [
    function() {
        return{
            restrict: 'A',
            require: '^form',
            link: function (scope, elm, attrs, formCtrl) {
                var blurred, inputEl, inputName, inputNgEl, options, showSuccess, trigger;
                var errorMessages = null;
                var helpertext = null;
                var pretexted=false;
                showSuccess = true;
                inputEl = elm[0].querySelector('input[name]');
                if (!inputEl) {
                    inputEl = elm[0].querySelector('select[name]');
                }

                var numberMaxLength = "";
                if (inputEl.maxLength) {
                    numberMaxLength = inputEl.maxLength;
                }
                var numberMinLength = "";
                if (inputEl.minlength) {
                    numberMaxLength = inputEl.minlength;
                }
                var numbermax = "";
                if (inputEl.max) {
                    numbermax = inputEl.max;
                }

                var numbermin =""
                if (inputEl.min) {
                    numbermax = inputEl.min;
                }

                attrs.$observe('minlength', function (val) {
                    minlength = parseInt(val, 10);
                });

                inputNgEl = angular.element(inputEl);
                inputName = inputNgEl.attr('name');
                if (!inputName) {
                    throw "show-errors element has no child input elements with a 'name' attribute";
                }
                inputNgEl.bind('blur', function () {
                    blurred = true;
                    loadErrors();
                });

                inputNgEl.bind('invalid', function() {
                    loadErrors();
                });
                elm.toggleClass('has-none', true);
                
              var q =  {'required':'can not be empty','email':'requires valid email'}

                attrs.$observe('mmValidator', function (value) {
                    if (value) {
                        if (value.indexOf('{') > -1) {
                            var newvalue = value.replace(/'/g, "\"");
                            errorMessages = JSON.parse(newvalue);
                            elm.append('<p class="help-block"></p>');
                            helpertext = elm.find("p.help-block");
                            if (helpertext[0]) {
                                helpertext = helpertext[0];
                            } else {
                                helpertext = null;
                            }

                        } else {
                            pretexted = true;
                            elm.append('<p class="help-block">' + value + '</p>');
                        }
                    } else {
                        if (!helpertext) {
                            elm.append('<p class="help-block"></p>');
                            helpertext = elm.find("p.help-block");
                            if (helpertext[0]) {
                                helpertext = helpertext[0];
                            } else {
                                helpertext = null;
                            }
                        }
                    }
                });

              
                var loadErrors =function() {
                    var error = formCtrl[inputName].$error;
                    if (!pretexted) {
                        if (error['email']) {
                            if (errorMessages && errorMessages['email']) {
                                helpertext.innerHTML = errorMessages['email'];
                            } else {
                                helpertext.innerHTML = "Please enter a valid e-mail address";
                            }
                        } else if (error['max']) {
                            if (errorMessages && errorMessages['max']) {
                                helpertext.innerHTML = errorMessages['max'];
                            } else {
                                helpertext.innerHTML = "Please enter less than " + numbermax;
                            }
                        } else if (error['maxlength']) {
                            if (errorMessages && errorMessages['maxlength']) {
                                helpertext.innerHTML = errorMessages['maxlength'];
                            } else {
                                helpertext.innerHTML = "Please enter at maximum "+numberMaxLength+" characters.";
                            }
                        } else if (error['min']) {
                            if (errorMessages && errorMessages['min']) {
                                helpertext.innerHTML = errorMessages['min'];
                            } else {
                                helpertext.innerHTML = "Please enter more than " + numbermin;
                            }
                        } else if (error['minlength']) {
                            if (errorMessages && errorMessages['minlength']) {
                                helpertext.innerHTML = errorMessages['minlength'];
                            } else {
                                helpertext.innerHTML = "Please enter at least " + numberMinLength + " characters.";
                            }
                        } else if (error['number']) {
                            if (errorMessages && errorMessages['number']) {
                                helpertext.innerHTML = errorMessages['number'];
                            } else {
                                helpertext.innerHTML = "input must be a number";
                            }
                        } else if (error['pattern']) {
                            if (errorMessages && errorMessages['pattern']) {
                                helpertext.innerHTML = errorMessages['pattern'];
                            } else {
                                helpertext.innerHTML = "pattern isn't exceeded";
                            }
                        } else if (error['required']) {
                            if (errorMessages && errorMessages['required']) {
                                helpertext.innerHTML = errorMessages['required'];
                            } else {
                                helpertext.innerHTML = "input can not be empty";
                            }
                        } else if (error['url']) {
                            if (errorMessages && errorMessages['url']) {
                                helpertext.innerHTML = errorMessages['url'];
                            } else {
                                helpertext.innerHTML = "input must be a url";
                            }
                        } else if (error['date']) {
                            if (errorMessages && errorMessages['date']) {
                                helpertext.innerHTML = errorMessages['date'];
                            } else {
                                helpertext.innerHTML = "input must be a date";
                            }
                        } else if (error['datetimelocal']) {
                            if (errorMessages && errorMessages['datetimelocal']) {
                                helpertext.innerHTML = errorMessages['datetimelocal'];
                            } else {
                                helpertext.innerHTML = "input must be a datetimelocal";
                            }
                        } else if (error['time']) {
                            if (errorMessages && errorMessages['time']) {
                                helpertext.innerHTML = errorMessages['time'];
                            } else {
                                helpertext.innerHTML = "input must be a time";
                            }
                        } else if (error['week']) {
                            if (errorMessages && errorMessages['week']) {
                                helpertext.innerHTML = errorMessages['week'];
                            } else {
                                helpertext.innerHTML = "input must be a week";
                            }
                        } else if (error['month']) {
                            if (errorMessages && errorMessages['month']) {
                                helpertext.innerHTML = errorMessages['month'];
                            } else {
                                helpertext.innerHTML = "input must be a month";
                            }
                        }
                    }
                    return toggleClasses(formCtrl[inputName].$invalid);
                }

                var toggleClasses = function (invalid) {
                    elm.toggleClass('has-error', invalid);
                    elm.toggleClass('has-none', !invalid);
                    if (showSuccess) {
                        return elm.toggleClass('has-success', !invalid);
                    }
                };

              
                //scope.$watch(function () {
                //    var field = inputName;
                //    return formCtrl[inputName] && formCtrl[inputName].$invalid;
                //},
               // function (invalid) {
               //     if (!blurred) {
               //         return;
               //     }
               //     return toggleClasses(invalid);
               // });

            }
        }
    }
]);
angular.module('directives').directive("mmWizard", ["$http", "$compile", function ($http, $compile) {
        return {
            restrict: "C",
            transclude: true,
            template: '<div class="wizard ui-wizard-example"><div class="wizard-wrapper"><ul class="wizard-steps" id="myTab" style="left: 0px;">' +
                '</ul></div>  ' +
                '<div class="wizard-content panel tab-content">' +
                '<div style="display: none;" class="alert alert-danger alert-dark"> <button class="close" type="button" >×</button> <span class="alert-message">Change a few things up and try submitting again.</span> </div>' +
                '</div>' +
                '<div class="panel-footer"><button class="btn wizard-prev-step-btn">Prev</button><button class="btn btn-primary wizard-next-step-btn pull-right">Next</button> <button class="btn btn-primary wizard-finish-step-btn pull-right">Finish</button></div>' +
                '</div>',
            link: function(scope, element, attrs, ctrl, transclude) {

                function s4() {
                    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
                }

                var formPrefix = s4();

                //maybe childscope is nessesary
                var stepheader = element.find("ul.wizard-steps");
                var contentholder = element.find("div.wizard-content");
                var prevBtn = element.find("button.wizard-prev-step-btn");
                var frvBtn = element.find("button.wizard-next-step-btn");
                var finishBtn = element.find("button.wizard-finish-step-btn");
                var buttonpanel = element.find('div.panel-footer');
                var alertcontainer = element.find('div.alert');
                var alertmeassagecontainer = element.find('span.alert-message');
                var alertClose = element.find('button.close');
                var steps = [];
                var stepnumber = 0;
                var activenumber = 0;

                $(contentholder).on('keyup', function (e) {
                    if (e.which == 13) {
                        goForward();
                        // e.preventDefault();
                    }
                });

                var clearrowsandheaders = function () {

                }
                var showAlert = function(message)
                {
                    alertcontainer[0].style.display = "block";
                    alertmeassagecontainer[0].innerHTML = message;
                }
                var hideAlert= function() {
                    alertcontainer[0].style.display = "none";
                }

                var stepchangedCall= function() {
                    var q = scope["form" + formPrefix + (activenumber + 1)];
                    var cancelled = false;
                    if (q.$valid) {
                        if (stepChangedHandler) {
                            var args = {};
                            args.CurrentPage = (activenumber + 1);
                            args.targetedPage = activenumber;
                            args.formName = "form" + formPrefix + (activenumber + 1);
                            args.form = q;
                            cancelled = stepChangedHandler(args);
                        }
                    } else {
                        var form = q.$error;
                        cancelled = true;
                        showAlert("Check validations");
                    }
                    return cancelled;
                }
                var goForward =function() {
                    if ((activenumber+1) < stepnumber) {
                        if (!stepchangedCall()) {
                            activenumber++;
                            $('#myTab li:eq(' + activenumber + ')', element).tab('show');
                            prevBtn[0].style.display = "inline-block";
                            if (activenumber + 1 == stepnumber) { frvBtn[0].style.display = "none"; }
                            if (activenumber + 1 == stepnumber) { finishBtn[0].style.display = "inline-block"; }
                            hideAlert();
                        }
                    }
                }
                $(alertClose).bind("click", function () {
                    hideAlert();
                });

                $(finishBtn).bind("click", function() {

                    var cancelled = false;
                    var q = scope["form" + formPrefix + (activenumber + 1)];
                    if (q.$valid) {

                        var args = {};
                        args.CurrentPage = (activenumber + 1);
                        args.targetedPage = null;
                        args.formName = "form" + formPrefix + (activenumber + 1);
                        args.form = q;
                        if (finishClickedHandler) {cancelled = finishClickedHandler(args);}
                        if (stepChangedHandler) {cancelled = stepChangedHandler(args);}

                        if (!cancelled) {
                            contentholder[0].style.display = "none";
                            buttonpanel[0].style.display = "none";
                            $('#myTab li:last',element)[0].style.backgroundColor = "#4cb64c";
                            $('#myTab li:last .wizard-step-caption', element)[0].style.color = "white";
                            $('#myTab li:last .wizard-step-description', element)[0].style.color = "white";
                            hideAlert();
                        }
                    } else {
                        showAlert("Check validations");
                    }
                });

                $(prevBtn).bind("click", function () {
                    frvBtn[0].style.display = "inline-block";
                    finishBtn[0].style.display = "none";
                    if (activenumber > 0) {
                        if (!stepchangedCall()) {
                            activenumber--;
                            $('#myTab li:eq(' + activenumber + ')', element).tab('show');
                            hideAlert();
                            if (activenumber == 0) {
                                prevBtn[0].style.display = "none";
                            }
                        }
                    }
                });

                $(frvBtn).bind("click", function() {
                    goForward();
                });


                var stepChangedHandler = null;
                attrs.$observe('stepChanged', function (value) {
                    if (value && scope[value] && angular.isFunction(scope[value])) {
                        stepChangedHandler = scope[value];
                    }
                });
                var finishClickedHandler = null;
                attrs.$observe('finishClicked', function (value) {
                    if (value && scope[value] && angular.isFunction(scope[value])) {
                        finishClickedHandler = scope[value];
                    }
                });


              
                var getsubcontent = function (innerhtml) {
                    var output = {};
                    var caption = $(innerhtml).find(".wizard-caption");
                    if (caption && caption[0] && caption[0].innerHTML) {
                        //output.caption = caption[0].innerHTML;
                        output.caption = '<li class="active"  style="width: 200px; min-width: 200px; max-width: 200px;" data-target="#wizard-example-step' + stepnumber + '" data-toggle="tab" >' +
                            '<span class="wizard-step-number">' + stepnumber + '</span><span class="wizard-step-caption">' + caption[0].innerHTML + '</span> </li>';
                        stepheader.append(output.caption);

                    }
                    var content = $(innerhtml).find(".wizard-content");
                    if (content && content[0] && content[0].innerHTML) {
                        //output.content = content[0].innerHTML;
                        output.content = ' <div id="wizard-example-step' + stepnumber + '" class="tab-pane"><form name="form' + formPrefix + stepnumber + '" class="form' + stepnumber + '">' + content[0].innerHTML + '</form></div>';
                        contentholder.append(output.content);

                    }
                    var buttons = $(innerhtml).find("wizard-buttons");
                    if (buttons && buttons[0] && buttons[0].innerHTML) {
                        output.buttons = buttons[0].innerHTML;
                    }
                    return output;
                }


                transclude(scope, function(clone) {
                    angular.forEach(clone, function (elem) {
                        if (angular.element(elem).hasClass('wizard-step')) {
                            stepnumber++;
                            steps.push(getsubcontent(elem));
                        }
                    });
                    $('#myTab li:first').tab('show');
                    prevBtn[0].style.display = "none";
                    finishBtn[0].style.display = "none";
                    $compile(contentholder)(scope);
                    //var h = angular.element(clone, "thead");
                   
                });
            }
        }
        }]);
angular.module('directives').controller('mmPagerSourceController', ['$scope', '$attrs', '$parse', "$filter", function ($scope, $attrs, $parse, $filter) {
    var self = this,
        ngModelCtrl = { $setViewValue: angular.noop }, // nullModelCtrl
        setNumPages = $attrs.numPages ? $parse($attrs.numPages).assign : angular.noop;

    this.init = function (ngModelCtrl_, config) {
        ngModelCtrl = ngModelCtrl_;
        this.config = config;

        ngModelCtrl.$render = function () {
            self.render();
        };

        if ($attrs.itemsPerPage) {
            $scope.$parent.$watch($parse($attrs.itemsPerPage), function (value) {
                self.itemsPerPage = parseInt(value, 10);
                $scope.totalPages = self.calculateTotalPages();
                $scope.setResults($scope.page, self.itemsPerPage, $scope.itemssource, $scope.filter, $scope.sort, $scope.descending)

            });
        } else {
            this.itemsPerPage = config.itemsPerPage;
        }
    };

    this.calculateTotalPages = function () {
        var totalPages = this.itemsPerPage < 1 ? 1 : Math.ceil($scope.totalItems / this.itemsPerPage);
        return Math.max(totalPages || 0, 1);
    };

    this.render = function () {
        $scope.page = parseInt(ngModelCtrl.$viewValue, 10) || 1;
    };

    $scope.selectPage = function (page) {
        if ($scope.page !== page && page > 0 && page <= $scope.totalPages) {
            ngModelCtrl.$setViewValue(page);
            $scope.setResults(page, self.itemsPerPage, $scope.itemssource, $scope.filter,  $scope.sort, $scope.descending)
            ngModelCtrl.$render();
        }
    };

    $scope.getText = function (key) {
        return $scope[key + 'Text'] || self.config[key + 'Text'];
    };
    $scope.noPrevious = function () {
        return $scope.page === 1;
    };
    $scope.noNext = function () {
        return $scope.page === $scope.totalPages;
    };

    $scope.$watch('totalItems', function () {
        $scope.totalPages = self.calculateTotalPages();
    });

    $scope.$watchCollection('filter', function () {
        $scope.totalPages = self.calculateTotalPages();
        $scope.setResults($scope.page, self.itemsPerPage, $scope.itemssource, $scope.filter, $scope.sort, $scope.descending)
    });

    $scope.$watchCollection('sort', function () {
        $scope.totalPages = self.calculateTotalPages();
        $scope.setResults($scope.page, self.itemsPerPage, $scope.itemssource, $scope.filter, $scope.sort, $scope.descending)
    });

    $scope.$watchCollection('descending', function () {
        $scope.totalPages = self.calculateTotalPages();
        $scope.setResults($scope.page, self.itemsPerPage, $scope.itemssource, $scope.filter, $scope.sort, $scope.descending)
    });

    $scope.$watch('totalPages', function (value) {
        setNumPages($scope.$parent, value); // Readonly variable

        if ($scope.page > value) {
            $scope.selectPage(value);
        } else {
            ngModelCtrl.$render();
        }
    });

    $scope.$watch("itemssource", function (newvalue, oldvalue) {
        if ($scope.itemssource && self.itemsPerPage && $scope.itemssource.length && $scope.page) {
            $scope.setResults($scope.page, self.itemsPerPage, $scope.itemssource, $scope.filter, $scope.sort, $scope.descending)
        };
    });

    $scope.setResults = function (pagenumber, itemsPerPage, itemssource, filter, sort, descending) {
        if (pagenumber && itemssource && itemssource.length && itemsPerPage) {
            var filteredData = {};
            if (filter) {
                filteredData = $filter('filter')($scope.itemssource, $scope.filter);
            } else {
                filteredData = itemssource;
            }

            if (sort) {
                if ($scope.descending) {
                    filteredData = $filter('orderBy')(filteredData, $scope.sort, true);
                } else {
                    filteredData = $filter('orderBy')(filteredData, $scope.sort);
                }

            }
          
            $scope.totalItems = filteredData.length;
            var from = (pagenumber - 1) * itemsPerPage;
            var to = pagenumber * itemsPerPage
            $scope.totalPages = self.calculateTotalPages();
            $scope.results = filteredData.slice(from, to)
        }
    };
}])

.constant('pagerSourceConfig', {
    itemsPerPage: 10,
    boundaryLinks: true,
    directionLinks: true,
    firstText: '<<',
    previousText: '<',
    nextText: '>',
    lastText: '>>',
    rotate: false,
    maxSize: 10,
})

.directive('pagerSource', ['$parse', 'pagerSourceConfig', "$filter", function ($parse, pagerSourceConfig, $filter) {
    return {
        restrict: 'EA',
        scope: {
            firstText: '@',
            previousText: '@',
            nextText: '@',
            lastText: '@',
            itemssource: '=',
            filter: '=',
            sort:'=',
            descending:'=',
            results:'=',
        },
        require: ['pagerSource', '?ngModel'],
        controller: 'mmPagerSourceController',
        template:'<ul class="pagination">'+
        '<li ng-if="boundaryLinks" ng-class="{disabled: noPrevious()}"><a href ng-click="selectPage(1)">{{getText("first")}}</a></li>'+
        '<li ng-if="directionLinks" ng-class="{disabled: noPrevious()}"><a href ng-click="selectPage(page - 1)">{{getText("previous")}}</a></li>'+
        '<li ng-repeat="page in pages track by $index" ng-class="{active: page.active}"><a href ng-click="selectPage(page.number)">{{page.text}}</a></li>'+
        '<li ng-if="directionLinks" ng-class="{disabled: noNext()}"><a href ng-click="selectPage(page + 1)">{{getText("next")}}</a></li>'+
        '<li ng-if="boundaryLinks" ng-class="{disabled: noNext()}"><a href ng-click="selectPage(totalPages)">{{getText("last")}}</a></li>'+
        '</ul>',

        //templateUrl: '/App/templates/pagination/pagination.html',
        replace: true,
        link: function (scope, element, attrs, ctrls) {
            var pagerSourceCtrl = ctrls[0], ngModelCtrl = ctrls[1];
          
            if (!ngModelCtrl) {
                return; // do nothing if no ng-model
            }

            // Setup configuration parameters
            var maxSize = angular.isDefined(attrs.maxSize) ? scope.$parent.$eval(attrs.maxSize) : pagerSourceConfig.maxSize,
                rotate = angular.isDefined(attrs.rotate) ? scope.$parent.$eval(attrs.rotate) : pagerSourceConfig.rotate;
            scope.boundaryLinks = angular.isDefined(attrs.boundaryLinks) ? scope.$parent.$eval(attrs.boundaryLinks) : pagerSourceConfig.boundaryLinks;
            scope.directionLinks = angular.isDefined(attrs.directionLinks) ? scope.$parent.$eval(attrs.directionLinks) : pagerSourceConfig.directionLinks;

            pagerSourceCtrl.init(ngModelCtrl, pagerSourceConfig);

            if (attrs.maxSize) {
                scope.$parent.$watch($parse(attrs.maxSize), function (value) {
                    maxSize = parseInt(value, 10);
                    pagerSourceCtrl.render();
                });
            }

            // Create page object used in template
            function makePage(number, text, isActive) {
                return {
                    number: number,
                    text: text,
                    active: isActive
                };
            }

            function getPages(currentPage, totalPages) {
                var pages = [];

                // Default page limits
                var startPage = 1, endPage = totalPages;
                var isMaxSized = (angular.isDefined(maxSize) && maxSize < totalPages);

                // recompute if maxSize
                if (isMaxSized) {
                    if (rotate) {
                        // Current page is displayed in the middle of the visible ones
                        startPage = Math.max(currentPage - Math.floor(maxSize / 2), 1);
                        endPage = startPage + maxSize - 1;

                        // Adjust if limit is exceeded
                        if (endPage > totalPages) {
                            endPage = totalPages;
                            startPage = endPage - maxSize + 1;
                        }
                    } else {
                        // Visible pages are paginated with maxSize
                        startPage = ((Math.ceil(currentPage / maxSize) - 1) * maxSize) + 1;

                        // Adjust last page if limit is exceeded
                        endPage = Math.min(startPage + maxSize - 1, totalPages);
                    }
                }

                // Add page number links
                for (var number = startPage; number <= endPage; number++) {
                    var page = makePage(number, number, number === currentPage);
                    pages.push(page);
                }

                // Add links to move between page sets
                if (isMaxSized && !rotate) {
                    if (startPage > 1) {
                        var previousPageSet = makePage(startPage - 1, '...', false);
                        pages.unshift(previousPageSet);
                    }

                    if (endPage < totalPages) {
                        var nextPageSet = makePage(endPage + 1, '...', false);
                        pages.push(nextPageSet);
                    }
                }

                return pages;
            }

            var originalRender = pagerSourceCtrl.render;
            pagerSourceCtrl.render = function () {
                originalRender();
                if (scope.page > 0 && scope.page <= scope.totalPages) {
                    scope.pages = getPages(scope.page, scope.totalPages);
                }
            };
        }
    };
}])




//.controller('PaginationController', ['$scope', '$attrs', '$parse', function ($scope, $attrs, $parse) {
//    var self = this,
//        ngModelCtrl = { $setViewValue: angular.noop }, // nullModelCtrl
//        setNumPages = $attrs.numPages ? $parse($attrs.numPages).assign : angular.noop;

//    this.init = function (ngModelCtrl_, config) {
//        ngModelCtrl = ngModelCtrl_;
//        this.config = config;

//        ngModelCtrl.$render = function () {
//            self.render();
//        };

//        if ($attrs.itemsPerPage) {
//            $scope.$parent.$watch($parse($attrs.itemsPerPage), function (value) {
//                self.itemsPerPage = parseInt(value, 10);
//                $scope.totalPages = self.calculateTotalPages();
//            });
//        } else {
//            this.itemsPerPage = config.itemsPerPage;
//        }
//    };

//    this.calculateTotalPages = function () {
//        var totalPages = this.itemsPerPage < 1 ? 1 : Math.ceil($scope.totalItems / this.itemsPerPage);
//        return Math.max(totalPages || 0, 1);
//    };

//    this.render = function () {
//        $scope.page = parseInt(ngModelCtrl.$viewValue, 10) || 1;
//    };

//    $scope.selectPage = function (page) {
//        if ($scope.page !== page && page > 0 && page <= $scope.totalPages) {
//            ngModelCtrl.$setViewValue(page);
//            ngModelCtrl.$render();
//        }
//    };

//    $scope.getText = function (key) {
//        return $scope[key + 'Text'] || self.config[key + 'Text'];
//    };
//    $scope.noPrevious = function () {
//        return $scope.page === 1;
//    };
//    $scope.noNext = function () {
//        return $scope.page === $scope.totalPages;
//    };

//    $scope.$watch('totalItems', function () {
//        $scope.totalPages = self.calculateTotalPages();
//    });

//    $scope.$watch('totalPages', function (value) {
//        setNumPages($scope.$parent, value); // Readonly variable

//        if ($scope.page > value) {
//            $scope.selectPage(value);
//        } else {
//            ngModelCtrl.$render();
//        }
//    });
//}])

//.constant('paginationConfig', {
//    itemsPerPage: 10,
//    boundaryLinks: false,
//    directionLinks: true,
//    firstText: 'First',
//    previousText: 'Previous',
//    nextText: 'Next',
//    lastText: 'Last',
//    rotate: true
//})
//.directive('pagination', ['$parse', 'pagerSourceConfig', function ($parse, paginationConfig) {
//    return {
//        restrict: 'EA',
//        scope: {
//            totalItems: '=',
//            firstText: '@',
//            previousText: '@',
//            nextText: '@',
//            lastText: '@'
//        },
//        require: ['pagination', '?ngModel'],
//        controller: 'PaginationController',
//        template: '<ul class="pagination">' +
//    '<li ng-if="boundaryLinks" ng-class="{disabled: noPrevious()}"><a href ng-click="selectPage(1)">{{getText("first")}}</a></li>' +
//    '<li ng-if="directionLinks" ng-class="{disabled: noPrevious()}"><a href ng-click="selectPage(page - 1)">{{getText("previous")}}</a></li>' +
//    '<li ng-repeat="page in pages track by $index" ng-class="{active: page.active}"><a href ng-click="selectPage(page.number)">{{page.text}}</a></li>' +
//    '<li ng-if="directionLinks" ng-class="{disabled: noNext()}"><a href ng-click="selectPage(page + 1)">{{getText("next")}}</a></li>' +
//    '<li ng-if="boundaryLinks" ng-class="{disabled: noNext()}"><a href ng-click="selectPage(totalPages)">{{getText("last")}}</a></li>' +
//    '</ul>',
//        //templateUrl: 'template/pagination/pagination.html',
//        replace: true,
//        link: function (scope, element, attrs, ctrls) {
//            var paginationCtrl = ctrls[0], ngModelCtrl = ctrls[1];

//            if (!ngModelCtrl) {
//                return; // do nothing if no ng-model
//            }

//            // Setup configuration parameters
//            var maxSize = angular.isDefined(attrs.maxSize) ? scope.$parent.$eval(attrs.maxSize) : paginationConfig.maxSize,
//                rotate = angular.isDefined(attrs.rotate) ? scope.$parent.$eval(attrs.rotate) : paginationConfig.rotate;
//            scope.boundaryLinks = angular.isDefined(attrs.boundaryLinks) ? scope.$parent.$eval(attrs.boundaryLinks) : paginationConfig.boundaryLinks;
//            scope.directionLinks = angular.isDefined(attrs.directionLinks) ? scope.$parent.$eval(attrs.directionLinks) : paginationConfig.directionLinks;

//            paginationCtrl.init(ngModelCtrl, paginationConfig);

//            if (attrs.maxSize) {
//                scope.$parent.$watch($parse(attrs.maxSize), function (value) {
//                    maxSize = parseInt(value, 10);
//                    paginationCtrl.render();
//                });
//            }

//            // Create page object used in template
//            function makePage(number, text, isActive) {
//                return {
//                    number: number,
//                    text: text,
//                    active: isActive
//                };
//            }

//            function getPages(currentPage, totalPages) {
//                var pages = [];

//                // Default page limits
//                var startPage = 1, endPage = totalPages;
//                var isMaxSized = (angular.isDefined(maxSize) && maxSize < totalPages);

//                // recompute if maxSize
//                if (isMaxSized) {
//                    if (rotate) {
//                        // Current page is displayed in the middle of the visible ones
//                        startPage = Math.max(currentPage - Math.floor(maxSize / 2), 1);
//                        endPage = startPage + maxSize - 1;

//                        // Adjust if limit is exceeded
//                        if (endPage > totalPages) {
//                            endPage = totalPages;
//                            startPage = endPage - maxSize + 1;
//                        }
//                    } else {
//                        // Visible pages are paginated with maxSize
//                        startPage = ((Math.ceil(currentPage / maxSize) - 1) * maxSize) + 1;

//                        // Adjust last page if limit is exceeded
//                        endPage = Math.min(startPage + maxSize - 1, totalPages);
//                    }
//                }

//                // Add page number links
//                for (var number = startPage; number <= endPage; number++) {
//                    var page = makePage(number, number, number === currentPage);
//                    pages.push(page);
//                }

//                // Add links to move between page sets
//                if (isMaxSized && !rotate) {
//                    if (startPage > 1) {
//                        var previousPageSet = makePage(startPage - 1, '...', false);
//                        pages.unshift(previousPageSet);
//                    }

//                    if (endPage < totalPages) {
//                        var nextPageSet = makePage(endPage + 1, '...', false);
//                        pages.push(nextPageSet);
//                    }
//                }

//                return pages;
//            }

//            var originalRender = paginationCtrl.render;
//            paginationCtrl.render = function () {
//                originalRender();
//                if (scope.page > 0 && scope.page <= scope.totalPages) {
//                    scope.pages = getPages(scope.page, scope.totalPages);
//                }
//            };
//        }
//    };
//}])

angular.module("directives").directive("popover", [function () {
    return {
        link: function (scope, element) {
            $(element).popover(
                { trigger: 'focus' }
                );
        }
    }
}])
angular.module('directives').directive('themeSelector', function () {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs, ngModelCtrl) {
            var selectedtheme = null;

            attrs.$observe('themeSelector', function (value) {
              
                if (value == "theme-adminflare" || value == "theme-asphalt" || value == "theme-clean" || value == "theme-default" || value == "theme-dust"
                    || value == "theme-fresh" || value == "theme-frost" || value == "theme-purple-hills" || value == "theme-silver" || value == "theme-white") {
                    selectedtheme = value;

                }

               


            });

            var $elem = $(elem);
            $elem.bind("click", function () {
                if (selectedtheme) {
                    var body = angular.element(document).find('body');
                    $(body).removeClass("theme-adminflare theme-asphalt theme-clean theme-default theme-dust theme-fresh theme-frost theme-purple-hills theme-silver theme-white");
                    $(body).addClass(selectedtheme);
                }
            });
        }
    };
});
angular.module('directives')
    .directive("tooltip", [
        "$http", "$compile", function ($http, $compile) {
            return {
                restrict: 'AC',
                link: function (scope, element, attrs, ctrl, transclude) {
                    if ($(element).tooltip) {
                        $(element).tooltip();
                    }
        },
    }
}
]);