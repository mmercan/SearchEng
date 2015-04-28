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