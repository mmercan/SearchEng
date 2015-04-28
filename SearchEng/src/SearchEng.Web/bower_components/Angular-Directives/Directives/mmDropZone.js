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

