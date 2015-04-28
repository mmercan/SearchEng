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