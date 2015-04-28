angular.module("app").controller("angularcomp", [
    "$scope", "$http", "$routeParams", "$location",  "alertService", "notificationService", "mainMenuService", "rottentService", function($scope, $http, $routeParams, $location,  alertService, notificationService, mainMenuService, rottentService) {
        $scope.events = [];
        rottentService.moviesUpcomingCall().then(function (data) {
            angular.forEach(data.movies, function (value, index) {
                value.start = value.release_dates.theater;
                value.end = value.release_dates.theater;
            });
            $scope.events = data.movies;
          
        });


        window.setTimeout(function () {
            $scope.$apply(function () {

                $scope.productID = 743;
                $scope.assemblyTree = [{ "$id": "2", "ProductAssembly": "Blade", "ComponentName": "Metal Sheet 5", "BillOfMaterialsID": 2433, "ProductAssemblyID": 316, "ComponentID": 486, "StartDate": "2004-09-05T00:00:00", "EndDate": null, "UnitMeasureCode": "EA ", "BOMLevel": 4, "PerAssemblyQty": 1.00 }, { "$id": "3", "ProductAssembly": "Chain Stays", "ComponentName": "Metal Sheet 5", "BillOfMaterialsID": 1290, "ProductAssemblyID": 324, "ComponentID": 486, "StartDate": "2004-07-10T00:00:00", "EndDate": null, "UnitMeasureCode": "EA ", "BOMLevel": 3, "PerAssemblyQty": 1.00 }, { "$id": "4", "ProductAssembly": "Down Tube", "ComponentName": "Metal Sheet 3", "BillOfMaterialsID": 875, "ProductAssemblyID": 327, "ComponentID": 483, "StartDate": "2004-06-26T00:00:00", "EndDate": null, "UnitMeasureCode": "EA ", "BOMLevel": 3, "PerAssemblyQty": 1.00 }, { "$id": "5", "ProductAssembly": "Fork Crown", "ComponentName": "Metal Sheet 5", "BillOfMaterialsID": 492, "ProductAssemblyID": 350, "ComponentID": 486, "StartDate": "2004-04-18T00:00:00", "EndDate": null, "UnitMeasureCode": "EA ", "BOMLevel": 4, "PerAssemblyQty": 1.00 }, { "$id": "6", "ProductAssembly": "Fork End", "ComponentName": "Metal Sheet 2", "BillOfMaterialsID": 1289, "ProductAssemblyID": 331, "ComponentID": 482, "StartDate": "2004-07-10T00:00:00", "EndDate": null, "UnitMeasureCode": "EA ", "BOMLevel": 4, "PerAssemblyQty": 1.00 }, { "$id": "7", "ProductAssembly": "Head Tube", "ComponentName": "Metal Sheet 4", "BillOfMaterialsID": 3338, "ProductAssemblyID": 399, "ComponentID": 485, "StartDate": "2005-01-23T00:00:00", "EndDate": null, "UnitMeasureCode": "EA ", "BOMLevel": 3, "PerAssemblyQty": 1.00 }, { "$id": "8", "ProductAssembly": "HL Fork", "ComponentName": "Blade", "BillOfMaterialsID": 2301, "ProductAssemblyID": 804, "ComponentID": 316, "StartDate": "2004-09-05T00:00:00", "EndDate": null, "UnitMeasureCode": "EA ", "BOMLevel": 3, "PerAssemblyQty": 2.00 }, { "$id": "9", "ProductAssembly": "HL Fork", "ComponentName": "Fork Crown", "BillOfMaterialsID": 1204, "ProductAssemblyID": 804, "ComponentID": 350, "StartDate": "2004-09-09T00:00:00", "EndDate": null, "UnitMeasureCode": "EA ", "BOMLevel": 3, "PerAssemblyQty": 1.00 }, { "$id": "10", "ProductAssembly": "HL Fork", "ComponentName": "Fork End", "BillOfMaterialsID": 17, "ProductAssemblyID": 804, "ComponentID": 331, "StartDate": "2004-04-04T00:00:00", "EndDate": null, "UnitMeasureCode": "EA ", "BOMLevel": 3, "PerAssemblyQty": 2.00 }, { "$id": "11", "ProductAssembly": "HL Fork", "ComponentName": "Steerer", "BillOfMaterialsID": 3403, "ProductAssemblyID": 804, "ComponentID": 531, "StartDate": "2005-01-23T00:00:00", "EndDate": null, "UnitMeasureCode": "EA ", "BOMLevel": 3, "PerAssemblyQty": 1.00 }, { "$id": "12", "ProductAssembly": "HL Mountain Frame - Black, 42", "ComponentName": "Chain Stays", "BillOfMaterialsID": 1388, "ProductAssemblyID": 743, "ComponentID": 324, "StartDate": "2004-07-10T00:00:00", "EndDate": null, "UnitMeasureCode": "EA ", "BOMLevel": 2, "PerAssemblyQty": 2.00 }, { "$id": "13", "ProductAssembly": "HL Mountain Frame - Black, 42", "ComponentName": "Decal 1", "BillOfMaterialsID": 1849, "ProductAssemblyID": 743, "ComponentID": 325, "StartDate": "2004-07-20T00:00:00", "EndDate": null, "UnitMeasureCode": "EA ", "BOMLevel": 2, "PerAssemblyQty": 2.00 }, { "$id": "14", "ProductAssembly": "HL Mountain Frame - Black, 42", "ComponentName": "Decal 2", "BillOfMaterialsID": 3421, "ProductAssemblyID": 743, "ComponentID": 326, "StartDate": "2005-01-23T00:00:00", "EndDate": null, "UnitMeasureCode": "EA ", "BOMLevel": 2, "PerAssemblyQty": 1.00 }, { "$id": "15", "ProductAssembly": "HL Mountain Frame - Black, 42", "ComponentName": "Down Tube", "BillOfMaterialsID": 2509, "ProductAssemblyID": 743, "ComponentID": 327, "StartDate": "2004-09-05T00:00:00", "EndDate": null, "UnitMeasureCode": "EA ", "BOMLevel": 2, "PerAssemblyQty": 1.00 }, { "$id": "16", "ProductAssembly": "HL Mountain Frame - Black, 42", "ComponentName": "Head Tube", "BillOfMaterialsID": 3158, "ProductAssemblyID": 743, "ComponentID": 399, "StartDate": "2005-01-15T00:00:00", "EndDate": null, "UnitMeasureCode": "EA ", "BOMLevel": 2, "PerAssemblyQty": 1.00 }, { "$id": "17", "ProductAssembly": "HL Mountain Frame - Black, 42", "ComponentName": "HL Fork", "BillOfMaterialsID": 172, "ProductAssemblyID": 743, "ComponentID": 804, "StartDate": "2004-04-04T00:00:00", "EndDate": null, "UnitMeasureCode": "EA ", "BOMLevel": 2, "PerAssemblyQty": 1.00 }, { "$id": "18", "ProductAssembly": "HL Mountain Frame - Black, 42", "ComponentName": "Paint - Black", "BillOfMaterialsID": 1389, "ProductAssemblyID": 743, "ComponentID": 492, "StartDate": "2004-07-10T00:00:00", "EndDate": null, "UnitMeasureCode": "OZ ", "BOMLevel": 2, "PerAssemblyQty": 8.00 }, { "$id": "19", "ProductAssembly": "HL Mountain Frame - Black, 42", "ComponentName": "Seat Stays", "BillOfMaterialsID": 574, "ProductAssemblyID": 743, "ComponentID": 532, "StartDate": "2004-04-18T00:00:00", "EndDate": null, "UnitMeasureCode": "EA ", "BOMLevel": 2, "PerAssemblyQty": 4.00 }, { "$id": "20", "ProductAssembly": "HL Mountain Frame - Black, 42", "ComponentName": "Seat Tube", "BillOfMaterialsID": 955, "ProductAssemblyID": 743, "ComponentID": 533, "StartDate": "2004-06-26T00:00:00", "EndDate": null, "UnitMeasureCode": "EA ", "BOMLevel": 2, "PerAssemblyQty": 1.00 }, { "$id": "21", "ProductAssembly": "HL Mountain Frame - Black, 42", "ComponentName": "Top Tube", "BillOfMaterialsID": 173, "ProductAssemblyID": 743, "ComponentID": 534, "StartDate": "2004-04-04T00:00:00", "EndDate": null, "UnitMeasureCode": "EA ", "BOMLevel": 2, "PerAssemblyQty": 1.00 }, { "$id": "22", "ProductAssembly": "Seat Stays", "ComponentName": "Metal Sheet 7", "BillOfMaterialsID": 1769, "ProductAssemblyID": 532, "ComponentID": 484, "StartDate": "2004-09-19T00:00:00", "EndDate": null, "UnitMeasureCode": "EA ", "BOMLevel": 3, "PerAssemblyQty": 1.00 }, { "$id": "23", "ProductAssembly": "Seat Tube", "ComponentName": "Metal Bar 2", "BillOfMaterialsID": 100, "ProductAssemblyID": 533, "ComponentID": 478, "StartDate": "2004-04-04T00:00:00", "EndDate": null, "UnitMeasureCode": "EA ", "BOMLevel": 3, "PerAssemblyQty": 1.00 }, { "$id": "24", "ProductAssembly": "Steerer", "ComponentName": "Metal Sheet 6", "BillOfMaterialsID": 2094, "ProductAssemblyID": 531, "ComponentID": 487, "StartDate": "2004-08-08T00:00:00", "EndDate": null, "UnitMeasureCode": "EA ", "BOMLevel": 4, "PerAssemblyQty": 1.00 }, { "$id": "25", "ProductAssembly": "Top Tube", "ComponentName": "Metal Sheet 2", "BillOfMaterialsID": 491, "ProductAssemblyID": 534, "ComponentID": 482, "StartDate": "2004-04-18T00:00:00", "EndDate": null, "UnitMeasureCode": "EA ", "BOMLevel": 3, "PerAssemblyQty": 1.00 }];


                $scope.comments = [{
                    email: "murat_mercan@hotmail.com", name: "Murat Mercan",
                    comments: [{ email: "scott@hanselman.com", name: "Scott Hanselman" }, {
                        email: "daron@yondem.com", name: "Daron Yondem",
                        comments: [{ email: "tim@timheuer.com", name: "Tim Heuer" }]
                    }]
                }, { email: "m@m.com", name: "Michelle Bortz" }];

            });

        }, 10000);

      

        rottentService.moviesInTheatersCall().then(function(data) {
            $scope.moviesInTheaters = data.movies;
        });


        $scope.hidemainmenu = function() {
             mainMenuService.hide();
        }
        $scope.showmainmenu = function () { mainMenuService.show(); }
        $scope.togglemainmenu = function () { mainMenuService.toggle(); }
        $scope.expandmainmenu = function () { mainMenuService.expand(); }
        $scope.callopsemainmenu = function () { mainMenuService.collapse(); }
        $scope.fixedmainmenu = function () { mainMenuService.fixed(); }
        $scope.notfixedmainmenu = function () { mainMenuService.notfixed(); }

        $scope.showAlert = function (text, type, isdark) {
            if (isdark) { alertService.addMoveTopDark(text, null, type, 30); } else {
                var options = { type: type, 'auto_close': 3 };
                alertService.addMoveTop(text, options);
            }

        }


        //setInterval(function () { myTimer() }, 10000);
        //function myTimer() {
        //    document.getElementById('notification').play();
        //}

        //setTimeout(function() {
        //    document.getElementById('notification').play();
        //}, 10000);
        $scope.makeSound= function(sound)
        {
            alertService.MakeSound(sound);
        }

        $scope.addwarining = function () {
            alertService.MakeSound();
            alertService.addMoveTop("<strong>Warning! </strong> Best check yo self, you're not looking too good.", null, "warning", 30);
        }

        $scope.adderror = function () {alertService.addMoveTop("<strong>Warning! </strong> Best check yo self, you're not looking too good. Change a few things up and try submitting again.", null, "danger", 15);}
        $scope.addsuccess = function () {alertService.addMoveTop("<strong>Well done! </strong> You successfully read this important alert message.", null, "success");}
        $scope.addprimary = function () {alertService.addMoveTop("<strong>Heads up! </strong> This alert needs your attention, but it's not super important.", null, "info");}
        $scope.addwariningDark = function () {alertService.addMoveTopDark("<strong>Warning! </strong> Best check yo self, you're not looking too good.", null, "warning", 30);}
        $scope.adderrorDark = function () {alertService.addMoveTopDark("<strong>Oh snap! </strong> Change a few things up and try submitting again.", null, "danger", 15);}
        $scope.addsuccessDark = function () {alertService.addMoveTopDark("<strong>Well done! </strong> You successfully read this important alert message.", null, "success");}
        $scope.addprimaryDark = function () {alertService.addMoveTopDark("<strong>Heads up! </strong> This alert needs your attention, but it's not super important.", null, "info");}

        $scope.notificationSuccess = function () { notificationService.success("<strong>Well done! </strong> Mate", "<strong>Cool</strong> You successfully read this important alert message."); };
        $scope.notificationInfo = function () { notificationService.info("<strong>Heads up! </strong> Dude", "<strong>Check this </strong> This alert needs your attention, but it's not super important.", { "closeButton": true, }); };
        $scope.notificationWarning = function () {notificationService.warning("<strong>Warning! </strong>  Warning", "<strong>Warning! </strong> Best check yo self, you're not looking too good.", { "progressBar": true, "positionClass": "toast-top-left", "showDuration": "3000"});};
        $scope.notificationError = function () { notificationService.error("<strong>Warning! </strong> something is Wrong","Best check yo self, you're not looking too good. Change a few things up and try submitting again."); };


        $scope.mydate = new Date();
        $scope.counter = 0;
        $scope.images = [];
        $scope.fileAdded = function (img) { alert(img.fileName); };
        $scope.texthtml = '<p>$("#my-tabs").tabs({<br />&nbsp;&nbsp;&nbsp; activate: function(event, ui) {<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; $("#calendar").fullCalendar("render");<br />&nbsp;&nbsp;&nbsp; }<br />});</p> ';

        $scope.mapselected = {};
        $scope.maprerender = false;

        $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
            var a = e.target; // activated tab
            var b = e.relatedTarget; // previous tab
            if (e.target.innerText == "mmMap") {
                $scope.$apply(function() {
                    $scope.maprerender = true;
                    $scope.locations = [{ "lat": 47.602546250550006, "lng": -122.3385245574342, "html": "Seattle Ferry <br>First Info Window", "label": "Marker One" }, { "lat": 50.12553355541376, "lng": 8.721551945007263, "html": "Frankfurt<br>Second Info Window", "label": "Marker Two" }, { "lat": -35.28174503025667, "lng": 149.1287201618652, "html": "Canberra London Circuit <br>Third Info Window", "label": "Marker Three" }];
                });
            }
            if (e.target.innerText == "mmFullcalendar") {
                $scope.$apply(function () {
                    $scope.CalendarRerender = true;
                });
            }
        });

        $scope.timezonelist = [
    { label: "Alaskan/Hawaiian Time Zone",value:"HAV" ,cities: [{ value: "AK", name: "Alaska" }, { value: "HI", name: "Hawaii" }] },
    { label: "Pacific Time Zone", value: "PAS", cities: [{ value: "CA", name: "California" }, { value: "NV", name: "Nevada" }, { value: "OR", name: "Oregon" }, { value: "WA", name: "Washington" }] },
    { label: "Mountain Time Zone", value: "MON", cities: [{ value: "AZ", name: "Arizona" }, { value: "CO", name: "Colorado" }, { value: "ID", name: "Idaho" }, { value: "MT", name: "Montana" }, { value: "NE", name: "Nebraska" }, { value: "NM", name: "New Mexico" }, { value: "ND", name: "North Dakota" }, { value: "UT", name: "Utah" }, { value: "WY", name: "Wyoming" }] },
    { label: "Central Time Zone", value: "CEN", cities: [{ value: "AL", name: "Alabama" }, { value: "AR", name: "Arkansas" }, { value: "IL", name: "Illinois" }, { value: "IA", name: "Iowa" }, { value: "KS", name: "Kansas" }, { value: "KY", name: "Kentucky" }, { value: "LA", name: "Louisiana" }, { value: "MN", name: "Minnesota" }, { value: "MS", name: "Mississippi" }, { value: "MO", name: "Missouri" }, { value: "OK", name: "Oklahoma" }, { value: "SD", name: "South Dakota" }, { value: "TX", name: "Texas" }, { value: "TN", name: "Tennessee" }, { value: "WI", name: "Wisconsin" }] },
    { label: "Eastern Time Zone", value: "EAS", cities: [{ value: "CT", name: "Connecticut" }, { value: "DE", name: "Delaware" }, { value: "FL", name: "Florida" }, { value: "GA", name: "Georgia" },
        { value: "IN", name: "Indiana" }, { value: "ME", name: "Maine" }, { value: "MD", name: "Maryland" }, { value: "MA", name: "Massachusetts" }, { value: "MI", name: "Michigan" },
        { value: "NH", name: "New Hampshire" }, { value: "NJ", name: "New Jersey" }, { value: "NY", name: "New York" }, { value: "NC", name: "North Carolina" }, { value: "OH", name: "Ohio" },
        { value: "PA", name: "Pennsylvania" }, { value: "RI", name: "Rhode Island" }, { value: "SC", name: "South Carolina" }, { value: "VT", name: "Vermont" }, { value: "VA", name: "Virginia" }, { value: "WV", name: "West Virginia" }]
    }];
        $scope.ProductSubcategoryID = 0;
        $scope.subCategories = [{ "ProductSubcategoryID": 1, "ProductCategoryID": 1, "Name": "Mountain Bikes", "CategoryName": "Bikes" }, { "ProductSubcategoryID": 2, "ProductCategoryID": 1, "Name": "Road Bikes", "CategoryName": "Bikes" }, { "ProductSubcategoryID": 3, "ProductCategoryID": 1, "Name": "Touring Bikes", "CategoryName": "Bikes" }, { "ProductSubcategoryID": 4, "ProductCategoryID": 2, "Name": "Handlebars", "CategoryName": "Components" }, { "ProductSubcategoryID": 5, "ProductCategoryID": 2, "Name": "Bottom Brackets", "CategoryName": "Components" }, { "ProductSubcategoryID": 6, "ProductCategoryID": 2, "Name": "Brakes", "CategoryName": "Components" }, { "ProductSubcategoryID": 7, "ProductCategoryID": 2, "Name": "Chains", "CategoryName": "Components" }, { "ProductSubcategoryID": 8, "ProductCategoryID": 2, "Name": "Cranksets", "CategoryName": "Components" }, { "ProductSubcategoryID": 9, "ProductCategoryID": 2, "Name": "Derailleurs", "CategoryName": "Components" }, { "ProductSubcategoryID": 10, "ProductCategoryID": 2, "Name": "Forks", "CategoryName": "Components" }, { "ProductSubcategoryID": 11, "ProductCategoryID": 2, "Name": "Headsets", "CategoryName": "Components" }, { "ProductSubcategoryID": 12, "ProductCategoryID": 2, "Name": "Mountain Frames", "CategoryName": "Components" }, { "ProductSubcategoryID": 13, "ProductCategoryID": 2, "Name": "Pedals", "CategoryName": "Components" }, { "ProductSubcategoryID": 14, "ProductCategoryID": 2, "Name": "Road Frames", "CategoryName": "Components" }, { "ProductSubcategoryID": 15, "ProductCategoryID": 2, "Name": "Saddles", "CategoryName": "Components" }, { "ProductSubcategoryID": 16, "ProductCategoryID": 2, "Name": "Touring Frames", "CategoryName": "Components" }, { "ProductSubcategoryID": 17, "ProductCategoryID": 2, "Name": "Wheels", "CategoryName": "Components" }, { "ProductSubcategoryID": 18, "ProductCategoryID": 3, "Name": "Bib-Shorts", "CategoryName": "Clothing" }, { "ProductSubcategoryID": 19, "ProductCategoryID": 3, "Name": "Caps", "CategoryName": "Clothing" }, { "ProductSubcategoryID": 20, "ProductCategoryID": 3, "Name": "Gloves", "CategoryName": "Clothing" }, { "ProductSubcategoryID": 21, "ProductCategoryID": 3, "Name": "Jerseys", "CategoryName": "Clothing" }, { "ProductSubcategoryID": 22, "ProductCategoryID": 3, "Name": "Shorts", "CategoryName": "Clothing" }, { "ProductSubcategoryID": 23, "ProductCategoryID": 3, "Name": "Socks", "CategoryName": "Clothing" }, { "ProductSubcategoryID": 24, "ProductCategoryID": 3, "Name": "Tights", "CategoryName": "Clothing" }, { "ProductSubcategoryID": 25, "ProductCategoryID": 3, "Name": "Vests", "CategoryName": "Clothing" }, { "ProductSubcategoryID": 26, "ProductCategoryID": 4, "Name": "Bike Racks", "CategoryName": "Accessories" }, { "ProductSubcategoryID": 27, "ProductCategoryID": 4, "Name": "Bike Stands", "CategoryName": "Accessories" }, { "ProductSubcategoryID": 28, "ProductCategoryID": 4, "Name": "Bottles and Cages", "CategoryName": "Accessories" }, { "ProductSubcategoryID": 29, "ProductCategoryID": 4, "Name": "Cleaners", "CategoryName": "Accessories" }, { "ProductSubcategoryID": 30, "ProductCategoryID": 4, "Name": "Fenders", "CategoryName": "Accessories" }, { "ProductSubcategoryID": 31, "ProductCategoryID": 4, "Name": "Helmets", "CategoryName": "Accessories" }, { "ProductSubcategoryID": 32, "ProductCategoryID": 4, "Name": "Hydration Packs", "CategoryName": "Accessories" }, { "ProductSubcategoryID": 33, "ProductCategoryID": 4, "Name": "Lights", "CategoryName": "Accessories" }, { "ProductSubcategoryID": 34, "ProductCategoryID": 4, "Name": "Locks", "CategoryName": "Accessories" }, { "ProductSubcategoryID": 35, "ProductCategoryID": 4, "Name": "Panniers", "CategoryName": "Accessories" }, { "ProductSubcategoryID": 36, "ProductCategoryID": 4, "Name": "Pumps", "CategoryName": "Accessories" }, { "ProductSubcategoryID": 37, "ProductCategoryID": 4, "Name": "Tires and Tubes", "CategoryName": "Accessories" }];
        $scope.tasks = [{ title: "A very important task", due: "1 hour left", completed: false, order: 1, priority: "high" }, { title: "A very important task", due: "58 minutes left", completed: true, order: 2, priority: "normal" }, { title: "A regular task", due: "", completed: true, order: 3, priority: "normal" }, { title: "A regular task", due: "", completed: false, order: 4, priority: "normal" }, { title: "A regular task", due: "", completed: false, order: 5, priority: "normal" }, { title: "An unimportant task", due: "", completed: false, order: 6, priority: "low" }, { title: "An unimportant task", due: "", completed: false, order: 7, priority: "low" }, { title: "A regular task", due: "", completed: false, order: 8, priority: "high" }, { title: "An unimportant task", due: "", completed: false, order: 9, priority: "low" }];


        $scope.users = [{ id: 1, image: '/assets/demo/avatars/2.jpg', firstName: 'Murat', lastName: 'Mercan', username: '@mmercan', fullname: 'Robert Jang', email: 'murat_mercan@hotmail.com', text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore. ', label: 'Lorem ipsum dolor sit amet ' },
            { id: 2, image: '/assets/demo/avatars/3.jpg', firstName: 'scott', lastName: 'hanselman', username: '@hanselman ', fullname: 'Michelle Bortz', email: 'scott@hanselman.com', text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore. ', label: 'Lorem ipsum dolor sit amet ' },
            { id: 3, image: '/assets/demo/avatars/4.jpg', firstName: 'Timothy', lastName: 'Owens', username: '@towens ', fullname: 'Timothy Owens', email: 'towens@example.com', text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore. ', label: 'Lorem ipsum dolor sit amet ' },
            { id: 4, image: '/assets/demo/avatars/5.jpg', firstName: 'Denise', lastName: 'Steiner', username: '@dsteiner ', fullname: 'Denise Steiner', email: 'dsteiner@example.com', text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore. ', label: 'Lorem ipsum dolor sit amet ' }];
        $scope.usercolumns = ['id', 'username', 'fullname', 'email'];

        $scope.emails=[
              {id:1,from:"Facebook",tag:"Social",unread:true,starred:false,attachment:null,subject:"Reset your account password",date:"3:25 PM"},
            {id:2,from:"Dropbox",tag:"",unread:false,starred:true,attachment:"",subject:"Complete your Dropbox setup!",date:"Yesterday, 1:15 PM"},
             {id:3,from:"Michelle Bortz",tag:"Work",unread:true,starred:true,attachment:"a.jpg",subject:"New design concepts",date:""},
            {id:4,from:"TaskManager",tag:"",unread:false,starred:true,attachment:"",subject:"You have 5 uncompleted tasks!",date:"Mar 27"},
            {id:5,from:"GitHub",tag:"",unread:false,starred:true,attachment:"",subject:"[GitHub] Your password has changed",date:"Mar 26"},
            { id: 6, from: "Timothy Owens", tag: "", unread: false, starred: true, attachment: "", subject: "Hi John! How are you?", date: "Mar 25" },
             {id:7,from:"Master Yoda",tag:"",unread:false,starred:true,attachment:"",subject:"You're ready, young padawan.",date:"Mar 24"},
            

               { id: 8, from: "Facebook", tag: "Social", unread: true, starred: false, attachment: null, subject: "Reset your account password", date: "Mar 23" },
            { id: 9, from: "Dropbox", tag: "", unread: false, starred: false, attachment: "", subject: "Complete your Dropbox setup!", date: "Mar 22" },
             { id: 10, from: "Michelle Bortz", tag: "Work", unread: true, starred: false, attachment: "a.jpg", subject: "New design concepts", date: "Mar 21" },
            { id:11, from: "TaskManager", tag: "", unread: false, starred: false, attachment: "", subject: "You have 5 uncompleted tasks!", date: "Mar 22" },
            { id: 12, from: "GitHub", tag: "", unread: false, starred: true, attachment: "", subject: "[GitHub] Your password has changed", date: "Mar 21" },
            { id: 13, from: "Timothy Owens", tag: "", unread: false, starred: false, attachment: "", subject: "Hi John! How are you?", date: "Mar 20" },
             {id:14,from:"Master Yoda",tag:"",unread:false,starred:false,attachment:"",subject:"You're ready, young padawan.",date:"Mar 24"},

               { id: 15, from: "Facebook", tag: "Social", unread: true, starred: false, attachment: null, subject: "Reset your account password", date: "Feb 27" },
            { id: 16, from: "Dropbox", tag: "", unread: false, starred: false, attachment: "", subject: "Complete your Dropbox setup!", date: "Feb 20" },
             { id: 17, from: "Michelle Bortz", tag: "Work", unread: true, starred: true, attachment: "a.jpg", subject: "New design concepts", date: "Feb 2" },
            { id: 18, from: "TaskManager", tag: "", unread: false, starred: true, attachment: "", subject: "You have 5 uncompleted tasks!", date: "Jan 27" },
            { id: 19, from: "GitHub", tag: "", unread: false, starred: false, attachment: "", subject: "[GitHub] Your password has changed", date: "Jan 20" },
            { id: 20, from: "Timothy Owens", tag: "", unread: false, starred: false, attachment: "", subject: "Hi John! How are you?", date: "Jan 2" },
             { id: 21, from: "Master Yoda", tag: "", unread: false, starred: true, attachment: "", subject: "You're ready, young padawan.", date: "Jan 2" }
            
        ];


        $scope.detailClicked = function(data) {
            alert("Detail Clicked " + data.email);
        };
        $scope.saveClicked = function (data) {
            alert("Save Clicked "  + data.email);
        };
        $scope.deleteClicked = function (data) {
            alert("delete Clicked " + data.email);
        };



        $scope.stepchanged = function (data) {
            if (data.currentPage=1 && data.targetedPage==2 && $scope.user.gender == "M") {
                alert("Select Female to continue");
                return true;
            }
        }

        $scope.mytime = new Date();

        $scope.changed = function () {
            console.log('Time changed to: ' + $scope.mytime);
        };



        $http.get("/Productsjson.txt").success(function (result) {
            $scope.products = result;
            if ($routeParams.id && $routeParams.id != "new") {
                $scope.productID = 743;
                $scope.currentItem = dataContext.Products.getLocalById($routeParams.id);
                $scope.assemblyTree = [{ "$id": "2", "ProductAssembly": "Blade", "ComponentName": "Metal Sheet 5", "BillOfMaterialsID": 2433, "ProductAssemblyID": 316, "ComponentID": 486, "StartDate": "2004-09-05T00:00:00", "EndDate": null, "UnitMeasureCode": "EA ", "BOMLevel": 4, "PerAssemblyQty": 1.00 }, { "$id": "3", "ProductAssembly": "Chain Stays", "ComponentName": "Metal Sheet 5", "BillOfMaterialsID": 1290, "ProductAssemblyID": 324, "ComponentID": 486, "StartDate": "2004-07-10T00:00:00", "EndDate": null, "UnitMeasureCode": "EA ", "BOMLevel": 3, "PerAssemblyQty": 1.00 }, { "$id": "4", "ProductAssembly": "Down Tube", "ComponentName": "Metal Sheet 3", "BillOfMaterialsID": 875, "ProductAssemblyID": 327, "ComponentID": 483, "StartDate": "2004-06-26T00:00:00", "EndDate": null, "UnitMeasureCode": "EA ", "BOMLevel": 3, "PerAssemblyQty": 1.00 }, { "$id": "5", "ProductAssembly": "Fork Crown", "ComponentName": "Metal Sheet 5", "BillOfMaterialsID": 492, "ProductAssemblyID": 350, "ComponentID": 486, "StartDate": "2004-04-18T00:00:00", "EndDate": null, "UnitMeasureCode": "EA ", "BOMLevel": 4, "PerAssemblyQty": 1.00 }, { "$id": "6", "ProductAssembly": "Fork End", "ComponentName": "Metal Sheet 2", "BillOfMaterialsID": 1289, "ProductAssemblyID": 331, "ComponentID": 482, "StartDate": "2004-07-10T00:00:00", "EndDate": null, "UnitMeasureCode": "EA ", "BOMLevel": 4, "PerAssemblyQty": 1.00 }, { "$id": "7", "ProductAssembly": "Head Tube", "ComponentName": "Metal Sheet 4", "BillOfMaterialsID": 3338, "ProductAssemblyID": 399, "ComponentID": 485, "StartDate": "2005-01-23T00:00:00", "EndDate": null, "UnitMeasureCode": "EA ", "BOMLevel": 3, "PerAssemblyQty": 1.00 }, { "$id": "8", "ProductAssembly": "HL Fork", "ComponentName": "Blade", "BillOfMaterialsID": 2301, "ProductAssemblyID": 804, "ComponentID": 316, "StartDate": "2004-09-05T00:00:00", "EndDate": null, "UnitMeasureCode": "EA ", "BOMLevel": 3, "PerAssemblyQty": 2.00 }, { "$id": "9", "ProductAssembly": "HL Fork", "ComponentName": "Fork Crown", "BillOfMaterialsID": 1204, "ProductAssemblyID": 804, "ComponentID": 350, "StartDate": "2004-09-09T00:00:00", "EndDate": null, "UnitMeasureCode": "EA ", "BOMLevel": 3, "PerAssemblyQty": 1.00 }, { "$id": "10", "ProductAssembly": "HL Fork", "ComponentName": "Fork End", "BillOfMaterialsID": 17, "ProductAssemblyID": 804, "ComponentID": 331, "StartDate": "2004-04-04T00:00:00", "EndDate": null, "UnitMeasureCode": "EA ", "BOMLevel": 3, "PerAssemblyQty": 2.00 }, { "$id": "11", "ProductAssembly": "HL Fork", "ComponentName": "Steerer", "BillOfMaterialsID": 3403, "ProductAssemblyID": 804, "ComponentID": 531, "StartDate": "2005-01-23T00:00:00", "EndDate": null, "UnitMeasureCode": "EA ", "BOMLevel": 3, "PerAssemblyQty": 1.00 }, { "$id": "12", "ProductAssembly": "HL Mountain Frame - Black, 42", "ComponentName": "Chain Stays", "BillOfMaterialsID": 1388, "ProductAssemblyID": 743, "ComponentID": 324, "StartDate": "2004-07-10T00:00:00", "EndDate": null, "UnitMeasureCode": "EA ", "BOMLevel": 2, "PerAssemblyQty": 2.00 }, { "$id": "13", "ProductAssembly": "HL Mountain Frame - Black, 42", "ComponentName": "Decal 1", "BillOfMaterialsID": 1849, "ProductAssemblyID": 743, "ComponentID": 325, "StartDate": "2004-07-20T00:00:00", "EndDate": null, "UnitMeasureCode": "EA ", "BOMLevel": 2, "PerAssemblyQty": 2.00 }, { "$id": "14", "ProductAssembly": "HL Mountain Frame - Black, 42", "ComponentName": "Decal 2", "BillOfMaterialsID": 3421, "ProductAssemblyID": 743, "ComponentID": 326, "StartDate": "2005-01-23T00:00:00", "EndDate": null, "UnitMeasureCode": "EA ", "BOMLevel": 2, "PerAssemblyQty": 1.00 }, { "$id": "15", "ProductAssembly": "HL Mountain Frame - Black, 42", "ComponentName": "Down Tube", "BillOfMaterialsID": 2509, "ProductAssemblyID": 743, "ComponentID": 327, "StartDate": "2004-09-05T00:00:00", "EndDate": null, "UnitMeasureCode": "EA ", "BOMLevel": 2, "PerAssemblyQty": 1.00 }, { "$id": "16", "ProductAssembly": "HL Mountain Frame - Black, 42", "ComponentName": "Head Tube", "BillOfMaterialsID": 3158, "ProductAssemblyID": 743, "ComponentID": 399, "StartDate": "2005-01-15T00:00:00", "EndDate": null, "UnitMeasureCode": "EA ", "BOMLevel": 2, "PerAssemblyQty": 1.00 }, { "$id": "17", "ProductAssembly": "HL Mountain Frame - Black, 42", "ComponentName": "HL Fork", "BillOfMaterialsID": 172, "ProductAssemblyID": 743, "ComponentID": 804, "StartDate": "2004-04-04T00:00:00", "EndDate": null, "UnitMeasureCode": "EA ", "BOMLevel": 2, "PerAssemblyQty": 1.00 }, { "$id": "18", "ProductAssembly": "HL Mountain Frame - Black, 42", "ComponentName": "Paint - Black", "BillOfMaterialsID": 1389, "ProductAssemblyID": 743, "ComponentID": 492, "StartDate": "2004-07-10T00:00:00", "EndDate": null, "UnitMeasureCode": "OZ ", "BOMLevel": 2, "PerAssemblyQty": 8.00 }, { "$id": "19", "ProductAssembly": "HL Mountain Frame - Black, 42", "ComponentName": "Seat Stays", "BillOfMaterialsID": 574, "ProductAssemblyID": 743, "ComponentID": 532, "StartDate": "2004-04-18T00:00:00", "EndDate": null, "UnitMeasureCode": "EA ", "BOMLevel": 2, "PerAssemblyQty": 4.00 }, { "$id": "20", "ProductAssembly": "HL Mountain Frame - Black, 42", "ComponentName": "Seat Tube", "BillOfMaterialsID": 955, "ProductAssemblyID": 743, "ComponentID": 533, "StartDate": "2004-06-26T00:00:00", "EndDate": null, "UnitMeasureCode": "EA ", "BOMLevel": 2, "PerAssemblyQty": 1.00 }, { "$id": "21", "ProductAssembly": "HL Mountain Frame - Black, 42", "ComponentName": "Top Tube", "BillOfMaterialsID": 173, "ProductAssemblyID": 743, "ComponentID": 534, "StartDate": "2004-04-04T00:00:00", "EndDate": null, "UnitMeasureCode": "EA ", "BOMLevel": 2, "PerAssemblyQty": 1.00 }, { "$id": "22", "ProductAssembly": "Seat Stays", "ComponentName": "Metal Sheet 7", "BillOfMaterialsID": 1769, "ProductAssemblyID": 532, "ComponentID": 484, "StartDate": "2004-09-19T00:00:00", "EndDate": null, "UnitMeasureCode": "EA ", "BOMLevel": 3, "PerAssemblyQty": 1.00 }, { "$id": "23", "ProductAssembly": "Seat Tube", "ComponentName": "Metal Bar 2", "BillOfMaterialsID": 100, "ProductAssemblyID": 533, "ComponentID": 478, "StartDate": "2004-04-04T00:00:00", "EndDate": null, "UnitMeasureCode": "EA ", "BOMLevel": 3, "PerAssemblyQty": 1.00 }, { "$id": "24", "ProductAssembly": "Steerer", "ComponentName": "Metal Sheet 6", "BillOfMaterialsID": 2094, "ProductAssemblyID": 531, "ComponentID": 487, "StartDate": "2004-08-08T00:00:00", "EndDate": null, "UnitMeasureCode": "EA ", "BOMLevel": 4, "PerAssemblyQty": 1.00 }, { "$id": "25", "ProductAssembly": "Top Tube", "ComponentName": "Metal Sheet 2", "BillOfMaterialsID": 491, "ProductAssemblyID": 534, "ComponentID": 482, "StartDate": "2004-04-18T00:00:00", "EndDate": null, "UnitMeasureCode": "EA ", "BOMLevel": 3, "PerAssemblyQty": 1.00 }];
                $scope.workorderAndSales = [{ "$id": "89", "ProductID": 770, "TotalSales": 2270, "Ordered": 2270, "Stocked": 2258, "Scrapped": 12, "NetStocked": -12 }];
                $scope.inventory = [{ "$id": "90", "ProductID": 770, "LocationID": 7, "Name": "Finished Goods Storage", "Shelf": "N/A", "Bin": 0, "Quantity": 104 }, { "$id": "91", "ProductID": 770, "LocationID": 60, "Name": "Final Assembly", "Shelf": "N/A", "Bin": 0, "Quantity": 123 }];
            }
        });
    }
]);