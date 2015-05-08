
var gulp = require("gulp"),
  rimraf = require("rimraf"),
  fs = require("fs");

var less = require("gulp-less");
var concat = require("gulp-concat");

eval("var project = " + fs.readFileSync("./project.json"));

var paths = {
  bower: "./bower_components/",
  lib: "./" + project.webroot + "/lib/"
};



gulp.task("less", function () {
    return gulp.src("./wwwroot/lib/pixeladminless/AdminBundles.less")
          .pipe(less())
          .pipe(gulp.dest("./wwwroot/lib/pixeladminless/"));
});

gulp.task('thirdparty', function () {
    var rootloc = "wwwroot/lib/";
    var files = [
rootloc + "jquery/jquery.js", rootloc + "jquery-ui.js",// rootloc + "jqueryui-touch-punch/jquery.ui.touch-punch.min.js",
        rootloc + "angular/angular.js", rootloc + "angular-route/angular-route.js", rootloc + "angular-animate/angular-animate.js",

        rootloc + "bootstrap/js/bootstrap.js", rootloc + "respond/respond.src.js",
        rootloc + "toastr/toastr.js", rootloc + "nprogress/nprogress.js", rootloc + "lodash/lodash.js",
        rootloc + "moment/moment.js", rootloc + "fullcalendar/fullcalendar.js",
        rootloc + "jquery-knob/jquery.knob.js", rootloc + "select2/select2.js",
        rootloc + "jquery.maskedinput/jquery.maskedinput.js",
        "~/Scripts/bootstrap-datepicker.js",
        "~/Scripts/jquery.barcode/jquery-barcode.min.js",
        rootloc + "Dialog/dialog.js",
        "~/Scripts/kendo/kendo.dataviz.min.js"
    ];

    return gulp.src(files)
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest("wwwroot/bundle"));

});
