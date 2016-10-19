/*
 * argilo v0.0.1 built in Wed, 19 Oct 2016 10:18:59 GMT
 * Copyright (c) 2016 Tao Zeng <tao.zeng.zt@gmail.com>
 * Released under the MIT license
 * support IE6+ and other browsers
 * https://github.com/tao-zeng/argilo
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define('argilo', factory) :
  (global.argilo = factory());
}(this, function () {

  var slice = Array.prototype.slice;

  if (!Object.freeze) {
    Object.freeze = function freeze(obj) {
      return obj;
    };
  }

  if (!Function.prototype.bind) {
    Function.prototype.bind = function bind(scope) {
      var fn = this;
      if (arguments.length > 1) {
        var args = slice.call(arguments, 1);
        return function () {
          return fn.apply(scope, args.concat(slice.call(arguments)));
        };
      }
      return function () {
        return fn.apply(scope, arguments);
      };
    };
  }

  var hasOwn = Object.prototype.hasOwnProperty;
  var policies = {
    hasOwn: function (obj, prop) {
      return hasOwn.call(obj, prop);
    },
    eq: function (o1, o2) {
      return o1 === o2;
    }
  };
  function policy(name, policy) {
    return arguments.length == 1 ? policies[name] : policies[name] = policy;
  }

  function eq(o1, o2) {
    return policies.eq(o1, o2);
  }

  function hasOwnProp(o1, o2) {
    return policies.hasOwn(o1, o2);
  }

  function emptyFunc() {}

var common = Object.freeze({
    policy: policy,
    eq: eq,
    hasOwnProp: hasOwnProp,
    emptyFunc: emptyFunc
  });

  var toStr = Object.prototype.toString;

  var argsType = '[object Arguments]';
  var arrayType = '[object Array]';
  var funcType = '[object Function]';
  var boolType = '[object Boolean]';
  var numberType = '[object Number]';
  var dateType = '[object Date]';
  var stringType = '[object String]';
  var objectType = '[object Object]';
  var regexpType = '[object RegExp]';
  var nodeListType = '[object NodeList]';
  function isDefine(obj) {
    return obj !== undefined;
  }

  function isNull(obj) {
    return obj === null;
  }

  function isNil(obj) {
    return obj === undefined || obj === null;
  }

  function isBool(obj) {
    return toStr.call(obj) == boolType;
  }

  function isNumber(obj) {
    return toStr.call(obj) == numberType;
  }

  function isDate(obj) {
    return toStr.call(obj) == dateType;
  }

  function isString(obj) {
    return toStr.call(obj) == stringType;
  }

  function isObject(obj) {
    return toStr.call(obj) == objectType;
  }

  function isArray$1(obj) {
    return toStr.call(obj) == arrayType;
  }

  function isArrayLike(obj) {
    var type = toStr.call(obj);
    switch (type) {
      case argsType:
      case arrayType:
      case stringType:
      case nodeListType:
        return true;
    }
    if (obj) {
      var length = obj.length;
      return isNumber(length) && (length === 0 || length > 0 && hasOwnProp(obj, length - 1));
    }
    return false;
  }

  function isFunc(obj) {
    return toStr.call(obj) == funcType;
  }

  function isRegExp(obj) {
    return toStr.call(obj) == regexpType;
  }

  function isPrimitive(obj) {
    if (isNil(obj)) return true;
    var type = toStr.call(obj);
    switch (type) {
      case boolType:
      case numberType:
      case stringType:
      case funcType:
        return true;
    }
    return false;
  }

var is = Object.freeze({
    argsType: argsType,
    arrayType: arrayType,
    funcType: funcType,
    boolType: boolType,
    numberType: numberType,
    dateType: dateType,
    stringType: stringType,
    objectType: objectType,
    regexpType: regexpType,
    nodeListType: nodeListType,
    isDefine: isDefine,
    isNull: isNull,
    isNil: isNil,
    isBool: isBool,
    isNumber: isNumber,
    isDate: isDate,
    isString: isString,
    isObject: isObject,
    isArray: isArray$1,
    isArrayLike: isArrayLike,
    isFunc: isFunc,
    isRegExp: isRegExp,
    isPrimitive: isPrimitive
  });

  function _eachObj(obj, callback, scope, own) {
    var key = void 0,
        isOwn = void 0,
        i = 0;

    scope = scope || obj;
    for (key in obj) {
      if ((isOwn = hasOwnProp(obj, key)) || own === false) {
        if (callback.call(scope, obj[key], key, obj, isOwn) === false) return false;
        i++;
      }
    }
    return i;
  }

  function _eachArray(obj, callback, scope) {
    var i = 0,
        j = obj.length;

    scope = scope || obj;
    for (; i < j; i++) {
      if (callback.call(scope, obj[i], i, obj, true) === false) return false;
    }
    return i;
  }

  function each(obj, callback, scope, own) {
    if (isArrayLike(obj)) {
      return _eachArray(obj, callback, scope);
    } else if (!isNil(obj)) {
      return _eachObj(obj, callback, scope, own);
    }
    return 0;
  }

  function map(obj, callback, scope, own) {
    var isArray = isArrayLike(obj),
        ret = isArray ? [] : {},
        each = isArray ? _eachArray : _eachObj;

    each(obj, function (val, key) {
      ret[key] = callback.apply(this, arguments);
    }, scope, own);
    return ret;
  }

  function filter(obj, callback, scope, own) {
    var isArray = isArrayLike(obj),
        ret = isArray ? [] : {},
        each = isArray ? _eachArray : _eachObj;

    each(obj, function (val, key) {
      if (callback.apply(this, arguments)) isArray ? ret.push(val) : ret[key] = val;
    });
    return ret;
  }

  function aggregate(obj, callback, defVal, scope, own) {
    var ret = defVal;

    each(obj, function (val, key, obj, isOwn) {
      ret = callback.call(this, ret, val, key, obj, isOwn);
    }, scope, own);
    return ret;
  }

  function _indexOfArray(array, val) {
    var i = 0,
        l = array.length;

    for (; i < l; i++) {
      if (eq(array[i], val)) return i;
    }
    return -1;
  }

  function _lastIndexOfArray(array, val) {
    var i = array.length;

    while (i-- > 0) {
      if (eq(array[i], val)) return i;
    }
    return -1;
  }

  function _indexOfObj(obj, val, own) {
    var key = void 0;

    for (key in obj) {
      if (own === false || hasOwnProp(obj, key)) {
        if (eq(obj[key], val)) return key;
      }
    }
    return undefined;
  }

  function indexOf(obj, val, own) {
    if (isArrayLike(obj)) return _indexOfArray(obj, val);
    return _indexOfObj(obj, val, own);
  }

  function lastIndexOf(obj, val, own) {
    if (isArrayLike(obj)) return _lastIndexOfArray(obj, val);
    return _indexOfObj(obj, val, own);
  }

  function convert(obj, keyGen, valGen, scope, own) {
    var o = {};

    each(obj, function (val, key) {
      o[keyGen ? keyGen.apply(this, arguments) : key] = valGen ? valGen.apply(this, arguments) : val;
    }, scope, own);
    return o;
  }

  function reverseConvert(obj, valGen, scope, own) {
    var o = {};

    each(obj, function (val, key) {
      o[val] = valGen ? valGen.apply(this, arguments) : key;
    }, scope, own);
    return o;
  }

var coll = Object.freeze({
    each: each,
    map: map,
    filter: filter,
    aggregate: aggregate,
    indexOf: indexOf,
    lastIndexOf: lastIndexOf,
    convert: convert,
    reverseConvert: reverseConvert
  });

var   toStr$1 = Object.prototype.toString;
  var exprCache = {};
  var exprReg = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g;
  var escapeCharReg = /\\(\\)?/g;
  function keys(obj, filter, scope, own) {
    var keys = [];

    each(obj, function (val, key) {
      if (!filter || filter.apply(this, arguments)) keys.push(key);
    }, scope, own);
    return keys;
  }

  function values(obj, filter, scope, own) {
    var values = [];

    each(obj, function (val, key) {
      if (!filter || filter.apply(this, arguments)) values.push(val);
    }, scope, own);
    return values;
  }

  function getOwnProp(obj, key, defaultVal) {
    return hasOwnProp(obj, key) ? obj[key] : defaultVal;
  }

  var prototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function getPrototypeOf(obj) {
    return obj.__proto__;
  };

  var setPrototypeOf = Object.setPrototypeOf || function setPrototypeOf(obj, proto) {
    obj.__proto__ = proto;
  };

  var assign = Object.assign || function assign(target) {
    var source = void 0,
        key = void 0,
        i = 1,
        l = arguments.length;

    for (; i < l; i++) {
      source = arguments[i];
      for (key in source) {
        if (hasOwnProp(source, key)) target[key] = source[key];
      }
    }
    return target;
  };

  function assignIf(target) {
    var source = void 0,
        key = void 0,
        i = 1,
        l = arguments.length;

    for (; i < l; i++) {
      source = arguments[i];
      for (key in source) {
        if (hasOwnProp(source, key) && !hasOwnProp(target, key)) target[key] = source[key];
      }
    }
    return target;
  }

  var create = Object.create || function (parent, props) {
    emptyFunc.prototype = parent;
    var obj = new emptyFunc();
    emptyFunc.prototype = undefined;
    if (props) each(props, function (prop, name) {
      obj[name] = prop.value;
    });
    return obj;
  };

  function parseExpr(expr, cache) {
    var ret = void 0,
        type = toStr$1.call(expr);

    if (type == arrayType) return expr;
    if (type != stringType) return [];
    if (ret = exprCache[expr]) return ret;

    ret = cache !== false ? exprCache[expr] = [] : [];
    expr.replace(exprReg, function (match, number, quote, string) {
      ret.push(quote ? string.replace(escapeCharReg, '$1') : number || match);
    });
    return ret;
  }

  function get(obj, expr, defVal, own, cache) {
    var i = 0,
        path = parseExpr(expr, cache),
        l = path.length - 1,
        prop = void 0;

    for (; i < l && !isNil(obj); i++) {
      prop = path[i];
      if (own && !hasOwnProp(obj, prop)) return defVal;
      obj = obj[prop];
    }
    prop = path[i];
    return i == l && !isNil(obj) && (!own || hasOwnProp(obj, prop)) ? obj[prop] : defVal;
  }

  function has(obj, expr, own, cache) {
    var i = 0,
        path = parseExpr(expr, cache),
        l = path.length - 1,
        prop = void 0;

    for (; i < l && !isNil(obj); i++) {
      prop = path[i];
      if (own && !hasOwnProp(obj, prop)) return false;
      obj = obj[prop];
    }
    prop = path[i];
    return i == l && !isNil(obj) && (own ? hasOwnProp(obj, prop) : prop in obj);
  }

  function set(obj, expr, value) {
    var i = 0,
        path = parseExpr(expr, true),
        l = path.length - 1,
        prop = path[0],
        _obj = obj,
        val = void 0;

    while (i++ < l) {
      val = _obj[prop];
      _obj = isNil(val) ? _obj[prop] = {} : val;
      prop = path[i];
    }
    _obj[prop] = value;
    return obj;
  }

var obj$1 = Object.freeze({
    keys: keys,
    values: values,
    getOwnProp: getOwnProp,
    prototypeOf: prototypeOf,
    setPrototypeOf: setPrototypeOf,
    assign: assign,
    assignIf: assignIf,
    create: create,
    parseExpr: parseExpr,
    get: get,
    has: has,
    set: set
  });

var   slice$1 = Array.prototype.slice;
  var firstLowerLetterReg = /^[a-z]/;
  var ltrimReg = /^\s+/;
  var rtrimReg = /\s+$/;
  var trimReg = /(^\s+)|(\s+$)/g;
  var thousandSeparationReg = /(\d)(?=(\d{3})+(?!\d))/g;
  var formatReg = /%(\d+\$|\*|\$)?([-+#0, ]*)?(\d+\$?|\*|\$)?(\.\d+\$?|\.\*|\.\$)?([%sfducboxXeEgGpP])/g;
  var pluralRegs = [{
    reg: /([a-zA-Z]+[^aeiou])y$/,
    rep: '$1ies'
  }, {
    reg: /([a-zA-Z]+[aeiou]y)$/,
    rep: '$1s'
  }, {
    reg: /([a-zA-Z]+[sxzh])$/,
    rep: '$1es'
  }, {
    reg: /([a-zA-Z]+[^sxzhy])$/,
    rep: '$1s'
  }];
  var singularRegs = [{
    reg: /([a-zA-Z]+[^aeiou])ies$/,
    rep: '$1y'
  }, {
    reg: /([a-zA-Z]+[aeiou])s$/,
    rep: '$1'
  }, {
    reg: /([a-zA-Z]+[sxzh])es$/,
    rep: '$1'
  }, {
    reg: /([a-zA-Z]+[^sxzhy])s$/,
    rep: '$1'
  }];
  function _uppercase(k) {
    return k.toUpperCase();
  }

  function upperFirst(str) {
    return str.replace(firstLowerLetterReg, _uppercase);
  }

  function ltrim(str) {
    return str.replace(ltrimReg, '');
  }

  function rtrim(str) {
    return str.replace(rtrimReg, '');
  }

  function trim(str) {
    return str.replace(trimReg, '');
  }

  function plural(str) {
    var pluralReg = void 0;
    for (var i = 0; i < 4; i++) {
      pluralReg = pluralRegs[i];
      if (pluralReg.reg.test(str)) return str.replace(pluralReg.reg, pluralReg.rep);
    }
    return str;
  }

  function singular(str) {
    var singularReg = void 0;
    for (var i = 0; i < 4; i++) {
      singularReg = singularRegs[i];
      if (singularReg.reg.test(str)) return str.replace(singularReg.reg, singularReg.rep);
    }
    return str;
  }

  function thousandSeparate(number) {
    var split = (number + '').split('.');
    split[0] = split[0].replace(thousandSeparationReg, '$1,');
    return split.join('.');
  }

  // ========================== formatter ===========================
  function pad(str, len, chr, leftJustify) {
    var l = str.length,
        padding = l >= len ? '' : Array(1 + len - l >>> 0).join(chr);

    return leftJustify ? str + padding : padding + str;
  }

  function _format(str, args) {
    var index = 0;

    // for min-width & precision
    function parseWidth(width) {
      if (!width) {
        width = 0;
      } else if (width == '*') {
        width = +args[index++];
      } else if (width == '$') {
        width = +args[index];
      } else if (width.charAt(width.length - 1) == '$') {
        width = +args[width.slice(0, -1) - 1];
      } else {
        width = +width;
      }
      return isFinite(width) ? width < 0 ? undefined : width : undefined;
    }

    // for index
    function parseArg(i) {
      if (!i || i == '*') return args[index++];
      if (i == '$') return args[index];
      return args[i.slice(0, -1) - 1];
    }

    str = str.replace(formatReg, function (match, idx, flags, minWidth, precision, type) {
      if (type === '%') return '%';

      var value = parseArg(idx);
      minWidth = parseWidth(minWidth);
      precision = precision && parseWidth(precision.slice(1));
      if (!precision && precision !== 0) precision = 'fFeE'.indexOf(type) == -1 && type == 'd' ? 0 : undefined;

      var leftJustify = false,
          positivePrefix = '',
          zeroPad = false,
          prefixBaseX = false,
          thousandSeparation = false,
          prefix = void 0,
          base = void 0,
          c = void 0,
          i = void 0,
          j = void 0;

      for (i = 0, j = flags && flags.length; i < j; i++) {
        c = flags.charAt(i);
        switch (c) {
          case ' ':
          case '+':
            positivePrefix = c;
            break;
          case '-':
            leftJustify = true;
            break;
          case '0':
            zeroPad = true;
            break;
          case '#':
            prefixBaseX = true;
            break;
          case ',':
            thousandSeparation = true;
            break;
        }
      }
      switch (type) {
        case 'c':
          return String.fromCharCode(+value);
        case 's':
          if (isNil(value) && !isNaN(value)) return '';
          value += '';
          if (precision && value.length > precision) value = value.slice(0, precision);
          if (value.length < minWidth) value = pad(value, minWidth, zeroPad ? '0' : ' ', leftJustify);
          return value;
        case 'd':
          value = parseInt(value);
          if (isNaN(value)) return '';
          if (value < 0) {
            prefix = '-';
            value = -value;
          } else {
            prefix = positivePrefix;
          }
          value += '';

          if (value.length < minWidth) value = pad(value, minWidth, '0', false);

          if (thousandSeparation) value = value.replace(thousandSeparationReg, '$1,');
          return prefix + value;
        case 'e':
        case 'E':
        case 'f':
        case 'g':
        case 'G':
        case 'p':
        case 'P':
          {
            var _number = +value;
            if (isNaN(_number)) return '';
            if (_number < 0) {
              prefix = '-';
              _number = -_number;
            } else {
              prefix = positivePrefix;
            }

            switch (type.toLowerCase()) {
              case 'f':
                _number = precision === undefined ? _number + '' : _number.toFixed(precision);
                break;
              case 'e':
                _number = _number.toExponential(precision);
                break;
              case 'g':
                _number = precision === undefined ? _number + '' : _number.toPrecision(precision);
                break;
              case 'p':
                if (precision !== undefined) {
                  var sf = String(value).replace(/[eE].*|[^\d]/g, '');
                  sf = (_number ? sf.replace(/^0+/, '') : sf).length;
                  precision = Math.min(precision, sf);
                  _number = _number[!precision || precision <= sf ? 'toPrecision' : 'toExponential'](precision);
                } else {
                  _number += '';
                }
                break;
            }

            if (_number.length < minWidth) _number = pad(_number, minWidth, '0', false);
            if (thousandSeparation) {
              var split = _number.split('.');
              split[0] = split[0].replace(thousandSeparationReg, '$1,');
              _number = split.join('.');
            }
            value = prefix + _number;
            if ('EGP'.indexOf(type) != -1) return value.toUpperCase();
            return value;
          }
        case 'b':
          base = 2;
          break;
        case 'o':
          base = 8;
          break;
        case 'u':
          base = 10;
          break;
        case 'x':
        case 'X':
          base = 16;
          break;
        case 'n':
          return '';
        default:
          return match;
      }
      var number = value >>> 0;
      prefix = prefixBaseX && base != 10 && number && ['0b', '0', '0x'][base >> 3] || '';
      number = number.toString(base);
      if (number.length < minWidth) number = pad(number, minWidth, '0', false);
      value = prefix + number;
      if (type == 'X') return value.toUpperCase();
      return value;
    });

    return {
      format: str, // format result
      count: index // format param count
    };
  }

  function format(str) {
    return _format(str, slice$1.call(arguments, 1)).format;
  }

  format.format = _format;

var string = Object.freeze({
    upperFirst: upperFirst,
    ltrim: ltrim,
    rtrim: rtrim,
    trim: trim,
    plural: plural,
    singular: singular,
    thousandSeparate: thousandSeparate,
    format: format
  });

  function isExtendOf(cls, parent) {
    if (!isFunc(cls)) return cls instanceof parent;

    var proto = cls;

    while ((proto = prototypeOf(proto)) && proto !== Object) {
      if (proto === parent) return true;
    }
    return parent === Object;
  }

  function Base() {}
  var emptyArray = [];
  assign(Base.prototype, {
    'super': function (args) {
      var method = arguments.callee.caller;
      return method.$owner.superclass[method.$name].apply(this, args || emptyArray);
    },
    superclass: function () {
      var method = arguments.callee.caller;
      return method.$owner.superclass;
    }
  });

  assign(Base, {
    extend: function (overrides) {
      var _this = this;

      if (overrides) {
        var proto = this.prototype;
        each(overrides, function (member, name) {
          if (isFunc(member)) {
            member.$owner = _this;
            member.$name = name;
          }
          proto[name] = member;
        });
        this.assign(overrides.statics);
      }
      return this;
    },
    assign: function (statics) {
      if (statics) assign(this, statics);
      return this;
    }
  });

  function dynamicClass(overrides) {
    var cls = function DynamicClass() {
      this.constructor.apply(this, arguments);
    },
        superclass = overrides.extend,
        superproto = void 0,
        proto = void 0;

    assign(cls, Base);

    if (!isFunc(superclass) || superclass === Object) superclass = Base;

    superproto = superclass.prototype;

    proto = create(superproto);

    cls.superclass = superproto;
    cls.prototype = proto;
    setPrototypeOf(cls, superclass);

    delete overrides.extend;
    return cls.extend(overrides);
  }

  function mixin(cls) {
    var args = arguments.slice();
    args[0] = cls.prototype;
    assignIf.apply(null, args);
    return cls;
  }

var cls = Object.freeze({
    isExtendOf: isExtendOf,
    Base: Base,
    dynamicClass: dynamicClass,
    mixin: mixin
  });

  var nextTick = function () {
    var callbacks = [];
    var pending = false;
    var timerFunc;

    function nextTickHandler() {
      pending = false;
      var copies = callbacks.slice(0);
      callbacks.length = 0;
      for (var i = 0; i < copies.length; i++) {
        copies[i]();
      }
    }
    if (typeof MutationObserver !== 'undefined') {
      var counter = 1;
      var observer = new MutationObserver(nextTickHandler);
      var textNode = document.createTextNode(counter);
      observer.observe(textNode, {
        characterData: true
      });
      timerFunc = function () {
        counter = (counter + 1) % 2;
        textNode.data = counter;
      };
    } else {
      timerFunc = window.setImmediate || setTimeout;
    }
    return function (cb, ctx) {
      var func = ctx ? function () {
        cb.call(ctx);
      } : cb;
      callbacks.push(func);
      if (pending) return;
      pending = true;
      timerFunc(nextTickHandler, 0);
    };
  }();

var util = Object.freeze({
    nextTick: nextTick
  });

  var LIST_KEY = '__linked_list__';
  var IDGenerator = 1;

  var LinkedList = dynamicClass({
    statics: {
      LIST_KEY: LIST_KEY
    },
    constructor: function () {
      this._id = IDGenerator++;
      this.length = 0;
      this._header = undefined;
      this._tail = undefined;
      this._version = 1;
    },
    _listObj: function (obj) {
      return hasOwnProp(obj, LIST_KEY) && obj[LIST_KEY];
    },
    _desc: function (obj) {
      var list = this._listObj(obj);
      return list && list[this._id];
    },
    _newDesc: function (obj) {
      return {
        obj: obj,
        prev: undefined,
        next: undefined,
        version: this._version++
      };
    },
    _getOrCreateDesc: function (obj) {
      var list = this._listObj(obj) || (obj[LIST_KEY] = {}),
          desc = list[this._id];
      return desc || (list[this._id] = this._newDesc(obj));
    },
    _unlink: function (desc) {
      var prev = desc.prev,
          next = desc.next;

      if (prev) {
        prev.next = next;
      } else {
        this._header = next;
      }
      if (next) {
        next.prev = prev;
      } else {
        this._tail = prev;
      }
      this.length--;
    },
    _move: function (desc, prev, alwaysMove) {
      var header = this._header;

      if (header === desc || desc.prev) this._unlink(desc);

      desc.prev = prev;
      if (prev) {
        desc.next = prev.next;
        prev.next = desc;
      } else {
        desc.next = header;
        if (header) header.prev = desc;
        this._header = desc;
      }
      if (this._tail === prev) this._tail = desc;
      this.length++;
    },
    _remove: function (desc) {
      var obj = desc.obj,
          list = this._listObj(obj);

      this._unlink(desc);
      delete list[this._id];
    },
    push: function () {
      var cnt = 0,
          i = 0,
          l = arguments.length,
          obj = void 0,
          list = void 0;

      for (; i < l; i++) {
        obj = arguments[i];
        list = this._listObj(obj) || (obj[LIST_KEY] = {});

        if (!list[this._id]) {
          this._move(list[this._id] = this._newDesc(obj), this._tail);
          cnt++;
        }
      }
      return cnt;
    },
    pop: function () {
      var head = this._header;

      if (head) {
        this._remove(head);
        return head.obj;
      }
      return undefined;
    },
    shift: function () {
      var tail = this._tail;

      if (tail) {
        this._remove(tail);
        return tail.obj;
      }
      return undefined;
    },
    first: function () {
      var l = arguments.length;
      if (!l) {
        var head = this._header;
        return head && head.obj;
      }
      while (l--) {
        this._move(this._getOrCreateDesc(arguments[l]), undefined);
      }
      return this;
    },
    last: function () {
      if (!arguments.length) return this._tail && this._tail.obj;

      for (var i = 0, l = arguments.length; i < l; i++) {
        this._move(this._getOrCreateDesc(arguments[i]), this._tail);
      }
      return this;
    },
    before: function (target) {
      var l = arguments.length,
          tdesc = this._desc(target),
          prev = tdesc && tdesc.prev;

      if (l == 1) return prev && prev.obj;
      while (l-- > 1) {
        this._move(this._getOrCreateDesc(arguments[l]), prev);
      }
      return this;
    },
    after: function (target) {
      var l = arguments.length,
          tdesc = this._desc(target);
      if (l == 1) {
        var next = tdesc && tdesc.next;
        return next && next.obj;
      }
      while (l-- > 1) {
        this._move(this._getOrCreateDesc(arguments[l]), tdesc);
      }
      return this;
    },
    contains: function (obj) {
      return !!this._desc(obj);
    },
    remove: function () {
      var cnt = 0,
          i = 0,
          l = arguments.length,
          desc = void 0,
          list = void 0;
      for (; i < l; i++) {
        list = this._listObj(arguments[i]);
        desc = list && list[this._id];
        if (desc) {
          this._unlink(desc);
          delete list[this._id];
          cnt++;
        }
      }
      return cnt;
    },
    clean: function () {
      var desc = this._header;
      while (desc) {
        delete this._listObj(desc.obj)[this._id];
        desc = desc.next;
      }
      this._header = undefined;
      this._tail = undefined;
      this.length = 0;
      return this;
    },
    empty: function () {
      return this.length == 0;
    },
    size: function () {
      return this.length;
    },
    each: function (callback, scope) {
      var desc = this._header,
          ver = this._version;

      while (desc) {
        if (desc.version < ver) {
          if (callback.call(scope || this, desc.obj, this) === false) return false;
        }
        desc = desc.next;
      }
      return true;
    },
    map: function (callback, scope) {
      var _this = this;

      var rs = [];
      this.each(function (obj) {
        rs.push(callback.call(scope || _this, obj, _this));
      });
      return rs;
    },
    filter: function (callback, scope) {
      var _this2 = this;

      var rs = [];
      this.each(function (obj) {
        if (callback.call(scope || _this2, obj, _this2)) rs.push(obj);
      });
      return rs;
    },
    toArray: function () {
      var rs = [];
      this.each(function (obj) {
        rs.push(obj);
      });
      return rs;
    }
  });

  function fn(name) {
    return function () {
      throw new Error('execute abstract method[' + name + ']');
    };
  }

  var AbstractConfiguration = dynamicClass({
    hasConfig: fn('hasConfig'),
    config: fn('config'),
    get: fn('get'),
    each: fn('each')
  });

  var logLevels = ['debug', 'info', 'warn', 'error'];
  var tmpEl = document.createElement('div');
var   slice$2 = Array.prototype.slice;
  var SimulationConsole = dynamicClass({
    constructor: function () {
      tmpEl.innerHTML = '<div id="simulation_console"\n    style="position:absolute; top:0; right:0; font-family:courier,monospace; background:#eee; font-size:10px; padding:10px; width:200px; height:200px;">\n  <a style="float:right; padding-left:1em; padding-bottom:.5em; text-align:right;">Clear</a>\n  <div id="simulation_console_body"></div>\n</div>';
      this.el = tmpEl.childNodes[0];
      this.clearEl = this.el.childNodes[0];
      this.bodyEl = this.el.childNodes[1];
    },
    appendTo: function (el) {
      el.appendChild(this.el);
    },
    log: function (style, msg) {
      tmpEl.innerHTML = '<span style="' + style + '">' + msg + '</span>';
      this.bodyEl.appendChild(tmpEl.childNodes[0]);
    },
    parseMsg: function (args) {
      var msg = args[0];
      if (isString(msg)) {
        var f = format.format.apply(null, args);
        return [f.format].concat(slice$2.call(args, f.count)).join(' ');
      }
      return args.join(' ');
    },
    debug: function () {
      this.log('color: red;', this.parseMsg(arguments));
    },
    info: function () {
      this.log('color: red;', this.parseMsg(arguments));
    },
    warn: function () {
      this.log('color: red;', this.parseMsg(arguments));
    },
    error: function () {
      this.log('color: red;', this.parseMsg(arguments));
    },
    clear: function () {
      this.bodyEl.innerHTML = '';
    }
  });
  var console = window.console;
  var Logger = dynamicClass({
    statics: {
      enableSimulationConsole: function () {
        if (!console) {
          console = new SimulationConsole();
          console.appendTo(document.body);
        }
      }
    },
    constructor: function (_module, level) {
      this.module = _module;
      this.setLevel(level);
    },
    setLevel: function (level) {
      this.level = indexOf(logLevels, level || 'info');
    },
    getLevel: function () {
      return logLevels[this.level];
    },
    _print: function (level, args, trace) {
      try {
        Function.apply.call(console[level] || console.log, console, args);
        if (trace && console.trace) console.trace();
      } catch (e) {}
    },
    _log: function (level, args, trace) {
      if (level < this.level || !console) return;
      args = this._parseArgs(level, args);
      this._print(level, args, trace);
    },
    _parseArgs: function (level, args) {
      var i = 0,
          l = args.length,
          msg = '[' + logLevels[level] + '] ' + this.module + ' - ',
          _args = [];

      if (isString(args[0])) {
        msg += args[0];
        i++;
      }
      _args.push(msg);
      for (; i < l; i++) {
        this.parseArg(_args, args[i]);
      }
      return _args;
    },
    parseArg: function (args, arg) {
      if (arg === undefined) {
        args.push('undefined');
      } else if (arg instanceof Error) {
        args.push(arg.message, '\n', arg.stack);
      } else {
        args.push(arg);
      }
    },
    debug: function () {
      this._log(0, arguments);
    },
    info: function () {
      this._log(1, arguments);
    },
    warn: function () {
      this._log(2, arguments);
    },
    error: function () {
      this._log(3, arguments);
    }
  });

  Logger.logger = new Logger('default', 'info');

  var logger = Logger.logger;

  var Configuration = dynamicClass({
    extend: AbstractConfiguration,
    constructor: function (def, statusList, defaultStatus, checkStatus) {
      this.cfg = def || {};
      this.cfgStatus = {};
      this.listens = {};
      statusList = statusList || [];
      this.statusList = statusList;
      this.statusCnt = statusList.length;
      var idx = indexOf(statusList, defaultStatus);
      if (idx == -1) idx = 0;
      this.status = statusList[idx];
      this.statusIdx = idx;
      if (isFunc(checkStatus)) this.checkStatus = checkStatus;
    },
    nextStatus: function () {
      if (this.statusIdx < this.statusCnt) this.status = this.statusList[this.statusIdx++];
    },
    register: function (name, defVal, status, validator) {
      this.cfg[name] = defVal;
      this.cfgStatus[name] = {
        statusIdx: indexOf(this.statusList, status),
        validator: validator
      };
      return this;
    },
    checkStatus: function (s, cs, i, ci) {
      return i >= ci;
    },
    hasConfig: function (name) {
      return hasOwnProp(this.cfg, name);
    },
    config: function (name, val) {
      var _this = this;

      if (isObject(name)) {
        each(name, function (val, name) {
          _this.config(name, val);
        });
      } else if (hasOwnProp(this.cfg, name)) {
        var _cfgStatus$name = this.cfgStatus[name];
        var statusIdx = _cfgStatus$name.statusIdx;
        var validator = _cfgStatus$name.validator;


        if (statusIdx != -1 && !this.checkStatus(this.statusList[statusIdx], this.status, statusIdx, this.statusIdx)) {
          logger.warn('configuration[%s]: must use in status[%s]', name, this.statusList[statusIdx]);
          return;
        }
        if (isFunc(validator) && validator(val, name, this) !== false) {
          logger.warn('configuration[%s]: invalid value[%s]', name, val);
          return;
        }
        var oldVal = this.cfg[name];
        this.cfg[name] = val;
        each(this.listens[name], function (cb) {
          cb(name, val, oldVal, _this);
        });
      }
    },
    get: function (name) {
      return arguments.length ? this.cfg[name] : create(this.cfg);
    },
    each: function (cb) {
      each(this.cfg, function (val, name) {
        cb(val, name);
      });
    },
    on: function (name, handler) {
      var _this2 = this;

      if (!isFunc(handler)) throw new Error('Invalid Callback');
      if (isArray(name)) {
        each(name, function (name) {
          _this2.on(name, handler);
        });
        return this;
      } else if (this.hasConfig(name)) {
        (this.listens[name] || (this.listens[name] = [])).push(handler);
      }
      return this;
    },
    un: function (name, handler) {
      var _this3 = this;

      if (isArray(name)) {
        each(name, function (name) {
          _this3.un(name, handler);
        });
      } else if (this.hasConfig(name)) {
        var queue = this.listens[name],
            idx = queue ? indexOf(queue, handler) : -1;
        if (idx != -1) queue.splice(idx, 1);
      }
      return this;
    }
  });

  function check(cfg) {
    if (!(cfg instanceof AbstractConfiguration)) throw new Error('Invalid Configuration: ' + cfg);
    return cfg;
  }
  var ConfigurationChain = dynamicClass({
    extend: AbstractConfiguration,
    constructor: function () {
      var cfgs = [];
      each(arguments, function (cfg) {
        if (isArray$1(cfg)) {
          each(cfg, function (c) {
            cfgs.push(check(c));
          });
        } else {
          cfgs.push(check(cfg));
        }
      });
      this.cfgs = cfgs;
    },
    hasConfig: function (name) {
      return each(this.cfgs, function (cfg) {
        return !cfg.hasConfig(name);
      }) == false;
    },
    config: function (name, val) {
      each(this.cfgs, function (cfg) {
        cfg.config(name, val);
      });
    },
    get: function (name) {
      if (arguments.length) {
        var val = undefined;
        each(this.cfgs, function (cfg) {
          if (cfg.hasConfig(name)) {
            val = cfg.get(name);
            return false;
          }
        });
        return val;
      }
      var cfg = {};
      each(this.cfgs, function (c) {
        c.each(function (val, name) {
          cfg[name] = val;
        });
      });
      return cfg;
    },
    each: function (cb) {
      each(this.cfgs, function (cfg) {
        cfg.each(cb);
      });
    }
  });

  var _ = assign({
    LinkedList: LinkedList,
    Configuration: Configuration,
    ConfigurationChain: ConfigurationChain,
    Logger: Logger
  }, common, is, coll, obj$1, string, cls, util);

  var reg = /{([^{]+)}/g;
  var TextParser = _.dynamicClass({
    constructor: function (text) {
      this.text = text;
      this.index = 0;
    },
    nextToken: function () {
      var token = reg.exec(this.text);

      if (token) {
        var index = this.index = reg.lastIndex;

        return {
          token: token[1],
          start: index - token[0].length,
          end: index
        };
      }
      this.index = 0;
    }
  });

  var configuration = new _.Configuration({}, ['init', 'runtime']);

  configuration.register('bindProxy', '__observi_proxy__', 'init');

var   hasOwn$3 = Object.prototype.hasOwnProperty;
var   cfg$2 = configuration.get();
  var enabled = undefined;

  var core$1 = {
    eq: function (o1, o2) {
      return o1 === o2;
    },
    obj: function (o) {
      return o;
    },
    proxy: function (o) {
      return o;
    },
    change: function (obj, p) {
      var key = cfg$2.bindProxy,
          handlers = hasOwn$3.call(obj, key) ? obj[key] : undefined;
      if (handlers) handlers.each(function (handler) {
        return handler(obj, p);
      });
    },
    on: function (obj, handler, checkFirst) {
      if (!_.isFunc(handler)) throw TypeError('Invalid Proxy Event Handler[' + handler);

      var realObj = proxy$1.obj(obj),
          key = cfg$2.bindProxy,
          handlers = hasOwn$3.call(realObj, key) ? realObj[key] : realObj[key] = new _.LinkedList();

      if (handlers.push(handler) == 1) {
        var p;
        if (obj === realObj && (p = proxy$1.proxy(obj)) !== obj) handler(obj, p);
        return true;
      }
      return false;
    },
    un: function (obj, handler) {
      obj = proxy$1.obj(obj);
      var key = cfg$2.bindProxy,
          handlers = hasOwn$3.call(obj, key) ? obj[key] : undefined;

      if (handlers && _.isFunc(handler)) return handlers.remove(handler) == 1;
      return false;
    },
    clean: function (obj) {
      var key = cfg$2.bindProxy;
      obj = proxy$1.obj(obj);
      if (hasOwn$3.call(obj, key)) obj[key] = undefined;
    },
    isEnable: function () {
      return enabled;
    },
    enable: function (policy) {
      if (enabled === undefined) {
        proxy$1.eq = policy.eq;
        proxy$1.obj = policy.obj;
        proxy$1.proxy = policy.proxy;
        _.policy('hasOwn', function (obj, prop) {
          return hasOwn$3.call(proxy$1.obj(obj), prop);
        });
        _.policy('eq', proxy$1.eq);
        enabled = true;
      }
    },
    disable: function () {
      if (enabled === undefined) {
        enabled = false;
        proxy$1.change = proxy$1.on = proxy$1.un = proxy$1.clean = _.emptyFunc;
      }
    }
  };
  function proxy$1(o) {
    return proxy$1.proxy(o);
  }
  _.assign(proxy$1, core$1);

  var interceptGetter = false;
  var Watcher = _.dynamicClass({
    'static': {
      interceptGetter: function (cb) {
        interceptGetter = true;
        cb();
        interceptGetter = false;
      }
    },
    constructor: function (obj) {
      this.obj = obj;
      this.proxy = obj; // proxy object eg: ES6 Proxy, VBScript
      this.setters = {}; // setter callback queue
      this.watched = {}; // watched cache
    },
    set: function (attr, val, oldVal) {
      var _this = this;

      queue = this.setters[attr];
      if (queue) {
        var eq = proxy$1.eq(val, oldVal);
        if (!eq || !_.isPrimitive(val)) {
          queue.each(function (cb) {
            return cb(attr, val, oldVal, _this, eq);
          });
        }
      }
    },
    setter: function (attr, cb) {
      return this.accessor(this.setters, attr, cb);
    },
    unsetter: function (attr, cb) {
      return this.unaccessor(this.setters, attr, cb);
    },

    // 1. add callback to accessor callback queue
    // 2. watch property if not-watched
    accessor: function (accessors, attr, cb) {
      var queue = accessors[attr] || (accessors[attr] = new _.LinkedList()),
          success = queue.push(cb) == 1;
      if (success && !this.watched[attr]) {
        this.watch(attr);
        this.watched[attr] = true;
      }
      return success;
    },

    // 1. remove callback in accessor callback queue
    // not unwatch property, can reuse in next watch
    unaccessor: function (accessors, attr, cb) {
      var queue = accessors[attr];
      return queue ? queue.remove(cb) == 1 : false;
    },

    // watch property, intercept getter and setter
    watch: function () {
      throw new Error('abstract function watch');
    }
  });

  var logger$1 = new _.Logger('observi', 'info');

  var watchers = [];
  var currentWatcher = void 0;
  function registerWatcher(name, priority, validator, builder) {
    if (!watchers) throw new Error('Can not register Watcher in runtime');
    watchers.push({
      name: name,
      priority: priority,
      validator: validator,
      builder: builder
    });
    watchers.sort(function (w1, w2) {
      return w1.priority - w2.priority;
    });
    logger$1.info('register observi Watcher[%s], priority = %d', name, priority);
  }

  function initWatcher() {
    if (!watchers) return;
    configuration.nextStatus();
    var cfg = configuration.get();
    _.each(watchers, function (watcher) {
      var _watcher = watcher;
      var validator = _watcher.validator;
      var builder = _watcher.builder;
      var name = _watcher.name;
      var priority = _watcher.priority;


      if (!_.isFunc(validator) || validator(cfg)) {
        try {
          watcher = builder(cfg);
          if (_.isFunc(watcher) && _.isExtendOf(watcher, Watcher)) {
            currentWatcher = watcher;
            logger$1.info('apply observi Watcher[%s], priority = %d', name, priority);
            return false;
          } else {
            logger$1.error('invalid observi Watcher[%s], priority = %d', name, priority);
          }
        } catch (e) {
          logger$1.error('apply observi Watcher[%s] failed', e);
        }
      }
    });
    if (!currentWatcher) throw new Error('Init observi Watcher Failed');
    watchers = undefined; // clean watchers
    return currentWatcher;
  }

  function createWatcher(obj) {
    var Watcher = currentWatcher || initWatcher();
    return new Watcher(obj);
  }

  var queue$1 = [];
  var waiting = false;

  function flushQueue() {
    var observi = void 0;
    flushing = true;
    while (observi = queue$1.shift()) {
      observi.notify();
    }
    waiting = false;
  }

  function notify(observi) {
    queue$1.push(observi);
    if (!waiting) {
      waiting = true;
      _.nextTick(flushQueue);
    }
  }

  var hasOwn$2 = Object.prototype.hasOwnProperty;
  var lazy = true;
  var bindWatcher = '__observi_watcher__';
  configuration.register('key.watcher', lazy, 'init', function (val) {
    return lazy = val;
  }).register('lazy', bindWatcher, 'init', function (val) {
    return bindWatcher = val;
  });

  function getOrCreateWatcher(obj) {
    if (hasOwn$2.call(obj, bindWatcher)) return obj[bindWatcher];
    return obj[bindWatcher] = createWatcher(obj);
  }

  var Observi = _.dynamicClass({
    constructor: function (obj, expr, path) {
      this.obj = obj;
      this.expr = expr;
      this.path = path;
      this.watchers = Array(path.length);
      this.callbacks = this.createCallbacks();
      this.watch(obj, 0);
      this.watcher = this.watchers[0];
      this.handlers = new _.LinkedList();
    },
    on: function (handler) {
      return this.handlers.push(handler);
    },
    un: function (handler) {
      if (!arguments.length) {
        var size = this.landlers.size();
        this.handlers.clean();
        return size;
      } else {
        return this.handlers.remove(handler);
      }
    },
    isListened: function (handler) {
      return _.isNil(handler) ? !this.handlers.empty() : this.handlers.contains(handler);
    },
    fire: function (val, oldVal, eq) {
      var expr = this.expr,
          _proxy = this.watcher.proxy;
      this.handlers.each(function (cb) {
        return cb(expr, val, oldVal, _proxy, eq);
      });
    },
    notify: function () {
      if (this.dirty) {
        this.fire(this.newVal, this.oldVal, this.eq);
        this.dirty = false;
      }
    },
    update: function (val, oldVal, eq) {
      if (lazy) {
        this.newVal = val;
        if (this.dirty) {
          if ((eq = proxy$1.eq(val, this.oldVal)) && _.isPrimitive(val)) {
            this.dirty = false;
            return;
          }
          this.eq = eq;
        } else {
          this.oldVal = oldVal;
          this.eq = eq;
          this.dirty = true;
          notify(this);
        }
      } else {
        this.fire(val, oldVal, eq);
      }
    },
    createCallbacks: function () {
      return _.map(this.path, function (prop, i) {
        return this.createCallback(i);
      }, this);
    },
    createCallback: function (idx) {
      var _this = this;

      var path = this.path,
          nextIdx = idx + 1,
          rpath = path.length - nextIdx && path.slice(nextIdx);

      return function (attr, val, oldVal, watcher, eq) {
        if (rpath) {
          if (eq) return;

          // unwatch & get old value
          if (oldVal) {
            oldVal = proxy$1.obj(oldVal);
            _this.unwatch(oldVal, nextIdx);
            oldVal = _.get(oldVal, rpath);
          } else {
            oldVal = undefined;
          }
          // watch & get new value
          if (val) {
            if (proxy$1.isEnable()) {
              // reset value on up-level object
              val = proxy$1.obj(val);
              var watcher = _this.watch(val, nextIdx),
                  i = 0,
                  obj = _this.obj;
              while (i < idx) {
                // find up-level object
                obj = proxy$1.obj(obj[path[i++]]);
                if (!obj) return;
              }
              obj[path[idx]] = watcher.proxy;
            } else {
              _this.watch(val, nextIdx);
            }
            val = _.get(val, rpath);
          } else {
            val = undefined;
          }
          if ((eq = proxy$1.eq(val, oldVal)) && _.isPrimitive(val)) return;
        }
        _this.update(val, oldVal, eq);
      };
    },
    watch: function (obj, idx) {
      var path = this.path,
          attr = path[idx],
          watcher = this.watchers[idx] || (this.watchers[idx] = getOrCreateWatcher(obj)),
          val = void 0;

      watcher.setter(attr, this.callbacks[idx]);

      if (++idx < path.length && (val = obj[attr])) {
        if (proxy$1.isEnable()) {
          obj[attr] = this.watch(proxy$1.obj(val), idx).proxy;
        } else {
          this.watch(val, idx);
        }
      }
      return watcher;
    },
    unwatch: function (obj, idx) {
      var watcher = this.watchers[idx];
      if (watcher) {
        var path = this.path,
            attr = path[idx],
            val;

        watcher.unsetter(attr, this.callbacks[idx]);
        this.watchers[idx] = undefined;

        if (++idx < path.length && (val = obj[attr])) this.unwatch(proxy$1.obj(val), idx);
      }
      return watcher;
    }
  });

  var hasOwn$4 = Object.prototype.hasOwnProperty;

  configuration.register('enableES6Proxy', true, 'init');
  configuration.register('bindES6ProxySource', '__observi_es6proxy_source__', 'init');
  configuration.register('bindES6Proxy', '__observi_es6proxy__', 'init');

  registerWatcher('ES6Proxy', 10, function (config) {
    return window.Proxy && config.enableES6Proxy !== false;
  }, function (config) {
    var bindES6ProxySource = config.bindES6ProxySource;
    var bindES6Proxy = config.bindES6Proxy;


    var cls = _.dynamicClass({
      extend: Watcher,
      constructor: function () {
        this['super'](arguments);
        this.binded = false;
      },
      watch: function (attr) {
        if (!this.binded) {
          var obj = this.obj,
              _proxy = this.createProxy();
          this.proxy = _proxy;
          obj[bindES6Proxy] = _proxy;
          obj[bindES6ProxySource] = obj;
          proxy$1.change(obj, _proxy);

          this.binded = true;
        }
      },
      createProxy: function () {
        var _this = this;

        return new Proxy(this.obj, {
          set: function (obj, attr, value) {
            var oldVal = obj[attr];
            obj[attr] = value;
            _this.set(attr, value, oldVal);
            return true;
          }
        });
      }
    });
    proxy$1.enable({
      obj: function (obj) {
        if (obj && hasOwn$4.call(obj, bindES6ProxySource)) return obj[bindES6ProxySource];
        return obj;
      },
      eq: function (o1, o2) {
        return o1 === o2 || proxy$1.obj(o1) === proxy$1.obj(o2);
      },
      proxy: function (obj) {
        if (obj && hasOwn$4.call(obj, bindES6Proxy)) return obj[bindES6Proxy] || obj;
        return obj;
      }
    });
    return cls;
  });

  var arrayProto = Array.prototype;
  var arrayHooks = 'fill,pop,push,reverse,shift,sort,splice,unshift'.split(',');
  var ArrayWatcher = _.dynamicClass({
    extend: Watcher,
    constructor: function () {
      this['super'](arguments);
      this.isArray = _.isArray(this.obj);
      if (this.isArray) {
        this.hookArray();
      }
    },
    watch: function (attr) {
      return this.isArray && attr == 'length';
    },
    hookArray: function () {
      _.each(arrayHooks, this.hookArrayMethod, this);
    },
    hookArrayMethod: function (name) {
      var obj = this.obj,
          method = arrayProto[name],
          len = obj.length,
          self = this;

      obj[name] = function () {
        var len = obj.length,
            ret = method.apply(obj, arguments);
        self.set('length', obj.length, len);
        return ret;
      };
    }
  });

  registerWatcher('ES5DefineProperty', 20, function (config) {
    if (Object.defineProperty) {
      try {
        var _ret = function () {
          var val = void 0,
              obj = {};
          Object.defineProperty(obj, 'sentinel', {
            get: function () {
              return val;
            },
            set: function (value) {
              val = value;
            }
          });
          obj.sentinel = 1;
          return {
            v: obj.sentinel === val
          };
        }();

        if (typeof _ret === "object") return _ret.v;
      } catch (e) {}
    }
    return false;
  }, function (config) {
    var cls = _.dynamicClass({
      extend: ArrayWatcher,
      watch: function (attr) {
        var _this = this;

        if (this['super']([attr])) return;

        var value = this.obj[attr];
        Object.defineProperty(this.obj, attr, {
          enumerable: true,
          configurable: true,
          get: function () {
            return value;
          },
          set: function (val) {
            var oldVal = value;
            value = val;
            _this.set(attr, val, oldVal);
          }
        });
      }
    });
    proxy$1.disable();
    return cls;
  });

  registerWatcher('DefineGetterAndSetter', 30, function (config) {
    return '__defineGetter__' in {};
  }, function (config) {
    var cls = _.dynamicClass({
      extend: ArrayWatcher,
      watch: function (attr) {
        var _this = this;

        if (this['super']([attr])) return;

        var value = this.obj[attr];
        this.obj.__defineGetter__(attr, function () {
          return value;
        });
        this.obj.__defineSetter__(attr, function (val) {
          var oldVal = value;
          value = val;
          _this.set(attr, val, oldVal);
        });
      }
    });
    proxy$1.disable();
    return cls;
  });

var   hasOwn$5 = Object.prototype.hasOwnProperty;
  var RESERVE_PROPS = 'hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'.split(',');
  var RESERVE_ARRAY_PROPS = 'concat,copyWithin,entries,every,fill,filter,find,findIndex,forEach,includes,indexOf,join,keys,lastIndexOf,map,pop,push,reduce,reduceRight,reverse,shift,slice,some,sort,splice,unshift,values'.split(',');
  var supported = undefined;
  var VBClassFactory = _.dynamicClass({
    statics: {
      isSupport: function () {
        if (supported !== undefined) return supported;
        supported = false;
        if (window.VBArray) {
          try {
            window.execScript(['Function parseVB(code)', '\tExecuteGlobal(code)', 'End Function'].join('\n'), 'VBScript');
            supported = true;
          } catch (e) {
            logger$1.error(e.message, e);
          }
        }
        return supported;
      }
    },
    classNameGenerator: 0,
    constructor: function (defProps, constBind, descBind, onProxyChange) {
      this.classPool = {};
      this.defPropMap = {};
      this.constBind = constBind;
      this.descBind = descBind;
      this.onProxyChange = onProxyChange;
      this.addDefProps(defProps);
      this.initConstScript();
    },
    addDefProps: function (defProps) {
      var defPropMap = this.defPropMap,
          props = [];

      _.each(defProps || [], function (prop) {
        defPropMap[prop] = true;
      });
      for (var prop in defPropMap) {
        if (hasOwn$5.call(defPropMap, prop)) props.push(prop);
      }
      this.defProps = props;
      logger$1.info('VBProxy default props is: ', props.join(','));
      this.initReserveProps();
    },
    initReserveProps: function () {
      this.reserveProps = RESERVE_PROPS.concat(this.defProps);
      this.reserveArrayProps = this.reserveProps.concat(RESERVE_ARRAY_PROPS);
      this.reservePropMap = _.reverseConvert(this.reserveProps);
      this.reserveArrayPropMap = _.reverseConvert(this.reserveArrayProps);
    },
    initConstScript: function () {
      this.constScript = ['\tPublic [', this.descBind, ']\r\n', '\tPublic Default Function [', this.constBind, '](desc)\r\n', '\t\tset [', this.descBind, '] = desc\r\n', '\t\tSet [', this.constBind, '] = Me\r\n', '\tEnd Function\r\n'].join('');
    },
    generateClassName: function () {
      return 'VBClass' + this.classNameGenerator++;
    },
    parseClassConstructorName: function (className) {
      return className + 'Constructor';
    },
    generateSetter: function (attr) {
      var descBind = this.descBind;

      return ['\tPublic Property Get [', attr, ']\r\n', '\tOn Error Resume Next\r\n', '\t\tSet[', attr, '] = [', descBind, '].get("', attr, '")\r\n', '\tIf Err.Number <> 0 Then\r\n', '\t\t[', attr, '] = [', descBind, '].get("', attr, '")\r\n', '\tEnd If\r\n', '\tOn Error Goto 0\r\n', '\tEnd Property\r\n'];
    },
    generateGetter: function (attr) {
      var descBind = this.descBind;

      return ['\tPublic Property Let [', attr, '](val)\r\n', '\t\tCall [', descBind, '].set("', attr, '",val)\r\n', '\tEnd Property\r\n', '\tPublic Property Set [', attr, '](val)\r\n', '\t\tCall [', descBind, '].set("', attr, '",val)\r\n', '\tEnd Property\r\n'];
    },
    generateClass: function (className, props, funcMap) {
      var _this = this;

      var buffer = ['Class ', className, '\r\n', this.constScript, '\r\n'];

      _.each(props, function (attr) {
        if (funcMap[attr]) {
          buffer.push('\tPublic [' + attr + ']\r\n');
        } else {
          buffer.push.apply(buffer, _this.generateSetter(attr));
          buffer.push.apply(buffer, _this.generateGetter(attr));
        }
      });
      buffer.push('End Class\r\n');
      return buffer.join('');
    },
    generateClassConstructor: function (props, funcMap, funcArray) {
      var key = [props.length, '[', props.join(','), ']', '[', funcArray.join(','), ']'].join(''),
          classConstName = this.classPool[key];

      if (classConstName) return classConstName;

      var className = this.generateClassName();
      classConstName = this.parseClassConstructorName(className);
      parseVB(this.generateClass(className, props, funcMap));
      parseVB(['Function ', classConstName, '(desc)\r\n', '\tDim o\r\n', '\tSet o = (New ', className, ')(desc)\r\n', '\tSet ', classConstName, ' = o\r\n', 'End Function'].join(''));
      this.classPool[key] = classConstName;
      return classConstName;
    },
    create: function (obj, desc) {
      var _this2 = this;

      var protoProps = void 0,
          protoPropMap = void 0,
          props = [],
          funcs = [],
          funcMap = {},
          descBind = this.descBind;

      function addProp(prop) {
        if (_.isFunc(obj[prop])) {
          funcMap[prop] = true;
          funcs.push(prop);
        }
        props.push(prop);
      }

      if (_.isArray(obj)) {
        protoProps = this.reserveArrayProps;
        protoPropMap = this.reserveArrayPropMap;
      } else {
        protoProps = this.reserveProps;
        protoPropMap = this.reservePropMap;
      }
      _.each(protoProps, addProp);
      _.each(obj, function (val, prop) {
        if (prop !== descBind && !(prop in protoPropMap)) addProp(prop);
      }, obj, false);

      if (!desc) {
        desc = this.descriptor(obj);
        if (desc) {
          obj = desc.obj;
        } else {
          desc = new ObjectDescriptor(obj, props, this);
        }
      }

      proxy = window[this.generateClassConstructor(props, funcMap, funcs)](desc);
      desc.proxy = proxy;

      _.each(funcs, function (prop) {
        proxy[prop] = _this2.funcProxy(obj[prop], prop in protoPropMap ? obj : proxy);
      });

      this.onProxyChange(obj, proxy);
      return desc;
    },
    funcProxy: function (fn, scope) {
      return function () {
        return fn.apply(this === window ? scope : this, arguments);
      };
    },
    eq: function (o1, o2) {
      var d1 = this.descriptor(o1),
          d2 = this.descriptor(o2);

      if (d1) o1 = d1.obj;
      if (d2) o2 = d2.obj;
      return o1 === o2;
    },
    obj: function (obj) {
      var desc = this.descriptor(obj);

      return desc ? desc.obj : obj;
    },
    proxy: function (obj) {
      var desc = this.descriptor(obj);

      return desc ? desc.proxy : undefined;
    },
    isProxy: function (obj) {
      return hasOwn$5.call(obj, this.constBind);
    },
    descriptor: function (obj) {
      var descBind = this.descBind;

      return hasOwn$5.call(obj, descBind) ? obj[descBind] : undefined;
    },
    destroy: function (desc) {
      this.onProxyChange(obj, undefined);
    }
  });

  var ObjectDescriptor = _.dynamicClass({
    constructor: function (obj, props, classGenerator) {
      this.classGenerator = classGenerator;
      this.obj = obj;
      this.defines = _.reverseConvert(props, function () {
        return false;
      });
      obj[classGenerator.descBind] = this;
      this.accessorNR = 0;
    },
    isAccessor: function (desc) {
      return desc && (desc.get || desc.set);
    },
    hasAccessor: function () {
      return !!this.accessorNR;
    },
    defineProperty: function (attr, desc) {
      var defines = this.defines,
          obj = this.obj;

      if (!(attr in defines)) {
        if (!(attr in obj)) {
          obj[attr] = undefined;
        } else if (_.isFunc(obj[attr])) {
          logger$1.warn('defineProperty not support function [' + attr + ']');
        }
        this.classGenerator.create(this.obj, this);
      }

      if (!this.isAccessor(desc)) {
        if (defines[attr]) {
          defines[attr] = false;
          this.accessorNR--;
        }
        obj[attr] = desc.value;
      } else {
        defines[attr] = desc;
        this.accessorNR++;
        if (desc.get) obj[attr] = desc.get();
      }
      return this.proxy;
    },
    getPropertyDefine: function (attr) {
      return this.defines[attr] || undefined;
    },
    get: function (attr) {
      var define = this.defines[attr];

      return define && define.get ? define.get.call(this.proxy) : this.obj[attr];
    },
    set: function (attr, value) {
      var define = this.defines[attr];

      if (define && define.set) {
        define.set.call(this.proxy, value);
      } else {
        this.obj[attr] = value;
      }
    }
  });

  configuration.register('bindVBProxy', '__observi_vbproxy__', 'init');
  configuration.register('VBProxyConst', '__observi_vbproxy_const__', 'init');
  configuration.register('defaultProps', [], 'init');

  registerWatcher('VBScriptProxy', 40, function (config) {
    return VBClassFactory.isSupport();
  }, function (config) {
    var factory = new VBClassFactory([config.bindWatcher, config.bindObservi, config.bindProxy, _.LinkedList.LIST_KEY].concat(config.defaultProps || []), configuration.get('VBProxyConst'), configuration.get('bindVBProxy'), proxy$1.change);

    var cls = _.dynamicClass({
      extend: ArrayWatcher,
      watch: function (attr) {
        var _this = this;

        if (this['super']([attr]) || this.isArray) return;
        var obj = this.obj,
            desc = this.desc || (this.desc = factory.descriptor(obj) || factory.create(obj));
        this.proxy = desc.defineProperty(attr, {
          set: function (val) {
            var oldVal = obj[attr];
            obj[attr] = val;
            _this.set(attr, val, oldVal);
          }
        });
      }
    });
    proxy$1.enable({
      obj: function (obj) {
        return obj && factory.obj(obj);
      },
      eq: function (o1, o2) {
        return o1 === o2 || proxy$1.obj(o1) === proxy$1.obj(o2);
      },
      proxy: function (obj) {
        return obj && (factory.proxy(obj) || obj);
      }
    });
    return cls;
  });

  configuration.register('bindObservis', '__observi__', 'init');

var   cfg$1 = configuration.get();
var   hasOwn$1 = Object.prototype.hasOwnProperty;
  var PATH_JOIN = '###';
  function getOrCreateObservi(obj, expr) {
    var bindObservis = cfg$1.bindObservis,
        path = _.parseExpr(expr),
        observis = void 0,
        key = void 0;
    if (!path.length) throw new Error('Invalid Observi Expression: ' + expr);
    obj = proxy$1.obj(obj);
    observis = hasOwn$1.call(obj, bindObservis) ? obj[bindObservis] : obj[bindObservis] = {};
    key = path.join(PATH_JOIN);
    return observis[key] || (observis[key] = new Observi(obj, expr, path));
  }

  function getObservi(obj, expr) {
    var bindObservis = cfg$1.bindObservis,
        path = _.parseExpr(expr),
        observis = void 0;
    if (!path.length) throw new Error('Invalid Observi Expression: ' + expr);
    observis = hasOwn$1.call(obj, bindObservis) ? obj[bindObservis] : undefined;
    return observis && observis[path.join(PATH_JOIN)];
  }

  var observi = {
    Watcher: Watcher,
    registerWatcher: registerWatcher,
    logger: logger$1,
    proxy: proxy$1,
    configuration: configuration,
    observe: function (obj, expr, cb) {
      if (!_.isFunc(cb)) throw new Error('Invalid Observi Callback');
      var observi = getOrCreateObservi(proxy$1.obj(obj), expr);
      observi.on(cb);
      return observi.watcher.proxy;
    },
    unobserve: function (obj, expr, cb) {
      if (!_.isFunc(cb)) throw new Error('Invalid Observi Callback');
      var observi = getObservi(proxy$1.obj(obj), expr);
      if (observi) {
        observi.un(cb);
        return observi.watcher.proxy;
      }
      return obj;
    },
    isObserved: function (obj, expr, cb) {
      var observi = getObservi(proxy$1.obj(obj), expr);
      return observi && observi.isListened(cb);
    },
    eq: function (o1, o2) {
      return proxy$1.eq(o1, o2);
    },
    obj: function (o) {
      return proxy$1.obj(o);
    },
    $each: function (obj, callback, scope, own) {
      return hookArrayFunc(_.each, obj, callback, scope, own);
    },
    $map: function (obj, callback, scope, own) {
      return hookArrayFunc(_.map, obj, callback, scope, own);
    },
    $filter: function (obj, callback, scope, own) {
      return hookArrayFunc(_.filter, obj, callback, scope, own);
    },
    $aggregate: function (obj, callback, defVal, scope, own) {
      return _.aggregate(obj, callback && proxy$1.isEnable() ? function (r, v, k, s, o) {
        return callback.call(this, r, proxy$1.proxy(v), k, s, o);
      } : callback, defVal, scope, own);
    },
    $keys: function (obj, filter, scope, own) {
      return _.keys(obj, filter && proxy$1.isEnable() ? function (v, k, s, o) {
        return filter.call(this, proxy$1.proxy(v), k, s, o);
      } : filter, scope, own);
    },
    $values: function (obj, filter, scope, own) {
      return _.values(obj, filter && proxy$1.isEnable() ? function (v, k, s, o) {
        return filter.call(this, proxy$1.proxy(v), k, s, o);
      } : filter, scope, own);
    }
  };

  function hookArrayFunc(func, obj, callback, scope, own) {
    return func(obj, proxy$1.isEnable() ? callback && function (v, k, s, o) {
      return callback.call(this, proxy$1.proxy(v), k, s, o);
    } : callback, scope, own);
  }

  var observi$1 = _.assignIf(_.create(observi), {
    observi: observi,
    ilos: _
  }, _);

  var configuration$1 = new _.Configuration({}, ['init', 'runtime']);

  var Binding = _.dynamicClass({
    statics: {
      commentCfg: 'generateComments'
    },
    constructor: function (cfg) {
      this._scope = observi$1.obj(cfg.scope);
      this.el = cfg.el;
      this.tpl = cfg.tpl;
    },
    expressionScopeProvider: function (expr, realScope) {
      return realScope ? '$binding.exprScope(\'' + expr + '\')' : '$scope';
    },
    scope: function () {
      var scope = this._scope;
      return observi$1.proxy(scope) || scope;
    },
    realScope: function () {
      return this._scope;
    },
    propScope: function (prop) {
      var scope = this.realScope(),
          parent = void 0;

      while ((parent = scope.$parent) && !_.hasOwnProp(scope, prop)) {
        scope = parent;
      }
      return observi$1.proxy(scope) || scope;
    },
    exprScope: function (expr) {
      return this.propScope(_.parseExpr(expr)[0]);
    },
    observe: function (expr, callback) {
      observi$1.observe(this.exprScope(expr), expr, callback);
    },
    unobserve: function (expr, callback) {
      observi$1.unobserve(this.exprScope(expr), expr, callback);
    },
    get: function (expr) {
      return _.get(this.realScope(), expr);
    },
    has: function (expr) {
      return _.has(this.realScope(), expr);
    },
    set: function (expr, value) {
      _.set(this.scope(), expr, value);
    },
    bind: function () {
      throw new Error('abstract method');
    },
    unbind: function () {
      throw new Error('abstract method');
    },
    destroy: function () {}
  });
  configuration$1.register(Binding.commentCfg, true, 'init');

  var logger$2 = new _.Logger('argilo', 'debug');

  var translations = {};
  var translate = {
    register: function (name, desc) {
      if (translations[name]) throw Error('Translate[' + name + '] is existing');
      if (_.isFunc(desc)) desc = {
        transform: desc
      };
      desc.type = desc.type || 'normal';
      translations[name] = desc;
      logger$2.debug('register Translate[' + desc.type + ':' + name + ']');
    },
    get: function (name) {
      return translations[name];
    },
    transform: function (name, scope, data, args, restore) {
      var f = translations[name],
          type = f && f.type,
          fn = f && (restore ? f.restore : f.transform);

      if (!fn) {
        logger$2.warn('Translate[' + name + '].' + (restore ? 'Restore' : 'Transform') + ' is undefined');
      } else {
        data = fn.apply(scope, [data].concat(args));
      }
      return {
        stop: type == 'event' && data === false,
        data: data,
        replace: type !== 'event'
      };
    },
    restore: function (name, data, args) {
      return this.apply(name, data, args, false);
    }
  };

  var keyCodes = {
    esc: 27,
    tab: 9,
    enter: 13,
    space: 32,
    'delete': [8, 46],
    up: 38,
    left: 37,
    right: 39,
    down: 40
  };

  var eventTranslates = {
    key: function (e) {
      var which = e.which,
          k = void 0;

      for (var i = 1, l = arguments.length; i < l; i++) {
        k = arguments[i];
        if (which == (keyCodes[k] || k)) return true;
      }
      return false;
    },
    stop: function (e) {
      e.stopPropagation();
    },
    prevent: function (e) {
      e.preventDefault();
    },
    self: function (e) {
      return e.target === e.currentTarget;
    }
  };

  _.each(eventTranslates, function (fn, name) {
    translate.register(name, {
      type: 'event',
      transform: fn
    });
  });

  var nomalTranslates = {
    json: {
      transform: function (value, indent) {
        return typeof value === 'string' ? value : JSON.stringify(value, null, Number(indent) || 2);
      },
      restore: function (value) {
        try {
          return JSON.parse(value);
        } catch (e) {
          return value;
        }
      }
    },
    trim: _.trim,
    capitalize: function (value) {
      if (_.isString(value)) return value.charAt(0).toUpperCase() + value.slice(1);
      return value;
    },
    uppercase: function (value) {
      return _.isString(value) ? value.toUpperCase() : value;
    },
    lowercase: function (value) {
      return _.isString(value) ? value.toLowerCase() : value;
    },

    plural: {
      transform: function (value) {
        return _.isString(value) ? _.plural(value) : value;
      },
      restore: function (value) {
        return _.isString(value) ? _.singular(value) : value;
      }
    },
    singular: {
      transform: function (value, plural) {
        return _.isString(value) ? _.singular(value) : value;
      },
      restore: function (value) {
        return _.isString(value) ? _.plural(value) : value;
      }
    },
    unit: {
      transform: function (value, unit, format, plural) {
        if (plural !== false) {
          value = parseInt(value);
          if (value != 1 && value != 0 && value != NaN) unit = _.plural(unit);
        }
        return format ? _.format(format, value, unit) : value + unit;
      }
    },
    format: {
      transform: function (value, format) {
        var args = [format, value].concat(Array.prototype.slice.call(arguments, 2));
        return _.format.apply(_, args);
      }
    }
  };
  _.each(nomalTranslates, function (f, name) {
    translate.register(name, f);
  });

  var keywords = _.reverseConvert('argilo,window,document,Math,Date,this,true,false,null,undefined,Infinity,NaN,isNaN,isFinite,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,parseInt,parseFloat'.split(','), function () {
    return true;
  });
  var wsReg = /\s/g;
  var newlineReg = /\n/g;
  var transformReg = /[\{,]\s*[\w\$_]+\s*:|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\"']|\\.)*`|`(?:[^`\\]|\\.)*`)|new |typeof |void |(\|\|)/g;
  var restoreReg = /"(\d+)"/g;
  var identityReg = /[^\w$\.](?:(?:this\.)?[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)/g;
  var propReg = /^[A-Za-z_$][\w$]*/;
  var simplePathReg = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\]|\[\d+\]|\[[A-Za-z_$][\w$]*\])*$/;
  var literalValueReg = /^(?:true|false|null|undefined|Infinity|NaN)$/;
