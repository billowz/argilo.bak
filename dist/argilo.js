/*
 * argilo v0.0.1 built in Fri, 14 Oct 2016 06:43:43 GMT
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

  if (!Object.freeze) {
    Object.freeze = function freeze(obj) {
      return obj;
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

  function each$1(obj, callback, scope, own) {
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

    each$1(obj, function (val, key, obj, isOwn) {
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

    each$1(obj, function (val, key) {
      o[keyGen ? keyGen.apply(this, arguments) : key] = valGen ? valGen.apply(this, arguments) : val;
    }, scope, own);
    return o;
  }

  function reverseConvert(obj, valGen, scope, own) {
    var o = {};

    each$1(obj, function (val, key) {
      o[val] = valGen ? valGen.apply(this, arguments) : key;
    }, scope, own);
    return o;
  }

var coll = Object.freeze({
    each: each$1,
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

    each$1(obj, function (val, key) {
      if (!filter || filter.apply(this, arguments)) keys.push(key);
    }, scope, own);
    return keys;
  }

  function values(obj, filter, scope, own) {
    var values = [];

    each$1(obj, function (val, key) {
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
    if (props) each$1(props, function (prop, name) {
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
      return isFinite(width) ? width < 0 ? 0 : width : 0;
    }

    // for index
    function parseArg(i) {
      if (!i || i == '*') return args[index++];
      if (i == '$') return args[index];
      return args[i.slice(0, -1) - 1];
    }

    str = str.replace(formatReg, function (match, i, flags, minWidth, precision, type) {
      if (type === '%') return '%';

      var value = parseArg(i);
      minWidth = parseWidth(minWidth);
      precision = precision && parseWidth(precision.slice(1));
      if (!precision && precision !== 0) precision = 'fFeE'.indexOf(type) == -1 ? type == 'd' ? 0 : void 0 : 6;

      var leftJustify = false,
          positivePrefix = '',
          zeroPad = false,
          prefixBaseX = false,
          thousandSeparation = false,
          prefix = void 0,
          base = void 0;

      if (flags) each$1(flags, function (c) {
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
      });
      switch (type) {
        case 'c':
          return String.fromCharCode(+value);
        case 's':
          if (isNil(value) && !isNaN(value)) return '';
          value += '';
          if (precision && value.length > precision) value = value.slice(0, precision);
          if (value.length < minWidth) value = pad(value, minWidth, zeroPad ? '0' : ' ', false);
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

            var method = void 0,
                ltype = type.toLowerCase();

            if ('p' != ltype) {
              method = ['toExponential', 'toFixed', 'toPrecision']['efg'.indexOf(ltype)];
            } else {
              var sf = String(value).replace(/[eE].*|[^\d]/g, '');
              sf = (_number ? sf.replace(/^0+/, '') : sf).length;
              if (precision) precision = Math.min(precision, sf);
              method = !precision || precision <= sf ? 'toPrecision' : 'toExponential';
            }
            _number = _number[method](precision);

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

  assign(Base.prototype, {
    'super': function (args) {
      var method = arguments.callee.caller;
      method.$owner.superclass[method.$name].apply(this, args || emptyArray);
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
        each$1(overrides, function (member, name) {
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
      var _this = this;

      var cnt = 0;
      each$1(arguments, function (obj) {
        var list = _this._listObj(obj) || (obj[LIST_KEY] = {});

        if (!list[_this._id]) {
          _this._move(list[_this._id] = _this._newDesc(obj), _this._tail);
          cnt++;
        }
      });
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
      var _this2 = this;

      if (!arguments.length) return this._tail && this._tail.obj;

      each$1(arguments, function (obj) {
        _this2._move(_this2._getOrCreateDesc(obj), _this2._tail);
      });
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
      var _this3 = this;

      var cnt = 0;
      each$1(arguments, function (obj) {
        var list = _this3._listObj(obj),
            desc = list && list[_this3._id];
        if (desc) {
          _this3._unlink(desc);
          delete list[_this3._id];
          cnt++;
        }
      });
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
      var _this4 = this;

      var rs = [];
      this.each(function (obj) {
        rs.push(callback.call(scope || _this4, obj, _this4));
      });
      return rs;
    },
    filter: function (callback, scope) {
      var _this5 = this;

      var rs = [];
      this.each(function (obj) {
        if (callback.call(scope || _this5, obj, _this5)) rs.push(obj);
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
  if (console && !console.debug) console.debug = function () {
    Function.apply.call(console.log, console, arguments);
  };

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
      this.level = indexOf(logLevels, level || 'info');
    },
    setLevel: function (level) {
      this.level = indexOf(logLevels, level || 'info');
    },
    getLevel: function () {
      return logLevels[this.level];
    },
    _print: function (level, args, trace) {
      Function.apply.call(console[level], console, args);
      if (trace && console.trace) console.trace();
    },
    _log: function (level, args, trace) {
      if (level < this.level || !console) return;
      var msg = '[%s] %s -' + (isString(args[0]) ? ' ' + args.shift() : ''),
          errors = [];
      args = filter(args, function (arg) {
        if (arg instanceof Error) {
          errors.push(arg);
          return false;
        }
        return true;
      });
      each$1(errors, function (err) {
        args.push.call(args, err.message, '\n', err.stack);
      });
      level = logLevels[level];
      this._print(level, [msg, level, this.module].concat(args), trace);
    },
    debug: function () {
      this._log(0, slice$2.call(arguments, 0));
    },
    info: function () {
      this._log(1, slice$2.call(arguments, 0));
    },
    warn: function () {
      this._log(2, slice$2.call(arguments, 0));
    },
    error: function () {
      this._log(3, slice$2.call(arguments, 0));
    }
  });

  Logger.logger = new Logger('default', 'info');

  var logger$1 = Logger.logger;

  var Configuration = dynamicClass({
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
      var _this = this;

      if (arguments.length == 1) {
        each$1(name, function (val, name) {
          _this.register(name, val, defVal, status);
        });
      } else {
        this.cfg[name] = defVal;
        this.cfgStatus[name] = {
          statusIdx: indexOf(this.statusList, status),
          validator: validator
        };
      }
      return this;
    },
    checkStatus: function (s, cs, i, ci) {
      return i >= ci;
    },
    config: function (name, val) {
      var _this2 = this;

      if (arguments.length == 1) {
        each$1(name, function (val, name) {
          _this2.config(name, val);
        });
      } else if (hasOwnProp(this.cfg, name)) {
        var _cfgStatus$name = this.cfgStatus[name];
        var statusIdx = _cfgStatus$name.statusIdx;
        var validator = _cfgStatus$name.validator;


        if (statusIdx != -1 && !this.checkStatus(status, currentStatus, statusIdx, currentStatusIdx)) {
          logger$1.warn('configuration[{}]: must use in status[{}]', name, status);
          return this;
        }
        if (isFunc(validator) && validator(name, val, this) !== true) {
          logger$1.warn('configuration[{}]: invalid value[{}]', name, val);
          return this;
        }
        var oldVal = this.cfg[name];
        this.cfg[name] = val;
        each$1(this.listens[name], function (cb) {
          cb(name, val, oldVal, _this2);
        });
      }
      return this;
    },
    get: function (name) {
      return arguments.length ? this.cfg[name] : create(this.cfg);
    },
    on: function (name, handler) {
      var _this3 = this;

      if (!isFunc(handler)) throw new Error('Invalid Callback');
      if (isArray(name)) {
        each$1(name, function (name) {
          _this3.on(name, handler);
        });
        return this;
      } else {
        (this.listens[name] || (this.listens[name] = [])).push(handler);
      }
      return this;
    },
    un: function (name, handler) {
      var _this4 = this;

      if (isArray(name)) {
        each$1(name, function (name) {
          _this4.un(name, handler);
        });
      } else {
        var queue = this.listens[name],
            idx = queue ? indexOf(queue, handler) : -1;
        if (idx != -1) queue.splice(idx, 1);
      }
      return this;
    }
  });

  var _ = assign({
    LinkedList: LinkedList,
    Configuration: Configuration
  }, common, is, coll, obj$1, string, cls);

  var configuration = new _.Configuration({}, ['init', 'runtime']);

  configuration.register('bindProxy', '__observi_proxy__', 'init');

var   hasOwn$3 = Object.prototype.hasOwnProperty;
var   cfg$3 = configuration.get();
  var defaultPolicy = {
    eq: function (o1, o2) {
      return o1 === o2;
    },
    obj: function (o) {
      return o;
    },
    proxy: function (o) {
      return o;
    }
  };
  var apply = {
    change: function (obj, p) {
      var handlers = _.getOwnProp(obj, cfg$3.bindProxy);

      if (handlers) handlers.each(function (handler) {
        return handler(obj, p);
      });
    },
    on: function (obj, handler) {
      if (!_.isFunc(handler)) throw TypeError('Invalid Proxy Event Handler[' + handler);

      var key = cfg$3.bindProxy,
          handlers = _.getOwnProp(obj, key) ? obj[key] : obj[key] = new _.LinkedList();
      return handlers.push(handler) == 1;
    },
    un: function (obj, handler) {
      var handlers = _.getOwnProp(obj, cfg$3.bindProxy);

      if (handlers && _.isFunc(handler)) return handlers.remove(handler) == 1;
      return false;
    },
    clean: function (obj) {
      if (obj[proxy$1.listenKey]) obj[proxy$1.listenKey] = undefined;
    }
  };
  function proxy$1(o) {
    return proxy$1.proxy(o);
  }
  var hasEnabled = false;
  _.assign(proxy$1, {
    isEnable: function () {
      return proxy$1.on !== _.emptyFunc;
    },
    enable: function (policy) {
      applyPolicy(policy);
      if (!hasEnabled) {
        _.policy('hasOwn', function (obj, prop) {
          return hasOwn$3.call(proxy$1.obj(obj), prop);
        });
        _.policy('eq', proxy$1.eq);
        hasEnabled = true;
      }
    },
    disable: function () {
      applyPolicy(defaultPolicy);
    }
  });

  function applyPolicy(policy) {
    var _apply = policy !== defaultPolicy ? function (fn, name) {
      proxy$1[name] = fn;
    } : function (fn, name) {
      proxy$1[name] = _.emptyFunc;
    };
    _.each(apply, _apply);
    _.each(policy, function (fn, name) {
      proxy$1[name] = fn;
    });
  }
  proxy$1.disable();

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
      this.getters = {}; // getter callback queue
      this.setters = {}; // setter callback queue
      this.watched = {}; // watched cache
    },
    get: function (attr, val) {
      if (interceptGetter) {
        var queue = this.getters[attr];
        if (queue) queue.each(function (cb) {
          return cb(attr, val);
        });
      }
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
    getter: function (attr, cb) {
      return this.accessor(this.getters, attr, cb);
    },
    setter: function (attr, cb) {
      return this.accessor(this.setters, attr, cb);
    },
    ungetter: function (attr, cb) {
      return this.unaccessor(this.getters, attr, cb);
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

  var cfg$2 = configuration.get();

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
    logger.info('register observi Watcher[%s], priority = %d', name, priority);
  }

  function initWatcher() {
    if (!watchers) return;
    configuration.nextStatus();
    each(watchers, function (watcher) {
      var validator = watcher.validator,
          builder = watcher.builder;

      if (!_.isFunc(validator) || validator(cfg$2)) {
        try {
          watcher = builder(cfg$2);
          if (_.isFunc(watcher) && _.isExtendOf(watcher, Watcher)) {
            currentWatcher = watcher;
            logger.info('apply observi Watcher[%s], priority = %d', watcher.name, watcher.priority);
            return false;
          } else {
            logger.error('invalid observi Watcher[%s], priority = %d', watcher.name, watcher.priority);
          }
        } catch (e) {
          logger.error('apply observi Watcher[%s] failed', e);
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
      setTimeout(flushQueue, 0);
    }
  }

  var logger$2 = new _.Logger('observi', 'info');

  configuration.register({
    bindWatcher: '__watcher__',
    lazy: true
  }, 'init');

var   hasOwn$2 = Object.prototype.hasOwnProperty;
var   cfg$1 = configuration.get();
  function getOrCreateWatcher(obj) {
    if (hasOwn$2.call(obj, cfg$1.bindWatcher)) return obj[cfg$1.bindWatcher];
    return obj[cfg$1.bindWatcher] = createWatcher(obj);
  }

  var Observi = _.dynamicClass({
    constructor: function (obj, expr, path) {
      this.obj = obj;
      this.expr = expr;
      this.path = path;
      this.watchers = Array(path.length);
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
      if (cfg$1.lazy) {
        if (this.dirty) {
          if ((eq = proxy$1.eq(val, this.oldVal)) && _.isPrimitive(val)) {
            this.dirty = false;
            return;
          }
        } else {
          this.oldVal = oldVal;
          this.dirty = true;
          notify(this);
        }
        this.eq = eq;
        this.newVal = val;
      } else {
        this.fire(val, oldVal, eq);
      }
    },
    initCallbacks: function () {
      _.map(this.path, function (prop, i) {
        return this.createCallback(i);
      }, this);
    },
    createCallback: function (idx) {
      var _this = this;

      var path = this.path,
          nextIdx = idx + 1,
          rpath = path.length - nextIdx && path.slice(nextIdx),
          valCache = undefined,
          valCached = false;

      return function (attr, val, oldVal, watcher, eq) {
        if (rpath) {
          if (eq) return;

          // unwatch & get old value
          if (oldVal) {
            oldVal = proxy$1.obj(oldVal);
            _this.unwatch(oldVal, nextIdx);
            oldVal = valCached ? valCache : _.get(oldVal, rpath);
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
                obj = proxy$1.obj(obj[path++]);
                if (!obj) return;
              }
              obj[path[idx]] = watcher.proxy;
            } else {
              _this.watch(val, nextIdx);
            }
            val = valCache = _.get(val, rpath);
            valCached = true;
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

        if (++idx < path.length && (val = obj[attr])) this.unwatch(proxy$1.obj(val), idx);
      }
      return watcher;
    }
  });

  var hasOwn$4 = Object.prototype.hasOwnProperty;

  configuration.register({
    enableES6Proxy: true,
    bindES6ProxySource: '__observi_proxy_source__',
    bindES6Proxy: '__observi_proxy__'
  }, 'init');

  registerWatcher('ES6Proxy', 10, function (config) {
    return window.Proxy && config.enableES6Proxy !== false;
  }, function (config) {
    var bindES6ProxySource = config.bindES6ProxySource;
    var bindES6Proxy = config.bindES6Proxy;


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
    return _.dynamicClass({
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
          get: function (obj, attr) {
            var val = obj[attr];
            _this.get(attr, val);
            return val;
          },
          set: function (obj, attr, value) {
            var oldVal = obj[attr];
            obj[attr] = value;
            _this.set(attr, value, oldVal);
            return true;
          }
        });
      }
    });
  });

  var arrayProto = Array.prototype;

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
      return this.isArray && attr != 'length';
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
    return _.dynamicClass({
      extend: ArrayWatcher,
      watch: function (attr) {
        var _this = this;

        if (this['super']([attr])) return;

        var value = this.obj[attr];
        Object.defineProperty(this.obj, attr, {
          enumerable: true,
          configurable: true,
          get: function () {
            _this.get(attr, value);
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
  });

  registerWatcher('DefineGetterAndSetter', 30, function (config) {
    return '__defineGetter__' in {};
  }, function (config) {
    return _.dynamicClass({
      extend: ArrayWatcher,
      watch: function (attr) {
        var _this = this;

        if (this['super']([attr])) return;

        var value = this.obj[attr];
        this.obj.__defineGetter__(attr, function () {
          _this.get(attr, value);
          return value;
        });
        this.obj.__defineSetter__(attr, function (val) {
          var oldVal = value;
          value = val;
          _this.set(attr, val, oldVal);
        });
      }
    });
  });

var   hasOwn$5 = Object.prototype.hasOwnProperty;
  var RESERVE_PROPS = 'hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'.split(',');
  var RESERVE_ARRAY_PROPS = 'concat,copyWithin,entries,every,fill,filter,find,findIndex,forEach,includes,indexOf,join,keys,lastIndexOf,map,pop,push,reduce,reduceRight,reverse,shift,slice,some,sort,splice,unshift,values'.split(',');
  var supported = undefined;
  var VBClassFactory = _.dynamicClass({
    'static': {
      isSupport: function () {
        if (supported !== undefined) return supported;
        supported = false;
        if (window.VBArray) {
          try {
            window.execScript(['Function parseVB(code)', '\tExecuteGlobal(code)', 'End Function'].join('\n'), 'VBScript');
            supported = true;
          } catch (e) {
            logger$2.error(e.message, e);
          }
        }
        return supported;
      }
    },
    constBind: '__vb_constructor__',
    descBind: '__vb_description__',
    classNameGenerator: 0,
    constructor: function (defProps, onProxyChange) {
      this.classPool = {};
      this.defPropMap = {};
      this.onProxyChange = onProxyChange;
      this.addDefProps(defProps);
      this.initConstScript();
    },
    setConstBind: function (constBind) {
      this.constBind = constBind;
      this.initConstScript();
    },
    setDescBind: function (descBind) {
      this.descBind = descBind;
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
      logger$2.info('VBProxy default props is: ', props.join(','));
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
          logger$2.warn('defineProperty not support function [' + attr + ']');
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

  registerWatcher('VBScriptProxy', 40, function (config) {
    return VBClassFactory.isSupport();
  }, function (config) {
    var factory = void 0;
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
    factory = new VBClassFactory([config.bindWatcher, config.bindObservi, config.bindProxy, _.LinkedList.LIST_KEY].concat(config.defaultProps || []), proxy$1.change);

    return _.dynamicClass({
      extend: ArrayWatcher,
      watch: function (attr) {
        var _this = this;

        if (this['super']([attr])) return;
        this.proxy = (factory.descriptor(obj) || factory.create(obj)).defineProperty(attr, {
          set: function (val) {
            var oldVal = obj[attr];
            obj[attr] = val;
            _this.set(attr, oldVal, val);
          }
        });
      }
    });
  });

  function hookArrayFunc(func, obj, callback, scope, own) {
    return func(obj, proxy$1.isEnable() ? callback && function (v, k, s, o) {
      return callback.call(this, proxy$1.proxy(v), k, s, o);
    } : callback, scope, own);
  }
  configuration.register('bindObservis', '__observi__', 'init');
  var cfg = configuration.get();
var   hasOwn$1 = Object.prototype.hasOwnProperty;
  var PATH_JOIN = '###';
  function getOrCreateObservi(obj, expr) {
    var bindObservis = cfg.bindObservis,
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
    var bindObservis = cfg.bindObservis,
        path = _.parseExpr(expr),
        observis = void 0;
    if (!path.length) throw new Error('Invalid Observi Expression: ' + expr);
    observis = hasOwn$1.call(obj, bindObservis) ? obj[bindObservis] : undefined;
    return observis && observis[path.join(PATH_JOIN)];
  }

  var observi = {
    Watcher: Watcher,
    registerWatcher: registerWatcher,
    configuration: configuration,
    logger: logger$2,
    proxy: proxy$1,
    on: function (obj, expr, cb) {
      if (_.isFunc(cb)) throw new Error('Invalid Observi Callback');
      var observi = getOrCreateObservi(proxy$1.obj(obj), expr);
      observi.on(cb);
      return observi.watcher.proxy;
    },
    un: function (obj, expr, cb) {
      if (_.isFunc(cb)) throw new Error('Invalid Observi Callback');
      var observi = getObservi(proxy$1.obj(obj), expr);
      if (observi) {
        observi.un(cb);
        return observi.watcher.proxy;
      }
      return obj;
    },
    isListened: function (obj, expr, cb) {
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

  var observi$1 = _.assignIf(_.create(observi), {
    observi: observi,
    ilos: _
  }, _);

  var argilo = {
    observe: observi$1.on,
    unobserve: observi$1.un
  };

  var index = _.assignIf(_.create(argilo), {
    argilo: argilo,
    observi: observi$1,
    ilos: _
  }, observi$1.observi, _);

  return index;

}));
//# sourceMappingURL=argilo.js.map