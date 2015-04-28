angular.module("data").factory("storage", [function () {

    var storage = function (uniqueid) {
        var self = this;
        self.storagePrefix = "AWStettings.";
        self.result = {};

        self.getitems = function() {
            if (localStorage.getItem(self.storagePrefix + uniqueid)) {
                var result = localStorage.getItem(self.storagePrefix + uniqueid);
                self.result = JSON.parse(result);
                return self.result;
            }
        };

        self.setItem = function(domain, value) {
            if (value) {
                if (this.result[domain] != value) {
                    this.result[domain] = value;
                    localStorage.setItem(self.storagePrefix + uniqueid, JSON.stringify(this.result));
                }
            }
        };
        self.setrootItem = function(value) {
            if (value) {

                this.result = value;
                localStorage.setItem(self.storagePrefix + uniqueid, JSON.stringify(this.result));

            }
        };

        self.resetFilter = function () {
            if (self.result && self.result.filter) {
                self.result.filter = null;
                self.setrootItem(this.result)
                getitems();
            }
           
        };


        self.resetAll = function () {
            self.result = {};
            self.setrootItem(self.result);
                getitems();
            

        };

        self.Addcolumns = function (column) {
            if (!self.result.listcolumns) {
                self.result.listcolumns = [];
            }
            self.result.listcolumns.push(column);
            self.setrootItem(self.result)
            self.getitems();
        };

        self.Removecolumns = function (column) {
            if (!self.result.listcolumns) {
                self.result.listcolumns = [];
            }

            var index = self.result.listcolumns.indexOf(column);
                if (index!=null) if (index > -1) {
                    self.result.listcolumns.splice(index, 1);
                }
                self.setrootItem(self.result)
                self.getitems();
        };
        self.Columnssorted = function (listcolumns) {
            if (!self.result.listcolumns) {
                self.result.listcolumns = [];
            }

            self.result.listcolumns = listcolumns;
            self.setrootItem(self.result)
            self.getitems();
        };
        return self;
    }
    return storage;

}]);


//<div localstorage value="viewMode" uniqueid="'ProductsviewMode'"></div>
(function () {
    //---Required localStorage---//
    angular.module('component').directive('mmLocalstorage', ["storage", function (storage) {
        return {

            scope: {
                value: "="
            },
            //require: '?ngModel',
            link: function (scope, element, attributes, ngModelCtrl) {
                if (attributes.uniqueid) {
                    var str = new storage(attributes.uniqueid);
                    str.getitems();
                    var res;
                    if (attributes.domain != null) {
                        scope.value = str.result[attributes.domain];
                    } else {
                        scope.value = str.result;
                    }

                    scope.$watchCollection("value", function (newVal, oldVal) {

                        if (newVal && newVal != oldVal) {
                            if (attributes.domain) {
                                str.setItem(attributes.domain, newVal)
                            } else {
                                str.setrootItem(scope.value)
                            }
                        }
                    });
                    scope.$watchCollection("value.filter", function (newVal, oldVal) {
                        if (newVal && newVal != oldVal) {
                            str.setrootItem(scope.value);
                            //localStorage.setItem(scope.uniqueid, JSON.stringify(scope.value));
                        }
                    });
                };



            }
        };
    }]);
})();