var   exprReg$1 = /\s*\|\s*(?:\|\s*)*/;
  var applyFuncReg = /\.call|\.apply$/;
  var thisReg = /^this\./;
  var userkeywords = {};

  configuration$1.register('keywords', [], 'init', function (val) {
    if (_.isString(val)) val = val.replace(/\\s+/g, '').split(',');
    if (!_.isArray(val)) throw new Error('Invalid keywords: ' + val);
    userkeywords = _.reverseConvert(val, function () {
      return true;
    });
    return true;
  });

  var saved = [];

  function transform(str, isString) {
    var i = saved.length;
    saved[i] = isString ? str.replace(newlineReg, '\\n') : str;
    return '"' + i + '"';
  }

  function restore(str, i) {
    return saved[i];
  }

  var identities = void 0;
  var params = void 0;
  var scopeProvider = void 0;
  function defaultScopeProvider() {
    return 'this';
  }

  function initStatus(_params, _scopeProvider) {
    identities = {};
    scopeProvider = _scopeProvider || defaultScopeProvider;
    params = _params.__MAP__;
    if (!params) params = _params.__MAP__ = _.reverseConvert(_params, function () {
      return true;
    });
  }

  function cleanStates() {
    identities = undefined;
    params = undefined;
    scopeProvider = undefined;
    saved.length = 0;
  }

  function rewrite(raw, idx, str) {
    var prefix = raw.charAt(0),
        userExpr = raw.slice(1),
        expr = userExpr.replace(thisReg, ''),
        prop = expr.match(propReg)[0];

    if (expr == userExpr && (keywords[prop] || params[prop] || userkeywords[prop])) return raw;

    var nextIdx = idx + raw.length,
        nextChar = str.charAt(nextIdx++),
        realScope = false,
        ident = true;

    switch (nextChar) {
      case '(':
        realScope = !applyFuncReg.test(expr);
        ident = false;
        break;
      case '=':
        realScope = str.charAt(nextIdx) != '=';
        break;
      case '/':
      case '*':
      case '+':
      case '-':
      case '%':
      case '&':
      case '&':
        realScope = str.charAt(nextIdx) == '=';
        break;
      case '>':
      case '<':
        realScope = str.charAt(nextIdx) == nextChar && str.charAt(nextIdx + 1) == '=';
        break;
    }
    if (!realScope && ident) identities[expr] = true;
    return '' + prefix + scopeProvider(expr, realScope) + '.' + expr;
  }

  function makeExecutor(body, params) {
    params = params.slice();
    params.push('return ' + body + ';');
    try {
      return Function.apply(Function, params);
    } catch (e) {
      throw Error('Invalid expression. Generated function body: ' + body);
    }
  }

  function complileExpr(body) {
    return (' ' + body).replace(identityReg, rewrite).replace(restoreReg, restore);
  }

  function compileFilter(exprs, params) {
    return _.map(exprs, function (expr) {
      var args = expr.replace(/,?\s+/g, ',').split(',');
      return {
        name: args.shift().replace(restoreReg, restore),
        argExecutors: _.map(args, function (expr) {
          return makeExecutor(complileExpr(expr), params);
        })
      };
    });
  }

  function isSimplePath(expr) {
    return simplePathReg.test(expr) && !literalValueReg.test(expr) && expr.slice(0, 5) !== 'Math.';
  }

  var Expression = _.dynamicClass({
    constructor: function (fullExpr, params) {
      var exprs = fullExpr.replace(transformReg, transform).split(exprReg$1),
          expr = exprs.shift().replace(wsReg, ''),
          filterExprs = exprs;

      this.expr = expr.replace(restoreReg, restore);
      this.filterExprs = _.map(function (expr) {
        return expr.replace(restoreReg, restore);
      });
      this.fullExpr = fullExpr;
      this.params = params;
      this.executor = makeExecutor(complileExpr(expr), params);
      this.filters = compileFilter(filterExprs, params);
      this.identities = _.keys(identities);
      this.simplePath = isSimplePath(this.expr);
    },
    executeFilter: function (scope, params, data, transform) {
      _.each(this.filters, function (filter) {
        if (transform === false && !translate.get(filter.name)) return;
        var args = _.map(filter.argExecutors, function (executor) {
          return executor.apply(scope, params);
        }),
            rs = void 0;
        if (transform !== false) {
          rs = translate.transform(filter.name, scope, data, args);
        } else {
          rs = translate.restore(filter.name, scope, data, args);
        }
        if (rs.replace || rs.stop) data = rs.data;
        return !rs.stop;
      });
      return data;
    },
    restore: function (scope, params, data) {
      return this.executeFilter(scope, params, data, false);
    },
    execute: function (scope, params) {
      return this.executor.apply(scope, params);
    },
    executeAll: function (scope, params) {
      return this.executeFilter(scope, params, this.executor.apply(scope, params), true);
    },
    isSimple: function () {
      return this.simplePath;
    }
  });

  var cache = {};

  function expression(expr, params, scopeProvider) {
    var rs = cache[expr];
    if (!rs) {
      initStatus(params, scopeProvider);
      cache[expr] = rs = new Expression(expr, params);
      cleanStates();
    }
    return rs;
  }

  expression.cache = cache;

  var textContent = typeof document.createElement('div').textContent == 'string' ? 'textContent' : 'innerText';

  function firstEl(el) {
    return _.isArrayLike(el) ? el[0] : el;
  }

  function lastEl(el) {
    return _.isArrayLike(el) ? el[el.length - 1] : el;
  }

  function apply(coll, callback) {
    _.isArrayLike(coll) ? _.each(coll, callback) : callback(coll);
  }

  var dom = {
    W3C: !!window.dispatchEvent,
    inDoc: function (el, root) {
      root = root || document.documentElement;
      if (root.contains) return root.contains(el);
      try {
        while (el = el.parentNode) {
          if (el === root) return true;
        }
      } catch (e) {}
      return false;
    },
    query: function (selectors, all) {
      if (_.isString(selectors)) return all ? document.querySelectorAll(selectors) : document.querySelector(selectors);
      return selectors;
    },
    cloneNode: function (el, deep) {
      function clone(el) {
        return el.cloneNode(deep !== false);
      }
      return _.isArrayLike(el) ? _.map(el, clone) : clone(el);
    },
    parent: function (el) {
      return firstEl(el).parentNode;
    },
    next: function (el, all) {
      el = lastEl(el);
      return all ? el.nextSibling : el.nextElementSibling;
    },
    prev: function (el, all) {
      el = firstEl(el);
      return all ? el.previousSibling : el.previousElementSibling;
    },
    children: function (el, all) {
      el = firstEl(el);
      return all ? el.childNodes : el.children;
    },
    remove: function (el) {
      apply(el, function (el) {
        var parent = el.parentNode;
        if (parent) parent.removeChild(el);
      });
      return dom;
    },
    before: function (el, target) {
      target = firstEl(target);
      var parent = target.parentNode;
      apply(el, function (el) {
        parent.insertBefore(el, target);
      });
      return dom;
    },
    after: function (el, target) {
      target = lastEl(target);
      var parent = target.parentNode;

      apply(el, parent.lastChild === target ? function (el) {
        parent.insertBefore(el, target);
      } : function () {
        var next = target.nextSibling;
        return function (el) {
          parent.insertBefore(el, next);
        };
      }());
      return dom;
    },
    append: function (target, el) {
      target = firstEl(target);
      apply(el, function (el) {
        target.appendChild(el);
      });
      return dom;
    },
    prepend: function (target, el) {
      target.firstChild ? dom.before(el, el.firstChild) : dom.append(target, el);
      return dom;
    },
    replace: function (source, target) {
      var parent = source.parentNode;
      parent.replaceChild(target, source);
    },
    html: function (el, html) {
      return arguments.length > 1 ? el.innerHTML = html : el.innerHTML;
    },
    outerHtml: function (el) {
      if (el.outerHTML) return el.outerHTML;

      var container = document.createElement('div');
      container.appendChild(el.cloneNode(true));
      return container.innerHTML;
    },
    text: function (el, text) {
      if (el.nodeType == 3) return arguments.length > 1 ? el.data = text : el.data;
      return arguments.length > 1 ? el[textContent] = text : el[textContent];
    },
    focus: function (el) {
      el.focus();
      return dom;
    }
  };

  //====================== Query =============================
  if (!document.querySelectorAll) {
    document.querySelectorAll = function querySelectorAll(selector) {
      var doc = document,
          head = doc.documentElement.firstChild,
          styleTag = doc.createElement('STYLE');

      head.appendChild(styleTag);
      doc.__qsaels = [];
      if (styleTag.styleSheet) {
        // for IE
        styleTag.styleSheet.cssText = selector + '{x:expression(document.__qsaels.push(this))}';
      } else {
        // others
        var textnode = document.createTextNode(selector + '{x:expression(document.__qsaels.push(this))}');
        styleTag.appendChild(textnode);
      }
      window.scrollBy(0, 0);
      return doc.__qsaels;
    };
  }
  if (!document.querySelector) {
    document.querySelector = function querySelector(selectors) {
      var elements = document.querySelectorAll(selectors);
      return elements.length ? elements[0] : null;
    };
  }

  var rfocusable = /^(?:input|select|textarea|button|object)$/i;
  var rclickable = /^(?:a|area)$/i;
  _.assign(dom, {
    prop: function (el, name, value) {
      name = dom.propFix[name] || name;
      var hook = dom.propHooks[name];

      if (arguments.length == 2) return hook && hook.get ? hook.get(el, name) : el[name];
      hook && hook.set ? hook.set(el, name, value) : el[name] = value;
      return dom;
    },
    attr: function (el, name, val) {
      if (arguments.length == 2) return el.getAttribute(name);
      el.setAttribute(name, val);
      return dom;
    },
    removeAttr: function (el, name) {
      el.removeAttribute(name);
      return dom;
    },
    checked: function (el, check) {
      return _prop(el, 'checked', arguments.length > 1, check);
    },
    'class': function (el, cls) {
      return _prop(el, 'class', arguments.length > 1, cls);
    },
    addClass: function (el, cls) {
      if (el.classList) {
        el.classList.add(cls);
      } else {
        var cur = ' ' + dom.prop(el, 'class') + ' ';
        if (cur.indexOf(' ' + cls + ' ') === -1) dom['class'](el, _.trim(cur + cls));
      }
      return dom;
    },
    removeClass: function (el, cls) {
      el.classList ? el.classList.remove(cls) : dom['class'](el, _.trim((' ' + dom.prop(el, 'class') + ' ').replace(new RegExp(' ' + cls + ' ', 'g'), '')));
      return dom;
    },
    style: function (el, style) {
      return _prop(el, 'style', arguments.length > 1, style);
    },

    propHooks: {
      tabIndex: {
        get: function (elem) {
          var attributeNode = elem.getAttributeNode('tabindex');

          return attributeNode && attributeNode.specified ? parseInt(attributeNode.value, 10) : rfocusable.test(elem.nodeName) || rclickable.test(elem.nodeName) && elem.href ? 0 : undefined;
        }
      }
    },
    propFix: {
      tabindex: 'tabIndex',
      readonly: 'readOnly',
      'for': 'htmlFor',
      'class': 'className',
      maxlength: 'maxLength',
      cellspacing: 'cellSpacing',
      cellpadding: 'cellPadding',
      rowspan: 'rowSpan',
      colspan: 'colSpan',
      usemap: 'useMap',
      frameborder: 'frameBorder',
      contenteditable: 'contentEditable'
    }
  });

  function _prop(el, name, set, val) {
    if (!set) return dom.prop(el, name);
    dom.prop(el, name, val);
    return dom;
  }

  _.assign(dom, {
    css: function (el, name, value) {
      var prop = /[_-]/.test(name) ? camelize(name) : name,
          hook = void 0;

      name = cssName(prop) || prop;
      hook = cssHooks[prop] || cssDefaultHook;
      if (arguments.length == 2) {
        var convert = value,
            num = void 0;

        if (name === 'background') name = 'backgroundColor';
        value = hook.get(el, name);
        return convert !== false && isFinite(num = parseFloat(value)) ? num : value;
      } else if (!value && value !== 0) {
        el.style[name] = '';
      } else {
        if (isFinite(value) && !cssNumber[prop]) value += 'px';
        hook.set(el, name, value);
      }
      return dom;
    },

    position: function (el) {
      var _offsetParent = void 0,
          _offset = void 0,
          parentOffset = {
        top: 0,
        left: 0
      };
      if (dom.css(el, 'position') === 'fixed') {
        _offset = el.getBoundingClientRect();
      } else {
        _offsetParent = offsetParent(el);
        _offset = offset(el);
        if (_offsetParent.tagName !== 'HTML') parentOffset = offset(_offsetParent);
        parentOffset.top += dom.css(_offsetParent, 'borderTopWidth', true);
        parentOffset.left += dom.css(_offsetParent, 'borderLeftWidth', true);

        parentOffset.top -= dom.scrollTop(_offsetParent);
        parentOffset.left -= dom.scrollLeft(_offsetParent);
      }
      return {
        top: _offset.top - parentOffset.top - dom.css(el, 'marginTop', true),
        left: _offset.left - parentOffset.left - dom.css(el, 'marginLeft', true)
      };
    },
    scrollTop: function (el, val) {
      var win = getWindow(el);
      if (arguments.length == 1) {
        return (win ? 'scrollTop' in win ? win.scrollTop : root.pageYOffset : el.pageYOffset) || 0;
      } else if (win) {
        win.scrollTo(dom.scrollLeft(el), val);
      } else {
        el.pageYOffset = val;
      }
      return dom;
    },
    scrollLeft: function (el, val) {
      var win = getWindow(el);
      if (arguments.length == 1) {
        return (win ? 'scrollLeft' in win ? win.scrollLeft : root.pageXOffset : el.pageXOffset) || 0;
      } else if (win) {
        win.scrollTo(val, dom.scrollTop(el));
      } else {
        el.pageXOffset = val;
      }
      return dom;
    },
    scroll: function (el, left, top) {
      var win = getWindow(el);
      if (arguments.length == 1) {
        return {
          left: dom.scrollLeft(el),
          top: dom.scrollTop(el)
        };
      } else if (win) {
        win.scrollTo(left, top);
      } else {
        el.pageXOffset = left;
        el.pageYOffset = top;
      }
      return dom;
    }
  });

  var cssFix = dom.cssFix = {
    'float': dom.W3C ? 'cssFloat' : 'styleFloat'
  };
  var cssHooks = dom.cssHooks = {};
  var cssDefaultHook = {};
  var prefixes = ['', '-webkit-', '-o-', '-moz-', '-ms-'];
  var cssNumber = {
    animationIterationCount: true,
    columnCount: true,
    order: true,
    flex: true,
    flexGrow: true,
    flexShrink: true,
    fillOpacity: true,
    fontWeight: true,
    lineHeight: true,
    opacity: true,
    orphans: true,
    widows: true,
    zIndex: true,
    zoom: true
  };
  var root = document.documentElement;
