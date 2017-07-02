/**
 * Created by Administrator on 2017/4/20 0020.
 */
(function (window, document, undefined) {
    var win = window;
    var doc = document;
    /**
     *
     * @type {string[]}
     * 检测参数类型 常用的公用方法
     */
    var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
    var ArrayProto = Array.prototype,
        ObjProto = Object.prototype,
        emptyArry = [];
    var class2type = {};

    hasOwnProperty = ObjProto.hasOwnProperty;
    var obj = {};
    var arr = [];
    var getProto = Object.getPrototypeOf;
    var hasOwn = obj.hasOwnProperty;
    var toString = ObjProto.toString;
    var fnToString = hasOwn.toString;
    var ObjectFunctionString = fnToString.call(Object);
    var checkTypeArr = ['Arguments', 'Array', 'Function', 'String', 'Number', 'Date', 'RegExp'];
    var Events=[];
    var mTouch = function (selector, context) {
        return new mTouch.prototype.init(selector, context);
    }
    mTouch.fn = mTouch.prototype = {
        constructor: mTouch,
        length: 0,
        selector: '',
        init: function (selector, context) {
            //当没有选择的dom元素时，返回对象本身 mTouch(),mTouch(null)
            if (!selector) {
                return this;
            }
            var elems;
            if (typeof selector === 'object') {
                /* this.selector = [selector];*/
                /* console.log('object');
                 console.log(isNodeList(selector))
                 console.log(isNode(selector))*/
                var i = 0;
                if (isNode(selector)) {
                    this[0] = selector;
                    this.length = 1;
                } else if (isNodeList(selector)) {
                    selector.forEach(function (item) {
                        this[i] = item;
                        i++;
                    })
                    this.length = i;
                }
                return this;
            } else if (typeof selector === 'string') {
                if (selector.charAt(0) === '#' && !selector.match('\\s')) {
                    this.selector = selector;
                    selector = selector.substring(1);
                    this[0] = doc.getElementById(selector);
                    this.length = 1;
                    return this;
                } else {
                    elems = (context || document).querySelectorAll(selector);
                    var len = elems.length;
                    for (var i = 0; i < len; i++) {
                        this[i] = elems[i];
                    }
                    this.selector = selector;
                    this.length = len;
                    return this;
                }
            }
            if (typeof selector === 'function') {
                mTouch.ready(selector);
                return;
            }
        },
        each: function (callback) {
            /* emptyArry.every.call(this, function (el, idx) {
             return callback.call(el, idx, el) !== false;
             })
             return this;*/
            return mTouch.each(this, callback)
        },
        pushStack: function (elems) {
            var ret = mTouch.merge(this.constructor(), elems);
            ret.prevObject = this;
            return ret;
        },
        css: function (attr, val) {
            for (var i = 0; i < this.length; i++) {
                if (typeof attr === 'string') {
                    if (arguments.length === 1) {
                        return getComputedStyle(this[i], null)[attr];
                    }
                    this[i].style[attr] = val;
                } else {
                    var _this = this[i];
                    mTouch.each(attr, function (attr, val) {
                        _this.style.cssText += '' + attr + ':' + val + ';'
                    })
                }
            }
            return this;
        },
        eq: function (i) {
            var len = this.length,
                j = +i + (i < 0 ? len : 0);
            return this.pushStack(j >= 0 && j < len ? [this[j]] : []);
        },
        first: function () {
            return this.eq(0);
        },
        last: function () {
            return this.eq(-1);
        },
        end: function () {
            return this.prevObject || this.constructor();
        },
        addClass: function (cls) {
            var clss = cls.split(' ');
            console.log(clss);
            for (var i = 0; i < this.length; i++) {
                var _this = this[i];
                clss.forEach(function (item) {
                    _this.classList.add(item)
                })
            }
        },
        removeClass: function (cls) {
            var clss = cls.split(' ');
            console.log(clss);
            for (var i = 0; i < this.length; i++) {
                var _this = this[i];
                clss.forEach(function (item) {
                    _this.classList.remove(item)
                })
            }
        },
        toogleClass: function (cls, bool) {
            var arglen = arguments.length;
            for (var i = 0; i < this.length; i++) {
                var _this = this;
                if (arglen === 1) {
                    _this.classList.toggle(cls);
                } else {
                    _this.classList.toggle(cls, bool);
                }
            }
        },
        hasClass: function (cls) {
            for (var i = 0; i < this.length; i++) {
                var _this = this;
                return _this.classList.contains(cls);
            }
        },
        on: function (EventType, selectDom, callback) {
            //当agentDom为function时赋值给cb
            console.log('on-----')
            var cb = null;
            var agent = null;
            //var agentlen=agent.length;
            var arglen = arguments.length;
            //为了获取 this.selector
            var that = this;
            if (isFunction(selectDom)) {
                cb = selectDom;
            }
            /*  else {
             //要触发的dom集合
             selects = document.querySelectorAll(selectDom)
             }*/
            /*
             * 当第二个参数为函数时，不设置代理，把selectDom赋给cb;
             * */
            if (arglen === 2) {
                //遍历selector,用addEventListener添加
                for (var i = 0; i < this.length; i++) {
                    var _this = this[i];
                    console.log(_this)
                    _this.addEventListener(EventType, cb, false)
                }
            } else if (arglen === 3) {
                //判断 selector是否为id，或者.calss
                var select = null;
                var isId = (selectDom.charAt(0) === '#' ? true : false);
                var isClass = (selectDom.charAt(0) === '.' ? true : false);
                if (isId || isClass) {
                    selectDom = mTouch.trim(selectDom);
                    select = selectDom.substring(1);
                    cb=callback;
                    if (isId) {

                        callback=function (e) {
                           // console.log('id');
                            var target=e.target;
                            if(target.id===select){
                                cb.call(this,e)
                            }
                        }
                        for (var i = 0; i < that.length; i++) {
                            that[i].addEventListener(EventType, callback, false);
                            Events.push({
                                el:that[i],
                                eventType:EventType,
                                callback:callback
                            })
                        }
                    }
                    if (isClass) {

                        callback = function (e) {
                           // console.log('class');
                            var target = e.target;
                            if (target.className === select) {
                                cb.call(this, e);
                            }
                        }
                        for (var i = 0; i < that.length; i++) {
                            that[i].addEventListener(EventType, callback, false)
                            Events.push({
                                el:that[i],
                                eventType:EventType,
                                callback:callback
                            })
                        }
                    }
                } else {
                    cb=callback;
                    callback = function (e) {
                       /* console.log('node');*/
                        var target = e.target;
                        if (target.nodeName.toLowerCase() === selectDom) {
                            cb.call(this, e);
                        }
                    }
                    for (var i = 0; i < that.length; i++) {
                        that[i].addEventListener(EventType, callback, false);
                        Events.push({
                            el:that[i],
                            eventType:EventType,
                            callback:callback
                        })
                    }
                    console.log(Events)
                }
            }
        },
        off: function (EventType,callback) {
            var _this=this;
           for(var i=0;i<this.length;i++){
              Events.forEach(function (item,j) {
                  console.log(i)
                  console.log(item['el']);
                  if(item['el'] === _this[i]){
                      _this[i].removeEventListener(item['eventType'],item['callback'])
                  }
              })
           }
        }
    }
    /**
     *
     * @param fn
     * @returns {boolean}
     *
     */
    function isFunction(fn) {
        return toString.call(fn) === '[object Function]';
    }

    //使用document.querySelectorAll(),返回NodeList
    function isNodeList(val) {
        return val instanceof window.NodeList || val instanceof NodeList || val instanceof window.HTMLCollection || val instanceof Array
    }

    //单个节点，常见的是document.getElementById返回的类型
    function isNode(val) {
        return val instanceof window.Node;
    }

    //
    function isPlainObject(obj) {
        var proto, Ctor;
        if (!obj || toString.call(obj) !== "[object Object]") {
            return false;
        }
        proto = getProto(obj);
        if (!proto) {
            return false;
        }
        Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
        return typeof Ctor === "function" && fnToString.call(Ctor) === ObjectFunctionString;
    }

    /**
     *
     * @type {*} 经典的 prototype
     */
    mTouch.prototype.init.prototype = mTouch.prototype;

    mTouch.fn = mTouch.prototype;
    /**
     *
     * @type {mTouch.extend}
     * 深复制，浅复制
     */
    mTouch.extend = mTouch.fn.extend = function () {
        var options, name, src, copy, copyIsArray, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;
        if (typeof target === "boolean") {
            deep = target;
            target = arguments[i] || {};
            i++;
        }
        if (typeof target !== "object" && !isFunction(target)) {
            target = {};
        }
        if (i === length) {
            target = this;
            i--;
        }
        for (; i < length; i++) {
            if ((options = arguments[i]) != null) {
                for (name in options) {
                    src = target[name];
                    copy = options[name];
                    if (target === copy) {
                        continue;
                    }

                    if (deep && copy && (isPlainObject(copy) ||
                        (copyIsArray = Array.isArray(copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && Array.isArray(src) ? src : [];
                        } else {
                            clone = src && isPlainObject(src) ? src : {};
                        }
                        target[name] = extend(deep, clone, copy);
                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }

                }
            }
        }
        return target;
    }

    mTouch.extend({
        isReady: true,
        error: function (msg) {
            throw new Error(msg);
        },
        each: function (obj, callback) {
            var length, i = 0;

            if (isArrayLike(obj)) {
                length = obj.length;
                for (; i < length; i++) {
                    if (callback.call(obj[i], i, obj[i]) === false) {
                        break;
                    }
                }
            } else {
                for (i in obj) {
                    if (callback.call(obj[i], i, obj[i]) === false) {
                        break;
                    }
                }
            }

            return obj;
        },
        type: function (obj) {
            if (obj == null) {
                return obj + "";
            }

            // Support: Android <=2.3 only (functionish RegExp)
            return typeof obj === "object" || typeof obj === "function" ?
                class2type[toString.call(obj)] || "object" :
                typeof obj;
        },
        isWindow: function (obj) {
            return obj != null && obj === obj.window;
        },
        merge: function (first, second) {
            var len = +second.length,
                j = 0,
                i = first.length;
            for (; j < len; j++) {
                first[i++] = second[j];
            }
            first.length = i;
            return first;
        }
    })


    function isArrayLike(obj) {
        var length = !!obj && "length" in obj && obj.length,
            type = mTouch.type(obj);

        if (type === "function" || mTouch.isWindow(obj)) {
            return false;
        }
        return type === "array" || length === 0 ||
            typeof length === "number" && length > 0 && (length - 1) in obj;
    }

    /*相邻元素*/
    /*   function sibling(ele, pOrN) {
     while ((ele = ele[pOrN]) && ele.nodeType !== 1) {

     }
     return ele
     }*/
    var siblings = function (n, elem) {
        var matched = [];
        for (; n; n = n.nextSibling) {
            if (n.nodeType === 1 && n !== elem) {
                matched.push(n);
            }
        }
        return matched;
    }

    function sibling(cur, dir) {
        while ((cur = cur[dir]) && cur.nodeType !== 1) {
        }
        return cur
    }

    /*document ready*/
    mTouch.ready = function (fn) {
        if (document.readyState === 'complete' || document.readyState !== 'loading') {
            fn && fn()
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }
    mTouch.trim = function (text) {
        return text === null ?
            "" :
            ( text + "" ).replace(rtrim, "");
    };
    checkTypeArr.forEach(function (type, i) {
        mTouch['is' + type] = function (obj) {
            return toString.call(obj) === '[object ' + type + ']';
        }
    });
    window.m = window.mTouch = mTouch;
})(window, document);