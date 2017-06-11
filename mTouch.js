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
        ObjProto = Object.prototype;

    var toString = ObjProto.toString,
        hasOwnProperty = ObjProto.hasOwnProperty;

    var checkTypeArr = ['Arguments', 'Array', 'Function', 'String', 'Number', 'Date', 'RegExp'];
    var mTouch = function (selector, context) {
        return new mTouch.prototype.init(selector, context);
    }
    mTouch.prototype = {
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
                this.selector = [selector];
                for (var i = 0; i < selector.length; i++) {
                    this[i] = selector[i];
                }
                this.length = selector.length;
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
            [].every.call(this,function (el,idx) {
                return callback.call(el,idx,el) !==false;
            })
            return this;
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
        eq: function (num) {
            num = num < 0 ? (this.length - 1) : num;
            return new mTouch(this[num]);
        },
        next: function () {
            return sibling(this[0], 'nextSibling');
        },
        prev: function () {
            return sibling(this[0], 'previousSibling');
        }
    }

    mTouch.prototype.init.prototype = mTouch.prototype;
    //转化为 mTouch 对象
    function toMtouch() {
        return mTouch(arguments)
    }

    function flatten(arr, owner) {

    }

    mTouch.each = function (obj, callback) {
        var length, i = 0;
        if (mTouch.isArray(obj)) {
            length = obj.length;
            for (; i < length; i++) {
                if (callback.call(obj[i], i, obj[i]) === false) {
                    return obj
                }
            }
        } else {
            for (i in obj) {
                if (callback.call(obj[i], i, obj[i]) === false) {
                    return obj
                }
            }
        }
        return obj;
    }
    /*相邻元素*/
    function sibling(ele, pOrN) {
        while ((ele = ele[pOrN]) && ele.nodeType !== 1) {

        }
        return ele
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
    window.mTouch = mTouch;
})(window, document);