var   css$1 = dom.css;
  function camelize(target) {
    if (!target || target.indexOf('-') < 0 && target.indexOf('_') < 0) {
      return target;
    }
    return target.replace(/[-_][^-_]/g, function (match) {
      return match.charAt(1).toUpperCase();
    });
  }

  function cssName(name, host, camelCase) {
    if (cssFix[name]) return cssFix[name];
    host = host || root.style;
    for (var i = 0, n = prefixes.length; i < n; i++) {
      camelCase = camelize(prefixes[i] + name);
      if (camelCase in host) {
        return cssFix[name] = camelCase;
      }
    }
    return null;
  }
  cssDefaultHook.set = function cssDefaultSet(el, name, value) {
    try {
      el.style[name] = value;
    } catch (e) {}
  };

  var cssDefaultGet = void 0;
  if (window.getComputedStyle) {
    cssDefaultGet = cssDefaultHook.get = function cssDefaultGet(el, name) {
      var val = void 0,
          styles = getComputedStyle(el, null);

      if (styles) {
        val = name === 'filter' ? styles.getPropertyValue(name) : styles[name];
        if (val === '') val = el.style[name];
      }
      return val;
    };
    cssHooks.opacity = {
      get: function (el, name) {
        var val = cssDefaultGet(el, name);
        return val === '' ? '1' : ret;
      }
    };
  } else {
    (function () {
      var rnumnonpx = /^-?(?:\d*\.)?\d+(?!px)[^\d\s]+$/i,
          rposition = /^(top|right|bottom|left)$/,
          ralpha = /alpha\([^)]*\)/i,
          ie8 = !!window.XDomainRequest,
          salpha = 'DXImageTransform.Microsoft.Alpha',
          border = {
        thin: ie8 ? '1px' : '2px',
        medium: ie8 ? '3px' : '4px',
        thick: ie8 ? '5px' : '6px'
      };

      cssDefaultGet = cssDefaultHook.get = function cssDefaultGet(el, name) {
        var currentStyle = el.currentStyle,
            val = currentStyle[name];

        if (rnumnonpx.test(val) && !rposition.test(val)) {
          var style = el.style,
              left = style.left,
              rsLeft = el.runtimeStyle.left;

          el.runtimeStyle.left = currentStyle.left;
          style.left = name === 'fontSize' ? '1em' : val || 0;
          val = style.pixelLeft + 'px';
          style.left = left;
          el.runtimeStyle.left = rsLeft;
        }
        if (val === 'medium') {
          name = name.replace('Width', 'Style');
          if (currentStyle[name] === 'none') val = '0px';
        }
        return val === '' ? 'auto' : border[val] || val;
      };
      cssHooks.opacity = {
        get: function (el, name) {
          var alpha = el.filters.alpha || el.filters[salpha],
              op = alpha && alpha.enabled ? alpha.opacity : 100;

          return op / 100 + '';
        },
        set: function (el, name, value) {
          var style = el.style,
              opacity = isFinite(value) && value <= 1 ? 'alpha(opacity=' + value * 100 + ')' : '',
              filter = style.filter || '';

          style.zoom = 1;
          style.filter = (ralpha.test(filter) ? filter.replace(ralpha, opacity) : filter + ' ' + opacity).trim();
          if (!style.filter) style.removeAttribute('filter');
        }
      };
    })();
  }

  _.each(['top', 'left'], function (name) {
    cssHooks[name] = {
      get: function (el, name) {
        var val = cssDefaultGet(el, name);
        return (/px$/.test(val) ? val : dom.position(el)[name] + 'px'
        );
      }
    };
  });

  _.each(['Width', 'Height'], function (name) {
    var method = name.toLowerCase(),
        clientProp = 'client' + name,
        scrollProp = 'scroll' + name,
        offsetProp = 'offset' + name,
        which = name == 'Width' ? ['Left', 'Right'] : ['Top', 'Bottom'];

    function get(el, boxSizing) {
      var val = void 0;

      val = el[offsetProp]; // border-box 0
      if (boxSizing === 2) // margin-box 2
        return val + css$1(el, 'margin' + which[0], true) + css$1(el, 'margin' + which[1], true);
      if (boxSizing < 0) // padding-box  -2
        val = val - css$1(el, 'border' + which[0] + 'Width', true) - css$1(el, 'border' + which[1] + 'Width', true);
      if (boxSizing === -4) // content-box -4
        val = val - css$1(el, 'padding' + which[0], true) - css$1(el, 'padding' + which[1], true);
      return val;
    }

    dom[method] = function (el) {
      return get(el, -4);
    };

    dom['inner' + name] = function (el) {
      return get(el, -2);
    };
    dom['outer' + name] = function (el, includeMargin) {
      return get(el, includeMargin === true ? 2 : 0);
    };
  });

  function offsetParent(el) {
    var offsetParent = el.offsetParent;
    while (offsetParent && css$1(offsetParent, "position") === "static") {
      offsetParent = offsetParent.offsetParent;
    }
    return offsetParent || root;
  }

  function offset(el) {
    //取得距离页面左右角的坐标
    var box = {
      left: 0,
      top: 0
    };

    if (!el || !el.tagName || !el.ownerDocument) return box;

    var doc = el.ownerDocument,
        body = doc.body,
        root = doc.documentElement,
        win = doc.defaultView || doc.parentWindow;

    if (!dom.inDoc(el, root)) return box;

    if (el.getBoundingClientRect) box = el.getBoundingClientRect();

    var clientTop = root.clientTop || body.clientTop,
        clientLeft = root.clientLeft || body.clientLeft,
        scrollTop = Math.max(win.pageYOffset || 0, root.scrollTop, body.scrollTop),
        scrollLeft = Math.max(win.pageXOffset || 0, root.scrollLeft, body.scrollLeft);
    return {
      top: box.top + scrollTop - clientTop,
      left: box.left + scrollLeft - clientLeft
    };
  }

  function getWindow(node) {
    return node.window && node.document ? node : node.nodeType === 9 ? node.defaultView || node.parentWindow : false;
  }

  function stringValue(val) {
    if (_.isNil(val) || val === NaN) return '';
    if (!_.isString(val)) return val + '';
    return val;
  }

  _.assign(dom, {
    val: function (el, val) {
      var hook = dom.valHooks[el.type || el.tagName.toLowerCase()];

      if (arguments.length == 1) return hook && hook.get ? hook.get(el) : el.value || '';

      if (hook && hook.set) {
        hook.set(el, val);
      } else {
        el.value = stringValue(val);
      }
      return dom;
    },

    valHooks: {
      option: {
        get: function (el) {
          var val = el.attributes.value;

          return !val || val.specified ? el.value : el.text;
        }
      },

      select: {
        get: function (el) {
          var signle = el.type == 'select-one',
              index = el.selectedIndex;

          if (index < 0) return signle ? undefined : [];

          var options = el.options,
              option = void 0,
              values = signle ? undefined : [];

          for (var i = 0, l = options.length; i < l; i++) {
            option = options[i];
            if (option.selected || i == index) {
              if (signle) return dom.val(option);
              values.push(dom.val(option));
            }
          }
          return values;
        },
        set: function (el, value) {
          var signle = el.type == 'select-one',
              options = el.options,
              option = void 0,
              i = void 0,
              l = void 0,
              vl = void 0,
              val = void 0;

          el.selectedIndex = -1;

          if (!_.isArray(value)) value = _.isNil(value) ? [] : [value];

          if (vl = value.length) {
            if (signle) vl = value.length = 1;

            var map = _.reverseConvert(value, function () {
              return false;
            }),
                nr = 0;

            for (i = 0, l = options.length; i < l; i++) {
              option = options[i];
              val = dom.val(option);
              if (_.isBoolean(map[val])) {
                map[val] = option.selected = true;
                if (++nr === vl) break;
              }
              value = _.keys(map, function (v) {
                return v === true;
              });
            }
          }
          return signle ? value[0] : value;
        }
      }
    }
  });

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var root$1 = document.documentElement;

  var dom$1 = _.assign(dom, {
    hasListen: function (el, type, cb) {
      return hasListen(el, type, cb);
    },
    on: function (el, type, cb, once) {
      if (addListen(el, type, cb, once === true)) canBubbleUp[type] ? delegateEvent(type, cb) : bandEvent(el, type, cb);
      return dom;
    },
    once: function (el, type, cb) {
      return dom.on(el, type, cb, true);
    },
    off: function (el, type, cb) {
      if (removeListen(el, type, cb)) canBubbleUp[type] ? undelegateEvent(type, cb) : unbandEvent(el, type, cb);
      return dom;
    },
    dispatchEvent: function (el, type, opts) {
      var hackEvent = void 0;
      if (document.createEvent) {
        hackEvent = document.createEvent('Events');
        hackEvent.initEvent(type, true, true, opts);
        _.assign(hackEvent, opts);
        el.dispatchEvent(hackEvent);
      } else if (dom.inDoc(el)) {
        //IE6-8触发事件必须保证在DOM树中,否则报'SCRIPT16389: 未指明的错误'
        hackEvent = document.createEventObject();
        _.assign(hackEvent, opts);
        el.fireEvent('on' + type, hackEvent);
      }
      return hackEvent;
    }
  });

  var mouseEventReg = /^(?:mouse|contextmenu|drag)|click/;
  var keyEventReg = /^key/;
  var eventProps = ['altKey', 'bubbles', 'cancelable', 'ctrlKey', 'currentTarget', 'propertyName', 'eventPhase', 'metaKey', 'relatedTarget', 'shiftKey', 'target', 'view', 'which'];
  var eventFixHooks = {};
  var keyEventFixHook = {
    props: ['char', 'charCode', 'key', 'keyCode'],
    fix: function (event, original) {
      if (event.which == null) event.which = original.charCode != null ? original.charCode : original.keyCode;
    }
  };
  var mouseEventFixHook = {
    props: ['button', 'buttons', 'clientX', 'clientY', 'offsetX', 'offsetY', 'pageX', 'pageY', 'screenX', 'screenY', 'toElement'],
    fix: function (event, original) {
      var eventDoc,
          doc,
          body,
          button = original.button;

      if (event.pageX == null && original.clientX != null) {
        eventDoc = event.target.ownerDocument || document;
        doc = eventDoc.documentElement;
        body = eventDoc.body;
        event.pageX = original.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
        event.pageY = original.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);
      }
      if (!event.which && button !== undefined) event.which = button & 1 ? 1 : button & 2 ? 3 : button & 4 ? 2 : 0;
    }
  };
  var Event = function () {
    function Event(event) {
      classCallCheck(this, Event);

      var type = event.type,
          fixHook = eventFixHooks[type],
          i = void 0,
          prop = void 0;

      this.originalEvent = event;
      this.type = event.type;
      this.returnValue = !(event.defaultPrevented || event.returnValue === false || event.getPreventDefault && event.getPreventDefault());
      this.timeStamp = event && event.timeStamp || new Date() + 0;

      i = eventProps.length;
      while (i--) {
        prop = eventProps[i];
        this[prop] = event[prop];
      }

      if (!fixHook) eventFixHooks[type] = fixHook = mouseEventReg.test(type) ? mouseEventFixHook : keyEventReg.test(type) ? keyEventFixHook : {};

      if (fixHook.props) {
        var props = fixHook.props;
        i = props.length;
        while (i--) {
          prop = props[i];
          this[prop] = event[prop];
        }
      }

      if (!this.target) this.target = event.srcElement || document;
      if (this.target.nodeType == 3) this.target = this.target.parentNode;

      if (fixHook.fix) fixHook.fix(this, event);
    }

    Event.prototype.preventDefault = function preventDefault() {
      var e = this.originalEvent;
      this.returnValue = false;
      if (e) {
        e.returnValue = false;
        if (e.preventDefault) e.preventDefault();
      }
    };

    Event.prototype.stopPropagation = function stopPropagation() {
      var e = this.originalEvent;
      this.cancelBubble = true;
      if (e) {
        e.cancelBubble = true;
        if (e.stopPropagation) e.stopPropagation();
      }
    };

    Event.prototype.stopImmediatePropagation = function stopImmediatePropagation() {
      var e = this.originalEvent;
      this.isImmediatePropagationStopped = true;
      if (e.stopImmediatePropagation) e.stopImmediatePropagation();
      this.stopPropagation();
    };

    return Event;
  }();

  var listenKey = '__LISTEN__';

  function addListen(el, type, handler, once) {
    if (!_.isFunc(handler)) throw TypeError('Invalid Event Handler');

    var listens = el[listenKey],
        handlers = void 0,
        ret = false;

    if (!listens) el[listenKey] = listens = {};

    if (!(handlers = listens[type])) {
      listens[type] = handlers = new _.LinkedList();
      ret = true;
    } else if (handlers.contains(handler)) {
      return false;
    }
    handlers.push({
      handler: handler,
      once: once
    });
    return ret;
  }

  function removeListen(el, type, handler) {
    var listens = el[listenKey],
        handlers = listens && listens[type];

    if (handlers && !handlers.empty()) {
      handlers.remove(handler);
      return handlers.empty();
    }
    return false;
  }

  function getListens(el, type) {
    var listens = el[listenKey];

    return listens && listens[type];
  }

  function hasListen(el, type, handler) {
    var listens = el[listenKey],
        handlers = listens && listens[type];

    if (handlers) return handler ? handlers.contains(handler) : !handlers.empty();
    return false;
  }

  var bind = dom.W3C ? function (el, type, fn, capture) {
    el.addEventListener(type, fn, capture);
  } : function (el, type, fn) {
    el.attachEvent('on' + type, fn);
  };
  var unbind = dom.W3C ? function (el, type, fn) {
    el.removeEventListener(type, fn);
  } : function (el, type, fn) {
    el.detachEvent('on' + type, fn);
  };
  var canBubbleUpArray = ['click', 'dblclick', 'keydown', 'keypress', 'keyup', 'mousedown', 'mousemove', 'mouseup', 'mouseover', 'mouseout', 'wheel', 'mousewheel', 'input', 'change', 'beforeinput', 'compositionstart', 'compositionupdate', 'compositionend', 'select', 'cut', 'copy', 'paste', 'beforecut', 'beforecopy', 'beforepaste', 'focusin', 'focusout', 'DOMFocusIn', 'DOMFocusOut', 'DOMActivate', 'dragend', 'datasetchanged'];
  var canBubbleUp = {};
  var focusBlur = {
    focus: true,
    blur: true
  };
  var eventHooks = {};
  var eventHookTypes = {};
  var delegateEvents = {};
  _.each(canBubbleUpArray, function (name) {
    canBubbleUp[name] = true;
  });
  if (!dom.W3C) {
    delete canBubbleUp.change;
    delete canBubbleUp.select;
  }

  function bandEvent(el, type, cb) {
    var hook = eventHooks[type];
    if (!hook || !hook.bind || hook.bind(el, type, cb) !== false) bind(el, hook ? hook.type || type : type, dispatch, !!focusBlur[type]);
  }

  function unbandEvent(el, type, cb) {
    var hook = eventHooks[type];
    if (!hook || !hook.unbind || hook.unbind(el, type, cb) !== false) unbind(el, hook ? hook.type || type : type, dispatch);
  }

  function delegateEvent(type, cb) {
    if (!delegateEvents[type]) {
      bandEvent(root$1, type, cb);
      delegateEvents[type] = 1;
    } else {
      delegateEvents[type]++;
    }
  }

  function undelegateEvent(type, cb) {
    if (delegateEvents[type]) {
      delegateEvents[type]--;
      if (!delegateEvents[type]) unbandEvent(root$1, type, cb);
    }
  }

  var last = new Date();

  function dispatchElement(el, event, isMove) {
    var handlers = getListens(el, event.type);

    if (handlers) {
      var handler = void 0,
          i = void 0,
          l = void 0;

      event.currentTarget = el;
      event.isImmediatePropagationStopped = false;
      handlers.each(function (handler) {
        if (isMove) {
          var now = new Date();
          if (now - last > 16) {
            handler.handler.call(el, event);
            last = now;
          }
        } else {
          handler.handler.call(el, event);
        }

        if (handler.once) dom.off(el, event.type, handler.handler);
        return !event.isImmediatePropagationStopped;
      });
    }
  }

  function dispatchEvent(el, type, event) {
    if (el.disabled !== true || type !== 'click') {
      var isMove = /move|scroll/.test(type);
      if (canBubbleUp[type]) {
        while (el && el.getAttribute && !event.cancelBubble) {
          dispatchElement(el, event, isMove);
          el = el.parentNode;
        }
      } else dispatchElement(el, event, isMove);
    }
  }

  function dispatch(event) {
    event = new Event(event);
    var type = event.type,
        el = event.target;
    if (eventHookTypes[type]) {
      type = eventHookTypes[type];
      var hook = eventHooks[type];
      if (hook && hook.fix && hook.fix(el, event) === false) return;
      event.type = type;
      dispatchEvent(el, type, event);
    } else {
      dispatchEvent(el, type, event);
    }
  }

  //针对firefox, chrome修正mouseenter, mouseleave
  if (!('onmouseenter' in root$1)) {
    _.each({
      mouseenter: 'mouseover',
      mouseleave: 'mouseout'
    }, function (origType, fixType) {
      eventHooks[origType] = {
        type: fixType,
        fix: function (elem, event, fn) {
          var t = event.relatedTarget;
          return !t || t !== elem && !(elem.compareDocumentPosition(t) & 16);
        }
      };
    });
  }
  //针对IE9+, w3c修正animationend
  _.each({
    AnimationEvent: 'animationend',
    WebKitAnimationEvent: 'webkitAnimationEnd'
  }, function (construct, fixType) {
    if (window[construct] && !eventHooks.animationend) {
      eventHooks.animationend = {
        type: fixType
      };
    }
  });

  //针对IE6-8修正input
  if (!('oninput' in document.createElement('input'))) {
    delete canBubbleUp.input;
    eventHooks.input = {
      type: 'propertychange',
      fix: function (elem, event) {
        return event.propertyName == 'value';
      }
    };
    eventHooks.change = {
      bind: function (elem) {
        if (elem.type == 'checkbox' || elem.type == 'radio') {
          if (!elem.$onchange) {
            elem.$onchange = function (event) {
              event.type = 'change';
              dispatchEvent(elem, 'change', event);
            };
            dom.on(elem, 'click', elem.$onchange);
          }
          return false;
        }
      },
      unbind: function (elem) {
        if (elem.type == 'checkbox' || elem.type == 'radio') {
          dom.off(elem, 'click', elem.$onchange);
          return false;
        }
      }
    };
  } else if (navigator.userAgent.indexOf('MSIE 9') !== -1) {
    eventHooks.input = {
      type: 'input',
      fix: function (elem) {
        elem.oldValue = elem.value;
      }
    };
    // http://stackoverflow.com/questions/6382389/oninput-in-ie9-doesnt-fire-when-we-hit-backspace-del-do-cut
    document.addEventListener('selectionchange', function (event) {
      var actEl = document.activeElement;
      if (actEl.tagName === 'TEXTAREA' || actEl.tagName === 'INPUT' && actEl.type === 'text') {
        if (actEl.value == actEl.oldValue) return;
        actEl.oldValue = actEl.value;
        if (hasListen(actEl, 'input')) {
          event = new Event(event);
          event.type = 'input';
          dispatchEvent(actEl, 'input', event);
        }
      }
    });
  }

  if (document.onmousewheel === void 0) {
    (function () {
      /* IE6-11 chrome mousewheel wheelDetla 下 -120 上 120
       firefox DOMMouseScroll detail 下3 上-3
       firefox wheel detlaY 下3 上-3
       IE9-11 wheel deltaY 下40 上-40
       chrome wheel deltaY 下100 上-100 */
      var fixWheelType = document.onwheel ? 'wheel' : 'DOMMouseScroll',
          fixWheelDelta = fixWheelType === 'wheel' ? 'deltaY' : 'detail';
      eventHooks.mousewheel = {
        type: fixWheelType,
        fix: function (elem, event) {
          event.wheelDeltaY = event.wheelDelta = event[fixWheelDelta] > 0 ? -120 : 120;
          event.wheelDeltaX = 0;
          return true;
        }
      };
    })();
  }
  _.each(eventHooks, function (hook, type) {
    eventHookTypes[hook.type || type] = type;
  });

  var readyList = [];
  var isReady = void 0;
