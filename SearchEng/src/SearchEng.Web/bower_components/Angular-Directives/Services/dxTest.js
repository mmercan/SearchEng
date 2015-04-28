(function () {
    angular.module('data').factory("dxTest", ["entitySet", function (entitySet) {
        var items = {};
        var dataservice = new entitySet("/Productsjson.txt", "ProductID", null);
        var refresh = function () { return dataservice.getData(items); };
        var getByid = function (id) { return dataservice.getByid(id, items); };
        var getLocalById = function (id) { return dataservice.getLocalbyId(id); };
        var add = function (item) { return dataservice.insertDataAddLocal(item); };
        var update = function (item) { return dataservice.updateData(item); };
        var addorUpdate = function (item) { return dataservice.insertorUpdateData(item); };
        var remove = function (item) { return dataservice.deleteDataRemovelocal(item); };
        var addlocal = function (item) { return dataservice.addlocal(item); };

        return {
            items: items,
            refresh: refresh,
            getLocalById: getLocalById,
            add: add,
            update: update,
            remove: remove,
            addorUpdate: addorUpdate,
            getByid: getByid,
            addlocal: addlocal,
        };
    }]);
})();