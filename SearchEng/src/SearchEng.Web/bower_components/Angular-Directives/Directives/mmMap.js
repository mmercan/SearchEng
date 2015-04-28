//<mm-treeview itemssource="assemb" selected-id="selectidid" nullvalue="'749'" selectedtext="selectedText" idfield="ComponentID" textfield="ComponentName" parentfield="ProductAssemblyID"></mm-treeview>
(function () {
    //---Jquery IU required---//
    angular.module('directives').directive('mmMap', function () {
        return {
            restrict: 'A',
            scope: {
                itemssource: '=',
                latitudefield: '@',
                longitudefield: '@',
                center: '=',
                isgeojson: '@',
                itemselected: "&",
                selecteditem: '=',
                rerender:'=',
            },
            link: function (scope, element, attrs) {

                //var mapOptions = {
                //    center: new google.maps.LatLng(-34.397, 150.644),
                //    zoom: 8
                //};
                //var map = new google.maps.Map(element[0],
                //    mapOptions);


                if (!window.google) {
                    return;
                }
                var geocoder = new window.google.maps.Geocoder();
                var myOptions = { zoom: 2, center: new window.google.maps.LatLng(12.24, 24.54), mapTypeId: 'terrain' };
                var map = new window.google.maps.Map($(element)[0], myOptions);

                try {
                    map.clearOverlays();
                } catch (err) {
                }
                var draggable = true;
                if (attrs.draggable == "false") {
                    draggable = false
                }

                scope.$watch("rerender", function (newvalue) {
                    if (newvalue && newvalue == true) {
                        window.google.maps.event.trigger(map, 'resize');
                        map.setZoom(map.getZoom());
                        scope.rerender = false;
                    }
                });

                var AddValueToLocation = function (value, map, scope) {
                    var Latitude = null; scope.latitudefield ? Latitude = value[scope.latitudefield] : value.Latitude;
                    var Longitude = null; scope.longitudefield ? Longitude = value[scope.longitudefield] : value.LatitudeLongitude;
                    var position = new window.google.maps.LatLng(Latitude, Longitude);

                    var marker = new window.google.maps.Marker({
                        map: map,
                        draggable: draggable,
                        position: position,
                        title: name
                    });
                    //value.Longitude.subscribe(function (val) {
                    //    var lat = value.Latitude();
                    //    var lng = value.Longitude();
                    //    var newLatLng = new google.maps.LatLng(lat, lng);
                    //    marker.setPosition(newLatLng);
                    //});

                    value._mapMarker = marker;
                    if (!scope.markersArray) { scope.markersArray = []; }
                    scope.markersArray[value.ID] = value;

                    window.google.maps.event.addListener(marker, 'position_changed',
                        function () {
                            scope.latitudefield ? value[scope.latitudefield] = marker.position.lat() : value.Latitude = marker.position.lat();
                            scope.longitudefield ? value[scope.longitudefield] = marker.position.lng() : value.LatitudeLongitude = marker.position.lng();

                        });

                    if (scope.itemselected || scope.selecteditem) {
                        window.google.maps.event.addListener(marker, 'click',
                           function () {
                               if (scope.selecteditem) {
                                   scope.selecteditem = value;
                               }

                               scope.$apply(function () {
                                   scope.selecteditem = value;
                               });

                               if (scope.itemselected) {
                                   var itemselectedHandler = scope.itemselected();
                                   if (itemselectedHandler) {
                                       itemselectedHandler(value);
                                   }
                               }

                           });
                    }
                };



                scope.$watch("itemssource", function (newValue) {
                    if (scope.itemssource) {

                        try {
                            map.clearOverlays();
                        } catch (err) {
                        }


                        $.each(scope.itemssource, function (index, value) {
                            AddValueToLocation(value, map, scope);
                        });
                    }

                });





                //var mapdetail = new google.maps.Map($('#mapDetail_canvas')[0], myOptions);
                //allBindingsAccessor().GoogleMap.clearOverlays();
                //AddValueToLocation(allBindingsAccessor().map, allBindingsAccessor().GoogleMap);
                // var position = new google.maps.LatLng(allBindingsAccessor().latitude(), allBindingsAccessor().longitude());
                // var marker = new google.maps.Marker({
                //     map: allBindingsAccessor().map,
                //     draggable: true,
                //     position: position,
                //     title: name
                // });

                // value._mapMarker = marker;
                //// markersArray.push(value);
                // markersArray[value.ID()] = value;
                // google.maps.event.addListener(marker, 'position_changed',
                //     function () {
                //         viewModel.Latitude(marker.position.lat());
                //         viewModel.Longitude(marker.position.lng());
                //     });



            },
            controller: function ($scope, $element, $attrs) {

            },
        }
    });


    angular.module('directives').directive('mmMapCollection', function () {
        return {
            restrict: 'E',
            scope: {
            },
            link: function (scope, element, attrs) {



            },
            controller: function ($scope, $element, $attrs) {

            },
        }
    });

    if (window.google && window.google.maps) {
        window.google.maps.Map.prototype.clearOverlays = function () {
            if (markersArray) {
                //for (var i = 0; i < markersArray.length; i++) {
                //    markersArray[i]._mapMarker.setMap(null);
                //    markersArray[i]._mapMarker=null;

                //}
                for (var item in markersArray) {
                    markersArray[item]._mapMarker.setMap(null);
                    markersArray[item]._mapMarker = null;
                }
            }
            markersArray = [];
        }
    }


    //var GeoJSON = function (geojson, options) {

    //    var _geometryToGoogleMaps = function (geojsonGeometry, options, geojsonProperties) {

    //        var googleObj, opts = _copy(options);

    //        switch (geojsonGeometry.type) {
    //            case "Point":
    //                opts.position = new google.maps.LatLng(geojsonGeometry.coordinates[1], geojsonGeometry.coordinates[0]);
    //                googleObj = new google.maps.Marker(opts);
    //                if (geojsonProperties) {
    //                    googleObj.set("geojsonProperties", geojsonProperties);
    //                }
    //                break;

    //            case "MultiPoint":
    //                googleObj = [];
    //                for (var i = 0; i < geojsonGeometry.coordinates.length; i++) {
    //                    opts.position = new google.maps.LatLng(geojsonGeometry.coordinates[i][1], geojsonGeometry.coordinates[i][0]);
    //                    googleObj.push(new google.maps.Marker(opts));
    //                }
    //                if (geojsonProperties) {
    //                    for (var k = 0; k < googleObj.length; k++) {
    //                        googleObj[k].set("geojsonProperties", geojsonProperties);
    //                    }
    //                }
    //                break;

    //            case "LineString":
    //                var path = [];
    //                for (var i = 0; i < geojsonGeometry.coordinates.length; i++) {
    //                    var coord = geojsonGeometry.coordinates[i];
    //                    var ll = new google.maps.LatLng(coord[1], coord[0]);
    //                    path.push(ll);
    //                }
    //                opts.path = path;
    //                googleObj = new google.maps.Polyline(opts);
    //                if (geojsonProperties) {
    //                    googleObj.set("geojsonProperties", geojsonProperties);
    //                }
    //                break;

    //            case "MultiLineString":
    //                googleObj = [];
    //                for (var i = 0; i < geojsonGeometry.coordinates.length; i++) {
    //                    var path = [];
    //                    for (var j = 0; j < geojsonGeometry.coordinates[i].length; j++) {
    //                        var coord = geojsonGeometry.coordinates[i][j];
    //                        var ll = new google.maps.LatLng(coord[1], coord[0]);
    //                        path.push(ll);
    //                    }
    //                    opts.path = path;
    //                    googleObj.push(new google.maps.Polyline(opts));
    //                }
    //                if (geojsonProperties) {
    //                    for (var k = 0; k < googleObj.length; k++) {
    //                        googleObj[k].set("geojsonProperties", geojsonProperties);
    //                    }
    //                }
    //                break;

    //            case "Polygon":
    //                var paths = [];
    //                var exteriorDirection;
    //                var interiorDirection;
    //                for (var i = 0; i < geojsonGeometry.coordinates.length; i++) {
    //                    var path = [];
    //                    for (var j = 0; j < geojsonGeometry.coordinates[i].length; j++) {
    //                        var ll = new google.maps.LatLng(geojsonGeometry.coordinates[i][j][1], geojsonGeometry.coordinates[i][j][0]);
    //                        path.push(ll);
    //                    }
    //                    if (!i) {
    //                        exteriorDirection = _ccw(path);
    //                        paths.push(path);
    //                    } else if (i == 1) {
    //                        interiorDirection = _ccw(path);
    //                        if (exteriorDirection == interiorDirection) {
    //                            paths.push(path.reverse());
    //                        } else {
    //                            paths.push(path);
    //                        }
    //                    } else {
    //                        if (exteriorDirection == interiorDirection) {
    //                            paths.push(path.reverse());
    //                        } else {
    //                            paths.push(path);
    //                        }
    //                    }
    //                }
    //                opts.paths = paths;
    //                googleObj = new google.maps.Polygon(opts);
    //                if (geojsonProperties) {
    //                    googleObj.set("geojsonProperties", geojsonProperties);
    //                }
    //                break;

    //            case "MultiPolygon":
    //                googleObj = [];
    //                for (var i = 0; i < geojsonGeometry.coordinates.length; i++) {
    //                    var paths = [];
    //                    var exteriorDirection;
    //                    var interiorDirection;
    //                    for (var j = 0; j < geojsonGeometry.coordinates[i].length; j++) {
    //                        var path = [];
    //                        for (var k = 0; k < geojsonGeometry.coordinates[i][j].length; k++) {
    //                            var ll = new google.maps.LatLng(geojsonGeometry.coordinates[i][j][k][1], geojsonGeometry.coordinates[i][j][k][0]);
    //                            path.push(ll);
    //                        }
    //                        if (!j) {
    //                            exteriorDirection = _ccw(path);
    //                            paths.push(path);
    //                        } else if (j == 1) {
    //                            interiorDirection = _ccw(path);
    //                            if (exteriorDirection == interiorDirection) {
    //                                paths.push(path.reverse());
    //                            } else {
    //                                paths.push(path);
    //                            }
    //                        } else {
    //                            if (exteriorDirection == interiorDirection) {
    //                                paths.push(path.reverse());
    //                            } else {
    //                                paths.push(path);
    //                            }
    //                        }
    //                    }
    //                    opts.paths = paths;
    //                    googleObj.push(new google.maps.Polygon(opts));
    //                }
    //                if (geojsonProperties) {
    //                    for (var k = 0; k < googleObj.length; k++) {
    //                        googleObj[k].set("geojsonProperties", geojsonProperties);
    //                    }
    //                }
    //                break;

    //            case "GeometryCollection":
    //                googleObj = [];
    //                if (!geojsonGeometry.geometries) {
    //                    googleObj = _error("Invalid GeoJSON object: GeometryCollection object missing \"geometries\" member.");
    //                } else {
    //                    for (var i = 0; i < geojsonGeometry.geometries.length; i++) {
    //                        googleObj.push(_geometryToGoogleMaps(geojsonGeometry.geometries[i], opts, geojsonProperties || null));
    //                    }
    //                }
    //                break;

    //            default:
    //                googleObj = _error("Invalid GeoJSON object: Geometry object must be one of \"Point\", \"LineString\", \"Polygon\" or \"MultiPolygon\".");
    //        }

    //        return googleObj;

    //    };

    //    var _error = function (message) {

    //        return {
    //            type: "Error",
    //            message: message
    //        };

    //    };

    //    var _ccw = function (path) {
    //        var isCCW;
    //        var a = 0;
    //        for (var i = 0; i < path.length - 2; i++) {
    //            a += ((path[i + 1].lat() - path[i].lat()) * (path[i + 2].lng() - path[i].lng()) - (path[i + 2].lat() - path[i].lat()) * (path[i + 1].lng() - path[i].lng()));
    //        }
    //        if (a > 0) {
    //            isCCW = true;
    //        }
    //        else {
    //            isCCW = false;
    //        }
    //        return isCCW;
    //    };

    //    var _copy = function (obj) {
    //        var newObj = {};
    //        for (var i in obj) {
    //            if (obj.hasOwnProperty(i)) {
    //                newObj[i] = obj[i];
    //            }
    //        }
    //        return newObj;
    //    };

    //    var obj;

    //    var opts = options || {};

    //    switch (geojson.type) {

    //        case "FeatureCollection":
    //            if (!geojson.features) {
    //                obj = _error("Invalid GeoJSON object: FeatureCollection object missing \"features\" member.");
    //            } else {
    //                obj = [];
    //                for (var i = 0; i < geojson.features.length; i++) {
    //                    obj.push(_geometryToGoogleMaps(geojson.features[i].geometry, opts, geojson.features[i].properties));
    //                }
    //            }
    //            break;

    //        case "GeometryCollection":
    //            if (!geojson.geometries) {
    //                obj = _error("Invalid GeoJSON object: GeometryCollection object missing \"geometries\" member.");
    //            } else {
    //                obj = [];
    //                for (var i = 0; i < geojson.geometries.length; i++) {
    //                    obj.push(_geometryToGoogleMaps(geojson.geometries[i], opts));
    //                }
    //            }
    //            break;

    //        case "Feature":
    //            if (!(geojson.properties && geojson.geometry)) {
    //                obj = _error("Invalid GeoJSON object: Feature object missing \"properties\" or \"geometry\" member.");
    //            } else {
    //                obj = _geometryToGoogleMaps(geojson.geometry, opts, geojson.properties);
    //            }
    //            break;

    //        case "Point": case "MultiPoint": case "LineString": case "MultiLineString": case "Polygon": case "MultiPolygon":
    //            obj = geojson.coordinates
    //                ? obj = _geometryToGoogleMaps(geojson, opts)
    //                : _error("Invalid GeoJSON object: Geometry object missing \"coordinates\" member.");
    //            break;

    //        default:
    //            obj = _error("Invalid GeoJSON object: GeoJSON object must be one of \"Point\", \"LineString\", \"Polygon\", \"MultiPolygon\", \"Feature\", \"FeatureCollection\" or \"GeometryCollection\".");

    //    }

    //    return obj;

    //};

})();