var   root$2 = document.documentElement;
  function fireReady(fn) {
    isReady = true;
    while (fn = readyList.shift()) {
      fn();
    }
  }

  if (document.readyState === 'complete') {
    setTimeout(fireReady);
  } else if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', fireReady);
  } else if (document.attachEvent) {
    document.attachEvent('onreadystatechange', function () {
      if (document.readyState === 'complete') fireReady();
    });
    if (root$2.doScroll && window.frameElement === null && window.external) {
      (function () {
        var doScrollCheck = function () {
          try {
            root$2.doScroll('left');
            fireReady();
          } catch (e) {
            setTimeout(doScrollCheck);
          }
        };

        doScrollCheck();
      })();
    }
  }

  dom$1.on(window, 'load', fireReady);

  dom$1.ready = function (fn) {
    !isReady ? readyList.push(fn) : fn();
    return dom$1;
  };

  var expressionArgs = ['$scope', '$el', '$tpl', '$binding'];

  var Text = _.dynamicClass({
    extend: Binding,
    constructor: function (cfg) {
      this['super'](arguments);
      this.expression = expression(cfg.expression, expressionArgs, this.expressionScopeProvider);
      if (configuration$1.get(Binding.commentCfg)) {
        this.comment = document.createComment('Text Binding ' + cfg.expression);
        dom.before(this.comment, this.el);
      }
      this.observeHandler = this.observeHandler.bind(this);
    },
    value: function () {
      var scope = this.scope();
      return this.expression.executeAll(scope, [scope, this.el, this.tpl, this]);
    },
    bind: function () {
      var _this = this;

      _.each(this.expression.identities, function (ident) {
        _this.observe(ident, _this.observeHandler);
      });
      this.update(this.value());
    },
    unbind: function () {
      var _this2 = this;

      _.each(this.expression.identities, function (ident) {
        _this2.unobserve(ident, _this2.observeHandler);
      });
    },
    observeHandler: function (attr, val) {
      if (this.expression.isSimple()) {
        var scope = this.scope();
        this.update(this.expression.executeFilter(scope, [scope, this.el, this.tpl, this], val));
      } else {
        this.update(this.value());
      }
    },
    update: function (val) {
      if (_.isNil(val)) val = '';
      if (val !== dom.text(this.el)) dom.text(this.el, val);
    }
  });

  var directives = {};

  var Directive = _.dynamicClass({
    extend: Binding,
    independent: false,
    block: false,
    priority: 5,
    constructor: function (cfg) {
      this['super'](arguments);
      this.expr = cfg.expression;
      this.attr = cfg.attr;
      this.children = cfg.children;
      this.domParser = cfg.domParser;
      this.group = cfg.group;
      if (configuration$1.get(Binding.commentCfg)) {
        this.comment = document.createComment('Directive[' + this.attr + ']: ' + this.expr);
        dom.before(this.comment, this.el);
      }
    },
    bindChildren: function () {
      if (this.children) _.each(this.children, function (directive) {
        directive.bind();
      });
    },
    bind: function () {
      this.bindChildren();
    },
    unbindChildren: function () {
      if (this.children) _.each(this.children, function (directive) {
        directive.unbind();
      });
    },
    unbind: function () {
      this.unbindChildren();
    },

    statics: {
      getPriority: function (directive) {
        return directive.prototype.priority;
      },
      isBlock: function (directive) {
        return directive.prototype.block;
      },
      isIndependent: function (directive) {
        return directive.prototype.independent;
      },
      getDirective: function (name) {
        return directives[name.toLowerCase()];
      },
      isDirective: function (obj) {
        return _.isExtendOf(obj, Directive);
      },
      register: function (name, option) {
        var directive = void 0;

        name = name.toLowerCase();

        if (_.isObject(option)) {
          option.extend = option.extend || Directive;
          directive = _.dynamicClass(option);
        } else if (_.isFunc(option) && _.isExtendOf(option, Directive)) {
          directive = option;
        } else {
          throw TypeError('Invalid Directive[' + name + '] ' + option);
        }

        if (name in directives) throw new Error('Directive[' + name + '] is existing');

        directives[name] = directive;
        logger$2.debug('register Directive[%s]', name);
        return directive;
      }
    }
  });

  var regHump = /^[a-z]|[_-]+[a-zA-Z]/g;

  function _hump(k) {
    return k.charAt(k.length - 1).toUpperCase();
  }

  function hump(str) {
    return str.replace(regHump, _hump);
  }

  var YieId = _.dynamicClass({
    constructor: function () {
      this.doned = false;
      this.thens = [];
    },
    then: function (callback) {
      if (this.doned) callback();else this.thens.push(callback);
    },
    done: function () {
      if (!this.doned) {
        this.doned = true;
        var thens = this.thens;
        for (var i = 0, l = thens.length; i < l; i++) {
          thens[i]();
        }
      }
    },
    isDone: function () {
      return this.doned;
    }
  });

