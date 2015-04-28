angular.module('component', ['ngRoute', 'directives', 'data']);


//angular.module('app', ['ngRoute', 'component', 'data']);
//angular.module('app').config(["$routeProvider", "$locationProvider", function ($routeProvider, $locationProvider) {
//$routeProvider.when('/', { templateUrl: '/App/templates/angularcomponents.html', controller: 'angularcomp' }).otherwise({ redirectTo: '/' });
//}]);
NorthwindSPA = angular.module('data', ['ngRoute', 'component']);
angular.module("component").filter('bytes', function () {
    return function (bytes, precision) {
        if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
        if (typeof precision === 'undefined') precision = 1;
        var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
			number = Math.floor(Math.log(bytes) / Math.log(1024));
        return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) + ' ' + units[number];
    }
});
(function () {
    angular.module('component').filter('gravatarfilter', ["gravatarService", function (gravatarService) {
        return function (input) {
            var result = gravatarService(input);
            var content = result;
            return result;
        }
    }]);
})();
(function () {
    angular.module('component').filter('momentfromnow', function () {
    return function (input) {

       var result = moment(input).fromNow();
       return result;
        //return input ;
    }});
})();
(function () {
    angular.module('component').filter('noparents', function () {
    return function (input) {

        var result = _.filter(input, function (item) {
            if (item && !item.ParentID ) {
                return true;
            }
        });
        return result;
        //return input ;
    }
});


angular.module('component').filter('children', function () {
    return function (input, array) {

        var result = _.filter(array, function (item) {
            if (item.ParentID  == input.ID) {
                return true;
            }
        });
        return result;
        //return input ;
    }
});
})();
(function () {
    angular.module('component').constant('alertDefaults', {
        type: 'warning',
        close_btn: true,
        classes: false,
        namespace: 'pa_page_alerts',
        animate: true,
        auto_close: false
    }).factory('alertService', ["alertDefaults", function (alertDefaults) {
     var   alertsContainerId = 'pa-page-alerts-box';
        var  typesHash = {
            warning: '',
            danger: 'alert-danger',
            success: 'alert-success',
            info: 'alert-info'
        };
        /* Add new alert.         * @param  {String} html     * @param  {Object} options */
        var add = function (html, options, type, autoClose) {
            var $alert, $alerts, $box, height, paddingBottom, paddingTop;
            options = $.extend({}, alertDefaults, options || {});
            if (type != null) {options.type = type;}
            if (autoClose != null && jQuery.isNumeric && jQuery && jQuery.isNumeric(autoClose)) {
                options['auto_close'] = autoClose;
            }
            $alert = $('<div class="alert alert-page ' + options.namespace + ' ' + typesHash[options.type] + '" />').html(html);
            if (options.classes) { $alert.addClass(options.classes);            }
            if (options.close_btn) {
                $alert.prepend($('<button type="button" data-dismiss="alert" class="close" />').html('&times;'));
            }
            if (options.animate) {                $alert.attr('data-animate', 'true');            }
            $box = $('#' + alertsContainerId);
            if (!$box.length) {
                $box = $('<div id="' + alertsContainerId + '" />').prependTo($('#alert-wrapper'));
            }
            $alerts = $('#' + alertsContainerId + ' .' + options.namespace);
            height = $alert.css({
                visibility: 'hidden',
                position: 'absolute',
                width: '100%'
            }).appendTo('body').outerHeight();
            paddingTop = $alert.css('padding-top');
            paddingBottom = $alert.css('padding-bottom');
            if (options.animate) {
                $alert.attr('style', '').css({
                    overflow: 'hidden',
                    height: 0,
                    'padding-top': 0,
                    'padding-bottom': 0
                });
            }
            if ($alerts.length) {
                $alerts.last().after($alert);
            } else {
                $box.append($alert);
            }
            if (options.animate) {
                return $alert.animate({
                    'height': height,
                    'padding-top': paddingTop,
                    'padding-bottom': paddingBottom
                }, 500, (function () {
                    return function () {
                        $alert.attr('style', '');
                        if (options.auto_close) {
                            return $.data($alert, 'timer', setTimeout(function () {
                                return close($alert);
                            }, options.auto_close * 1000));
                        }
                    };
                })(this));
            } else {
                return $alert.attr('style', '');
            }
        };

        var addDark = function(html, options, type,autoClose) {
            options = $.extend({}, alertDefaults, options || {});
            options.namespace = 'pa_page_alerts_dark';
            options.classes = 'alert-dark'; // add custom classes
            add(html, options, type,autoClose);
        };
        

        var addMoveTop = function (html, options, type, autoClose) {
            $('html,body').animate({ scrollTop: 0 }, 500);
            setTimeout(function () {
                add(html, options, type, autoClose);

            }, 800);
        }
        var addMoveTopDark = function (html, options, type, autoClose) {
            $('html,body').animate({ scrollTop: 0 }, 500);
            setTimeout(function () {
                addDark(html, options, type, autoClose);
            }, 800);
        }

        /* Close alert. @param  {jQuery Object} $alert          */

       var close = function ($alert) {
            if ($alert.attr('data-animate') === 'true') {
                return $alert.animate({
                    'height': 0,
                    'padding-top': 0,
                    'padding-bottom': 0
                }, 500, function () {
                    if ($.data($alert, 'timer')) {
                        clearTimeout($.data($alert, 'timer'));
                    }
                    return $alert.remove();
                });
            } else {
                if ($.data($alert, 'timer')) {
                    clearTimeout($.data($alert, 'timer'));
                }
                return $alert.remove();
            }
        };

        /* Close all alerts with specified namespace.     * @param  {Boolean} animate    * @param  {String} namespace         */

       var clear = function (animate, namespace) {
            var $alerts, self;
            if (animate == null) {
                animate = true;
            }
            if (namespace == null) {
                namespace = 'pa_page_alerts';
            }
            $alerts = $('#' + alertsContainerId + ' .' + namespace);
            if ($alerts.length) {
                self = this;
                if (animate) {
                    return $alerts.each(function () {
                        return self.close($(this));
                    });
                } else {
                    return $alerts.remove();
                }
            }
       };


        /* Close all alerts.         * @param  {Boolean} animate        */

        var clearAll = function (animate) {
            var self;
            if (animate == null) {
                animate = true;
            }
            if (animate) {
                self = this;
                return $('#' + alertsContainerId + ' .alert').each(function () {
                    return self.close($(this));
                });
            } else {
                return $('#' + alertsContainerId).remove();
            }
        };


        var AddSoundElement= function() {
            $('body').append('<audio style="display: none;" id="notificationSound" preload src="/NotificationSounds/sounds-882-solemn.mp3"></audio>');
        }
        AddSoundElement();

        var MakeSound = function (sound) {
            var soundfile = "/NotificationSounds/tick.mp3";
            switch (sound) {
            case "bell":
                soundfile = "/NotificationSounds/bell.mp3";
                break;
            case "harp":
                soundfile = "/NotificationSounds/harp.mp3";
                break;
                case "error":
                    soundfile = "/NotificationSounds/error.mp3";
                    break;
                case "no":
                    soundfile = "/NotificationSounds/no.mp3";
                    break;
                case "notify":
                    soundfile = "/NotificationSounds/notify.mp3";
                    break;
                case "success":
                    soundfile = "/NotificationSounds/success.mp3";
                    break;
                case "tick":
                    soundfile = "/NotificationSounds/tick.mp3";
                    break;
                case "warning":
                    soundfile = "/NotificationSounds/warning.mp3";
                    break;
                case "alien":
                    soundfile = "/NotificationSounds/alien.mp3";
                    break;
                case "cricket":
                    soundfile = "/NotificationSounds/cricket.mp3";
                    break;
                case "echo":
                    soundfile = "/NotificationSounds/echo.mp3";
                    break;
                case "knob":
                    soundfile = "/NotificationSounds/knob.mp3";
                    break;
            default:
            }
            var aud = document.getElementById("notificationSound");
            aud.src = soundfile;
            aud.play();
        }

        return {
            add: add,
            addDark:addDark,
            close: close,
            clear: clear,
            addMoveTop: addMoveTop,
            addMoveTopDark: addMoveTopDark,
            clearAll: clearAll,
            MakeSound: MakeSound,
        }


    }]);
})();
(function () {
    angular.module('data').factory("dataContext", ["$http", "progressBar","dxTest" , function ($http, progressBar, dxTest) {
          dxTest: dxTest
       
        return {
            Products: dxTest,
        };
    }]);
})();
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
(function () {

    angular.module('data').factory('gravatarService', [function () {



      var CryptoJS=CryptoJS||function(o,q){var l={},m=l.lib={},n=m.Base=function(){function a(){}return{extend:function(e){a.prototype=this;var c=new a;e&&c.mixIn(e);c.$super=this;return c},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var c in a)a.hasOwnProperty(c)&&(this[c]=a[c]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.$super.extend(this)}}}(),j=m.WordArray=n.extend({init:function(a,e){a=
this.words=a||[];this.sigBytes=e!=q?e:4*a.length},toString:function(a){return(a||r).stringify(this)},concat:function(a){var e=this.words,c=a.words,d=this.sigBytes,a=a.sigBytes;this.clamp();if(d%4)for(var b=0;b<a;b++)e[d+b>>>2]|=(c[b>>>2]>>>24-8*(b%4)&255)<<24-8*((d+b)%4);else if(65535<c.length)for(b=0;b<a;b+=4)e[d+b>>>2]=c[b>>>2];else e.push.apply(e,c);this.sigBytes+=a;return this},clamp:function(){var a=this.words,e=this.sigBytes;a[e>>>2]&=4294967295<<32-8*(e%4);a.length=o.ceil(e/4)},clone:function(){var a=
n.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var e=[],c=0;c<a;c+=4)e.push(4294967296*o.random()|0);return j.create(e,a)}}),k=l.enc={},r=k.Hex={stringify:function(a){for(var e=a.words,a=a.sigBytes,c=[],d=0;d<a;d++){var b=e[d>>>2]>>>24-8*(d%4)&255;c.push((b>>>4).toString(16));c.push((b&15).toString(16))}return c.join("")},parse:function(a){for(var b=a.length,c=[],d=0;d<b;d+=2)c[d>>>3]|=parseInt(a.substr(d,2),16)<<24-4*(d%8);return j.create(c,b/2)}},p=k.Latin1={stringify:function(a){for(var b=
a.words,a=a.sigBytes,c=[],d=0;d<a;d++)c.push(String.fromCharCode(b[d>>>2]>>>24-8*(d%4)&255));return c.join("")},parse:function(a){for(var b=a.length,c=[],d=0;d<b;d++)c[d>>>2]|=(a.charCodeAt(d)&255)<<24-8*(d%4);return j.create(c,b)}},h=k.Utf8={stringify:function(a){try{return decodeURIComponent(escape(p.stringify(a)))}catch(b){throw Error("Malformed UTF-8 data");}},parse:function(a){return p.parse(unescape(encodeURIComponent(a)))}},b=m.BufferedBlockAlgorithm=n.extend({reset:function(){this._data=j.create();
    this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=h.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var b=this._data,c=b.words,d=b.sigBytes,f=this.blockSize,i=d/(4*f),i=a?o.ceil(i):o.max((i|0)-this._minBufferSize,0),a=i*f,d=o.min(4*a,d);if(a){for(var h=0;h<a;h+=f)this._doProcessBlock(c,h);h=c.splice(0,a);b.sigBytes-=d}return j.create(h,d)},clone:function(){var a=n.clone.call(this);a._data=this._data.clone();return a},_minBufferSize:0});m.Hasher=b.extend({init:function(){this.reset()},
        reset:function(){b.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);this._doFinalize();return this._hash},clone:function(){var a=b.clone.call(this);a._hash=this._hash.clone();return a},blockSize:16,_createHelper:function(a){return function(b,c){return a.create(c).finalize(b)}},_createHmacHelper:function(a){return function(b,c){return f.HMAC.create(a,c).finalize(b)}}});var f=l.algo={};return l}(Math);
        (function(o){function q(b,f,a,e,c,d,g){b=b+(f&a|~f&e)+c+g;return(b<<d|b>>>32-d)+f}function l(b,f,a,e,c,d,g){b=b+(f&e|a&~e)+c+g;return(b<<d|b>>>32-d)+f}function m(b,f,a,e,c,d,g){b=b+(f^a^e)+c+g;return(b<<d|b>>>32-d)+f}function n(b,f,a,e,c,d,g){b=b+(a^(f|~e))+c+g;return(b<<d|b>>>32-d)+f}var j=CryptoJS,k=j.lib,r=k.WordArray,k=k.Hasher,p=j.algo,h=[];(function(){for(var b=0;64>b;b++)h[b]=4294967296*o.abs(o.sin(b+1))|0})();p=p.MD5=k.extend({_doReset:function(){this._hash=r.create([1732584193,4023233417,
        2562383102,271733878])},_doProcessBlock:function(b,f){for(var a=0;16>a;a++){var e=f+a,c=b[e];b[e]=(c<<8|c>>>24)&16711935|(c<<24|c>>>8)&4278255360}for(var e=this._hash.words,c=e[0],d=e[1],g=e[2],i=e[3],a=0;64>a;a+=4)16>a?(c=q(c,d,g,i,b[f+a],7,h[a]),i=q(i,c,d,g,b[f+a+1],12,h[a+1]),g=q(g,i,c,d,b[f+a+2],17,h[a+2]),d=q(d,g,i,c,b[f+a+3],22,h[a+3])):32>a?(c=l(c,d,g,i,b[f+(a+1)%16],5,h[a]),i=l(i,c,d,g,b[f+(a+6)%16],9,h[a+1]),g=l(g,i,c,d,b[f+(a+11)%16],14,h[a+2]),d=l(d,g,i,c,b[f+a%16],20,h[a+3])):48>a?(c=
        m(c,d,g,i,b[f+(3*a+5)%16],4,h[a]),i=m(i,c,d,g,b[f+(3*a+8)%16],11,h[a+1]),g=m(g,i,c,d,b[f+(3*a+11)%16],16,h[a+2]),d=m(d,g,i,c,b[f+(3*a+14)%16],23,h[a+3])):(c=n(c,d,g,i,b[f+3*a%16],6,h[a]),i=n(i,c,d,g,b[f+(3*a+7)%16],10,h[a+1]),g=n(g,i,c,d,b[f+(3*a+14)%16],15,h[a+2]),d=n(d,g,i,c,b[f+(3*a+5)%16],21,h[a+3]));e[0]=e[0]+c|0;e[1]=e[1]+d|0;e[2]=e[2]+g|0;e[3]=e[3]+i|0},_doFinalize:function(){var b=this._data,f=b.words,a=8*this._nDataBytes,e=8*b.sigBytes;f[e>>>5]|=128<<24-e%32;f[(e+64>>>9<<4)+14]=(a<<8|a>>>
        24)&16711935|(a<<24|a>>>8)&4278255360;b.sigBytes=4*(f.length+1);this._process();b=this._hash.words;for(f=0;4>f;f++)a=b[f],b[f]=(a<<8|a>>>24)&16711935|(a<<24|a>>>8)&4278255360}});j.MD5=k._createHelper(p);j.HmacMD5=k._createHmacHelper(p)})(Math);


        var getavatar = function (emailaddress) {
         return   "http://www.gravatar.com/avatar/" + CryptoJS.MD5(emailaddress)
        }

        return getavatar;
    }]);


}());
(function () {
    MainMenu = function () {
        this._screen = null;
        this._last_screen = null;
        this._animate = false;
        this._close_timer = null;
        this._dropdown_li = null;
        this._dropdown = null;
        return this;
    };
    MainMenu.settings = {
        is_mobile: false,
        resize_delay: 400,
        stored_values_prefix: 'pa_',
            accordion: true,
            animation_speed: 250,
            store_state: true,
            store_state_key: 'mmstate',
            disable_animation_on: [],
            dropdown_close_delay: 300,
            detect_active: true,
            detect_active_predicate: function (href, url) {
                return href === url;
        },
        consts: {
            COLORS: ['#71c73e', '#77b7c5', '#d54848', '#6c42e5', '#e8e64e', '#dd56e6', '#ecad3f', '#618b9d', '#b68b68', '#36a766', '#3156be', '#00b3ff', '#646464', '#a946e8', '#9d9d9d']
        }
    };

    /*
     * Initialize plugin.
     */

    MainMenu.prototype.init = function () {
        var self, state;
        this.$menu = $('#main-menu');
        if (!this.$menu.length) {
            return;
        }
        this.$body = $('body');
        this.menu = this.$menu[0];
        this.$ssw_point = $('#small-screen-width-point');
        this.$tsw_point = $('#tablet-screen-width-point');
        self = this;
        if (MainMenu.settings.store_state) {
            document.body.className += ' disable-mm-animation';
            setTimeout((function (_this) {
                return function () {
                    return elRemoveClass(document.body, 'disable-mm-animation');
                };
            })(this), 20);
        }
        this.setupAnimation();
        //$(window).on('resize.pa.mm', $.proxy(this.onResize, this));
        this.onResize();
        this.$menu.find('.navigation > .mm-dropdown').addClass('mm-dropdown-root');
        if (MainMenu.settings.detect_active) {
            this.detectActiveItem();
        }
        if ($.support.transition) {
            this.$menu.on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', $.proxy(this._onAnimationEnd, this));
        }
        $('#main-menu-toggle').on('click', $.proxy(this.toggle, this));
        $('#main-menu-inner').slimScroll({
            height: '100%'
        }).on('slimscrolling', (function (_this) {
            return function () {
                return _this.closeCurrentDropdown(true);
            };
        })(this));
        this.$menu.on('click', '.mm-dropdown > a', function () {
            var li;
            li = this.parentNode;
            if (elHasClass(li, 'mm-dropdown-root') && self._collapsed()) {
                if (elHasClass(li, 'mmc-dropdown-open')) {
                    if (elHasClass(li, 'freeze')) {
                        self.closeCurrentDropdown(true);
                    } else {
                        self.freezeDropdown(li);
                    }
                } else {
                    self.openDropdown(li, true);
                }
            } else {
                self.toggleSubmenu(li);
            }
            return false;
        });
        this.$menu.find('.navigation').on('mouseenter.pa.mm-dropdown', '.mm-dropdown-root', function () {
            self.clearCloseTimer();
            if (self._dropdown_li === this) {
                return;
            }
            if (self._collapsed() && (!self._dropdown_li || !elHasClass(self._dropdown_li, 'freeze'))) {
                return self.openDropdown(this);
            }
        }).on('mouseleave.pa.mm-dropdown', '.mm-dropdown-root', function () {
            return self._close_timer = setTimeout(function () {
                return self.closeCurrentDropdown();
            }, MainMenu.settings.dropdown_close_delay);
        });
        return this;
    };

    MainMenu.prototype._collapsed = function () {
        return (this._screen === 'desktop' && elHasClass(document.body, 'mmc')) || (this._screen !== 'desktop' && !elHasClass(document.body, 'mme'));
    };

    MainMenu.prototype.onResize = function () {
        this._screen = getScreenSize(this.$ssw_point, this.$tsw_point);
        this._animate = MainMenu.settings.disable_animation_on.indexOf(screen) === -1;
        if (this._dropdown_li) {
            this.closeCurrentDropdown(true);
        }
        //if ((this._screen === 'small' && this._last_screen !== this._screen) || (this._screen === 'tablet' && this._last_screen === 'small')) {
        //    document.body.className += ' disable-mm-animation';
        //    setTimeout((function (_this) {
        //        return function () {
        //            return elRemoveClass(document.body, 'disable-mm-animation');
        //        };
        //    })(this), 20);
        //}
        return this._last_screen = this._screen;
    };

    MainMenu.prototype.clearCloseTimer = function () {
        if (this._close_timer) {
            clearTimeout(this._close_timer);
            return this._close_timer = null;
        }
    };

    MainMenu.prototype._onAnimationEnd = function (e) {
        if (this._screen !== 'desktop' || e.target.id !== 'main-menu') {
            return;
        }
        return $(window).trigger('resize');
    };

    MainMenu.prototype.toggle = function () {
        var cls, collapse;
        this._screen = getScreenSize(this.$ssw_point, this.$tsw_point);
        cls = this._screen === 'small' || this._screen === 'tablet' ? 'mme' : 'mmc';
        if (elHasClass(document.body, cls)) {
            elRemoveClass(document.body, cls);
        } else {
            document.body.className += ' ' + cls;
        }
        if (cls === 'mmc') {
            if (!$.support.transition) {
                return $(window).trigger('resize');
            }
        } else {
            collapse = document.getElementById('');
            $('#main-navbar-collapse').stop().removeClass('in collapsing').addClass('collapse')[0].style.height = '0px';
            return $('#main-navbar .navbar-toggle').addClass('collapsed');
        }
    };

    MainMenu.prototype.collapse = function () {
        var cls, collapse;
        cls = this._screen === 'small' || this._screen === 'tablet' ? 'mme' : 'mmc';
        if (!elHasClass(document.body, cls)) {
            document.body.className += ' ' + cls;
        }
        if (cls === 'mmc') {
            if (!$.support.transition) {
                return $(window).trigger('resize');
            }
        } 
    }


    MainMenu.prototype.hide = function () {
        if (!elHasClass(document.body, "hmm")) {
            document.body.className += ' ' + "hmm";
        }
    }

    MainMenu.prototype.show = function () {
        if (elHasClass(document.body, "hmm")) {
            elRemoveClass(document.body, "hmm");
        }
    }

    MainMenu.prototype.notfixed = function () {
        if (elHasClass(document.body, "main-menu-fixed")) {
            elRemoveClass(document.body, "main-menu-fixed");
        }
    }

    MainMenu.prototype.fixed = function () {
        if (!elHasClass(document.body, "main-menu-fixed")) {
            document.body.className += ' ' + "main-menu-fixed";
        }
    }


    MainMenu.prototype.expand = function () {
        var cls, collapse;
        cls = this._screen === 'small' || this._screen === 'tablet' ? 'mme' : 'mmc';
        if (elHasClass(document.body, cls)) {
            elRemoveClass(document.body, cls);
        }
        if (!cls === 'mmc') {
            collapse = document.getElementById('');
            $('#main-navbar-collapse').stop().removeClass('in collapsing').addClass('collapse')[0].style.height = '0px';
            return $('#main-navbar .navbar-toggle').addClass('collapsed');
        }
    };

    MainMenu.prototype.toggleSubmenu = function (li) {
        this[elHasClass(li, 'open') ? 'collapseSubmenu' : 'expandSubmenu'](li);
        return false;
    };

    MainMenu.prototype.collapseSubmenu = function (li) {
        var $li, $ul;
        $li = $(li);
        $ul = $li.find('> ul');
        if (this._animate) {
            $ul.animate({
                height: 0
            }, MainMenu.settings.animation_speed, (function (_this) {
                return function () {
                    elRemoveClass(li, 'open');
                    $ul.attr('style', '');
                    return $li.find('.mm-dropdown.open').removeClass('open').find('> ul').attr('style', '');
                };
            })(this));
        } else {
            elRemoveClass(li, 'open');
        }
        return false;
    };

    MainMenu.prototype.expandSubmenu = function (li) {
        var $li, $ul, h, ul;
        $li = $(li);
        if (MainMenu.settings.accordion) {
            this.collapseAllSubmenus(li);
        }
        if (this._animate) {
            $ul = $li.find('> ul');
            ul = $ul[0];
            ul.className += ' get-height';
            h = $ul.height();
            elRemoveClass(ul, 'get-height');
            ul.style.display = 'block';
            ul.style.height = '0px';
            li.className += ' open';
            return $ul.animate({
                height: h
            }, MainMenu.settings.animation_speed, (function (_this) {
                return function () {
                    return $ul.attr('style', '');
                };
            })(this));
        } else {
            return li.className += ' open';
        }
    };

    MainMenu.prototype.collapseAllSubmenus = function (li) {
        var self;
        self = this;
        return $(li).parent().find('> .mm-dropdown.open').each(function () {
            return self.collapseSubmenu(this);
        });
    };

    MainMenu.prototype.openDropdown = function (li, freeze) {
        var $li, $title, $ul, $wrapper, max_height, min_height, title_h, top, ul, w_height, wrapper;
        if (freeze == null) {
            freeze = false;
        }
        if (this._dropdown_li) {
            this.closeCurrentDropdown(freeze);
        }
        $li = $(li);
        $ul = $li.find('> ul');
        ul = $ul[0];
        this._dropdown_li = li;
        this._dropdown = ul;
        $title = $ul.find('> .mmc-title');
        if (!$title.length) {
            $title = $('<div class="mmc-title"></div>').text($li.find('> a > .mm-text').text());
            ul.insertBefore($title[0], ul.firstChild);
        }
        li.className += ' mmc-dropdown-open';
        ul.className += ' mmc-dropdown-open-ul';
        top = $li.position().top;
        if (elHasClass(document.body, 'main-menu-fixed')) {
            $wrapper = $ul.find('.mmc-wrapper');
            if (!$wrapper.length) {
                wrapper = document.createElement('div');
                wrapper.className = 'mmc-wrapper';
                wrapper.style.overflow = 'hidden';
                wrapper.style.position = 'relative';
                $wrapper = $(wrapper);
                $wrapper.append($ul.find('> li'));
                ul.appendChild(wrapper);
            }
            w_height = $(window).innerHeight();
            title_h = $title.outerHeight();
            min_height = title_h + $ul.find('.mmc-wrapper > li').first().outerHeight() * 3;
            if ((top + min_height) > w_height) {
                max_height = top - $('#main-navbar').outerHeight();
                ul.className += ' top';
                ul.style.bottom = (w_height - top - title_h) + 'px';
            } else {
                max_height = w_height - top - title_h;
                ul.style.top = top + 'px';
            }
            if (elHasClass(ul, 'top')) {
                ul.appendChild($title[0]);
            } else {
                ul.insertBefore($title[0], ul.firstChild);
            }
            li.className += ' slimscroll-attached';
            $wrapper[0].style.maxHeight = (max_height - 10) + 'px';
            //$wrapper.pixelSlimScroll({});
        } else {
            ul.style.top = top + 'px';
        }
        if (freeze) {
            this.freezeDropdown(li);
        }
        if (!freeze) {
            $ul.on('mouseenter', (function (_this) {
                return function () {
                    return _this.clearCloseTimer();
                };
            })(this)).on('mouseleave', (function (_this) {
                return function () {
                    return _this._close_timer = setTimeout(function () {
                        return _this.closeCurrentDropdown();
                    },MainMenu.settings.dropdown_close_delay);
                };
            })(this));
            this;
        }
        return this.menu.appendChild(ul);
    };

    MainMenu.prototype.closeCurrentDropdown = function (force) {
        var $dropdown, $wrapper;
        if (force == null) {
            force = false;
        }
        if (!this._dropdown_li || (elHasClass(this._dropdown_li, 'freeze') && !force)) {
            return;
        }
        this.clearCloseTimer();
        $dropdown = $(this._dropdown);
        if (elHasClass(this._dropdown_li, 'slimscroll-attached')) {
            elRemoveClass(this._dropdown_li, 'slimscroll-attached');
            $wrapper = $dropdown.find('.mmc-wrapper');
            //$wrapper.pixelSlimScroll({
            //    destroy: 'destroy'
            //}).find('> *').appendTo($dropdown);
            $wrapper.find('> *').appendTo($dropdown);
            $wrapper.remove();
        }
        this._dropdown_li.appendChild(this._dropdown);
        elRemoveClass(this._dropdown, 'mmc-dropdown-open-ul');
        elRemoveClass(this._dropdown, 'top');
        elRemoveClass(this._dropdown_li, 'mmc-dropdown-open');
        elRemoveClass(this._dropdown_li, 'freeze');
        $(this._dropdown_li).attr('style', '');
        $dropdown.attr('style', '').off('mouseenter').off('mouseleave');
        this._dropdown = null;
        return this._dropdown_li = null;
    };

    MainMenu.prototype.freezeDropdown = function (li) {
        return li.className += ' freeze';
    };

    MainMenu.prototype.setupAnimation = function () {
        var $mm, $mmNav, dBody, dsblAnimationOn;
        dBody = document.body;
        dsblAnimationOn = MainMenu.settings.disable_animation_on;
        dBody.className += ' dont-animate-mm-content';
        $mm = $('#main-menu');
        $mmNav = $mm.find('.navigation');
        $mmNav.find('> .mm-dropdown > ul').addClass('mmc-dropdown-delay animated');
        $mmNav.find('> li > a > .mm-text').addClass('mmc-dropdown-delay animated fadeIn');
        $mm.find('.menu-content').addClass('animated fadeIn');
        if (elHasClass(dBody, 'main-menu-right') || (elHasClass(dBody, 'right-to-left') && !elHasClass(dBody, 'main-menu-right'))) {
            $mmNav.find('> .mm-dropdown > ul').addClass('fadeInRight');
        } else {
            $mmNav.find('> .mm-dropdown > ul').addClass('fadeInLeft');
        }
        dBody.className += dsblAnimationOn.indexOf('small') === -1 ? ' animate-mm-sm' : ' dont-animate-mm-content-sm';
        dBody.className += dsblAnimationOn.indexOf('tablet') === -1 ? ' animate-mm-md' : ' dont-animate-mm-content-md';
        dBody.className += dsblAnimationOn.indexOf('desktop') === -1 ? ' animate-mm-lg' : ' dont-animate-mm-content-lg';
        return window.setTimeout(function () {
            return elRemoveClass(dBody, 'dont-animate-mm-content');
        }, 500);
    };

    MainMenu.prototype.detectActiveItem = function () {
        var a, bubble, links, nav, predicate, url, _i, _len, _results;
        url = (document.location + '').replace(/\#.*?$/, '');
        predicate = MainMenu.settings.detect_active_predicate;
        nav = $('#main-menu .navigation');
        nav.find('li').removeClass('open active');
        links = nav[0].getElementsByTagName('a');
        bubble = (function (_this) {
            return function (li) {
                li.className += ' active';
                if (!elHasClass(li.parentNode, 'navigation')) {
                    li = li.parentNode.parentNode;
                    li.className += ' open';
                    return bubble(li);
                }
            };
        })(this);
        _results = [];
        for (_i = 0, _len = links.length; _i < _len; _i++) {
            a = links[_i];
            if (a.href.indexOf('#') === -1 && predicate(a.href, url)) {
                bubble(a.parentNode);
                break;
            } else {
                _results.push(void 0);
            }
        }
        return _results;
    };

    window.getScreenSize = function () {
        var width = $(document).width();
        if (width < 470) {
            return 'small';
        } else if (width < 771) {
            return 'tablet';
        } else {
            return 'desktop';
        }
    };

    window.elHasClass = function (el, selector) {
        return (" " + el.className + " ").indexOf(" " + selector + " ") > -1;
    };

    window.elRemoveClass = function (el, selector) {
        return el.className = (" " + el.className + " ").replace(" " + selector + " ", ' ').trim();
    };

    


    
    angular.module('component').factory('mainMenuService', [function () {

        var menu = new MainMenu();

        var init = function () {
            menu.init();
        }

        var toggle = function () {
            menu.toggle();
        }

        var collapse = function () {
            menu.collapse();
        }


        var expand=function(){
            menu.expand();
        }

        var hide=function() {
            menu.hide();
        }

        var show = function () {
            menu.show();
        }
        var notfixed= function() {
            menu.notfixed();
        }

        var fixed = function () {
            menu.fixed();
        }

        return {
            init: init,
            toggle: toggle,
            collapse: collapse,
            expand: expand,
            hide:hide,
            show: show,
            notfixed: notfixed,
            fixed: fixed,
        };

    }]);
})();

(function () {
    angular.module('component').constant('notificationDefaults', {
        "closeButton": false,
        "debug": false,
        "positionClass": "toast-top-right",
        "onclick": null,
        "showDuration": "3000",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }).factory('notificationService', ["notificationDefaults", function (notificationDefaults) {
        var success = function (title,message,options) {
            if (!title) { title = "Success"; }
            if (!message) { message = ""; }
            toastr.success("<h3 style='margin-top:0'>" + title + "</h3>" + message)
            options = $.extend({}, notificationDefaults, options || {});
            toastr.options = options;
        };
        var info = function (title, message, options) {
            if (!title) { title = "Info"; }
            if (!message) { message = ""; }
            toastr.info("<h3 style='margin-top:0'>" + title + "</h3>" + message)
            options = $.extend({}, notificationDefaults, options || {});
            toastr.options = options;
        };
        var warning = function (title,message,options) {
            if (!title) { title = "Warning"; }
            if (!message) { message = ""; }
            toastr.warning("<h3 style='margin-top:0'>" + title + "</h3>" + message)
            options = $.extend({}, notificationDefaults, options || {});
            toastr.options = options;
        };
        var error = function (title, message, options) {
            if (!title) { title = "Error"; }
            if (!message) { message = ""; }
            toastr.error("<h3 style='margin-top:0'>" + title + "</h3>" + message)
            options = $.extend({}, notificationDefaults, options || {});
            toastr.options = options;
        };

        return {
            success: success,
            info: info,
            warning: warning,
            error: error,
        }
    }])
})();
//progressBar.show("Data Loading");
(function () {
    //---Required NProgress---//
    angular.module('component').factory('progressBar', function () {
        var show = function (message) {
            if (NProgress && NProgress.start) {
                NProgress.start();
            }
        };
        var hide = function (message) {
            if (NProgress && NProgress.start) {
                NProgress.done();
            }
        };

        var hideWithError = function (message) {
            if (NProgress && NProgress.start) {
                NProgress.done();
            }
        };

        return {
            show: show,
            hide: hide,
            hideWithError: hideWithError,
        };

    });
})();
angular.module("data").factory('rottentService',[
    "$http", "$q", "$rootScope", function ($http, $q, $rootScope) {

        var getcontent= function(address) {
            var deferred = $q.defer();
            $.ajax({
                type: 'GET',
                dataType: "jsonp",
                url: address,
                success: function (responseData, textStatus, jqXHR) {
                    moviesBoxOffice = responseData;
                    //.movies
                    $rootScope.$apply(function () {
                        moviesBoxOffice = responseData;
                    });
                    deferred.resolve(responseData);
                },
                error: function (responseData, textStatus, errorThrown) {
                    deferred.reject(new Error(errorThrown));
                    console.log("something went wrong!! Error: " + textStatus);
                }
            });
            return deferred.promise;
        }

        var moviesBoxOffice = {};
        var moviesBoxOfficeCall = function() {
            var address = "http://api.rottentomatoes.com/api/public/v1.0/lists/movies/box_office.json?apikey=75svr8r6hpjhsfu63pk8erkf";
            return getcontent(address);
        }
        var moviesInTheatersCall = function () {
            var address = "http://api.rottentomatoes.com/api/public/v1.0/lists/movies/in_theaters.json?apikey=75svr8r6hpjhsfu63pk8erkf";
            return getcontent(address);
        }
        var moviesOpeningCall = function () {
            var address = "http://api.rottentomatoes.com/api/public/v1.0/lists/movies/opening.json?apikey=75svr8r6hpjhsfu63pk8erkf";
            return getcontent(address);
        }
        var moviesUpcomingCall = function () {
            var address = "http://api.rottentomatoes.com/api/public/v1.0/lists/movies/upcoming.json?apikey=75svr8r6hpjhsfu63pk8erkf";
            return getcontent(address);
        }


        var dvdsTopRentalsCall = function () {
            var address = "http://api.rottentomatoes.com/api/public/v1.0/lists/dvds/top_rentals.json?apikey=75svr8r6hpjhsfu63pk8erkf";
            return getcontent(address);
        }

        var dvdsCurrentReleasesCall = function () {
            var address = "http://api.rottentomatoes.com/api/public/v1.0/lists/dvds/current_releases.json?apikey=75svr8r6hpjhsfu63pk8erkf";
            return getcontent(address);
        }
        var dvdsNewReleasesCall = function () {
            var address = "http://api.rottentomatoes.com/api/public/v1.0/lists/dvds/new_releases.json?apikey=75svr8r6hpjhsfu63pk8erkf";
            return getcontent(address);
        }
        var dvdsUpcomingCall = function () {
            var address = "http://api.rottentomatoes.com/api/public/v1.0/lists/dvds/upcoming.json?apikey=75svr8r6hpjhsfu63pk8erkf";
            return getcontent(address);
        }

    var searchCall = function (term,resultsperpage,pagenumber) {
            if (!resultsperpage) { resultsperpage = 50; }
            if (!pagenumber) { pagenumber = 1; }
            var address = "http://api.rottentomatoes.com/api/public/v1.0/movies.json?apikey=75svr8r6hpjhsfu63pk8erkf&q=" + term + "&page_limit=" + resultsperpage + "&page=" + pagenumber;
            return getcontent(address);
        }


        return{
            moviesBoxOffice: moviesBoxOffice,
            moviesBoxOfficeCall:moviesBoxOfficeCall,
            moviesInTheatersCall: moviesInTheatersCall,
            moviesOpeningCall: moviesOpeningCall,
            moviesUpcomingCall: moviesUpcomingCall,

            dvdsTopRentalsCall: dvdsTopRentalsCall,
            dvdsCurrentReleasesCall: dvdsCurrentReleasesCall,
            dvdsNewReleasesCall: dvdsNewReleasesCall,
            dvdsUpcomingCall: dvdsUpcomingCall,
            searchCall: searchCall,
        }
  }]);
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
(function () {
    angular.module('component').factory('themeSelectorService', function () {
        var change = function (themename) {
            if (themename == "theme-adminflare" || value == "theme-asphalt" || value == "theme-clean" || value == "theme-default" || value == "theme-dust"
                || value == "theme-fresh" || value == "theme-frost" || value == "theme-purple-hills" || value == "theme-silver" || value == "theme-white") {
                var body = angular.element(document).find('body');
                $(body).removeClass("theme-adminflare theme-asphalt theme-clean theme-default theme-dust theme-fresh theme-frost theme-purple-hills theme-silver theme-white");
                $(body).addClass(themename);
            }
        };
       

        return {
            adminflare: change("theme-adminflare"),
            asphalt: change("theme-asphalt"),
            clean: change("theme-clean"),
            default: change("theme-default"),
            dust: change("theme-dust"),
            fresh: change("theme-fresh"),
            frost: change("theme-frost"),
            purplehills: change("theme-purple-hills"),
            silver: change("theme-silver"),
            white: change("theme-white"),
        };

    });
})();