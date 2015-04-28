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