var util$1 = Object.freeze({
    hump: hump,
    YieId: YieId
  });

  var DirectiveGroup = _.dynamicClass({
    extend: Binding,
    constructor: function (cfg) {
      this['super'](arguments);
      this.children = cfg.children;
      this.bindedCount = 0;
      this.bindedChildren = false;
      this._bind = this._bind.bind(this);
    },
    _setDirectives: function (directives) {
      this.directives = directives;
      this.directiveCount = directives.length;
    },
    _bind: function () {
      var idx = this.bindedCount;
      if (idx < this.directiveCount) {
        var directive = this.directives[idx],
            ret = directive.bind();
        this.bindedCount++;
        ret && ret instanceof YieId ? ret.then(this._bind) : this._bind();
      } else if (this.children) {
        _.each(this.children, function (directive) {
          directive.bind();
        });
        this.bindedChildren = true;
      }
    },
    bind: function () {
      this._bind();
    },
    unbind: function () {
      var directives = this.directives,
          i = this.bindedCount;

      if (this.bindedChildren) {
        _.each(this.children, function (directive) {
          directive.unbind();
        });
        this.bindedChildren = false;
      }
      while (i--) {
        directives[i].unbind();
      }
      this.bindedCount = 0;
    }
  });

  var directiveReg = /^ag-/;
  configuration$1.register('directiveReg', directiveReg, 'init', function (reg) {
    if (!_.isRegExp(reg)) throw new Error('Invalid Directive RegExp: ' + reg);
    directiveReg = reg;
    return true;
  });

  var DirectiveParser = _.dynamicClass({
    isDirective: function (attr) {
      return directiveReg.test(attr);
    },
    getDirective: function (attr) {
      return Directive.getDirective(attr.replace(directiveReg, ''));
    }
  });

  var Template$1 = _.dynamicClass({
    constructor: function (scope) {
      this.scope = scope;
      this.proxyHandler = this.proxyHandler.bind(this);
      observi$1.proxy.on(scope, this.proxyHandler);
    },
    proxyHandler: function (obj, proxy) {
      this.scope = proxy || obj;
    },
    before: function (target, bind) {
      if (bind !== false) this.bind();
      dom.before(this.el, dom.query(target));
      return this;
    },
    after: function (target, bind) {
      if (bind !== false) this.bind();
      dom.after(this.el, dom.query(target));
      return this;
    },
    prependTo: function (target, bind) {
      if (bind !== false) this.bind();
      dom.prepend(dom.query(target), this.el);
      return this;
    },
    appendTo: function (target, bind) {
      if (bind !== false) this.bind();
      dom.append(dom.query(target), this.el);
      return this;
    },
    remove: function (unbind) {
      dom.remove(this.el);
      if (unbind !== false) this.unbind();
    },
    bind: function () {
      if (!this.binded) {
        _.each(this.bindings, function (bind) {
          bind.bind();
        });
        this.binded = true;
      }
      return this;
    },
    unbind: function () {
      if (this.binded) {
        _.each(this.bindings, function (bind) {
          bind.unbind();
        });
        this.binded = false;
      }
      return this;
    },
    destroy: function () {
      observi$1.proxy.un(this.scope, this.proxyHandler);
      if (this.binded) _.each(this.bindings, function (bind) {
        bind.unbind();
        bind.destroy();
      });
      dom.remove(this.el);
      this.bindings = undefined;
      this.el = undefined;
    }
  });

  configuration$1.register('directiveParser', new DirectiveParser(), 'init', function (parser) {
    if (!(parser instanceof DirectiveParser)) throw new Error('Invalid Directive Parser: ' + parser);
    return true;
  });
  configuration$1.register('TextParser', TextParser, 'init', function (parser) {
    if (parser !== TextParser && (!_.isFunc(parser) || !_.isExtendOf(parser, TextParser))) throw new Error('Invalid Text Parser: ' + parser);
    return true;
  });

  var cfg = configuration$1.get();

  function _clone(el) {
    var elem = el.cloneNode(false);
    if (el.nodeType == 1) _.each(el.childNodes, function (c) {
      elem.appendChild(_clone(c));
    });
    return elem;
  }

  function clone(el) {
    return _.isArrayLike(el) ? _.map(el, _clone) : _clone(el);
  }

  var TEXT = 1;
  var DIRECTIVE = 2;
  var DIRECTIVE_GROUP = 3;
  var DomParser = _.dynamicClass({
    constructor: function (el, clone) {
      this.el = this.parseEl(el, clone);
      this.directiveParser = cfg.directiveParser;
      this.TextParser = cfg.TextParser;
      this.parse();
    },
    complie: function (scope) {
      var el = clone(this.el),
          df = document.createDocumentFragment(),
          tpl = new Template$1(scope);

      dom.append(df, el);

      tpl.el = el;
      tpl.bindings = this.parseBindings(this.bindings, scope, this.parseEls(el), tpl);
      return tpl;
    },
    parseBindings: function (descs, scope, els, tpl) {
      var _this = this;

      return _.map(descs, function (desc) {
        var type = desc.type,
            cfg = {
          el: els[desc.index],
          scope: scope,
          tpl: tpl
        };

        if (type === TEXT) {
          cfg.expression = desc.expression;
          return new Text(cfg);
        }

        cfg.block = desc.block;
        cfg.children = desc.children ? _this.parseBindings(desc.children || [], scope, els) : undefined;

        if (type === DIRECTIVE) {
          cfg.expression = desc.expression;
          cfg.attr = desc.attr;
          cfg.domParser = desc.domParser;
          cfg.independent = desc.independent;
          cfg.group = undefined;
          return new desc.directive(cfg);
        } else {
          var group = new DirectiveGroup(cfg);
          group._setDirectives(_.map(desc.directives, function (desc) {
            return new desc.directive({
              el: cfg.el,
              scope: scope,
              expression: desc.expression,
              attr: desc.attr,
              tpl: tpl,
              group: group
            });
          }));
          return group;
        }
      });
    },
    parseEls: function (el) {
      var index = 0,
          elStatus = this.elStatus;
      return this.eachDom(el, [], function (el, els) {
        els.push(el);
        return elStatus[index++].marked && els;
      }, function (el, els) {
        els.push(el);
        index++;
      });
    },
    parseEl: function (el, clone) {
      if (_.isString(el)) {
        el = _.trim(el);
        if (el.charAt(0) == '<' || el.length > 30) {
          var templ = document.createElement('div');
          dom.html(templ, el);
          el = templ.childNodes;
        }
        el = dom.query(el);
      } else if (clone) {
        el = dom.cloneNode(el);
      }
      return el;
    },
    eachDom: function (el, data, elemHandler, textHandler) {
      var _this2 = this;

      if (_.isArrayLike(el)) {
        _.each(el, function (el) {
          _this2._eachDom(el, data, elemHandler, textHandler);
        });
      } else {
        this._eachDom(el, data, elemHandler, textHandler);
      }
      return data;
    },
    _eachDom: function (el, data, elemHandler, textHandler) {
      var _this3 = this;

      switch (el.nodeType) {
        case 1:
          if (data = elemHandler(el, data)) _.each(_.map(el.childNodes, function (n) {
            return n;
          }), function (el) {
            _this3._eachDom(el, data, elemHandler, textHandler);
          });
          break;
        case 3:
          textHandler(el, data);
          break;
      }
    },
    parse: function () {
      var _this4 = this;

      var elStatus = [],
          index = 0,
          TextParser = this.TextParser,
          directiveParser = this.directiveParser;

      function markEl(el, marked) {
        if (el) {
          elStatus.push({
            el: el,
            marked: marked
          });
          index++;
        }
        return el;
      }
      this.elStatus = elStatus;
      this.bindings = this.eachDom(this.el, [], function (el, bindings) {
        var directives = [],
            block = false,
            independent = false,
            desc = void 0;

        _.each(el.attributes, function (attr) {
          var name = attr.name,
              directive = void 0;

          if (!directiveParser.isDirective(name)) return;

          if (!(directive = directiveParser.getDirective(name))) {
            logger$2.warn('Directive[' + name + '] is undefined');
            return;
          }
          var desc = {
            type: DIRECTIVE,
            index: index,
            expression: attr.value,
            directive: directive,
            attr: name,
            block: Directive.isBlock(directive),
            independent: Directive.isIndependent(directive)
          };
          if (desc.independent) {
            desc.block = block = independent = true;
            directives = [desc];
            return false;
          } else if (desc.block) {
            block = true;
          }
          directives.push(desc);
        });

        if (!directives.length) {
          markEl(el, true);
          return bindings;
        }

        if (directives.length == 1) {
          desc = directives[0];
        } else {
          desc = {
            type: DIRECTIVE_GROUP,
            index: index,
            directives: directives.sort(function (a, b) {
              return Directive.getPriority(b.directive) - Directive.getPriority(a.directive) || 0;
            }),
            block: block,
            independent: independent
          };
        }
        desc.children = !block && [];

        bindings.push(desc);
        if (independent) {
          var childEl = dom.cloneNode(el, false);
          dom.removeAttr(childEl, directives[0].attr);
          dom.append(childEl, _.map(el.childNodes, function (n) {
            return n;
          }));
          desc.domParser = new DomParser(childEl, false);
        }
        markEl(el, !block);
        return desc.children;
      }, function (el, bindings) {
        var expr = dom.text(el),
            parser = new TextParser(expr),
            token = void 0,
            i = 0;

        var p = el.parentNode,
            l = p.childNodes.length,
            ii = index;
        while (token = parser.nextToken()) {
          if (i < token.start) markEl(_this4.insertNotBlankText(expr.substring(i, token.start), el), false);
          bindings.push({
            type: TEXT,
            index: index,
            expression: token.token
          });
          markEl(_this4.insertText('binding', el), false);
          i = token.end;
        }
        if (i) {
          markEl(_this4.insertNotBlankText(expr.substr(i), el), false);
          dom.remove(el);
        } else {
          markEl(el, false);
        }
      });
    },
    insertNotBlankText: function (content, before) {
      return content ? this.insertText(content || '&nbsp;', before) : undefined;
    },
    insertText: function (content, before) {
      var el = document.createTextNode(content);
      dom.before(el, before);
      return el;
    }
  });

  var templateId = 0;
  var templateCache = {};
  var inited = false;

  var Template = _.dynamicClass({
    statics: {
      get: function (id) {
        return templateCache[id];
      },

      DirectiveParser: DirectiveParser,
      TextParser: TextParser
    },
    constructor: function (templ) {
      var cfg = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      if (!inited) {
        configuration$1.nextStatus();
        inited = true;
      }
      this.id = cfg.id || templateId++;
      if (_.hasOwnProp(templateCache, this.id)) {
        throw new Error('Existing Template[' + this.id + ']');
      }
      this.parser = new DomParser(templ);
      templateCache[this.id] = this;
    },
    complie: function (scope) {
      return this.parser.complie(scope);
    }
  });

  var eachReg = /^\s*([\s\S]+)\s+in\s+([\S]+)(\s+track\s+by\s+([\S]+))?\s*$/;
  var eachAliasReg = /^(\(\s*([^,\s]+)(\s*,\s*([\S]+))?\s*\))|([^,\s]+)(\s*,\s*([\S]+))?$/;
  Directive.register('each', _.dynamicClass({
    extend: Directive,
    independent: true,
    block: true,
    priority: 10,
    constructor: function () {
      this['super'](arguments);
      this.observeHandler = this.observeHandler.bind(this);
      this.observeLenHandler = this.observeLenHandler.bind(this);
      var token = this.expr.match(eachReg);
      if (!token) throw Error('Invalid Expression[' + this.expr + '] on Each Directive');

      this.scopeExpr = token[2];
      this.indexExpr = token[4];

      var aliasToken = token[1].match(eachAliasReg);
      if (!aliasToken) throw Error('Invalid Expression[' + token[1] + '] on Each Directive');

      this.valueAlias = aliasToken[2] || aliasToken[5];
      this.keyAlias = aliasToken[4] || aliasToken[7];

      this.begin = document.createComment('each begin');
      this.end = document.createComment('each end');
      dom.replace(this.el, this.begin);
      dom.after(this.end, this.begin);
      this.el = undefined;
      this.version = 1;
    },
    update: function (data) {
      var _this = this;

      var domParser = this.domParser,
          parentScope = this.realScope(),
          indexExpr = this.indexExpr,
          used = this.used,
          version = this.version++,
          indexMap = this.used = {},
          descs = _.map(data, function (item, idx) {
        var index = indexExpr ? _.get(item, indexExpr) : idx,
            // read index of data item
        reuse = used && used[index],
            desc = void 0;

        if (reuse && reuse.version === version) reuse = undefined;

        desc = reuse || {
          index: index
        };
        desc.version = version;
        desc.data = observi$1.proxy(item);
        indexMap[index] = desc;
        return desc;
      }),
          idles = undefined,
          before = this.begin;
      if (used) {
        idles = [];
        _.each(used, function (desc) {
          if (desc.version != version) idles.push(desc);
        });
      }
      _.each(descs, function (desc, i) {
        var isNew = false;
        if (!desc.scope) {
          var idle = idles && idles.pop();
          if (!idle) {
            desc.scope = _this.createScope(parentScope, desc.data, desc.index);
            desc.tpl = domParser.complie(desc.scope);
            isNew = true;
          } else {
            desc.scope = idle.scope;
            desc.tpl = idle.tpl;
          }
        }
        if (!isNew) _this.initScope(desc.scope, desc.data, desc.index);
        desc.tpl.after(before);
        before = desc.tpl.el;
        data[i] = observi$1.proxy(desc.data);
      });
      if (idles) _.each(idles, function (idle) {
        return idle.tpl.destroy();
      });
    },
    createScope: function (parentScope, value, index) {
      var scope = _.create(parentScope);
      scope.$parent = parentScope;
      scope.$eachContext = this;
      this.initScope(scope, value, index, true);
      return scope;
    },
    initScope: function (scope, value, index, isCreate) {
      if (!isCreate) scope = observi$1.proxy(scope);
      scope[this.valueAlias] = value;
      if (this.keyAlias) scope[this.keyAlias] = index;
    },
    bind: function () {
      this.observe(this.scopeExpr, this.observeHandler);
      this.observe(this.scopeExpr + '.length', this.observeLenHandler);
      this.update(this.target());
    },
    unbind: function () {
      this.unobserve(this.scopeExpr, this.observeHandler);
      this.unobserve(this.scopeExpr + '.length', this.observeLenHandler);
    },
    target: function () {
      return this.get(this.scopeExpr);
    },
    observeHandler: function (expr, target) {
      this.update(target);
    },
    observeLenHandler: function () {
      this.update(this.target());
    }
  }));

  var expressionArgs$1 = ['$scope', '$el', '$event', '$tpl', '$binding'];

  var EventDirective = _.dynamicClass({
    extend: Directive,
    constructor: function () {
      this['super'](arguments);
      this.handler = this.handler.bind(this);
      this.expression = expression(this.expr, expressionArgs$1, this.expressionScopeProvider);
    },
    handler: function (e) {
      e.stopPropagation();

      var scope = this.scope(),
          exp = this.expression;

      if (exp.executeFilter(scope, [scope, this.el, e, this.tpl, this], e) !== false) {
        var fn = exp.execute(scope, [scope, this.el, e, this.tpl, this]);
        if (exp.isSimple()) {
          if (_.isFunc(fn)) {
            scope = this.exprScope(exp.expr);
            fn.call(scope, scope, this.el, e, this.tpl, this);
          } else {
            logger$2.warn('Invalid Event Handler:%s', this.expr, fn);
          }
        }
      }
    },
    bind: function () {
      dom.on(this.el, this.eventType, this.handler);
      this['super'](arguments);
    },
    unbind: function () {
      this['super'](arguments);
      dom.off(this.el, this.eventType, this.handler);
    }
  });

  var events = ['blur', 'change', 'click', 'dblclick', 'error', 'focus', 'keydown', 'keypress', 'keyup', 'load', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'resize', 'scroll', 'select', 'submit', 'unload', {
    name: 'oninput',
    eventType: 'input propertychange'
  }];

  var directives$1 = _.assign(_.convert(events, function (opt) {
    var name = _.isObject(opt) ? opt.name : opt;
    return hump(name + 'Directive');
  }, function (opt) {
    if (!_.isObject(opt)) opt = {
      eventType: opt
    };
    var name = opt.name || 'on' + opt.eventType;
    opt.extend = EventDirective;
    return Directive.register(name, opt);
  }), {
    EventDirective: EventDirective
  });

  var expressionArgs$2 = ['$scope', '$el', '$tpl', '$binding'];

  var SimpleDirective = _.dynamicClass({
    extend: Directive,
    constructor: function () {
      this['super'](arguments);
      this.observeHandler = this.observeHandler.bind(this);
      this.expression = expression(this.expr, expressionArgs$2, this.expressionScopeProvider);
    },
    realValue: function () {
      var scope = this.scope();
      return this.expression.execute(scope, [scope, this.el, this.tpl, this]);
    },
    value: function () {
      var scope = this.scope();
      return this.expression.executeAll(scope, [scope, this.el, this.tpl, this]);
    },
    listen: function () {
      var _this = this;

      _.each(this.expression.identities, function (ident) {
        _this.observe(ident, _this.observeHandler);
      });
      this.update(this.value());
    },
    unlisten: function () {
      var _this2 = this;

      _.each(this.expression.identities, function (ident) {
        _this2.unobserve(ident, _this2.observeHandler);
      });
    },
    bind: function () {
      this.listen();
      this['super'](arguments);
    },
    unbind: function () {
      this['super'](arguments);
      this.unlisten();
    },
    blankValue: function (val) {
      if (arguments.length == 0) val = this.value();
      return _.isNil(val) ? '' : val;
    },
    observeHandler: function (expr, val) {
      if (this.expression.isSimple()) {
        var scope = this.scope();
        this.update(this.expression.executeFilter(scope, [scope, this.el, this.tpl, this], val));
      } else {
        this.update(this.value());
      }
    },
    update: function (val) {
      throw 'abstract method';
    }
  });

  var EVENT_CHANGE = 'change';
  var EVENT_INPUT = 'input';
  var TAG_SELECT = 'SELECT';
  var TAG_INPUT = 'INPUT';
  var TAG_TEXTAREA = 'TEXTAREA';
  var RADIO = 'radio';
  var CHECKBOX = 'checkbox';
