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
