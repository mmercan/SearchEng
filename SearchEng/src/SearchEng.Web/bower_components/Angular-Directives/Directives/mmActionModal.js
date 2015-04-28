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