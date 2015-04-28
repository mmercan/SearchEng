(function() {
    angular.module("app").controller("testCtrl", [
        "$scope", "$http", "$routeParams", "$location", "dataContext", "alertService", "notificationService", "mainMenuService", "rottentService", function($scope, $http, $routeParams, $location, dataContext, alertService, notificationService, mainMenuService, rottentService) {


        

            //Index
            $scope.currentPage = 1;
            $scope.lessUsers = lessUsers;
            $scope.users = users;
            $scope.tasks = tasks;
            $scope.notifications = notifications;
            $scope.supportTickets = supportTickets;
            $scope.comments = comments;
            $scope.chat = chat;

            $scope.save = function(catForm) {if (catForm && !catForm.$valid) {alert("Check validation Errors");return;}}

            $scope.hidemainmenu = function() { mainMenuService.hide(); }
            $scope.showmainmenu = function() { mainMenuService.show(); }
            $scope.togglemainmenu = function() { mainMenuService.toggle(); }
            $scope.expandmainmenu = function() { mainMenuService.expand(); }
            $scope.callopsemainmenu = function() { mainMenuService.collapse(); }
            $scope.fixedmainmenu = function() { mainMenuService.fixed(); }
            $scope.notfixedmainmenu = function() { mainMenuService.notfixed(); }


            $scope.setPage = function (pageNo) { $scope.currentPage = pageNo; };
            $scope.pageChanged = function() {console.log('Page changed to: ' + $scope.currentPage);};

            $scope.knobnumber = 75;
            $scope.mailto = "mbortz@example.com";

            $scope.piedata;
            $scope.pieconfig = {
                legend: {position: "bottom"},
                series: [{type: "donut",field: "percentage",categoryField: "source",}],
                seriesColors: ["#42a7ff", "#666666", "#999999", "#cccccc"],
            };
            $scope.SalesChartNumbers = SalesChartNumbers;
            $scope.Saleschartconfig = {
                legend: {visible: false},
                chartArea: {background: ""},
                seriesDefaults: {type: "line",style: "smooth",border: {width: 0},overlay: {gradient: "none"}},
                seriesColors: ["white"],
                series: [{field: "v",name: "sales"}],
                categoryAxis: {field: "day",color: "white",majorGridLines: {visible: false}},
                valueAxis: {color: "white",labels: { format: "{0}" },line: { visible: false },axisCrossingValue: -10},
                tooltip: {visible: true,shared: true,format: "N0"}
            };
            $scope.tweetchart = [275, 490, 397, 487, 339, 403, 402, 312, 300];
            $scope.tweetchartconfig = {
                chartArea: {background: ""},
                seriesDefaults: {type: "line",border: {width: 0},overlay: {gradient: "none"}},
                axisDefaults: {majorGridLines: { visible: false },majorTicks: { visible: false }},
                seriesColors: ["white"],
                categoryAxis: {visible: false,line: { visible: false },majorGridLines: { visible: false },},
                valueAxis: {visible: false,majorTicks: { visible: false },line: { visible: false },crosshair: { visible: false },axisCrossingValue: -10},
                tooltip: {visible: true,shared: true,format: "N0"}
            };
            $scope.productchart = productchart;
            $scope.chartconfig = {
                series: [{ field: "sales", name: "sales" }, { field: "production", name: "production" }, { field: "Purchase", name: "Purchase" }],
                categoryAxis: { field: "year", },
                valueAxis: {},
                tooltip: { visible: true, shared: true, format: "N0" }
            }

            //Notification Alerts
            $scope.showAlert = function(text, type, isdark) {
                if (isdark) {alertService.addMoveTopDark(text, null, type, 30);} else {var options = {type: type,'auto_close': 3};
                    alertService.addMoveTop(text, options);
                }

            }

            $scope.notificationSuccess = function() {notificationService.success();};
            $scope.notificationInfo = function() {notificationService.info();};
            $scope.notificationWarning = function() {notificationService.warning();};
            $scope.notificationError = function() {notificationService.error();};


            //end of Index
            $scope.test = function() {alert($scope.inventory);};

            $scope.image = null;
            $scope.imageFileName = '';
            $scope.images = [];
            $scope.fileSelected = function(img) {$scope.images.push(img);};

            //
            $scope.products = {};
            $scope.subCategories = [];
            $scope.categories = [];
            $scope.pro = {};

            $scope.productID = {};
            $scope.currentItem = {};
            $scope.currentReviews = [];
            $scope.workorderAndSales = [];
            $scope.assemblyTree = [];
            $scope.purchaseOrderDetail = [];
            $scope.inventory = [];
            //
            $scope.locations = locations;
            // dataContext.Products.refresh().done(function(result) {

            $http.get("/lib/pixeladmin/Productsjson.txt").then(function(result){
                $scope.products = result.data;//dataContext.Products.items.value;
                if ($routeParams.id && $routeParams.id != "new") {
                    $scope.productID = 743; 
                    $scope.currentItem = dataContext.Products.getLocalById($routeParams.id);
                    $scope.assemblyTree = [{ "$id": "2", "ProductAssembly": "Blade", "ComponentName": "Metal Sheet 5", "BillOfMaterialsID": 2433, "ProductAssemblyID": 316, "ComponentID": 486, "StartDate": "2004-09-05T00:00:00", "EndDate": null, "UnitMeasureCode": "EA ", "BOMLevel": 4, "PerAssemblyQty": 1.00 }, { "$id": "3", "ProductAssembly": "Chain Stays", "ComponentName": "Metal Sheet 5", "BillOfMaterialsID": 1290, "ProductAssemblyID": 324, "ComponentID": 486, "StartDate": "2004-07-10T00:00:00", "EndDate": null, "UnitMeasureCode": "EA ", "BOMLevel": 3, "PerAssemblyQty": 1.00 }, { "$id": "4", "ProductAssembly": "Down Tube", "ComponentName": "Metal Sheet 3", "BillOfMaterialsID": 875, "ProductAssemblyID": 327, "ComponentID": 483, "StartDate": "2004-06-26T00:00:00", "EndDate": null, "UnitMeasureCode": "EA ", "BOMLevel": 3, "PerAssemblyQty": 1.00 }, { "$id": "5", "ProductAssembly": "Fork Crown", "ComponentName": "Metal Sheet 5", "BillOfMaterialsID": 492, "ProductAssemblyID": 350, "ComponentID": 486, "StartDate": "2004-04-18T00:00:00", "EndDate": null, "UnitMeasureCode": "EA ", "BOMLevel": 4, "PerAssemblyQty": 1.00 }, { "$id": "6", "ProductAssembly": "Fork End", "ComponentName": "Metal Sheet 2", "BillOfMaterialsID": 1289, "ProductAssemblyID": 331, "ComponentID": 482, "StartDate": "2004-07-10T00:00:00", "EndDate": null, "UnitMeasureCode": "EA ", "BOMLevel": 4, "PerAssemblyQty": 1.00 }, { "$id": "7", "ProductAssembly": "Head Tube", "ComponentName": "Metal Sheet 4", "BillOfMaterialsID": 3338, "ProductAssemblyID": 399, "ComponentID": 485, "StartDate": "2005-01-23T00:00:00", "EndDate": null, "UnitMeasureCode": "EA ", "BOMLevel": 3, "PerAssemblyQty": 1.00 }, { "$id": "8", "ProductAssembly": "HL Fork", "ComponentName": "Blade", "BillOfMaterialsID": 2301, "ProductAssemblyID": 804, "ComponentID": 316, "StartDate": "2004-09-05T00:00:00", "EndDate": null, "UnitMeasureCode": "EA ", "BOMLevel": 3, "PerAssemblyQty": 2.00 }, { "$id": "9", "ProductAssembly": "HL Fork", "ComponentName": "Fork Crown", "BillOfMaterialsID": 1204, "ProductAssemblyID": 804, "ComponentID": 350, "StartDate": "2004-09-09T00:00:00", "EndDate": null, "UnitMeasureCode": "EA ", "BOMLevel": 3, "PerAssemblyQty": 1.00 }, { "$id": "10", "ProductAssembly": "HL Fork", "ComponentName": "Fork End", "BillOfMaterialsID": 17, "ProductAssemblyID": 804, "ComponentID": 331, "StartDate": "2004-04-04T00:00:00", "EndDate": null, "UnitMeasureCode": "EA ", "BOMLevel": 3, "PerAssemblyQty": 2.00 }, { "$id": "11", "ProductAssembly": "HL Fork", "ComponentName": "Steerer", "BillOfMaterialsID": 3403, "ProductAssemblyID": 804, "ComponentID": 531, "StartDate": "2005-01-23T00:00:00", "EndDate": null, "UnitMeasureCode": "EA ", "BOMLevel": 3, "PerAssemblyQty": 1.00 }, { "$id": "12", "ProductAssembly": "HL Mountain Frame - Black, 42", "ComponentName": "Chain Stays", "BillOfMaterialsID": 1388, "ProductAssemblyID": 743, "ComponentID": 324, "StartDate": "2004-07-10T00:00:00", "EndDate": null, "UnitMeasureCode": "EA ", "BOMLevel": 2, "PerAssemblyQty": 2.00 }, { "$id": "13", "ProductAssembly": "HL Mountain Frame - Black, 42", "ComponentName": "Decal 1", "BillOfMaterialsID": 1849, "ProductAssemblyID": 743, "ComponentID": 325, "StartDate": "2004-07-20T00:00:00", "EndDate": null, "UnitMeasureCode": "EA ", "BOMLevel": 2, "PerAssemblyQty": 2.00 }, { "$id": "14", "ProductAssembly": "HL Mountain Frame - Black, 42", "ComponentName": "Decal 2", "BillOfMaterialsID": 3421, "ProductAssemblyID": 743, "ComponentID": 326, "StartDate": "2005-01-23T00:00:00", "EndDate": null, "UnitMeasureCode": "EA ", "BOMLevel": 2, "PerAssemblyQty": 1.00 }, { "$id": "15", "ProductAssembly": "HL Mountain Frame - Black, 42", "ComponentName": "Down Tube", "BillOfMaterialsID": 2509, "ProductAssemblyID": 743, "ComponentID": 327, "StartDate": "2004-09-05T00:00:00", "EndDate": null, "UnitMeasureCode": "EA ", "BOMLevel": 2, "PerAssemblyQty": 1.00 }, { "$id": "16", "ProductAssembly": "HL Mountain Frame - Black, 42", "ComponentName": "Head Tube", "BillOfMaterialsID": 3158, "ProductAssemblyID": 743, "ComponentID": 399, "StartDate": "2005-01-15T00:00:00", "EndDate": null, "UnitMeasureCode": "EA ", "BOMLevel": 2, "PerAssemblyQty": 1.00 }, { "$id": "17", "ProductAssembly": "HL Mountain Frame - Black, 42", "ComponentName": "HL Fork", "BillOfMaterialsID": 172, "ProductAssemblyID": 743, "ComponentID": 804, "StartDate": "2004-04-04T00:00:00", "EndDate": null, "UnitMeasureCode": "EA ", "BOMLevel": 2, "PerAssemblyQty": 1.00 }, { "$id": "18", "ProductAssembly": "HL Mountain Frame - Black, 42", "ComponentName": "Paint - Black", "BillOfMaterialsID": 1389, "ProductAssemblyID": 743, "ComponentID": 492, "StartDate": "2004-07-10T00:00:00", "EndDate": null, "UnitMeasureCode": "OZ ", "BOMLevel": 2, "PerAssemblyQty": 8.00 }, { "$id": "19", "ProductAssembly": "HL Mountain Frame - Black, 42", "ComponentName": "Seat Stays", "BillOfMaterialsID": 574, "ProductAssemblyID": 743, "ComponentID": 532, "StartDate": "2004-04-18T00:00:00", "EndDate": null, "UnitMeasureCode": "EA ", "BOMLevel": 2, "PerAssemblyQty": 4.00 }, { "$id": "20", "ProductAssembly": "HL Mountain Frame - Black, 42", "ComponentName": "Seat Tube", "BillOfMaterialsID": 955, "ProductAssemblyID": 743, "ComponentID": 533, "StartDate": "2004-06-26T00:00:00", "EndDate": null, "UnitMeasureCode": "EA ", "BOMLevel": 2, "PerAssemblyQty": 1.00 }, { "$id": "21", "ProductAssembly": "HL Mountain Frame - Black, 42", "ComponentName": "Top Tube", "BillOfMaterialsID": 173, "ProductAssemblyID": 743, "ComponentID": 534, "StartDate": "2004-04-04T00:00:00", "EndDate": null, "UnitMeasureCode": "EA ", "BOMLevel": 2, "PerAssemblyQty": 1.00 }, { "$id": "22", "ProductAssembly": "Seat Stays", "ComponentName": "Metal Sheet 7", "BillOfMaterialsID": 1769, "ProductAssemblyID": 532, "ComponentID": 484, "StartDate": "2004-09-19T00:00:00", "EndDate": null, "UnitMeasureCode": "EA ", "BOMLevel": 3, "PerAssemblyQty": 1.00 }, { "$id": "23", "ProductAssembly": "Seat Tube", "ComponentName": "Metal Bar 2", "BillOfMaterialsID": 100, "ProductAssemblyID": 533, "ComponentID": 478, "StartDate": "2004-04-04T00:00:00", "EndDate": null, "UnitMeasureCode": "EA ", "BOMLevel": 3, "PerAssemblyQty": 1.00 }, { "$id": "24", "ProductAssembly": "Steerer", "ComponentName": "Metal Sheet 6", "BillOfMaterialsID": 2094, "ProductAssemblyID": 531, "ComponentID": 487, "StartDate": "2004-08-08T00:00:00", "EndDate": null, "UnitMeasureCode": "EA ", "BOMLevel": 4, "PerAssemblyQty": 1.00 }, { "$id": "25", "ProductAssembly": "Top Tube", "ComponentName": "Metal Sheet 2", "BillOfMaterialsID": 491, "ProductAssemblyID": 534, "ComponentID": 482, "StartDate": "2004-04-18T00:00:00", "EndDate": null, "UnitMeasureCode": "EA ", "BOMLevel": 3, "PerAssemblyQty": 1.00 }];
                    $scope.workorderAndSales = [{ "$id": "89", "ProductID": 770, "TotalSales": 2270, "Ordered": 2270, "Stocked": 2258, "Scrapped": 12, "NetStocked": -12 }];
                    $scope.inventory = [{ "$id": "90", "ProductID": 770, "LocationID": 7, "Name": "Finished Goods Storage", "Shelf": "N/A", "Bin": 0, "Quantity": 104 }, { "$id": "91", "ProductID": 770, "LocationID": 60, "Name": "Final Assembly", "Shelf": "N/A", "Bin": 0, "Quantity": 123 }];
                }
            });

            //Calender Items
            $scope.selectedDate = "";
            $scope.selectedevent = {};
           var selected = function(start, end, allDay) {
               var title = prompt('Event Title:');
               if (title) { calendar.fullCalendar('renderEvent', { title: title, start: start, end: end, allDay: allDay }, true); }
                calendar.fullCalendar('unselect');};
            $scope.events = events;
            $scope.calendarDayselected = function(date) {alert(date);}
            $scope.showevents = function() {alert($scope.events);}

            //Chart
            $scope.citylist = citylist;
            $scope.timezonelist = timezonelist;
            $scope.multi2Value = [{ id: 'CT', text: 'Connecticut' },{ id: 'DE', text: 'Delaware' }];
            $scope.isSelected = true;
            $scope.selectedFirst = ["OR", "HI"];
            $scope.selectedListItem = "OR";
            $scope.sListItem = ["1", "2", "4"];
            $scope.switchertemplate = {on_state_content: '<span class="fa fa-check"></span>',off_state_content: '<span class="fa fa-times"></span>'};
            $scope.mydate = "17/03/1981";
        }
    ]);

    var users = [{ id: 1, image: '/assets/demo/avatars/2.jpg', firstName: 'Robert', lastName: 'Jang', username: '@rjang', fullname: 'Robert Jang', email: 'rjang@@example.com', text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore. ', label: 'Lorem ipsum dolor sit amet ', messagetitle: "Message Title 1", messageAttached: false, messageSelected: false }, { id: 2, image: '/assets/demo/avatars/3.jpg', firstName: 'Michelle', lastName: 'Bortz', username: '@mbortz ', fullname: 'Michelle Bortz', email: 'mbortz@example.com', text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore. ', label: 'Lorem ipsum dolor sit amet ', messagetitle: "Message Title 2", messageAttached: true, messageSelected: true }, { id: 3, image: '/assets/demo/avatars/4.jpg', firstName: 'Timothy', lastName: 'Owens', username: '@towens ', fullname: 'Timothy Owens', email: 'towens@example.com', text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore. ', label: 'Lorem ipsum dolor sit amet ', messagetitle: "Message Title 3", messageAttached: false, messageSelected: false }, { id: 4, image: '/assets/demo/avatars/5.jpg', firstName: 'Denise', lastName: 'Steiner', username: '@dsteiner ', fullname: 'Denise Steiner', email: 'dsteiner@example.com', text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore. ', label: 'Lorem ipsum dolor sit amet ', messagetitle: "Message Title 4", messageAttached: true, messageSelected: false }, { id: 5, image: '/assets/demo/avatars/2.jpg', firstName: 'Robert', lastName: 'Jang', username: '@rjang ', fullname: 'Robert Jang', email: 'rjang@example.com', text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore. ', label: 'Lorem ipsum dolor sit amet ', messagetitle: "Message Title 5", messageAttached: true, messageSelected: false }, { id: 6, image: '/assets/demo/avatars/3.jpg', firstName: 'Michelle', lastName: 'Bortz', username: '@mbortz ', fullname: 'Michelle Bortz', email: 'mbortz@example.com', text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore. ', label: 'Lorem ipsum dolor sit amet ', messagetitle: "Message Title 6", messageAttached: true, messageSelected: false }, { id: 7, image: '/assets/demo/avatars/4.jpg', firstName: 'Timothy', lastName: 'Owens', username: '@towens ', fullname: 'Timothy Owens', email: 'towens@example.com', text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore. ', label: 'Lorem ipsum dolor sit amet ', messagetitle: "Message Title 7", messageAttached: true, messageSelected: false }, { id: 8, image: '/assets/demo/avatars/2.jpg', firstName: 'Robert', lastName: 'Jang', username: '@rjang', fullname: 'Robert Jang', email: 'rjang@@example.com', text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore. ', label: 'Lorem ipsum dolor sit amet ', messagetitle: "Message Title 8", messageAttached: true, messageSelected: false }, { id: 9, image: '/assets/demo/avatars/3.jpg', firstName: 'Michelle', lastName: 'Bortz', username: '@mbortz ', fullname: 'Michelle Bortz', email: 'mbortz@example.com', text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore. ', label: 'Lorem ipsum dolor sit amet ', messagetitle: "Message Title 9", messageAttached: true, messageSelected: false }, { id: 10, image: '/assets/demo/avatars/4.jpg', firstName: 'Timothy', lastName: 'Owens', username: '@towens ', fullname: 'Timothy Owens', email: 'towens@example.com', text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore. ', label: 'Lorem ipsum dolor sit amet ', messagetitle: "Message Title 10", messageAttached: false, messageSelected: false }, { id: 11, image: '/assets/demo/avatars/5.jpg', firstName: 'Denise', lastName: 'Steiner', username: '@dsteiner ', fullname: 'Denise Steiner', email: 'dsteiner@example.com', text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore. ', label: 'Lorem ipsum dolor sit amet ', messagetitle: "Message Title 11", messageAttached: false, messageSelected: false }, { id: 12, image: '/assets/demo/avatars/2.jpg', firstName: 'Robert', lastName: 'Jang', username: '@rjang ', fullname: 'Robert Jang', email: 'rjang@example.com', text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore. ', label: 'Lorem ipsum dolor sit amet ', messagetitle: "Message Title 12", messageAttached: false, messageSelected: false }, { id: 13, image: '/assets/demo/avatars/3.jpg', firstName: 'Michelle', lastName: 'Bortz', username: '@mbortz ', fullname: 'Michelle Bortz', email: 'mbortz@example.com', text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore. ', label: 'Lorem ipsum dolor sit amet ', messagetitle: "Message Title 13", messageAttached: false, messageSelected: true }, { id: 14, image: '/assets/demo/avatars/4.jpg', firstName: 'Timothy', lastName: 'Owens', username: '@towens ', fullname: 'Timothy Owens', email: 'towens@example.com', text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore. ', label: 'Lorem ipsum dolor sit amet ', messagetitle: "Message Title 14", messageAttached: false, messageSelected: true }, { id: 15, image: '/assets/demo/avatars/2.jpg', firstName: 'Robert', lastName: 'Jang', username: '@rjang', fullname: 'Robert Jang', email: 'rjang@@example.com', text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore. ', label: 'Lorem ipsum dolor sit amet ', messagetitle: "Message Title 15", messageAttached: true, messageSelected: true }, { id: 16, image: '/assets/demo/avatars/3.jpg', firstName: 'Michelle', lastName: 'Bortz', username: '@mbortz ', fullname: 'Michelle Bortz', email: 'mbortz@example.com', text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore. ', label: 'Lorem ipsum dolor sit amet ', messagetitle: "Message Title 16", messageAttached: false, messageSelected: true }, { id: 17, image: '/assets/demo/avatars/4.jpg', firstName: 'Timothy', lastName: 'Owens', username: '@towens ', fullname: 'Timothy Owens', email: 'towens@example.com', text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore. ', label: 'Lorem ipsum dolor sit amet ', messagetitle: "Message Title 17", messageAttached: true, messageSelected: true }, { id: 18, image: '/assets/demo/avatars/5.jpg', firstName: 'Denise', lastName: 'Steiner', username: '@dsteiner ', fullname: 'Denise Steiner', email: 'dsteiner@example.com', text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore. ', label: 'Lorem ipsum dolor sit amet ', messagetitle: "Message Title 18", messageAttached: false, messageSelected: true }, { id: 19, image: '/assets/demo/avatars/2.jpg', firstName: 'Robert', lastName: 'Jang', username: '@rjang ', fullname: 'Robert Jang', email: 'rjang@example.com', text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore. ', label: 'Lorem ipsum dolor sit amet ', messagetitle: "Message Title 19", messageAttached: true, messageSelected: true }, { id: 20, image: '/assets/demo/avatars/3.jpg', firstName: 'Michelle', lastName: 'Bortz', username: '@mbortz ', fullname: 'Michelle Bortz', email: 'mbortz@example.com', text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore. ', label: 'Lorem ipsum dolor sit amet ', messagetitle: "Message Title 20", messageAttached: false, messageSelected: true }, { id: 21, image: '/assets/demo/avatars/4.jpg', firstName: 'Timothy', lastName: 'Owens', username: '@towens ', fullname: 'Timothy Owens', email: 'towens@example.com', text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore. ', label: 'Lorem ipsum dolor sit amet ', messagetitle: "Message Title 21", messageAttached: true, messageSelected: true }];
    var tasks = [{ title: "A very important task", due: "1 hour left", completed: false, order: 1, priority: "high" }, { title: "A very important task", due: "58 minutes left", completed: true, order: 2, priority: "normal" }, { title: "A regular task", due: "", completed: true, order: 2, priority: "normal" }, { title: "A regular task", due: "", completed: false, order: 2, priority: "normal" }, { title: "A regular task", due: "", completed: false, order: 2, priority: "normal" }, { title: "An unimportant task", due: "", completed: false, order: 2, priority: "low" }, { title: "An unimportant task", due: "", completed: false, order: 2, priority: "low" }, { title: "A regular task", due: "", completed: false, order: 2, priority: "high" }, { title: "An unimportant task", due: "", completed: false, order: 2, priority: "low" }];

    var lessUsers = [
        { id: 1, image: '/assets/demo/avatars/2.jpg', firstName: 'Robert', lastName: 'Jang', username: '@rjang', fullname: 'Robert Jang', email: 'rjang@@example.com', text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore. ', label: 'Lorem ipsum dolor sit amet ' },
        { id: 2, image: '/assets/demo/avatars/3.jpg', firstName: 'Michelle', lastName: 'Bortz', username: '@mbortz ', fullname: 'Michelle Bortz', email: 'mbortz@example.com', text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore. ', label: 'Lorem ipsum dolor sit amet ' },
        { id: 3, image: '/assets/demo/avatars/4.jpg', firstName: 'Timothy', lastName: 'Owens', username: '@towens ', fullname: 'Timothy Owens', email: 'towens@example.com', text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore. ', label: 'Lorem ipsum dolor sit amet ' },
        { id: 4, image: '/assets/demo/avatars/5.jpg', firstName: 'Denise', lastName: 'Steiner', username: '@dsteiner ', fullname: 'Denise Steiner', email: 'dsteiner@example.com', text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore. ', label: 'Lorem ipsum dolor sit amet ' }
    ];

    var comments = [{images: "/assets/demo/avatars/2.jpg",
            name: "Robert Jang",
            comments: [{ images: "/assets/demo/avatars/4.jpg", name: "Timothy Owens" }, {images: "/assets/demo/avatars/5.jpg",name: "Denise Steiner",
                    comments: [{ images: "/assets/demo/avatars/1.jpg", name: "John Doe" }]}]}, { images: "/assets/demo/avatars/3.jpg", name: "Michelle Bortz" }];
    var chat = [{ image: "/assets/demo/avatars/5.jpg", isme: true, username: "Denise Steiner", body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore. ', time: '2 minutes ago' }, { image: "/assets/demo/avatars/1.jpg", username: "John Doe", body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore. ', time: '2 minutes ago' }, { image: "/assets/demo/avatars/1.jpg", username: "John Doe", body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore. ', time: '2 minutes ago' }, { image: "/assets/demo/avatars/5.jpg", isme: true, username: "Denise Steiner", body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore. ', time: '2 minutes ago' }, { image: "/assets/demo/avatars/1.jpg", username: "John Doe", body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore. ', time: '2 minutes ago' }];
    var supportTickets = [{ title: "Server unavaible", ticketNumber: "201798", username: "Timothy Owens", status: "Completed", date: "today" }, { title: "Mobile App Problem", ticketNumber: "201797", username: "Opened by Denise Steiner ", status: "Pending", date: "2 days ago" }, { title: "PayPal issue", ticketNumber: "201796", username: "Opened by Robert Jang", status: "In progress", date: "3 days ago", isCritical: true }, { title: "IE8 problem", ticketNumber: "201795", username: "Opened by Robert Jang", status: "Rejected", date: "4 days ago" }, { title: "Server unavaible", ticketNumber: "201795201794", username: " Opened by Timothy Owens", status: "Completed", date: "5 days ago" }];


    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();
    var events = [{title: 'All Day Event',start: new Date(y, m, 1)},
                {title: 'Long Event',start: new Date(y, m, d - 5),end: new Date(y, m, d - 2)},
                {id: 999,title: 'Repeating Event',start: new Date(y, m, d - 3, 16, 0),allDay: false},
                {id: 999,title: 'Repeating Event',start: new Date(y, m, d + 4, 16, 0),allDay: false},
                {title: 'Meeting',start: new Date(y, m, d, 10, 30),allDay: false},
                {title: 'Lunch',start: new Date(y, m, d, 12, 0),end: new Date(y, m, d, 14, 0),allDay: false},
                {title: 'Birthday Party',start: new Date(y, m, d + 1, 19, 0),end: new Date(y, m, d + 1, 22, 30),allDay: false},
                {title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'}];

    var notifications = [{ title: "SYSTEM", body: "<strong>Error 500</strong>: Syntax error in index.php at line <strong>461</strong>", due: "12h ago", color: "danger", icon: "fa-hdd-o" }, { title: "STORE", body: "You have <strong>9</strong> new orders.", due: "12h ago", color: "info", icon: "fa-truck" }, { title: "CRON DAEMON", body: "Job <strong>\"Clean DB\"</strong> has been completed.", due: "12h ago", color: "default", icon: "fa-clock-o" }, { title: "SYSTEM", body: "Server up.", due: "12h ago", color: "success", icon: "fa-hdd-o" }, { title: "SYSTEM", body: "Warning: Processor load 92%.", due: "12h ago", color: "warning", icon: "fa-hdd-o" }];
    var supportTickets = [{ title: "Server unavaible", ticketNumber: "201798", username: "Timothy Owens", status: "Completed", date: "today" }, { title: "Mobile App Problem", ticketNumber: "201797", username: "Opened by Denise Steiner ", status: "Pending", date: "2 days ago" }, { title: "PayPal issue", ticketNumber: "201796", username: "Opened by Robert Jang", status: "In progress", date: "3 days ago", isCritical: true }, { title: "IE8 problem", ticketNumber: "201795", username: "Opened by Robert Jang", status: "Rejected", date: "4 days ago" }, { title: "Server unavaible", ticketNumber: "201795201794", username: " Opened by Timothy Owens", status: "Completed", date: "5 days ago" }];
    var SalesChartNumbers = [{ day: new Date("2014/03/10"), v: 20 },{ day: new Date("2014/03/11"), v: 10 },{ day: new Date("2014/03/12"), v: 15 },{ day: new Date("2014/03/13"), v: 12 },{ day: new Date("2014/03/14"), v: 5 },{ day: new Date("2014/03/15"), v: 5 },{ day: new Date("2014/03/16"), v: 20 }];
    var piedata = [{ "source": "Hydro", "percentage": 22, }, { "source": "Solar", "percentage": 2 }, { "source": "Nuclear", "percentage": 49 }, { "source": "Wind", "percentage": 27 }];
    var productchart = [{ "ProductID": 743, "year": "2005", "sales": 87, "production": 398, "Purchase": 4 },{ "ProductID": 743, "year": "2006", "sales": 398, "production": 1421, "Purchase": 9 },{ "ProductID": 743, "year": "2007", "sales": 497, "production": 1771, "Purchase": 36 },{ "ProductID": 743, "year": "2008", "sales": 199, "production": 889, "Purchase": 105 }];
    var locations = [{ "lat": 43.65654, "lng": -79.90138, "html": "Some stuff to display in the<br>First Info Window", "label": "Marker One" },
        { "lat": 43.91892, "lng": -78.89231, "html": "Some stuff to display in the<br>Second Info Window", "label": "Marker Two" },
        { "lat": 43.82589, "lng": -79.10040, "html": "Some stuff to display in the<br>Third Info Window", "label": "Marker Three" }];
    var citylist = [{ value: "AK", name: "Alaska" }, { value: "HI", name: "Hawaii" }, { value: "CA", name: "California" }, { value: "NV", name: "Nevada" }, { value: "OR", name: "Oregon" }, { value: "WA", name: "Washington" }, { value: "AZ", name: "Arizona" }, { value: "CO", name: "Colorado" }, { value: "ID", name: "Idaho" }, { value: "MT", name: "Montana" }, { value: "NE", name: "Nebraska" }, { value: "NM", name: "New Mexico" }, { value: "ND", name: "North Dakota" }, { value: "UT", name: "Utah" }, { value: "WY", name: "Wyoming" }, { value: "AL", name: "Alabama" }, { value: "AR", name: "Arkansas" }, { value: "IL", name: "Illinois" }, { value: "IA", name: "Iowa" }, { value: "KS", name: "Kansas" }, { value: "KY", name: "Kentucky" }, { value: "LA", name: "Louisiana" }, { value: "MN", name: "Minnesota" }, { value: "MS", name: "Mississippi" }, { value: "MO", name: "Missouri" }, { value: "OK", name: "Oklahoma" }, { value: "SD", name: "South Dakota" }, { value: "TX", name: "Texas" }, { value: "TN", name: "Tennessee" }, { value: "WI", name: "Wisconsin" }, { value: "CT", name: "Connecticut" }, { value: "DE", name: "Delaware" }, { value: "FL", name: "Florida" }, { value: "GA", name: "Georgia" }, { value: "IN", name: "Indiana" }, { value: "ME", name: "Maine" }, { value: "MD", name: "Maryland" }, { value: "MA", name: "Massachusetts" }, { value: "MI", name: "Michigan" }, { value: "NH", name: "New Hampshire" }, { value: "NJ", name: "New Jersey" }, { value: "NY", name: "New York" }, { value: "NC", name: "North Carolina" }, { value: "OH", name: "Ohio" }, { value: "PA", name: "Pennsylvania" }, { value: "RI", name: "Rhode Island" }, { value: "SC", name: "South Carolina" }, { value: "VT", name: "Vermont" }, { value: "VA", name: "Virginia" }, { value: "WV", name: "West Virginia" }];
    var timezonelist = [
        {label: "Alaskan/Hawaiian Time Zone", cities: [{ value: "AK", name: "Alaska" }, { value: "HI", name: "Hawaii" }]},
        {label: "Pacific Time Zone", cities: [{ value: "CA", name: "California" }, { value: "NV", name: "Nevada" }, { value: "OR", name: "Oregon" }, { value: "WA", name: "Washington" }] },
        {label: "Mountain Time Zone", cities: [{ value: "AZ", name: "Arizona" },{ value: "CO", name: "Colorado" },{ value: "ID", name: "Idaho" },{ value: "MT", name: "Montana" },{ value: "NE", name: "Nebraska" },{ value: "NM", name: "New Mexico" }, { value: "ND", name: "North Dakota" }, { value: "UT", name: "Utah" }, { value: "WY", name: "Wyoming" }]},
        {label: "Central Time Zone", cities: [{ value: "AL", name: "Alabama" },{ value: "AR", name: "Arkansas" },{ value: "IL", name: "Illinois" },{ value: "IA", name: "Iowa" },{ value: "KS", name: "Kansas" },{ value: "KY", name: "Kentucky" },{ value: "LA", name: "Louisiana" },{ value: "MN", name: "Minnesota" },{ value: "MS", name: "Mississippi" },{ value: "MO", name: "Missouri" }, { value: "OK", name: "Oklahoma" }, { value: "SD", name: "South Dakota" }, { value: "TX", name: "Texas" }, { value: "TN", name: "Tennessee" }, { value: "WI", name: "Wisconsin" }]},
        {label: "Eastern Time Zone", cities: [{ value: "CT", name: "Connecticut" },{ value: "DE", name: "Delaware" },{ value: "FL", name: "Florida" },{ value: "GA", name: "Georgia" },
         { value: "IN", name: "Indiana" },{ value: "ME", name: "Maine" },{ value: "MD", name: "Maryland" },{ value: "MA", name: "Massachusetts" },{ value: "MI", name: "Michigan" },
         { value: "NH", name: "New Hampshire" },{ value: "NJ", name: "New Jersey" },{ value: "NY", name: "New York" },{ value: "NC", name: "North Carolina" },{ value: "OH", name: "Ohio" },
         { value: "PA", name: "Pennsylvania" }, { value: "RI", name: "Rhode Island" }, { value: "SC", name: "South Carolina" }, { value: "VT", name: "Vermont" }, { value: "VA", name: "Virginia" }, { value: "WV", name: "West Virginia" }]}];

})();