var   directives$2 = {
    text: {
      block: true,
      update: function (val) {
        dom.text(this.el, this.blankValue(val));
      }
    },
    html: {
      block: true,
      update: function (val) {
        dom.html(this.el, this.blankValue(val));
      }
    },
    'class': {
      update: function (value) {
        if (value && typeof value == 'string') {
          this.handleArray(_.trim(value).split(/\s+/));
        } else if (value instanceof Array) {
          this.handleArray(value);
        } else if (value && typeof value == 'object') {
          this.handleObject(value);
        } else {
          this.cleanup();
        }
      },
      handleObject: function (value) {
        this.cleanup(value, false);
        var keys = this.prevKeys = [],
            el = this.el;
        for (var key in value) {
          if (value[key]) {
            dom.addClass(el, key);
            keys.push(key);
          } else {
            dom.removeClass(el, key);
          }
        }
      },
      handleArray: function (value) {
        this.cleanup(value, true);
        var keys = this.prevKeys = [],
            el = this.el;
        _.each(value, function (val) {
          if (val) {
            keys.push(val);
            dom.addClass(el, val);
          }
        });
      },
      cleanup: function (value, isArr) {
        var prevKeys = this.prevKeys;
        if (prevKeys) {
          var i = prevKeys.length,
              el = this.el;
          while (i--) {
            var key = prevKeys[i];
            if (!value || (isArr ? _.indexOf(value, key) == -1 : !_.hasOwnProp(value, key))) {
              dom.removeClass(el, key);
            }
          }
        }
      }
    },
    'style': {
      update: function (value) {
        if (value && _.isString(value)) {
          dom.style(this.el, value);
        } else if (value && _.isObject(value)) {
          this.handleObject(value);
        }
      },
      handleObject: function (value) {
        this.cleanup(value);
        var keys = this.prevKeys = [],
            el = this.el;
        _.each(value, function (val, key) {
          dom.css(el, key, val);
        });
      },
      cleanup: function (value) {
        var prevKeys = this.prevKeys;
        if (prevKeys) {
          var i = prevKeys.length,
              el = this.el;
          while (i--) {
            var key = prevKeys[i];
            if (!value || !_.hasOwnProp(value, key)) dom.css(el, key, '');
          }
        }
      }
    },
    show: {
      update: function (val) {
        dom.css(this.el, 'display', val ? '' : 'none');
      }
    },
    hide: {
      update: function (val) {
        dom.css(this.el, 'display', val ? 'none' : '');
      }
    },
    value: {
      update: function (val) {
        dom.val(this.el, this.blankValue(val));
      }
    },
    'if': {
      priority: 9,
      bind: function () {
        this.yieId = new YieId();
        this.listen();
        return this.yieId;
      },
      unbind: function () {
        if (!this.yieId) this.unbindChildren();
        this.unlisten();
      },
      update: function (val) {
        if (!val) {
          dom.css(this.el, 'display', 'none');
        } else {
          if (this.yieId) {
            this.yieId.done();
            this.yieId = undefined;
            this.bindChildren();
          }
          dom.css(this.el, 'display', '');
        }
      }
    },
    checked: {
      update: function (val) {
        _.isArray(val) ? dom.checked(this.el, _.indexOf(val, dom.val(this.el))) : dom.checked(this.el, !!val);
      }
    },
    selected: {
      update: function (val) {}
    },
    focus: {
      update: function (val) {
        if (val) dom.focus(this.el);
      }
    },
    input: {
      priority: 4,
      constructor: function () {
        this['super'](arguments);
        if (!this.expression.isSimple()) throw TypeError('Invalid Expression[' + this.expression.expr + '] on InputDirective');

        this.onChange = this.onChange.bind(this);
        var tag = this.tag = this.el.tagName;
        switch (tag) {
          case TAG_SELECT:
            this.event = EVENT_CHANGE;
            break;
          case TAG_INPUT:
            var type = this.type = this.el.type;
            this.event = type == RADIO || type == CHECKBOX ? EVENT_CHANGE : EVENT_INPUT;
            break;
          case TAG_TEXTAREA:
            throw TypeError('Directive[input] not support ' + tag);
            break;
          default:
            throw TypeError('Directive[input] not support ' + tag);
        }
      },
      bind: function () {
        dom.on(this.el, this.event, this.onChange);
        this['super']();
      },
      unbind: function () {
        this['super']();
        dom.off(this.el, this.event, this.onChange);
      },
      setRealValue: function (val) {
        this.set(this.expression.expr, val);
      },
      setValue: function (val) {
        var scope = this.scope();
        this.setRealValue(this.expression.restore(scope, [scope, this.el, this.tpl, this], val));
      },
      onChange: function (e) {
        var val = this.elVal(),
            idx = void 0,
            _val = this.val;
        if (val != _val) this.setValue(val);
        e.stopPropagation();
      },
      update: function (val) {
        var _val = this.blankValue(val);
        if (_val != this.val) this.elVal(this.val = _val);
      },
      elVal: function (val) {
        var tag = this.tag;

        switch (tag) {
          case TAG_SELECT:
            break;
          case TAG_INPUT:
            var type = this.type;

            if (type == RADIO || type == CHECKBOX) {
              if (arguments.length == 0) {
                return dom.checked(this.el) ? dom.val(this.el) : undefined;
              } else {
                var checked = void 0;

                checked = val == dom.val(this.el);
                if (dom.checked(this.el) != checked) dom.checked(this.el, checked);
              }
            } else {
              if (arguments.length == 0) {
                return dom.val(this.el);
              } else if (val != dom.val(this.el)) {
                dom.val(this.el, val);
              }
            }
            break;
          case TAG_TEXTAREA:
            throw TypeError('Directive[input] not support ' + tag);
            break;
          default:
            throw TypeError('Directive[input] not support ' + tag);
        }
      }
    }
  };
  _.assign(_.convert(directives$2, function (opt, name) {
    return hump(name + 'Directive');
  }, function (opt, name) {
    opt.extend = SimpleDirective;
    return Directive.register(name, opt);
  }), {
    SimpleDirective: SimpleDirective
  });

  var core = _.assign({}, {
    Template: Template,
    translate: translate,
    expression: expression,
    Directive: Directive,
    directives: directives$1,
    logger: logger$2,
    configuration: new _.ConfigurationChain(configuration$1, observi$1.configuration)
  }, dom, util$1);

  function argilo(templ, cfg) {
    return new Template(templ, cfg);
  }
  _.assignIf(argilo, {
    argilo: argilo,
    observi: observi$1,
    ilos: _
  }, core, _, observi$1.observi);

  return argilo;

}));
//# sourceMappingURL=argilo.js.map