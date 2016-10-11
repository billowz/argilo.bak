/*
 * argilo v0.0.1 built in Mon, 10 Oct 2016 07:09:17 GMT
 * Copyright (c) 2016 Tao Zeng <tao.zeng.zt@gmail.com>
 * Released under the MIT license
 * support IE6+ and other browsers
 * https://github.com/tao-zeng/argilo
 */
(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define('argilo', factory) :
    (global.argilo = factory());
}(this, function() {

  if (!Object.freeze) {
    Object.freeze = function freeze(obj) {
      return obj;
    };
  }

  var hasOwn = Object.prototype.hasOwnProperty;
  var policies = {
    hasOwn: function(obj, prop) {
      return hasOwn.call(obj, prop);
    },
    eq: function(o1, o2) {
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

  function isArray(obj) {
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
    isArray: isArray,
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

    each(obj, function(val, key) {
      ret[key] = callback.apply(this, arguments);
    }, scope, own);
    return ret;
  }

  function filter(obj, callback, scope, own) {
    var isArray = isArrayLike(obj),
      ret = isArray ? [] : {},
      each = isArray ? _eachArray : _eachObj;

    each(obj, function(val, key) {
      if (callback.apply(this, arguments)) isArray ? ret.push(val) : ret[key] = val;
    });
    return ret;
  }

  function aggregate(obj, callback, defVal, scope, own) {
    var ret = defVal;

    each(obj, function(val, key, obj, isOwn) {
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

    each(obj, function(val, key) {
      o[keyGen ? keyGen.apply(this, arguments) : key] = valGen ? valGen.apply(this, arguments) : val;
    }, scope, own);
    return o;
  }

  function reverseConvert(obj, valGen, scope, own) {
    var o = {};

    each(obj, function(val, key) {
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

  var toStr$1 = Object.prototype.toString;
  var exprCache = {};
  var exprReg = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g;
  var escapeCharReg = /\\(\\)?/g;

  function keys(obj, filter, scope, own) {
    var keys = [];

    each(obj, function(val, key) {
      if (!filter || filter.apply(this, arguments)) keys.push(key);
    }, scope, own);
    return keys;
  }

  function values(obj, filter, scope, own) {
    var values = [];

    each(obj, function(val, key) {
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

  var create = Object.create || function(parent, props) {
    emptyFunc.prototype = parent;
    var obj = new emptyFunc();
    emptyFunc.prototype = undefined;
    if (props) each(props, function(prop, name) {
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
    expr.replace(exprReg, function(match, number, quote, string) {
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

  var obj = Object.freeze({
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

  var slice$1 = Array.prototype.slice;
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

    str = str.replace(formatReg, function(match, i, flags, minWidth, precision, type) {
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

      if (flags) each(flags, function(c) {
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
    'super': function(args) {
      var method = arguments.callee.caller;
      method.$owner.superclass[method.$name].apply(this, args || emptyArray);
    },
    superclass: function() {
      var method = arguments.callee.caller;
      return method.$owner.superclass;
    }
  });

  assign(Base, {
    extend: function(overrides) {
      var _this = this;

      if (overrides) {
        var proto = this.prototype;
        each(overrides, function(member, name) {
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
    assign: function(statics) {
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

  var cls = Object.freeze({
    isExtendOf: isExtendOf,
    Base: Base,
    dynamicClass: dynamicClass
  });

  var LIST_KEY = '__linked_list__';
  var IDGenerator = 1;

  var LinkedList = dynamicClass({
    statics: {
      ListKey: LIST_KEY
    },
    constructor: function() {
      this._id = IDGenerator++;
      this.length = 0;
      this._header = undefined;
      this._tail = undefined;
      this._version = 1;
    },
    _listObj: function(obj) {
      return hasOwnProp(obj, LIST_KEY) && obj[LIST_KEY];
    },
    _desc: function(obj) {
      var list = this._listObj(obj);
      return list && list[this._id];
    },
    _newDesc: function(obj) {
      return {
        obj: obj,
        prev: undefined,
        next: undefined,
        version: this._version++
      };
    },
    _getOrCreateDesc: function(obj) {
      var list = this._listObj(obj) || (obj[LIST_KEY] = {}),
        desc = list[this._id];
      return desc || (list[this._id] = this._newDesc(obj));
    },
    _unlink: function(desc) {
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
    _move: function(desc, prev, alwaysMove) {
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
    _remove: function(desc) {
      var obj = desc.obj,
        list = this._listObj(obj);

      this._unlink(desc);
      delete list[this._id];
    },
    push: function() {
      var _this = this;

      var cnt = 0;
      each(arguments, function(obj) {
        var list = _this._listObj(obj) || (obj[LIST_KEY] = {});

        if (!list[_this._id]) {
          _this._move(list[_this._id] = _this._newDesc(obj), _this._tail);
          cnt++;
        }
      });
      return cnt;
    },
    pop: function() {
      var head = this._header;

      if (head) {
        this._remove(head);
        return head.obj;
      }
      return undefined;
    },
    shift: function() {
      var tail = this._tail;

      if (tail) {
        this._remove(tail);
        return tail.obj;
      }
      return undefined;
    },
    first: function() {
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
    last: function() {
      var _this2 = this;

      if (!arguments.length) return this._tail && this._tail.obj;

      each(arguments, function(obj) {
        _this2._move(_this2._getOrCreateDesc(obj), _this2._tail);
      });
      return this;
    },
    before: function(target) {
      var l = arguments.length,
        tdesc = this._desc(target),
        prev = tdesc && tdesc.prev;

      if (l == 1) return prev && prev.obj;
      while (l-- > 1) {
        this._move(this._getOrCreateDesc(arguments[l]), prev);
      }
      return this;
    },
    after: function(target) {
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
    contains: function(obj) {
      return !!this._desc(obj);
    },
    remove: function() {
      var _this3 = this;

      var cnt = 0;
      each(arguments, function(obj) {
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
    clean: function() {
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
    empty: function() {
      return this.length == 0;
    },
    size: function() {
      return this.length;
    },
    each: function(callback, scope) {
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
    map: function(callback, scope) {
      var _this4 = this;

      var rs = [];
      this.each(function(obj) {
        rs.push(callback.call(scope || _this4, obj, _this4));
      });
      return rs;
    },
    filter: function(callback, scope) {
      var _this5 = this;

      var rs = [];
      this.each(function(obj) {
        if (callback.call(scope || _this5, obj, _this5)) rs.push(obj);
      });
      return rs;
    },
    toArray: function() {
      var rs = [];
      this.each(function(obj) {
        rs.push(obj);
      });
      return rs;
    }
  });

  var Configuration = dynamicClass({
    constructor: function(def) {
      this.cfg = def || {};
      this.listens = [];
    },
    register: function(name, defVal) {
      var _this = this;

      if (arguments.length == 1) {
        each(name, function(val, name) {
          _this.cfg[name] = val;
        });
      } else {
        this.cfg[name] = defVal;
      }
      return this;
    },
    config: function(cfg) {
      var _this2 = this;

      if (cfg) each(this.cfg, function(val, key) {
        if (hasOwnProp(cfg, key)) {
          var oldVal = _this2.cfg[key],
            val = cfg[key];
          _this2.cfg[key] = val;
          each(_this2.listens, function(h) {
            return h(key, val, oldVal, _this2);
          });
        }
      });
      return this;
    },
    get: function(name) {
      return arguments.length ? this.cfg[name] : create(this.cfg);
    },
    listen: function(handler) {
      this.listens.push(handler);
    },
    unlisten: function(handler) {
      var idx = lastIndexOf(this.listens, handler);
      if (idx != -1) this.listens.splice(idx, 1);
    }
  });

  var logLevels = ['debug', 'info', 'warn', 'error'];
  var tmpEl = document.createElement('div');
  var slice$2 = Array.prototype.slice;
  var SimulationConsole = dynamicClass({
    constructor: function() {
      tmpEl.innerHTML = '<div id="simulation_console"\n    style="position:absolute; top:0; right:0; font-family:courier,monospace; background:#eee; font-size:10px; padding:10px; width:200px; height:200px;">\n  <a style="float:right; padding-left:1em; padding-bottom:.5em; text-align:right;">Clear</a>\n  <div id="simulation_console_body"></div>\n</div>';
      this.el = tmpEl.childNodes[0];
      this.clearEl = this.el.childNodes[0];
      this.bodyEl = this.el.childNodes[1];
    },
    appendTo: function(el) {
      el.appendChild(this.el);
    },
    log: function(style, msg) {
      tmpEl.innerHTML = '<span style="' + style + '">' + msg + '</span>';
      this.bodyEl.appendChild(tmpEl.childNodes[0]);
    },
    parseMsg: function(args) {
      var msg = args[0];
      if (isString(msg)) {
        var f = format.format.apply(null, args);
        return [f.format].concat(slice$2.call(args, f.count)).join(' ');
      }
      return args.join(' ');
    },
    debug: function() {
      this.log('color: red;', this.parseMsg(arguments));
    },
    info: function() {
      this.log('color: red;', this.parseMsg(arguments));
    },
    warn: function() {
      this.log('color: red;', this.parseMsg(arguments));
    },
    error: function() {
      this.log('color: red;', this.parseMsg(arguments));
    },
    clear: function() {
      this.bodyEl.innerHTML = '';
    }
  });
  var console = window.console;
  if (console && !console.debug) console.debug = function() {
    Function.apply.call(console.log, console, arguments);
  };

  var Logger = dynamicClass({
    statics: {
      enableSimulationConsole: function() {
        if (!console) {
          console = new SimulationConsole();
          console.appendTo(document.body);
        }
      }
    },
    constructor: function(_module, level) {
      this.module = _module;
      this.level = indexOf(logLevels, level || 'info');
    },
    setLevel: function(level) {
      this.level = indexOf(logLevels, level || 'info');
    },
    getLevel: function() {
      return logLevels[this.level];
    },
    _print: function(level, args, trace) {
      Function.apply.call(console[level], console, args);
      if (trace && console.trace) console.trace();
    },
    _log: function(level, args, trace) {
      if (level < this.level || !console) return;
      var msg = '[%s] %s -' + (isString(args[0]) ? ' ' + args.shift() : ''),
        errors = [];
      args = filter(args, function(arg) {
        if (arg instanceof Error) {
          errors.push(arg);
          return false;
        }
        return true;
      });
      each(errors, function(err) {
        args.push.call(args, err.message, '\n', err.stack);
      });
      level = logLevels[level];
      this._print(level, [msg, level, this.module].concat(args), trace);
    },
    debug: function() {
      this._log(0, slice$2.call(arguments, 0));
    },
    info: function() {
      this._log(1, slice$2.call(arguments, 0));
    },
    warn: function() {
      this._log(2, slice$2.call(arguments, 0));
    },
    error: function() {
      this._log(3, slice$2.call(arguments, 0));
    }
  });

  Logger.logger = new Logger('default', 'info');

  var _ = assign({
    LinkedList: LinkedList,
    Configuration: Configuration
  }, common, is, coll, obj, string, cls);

  return _;

}));
//# sourceMappingURL=argilo.js.map
