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