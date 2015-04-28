(function () {
    angular.module('data').factory("entitySet", ["$http", "progressBar", function ($http, progressBar) {

        var mapMemoToArray = function (items) {
            var underlyingArray = [];
            for (var prop in items) {
                if (items.hasOwnProperty(prop)) {
                    underlyingArray.push(items[prop]);
                }
            }
            return underlyingArray;
        };
        var itemsToArray = function (items, observableArray) {
            if (!observableArray) return null;
            var underlyingArray = mapMemoToArray(items);
            //observableArray.value = underlyingArray;
            observableArray.value = [];
            angular.copy(underlyingArray, observableArray.value);
            return observableArray;
        };
        var mapToContext = function (dtoList, items, results, mapper, idField) {
            items = _.reduce(dtoList, function (memo, dto) {
                var id;
                if (idField) {
                    id = dto[idField];
                } else {
                    id = dto.ID;
                }
                var existingItem = items[id];
                if (mapper) {
                    existingItem = existingItem || new mapper(dto);
                } else {
                    existingItem = existingItem || dto;
                }
                memo[id] = existingItem;
                return memo;
            }, {});
            //results = itemsToArray(items, results);
            //logger.info('received with ' + dtoList.length + ' elements');
            itemsToArray(items, results);
            return items; // must return these
        };
        var entitySet = function (baseurl, idField, mapper) {
            var items = {},
                observableArray = {},
                getData = function (results, force) {
                    return $.Deferred(function (def) {
                        observableArray = results;
                        if (!baseurl) {
                            progressBar.hideWithError("Url Missing");
                            def.reject();
                            return;
                        }
                        if (results.value != null && !!!force) {
                            def.resolve(results.value);
                        } else {
                            progressBar.show("Data Loading");
                            $http.get(baseurl, { cache: true }).then(
                                function (result) {
                                    items = mapToContext(result.data, items, results, mapper, idField);
                                    progressBar.hide("Data Loaded");
                                    //  results.value = itemsToArray(items, results.value);
                                    def.resolve(results.value);
                                },
                                function (error) {
                                    progressBar.hideWithError(error);
                                    def.reject();
                                }
                            );
                        }
                    }).promise();
                },
                getByid = function (id, results) {
                    return $.Deferred(function (def) {
                        progressBar.show("Data Loading");
                        observableArray = results;
                        if (!baseurl) {
                            progressBar.hideWithError("Url Missing");
                            def.reject();
                            return;
                        }

                        $http.get(baseurl + '/' + id).then(
                            function (result) {
                                items[id] = result.data;
                                itemsToArray(items, results);
                                progressBar.hide("Data Loaded");
                                def.resolve(result.data);
                            },
                            function (error) {
                                progressBar.hideWithError(error);
                                def.reject();
                            }
                        );


                    }).promise();
                },
                getCustomData = function (customUrl, results) {
                    return $.Deferred(function (def) {
                        progressBar.show("Data Loading");
                        observableArray = results;
                        if (!customUrl) {
                            progressBar.hideWithError("Get Function is Missing");
                            def.reject();
                            return;
                        }
                        $http.get(customUrl, { cache: true }).then(
                              function (result) {
                                  items = mapToContext(result.data, items, results, mapper, idField);
                                  progressBar.hide("Data Loaded");
                                  def.resolve(results.value);
                              },
                           function (error) {
                               progressBar.hideWithError(error);
                               def.reject();
                           });
                    }).promise();
                },
                 getHttp = function (customUrl) {
                     return $.Deferred(function (def) {
                         progressBar.show("Data Loading");
                         if (!customUrl) {
                             progressBar.hideWithError("Get Function is Missing");
                             def.reject();
                             return;
                         }
                         $http.get(customUrl, { cache: true }).then(
                               function (result) {
                                  // items = mapToContext(result.data, items, results, mapper, idField);
                                   progressBar.hide("Data Loaded");
                                   def.resolve(result.data);
                               },
                            function (error) {
                                progressBar.hideWithError(error);
                                def.reject();
                            });
                     }).promise();
                 },

                insertData = function (item) {
                    return $.Deferred(function (def) {
                        progressBar.show("Data Inserting");
                        if (item == null) return;
                        //var itemjson = item.ToJSON();
                        if (!baseurl) {
                            progressBar.hideWithError('insert function not implemented');
                            def.reject();
                            return;
                        }
                        $http.post(baseurl, item).then(
                            function (result) {
                                progressBar.hide("Data Loaded");
                                def.resolve(result.data);
                            },
                            function (error) {
                                progressBar.hideWithError(error);
                                def.reject(error);
                            }
                        );

                    }).promise();
                },
                insertDataAddLocal = function (item) {
                    return insertData(item).then(function (result) {
                        if (result && result[idField]) {
                            //var id = result.data[idField];
                            //items[id] = result.data;
                            item[idField] = result[idField];
                            addlocal(result);
                        }
                    });
                },
                updateData = function (item) {
                    return $.Deferred(function (def) {
                        progressBar.show("Data updating");
                        if (item == null) return;
                        //var itemjson = item.ToJSON();
                        if (!baseurl) {
                            progressBar.hideWithError('Update function not implemented');
                            def.reject();
                            return;
                        }
                        $http.put(baseurl, item).then(
                            function (result) {
                                progressBar.hide("Data Loaded");
                                var returnResult = "";
                                if (result.data && result.data[idField] && items[result.data[idField]]) {
                                    var id = result.data[idField];
                                    items[id] = result.data;
                                    returnResult = result.data;
                                } else {
                                    var id = item[idField];
                                    items[id] = item;
                                    returnResult = item;
                                }
                                itemsToArray(items, observableArray);

                                def.resolve(returnResult);
                            },
                            function (error) {
                                progressBar.hideWithError(error);
                                def.reject(error);
                            }
                        );
                    }).promise();
                },
                insertorUpdateData = function (item) {
                    return item[idField] ? updateData(item) : insertDataAddLocal(item);
                },
                deleteData = function (id) {
                    return $.Deferred(function (def) {
                        progressBar.show("Data deleting");
                        if (item == null) return;
                        //var itemjson = item.ToJSON();
                        if (!baseurl) {
                            progressBar.hideWithError('delete function not implemented');
                            def.reject();
                            return;
                        }
                        $http.delete(baseurl + '?id=' + id).then(
                            function (result) {
                                progressBar.hide("Data Loaded");
                                //if (result.data && result.data[idField] && items[result.data[idField]]) {
                                //    var id = result.data[idField];
                                //    items[id] = result.data;
                                //}
                                //itemsToArray(items, observableArray);
                                def.resolve(result.data);
                            },
                            function (error) {
                                progressBar.hideWithError(error);
                                def.reject(error);
                            }
                        );
                    }).promise();
                },
                deleteDataRemovelocal = function (item) {
                    return $.Deferred(function (def) {
                        if (item && item[idField]) {
                            deleteData(item[idField]).then(function (result) {
                                removelocalById(result[idField]);
                                def.resolve(result);
                            }, function (error) {
                                def.reject(error);
                            });
                        } else {
                            def.reject("Item or ID undefined");
                        }
                    }).promise();
                },
                getAllLocal = function () {
                    return mapMemoToArray(items);
                },
                getLocalbyId = function (id) {
                    return !!id && !!items[id] ? items[id] : null;
                },
                addlocal = function (item) {
                    if (idField) {
                        items[item[idField]] = item;
                    } else {
                        items[item.ID] = item;
                    }
                    itemsToArray(items, observableArray);
                },
                removelocalById = function (id) {
                    delete items[id];
                    itemsToArray(items, observableArray);
                };

            return {
                getData: getData,
                getByid: getByid,
                getCustomData: getCustomData,
                getHttp:getHttp,
                insertData: insertData,
                updateData: updateData,
                deleteData: deleteData,
                getAllLocal: getAllLocal,
                getLocalbyId: getLocalbyId,
                addlocal: addlocal,
                removelocalById: removelocalById,
                insertDataAddLocal: insertDataAddLocal,
                deleteDataRemovelocal: deleteDataRemovelocal,
                insertorUpdateData: insertorUpdateData,
            };
        };
        return entitySet;
    }]);
})();