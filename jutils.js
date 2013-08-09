var jUtils = {
        addEvent: function (el, event_name, callback) {
            var addHandler = function (elem) {
                if (elem.addEventListener) {
                    elem.addEventListener(event_name, callback);
                } else if (elem.attachEvent) {
                    elem.attachEvent('on' + event_name, function () {
                        callback.call(this.target || this.event.srcElement);
                    });
                } else {
                    elem[event_name] = callback;
                }
            };

            if (typeof el[0] !== 'undefined') {
                for (var i = 0; i < el.length; i++) {
                    addHandler(el[i])
                }
            } else {
                addHandler(el)
            }
        },
        removeEvent: function (elem, event_name, callback) {
            if (elem.removeEventListener) {
                elem.removeEventListener(event_name, callback, false);
            } else if (elem.detachEvent) {
                elem.detachEvent('on' + event_name, callback);
            } else {
                elem[event_name] = null;
            }
        },
        findByClass: function (class_name) {
            if (document.getElementsByClassName) {
                return document.getElementsByClassName(class_name);
            }
            else {
                return document.querySelectorAll('.' + class_name);
            }
        },
        hasClass: function (elem, class_name) {
            if (elem.classList) {
                return elem.classList.contains(class_name);
            } else {
                return elem.className.split(/\s+/).find(class_name) !== -1;
            }
        },
        getEvent: function (e) {
            return e ? e : window.event;
        },
        fireEvent: function (element, event) {
            if (document.createEvent) {
                // dispatch for firefox + others
                var evt = document.createEvent("HTMLEvents");
                evt.initEvent(event, true, true); // event type,bubbling,cancelable
                return !element.dispatchEvent(evt);
            } else {
                // dispatch for IE
                return element.fireEvent('on' + event, document.createEventObject())
            }
        },
        getLocalStorage: function () {
            if (typeof localStorage == 'object') {
                return localStorage;
            } else if (typeof globalStorage == 'object') {
                return globalStorage[location.host];
            } else return {};
        },
        removeFromCache: function (key) {
            var cache = this.getLocalStorage();
            if (cache) delete cache[key];
        }
    };
