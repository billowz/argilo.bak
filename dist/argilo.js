(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define('argilo', ['exports'], factory) :
	(factory((global.argilo = {})));
}(this, (function (exports) { 'use strict';

	/*
	 * @Author: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Date: 2018-08-18 11:12:18
	 * @Last Modified by:   tao.zeng (tao.zeng.zt@gmail.com)
	 * @Last Modified time: 2018-08-18 11:12:18
	 */
	var __global = window || global;

	/*
	 * @Author: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Date: 2018-08-29 12:25:33
	 * @Last Modified by:   tao.zeng (tao.zeng.zt@gmail.com)
	 * @Last Modified time: 2018-08-29 12:25:33
	 */
	var CONSTRUCTOR = 'constructor';
	var PROTOTYPE = 'prototype';
	var PROTO = '__proto__';

	/*
	 * @Author: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Date: 2018-04-26 11:34:06
	 * @Last Modified by: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Last Modified time: 2018-09-07 16:47:11
	 */
	var BOOL = 'boolean',
	    FN = 'function',
	    NUM = 'number',
	    STR = 'string';
	/**
	 * o1 === o2 || NaN === NaN
	 *
	 * @param {*} o1
	 * @param {*} o2
	 */

	function eq$1(o1, o2) {
	  return o1 === o2 || o1 !== o1 && o2 !== o2;
	}
	function isNull(o) {
	  return o === null;
	}
	function isUndef(o) {
	  return o === undefined;
	}
	function isNil(o) {
	  return o === null || o === undefined;
	}
	function isFn(fn) {
	  return typeof fn === FN;
	}
	function is(o, Type) {
	  if (o === undefined || o === null) return false;
	  var c = o[CONSTRUCTOR];

	  if (Type[CONSTRUCTOR] === Array) {
	    if (c) {
	      for (var i = 0, l = Type.length; i < l; i++) {
	        if (c === Type[i]) return true;
	      }
	    } else {
	      for (var i = 0, l = Type.length; i < l; i++) {
	        if (Type[i] === Object) return true;
	      }
	    }

	    return false;
	  }

	  return c ? c === Type : Type === Object;
	} // TODO object has constructor property

	function isObj(o) {
	  if (o === undefined || o === null) return false;
	  var C = o[CONSTRUCTOR];
	  return C === undefined || C === Object;
	}

	function mkIs(Type) {
	  return function (o) {
	    return o !== undefined && o !== null && o[CONSTRUCTOR] === Type;
	  };
	}

	var isBool = mkIs(Boolean);
	var isNum = mkIs(Number);
	var isStr = mkIs(String);
	var isDate = mkIs(Date);
	var isReg = mkIs(RegExp);
	var isArray = Array.isArray || mkIs(Array);
	var isInt = function isInt(o) {
	  return o === 0 || (o ? o[CONSTRUCTOR] === Number && parseInt(o) === o.valueOf() : false);
	};
	var isTypedArray = ArrayBuffer ? ArrayBuffer.isView : function () {
	  return false;
	};
	function isArrayLike$1(o) {
	  if (o === undefined || o === null) return false;
	  var C = o[CONSTRUCTOR];

	  switch (C) {
	    case undefined:
	      break;

	    case Array:
	    case String:
	    case __global.NodeList:
	    case __global.HTMLCollection:
	    case __global.Int8Array:
	    case __global.Uint8Array:
	    case __global.Int16Array:
	    case __global.Uint16Array:
	    case __global.Int32Array:
	    case __global.Uint32Array:
	    case __global.Float32Array:
	    case __global.Float64Array:
	      return true;
	  }

	  var len = o.length;
	  return len !== undefined && typeof len === NUM && (len === 0 || len > 0 && parseInt(len) === len && len - 1 in o);
	}
	function isInstOf(obj, cls) {
	  return obj !== undefined && obj !== null && obj instanceof cls;
	}
	function isPrimitive(o) {
	  if (o === undefined || o === null) return true;

	  switch (typeof o) {
	    case BOOL:
	    case NUM:
	    case STR:
	    case FN:
	      return true;
	  }

	  return false;
	}
	var blankStrReg = /^\s*$/;
	function isBlank(o) {
	  if (!o) return true;
	  if (o[CONSTRUCTOR] === String) return blankStrReg.test(o);
	  return o.length === 0;
	}

	/*
	 * Function Util
	 * - apply
	 * - createFn
	 *
	 * @Author: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Date: 2018-04-26 11:34:39
	 * @Last Modified by: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Last Modified time: 2018-08-28 15:22:37
	 */

	function applyBuilder(max_args, scope, offset) {
	  scope = scope ? 'scope' : '';
	  offset = offset ? 'offset' : '';
	  var args = new Array(max_args + 1);
	  var cases = new Array(max_args + 1);

	  for (var i = 0; i <= max_args; i++) {
	    args[i] = (i || scope ? ', ' : '') + "args[" + (offset ? "offset" + (i ? ' + ' + i : '') : i) + "]";
	    cases[i] = "case " + i + ": return fn" + (scope && '.call') + "(" + scope + args.slice(0, i).join('') + ");";
	  }

	  return Function("return function(fn, " + (scope && scope + ', ') + "args" + (offset && ', offset, len') + "){\nswitch(" + (offset ? 'len' : 'args.length') + "){\n" + cases.join('\n') + "\n}\n" + (offset && "var arr = new Array(len);\nfor(var i=0; i<len; i++) arr[i] = arr[offset + i];") + "\nreturn fn.apply(" + (scope || 'null') + ", " + (offset ? 'arr' : 'args') + ");\n}")();
	}

	var applyScope = applyBuilder(8, 1, 0);
	var applyNoScope$1 = applyBuilder(8, 0, 0);
	var applyScopeN = applyBuilder(8, 1, 1);
	var applyNoScopeN = applyBuilder(8, 0, 1);
	function apply(fn, scope, args) {
	  switch (scope) {
	    case undefined:
	    case null:
	      return applyNoScope$1(fn, args);
	  }

	  return applyScope(fn, scope, args);
	}
	function applyN(fn, scope, args, offset, len) {
	  switch (scope) {
	    case undefined:
	    case null:
	      return applyNoScopeN(fn, args, offset, len);
	  }

	  return applyScopeN(fn, scope, args, offset, len);
	}
	function createFn(name, args, body) {
	  var l = arguments.length;

	  if (l === 1) {
	    body = name;
	    name = args = 0;
	  } else if (l === 2) {
	    body = args;

	    if (isStr(name)) {
	      args = 0;
	    } else {
	      args = name;
	      name = 0;
	    }
	  }

	  return name ? Function("return function " + name + "(" + (args ? args.join(', ') : '') + "){" + body + "}")() : applyScope(Function, Function, args ? args.concat(body) : [body]);
	}
	var varGenReg = /\$\d+$/;
	function fnName(fn) {
	  var name = fn.name;
	  return name ? name.replace(varGenReg, '') : '';
	}

	/*
	 * @Author: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Date: 2018-08-29 12:35:27
	 * @Last Modified by:   tao.zeng (tao.zeng.zt@gmail.com)
	 * @Last Modified time: 2018-08-29 12:35:27
	 */
	var funcProto = Function[PROTOTYPE];

	if (!funcProto.bind) {
	  funcProto.bind = function bind(scope) {
	    var fn = this,
	        len = arguments.length - 1;

	    if (len > 0) {
	      var args = new Array(len),
	          i = 0;

	      for (; i < len; i++) {
	        args[i] = arguments[i + 1];
	      }

	      return function () {
	        var l = arguments.length,
	            i = 0;
	        args.length = len + l;

	        for (; i < l; i++) {
	          args[len + i] = arguments[i];
	        }

	        var rs = apply(fn, scope, args);
	        l && (args.length = len);
	        return rs;
	      };
	    }

	    return function () {
	      return apply(fn, scope, arguments);
	    };
	  };
	}

	/*
	 * @Author: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Date: 2018-08-29 12:35:31
	 * @Last Modified by: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Last Modified time: 2018-09-01 11:07:38
	 */
	var QUERY_SELECTOR = 'querySelector',
	    QUERY_SELECTOR_ALL = QUERY_SELECTOR + 'All',
	    QUERY_RESULTS = '__queryResults';

	if (!document[QUERY_SELECTOR_ALL]) {
	  document[QUERY_RESULTS] = [];

	  document[QUERY_SELECTOR_ALL] = function (selector) {
	    var head = document.documentElement.firstChild,
	        styleTag = document.createElement('STYLE');
	    head.appendChild(styleTag);

	    if (styleTag.styleSheet) {
	      // for IE
	      styleTag.styleSheet.cssText = selector + ("{x:expression(document[" + QUERY_RESULTS + "].push(this))}");
	    } else {
	      // others
	      var textnode = document.createTextNode(selector + "{x:expression(document[QUERY_RESULTS].push(this))}");
	      styleTag.appendChild(textnode);
	    }

	    window.scrollBy(0, 0);
	    var ret = document[QUERY_RESULTS];
	    document[QUERY_RESULTS] = [];
	    return ret;
	  };
	}

	if (!document[QUERY_SELECTOR]) {
	  document[QUERY_SELECTOR] = function (selectors) {
	    var elements = document[QUERY_SELECTOR_ALL](selectors);
	    return elements.length ? elements[0] : null;
	  };
	}

	/*
	 * String Util
	 * @Author: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Date: 2018-04-26 18:30:18
	 * @Last Modified by: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Last Modified time: 2018-09-08 16:57:52
	 */

	var trimReg = /(^\s+)|(\s+$)/g;
	function trim$1(str) {
	  return str.replace(trimReg, '');
	}
	var firstLetterReg = /^[a-zA-Z]/;

	function upperHandler(m) {
	  return m.toUpperCase();
	}

	function upperFirst(str) {
	  return str.replace(firstLetterReg, upperHandler);
	}
	function strval(obj) {
	  return isNil(obj) ? '' : String(obj);
	}
	function charCode(str, index) {
	  if (index === void 0) {
	    index = 0;
	  }

	  return str.charCodeAt(index);
	}
	function genCharCodes(start, end) {
	  start = charCode(start);
	  end = charCode(end);
	  var codes = new Array(end - start + 1);

	  for (var i = start; i <= end; i++) {
	    codes[i - start] = start;
	  }

	  return codes;
	}

	/*
	 * @Author: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Date: 2018-07-25 15:23:22
	 * @Last Modified by: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Last Modified time: 2018-08-29 12:29:48
	 */
	var __hasOwn = Object[PROTOTYPE].hasOwnProperty;
	function hasOwnProp(obj, prop) {
	  return __hasOwn.call(obj, prop);
	}
	function getOwnProp(obj, prop, defaultVal) {
	  return obj && __hasOwn.call(obj, prop) ? obj[prop] : defaultVal;
	}

	/*
	 * @Author: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Date: 2018-08-18 11:12:57
	 * @Last Modified by: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Last Modified time: 2018-08-29 12:01:15
	 */
	var __getProto = Object.getPrototypeOf,
	    __setProto = Object.setPrototypeOf;
	var prototypeOfSupport = !!__setProto;
	var prototypeOf = __setProto ? __getProto : __getProto ? function getPrototypeOf(obj) {
	  return obj[PROTO] || __getProto(obj);
	} : function getPrototypeOf(obj) {
	  return hasOwnProp(obj, PROTO) ? obj[PROTO] : obj[CONSTRUCTOR][PROTOTYPE];
	};
	var setPrototypeOf = __setProto || function getPrototypeOf(obj, proto) {
	  return obj[PROTO] = proto;
	};

	/*
	 * @Author: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Date: 2018-07-25 15:24:51
	 * @Last Modified by: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Last Modified time: 2018-08-29 11:56:38
	 */

	function FN$1() {}

	function doCreate(parent, props) {
	  FN$1[PROTOTYPE] = parent;
	  var obj = new FN$1();
	  FN$1[PROTOTYPE] = undefined;

	  if (props) {
	    var k, v;

	    for (k in props) {
	      v = props[k];
	      if (v && v[CONSTRUCTOR] === Object) obj[k] = v.value;
	    }
	  }

	  return obj;
	}

	var create = Object.create || (Object.getPrototypeOf ? doCreate : function create(parent, props) {
	  var obj = doCreate(parent, props);
	  setPrototypeOf(obj, parent);
	  return obj;
	});

	/*
	 * @Author: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Date: 2018-08-18 11:11:27
	 * @Last Modified by:   tao.zeng (tao.zeng.zt@gmail.com)
	 * @Last Modified time: 2018-08-18 11:11:27
	 */
	var STOP$1 = new String('STOP');
	var eachArray = __mkEachArrayLike(arrayValueHandler),
	    eachStr = __mkEachArrayLike(strValueHandler),
	    reachArray = __mkREachArrayLike(arrayValueHandler),
	    reachStr = __mkREachArrayLike(strValueHandler),
	    each = __mkEach(eachStr, eachArray, eachObj),
	    reach = __mkEach(reachStr, reachArray, eachObj);
	function eachObj(obj, callback, scope, own) {
	  if (scope) callback = callback.bind(scope);
	  var key;

	  if (own === false) {
	    for (key in obj) {
	      if (callback(obj[key], key, obj) === STOP$1) return key;
	    }
	  } else {
	    for (key in obj) {
	      if (hasOwnProp(obj, key) && callback(obj[key], key, obj) === STOP$1) return key;
	    }
	  }
	}
	function __mkEach(eachStr, eachArray, eachObj) {
	  return function (obj, callback, scope, own) {
	    var arrayType = isArrayLike$1(obj);
	    return (arrayType ? arrayType === String ? eachStr : eachArray : eachObj)(obj, callback, scope, own);
	  };
	}
	function __mkEachArrayLike(valueHandler) {
	  return function (array, callback, scope) {
	    if (scope) callback = callback.bind(scope);

	    for (var i = 0, l = array.length; i < l; i++) {
	      if (callback(valueHandler(array, i), i, array) === STOP$1) return i;
	    }
	  };
	}
	function __mkREachArrayLike(valueHandler) {
	  return function (array, callback, scope) {
	    if (scope) callback = callback.bind(scope);
	    var i = array.length;

	    while (i--) {
	      if (callback(valueHandler(array, i), i, array) === STOP$1) return i;
	    }
	  };
	}

	function arrayValueHandler(array, i) {
	  return array[i];
	}

	function strValueHandler(str, i) {
	  return str.charAt(i);
	}

	function eachChain(array, v, callback, scope) {
	  if (scope) callback = callback.bind(scope);

	  for (var i = 0, l = array.length; i < l; i++) {
	    v = callback(array[i], i, v, array);
	    if (v === STOP$1) return STOP$1;
	  }

	  return v;
	}

	/*
	 * @Author: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Date: 2018-08-18 11:12:45
	 * @Last Modified by: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Last Modified time: 2018-08-29 12:29:34
	 */
	var SKIP = new String('SKIP');
	var mapArray = __mkMapArrayLike(eachArray),
	    mapStr = __mkMapArrayLike(eachStr),
	    mapObj = __mkMapObj(eachObj),
	    map = __mkEach(mapStr, mapArray, mapObj);
	function __mkMapArrayLike(each$$1) {
	  return function (array, callback, scope) {
	    var l = array.length,
	        copy = new Array(l);
	    var j = 0;
	    if (!callback) callback = defaultMapCallback;else if (scope) callback = callback.bind(scope);
	    each$$1(array, function (val, i, array) {
	      var ret = callback(val, i, array);
	      if (ret === STOP$1 || ret === SKIP) return ret;
	      copy[j++] = ret;
	    });
	    if (j !== l) copy.length = j;
	    return copy;
	  };
	}
	function __mkMapObj(each$$1) {
	  return function (obj, callback, scope, own) {
	    var copy = create(null);
	    if (!callback) callback = defaultMapCallback;else if (scope) callback = callback.bind(scope);
	    each$$1(obj, function (val, key, obj) {
	      var ret = callback(val, key, obj);
	      if (ret === STOP$1 || ret === SKIP) return ret;
	      copy[key] = ret;
	    }, undefined, own);
	    return copy;
	  };
	}

	function defaultMapCallback(v) {
	  return v;
	}

	var REG_ESCAPE = /[-\/\\^$*+?.()|[\]{}]/g;
	function reEscape(s) {
	  return s.replace(REG_ESCAPE, '\\$&');
	}
	function reUnion(regexps) {
	  if (!regexps.length) return '(?!)';
	  return "(?:" + mapArray(regexps, function (s) {
	    return "(?:" + s + ")";
	  }).join('|') + ")";
	}
	var regStickySupport = isBool(/(?:)/.sticky);
	var regUnicodeSupport = isBool(/(?:)/.unicode);

	/*
	 * @Author: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Date: 2018-08-18 11:13:03
	 * @Last Modified by: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Last Modified time: 2018-10-29 18:10:39
	 */
	function array2obj(array, keyHandler, valueHandler) {
	  if (valueHandler === void 0) {
	    valueHandler = arrayElementHandler;
	  }

	  var dist = create(null);

	  for (var i = 0, l = array.length, v; i < l; i++) {
	    v = array[i];
	    dist[keyHandler(v, i, array)] = valueHandler(v, i, array);
	  }

	  return dist;
	}
	function makeMap(props, split, val) {
	  var arglen = arguments.length;

	  if (arglen < 3) {
	    if (arglen === 2) {
	      val = split;
	    } else {
	      val = true;
	    }

	    split = ',';
	  }

	  if (isStr(props)) {
	    if (!props) return create(null);
	    props = props.split(split);
	  }

	  var valueHandler = isFn(val) ? val : function () {
	    return val;
	  };
	  return array2obj(props, arrayElementHandler, valueHandler);
	}

	function arrayElementHandler(v) {
	  return v;
	}

	function makeArray(array, split, map) {
	  var arglen = arguments.length;

	  if (arglen < 3) {
	    if (arglen === 2) map = split;
	    split = ',';
	  }

	  if (isStr(array)) {
	    if (!array) return [];
	    array = array.split(split);
	  }

	  if (map) for (var i = 0, l = array.length; i < l; i++) {
	    array[i] = map(array[i], i);
	  }
	  return array;
	}
	function cached(cacheKey, cacheVal) {
	  var cache = create(null);
	  return function () {
	    var key = applyNoScope(cacheKey, arguments);
	    var val = cache[key];
	    if (!val) cache[key] = val = applyNoScope(cacheVal, arguments);
	    return val;
	  };
	}

	var toStr = Object.prototype.toString;
	var conditions = {};
	var UNDEF = 'undefined',
	    NUL = 'null',
	    INF = 'Infinity',
	    ARR = 'Array';
	var byteArray = ['Uint8Array', 'Int8Array'];
	var shortArray = ['Uint16Array', 'Int16Array'];
	var intArray = ['Uint32Array', 'Int32Array'];
	var floatArray = ['Float32Array', 'Float64Array'];
	var arrayBuffer = 'ArrayBuffer';
	var typedArrays = byteArray.concat(shortArray).concat(intArray).concat(floatArray).concat(arrayBuffer);
	addTypeCon({
	  bool: 'Boolean',
	  num: 'Number',
	  str: 'String',
	  fn: 'Function',
	  date: 'Date',
	  reg: 'RegExp',
	  obj: 'Object',
	  err: 'Error',
	  array: ARR,
	  arrayLike: [[ARR, 'Arguments', 'NodeList'].concat(typedArrays)],
	  byteArray: [byteArray],
	  shortArray: [shortArray],
	  intArray: [intArray],
	  floatArray: [floatArray],
	  typedArrays: [typedArrays]
	});
	each$1(typedArrays, function (t) {
	  return addTypeCon(reFirst(t), t);
	});
	addValueCon({
	  nil: [[UNDEF, NUL]],
	  nul: NUL,
	  def: [UNDEF, 1, 1],
	  undef: [UNDEF, 0, 1],
	  NaN: ['o', 1],
	  infinite: [INF, 0, 1]
	});
	addCon({
	  finite: [['o'], function (o) {
	    return o === o && o !== Infinity && toStr.call(o) === '[object Number]';
	  }],
	  eq: [['a', 'b'], function (a, b) {
	    return a === b || a !== a && b !== b;
	  }],
	  notEq: [['a', 'b'], function (a, b) {
	    return a !== b && (a === a || b === b);
	  }]
	});

	function addTypeCon(name, values, notEq, notMakeNot) {
	  _addCon(arguments, addTypeCon, function () {
	    return addEqCon(name, [toStr], ['o'], '$0.call(o)', map$1(arrayVal(values), function (v) {
	      return '\'[object ' + v + ']\'';
	    }), notEq, notMakeNot);
	  });
	}

	function addValueCon(name, values, notEq, notMakeNot) {
	  _addCon(arguments, addValueCon, function () {
	    return addEqCon(name, undefined, ['o'], 'o', values, notEq, notMakeNot);
	  });
	}

	function _addCon(args, thisCb, cb) {
	  args.length === 1 ? each$1(args[0], function (v, n) {
	    return thisCb.apply(null, [n].concat(v));
	  }) : cb();
	}

	function addEqCon(name) {
	  var injects = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
	  var args = arguments[2];
	  var conCode = arguments[3];
	  var values = arguments[4];
	  var notEq = arguments[5];
	  var notMakeNot = arguments[6];
	  values = arrayVal(values);
	  var params = map$1(injects, function (v, i) {
	    return '$' + i;
	  });
	  params.push('return function(' + args.join(',') + '){\n' + (values.length > 1 ? 'switch(' + conCode + '){\ncase ' + values.join(':\n\t\tcase ') + ': return ' + !notEq + ';\ndefault: return ' + !!notEq + ';\n}' : 'return (' + conCode + ')' + (notEq ? '!' : '=') + '==' + values[0] + ';') + '\n    }');
	  addCon(name, args, Function.apply(Function, params).apply(null, injects));
	  if (!notMakeNot) addEqCon('not' + reFirst(name, 1), injects, args, conCode, values, !notEq, 1);
	}

	function addCon(name, args, fn) {
	  if (arguments.length === 1) each$1(name, function (v, n) {
	    conditions[n] = v;
	  });else conditions[name] = [args, fn];
	}

	function _if(condition, callback, isNot) {
	  var args = condition[0];
	  return new Function('condition', 'callback', 'slice', 'return function(' + args.join(',') + '){\nif(' + (isNot ? '!' : '') + 'condition(' + args.join(',') + '))\n    callback(slice(arguments, ' + args.length + '));\n}')(condition[1], callback, sliceArgs);
	}

	function assignCons(obj, callback, isNot) {
	  for (var name in conditions) {
	    obj[name] = _if(conditions[name], callback, isNot);
	  }

	  return obj;
	}

	function callBy(condition, cb) {
	  var len = arguments.length;
	  if (len > 1) condition && cb();else if (len) condition();
	}

	function exception(error) {
	  if (typeof error === 'function') error = error();
	  if (error instanceof Error) throw error;
	  throw new Error(error);
	}

	function assert(condition, error) {
	  if (!condition) exception(error);
	}

	assignCons(assert, function (args) {
	  return exception(args[0]);
	}, 1);
	assert.by = callBy;
	var currentLevel = 1;
	var logs = [];
	var debug = createLog('debug', 0);
	var info = createLog('info', 1);
	var warn = createLog('warn', 2);
	var error = createLog('error', 3);

	function createLog(name, level) {
	  function log() {
	    level >= currentLevel && log.print.apply(this, arguments);
	  }

	  log.level = level;
	  log.methods = getLogMethods(name, log);
	  logs[level] = log;
	  return bindLog(log);
	}

	function getLogMethods(name, log) {
	  var mark = '[' + name + ']: ';
	  return assignCons({
	    by: callBy,
	    when: function when(condition) {
	      condition && log.print.apply(log, sliceArgs(arguments, 1));
	    },
	    print: function print(msg) {
	      if (arguments.length) {
	        var args = map$1(arguments, function (v) {
	          return v;
	        });

	        if (typeof msg === 'string') {
	          args[0] = mark + args[0];
	        } else {
	          args.unshift(mark);
	        }

	        log.__print(args, name);
	      }
	    }
	  }, function (args) {
	    return log.print.apply(log, args);
	  });
	}

	function empty() {}

	function bindLog(log) {
	  var level = log.level,
	      methods = log.methods;

	  for (var method in methods) {
	    log[method] = level < currentLevel ? empty : methods[method];
	  }

	  return log;
	}

	function setLogConsole(console, applyArgs) {
	  each$1(logs, function (log) {
	    log.__print = applyArgs ? function (args, name) {
	      console[name].apply(console, args);
	    } : function (args, name) {
	      return console[name](args, name);
	    };
	  });
	}

	if (!console) console = {
	  log: function log() {}
	};
	if (!console.info) console.info = console.log;
	setLogConsole(console, 1);

	function sliceArgs(args, offset) {
	  var len = args.length;
	  var arr = new Array(len - offset);

	  while (len-- > offset) {
	    arr[len - offset] = args[len];
	  }

	  return arr;
	}

	function each$1(obj, cb) {
	  if (obj instanceof Array) {
	    var i = obj.length;

	    while (i--) {
	      cb(obj[i], i);
	    }
	  } else {
	    for (var key in obj) {
	      cb(obj[key], key);
	    }
	  }
	}

	function map$1(arr, cb) {
	  var i = arr.length,
	      ret = new Array(i);

	  while (i--) {
	    ret[i] = cb(arr[i], i);
	  }

	  return ret;
	}

	function reFirst(str, upper) {
	  return str.replace(/^[a-zA-Z]/, upper ? function (o) {
	    return o.toUpperCase();
	  } : function (o) {
	    return o.toLowerCase();
	  });
	}

	function arrayVal(val) {
	  return val instanceof Array ? val : [val];
	}

	/*
	 * @Author: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Date: 2018-08-29 11:52:21
	 * @Last Modified by:   tao.zeng (tao.zeng.zt@gmail.com)
	 * @Last Modified time: 2018-08-29 11:52:21
	 */
	var __defProp = Object.defineProperty;
	var defPropSupport = __defProp && function () {
	  try {
	    var val,
	        obj = {};

	    __defProp(obj, 's', {
	      get: function get() {
	        return val;
	      },
	      set: function set(value) {
	        val = value;
	      }
	    });

	    obj.s = 1;
	    return obj.s === val;
	  } catch (e) {}
	}();

	if (!defPropSupport) {
	  __defProp = function __defProp(obj, prop, desc) {
	    assert(desc.get || desc.set, 'not support getter/setter on defineProperty');
	    obj[prop] = desc.value;
	    return obj;
	  };
	}

	var defProp = __defProp;
	var defPropValue = defPropSupport ? function (obj, prop, value, configurable, writeable, enumerable) {
	  __defProp(obj, prop, {
	    value: value,
	    configurable: configurable || false,
	    writeable: writeable || false,
	    enumerable: enumerable || false
	  });

	  return value;
	} : function (obj, prop, value) {
	  obj[prop] = value;
	  return value;
	};

	/*
	 * @Author: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Date: 2018-07-25 15:42:57
	 * @Last Modified by: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Last Modified time: 2018-08-29 12:25:44
	 */
	function __assign(dist, overrides, offset, filter, data) {
	  if (offset === void 0) {
	    offset = 0;
	  }

	  if (!dist) dist = {};
	  var i = offset,
	      l = overrides.length,
	      override,
	      prop;

	  for (; i < l; i++) {
	    if (override = overrides[i]) for (prop in override) {
	      if (filter(prop, dist, override, data)) dist[prop] = override[prop];
	    }
	  }

	  return dist;
	}
	function assign(obj) {
	  return __assign(obj, arguments, 1, __assignFilter);
	}
	function __assignFilter(prop, dist, override) {
	  return hasOwnProp(override, prop);
	}
	function assignIf(obj) {
	  return __assign(obj, arguments, 1, __assignIfFilter);
	}
	function __assignIfFilter(prop, dist, override) {
	  return hasOwnProp(override, prop) && !hasOwnProp(dist, prop);
	}
	function assignBy(obj, filter) {
	  return __assign(obj, arguments, 2, __assignUserFilter, filter);
	}
	function __assignUserFilter(prop, dist, override, cb) {
	  return hasOwnProp(override, prop) && cb(prop, dist, override);
	}

	/*
	 * @Author: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Date: 2018-08-18 11:11:47
	 * @Last Modified by: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Last Modified time: 2018-08-29 11:57:11
	 */
	function __extend(cls, mixins, offset, filter, data) {
	  assert.fn(cls, 'Invalid Class');

	  __assign(cls[PROTOTYPE], mixins, offset, filter, data);

	  return cls;
	}
	function extend(cls) {
	  return __extend(cls, arguments, 1, __extendFilter);
	}
	function __extendFilter(prop, proto, mixin) {
	  return prop !== CONSTRUCTOR;
	}
	function extendIf(cls) {
	  return __extend(cls, arguments, 1, __extendIfFilter);
	}
	function __extendIfFilter(prop, proto, mixin) {
	  return prop !== CONSTRUCTOR && !(prop in proto);
	}
	function extendBy(cls, filter) {
	  return __extend(cls, arguments, 2, __extendUserFilter, filter);
	}
	function __extendUserFilter(prop, proto, mixin, cb) {
	  return prop !== CONSTRUCTOR && cb(prop, proto, mixin);
	}

	/*
	 * @Author: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Date: 2018-08-18 11:12:32
	 * @Last Modified by: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Last Modified time: 2018-09-04 18:06:01
	 */
	function __inherit(cls, superCls) {
	  var proto = create(superCls[PROTOTYPE]);
	  proto[CONSTRUCTOR] = cls;
	  cls[PROTOTYPE] = proto;
	  setPrototypeOf(cls, superCls);
	}
	function inherit(cls, superCls) {
	  assert.fn(cls, 'Invalid Class');
	  var i = 2;
	  if (isFn(superCls)) __inherit(cls, superCls);else i = 1;

	  __extend(cls, arguments, i, __extendFilter);

	  return cls;
	}
	var fnProto = Function[PROTOTYPE];
	var objProto = Object[PROTOTYPE];
	function superCls(cls) {
	  cls = prototypeOf(cls);

	  switch (cls) {
	    case Object:
	    case objProto:
	    case fnProto:
	      return undefined;
	  }

	  return cls;
	}
	function subclassOf(cls, target) {
	  if (target === Object) return true;
	  var parent = cls;

	  while (parent = superCls(parent)) {
	    if (parent === target) return true;
	  }

	  return false;
	}

	/*
	 * @Author: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Date: 2018-08-18 11:11:07
	 * @Last Modified by: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Last Modified time: 2018-08-29 12:27:21
	 */
	var CLASS_NAME = 'name',
	    EXTEND = 'extend',
	    STATICS = 'statics';
	var KEYS = makeMap([CLASS_NAME, CONSTRUCTOR, EXTEND, STATICS, PROTOTYPE]);
	function createClass(overrides) {
	  var constructor = getOwnProp(overrides, CONSTRUCTOR);
	  var superCls$$1 = overrides[EXTEND];
	  assert(!constructor || isFn(constructor), 'Invalid Constructor');
	  assert(!superCls$$1 || isFn(superCls$$1), 'Invalid Super Class');
	  if (superCls$$1 === Object) superCls$$1 = null;
	  var C = buildCls(constructor, overrides[CLASS_NAME], superCls$$1);
	  if (superCls$$1) __inherit(C, superCls$$1);
	  extendBy(C, keyFilter, overrides);
	  extend(C, overrides[PROTOTYPE]);
	  assign(C, overrides[STATICS]);
	  return C;
	}

	function buildCls(cls, name, superCls$$1) {
	  if (name) return new Function('apply', 'S', "return function " + name + "(){\n    " + (cls || superCls$$1 ? "apply(S, this, arguments);" : '') + "\n}")(applyScope, cls || superCls$$1);
	  return cls || (superCls$$1 ? function () {
	    applyScope(superCls$$1, this, arguments);
	  } : function () {});
	}

	function keyFilter(prop) {
	  return !KEYS[prop];
	}

	/*
	 * @Author: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Date: 2018-08-18 11:11:54
	 * @Last Modified by: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Last Modified time: 2018-08-29 12:28:29
	 */
	var filterArray = __mkFilter(mapArray),
	    filterStr = __mkFilter(mapStr),
	    filterObj = __mkFilter(mapObj),
	    filter = __mkFilter(map);
	function __mkFilter(map$$1) {
	  return function (obj, callback, scope, own) {
	    if (scope) callback = callback.bind(scope);
	    return map$$1(obj, function (val, index, obj) {
	      var ret = callback(val, index, obj);
	      if (ret === STOP$1 || ret === SKIP) return ret;
	      return ret ? val : SKIP;
	    }, undefined, own);
	  };
	}

	/*
	 * @Author: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Date: 2018-08-18 11:11:59
	 * @Last Modified by:   tao.zeng (tao.zeng.zt@gmail.com)
	 * @Last Modified time: 2018-08-18 11:11:59
	 */
	var findArray = __mkFind(eachArray),
	    findStr = __mkFind(eachStr),
	    findObj = __mkFind(eachObj),
	    find = __mkFind(each),
	    rfindStr = __mkFind(reachStr),
	    rfind = __mkFind(reach);
	function __mkFind(each$$1) {
	  return function (obj, callback, scope, own) {
	    if (scope) callback = callback.bind(scope);
	    return each$$1(obj, function (val, index, obj) {
	      if (callback(val, index, obj)) return STOP$1;
	    }, undefined, own);
	  };
	}

	/*
	 * @Author: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Date: 2018-08-18 11:12:29
	 * @Last Modified by:   tao.zeng (tao.zeng.zt@gmail.com)
	 * @Last Modified time: 2018-08-18 11:12:29
	 */
	var indexOfArray = __mkTypeIndexOf(eachArray),
	    indexOfObj = __mkTypeIndexOf(eachObj),
	    lastIndexOfArray = __mkTypeIndexOf(reachArray),
	    indexOf = __mkIndexOf(indexOfArray, 'indexOf'),
	    lastIndexOf = __mkIndexOf(lastIndexOfArray, 'lastIndexOf');
	function __mkTypeIndexOf(each$$1) {
	  return function (obj, val, own) {
	    return each$$1(obj, function (v, index, obj) {
	      if (eq(v, val)) return STOP;
	    }, undefined, own);
	  };
	}
	function __mkIndexOf(indexOfArray, strIndexOf) {
	  return function (obj, val, own) {
	    var arrayType = isArrayLike(obj);

	    if (arrayType === String) {
	      var i = obj[strIndexOf](val);
	      if (i >= 0) return i;
	    } else {
	      return (arrayType ? indexOfArray : indexOfObj)(obj, val, own);
	    }
	  };
	}

	/*
	 * @Author: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Date: 2018-08-18 11:12:49
	 * @Last Modified by: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Last Modified time: 2018-09-10 11:37:20
	 */
	function obj2array(obj, valueHandler, scope, own) {
	  var array = [];
	  var key,
	      ret,
	      i = 0;
	  if (scope) valueHandler = valueHandler.bind(scope);

	  if (own === false) {
	    for (key in obj) {
	      ret = valueHandler(obj, key);
	      if (ret === STOP$1) break;
	      if (ret !== SKIP) array[i++] = ret;
	    }
	  } else {
	    for (key in obj) {
	      if (hasOwnProp(obj, key)) {
	        ret = valueHandler(obj, key, i);
	        if (ret === STOP$1) break;
	        if (ret !== SKIP) array[i++] = ret;
	      }
	    }
	  }

	  return array;
	}
	var keys = __mkKV(obj2array, keyHandler),
	    values = __mkKV(obj2array, valueHandler);
	function __mkKV(obj2array, handler) {
	  return function (obj, own, filter, scope) {
	    if (filter) {
	      if (scope) filter = filter.bind(scope);
	      return obj2array(obj, function (obj, key) {
	        var ret = filter(obj, key);
	        if (!ret) return SKIP;
	        if (ret === STOP$1 || ret === SKIP) return ret;
	        return handler(obj, key);
	      }, undefined, own);
	    }

	    return obj2array(obj, handler, undefined, own);
	  };
	}

	function keyHandler(obj, key) {
	  return key;
	}

	function valueHandler(obj, key) {
	  return obj[key];
	}

	/*
	 * @Author: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Date: 2018-08-18 11:12:25
	 * @Last Modified by: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Last Modified time: 2018-09-17 15:48:55
	 */

	/*
	 * Double Linked List
	 *
	 * @Author: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Date: 2018-07-23 16:07:38
	 * @Last Modified by: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Last Modified time: 2018-09-06 14:21:28
	 */
	var DEFAULT_BINDING = '__list__';
	function List(binding) {
	  this.binding = binding || DEFAULT_BINDING;
	}
	defPropValue(List, 'binding', DEFAULT_BINDING);
	inherit(List, {
	  length: 0,
	  has: function has(obj) {
	    var node = obj[this.binding];
	    return node ? node[0] === obj && node[3] === this : false;
	  },
	  add: function add(obj) {
	    return __insert(this, obj, this.tail);
	  },
	  addFirst: function addFirst(obj) {
	    return __insert(this, obj);
	  },
	  insertAfter: function insertAfter(obj, target) {
	    return __insert(this, obj, target && __getNode(this, target));
	  },
	  insertBefore: function insertBefore(obj, target) {
	    return __insert(this, obj, target && __getNode(this, target)[1]);
	  },
	  addAll: function addAll(objs) {
	    return __insertAll(this, objs, this.tail);
	  },
	  addFirstAll: function addFirstAll(objs) {
	    return __insertAll(this, objs);
	  },
	  insertAfterAll: function insertAfterAll(objs, target) {
	    return __insertAll(this, objs, target && __getNode(this, target));
	  },
	  insertBeforeAll: function insertBeforeAll(objs, target) {
	    return __insertAll(this, objs, target && __getNode(this, target)[1]);
	  },
	  prev: function prev(obj) {
	    return __siblingObj(this, obj, 1);
	  },
	  next: function next(obj) {
	    return __siblingObj(this, obj, 2);
	  },
	  first: function first() {
	    var node = this.head;
	    return node && node[0];
	  },
	  last: function last() {
	    var node = this.tail;
	    return node && node[0];
	  },
	  remove: function remove(obj) {
	    var node = __getNode(this, obj);

	    if (this.scaning) {
	      var lazyRemoves = this.lazyRemoves;
	      obj[this.binding] = undefined; // unbind list node

	      node[3] = undefined;

	      if (lazyRemoves) {
	        lazyRemoves.push(node);
	      } else {
	        this.lazyRemoves = [node];
	      }
	    } else {
	      __remove(this, node);
	    }

	    return --this.length;
	  },
	  each: function each$$1(cb, scope) {
	    assert(!this.scaning, 'Recursive calls are not allowed.');
	    this.scaning = true;
	    if (scope) cb = cb.bind(scope);
	    var node = this.head;

	    while (node) {
	      if (node[3] === this && cb(node[0]) === false) break;
	      node = node[2];
	    }

	    __doLazyRemove(this);

	    this.scaning = false;
	  },
	  toArray: function toArray() {
	    var array = new Array(this.length);
	    var node = this.head,
	        i = 0;

	    while (node) {
	      if (node[3] === this) array[i++] = node[0];
	      node = node[2];
	    }

	    return array;
	  },
	  clean: function clean() {
	    if (this.length) {
	      if (this.scaning) {
	        var binding = this.binding;
	        var lazyRemoves = this.lazyRemoves || (this.lazyRemoves = []);
	        var node = this.head;

	        while (node) {
	          if (node[3] === this) {
	            node[0][binding] = undefined;
	            lazyRemoves.push(node);
	          }

	          node = node[2];
	        }

	        this.length = 0;
	      } else {
	        __clean(this);
	      }
	    }
	  },
	  clone: function clone(cb, scope) {
	    var newlist = new List(this.binding);

	    if (this.length) {
	      if (scope) cb = cb.bind(scope);
	      var node = this.head,
	          newtail,
	          newhead,
	          newprev = undefined,
	          i = 0;

	      while (node) {
	        if (node[3] === this && (newtail = cb(node[0]))) {
	          newtail = __initNode(newlist, newtail);
	          assert(!newtail[3], 'Double add List, Clone Callback should return a new Object');
	          newtail[3] = newlist;

	          if (newprev) {
	            newtail[1] = newprev;
	            newprev[2] = newtail;
	            newprev = newtail;
	          } else {
	            newprev = newhead = newtail;
	          }

	          i++;
	        }

	        node = node[2];
	      }

	      i && __doInsert(newlist, newhead, newtail, i);
	    }

	    return newlist;
	  }
	});

	function __doInsert(list, nodeHead, nodeTail, len, prev) {
	  var next;
	  nodeHead[1] = prev;

	  if (prev) {
	    nodeTail[2] = next = prev[2];
	    prev[2] = nodeHead;
	  } else {
	    nodeTail[2] = next = list.head;
	    list.head = nodeHead;
	  }

	  if (next) next[1] = nodeTail;else list.tail = nodeTail;
	  return list.length += len;
	}

	function __insert(list, obj, prev) {
	  var node = __initNode(list, obj);

	  if (!node[3]) {
	    node[3] = list;
	    return __doInsert(list, node, node, 1, prev);
	  }
	}

	function __insertAll(list, objs, prev) {
	  var l = objs.length;
	  if (!l) return;

	  var head = __initNode(list, objs[0]);

	  assert(!head[3], 'Double add List, Object have added in this List');
	  head[3] = list;
	  var __prev = head,
	      tail = head,
	      i = 1;

	  for (; i < l; i++) {
	    tail = __initNode(list, objs[i]);
	    assert(!tail[3], 'Double add List, Object have added in this List');
	    tail[3] = list;
	    tail[1] = __prev;
	    __prev[2] = tail;
	    __prev = tail;
	  }

	  return __doInsert(list, head, tail, l, prev);
	}

	function __initNode(list, obj) {
	  var binding = list.binding;
	  var node = obj[binding];

	  if (node && node[0] === obj) {
	    assert(!node[3] || node[3] === list, 'Double add List, Object is still in other List');
	  } else {
	    node = defPropValue(obj, binding, [obj], true, true);
	  }

	  return node;
	}

	function __getNode(list, obj) {
	  var node = obj[list.binding];

	  if (node && node[0] === obj) {
	    assert(node[3] === list, 'Object is not in this List');
	    return node;
	  }

	  assert(0, 'Object is not in List');
	}

	function __siblingObj(list, obj, key) {
	  var node = __getNode(list, obj);

	  var sibling = node[key];

	  if (sibling) {
	    while (!sibling[3]) {
	      sibling = sibling[key];
	      if (!sibling) return;
	    }

	    return sibling[0];
	  }
	}

	function __remove(list, node) {
	  var prev = node[1],
	      next = node[2];

	  if (prev) {
	    prev[2] = next;
	  } else {
	    list.head = next;
	  }

	  if (next) {
	    next[1] = prev;
	  } else {
	    list.tail = prev;
	  }

	  node.length = 1;
	}

	function __clean(list) {
	  var node,
	      next = list.head;

	  while (node = next) {
	    next = node[2];
	    node.length = 1;
	  }

	  list.head = undefined;
	  list.tail = undefined;
	  list.length = 0;
	}

	function __doLazyRemove(list) {
	  var lazyRemoves = list.lazyRemoves;

	  if (lazyRemoves) {
	    var len = lazyRemoves.length;

	    if (len) {
	      if (list.length) {
	        while (len--) {
	          __remove(list, lazyRemoves[len]);
	        }
	      } else {
	        __clean(list);
	      }

	      lazyRemoves.length = 0;
	    }
	  }
	}

	/*
	 * Function List
	 *
	 * @Author: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Date: 2018-08-20 17:59:11
	 * @Last Modified by: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Last Modified time: 2018-09-06 13:57:17
	 */
	var DEFAULT_FN_BINDING = '__id__';
	var DEFAULT_SCOPE_BINDING = '__id__';
	function FnList(fnBinding, scopeBinding) {
	  this.nodeMap = create(null);
	  this.list = new List();
	  this.fnBinding = fnBinding || DEFAULT_FN_BINDING;
	  this.scopeBinding = scopeBinding || DEFAULT_SCOPE_BINDING;
	}
	defPropValue(FnList, 'fnBinding', DEFAULT_FN_BINDING);
	defPropValue(FnList, 'scopeBinding', DEFAULT_FN_BINDING);
	inherit(FnList, {
	  add: function add(fn, scope, data) {
	    assert.fn(fn, 'fn is not a Function.');
	    scope = parseScope(scope);
	    var list = this.list,
	        nodeMap = this.nodeMap;
	    var id = nodeId(fn, scope, this);
	    var node = nodeMap[id];

	    if (!node) {
	      node = [id, fn, scope, data];
	      var ret = list.add(node);
	      if (ret) nodeMap[id] = node;
	      return ret;
	    }
	  },
	  remove: function remove(fn, scope) {
	    assert.fn(fn, 'fn is not a Function.');
	    var list = this.list,
	        nodeMap = this.nodeMap;
	    var id = nodeId(fn, parseScope(scope), this);
	    var node = nodeMap[id];

	    if (node) {
	      nodeMap[id] = undefined;
	      return list.remove(node);
	    }

	    return false;
	  },
	  has: function has(fn, scope) {
	    assert.fn(fn, 'fn is not a Function.');
	    return !!this.nodeMap[nodeId(fn, parseScope(scope), this)];
	  },
	  size: function size() {
	    return this.list.length;
	  },
	  clean: function clean() {
	    this.nodeMap = create(null);
	    this.list.clean();
	  },
	  each: function each$$1(cb, scope) {
	    assert.fn(cb, 'callback is not a Function.');
	    if (scope) cb = cb.bind(scope);
	    this.list.each(function (node) {
	      return cb(node[1], node[2], node[3]);
	    });
	  }
	});
	var DEFAULT_SCOPE_ID = 1;
	var scopeIdGenerator = 1,
	    fnIdGenerator = 0;

	function nodeId(fn, scope, list) {
	  var fnBinding = list.fnBinding,
	      scopeBinding = list.scopeBinding;
	  var fnId = fn[fnBinding],
	      scopeId = scope ? scope[scopeBinding] : DEFAULT_SCOPE_ID;
	  if (!fnId) fnId = defPropValue(fn, fnBinding, ++fnIdGenerator);
	  if (!scopeId) scopeId = defPropValue(scope, scopeBinding, ++scopeIdGenerator);
	  return fnId + "&" + scopeId;
	}

	function parseScope(scope) {
	  return !scope ? undefined : scope;
	}

	/*
	 * @Author: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Date: 2018-08-20 17:59:58
	 * @Last Modified by:   tao.zeng (tao.zeng.zt@gmail.com)
	 * @Last Modified time: 2018-08-20 17:59:58
	 */
	var ticks = new FnList();
	var pending = false;
	var next;

	function executeTick(fn, scope) {
	  scope ? fn.call(scope) : fn();
	}

	function flush() {
	  ticks.each(executeTick);
	  ticks.clean();
	  pending = false;
	}

	if (typeof MutationObserver === 'function') {
	  // chrome18+, safari6+, firefox14+,ie11+,opera15
	  var counter = 0,
	      observer = new MutationObserver(flush),
	      textNode = document.createTextNode(counter);
	  observer.observe(textNode, {
	    characterData: true
	  });

	  next = function next() {
	    textNode.data = counter = counter ? 0 : 1;
	  };
	} else {
	  next = function next() {
	    setTimeout(flush, 0);
	  };
	}

	function nextTick(fn, scope) {
	  ticks.add(fn, scope);

	  if (!pending) {
	    pending = true;
	    next();
	  }
	}
	function clearTick(fn, scope) {
	  ticks.remove(fn, scope);
	}

	/*
	 * String format
	 *
	 * @Author: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Date: 2018-07-25 14:57:08
	 * @Last Modified by: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Last Modified time: 2018-11-05 15:57:16
	 */
	var STR_ESCAPE_MAP = {
	  '\n': '\\n',
	  '\t': '\\t',
	  '\f': '\\f',
	  '"': '\\"'
	},
	    STR_ESCAPE = /[\n\t\f"]/g;
	function escapeString(str) {
	  return str.replace(STR_ESCAPE, function (str) {
	    return STR_ESCAPE_MAP[str];
	  });
	}
	function pad(str, len, chr, leftAlign) {
	  str = String(str);
	  var l = str.length;
	  if (l >= len) return str;
	  var padding = new Array(len - l + 1).join(chr || ' ');
	  return leftAlign ? str + padding : padding + str;
	}

	function replacor(regs) {
	  return function (str) {
	    for (var i = 0, reg; i < 4; i++) {
	      reg = regs[i];
	      if (reg[0].test(str)) return str.replace(reg[0], reg[1]);
	    }

	    return str;
	  };
	}

	var plural = replacor([[/([a-zA-Z]+[^aeiou])y$/, '$1ies'], [/([a-zA-Z]+[aeiou]y)$/, '$1s'], [/([a-zA-Z]+[sxzh])$/, '$1es'], [/([a-zA-Z]+[^sxzhy])$/, '$1s']]);
	var singular = replacor([[/([a-zA-Z]+[^aeiou])ies$/, '$1y'], [/([a-zA-Z]+[aeiou])s$/, '$1'], [/([a-zA-Z]+[sxzh])es$/, '$1'], [/([a-zA-Z]+[^sxzhy])s$/, '$1']]);
	var thousandSeparationReg = /(\d)(?=(\d{3})+(?!\d))/g;
	function thousandSeparate(number) {
	  var split = (number + '').split('.');
	  split[0] = split[0].replace(thousandSeparationReg, '$1,');
	  return split.join('.');
	} // ========================== formatter ===========================
	// [index]    [flags]   [min-width]       [precision]         type
	// index$|$   ,-+#0     width|index$|*|$  .width|.index$|*|$  %sfducboxXeEgGpP

	var formatReg = /%(\d+\$|\*|\$)?([-+#0, ]*)?(\d+\$?|\*|\$)?(\.\d+\$?|\.\*|\.\$)?([%sfducboxXeEgGpP])/g;
	var slice = Array[PROTOTYPE].slice;

	function _format(str, args) {
	  var index = 0; // for min-width & precision

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
	  } // for index


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
	        prefix,
	        base,
	        c,
	        i,
	        j;

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
	        value = +value;
	        value = isNaN(value) || !isFinite(value) ? '' : String.fromCharCode(value);
	        if (value.length < minWidth) value = pad(value, minWidth, zeroPad ? '0' : ' ', leftJustify);
	        return value;

	      case 's':
	        if (value === undefined || value === null || typeof value === 'number' && (isNaN(value) || !isFinite(value))) {
	          value = '';
	        } else {
	          value += '';
	          if (precision && value.length > precision) value = value.slice(0, precision);
	        }

	        if (value.length < minWidth) value = pad(value, minWidth, zeroPad ? '0' : ' ', leftJustify);
	        return value;

	      case 'd':
	        value = parseInt(value);

	        if (isNaN(value) || !isFinite(value)) {
	          value = '';
	          prefix = positivePrefix;
	        } else {
	          if (value < 0) {
	            prefix = '-';
	            value = -value;
	          } else {
	            prefix = positivePrefix;
	          }

	          value += '';
	        }

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

	          if (isNaN(_number) || !isFinite(value)) {
	            _number = '';
	          } else {
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
	    format: str,
	    // format result
	    count: index // format param count

	  };
	}

	function format(str) {
	  return _format(str, slice.call(arguments, 1)).format;
	}
	format.format = _format;

	/*
	 * property path
	 *
	 * @Author: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Date: 2018-08-20 18:00:02
	 * @Last Modified by:   tao.zeng (tao.zeng.zt@gmail.com)
	 * @Last Modified time: 2018-08-20 18:00:02
	 */
	var pathCache = create(null),
	    pathReg = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g,
	    escapeCharReg = /\\(\\)?/g,
	    formatReg$1 = /(?:\.|^)([^a-zA-Z_$][^.]*)/g;
	function parsePath(path, cache) {
	  if (isArray(path)) return path;
	  assert.str(path, "Require path[Array | String]");
	  var rs = pathCache[path];

	  if (!rs) {
	    rs = [];
	    if (cache !== false) pathCache[path] = rs;
	    path.replace(pathReg, function (match, number, quote, string) {
	      rs.push(quote ? string.replace(escapeCharReg, '$1') : number || match);
	    });
	  }

	  return rs.slice();
	}
	function formatPath(path) {
	  if (isArray(path)) return path.join('.').replace(formatReg$1, formatHandle);
	  assert.str(path, "Require path[Array | String]");
	  return path;
	}

	function formatHandle(m, i) {
	  return "['" + i + "']";
	}

	function get(obj, path) {
	  path = parsePath(path);
	  var l = path.length - 1;
	  if (l === -1) return obj;
	  var i = 0;

	  for (; i < l; i++) {
	    obj = obj[path[i]];
	    if (obj === null || obj === undefined) return undefined;
	  }

	  return obj ? obj[path[i]] : undefined;
	}
	function set(obj, path, value) {
	  path = parsePath(path);
	  var l = path.length - 1;
	  if (l === -1) return;
	  var attr,
	      v,
	      i = 0;

	  for (; i < l; i++) {
	    attr = path[i];
	    v = obj[attr];
	    if (!v) obj[attr] = v = {};
	    obj = v;
	  }

	  attr = path[i];
	  obj[attr] = value;
	}

	// Text Stream
	// ================================================

	var LINE_REG = /\n/g;

	function Stream(buff) {
	  this.orgbuff = buff;
	  this.orglen = buff.length; // [buff, offset, orgoffset, prev, char code cache]

	  var curr = [buff, 0, 0, null, null];
	  this.curr = curr;
	  this.stack = [curr];
	}

	inherit(Stream, {
	  enter: function enter() {
	    var curr = this.curr; // [buff, offset, orgoffset, prev, char code cache]

	    this.curr = curr = [curr[0], curr[1], curr[2], curr, null];
	    this.stack.push(curr);
	  },
	  reset: function reset() {
	    var curr = this.curr;
	    var prev = curr[3];

	    if (curr[2] !== prev[2]) {
	      curr[0] = prev[0];
	      curr[1] = prev[1];
	      curr[2] = prev[2];
	      curr[4] = null;
	      return true;
	    }
	  },
	  exit: function exit() {
	    var curr = this.stack.pop();
	    this.curr = curr[3];
	  },
	  commit: function commit() {
	    var curr = this.stack.pop(),
	        prev = curr[3];
	    this.curr = prev;
	    prev[0] = curr[0];
	    prev[1] = curr[1];
	    prev[2] = curr[2];
	    prev[4] = curr[4];
	  },
	  buff: function buff(reset) {
	    var curr = this.curr;

	    if (reset) {
	      curr[0] = curr[0].substring(curr[1]);
	      curr[1] = 0;
	    }

	    return curr[0];
	  },
	  offset: function offset() {
	    return this.curr[1];
	  },
	  orgOffset: function orgOffset() {
	    return this.curr[2];
	  },
	  upOrgOffset: function upOrgOffset() {
	    var prev = this.curr[3];
	    return prev ? prev[2] : 0;
	  },
	  nextCode: function nextCode() {
	    var curr = this.curr;
	    if (curr[4] === null) curr[4] = curr[2] < this.orglen ? curr[0].charCodeAt(curr[1]) : 0;
	    return curr[4];
	  },
	  consume: function consume(len) {
	    if (len) {
	      var curr = this.curr;
	      curr[1] += len;
	      curr[2] += len;
	      curr[4] = null;
	    }
	  },
	  position: function position(offset) {
	    var orgbuff = this.orgbuff;
	    var line = 0,
	        lineOffset = 0;

	    while (LINE_REG.exec(orgbuff) && offset >= LINE_REG.lastIndex) {
	      lineOffset = LINE_REG.lastIndex;
	      line++;
	    }

	    LINE_REG.lastIndex = 0;
	    return [line, offset - lineOffset];
	  },
	  source: function source() {
	    var orgbuff = this.orgbuff;
	    var line = 1;
	    return " 0: " + orgbuff.replace(LINE_REG, function () {
	      return "\n" + pad(line++, 2) + ": ";
	    });
	  }
	}); // ================================================
	// Rule Base API
	// ================================================

	var idGen = 0;
	var MatchResult = inherit(function MatchResult(parent) {
	  this.parent = parent;
	  this.data = [];
	}, {
	  add: function add(data) {
	    this.data.push(data);
	  },
	  addAll: function addAll(datas) {
	    var data = this.data;
	    var len = data.length;
	    var i = datas.length;

	    while (i--) {
	      data[len + i] = datas[i];
	    }
	  },
	  empty: function empty() {
	    this.setLen(0);
	  },
	  setLen: function setLen(len) {
	    var data = this.data;
	    if (data.length > len) data.length = len;
	  }
	});
	/**
	 * static Rule options
	 */

	function UNATTACH() {}
	var UNCAPTURABLE = {
	  capturable: false
	},
	    UNATTACH_CAPTURABLE = {
	  attach: UNATTACH,
	  capturable: false
	};

	function defaultErrorMsg(err) {
	  return err;
	}

	function defaultAttach(data, rs) {
	  rs.add(data);
	}

	function defaultRuleTest() {
	  return true;
	}

	var OPTION_ATTACH = 'attach',
	    OPTION_ERROR = 'error',
	    OPTION_CAPTURABLE = 'capturable';
	/**
	 * Rule Interface
	 *
	 * Overrides:
	 *      Rule(name, attachFunction: <Function>)
	 *
	 *      Rule(name, errorMsg: <String>)
	 *
	 * @param {String}                  name                rule name
	 * @param {Function|String|Object}  option              rule option
	 * @param {Function}                option.attach       data attach callback
	 * @param {Boolean}                 option.capturable   error is capturable
	 * @param {Function|String}         option.error        error message or error message callback
	 */

	function Rule(name, option) {
	  this.id = idGen++;
	  this.name = name;
	  var capturable = true,
	      attach = null,
	      msg = null;

	  if (isObj(option)) {
	    attach = option[OPTION_ATTACH];
	    msg = option[OPTION_ERROR];
	    capturable = option[OPTION_CAPTURABLE] !== false;
	  } else if (isFn(option)) {
	    attach = option;
	  } else if (isStr(option)) {
	    msg = option;
	  }

	  this.capturable = capturable;
	  this.attach = isFn(attach) ? attach : defaultAttach;
	  this.msg = isStr(msg) ? function () {
	    return msg;
	  } : isFn(msg) ? msg : defaultErrorMsg;
	}
	inherit(Rule, {
	  $rule: true,
	  error: function error$$1(stream, err, capturable, srcErr) {
	    err = [stream.orgOffset(), this.msg(err), capturable && srcErr ? srcErr[2] : capturable, srcErr, this];
	    err.$err = true;
	    return err;
	  },
	  success: function success(stream, data, result) {
	    var curr = stream.curr,
	        err = this.attach(data, result, stream, this);
	    assert(stream.curr == curr);
	    return err && !err.$err ? this.error(stream, err, false) : err;
	  },
	  setExpr: function setExpr(expr) {
	    this.defName = this.mkExpr(expr);
	    this.EXPECT = "Expect: " + expr;
	  },
	  mkExpr: function mkExpr(expr) {
	    return "<" + this.type + ": " + expr + ">";
	  },
	  toString: function toString() {
	    return this.name || this.defName;
	  },
	  getStart: function getStart() {
	    return [];
	  },
	  test: defaultRuleTest
	}); // ================================================
	// Match Rule API
	// ================================================

	function testRuleByIndex(stream) {
	  return this.index[stream.nextCode()];
	}
	/**
	 * match rule interface
	 *
	 * @param {String}                              name        rule name
	 * @param {Int | String | Array<String | Int>}  startCodes  start codes in match
	 * @param {Boolean}                             ignoreCase  is match ignore case
	 * @param {?}                                   option      see Rule Constructor
	 */


	var MatchRule = inherit(function MatchRule(name, startCodes, ignoreCase, option) {
	  Rule.call(this, name, option);
	  var start = [],
	      index = [];
	  eachCharCodes(startCodes, ignoreCase, function (code) {
	    if (!index[code]) {
	      start.push(code);
	      index[code] = code;
	    }
	  });
	  this.start = start;
	  this.index = index;
	  this.test = start.length ? testRuleByIndex : defaultRuleTest;
	}, Rule, {
	  comsume: function comsume(stream, data, len, result) {
	    stream.consume(len);
	    return this.success(stream, data, result);
	  },
	  getStart: function getStart() {
	    return this.start;
	  }
	}); // ================================================
	// Char Match Rule
	// ================================================

	function defaultCharMatchRuleTest() {
	  return stream.nextCode();
	}
	/**
	 * match one char which in allow list
	 * well match every char when allows is empty
	 *
	 * @param {String}                              name        rule name
	 * @param {Int | String | Array<String | Int>}  allows      which char can be matched
	 *                                                          well match every char when allows is empty
	 * @param {Boolean}                             ignoreCase  is match ignore case
	 * @param {?}                                   option      see Rule Constructor
	 */


	var CharMatchRule = inherit(function CharMatchRule(name, allows, ignoreCase, option) {
	  MatchRule.call(this, name, allows, ignoreCase, option);
	  var codes = this.start;
	  var i = codes.length,
	      expr = '*';

	  if (i) {
	    var chars = [];

	    while (i--) {
	      chars[i] = String.fromCharCode(codes[i]);
	    }

	    expr = "\"" + chars.join('" | "') + "\"";
	  } else {
	    this.test = defaultCharMatchRuleTest;
	  }

	  this.setExpr(expr);
	}, MatchRule, {
	  type: 'Character',
	  match: function charMatch(stream, result) {
	    return this.comsume(stream, String.fromCharCode(stream.nextCode()), 1, result);
	  }
	}); // ================================================
	// Regexp Match Rule
	// ================================================

	/**
	 * match by RegExp
	 *
	 * optimization:
	 *      Priority use sticky mode
	 *
	 * @param {String}                              name        rule name
	 * @param {RegExp}                              regexp      regexp
	 * @param {Int | Boolean}                       pick        pick match result
	 *                                                          0       : [default] pick match[0]
	 *                                                                    optimize: test and substring in sticky mode
	 *                                                          pick > 0: pick match[pick]
	 *                                                          pick < 0: pick first matched group
	 *                                                          true    : pick match
	 *                                                          false   : no data pick
	 *                                                                    optimize: just test string in sticky mode
	 * @param {Int | String | Array<String | Int>}  startCodes  start codes of regexp
	 * @param {?}                                   option      see Rule Constructor
	 */

	var RegMatchRule = inherit(function RegMatchRule(name, regexp, pick, startCodes, option) {
	  pick = pick === false || isInt(pick) ? pick : !!pick || 0;
	  var sticky = regStickySupport && !pick,
	      // use exec when need pick match group data
	  pattern = regexp.source,
	      ignoreCase = regexp.ignoreCase; // always wrapping in a none capturing group preceded by '^' to make sure
	  // matching can only work on start of input. duplicate/redundant start of
	  // input markers have no meaning (/^^^^A/ === /^A/)
	  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/sticky
	  // When the y flag is used with a pattern, ^ always matches only at the
	  // beginning of the input, or (if multiline is true) at the beginning of a
	  // line.

	  regexp = new RegExp(sticky ? pattern : "^(?:" + pattern + ")", (ignoreCase ? 'i' : '') + (regexp.multiline ? 'm' : '') + (sticky ? 'y' : ''));
	  MatchRule.call(this, name, startCodes, ignoreCase, option);
	  this.regexp = regexp;
	  this.pick = pick;
	  this.match = createRegMatchRulePolicy(name || "reg" + this.id, sticky, pick);
	  this.setExpr(regexp.toString());
	}, MatchRule, {
	  type: 'RegExp'
	});
	/**
	 * generate match function
	 *
	 * sticky mode:
	 *      var reg = this.regexp,
	 *          buff = stream.buff(),
	 *          start = stream.offset()
	 *      reg.lastIndex = start
	 *      if (reg.test(buff))
	 *          return this.comsume(stream,
	 *                              this.pick === false ? null : buff.substring(start, reg.lastIndex),
	 *                              reg.lastIndex - start)
	 *      return this.error(stream, this.EXPECT, this.capturable, result);
	 *
	 * unsticky mode:
	 *      var m = this.regexp.exec(stream.buff(true))
	 *      if (m) {
	 *          var pick = this.pick,
	 *              pickData
	 *          if (pick < 0) {
	 *              pick = -pick
	 *              for(var i = 1; i <= pick; i++) {
	 *                  if (m[i]) {
	 *                      pickData = m[i]
	 *                      break
	 *                  }
	 *              }
	 *          }else {
	 *              pickData = pick === true ? m : m[pick || 0]
	 *          }
	 *          return this.comsume(stream, pickData, m[0].length, result)
	 *      }
	 *      return this.error(stream, this.EXPECT, this.capturable);
	 *
	 */

	function createRegMatchRulePolicy(name, sticky, pick) {
	  var R = "this.regexp",
	      STREAM = 'stream',
	      S_BUFF = STREAM + ".buff",
	      LIDX = "r.lastIndex";
	  name += "_" + (sticky ? 'test' : 'exec') + "_pick_" + (pick === true ? 'all' : pick < 0 ? 'one_' + -pick : pick || 0);
	  var code = sticky ? // sticky mode
	  "var r = " + R + ", b = " + S_BUFF + "(), s = " + STREAM + ".offset();\n\t" + LIDX + " = s;\n\tif (r.test(b))\n\t\t" + consumCode(pick === false ? 'null' : "b.substring(s, " + LIDX + ")", LIDX + " - s") : // unsticky mode
	  "var m = " + R + ".exec(" + S_BUFF + "(true));\n\tif (m)\n\t\t" + consumCode(pick < 0 ? pickCode(-pick) : "m" + (pick === true ? '' : "[" + (pick || 0) + "]"), 'm[0].length');
	  return new Function("return function " + name + "(" + STREAM + ", rs){\n\t" + code + "\n\treturn this.error(" + STREAM + ", this.EXPECT, this.capturable);\n}")();

	  function consumCode(data, len) {
	    return "return this.comsume(" + STREAM + ", " + data + ", " + len + ", rs)";
	  }

	  function pickCode(pick) {
	    var arr = [];

	    for (var i = 1; i <= pick; i++) {
	      arr.push("m[" + i + "]");
	    }

	    return arr.join(' || ');
	  }
	} // ================================================
	// String Match Rule
	// ================================================

	/**
	 * match string
	 *
	 * @param {String}  name        rule name
	 * @param {String}  str         match string
	 * @param {Boolean} ignoreCase  is match ignore case
	 * @param {?}       option      see Rule Constructor
	 */


	var StrMatchRule = inherit(function StrMatchRule(name, str, ignoreCase, option) {
	  RegMatchRule.call(this, name, new RegExp(reEscape(str), ignoreCase ? 'i' : ''), 0, str.charCodeAt(0), option);
	  this.setExpr(str);
	}, RegMatchRule, {
	  type: 'String'
	}); // ================================================
	// Match API
	// ================================================

	/**
	 *
	 * Overrides:
	 *      match(name, regexp, pick, start, option)
	 *
	 *      match(name, regexp, start, option)
	 *
	 *      match(name, regexp, option: <Object>)
	 *
	 *      match(regexp, pick, start, option)
	 *
	 *      match(regexp, start, option)
	 *
	 *      match(regexp, option)
	 *
	 *      match(name, str, ignoreCase, option)
	 *
	 *      match(name, str, option)
	 *
	 *      match(str, ignoreCase, option)
	 *
	 *      match(str, option: <Object>)
	 *
	 *      match({
	 *           name,
	 *           pattern: <String>
	 *           ignoreCase,
	 *           // option...
	 *           attach: <Function>,
	 *           capturable: <Boolean>,
	 *           error: <Function|String>
	 *      })
	 *      match({
	 *           name,
	 *           pattern: <RegExp>
	 *           pick,
	 *           startCodes,
	 *           // option...
	 *           attach: <Function>,
	 *           capturable: <Boolean>,
	 *           error: <Function|String>
	 *      })
	 *
	 * @param {String}                              name        [Option] rule name
	 * @param {String | RegExp}                     pattern     match pattern: String pattern | RegExp pattern
	 * @param {Boolean}                             ignoreCase  [Option] [String pattern] is match ignore Case
	 * @param {Int | true}                          pick        [Option] [RegExp pattern] pick match result, default: 0
	 * @param {Int | String | Array<Int | String>}  startCodes  [Option] [RegExp pattern] start codes of RegExp
	 * @param {?}                                   option      [Option] see Rule Constructor
	 * @return {MatchRule}
	 */

	function match(name, pattern) {
	  var args = arguments;
	  var i = 2;

	  if (isReg(name) || !(isReg(pattern) || isStr(pattern))) {
	    pattern = name;
	    name = null;
	    i = 1;
	  }

	  if (isReg(pattern)) {
	    var pick = args[i++],
	        startCodes = args[i++],
	        option = args[i++];

	    if (!isBool(pick) && !isInt(pick)) {
	      option = startCodes;
	      startCodes = pick;
	      pick = 0;
	    }

	    if (!isStr(startCodes) && !isNum(startCodes) && !isArray(startCodes)) {
	      option = startCodes;
	      startCodes = null;
	    }

	    return regMatch(name, pattern, pick, startCodes, option);
	  }

	  if (isStr(pattern) || isArray(pattern)) {
	    // string pattern | char[] pattern
	    var ignoreCase = args[i++],
	        option = args[i++];

	    if (!isBool(ignoreCase)) {
	      option = ignoreCase;
	      ignoreCase = false;
	    }

	    return strMatch(name, pattern, ignoreCase, option);
	  }

	  if (isObj(pattern)) {
	    var _pattern = pattern.pattern,
	        _name = pattern.name,
	        _option = pattern.option;
	    if (isReg(_pattern)) return regMatch(_name, _pattern, pattern.pick, pattern.startCodes, _option);
	    if (isStr(_pattern)) return strMatch(_name, _pattern, pattern.ignoreCase, _option);
	  }
	}

	function strMatch(name, pattern, ignoreCase, option) {
	  var C = isArray(pattern) || pattern.length <= 1 ? CharMatchRule : StrMatchRule;
	  return new C(name, pattern, ignoreCase, option);
	}

	var REG_ESPEC_CHARS = makeMap('dDsStrnt0cbBfvwW', '', 1);

	function regMatch(name, pattern, pick, startCodes, option) {
	  var source = pattern;

	  if (!pick) {
	    var c = 0;

	    if (source.length == 1 && source !== '^' && source !== '$') {
	      c = source === '.' ? '' : source;
	    } else if (source.length == 2 && source[0] === '\\' && REG_ESPEC_CHARS[source[1]]) {
	      c = source[1];
	    }

	    if (c != 0) return strMatch(name, c, pattern.ignoreCase, option);
	  }

	  return new RegMatchRule(name, pattern, pick, startCodes, option);
	} // ================================================
	// Char Code Tools
	// ================================================


	function eachCharCodes(codes, ignoreCase, cb) {
	  if (isStr(codes)) {
	    var i = codes.length;

	    while (i--) {
	      eachCharCode(codes.charCodeAt(i), ignoreCase, cb);
	    }
	  } else if (isArray(codes)) {
	    var i = codes.length;

	    while (i--) {
	      eachCharCodes(codes[i], ignoreCase, cb);
	    }
	  } else if (isInt(codes)) {
	    eachCharCode(codes, ignoreCase, cb);
	  }
	}

	function eachCharCode(code, ignoreCase, cb) {
	  cb(code);

	  if (ignoreCase) {
	    if (code <= 90) {
	      if (code >= 65) cb(code + 32);
	    } else if (code <= 122) {
	      cb(code - 32);
	    }
	  }
	} // ================================================
	// Complex Rule API
	// ================================================

	/**
	 * complex rule interface
	 *
	 * @param {String}              name        rule name
	 * @param {Function|Array|...}  rules       complex rules
	 * @param {?}                   option      see Rule Constructor
	 */


	var ComplexRule = inherit(function ComplexRule(name, rules, option) {
	  Rule.call(this, name, option);
	  var getRules = this.getRules;

	  this.getRules = function getLazyRules() {
	    this.getRules = getRules;
	    this.rules = rules = parseComplexRules(this, isFn(rules) ? rules() : rules, []);
	    var len = this.len = rules.length;
	    assert(len, "Require Rules"); // parse Expression

	    var names = this.subNames();
	    this.setExpr(names.join(this.split));

	    for (var i = 0; i < len; i++) {
	      names[i] = "Expect[" + i + "]: " + names[i];
	    }

	    this.EXPECTS = names;

	    this.__init(rules, len);

	    return this.getRules();
	  };
	}, Rule, {
	  /**
	   * parse buffer
	   *
	   * @param {String} buff text buff
	   */
	  parse: function parse(buff, errSource) {
	    var result = new MatchResult(),
	        stream = new Stream(buff);
	    var err = this.match(stream, result);

	    if (err) {
	      var source = stream.source();
	      var pos,
	          msg = [];

	      do {
	        pos = stream.position(err[0]);
	        msg.unshift("[" + pad(pos[0], 2) + ":" + pad(pos[1], 2) + "] - " + err[4].toString() + ": " + err[1] + " on \"" + escapeString(buff.substr(err[0], 20)) + "\"");
	        err = err[3];
	      } while (err);

	      if (errSource !== false) msg.push('[Source]', source);
	      var e = new SyntaxError(msg.join('\n'));
	      e.source = source;
	      throw e;
	    }

	    return result.data;
	  },
	  commit: function commit(stream, data, result) {
	    var err = this.success(stream, data, result);

	    if (err) {
	      stream.exit();
	      return err;
	    }

	    stream.commit();
	  },
	  exit: function exit(stream, msg, srcErr) {
	    var err = this.error(stream, msg, this.capturable, srcErr);
	    stream.exit();
	    return err;
	  },
	  init: function init() {
	    this.getRules();
	    return this;
	  },
	  __init: function __init() {},
	  getRules: function getRules() {
	    return this.rules;
	  },
	  subNames: function subNames(map$$1) {
	    var rules = this.getRules(),
	        names = [];

	    for (var i = 0; i < this.len; i++) {
	      names[i] = rules[i].toString(this.idStack(this.id, map$$1));
	    }

	    return names;
	  },
	  toString: function toString(map$$1) {
	    this.init();
	    if (this.name) return this.name;

	    if (map$$1) {
	      var id = this.id;

	      if (map$$1[id]) {
	        if (map$$1[id] === 1) return "<" + this.type + " -> $Self>";
	        return "<" + this.type + " -> $" + map$$1[id] + ">";
	      }

	      return this.mkExpr(this.subNames(map$$1).join(this.split));
	    }

	    return this.defName;
	  },
	  idStack: function idStack(id, map$$1) {
	    map$$1 = assign({
	      level: 0,
	      push: idStackPush
	    }, map$$1);
	    if (id) map$$1.push(id);
	    return map$$1;
	  }
	});

	function idStackPush(id) {
	  this[id] = ++this.level;
	  return this;
	}

	function parseComplexRules(curr, rules, dist) {
	  for (var i = 0, l = rules.length; i < l; i++) {
	    if (!rules[i]) ;

	    parseRule(curr, rules[i], dist);
	  }

	  return dist;
	}

	function parseRule(curr, rule, dist) {
	  if (rule.$rule) {
	    // Rule Object
	    dist.push(rule);
	  } else if (isStr(rule)) {
	    // match rule
	    dist.push(match(rule, UNATTACH));
	  } else if (isReg(rule)) {
	    dist.push(match(rule, false, UNATTACH));
	  } else if (isObj(rule)) {
	    dist.push(match(rule));
	  } else if (isArray(rule)) {
	    // rule connections or match rule
	    dist.push(applyNoScope$1(match, rule));
	  }
	} // ================================================
	// Complex Rules
	// ================================================

	/**
	 * and complex rule interface
	 *
	 * @param {String}              name        rule name
	 * @param {Function|Array|...}  rules       complex rules
	 * @param {?}                   option      see Rule Constructor
	 */


	var AndRule = inherit(function AndRule(name, rules, option) {
	  ComplexRule.call(this, name, rules, option);
	}, ComplexRule, {
	  type: 'And',
	  split: ' + ',
	  __init: function __init(rules, len) {
	    var start = [],
	        index = [],
	        codes = rules[0].getStart(this.idStack(this.id));
	    eachCharCodes(codes, false, function (code) {
	      if (!index[code]) {
	        start.push(code);
	        index[code] = code;
	      }
	    });
	    this.start = start;
	    this.index = index;
	    this.test = start.length ? testRuleByIndex : defaultRuleTest;
	  },
	  getStart: function getStart(map$$1) {
	    this.init();
	    if (this.start) return this.start;

	    if (map$$1) {
	      var id = this.id;
	      if (map$$1[id]) return [];
	      return this.getRules()[0].getStart(this.idStack(id, map$$1));
	    }

	    return this.start;
	  },
	  match: function andMatch(stream, result) {
	    var rules = this.getRules(),
	        len = this.len,
	        rs = new MatchResult(result);
	    var err,
	        i = 0;
	    stream.enter();

	    for (; i < len; i++) {
	      if (!rules[i].test(stream) || (err = rules[i].match(stream, rs))) {
	        return this.exit(stream, this.EXPECTS[i], err);
	      }
	    }

	    return this.commit(stream, rs.data, result);
	  }
	});
	var OrRule = inherit(function OrRule(name, rules, option) {
	  ComplexRule.call(this, name, rules, option);
	}, ComplexRule, {
	  type: 'Or',
	  split: ' | ',
	  __init: function __init(rules, len) {
	    var starts = [],
	        // all distinct start codes
	    rStarts = [],
	        // start codes per rule
	    index = [[] // rules witch have unkown start code
	    ];
	    var i, j, k, codes; // get start codes of all rules

	    for (i = 0; i < len; i++) {
	      rStarts[i] = [];
	      codes = rules[i].getStart(this.idStack(this.id));
	      eachCharCodes(codes, false, function (code) {
	        rStarts[i].push(code);

	        if (!index[code]) {
	          // init index
	          index[code] = [];
	          starts.push(code);
	        }
	      });
	    } // fill index


	    for (i = 0; i < len; i++) {
	      codes = rStarts[i];

	      if (!codes.length) {
	        // rules[i] not unkown start code
	        index[0].push(rules[i]); // append rules[i] to index[0]

	        codes = starts; // append rules[i] to all start code index
	      } // append rules[i] to start code index


	      j = codes.length;

	      while (j--) {
	        k = index[codes[j]];

	        if (k.idx !== i) {
	          // deduplication
	          k.push(rules[i]); // append rules[i] to start code index[codes[j]]

	          k.idx = i;
	        }
	      }
	    }

	    this.rStarts = rStarts; // rule have unkown start code when got unkown start code from any rules

	    this.start = index[0].length ? [] : starts;
	    this.test = starts.length && !index[0].length ? testRuleByIndex : this.test;
	    if (starts.length) // not use index when got unkown start code from every rules
	      this.index = index;
	  },
	  getStart: function getStart(map$$1) {
	    this.init();
	    if (this.start) return this.start;

	    if (map$$1) {
	      var id = this.id;
	      if (map$$1[id]) return [];
	      var rules = this.getRules(),
	          starts = [];

	      for (var i = 0, start; i < this.len; i++) {
	        start = rules[i].getStart(this.idStack(id, map$$1));
	        if (!start.length) return [];
	        starts[i] = start;
	      }

	      return starts;
	    }

	    return this.start;
	  },
	  match: function orMatch(stream, result) {
	    var index = this.index;
	    var rules = index ? index[stream.nextCode()] || index[0] : this.getRules(),
	        len = rules.length;
	    var rs = new MatchResult(result);
	    var err, upErr, i;
	    stream.enter();

	    for (i = 0; i < len; i++) {
	      if (!(err = rules[i].match(stream, rs)) && !(err = this.success(stream, rs.data, result))) {
	        stream.commit();
	        return;
	      }

	      if (!err[2]) // not capturable error
	        return this.exit(stream, this.EXPECTS[i], err);
	      if (!upErr || err[0] >= upErr[0]) upErr = err;
	      stream.reset();
	      rs.empty();
	    }

	    return this.exit(stream, this.EXPECT, upErr);
	  }
	});

	function createRepeatRule(defType, Parent, match) {
	  return inherit(function AndRepeatRule(name, type, min, max, rules, option) {
	    if (min < 0) min = 0;
	    if (max <= 0) max = 999999;
	    assert(min < max);
	    Parent.call(this, name, rules, option);
	    this.min = min;
	    this.max = max;
	    this.type = type || defType + "[" + min + " - " + max + "]";
	  }, Parent, {
	    __init: function __init(rules, len) {
	      Parent.prototype.__init.call(this, rules, len);

	      if (!this.min) this.test = defaultRuleTest;
	    },
	    match: match
	  });
	}

	var AndRepeatRule = createRepeatRule('AndRepeat', AndRule, function andRepeatMatch(stream, result) {
	  var min = this.min,
	      max = this.max;
	  var rules = this.getRules(),
	      len = this.len,
	      rs = new MatchResult(result),
	      data = rs.data;
	  var err,
	      repeat = 0,
	      i,
	      l;
	  stream.enter();

	  out: for (; repeat < max; repeat++) {
	    l = data.length;
	    stream.enter();

	    for (i = 0; i < len; i++) {
	      if (!rules[i].test(stream) || (err = rules[i].match(stream, rs))) {
	        if (repeat < min || err && !err[2]) {
	          // have no enough data or error is not capturable
	          err = this.exit(stream, this.EXPECTS[i], err);
	          stream.exit();
	          return err;
	        }

	        stream.exit();
	        rs.setLen(l);
	        break out;
	      }
	    }

	    stream.commit();
	  }

	  return this.commit(stream, data, result);
	});
	var OrRepeatRule = createRepeatRule('OrRepeat', OrRule, function orRepeatMatch(stream, result) {
	  var min = this.min,
	      max = this.max,
	      index = this.index;
	  var rs = new MatchResult(result),
	      data = rs.data;
	  var err,
	      upErr,
	      repeat = 0,
	      i,
	      l,
	      rules,
	      len;

	  if (!index) {
	    rules = this.getRules();
	    len = rules.length;
	  }

	  stream.enter(); // outer: enter

	  out: for (; repeat < max; repeat++) {
	    if (index) {
	      rules = index[stream.nextCode()] || index[0];
	      len = rules.length;
	    }

	    if (len) {
	      upErr = null;
	      l = data.length;
	      stream.enter(); // inner: enter

	      for (i = 0; i < len; i++) {
	        if (!(err = rules[i].match(stream, rs))) {
	          stream.commit(); // inner: commit

	          continue out;
	        }

	        if (!err[2]) {
	          // not capturable error
	          err = this.exit(stream, this.EXPECTS[i], err); // inner: exit

	          stream.exit(); // outer: exit

	          return err;
	        }

	        if (!upErr || err[0] >= upErr[0]) upErr = err;
	        stream.reset();
	        rs.setLen(l);
	      }

	      if (repeat < min) {
	        err = this.exit(stream, this.EXPECT, upErr); // inner: exit

	        stream.exit(); // outer: exit

	        return err;
	      }
	    } else if (repeat < min) return this.exit(stream, this.EXPECT); // outer: exit


	    break;
	  }

	  return this.commit(stream, data, result); // outer: commit
	}); // ================================================
	// Rule APIs
	// ================================================

	/**
	 * and(name, rules[], option)
	 *
	 * and(name, rules..., option)
	 *
	 * and(rules[], option)
	 *
	 * and(rules..., option)
	 *
	 * and({
	 *      name,
	 *      rules,
	 *      option
	 * })
	 * @param {String}                                                  name    [option] rule name
	 * @param {(Array|Arguments)<Rule|String|RegExp|Function>|Function} rules   match rules
	 * @param {Function}                                                option  see Rule.option
	 */

	function and() {
	  return buildComplexRule(arguments, 0, function (name, rules, option) {
	    return new AndRule(name, rules, option);
	  });
	}
	function or() {
	  return buildComplexRule(arguments, 0, function (name, rules, option) {
	    return new OrRule(name, rules, option);
	  });
	}

	function buildRepeatRule(args, i, type, min, max, C) {
	  return buildComplexRule(args, i, function (name, rules, option) {
	    return new C(name, type, min, max, rules, option);
	  });
	}

	function buildAndRepeatRule(args, i, type, min, max, C) {
	  return buildRepeatRule(args, i, type, min, max, AndRepeatRule);
	}

	function any() {
	  return buildAndRepeatRule(arguments, 0, 'Any', 0, -1);
	}
	function many() {
	  return buildAndRepeatRule(arguments, 0, 'Many', 1, -1);
	}
	function option() {
	  return buildAndRepeatRule(arguments, 0, 'Option', 0, 1);
	}
	function repeat(min, max) {
	  return buildAndRepeatRule(arguments, 2, 0, min, max);
	}

	function buildOrRepeatRule(args, i, type, min, max, C) {
	  return buildRepeatRule(args, i, type, min, max, OrRepeatRule);
	}

	function anyOne() {
	  return buildOrRepeatRule(arguments, 0, 'AnyOne', 0, -1);
	}
	function manyOne() {
	  return buildOrRepeatRule(arguments, 0, 'ManyOne', 1, -1);
	}
	function optionOne() {
	  return buildOrRepeatRule(arguments, 0, 'OptionOne', 0, 1);
	}
	function repeatOne(min, max) {
	  return buildOrRepeatRule(arguments, 2, 0, min, max);
	}

	function buildComplexRule(args, i, build) {
	  var arglen = args.length;
	  var name = 0,
	      rules,
	      option = null;

	  if (isObj(args[i])) {
	    name = args[i].name;
	    rules = args[i].rules;
	    option = args[i];
	  } else {
	    if (isStr(args[i])) name = args[i++];

	    if (isArray(args[i]) || isFn(args[i])) {
	      rules = args[i++];
	      option = args[i];
	    } else {
	      rules = [];

	      for (; i < arglen - 1; i++) {
	        rules.push(args[i]);
	      }

	      if (isFn(args[i]) || isObj(args[i]) || isStr(args[i])) option = args[i];else if (args[i]) rules.push(args[i]);
	    }
	  }

	  return build(name, rules, option);
	}

	var ASTBuilder = /*#__PURE__*/Object.freeze({
		MatchResult: MatchResult,
		UNATTACH: UNATTACH,
		UNCAPTURABLE: UNCAPTURABLE,
		UNATTACH_CAPTURABLE: UNATTACH_CAPTURABLE,
		Rule: Rule,
		MatchRule: MatchRule,
		CharMatchRule: CharMatchRule,
		RegMatchRule: RegMatchRule,
		StrMatchRule: StrMatchRule,
		match: match,
		ComplexRule: ComplexRule,
		AndRule: AndRule,
		OrRule: OrRule,
		AndRepeatRule: AndRepeatRule,
		OrRepeatRule: OrRepeatRule,
		and: and,
		or: or,
		any: any,
		many: many,
		option: option,
		repeat: repeat,
		anyOne: anyOne,
		manyOne: manyOne,
		optionOne: optionOne,
		repeatOne: repeatOne
	});

	/**
	 * @module common/ast
	 * @Author: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Date: 2018-11-06 18:02:16
	 * @Last Modified by:   tao.zeng (tao.zeng.zt@gmail.com)
	 * @Last Modified time: 2018-11-06 18:02:16
	 */

	/*
	 * Common Utils
	 *
	 * @Author: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Date: 2018-08-20 17:59:38
	 * @Last Modified by: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Last Modified time: 2018-11-07 09:16:18
	 */

	/*
	 * @Author: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Date: 2018-08-29 12:32:09
	 * @Last Modified by:   tao.zeng (tao.zeng.zt@gmail.com)
	 * @Last Modified time: 2018-08-29 12:32:09
	 */
	function es6 (defaultProps) {
	  if (isFn(__global.Proxy)) {
	    return {
	      name: 'Proxy',
	      proxyEnabled: true,
	      impl: {
	        __init: function __init() {
	          var _this = this;

	          var isArray$$1 = this.isArray;
	          this.proxy = new Proxy(this.source, {
	            get: function get(source, attr, proxy) {
	              return source[attr];
	            },
	            set: function set(source, attr, value, proxy) {
	              if (defaultProps[attr]) {
	                source[attr] = value;
	              } else {
	                var oldValue = source[attr];
	                source[attr] = value;

	                _this.__write(attr, value, oldValue);
	              }

	              return true;
	            }
	          });
	        }
	      }
	    };
	    return true;
	  }
	}

	/*
	 * @Author: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Date: 2018-08-29 12:32:14
	 * @Last Modified by:   tao.zeng (tao.zeng.zt@gmail.com)
	 * @Last Modified time: 2018-08-29 12:32:14
	 */
	function es5 () {
	  var defineProperty,
	      name = 'Define Property';

	  if (defPropSupport) {
	    defineProperty = function defineProperty(observer, attr) {
	      var source = observer.source;
	      var value = source[attr];
	      defProp(source, attr, {
	        enumerable: true,
	        configurable: true,
	        get: function get() {
	          return value;
	        },
	        set: function set(newValue) {
	          var oldValue = value;
	          value = newValue;

	          observer.__write(attr, newValue, oldValue);
	        }
	      });
	    };
	  } else if ('__defineGetter__' in {}) {
	    name = 'Define getter and setter';
	    var _Object$PROTOTYPE = Object[PROTOTYPE],
	        __defineGetter__ = _Object$PROTOTYPE.__defineGetter__,
	        __defineSetter__ = _Object$PROTOTYPE.__defineSetter__;

	    defineProperty = function defineProperty(observer, attr) {
	      var source = observer.source;
	      var value = source[attr];

	      __defineGetter__.call(source, attr, function () {
	        return value;
	      });

	      __defineSetter__.call(source, attr, function (newValue) {
	        var oldValue = value;
	        value = newValue;

	        observer.__write(attr, newValue, oldValue);
	      });
	    };
	  }

	  if (defineProperty) {
	    return {
	      name: name,
	      impl: {
	        __init: function __init() {
	          this.defined = create(null);
	        },
	        __watch: function __watch(attr) {
	          var defined = this.defined;

	          if (defined[attr]) {
	            defineProperty(this, attr);
	            defined[attr] = true;
	          }
	        }
	      }
	    };
	  }
	}

	/*
	 * @Author: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Date: 2018-08-29 12:35:04
	 * @Last Modified by:   tao.zeng (tao.zeng.zt@gmail.com)
	 * @Last Modified time: 2018-08-29 12:35:04
	 */
	function vb (defaultPropMap) {
	  if (!function () {
	    if (__global && __global.VBArray) {
	      try {
	        __global.execScript(['Function parseVB(code)', '\tExecuteGlobal(code)', 'End Function'].join('\n'), 'VBScript');
	        return true;
	      } catch (e) {}
	    }

	    return false;
	  }()) return false;
	  var bindingProp = '__vbclass_binding__',
	      constructorProp = '__vbclass_constructor__';
	  var objectProps = 'hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'.split(','),
	      classPool = create(null),
	      constructorScript = ['\tPublic [', bindingProp, ']\r\n', '\tPublic Default Function [', constructorProp, '](source)\r\n', '\t\tSet [', bindingProp, '] = source\r\n', '\t\tSet [', constructorProp, '] = Me\r\n', '\tEnd Function\r\n\n'].join('');
	  var classNameGenerator = 1;

	  function parseGetter(prop, buffer) {
	    buffer.push.call(buffer, '\tPublic Property Let [', prop, '](val)\r\n', '\t\tCall [', bindingProp, '].doWrite("', prop, '",val)\r\n', '\tEnd Property\r\n', '\tPublic Property Set [', prop, '](val)\r\n', '\t\tCall [', bindingProp, '].doWrite("', prop, '",val)\r\n', '\tEnd Property\r\n\r\n');
	  }

	  function parseSetter(prop, buffer) {
	    buffer.push.call(buffer, '\tPublic Property Get [', prop, ']\r\n', '\tOn Error Resume Next\r\n', '\t\tSet[', prop, '] = [', bindingProp, '].doRead("', prop, '")\r\n', '\tIf Err.Number <> 0 Then\r\n', '\t\t[', prop, '] = [', bindingProp, '].doRead("', prop, '")\r\n', '\tEnd If\r\n', '\tOn Error Goto 0\r\n', '\tEnd Property\r\n\r\n');
	  }

	  function parseVBClass(className, props) {
	    var buffer = ['Class ', className, '\r\n', constructorScript, '\r\n'],
	        prop;

	    for (var i = 0, l = props.length; i < l; i++) {
	      prop = props[i];
	      parseSetter(prop, buffer);
	      parseGetter(prop, buffer);
	    }

	    buffer.push('End Class');
	    return buffer.join('');
	  }

	  function getOrCreateVBClass(props) {
	    var classKey = [props.sort().join('|')].join(''),
	        providerName = classPool[classKey];

	    if (!providerName) {
	      var className = 'VBClass' + classNameGenerator++;
	      providerName = className + 'Provider';
	      parseVB(parseVBClass(className, props));
	      parseVB(['Function ', providerName, '(desc)\r\n', '\tDim o\r\n', '\tSet o = (New ', className, ')(desc)\r\n', '\tSet ', providerName, ' = o\r\n', 'End Function'].join(''));
	      classPool[classKey] = providerName;
	    }

	    return providerName;
	  }

	  function createProxy(source, vbproxy) {
	    var propMap = create(null),
	        props = [],
	        prop;

	    for (var i = 0, l = objectProps.length; i < l; i++) {
	      prop = objectProps[i];
	      propMap[prop] = true;
	      props[i] = prop;
	    }

	    for (prop in source) {
	      if (!propMap[prop]) {
	        props.push(prop);
	        propMap[prop] = true;
	      }
	    }

	    for (prop in defaultPropMap) {
	      if (defaultPropMap[prop] && !propMap[prop]) {
	        source[prop] = undefined;
	        propMap[prop] = true;
	        props.push(prop);
	      }
	    }

	    return __global[getOrCreateVBClass(props)](vbproxy);
	  }

	  function buildProxy(observer) {
	    var source = observer.source,
	        proxy = observer.proxy = createProxy(source, observer),
	        funcs = observer.funcs = create(null),
	        func;

	    for (var prop in source) {
	      func = source[prop];
	      if (typeof func === 'function') funcs[prop] = func.bind(proxy);
	    }
	  }

	  return {
	    name: 'VBProxy',
	    proxyEnabled: true,
	    proxyChangeable: true,
	    sourceOwnProperty: true,
	    impl: {
	      __init: function __init() {
	        buildProxy(this);
	      },
	      __watch: function __watch(attr) {
	        if (!(attr in this.proxy)) {
	          buildProxy(this);

	          this.__proxyChanged();
	        }
	      },
	      doWrite: function doWrite(attr, value) {
	        var source = this.source,
	            proxy = this.proxy,
	            funcs = this.funcs;

	        if (typeof value === 'function') {
	          funcs[attr] = value.bind(proxy);
	        } else if (funcs[attr]) {
	          funcs[attr] = false;
	        }

	        if (defaultProps[attr]) {
	          source[attr] = value;
	        } else {
	          var oldValue = source[attr];
	          source[attr] = value;

	          this.__write(attr, value, oldValue);
	        }
	      },
	      doRead: function doRead(attr) {
	        var source = this.source,
	            proxy = this.proxy,
	            funcs = this.funcs;
	        return funcs[attr] || source[attr];
	      }
	    }
	  };
	}

	/*
	 * @Author: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Date: 2018-08-29 12:33:23
	 * @Last Modified by: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Last Modified time: 2018-09-06 13:59:32
	 */
	var OBSERVER_KEY = '__observer__'; // ================= Array Hook Begin =======================

	var ARRAY_EVENTS = makeMap('length,change');
	var ArrayProto = Array[PROTOTYPE];
	var arrayHooks = makeArray('fill,pop,push,reverse,shift,sort,splice,unshift', function (method) {
	  var fn = ArrayProto[method];
	  return [method, function () {
	    var len = this.length,
	        rs = apply(fn, this, arguments),
	        newlen = this.length,
	        observer = this[OBSERVER_KEY];

	    observer.__write('change', this, this);

	    if (len !== newlen) observer.__write('length', newlen, len);
	    return rs;
	  }];
	}),
	    arrayHookLength = arrayHooks.length;

	function hookArray(array) {
	  for (var i = 0, hook; i < arrayHookLength; i++) {
	    hook = arrayHooks[i];
	    array[hook[0]] = hook[1];
	  }

	  return array;
	} // ================= Array Hook End =======================


	var defaultProps$1 = makeMap([OBSERVER_KEY, DEFAULT_BINDING, DEFAULT_FN_BINDING, DEFAULT_SCOPE_BINDING]); // ================ init policy Begin ========================

	var policy = es6(defaultProps$1) || es5(defaultProps$1) || vb(defaultProps$1);
	assert(policy, 'Observer is not supported.');
	var _policy$proxyEnabled = policy.proxyEnabled,
	    proxyEnabled = _policy$proxyEnabled === void 0 ? false : _policy$proxyEnabled,
	    _policy$proxyChangeab = policy.proxyChangeable,
	    proxyChangeable = _policy$proxyChangeab === void 0 ? false : _policy$proxyChangeab,
	    _policy$sourceOwnProp = policy.sourceOwnProperty,
	    sourceOwnProperty = _policy$sourceOwnProp === void 0 ? false : _policy$sourceOwnProp;
	function isDefaultProp(prop) {
	  return defaultProps$1[prop] || false;
	} // ================ init policy End========================

	function noProxyChangeEventHandler() {
	  return false;
	}

	var disableWriteEvent = false;

	function Observer(source) {
	  // bind observer to object
	  defPropValue(source, OBSERVER_KEY, this);
	  this.source = this.proxy = source;
	  this.bubbles = create(null);

	  if (this.isArray = isArray(source)) {
	    hookArray(source);
	  } else {
	    this.__init();
	  }
	}

	inherit(Observer, {
	  __init: function __init() {// implement by policy
	  },
	  __watch: function __watch(prop) {// implement by policy
	  },
	  __write: function __write(prop, value, oldValue) {
	    // call by policy
	    if (disableWriteEvent) return;
	    var list = this.bubbles[prop];
	    if (!list || !list.length || value === oldValue && isPrimitive(value)) return;
	    list.each(function (desc) {
	      return addChangedQueue(desc, oldValue);
	    });
	  },
	  observe: function observe(path, handler, scope) {
	    assert.fn(handler, 'require function handler.');
	    path = parsePath(path);
	    var l = path.length - 1;
	    assert(l >= 0, 'require non-empty path.');
	    var watchs = this.watchs || (this.watchs = create(null)),
	        currentObserver = this,
	        attr,
	        desc,
	        parent = undefined,
	        i = 0,
	        childObserver,
	        obj;

	    for (; i <= l; i++) {
	      attr = path[i];
	      desc = watchs[attr];

	      if (!desc) {
	        desc = allocWatchDescriptor(this, currentObserver, attr, parent);

	        if (currentObserver) {
	          assert(!currentObserver.isArray || ARRAY_EVENTS[attr] && i == l, function () {
	            var pathStr = formatPath(path);
	            var errorPath = formatPath(path.slice(i));
	            var arrayPath = i ? '[' + formatPath(path.slice(0, i)) + ']' : '';
	            return "invalid path[" + pathStr + "]: not support \"" + errorPath + "\" in Array" + arrayPath + ", change to \"change\" or \"length\".";
	          });
	          registerBubble(currentObserver, desc);
	        }
	      }

	      if (i < l) {
	        parent = desc;
	        watchs = desc[DESC_CHILDREN_INDEX];

	        if (currentObserver) {
	          if (obj = currentObserver.source[attr]) {
	            if (!(childObserver = exports.getObserver(obj))) {
	              childObserver = new Observer(obj);
	              setChildObserver(currentObserver, attr, childObserver);
	            }
	          } else {
	            childObserver = undefined;
	          }

	          currentObserver = childObserver;
	        }
	      }
	    }

	    desc[DESC_PATH_INDEX] = path;
	    return desc[DESC_HANDLERS_INDEX].add(handler, scope);
	  },
	  unobserve: function unobserve(path, handler, scope) {
	    assert.fn(handler, 'require function handler.');
	    path = parsePath(path);
	    var l = path.length;
	    assert(l, 'require non-empty path.');
	    return this.watchs ? unwatch(this.watchs, path, 0, l - 1, handler, scope) : false;
	  },
	  isObserved: function isObserved(path, handler, scope) {
	    assert.fn(handler, 'require function handler.');
	    path = parsePath(path);
	    var l = path.length - 1;
	    assert(l >= 0, 'require non-empty path.');
	    var watchs = this.watchs,
	        i = 0,
	        desc;
	    if (!watchs) return false;

	    for (; i <= l; i++) {
	      desc = watchs[path[i]];
	      if (!desc) return false;
	      if (i < l) watchs = desc[DESC_CHILDREN_INDEX];
	    }

	    return handler ? desc[DESC_HANDLERS_INDEX].has(handler, scope) : !!desc[DESC_HANDLERS_INDEX].size();
	  },
	  set: proxyEnabled ? function (path, value, disableEvent) {
	    _set(this, parsePath(path), value, disableEvent);

	    return this;
	  } : function (path, value, disableEvent) {
	    if (disableEvent) {
	      var disabled = disableWriteEvent;
	      disableWriteEvent = true;

	      _set(this, path, value, true);

	      disableWriteEvent = disabled;
	    } else {
	      _set(this, path, value, true);
	    }

	    return this;
	  },
	  get: function get$$1(path) {
	    return get(this.source, path);
	  },
	  __proxyChanged: noProxyChangeEventHandler,
	  onProxyChange: noProxyChangeEventHandler,
	  unProxyChange: noProxyChangeEventHandler
	}, policy.impl); // ============ watch descriptor begin ===============

	var DESC_HANDLERS_INDEX = 0,
	    DESC_CHILDREN_INDEX = 1,
	    DESC_CHILD_NUM_INDEX = 2,
	    DESC_OWNER_INDEX = 3,
	    DESC_OBSERVER_INDEX = 4,
	    DESC_ATTR_INDEX = 5,
	    DESC_PARENT_INDEX = 6,
	    DESC_CHANGED_INDEX = 7,
	    DESC_EVENT_INDEX = 8,
	    DESC_VALUE_INDEX = 9,
	    DESC_PATH_INDEX = 10;

	function allocWatchDescriptor(owner, observer, attr, parent) {
	  var desc = [new FnList(), create(null), 0, owner, observer, attr, parent, NO_CHANGED, NO_CHANGED];

	  if (parent) {
	    parent[DESC_CHILDREN_INDEX][attr] = desc;
	    parent[DESC_CHILD_NUM_INDEX]++;
	  } else {
	    owner.watchs[attr] = desc;
	  }

	  return desc;
	}

	function freeWatchDescriptor(desc) {
	  var parent = desc[DESC_PARENT_INDEX],
	      attr = desc[DESC_ATTR_INDEX];

	  if (parent) {
	    parent[DESC_CHILDREN_INDEX][attr] = undefined;
	    parent[DESC_CHILD_NUM_INDEX]--;
	  } else {
	    desc[DESC_OWNER_INDEX].watchs[attr] = undefined;
	  }
	} // ============ watch descriptor end ===============


	function unwatch(watchs, path, level, maxLevel, handler, scope) {
	  var desc = watchs[path[level]];

	  if (desc) {
	    var ret = level === maxLevel ? desc[DESC_HANDLERS_INDEX].remove(handler, scope) : unwatch(desc[DESC_CHILDREN_INDEX], path, level + 1, maxLevel, handler, scope);

	    if (!desc[DESC_CHILD_NUM_INDEX] && !desc[DESC_HANDLERS_INDEX].size()) {
	      unregisterBubble(desc[DESC_OBSERVER_INDEX], desc, desc[DESC_ATTR_INDEX]);
	      freeWatchDescriptor(desc);
	    }

	    return ret;
	  }

	  return false;
	}

	function registerBubble(observer, descriptor) {
	  if (!observer) return false;
	  var bubbles = observer.bubbles,
	      attr = descriptor[DESC_ATTR_INDEX],
	      descs = bubbles[attr];

	  if (!descs) {
	    descs = bubbles[attr] = new List();
	    if (!observer.isArray) observer.__watch(attr);
	  }

	  return descs.add(descriptor);
	}

	function unregisterBubble(observer, descriptor, attr) {
	  if (!observer) return false;
	  var bubbles = observer.bubbles,
	      descs = bubbles[attr];
	  return descs && descs.remove(descriptor);
	}

	var changedQueue = [],
	    eventQueue = [],
	    NO_CHANGED = {};

	function addChangedQueue(desc, oldValue) {
	  if (desc[DESC_CHANGED_INDEX] === NO_CHANGED) {
	    desc[DESC_CHANGED_INDEX] = oldValue;
	    var l = changedQueue.length;
	    changedQueue[l] = desc;
	    if (!l) nextTick(flushChangedQueue);
	  }
	}

	function addEventQueue(desc, value, oldValue) {
	  if (desc[DESC_EVENT_INDEX] === NO_CHANGED) {
	    desc[DESC_VALUE_INDEX] = value;
	    desc[DESC_EVENT_INDEX] = oldValue;
	    eventQueue.push(desc);
	  } else {
	    desc[DESC_VALUE_INDEX] = value;
	  }
	}

	function flushChangedQueue() {
	  var desc,
	      i = 0,
	      l = changedQueue.length;

	  for (; i < l; i++) {
	    desc = changedQueue[i];
	    bubble(desc, observerValue(desc[DESC_OBSERVER_INDEX], desc[DESC_ATTR_INDEX]), desc[DESC_CHANGED_INDEX], addEventQueue);
	    desc[DESC_CHANGED_INDEX] = NO_CHANGED;
	  }

	  changedQueue.length = 0;
	  var value, oldValue;

	  for (i = 0, l = eventQueue.length; i < l; i++) {
	    desc = eventQueue[i];
	    value = desc[DESC_VALUE_INDEX];
	    oldValue = desc[DESC_EVENT_INDEX];
	    if (value !== oldValue || !isPrimitive(value)) desc[DESC_HANDLERS_INDEX].each(function (callback, scope) {
	      scope ? callback.call(scope, desc[DESC_PATH_INDEX], value, oldValue, desc[DESC_OWNER_INDEX]) : callback(desc[DESC_PATH_INDEX], value, oldValue, desc[DESC_OWNER_INDEX]);
	    });
	    desc[DESC_EVENT_INDEX] = NO_CHANGED;
	  }

	  eventQueue.length = 0;
	}

	function bubble(desc, value, oldValue, cb) {
	  if (desc[DESC_HANDLERS_INDEX].size()) cb(desc, value, oldValue);

	  if (desc[DESC_CHILD_NUM_INDEX]) {
	    newObserver = value ? observer$1(value) : undefined;
	    setChildObserver(desc[DESC_OBSERVER_INDEX], desc[DESC_ATTR_INDEX], newObserver);

	    __bubble(desc, newObserver, cb);
	  }
	}

	function __bubble(parent, newObserver, cb) {
	  var children = parent[DESC_CHILDREN_INDEX],
	      attr,
	      desc,
	      oldObserver,
	      nextObserver;

	  for (attr in children) {
	    if ((desc = children[attr]) && desc[DESC_OWNER_INDEX] && (oldObserver = desc[DESC_OBSERVER_INDEX]) !== newObserver) {
	      if (desc[DESC_HANDLERS_INDEX].size()) cb(desc, observerValue(newObserver, attr), observerValue(oldObserver, attr));
	      unregisterBubble(oldObserver, desc, attr);
	      desc[DESC_OBSERVER_INDEX] = newObserver;
	      registerBubble(newObserver, desc);

	      if (desc[DESC_CHILD_NUM_INDEX]) {
	        nextObserver = (nextObserver = newObserver.source[attr]) ? observer$1(nextObserver) : undefined;
	        setChildObserver(newObserver, attr, nextObserver);

	        __bubble(desc, nextObserver, cb);
	      }
	    }
	  }
	}

	var setChildObserver = proxyEnabled ? function (parentObserver, attr, childObserver) {
	  if (childObserver) parentObserver.source[attr] = childObserver.proxy;
	} : function (parentObserver, attr, childObserver) {};

	function observerValue(observer, attr) {
	  if (observer) {
	    if (observer.isArray && attr === 'change') return observer.proxy;
	    return observer.source[attr];
	  }
	}

	function _set(observer, path, value, setSource) {
	  var i = 0,
	      l = path.length - 1,
	      prop,
	      obj,
	      nextObj,
	      source;

	  for (; i < l; i++) {
	    prop = path[i];

	    if (observer) {
	      source = observer.source;
	      nextObj = source[prop];

	      if (!nextObj || !(observer = exports.getObserver(nextObj))) {
	        if (nextObj === undefined || nextObj === null) nextObj = setSource ? source[prop] = {} : observer.proxy[prop] = {};
	        observer = undefined;
	        obj = nextObj;
	      }
	    } else {
	      nextObj = obj[prop];
	      if (!nextObj) nextObj = obj[prop] = {};
	      obj = nextObj;
	    }
	  }

	  prop = path[i];

	  if (observer) {
	    setSource ? observer.source[prop] = value : observer.proxy[prop] = value;
	  } else {
	    obj[prop] = value;
	  }
	} // ================== API ============================


	function isProxyEnabled() {
	  return proxyEnabled;
	}
	function $set(obj, path, value) {
	  path = parsePath(path);
	  var observer = exports.getObserver(obj);
	  if (observer) return _set(observer, path, value, !proxyEnabled);
	  set(obj, path);
	}
	function observer$1(source) {
	  return exports.getObserver(source) || new Observer(source);
	}
	function observe(source, path, handler, scope) {
	  var _observer = observer$1(source);

	  return _observer.observe(path, handler, scope), _observer.proxy;
	}
	function unobserve(obj, path, handler, scope) {
	  var observer = exports.getObserver(obj);
	  return observer ? (observer.unobserve(path, handler, scope), observer.proxy) : obj;
	}
	function isObserved(obj, path, handler, scope) {
	  var observer = exports.getObserver(obj);
	  return observer && observer.isObserved(path, handler, scope);
	}

	exports.getObserver = function getObserver(obj) {
	  var observer = obj[OBSERVER_KEY];
	  if (observer && observer.source === obj) return observer;
	};
	    exports.$hasOwnProp = function $hasOwnProp(obj, prop) {
	  return defaultProps$1[prop] ? false : hasOwnProp(obj, prop);
	};
	    exports.source = function source(obj) {
	  return obj;
	};
	    exports.proxy = exports.source;
	    exports.$eq = eq$1;
	    exports.onProxyChange = noProxyChangeEventHandler;
	    exports.unProxyChange = noProxyChangeEventHandler;

	if (proxyEnabled) {
	  if (sourceOwnProperty) {
	    exports.$hasOwnProp = function $hasOwnProp(obj, prop) {
	      if (defaultProps$1[prop]) return false;
	      var observer = exports.getObserver(obj);
	      return hasOwnProp(observer ? observer.source : obj, prop);
	    };
	  }

	  exports.$hasOwnProp = function $hasOwnProp(obj, prop) {
	    if (defaultProps$1[prop]) return false;
	    var observer = exports.getObserver(obj);
	    return hasOwnProp(observer ? observer.source : obj, prop);
	  };

	  exports.getObserver = function getObserver(obj) {
	    var observer = obj[OBSERVER_KEY];
	    if (observer && (observer.source === obj || observer.proxy === obj)) return observer;
	  };

	  exports.source = function source(obj) {
	    var observer = obj && exports.getObserver(obj);
	    return observer ? observer.source : obj;
	  };

	  exports.proxy = function proxy(obj) {
	    var observer = obj && exports.getObserver(obj);
	    return observer ? observer.proxy : obj;
	  };

	  exports.$eq = function $eq(o1, o2) {
	    return eq$1(o1, o2) || (o1 && o2 && (o1 = exports.getObserver(o1)) ? o1 === exports.getObserver(o2) : false);
	  };

	  if (proxyChangeable) {
	    extend(Observer, {
	      __proxyChanged: function __proxyChanged() {
	        var _this = this;

	        var list = this.proxyListens,
	            source = this.source,
	            proxy = this.proxy;
	        list && list.each(function (callback, scope) {
	          scope ? callback.call(scope, source, proxy, _this) : callback(source, proxy, _this);
	        });
	      },
	      onProxyChange: function onProxyChange(fn, scope) {
	        assert.fn(fn, 'require function handler.');
	        var list = this.proxyListens;
	        if (!list) list = this.proxyListens = new FnList();
	        return list.add(fn, scope);
	      },
	      unProxyChange: function unProxyChange(fn, scope) {
	        assert.fn(fn, 'require function handler.');
	        var list = this.proxyListens;
	        return list && list.remove(fn, scope);
	      }
	    });

	    exports.onProxyChange = function onProxyChange(obj, fn, scope) {
	      var observer = exports.getObserver(obj);
	      return observer && observer.onProxyChange(fn, scope);
	    };

	    exports.unProxyChange = function unProxyChange(obj, fn, scope) {
	      var observer = exports.getObserver(obj);
	      return observer && observer.unProxyChange(fn, scope);
	    };
	  }
	}
	function $getOwnProp(obj, key, defaultVal) {
	  return exports.$hasOwnProp(obj, key) ? obj[key] : defaultVal;
	}

	/*
	 * @Author: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Date: 2018-08-29 12:32:20
	 * @Last Modified by:   tao.zeng (tao.zeng.zt@gmail.com)
	 * @Last Modified time: 2018-08-29 12:32:20
	 */
	var $eachArray = __mkEachArrayLike(arrayValueHandler$1),
	    $reachArray = __mkREachArrayLike(arrayValueHandler$1),
	    $each = __mkEach(eachStr, $eachArray, $eachObj),
	    $reach = __mkEach(reachStr, $reachArray, $eachObj);
	function $eachObj(obj, callback, scope, own) {
	  if (scope) callback = callback.bind(scope);
	  var key;

	  if (own === false) {
	    for (key in obj) {
	      if (!isDefaultProp(key) && callback(exports.proxy(obj[key]), key, obj) === STOP$1) return key;
	    }
	  } else {
	    for (key in obj) {
	      if (exports.$hasOwnProp(obj, key) && callback(exports.proxy(obj[key]), key, obj) === STOP$1) return key;
	    }
	  }
	}

	function arrayValueHandler$1(array, i) {
	  var obj = array[i];
	  return obj ? exports.proxy(obj) : obj;
	}

	/*
	 * @Author: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Date: 2018-08-29 12:32:59
	 * @Last Modified by:   tao.zeng (tao.zeng.zt@gmail.com)
	 * @Last Modified time: 2018-08-29 12:32:59
	 */
	var $mapArray = __mkMapArrayLike($eachArray),
	    $mapObj = __mkMapObj($eachObj),
	    $map = __mkEach(mapStr, $mapArray, $mapObj);

	/*
	 * @Author: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Date: 2018-08-29 12:32:40
	 * @Last Modified by:   tao.zeng (tao.zeng.zt@gmail.com)
	 * @Last Modified time: 2018-08-29 12:32:40
	 */
	var $filterArray = __mkFilter($mapArray),
	    $filterObj = __mkFilter($mapObj),
	    $filter = __mkFilter($map);

	/*
	 * @Author: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Date: 2018-08-29 12:32:50
	 * @Last Modified by:   tao.zeng (tao.zeng.zt@gmail.com)
	 * @Last Modified time: 2018-08-29 12:32:50
	 */
	var $findArray = __mkFind($eachArray),
	    $findObj = __mkFind($eachObj),
	    $find = __mkFind($each),
	    $rfindArray = __mkFind($reachArray),
	    $rfind = __mkFind($reach);

	/*
	 * @Author: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Date: 2018-08-29 12:32:55
	 * @Last Modified by:   tao.zeng (tao.zeng.zt@gmail.com)
	 * @Last Modified time: 2018-08-29 12:32:55
	 */
	var $indexOfArray = __mkTypeIndexOf($eachArray),
	    $indexOfObj = __mkTypeIndexOf($eachObj),
	    $lastIndexOfArray = __mkTypeIndexOf($reachArray),
	    $indexOf = __mkIndexOf($indexOfArray, 'indexOf'),
	    $lastIndexOf = __mkIndexOf($lastIndexOfArray, 'lastIndexOf');

	/*
	 * @Author: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Date: 2018-08-29 12:32:23
	 * @Last Modified by:   tao.zeng (tao.zeng.zt@gmail.com)
	 * @Last Modified time: 2018-08-29 12:32:23
	 */
	function $assign(obj) {
	  return __assign(obj, arguments, 1, __assignFilter$1);
	}
	function $assignIf(obj) {
	  return __assign(obj, arguments, 1, __assignIfFilter$1);
	}
	function $assignBy(obj, filter) {
	  return __assign(obj, arguments, 2, __assignUserFilter$1, filter);
	}

	function __assignUserFilter$1(prop, dist, source, cb) {
	  return exports.$hasOwnProp(source, prop) && cb(prop, dist, source);
	}

	function __assignIfFilter$1(prop, dist, source) {
	  return exports.$hasOwnProp(source, prop) && !exports.$hasOwnProp(dist, prop);
	}

	function __assignFilter$1(prop, dist, source) {
	  return exports.$hasOwnProp(source, prop);
	}

	/*
	 * @Author: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Date: 2018-08-29 12:33:14
	 * @Last Modified by:   tao.zeng (tao.zeng.zt@gmail.com)
	 * @Last Modified time: 2018-08-29 12:33:14
	 */
	function $obj2array(obj, valueHandler, scope, own) {
	  var array = [];
	  var key,
	      ret,
	      i = 0;
	  if (scope) valueHandler = valueHandler.bind(scope);

	  if (own === false) {
	    for (key in obj) {
	      if (!isDefaultProp(key)) {
	        ret = valueHandler(obj, key);
	        if (ret === STOP$1) break;
	        if (ret !== SKIP) array[i++] = ret;
	      }
	    }
	  } else {
	    for (key in obj) {
	      if (exports.$hasOwnProp(obj, key)) {
	        ret = valueHandler(obj, key);
	        if (ret === STOP$1) break;
	        if (ret !== SKIP) array[i++] = ret;
	      }
	    }
	  }

	  return array;
	}
	var $keys = __mkKV($obj2array, keyHandler$1),
	    $values = __mkKV($obj2array, valueHandler$1);

	function keyHandler$1(obj, key) {
	  return isDefaultProp(key) ? isDefaultProp : key;
	}

	function valueHandler$1(obj, key) {
	  return exports.proxy(obj[key]);
	}

	var _inherit;
	var CHILD_NODES = 'childNodes',
	    PARENT = 'parent',
	    VIRT_NODE = '$virtNode',
	    VIRT_ELEMENT = '$virtElement',
	    VIRT_TEXT = '$virtText',
	    VIRT_BINDING_TEXT = '$virtBindingText',
	    VIRT_COMPLEX_ELEMENT = '$virtComplexElement',
	    VIRT_COMMENT = '$virtComment';
	var VNode = inherit(function VNode(comp) {
	  assert(comp.$comp, 'Require Compontent');
	  this.comp = comp;
	}, (_inherit = {}, _inherit[VIRT_NODE] = true, _inherit.prepare = function prepare() {}, _inherit.mount = function mount() {}, _inherit.unmount = function unmount() {}, _inherit.appendTo = function appendTo(parent) {
	  assert(parent.$virtComplexElement, 'parent should be Virtual Complex Element');
	  return parent.append(this);
	}, _inherit.prependTo = function prependTo(parent) {
	  assert(parent.$virtComplexElement, 'parent should be Virtual Complex Element');
	  return parent.prepend(this);
	}, _inherit.insertBeforeTo = function insertBeforeTo(target) {
	  assert(target[PARENT], 'target is Root Node');
	  assert(target[VIRT_NODE], 'target should be Virtual Node');
	  return target[PARENT].insertBefore(this, target);
	}, _inherit.insertAfterTo = function insertAfterTo(target) {
	  assert(target[PARENT], 'target is Root Node');
	  assert(target[VIRT_NODE], 'target should be Virtual Node');
	  return target[PARENT].insertAfter(this, target);
	}, _inherit.replaceTo = function replaceTo(target) {
	  assert(target[PARENT], 'target is Root Node');
	  assert(target[VIRT_NODE], 'target should be Virtual Node');
	  return target[PARENT].replace(this, target);
	}, _inherit.prevSibling = function prevSibling() {
	  var parent = this[PARENT];
	  return parent && parent[CHILD_NODES].prev(this);
	}, _inherit.nextSibling = function nextSibling() {
	  var parent = this[PARENT];
	  return parent && parent[CHILD_NODES].next(this);
	}, _inherit.remove = function remove() {
	  var parent = this[PARENT];

	  if (parent) {
	    parent[CHILD_NODES].remove(this);
	    this[PARENT] = undefined;
	  }

	  return this;
	}, _inherit));

	var _inherit$1;
	var VText = inherit(function VText(comp, text) {
	  VNode.call(this, comp);
	  this.data = text;
	}, VNode, (_inherit$1 = {}, _inherit$1[VIRT_TEXT] = true, _inherit$1.text = function text(_text) {
	  var data = this.data;
	  if (arguments.length === 0) return data;
	  _text = strval(_text);

	  if (_text !== data) {
	    this.update(_text);
	    this.data = _text;
	  }

	  return this;
	}, _inherit$1));

	var keywords = makeMap('argilo,Math,Date,true,false,null,undefined,Infinity,NaN,isNaN,isFinite,parseInt,parseFloat,' + (window ? 'window,document,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent' : 'global'));
	var wsReg = /\s/g,
	    escapeReg = /[\{,]\s*[\w\$_]+\s*:|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\"']|\\.)*`|`(?:[^`\\]|\\.)*`)|new |typeof |void |(\|\|)/g,
	    restoreReg = /"(\d+)"/g,
	    identityReg = /[^\w$\.][A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*/g,
	    propReg = /^[A-Za-z_$][\w$]*/,
	    simplePathReg = /^[A-Za-z_$#@][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\]|\[\d+\]|\[[A-Za-z_$][\w$]*\])*$/;
	 // escaped code
	// save escaped string

	var escaped = [];

	function escape(code) {
	  return code.replace(escapeReg, escapeHandler);
	}

	function restore(code) {
	  return code.replace(restoreReg, restoreHandler);
	}

	function escapeHandler(match) {
	  var i = escaped.length;
	  escaped[i] = match;
	  return "\"" + i + "\"";
	}

	var escapeStrReg = /\n|\t|\r/g;

	function escapeStrHandler(m) {
	  switch (m) {
	    case '\n':
	      return '\\n';

	    case '\t':
	      return '\\t';

	    case '\r':
	      return '\\r';
	  }
	}

	function restoreHandler(match, i) {
	  var v = escaped[i];

	  switch (v.charAt(0)) {
	    case '"':
	    case "'":
	    case '`':
	      return v.replace(escapeStrReg, escapeStrHandler);
	  }

	  return v;
	} // identity opeartion type


	var IDENTITY_OPT_GET = 1,
	    IDENTITY_OPT_SET = 2,
	    IDENTITY_OPT_CALL = 3; // parsed identities

	var identities = create(null),
	    identitySize = 0; // identity process callback: function(prefix, identity, opt[IDENTITY_OPT_GET | IDENTITY_OPT_SET | IDENTITY_OPT_CALL])

	var userIdentityHandler, userKeyWords;

	function isKeyword(attr) {
	  return keywords[attr] || userKeyWords && userKeyWords[attr];
	}

	function identityHandler(match, i, str) {
	  var prefix = match.charAt(0),
	      identity = match.slice(1),
	      attr = identity.match(propReg)[0];
	  if (isKeyword(attr)) return match;
	  var optIdx = i + match.length,
	      optChar = str.charAt(optIdx);
	  var opt = IDENTITY_OPT_GET;

	  switch (optChar) {
	    case '(':
	      opt = IDENTITY_OPT_CALL;
	      break;

	    case '=':
	      if (str.charAt(optIdx + 1) !== '=') opt = IDENTITY_OPT_SET;
	      break;

	    case '/':
	    case '*':
	    case '+':
	    case '-':
	    case '%':
	    case '&':
	    case '|':
	    case '~':
	    case '^':
	      if (str.charAt(optIdx + 1) === '=') opt = IDENTITY_OPT_SET;
	      break;

	    case '>':
	    case '<':
	      if (str.charAt(optIdx + 1) === optChar && str.charAt(optIdx + 2) === '=') opt = IDENTITY_OPT_SET;
	      break;
	  }

	  var rs = userIdentityHandler(prefix, identity, opt);

	  if (rs) {
	    if (rs[1]) {
	      if (!identities[rs[1]]) {
	        identitySize++;
	        identities[rs[1]] = true;
	      }
	    }

	    return rs[0];
	  }

	  return match;
	}

	function makeExecutor(code, params) {
	  var body = 'return' + restore((' ' + code.replace(wsReg, '')).replace(identityReg, identityHandler));

	  try {
	    return createFn(params, body);
	  } catch (e) {
	    console.error(code, body);
	    throw e;
	  }
	}

	function cleanIdentities() {
	  if (!identitySize) return []; // get identities

	  var idents = new Array(identitySize);
	  var ident,
	      i = 0;

	  for (ident in identities) {
	    idents[i++] = ident;
	  } // reset identities


	  identities = create(null);
	  identitySize = 0;
	  return idents;
	}

	function isSimpleExpr(code) {
	  if (simplePathReg.test(code)) {
	    var match = code.match(propReg);
	    return match ? !isKeyword(match[0]) : false;
	  }

	  return false;
	}

	var filterSplitReg = /\s*\|\s*(?:\|\s*)*/,
	    filterParamReg = /\s*,\s*|\s+/g;
	/**
	 * - identity processor Prototype:
	 *
	 * [word: String, identity: String>] function(prefix: String, identity: String, opt: IDENTITY_OPT_GET | IDENTITY_OPT_SET | IDENTITY_OPT_CALL)
	 *
	 * - transforms format:
	 *
	 * {
	 *      [name]: {
	 *          transform(args){
	 *              ...
	 *          },
	 *          restore(args){
	 *          }
	 *      }
	 * }
	 * @param {String} code                 expression code
	 * @param {String[]} paramNames         parameter names
	 * @param {Function} identityHandler    identity processor
	 * @param {Function} parseFilter        filter processor
	 * @param {Object} keywords             keywords <key, true>
	 *
	 */

	function Expression(code, paramNames, identityHandler, parseFilter, keywords) {
	  userIdentityHandler = identityHandler;
	  userKeyWords = keywords;
	  this.expr = code;
	  var codeSplit = escape(code).split(filterSplitReg),
	      len = codeSplit.length; // parse executor

	  this.executor = makeExecutor(codeSplit[0], paramNames);
	  var filters = this.filters = new Array(len - 1); // parse filters

	  for (var i = 1, j, l, name, args; i < len; i++) {
	    args = trim$1(codeSplit[i]).split(filterParamReg);
	    name = restore(args.shift());

	    for (j = 0, l = args.length; j < l; j++) {
	      args[j] = makeExecutor(args[j], paramNames);
	    }

	    filters[i - 1] = [parseFilter(name), args, name];
	  }

	  var identities = this.identities = cleanIdentities();
	  this.simple = identities.length === 1 && isSimpleExpr(codeSplit[0]) ? codeSplit[0] : false;
	  escaped.length = 0;
	  userIdentityHandler = undefined;
	  userKeyWords = undefined;
	}
	inherit(Expression, {
	  execute: function execute(scope, args) {
	    apply(this.executor, scope, args);
	  },
	  eachFilter: function eachFilter(cb, scope, args) {
	    var filters = this.filters;
	    var i = 0,
	        l = filters.length,
	        filter$$1;

	    for (; i < l; i++) {
	      filter$$1 = filters[i];
	      if (cb(filter$$1[0], new FilterParams(filter$$1[1], scope, args)) === false) return false;
	    }
	  },
	  reachFilter: function reachFilter(cb, scope, args) {
	    var filters = this.filters;
	    var i = filters.length,
	        filter$$1;

	    while (i--) {
	      filter$$1 = filters[i];
	      if (cb(filter$$1[0], new FilterParams(filter$$1[1], scope, args)) === false) return false;
	    }
	  }
	});

	function FilterParams(params, scope, args) {
	  this.params = params;
	  this.scope = scope;
	  this.args = args;
	}

	inherit(FilterParams, {
	  get: function get(index, val) {
	    var scope = this.scope,
	        args = this.args,
	        params = this.params;
	    if (arguments.length) return params[index] ? apply(params[index], scope, args) : val;
	    var i = params.length;
	    var arr = new Array(i);

	    while (i--) {
	      arr[i] = apply(params[i], scope, args);
	    }

	    return arr;
	  },
	  iter: function iter() {
	    var scope = this.scope,
	        args = this.args,
	        params = this.params;
	    var len = params.length;
	    var i = 0;
	    return function () {
	      return i < len ? apply(params[i++], scope, args) : STOP$1;
	    };
	  }
	});

	/*
	 * VNode Expression Identity Handler
	 *
	 * @Author: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Date: 2018-08-20 17:58:05
	 * @Last Modified by: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Last Modified time: 2018-09-04 16:15:24
	 */
	var VNodeKeyword = '$node';
	function identityHandler$1(prefix, path, opt) {
	  switch (path[0]) {
	    case VNodeKeyword:
	      return undefined;

	    case 'this':
	      path.shift();
	      break;
	  }

	  var identity = formatPath(path),
	      expr = opt === IDENTITY_OPT_GET ? 'this.$scope.' + identity : 'this.getScope("' + path[0] + '").' + identity;
	  if (opt === IDENTITY_OPT_CALL || path[0].charAt(0) === '$') identity = undefined;

	  if (prefix === '#') {
	    identity = undefined;
	    prefix = '';
	  }

	  return [prefix + expr, identity];
	}

	/*
	 * Transform Expression
	 *
	 * @Author: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Date: 2018-08-20 16:46:41
	 * @Last Modified by: Tao Zeng (tao.zeng.zt@qq.com)
	 * @Last Modified time: 2018-11-07 15:59:34
	 */
	var transforms = create(null);

	function transformIdentityHandler(prefix, identity, opt) {
	  return identityHandler$1(prefix, parsePath(identity), opt);
	}

	var paramNames = [VNodeKeyword];
	function TransformExpression(code, transforms, keywords$$1) {
	  Expression.call(this, code, paramNames, transformIdentityHandler, this.parseFilter.bind(this), keywords$$1);
	  this.transforms = transforms;
	}
	inherit(TransformExpression, Expression, {
	  value: function value(scope, args) {
	    return this.execute(scope, args);
	  },
	  transformValue: function transformValue(scope, args) {
	    return this.transform(this.execute(scope, args), scope, args);
	  },
	  transform: function transform(value, scope, args) {
	    this.eachFilter(function (filter$$1, args) {
	      value = isFn(filter$$1) ? filter$$1(value, args) : filter$$1.transform.call(filter$$1, value, args);
	    }, scope, args);
	    return value;
	  },
	  checkRestore: function checkRestore() {
	    var _this = this;

	    assert.by(function () {
	      _this.reachFilter(function (filter$$1) {
	        assert.fn(filter$$1.restore, "Transform[" + name + "] not support restore");
	      });
	    });
	  },
	  restore: function restore(value, scope, args) {
	    this.reachFilter(function (filter$$1, args, name) {
	      assert.fn(filter$$1.restore, "Transform[" + name + "] not support restore");
	      value = filter$$1.restore.call(filter$$1, value, args);
	    }, scope, args);
	    return value;
	  },
	  parseFilter: function parseFilter(name) {
	    var localTransforms = this.transforms;
	    var transform = localTransforms && localTransforms[name] || transforms[name];
	    assert(transform, "Transform[" + name + "] is undefined");
	    assert(isFn(transform) || isFn(transform.transform), "Invalid Transform[" + name + "].transform handler on " + (localTransforms && localTransforms[name] ? 'Local' : 'Global') + " Transforms");
	    assert(!transform.restore || isFn(transform.transform), "Invalid Transform[" + name + "].restore handler on " + (localTransforms && localTransforms[name] ? 'Local' : 'Global') + " Transforms");
	    return transform;
	  }
	});

	/*
	 * Transforms
	 *
	 * @Author: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Date: 2018-08-20 17:57:39
	 * @Last Modified by: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Last Modified time: 2018-08-20 18:30:39
	 */
	transforms.json = {
	  transform: function transform(value, param) {
	    if (isStr(value)) return "\"" + value + "\"";
	    var indent = +param.get(0);
	    return JSON.stringify(value, param.get(1), isNaN(indent) ? 0 : indent);
	  },
	  restore: function restore(value) {
	    return value && isStr(value) ? JSON.parse(value) : value;
	  }
	};
	transforms.trim = {
	  transform: function transform(value) {
	    return isStr(value) ? trim$1(value) : value;
	  },
	  restore: function restore(value) {
	    return isStr(value) ? trim$1(value) : value;
	  }
	};

	transforms.capitalize = function (value) {
	  return isStr(value) ? value.charAt(0).toUpperCase() + value.slice(1) : value;
	};

	transforms.uppercase = function (value) {
	  return isStr(value) ? value.toUpperCase() : value;
	};

	transforms.lowercase = function (value) {
	  return isStr(value) ? value.toLowerCase() : value;
	};

	transforms.plural = function (value) {
	  return isStr(value) ? plural(value) : value;
	};

	transforms.singular = function (value) {
	  return isStr(value) ? singular(value) : value;
	};

	transforms.unit = function (value, param) {
	  var unit = param.get(0),
	      fmt = param.get(1);
	  if (value > 1) unit = plural(unit);
	  return fmt ? format(fmt, value, unit) : value + ' ' + unit;
	};

	var units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'],
	    unitRestoreReg = /(KB|B|MB|GB|TB|PB)$/,
	    unitMap = makeMap(units, function (unit, i) {
	  return 1 << i * 10;
	});
	transforms.bytes = {
	  transform: function transform(value, param) {
	    var v = +value;
	    if (isNaN(v)) return value;
	    var digit = param.get(0, 2),
	        precision = Math.pow(10, digit),
	        i = Math.floor(Math.log(v) / Math.log(1024));
	    return Math.round(v * precision / Math.pow(1024, i)) / precision + ' ' + units[i];
	  },
	  restore: function restore(value) {
	    if (!isStr(value)) return value;
	    var unit,
	        v = value.replace(unitRestoreReg, function (match$$1) {
	      unit = match$$1;
	      return '';
	    });
	    if (!unit) return value;
	    v = +v;
	    if (isNaN(v)) return value;
	    return Math.round(v * unitMap[unit]);
	  }
	};

	transforms.format = function (value, param) {
	  var args = param.get();
	  args.splice(1, 0, value);
	  return applyNoScope$1(format, args);
	};

	/*
	 * VNode Expression
	 *
	 * @Author: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Date: 2018-08-20 17:58:36
	 * @Last Modified by: Tao Zeng (tao.zeng.zt@qq.com)
	 * @Last Modified time: 2018-11-07 16:02:15
	 */

	var _inherit$2;
	var VBindingText = inherit(function VBindingText(comp, expr) {
	  VText.call(this, comp);
	  this.expr = expr;
	}, VText, (_inherit$2 = {}, _inherit$2[VIRT_BINDING_TEXT] = true, _inherit$2.prepare = function prepare(text) {
	  return new TransformExpression(text);
	}, _inherit$2.mount = function mount() {
	  var expr = this.expr,
	      comp = this.comp;
	  this.text(expr.transformValue(comp, [this]));
	  comp.observeExpr(expr, this.exprHandler, this);
	}, _inherit$2.unmount = function unmount() {
	  this.comp.unobserveExpr(this.expr, this.exprHandler, this);
	}, _inherit$2.exprHandler = function exprHandler(path, value) {
	  var expr = this.expr,
	      comp = this.comp;
	  this.text(expr.simple ? expr.transform(value, comp, [this]) : expr.transformValue(comp, [this]));
	}, _inherit$2));

	var _inherit$3;
	var VElement = inherit(function VElement(comp, option) {
	  VNode.call(this, comp);
	  this.init(option);
	  this.initAttrs(option.attrs);
	  this.initDirectives(option.directives);
	}, VNode, (_inherit$3 = {}, _inherit$3[VIRT_ELEMENT] = true, _inherit$3.prepare = function prepare(option) {
	  var _this = this;

	  var directives = option.directives;

	  if (directives) {
	    var l = directives.length;
	    assert.by(l, function () {
	      for (var i = 0, g, D; i < l; i++) {
	        g = directives[i];
	        D = g.Directive;
	        assert(_this[D[PROTOTYPE].$nodeKey], "Can not bind directive[" + g.dname + ": " + fnName(D) + "] on " + fnName(_this.constructor) + ", require " + D[PROTOTYPE].$nodeName);
	      }
	    });
	    if (!l) option.directives = null;
	  }
	}, _inherit$3.init = function init() {}, _inherit$3.initDirectives = function initDirectives(directives) {
	  if (directives) {
	    var l = directives.length,
	        __directives = new Array(l);

	    for (var i = 0; i < l; i++) {
	      __directives[i] = directives[i](this);
	    }

	    this.directives = __directives;
	  }
	}, _inherit$3.mount = function mount() {
	  var directives = this.directives;

	  if (directives) {
	    var l = directives.length;

	    for (var i = 0; i < l; i++) {
	      directives[i].bind();
	    }
	  }
	}, _inherit$3.unmount = function unmount() {
	  var directives = this.directives;

	  if (directives) {
	    var i = directives.length;

	    while (i--) {
	      directives[i].unbind();
	    }
	  }
	}, _inherit$3));

	var _inherit$4;
	var _VElement$PROTOTYPE = VElement[PROTOTYPE],
	    _prepare = _VElement$PROTOTYPE.prepare,
	    _mount = _VElement$PROTOTYPE.mount,
	    _unmount = _VElement$PROTOTYPE.unmount;
	var VComplexElement = inherit(function VComplexElement(comp, option$$1) {
	  VElement.call(this, comp, option$$1);
	  this.initChildren(option$$1.children);
	}, VElement, (_inherit$4 = {}, _inherit$4[VIRT_COMPLEX_ELEMENT] = true, _inherit$4.$childKey = VIRT_NODE, _inherit$4.$childName = 'Virtual Node', _inherit$4.prepare = function prepare(option$$1, N) {
	  _prepare.call(this, option$$1, N);

	  var children = option$$1.children;

	  if (children) {
	    var l = children.length;

	    for (var i = 0, N; i < l; i++) {
	      N = children[i].VNode;
	      assert(N[PROTOTYPE][this.$childKey], "Child Node[" + i + ": " + children[i].ename + "] should be " + this.$childName);
	    }
	  }
	}, _inherit$4.initChildren = function initChildren(children) {
	  var childNodes = this[CHILD_NODES] = new List();
	  var l = children.length;

	  var __children = new Array(l);

	  for (var i = 0, child; i < l; i++) {
	    __children[i] = child = children[i](this.comp);
	    child.parent = this;
	    this.initChild(child);
	  }

	  childNodes.addAll(__children);
	}, _inherit$4.initChild = function initChild(child) {}, _inherit$4.mount = function mount() {
	  _mount.call(this);

	  this[CHILD_NODES].each(mountChildHandler);
	}, _inherit$4.unmount = function unmount() {
	  this[CHILD_NODES].each(unmountChildHandler);

	  _unmount.call(this);
	}, _inherit$4.childCount = function childCount() {
	  return this[CHILD_NODES].length;
	}, _inherit$4.first = function first() {
	  return this[CHILD_NODES].first();
	}, _inherit$4.last = function last() {
	  return this[CHILD_NODES].last();
	}, _inherit$4.prev = createSibling('prev'), _inherit$4.next = createSibling('next'), _inherit$4.append = createInsert('add'), _inherit$4.prepend = createInsert('addFirst'), _inherit$4.insertBefore = createInsertSibling('insertBefore'), _inherit$4.insertAfter = createInsertSibling('insertAfter'), _inherit$4.replace = function replace(node, target) {
	  assert(node[this.$childKey], "node should be " + this.$childName);
	  assert(this[CHILD_NODES].has(target), "target is not existing in this Node");
	  node.remove();
	  this[CHILD_NODES].insert(node, target);
	  target.remove();
	  node.parent = this;
	  return this;
	}, _inherit$4.eachChildren = function eachChildren(cb, scope) {
	  return this[CHILD_NODES].each(cb, scope);
	}, _inherit$4));

	function createSibling(get$$1) {
	  return function (node) {
	    assert(node[this.$childKey], "node should be " + this.$childName);
	    return this[CHILD_NODES][get$$1](node);
	  };
	}

	function createInsert(insert) {
	  return function (node) {
	    assert(node[this.$childKey], "node should be " + this.$childName);
	    node.remove();
	    this[CHILD_NODES][insert](node);
	    node.parent = this;
	  };
	  return this;
	}

	function createInsertSibling(insert) {
	  return function (node, target) {
	    assert(node[this.$childKey], "node should be " + this.$childName);
	    assert(this[CHILD_NODES].has(target), "target is not existing in this Node");
	    node.remove();
	    this[CHILD_NODES][insert](node, target);
	    node.parent = this;
	    return this;
	  };
	}

	function mountChildHandler(child) {
	  child.mount();
	}

	function unmountChildHandler(child) {
	  child.unmount();
	}

	/*
	 * <CompontentTag>
	 *      <div ref=""
	 * </CompontentTag>
	 *
	 * @Author: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Date: 2018-08-29 12:37:24
	 * @Last Modified by: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Last Modified time: 2018-09-05 14:01:41
	 */
	var Compontent = inherit(function Compontent(scope, option$$1) {
	  VComplexElement.call(this, this, option$$1);
	  var comp = null;

	  if (!isObj(scope)) {
	    assert(scope && scope.$comp, 'Require Parent Compontent');
	    comp = scope;
	    scope = comp.$scope;
	  }

	  var obs = observer$1(scope);
	  this.scope = obs.proxy;
	  this.$scope = obs.source;
	  this.$observer = obs;
	  this.parent = comp;
	}, VComplexElement, {
	  $comp: true,
	  prepare: function prepare(option$$1) {},
	  initAttrs: function initAttrs() {},
	  $getScope: function $getScope(attr) {
	    var $observer = this.$observer,
	        parent;

	    while (!hasOwnProp($observer.source, attr) && (parent = $observer.$parent) && attr in parent.source) {
	      $observer = parent;
	    }

	    return $observer;
	  },
	  getScope: function getScope(attr) {
	    return this.$getScope(attr).proxy;
	  },
	  observe: function observe$$1(path, cb, scope) {
	    path = parsePath(path);
	    this.$getScope(path[0]).observe(path, cb, scope);
	    return this;
	  },
	  unobserve: function unobserve$$1(path, cb, scope) {
	    this.$getScope(path[0]).unobserve(path, cb, scope);
	    return this;
	  },
	  observeExpr: function observeExpr(expr, cb, scope) {
	    var identities = expr.identities,
	        l = identities.length;

	    for (var i = 0; i < l; i++) {
	      this.observe(identities[i], cb, scope);
	    }

	    return this;
	  },
	  unobserveExpr: function unobserveExpr(expr, cb, scope) {
	    var identities = expr.identities,
	        l = identities.length;

	    for (var i = 0; i < l; i++) {
	      this.unobserve(identities[i], cb, scope);
	    }

	    return this;
	  },
	  onProxyChange: function onProxyChange(fn, scope) {
	    this.$observer.onProxyChange(fn, scope);
	    return this;
	  },
	  unProxyChange: function unProxyChange(fn, scope) {
	    this.$observer.unProxyChange(fn, scope);
	    return this;
	  },
	  destroy: function destroy() {}
	});

	var _inherit$5;
	var VComment = inherit(function VComment(comp, comment) {
	  VNode.call(this, comp);
	  this.comment = comment;
	}, VNode, (_inherit$5 = {}, _inherit$5[VIRT_COMMENT] = true, _inherit$5));

	/*
	 * @Author: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Date: 2018-08-29 12:36:45
	 * @Last Modified by: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Last Modified time: 2018-09-04 18:03:59
	 */
	var directives = create(null);
	function Directive(node, params) {
	  this.comp = node.comp;
	  this.node = node;
	  this.params = params;
	}
	inherit(Directive, {
	  $directive: true,
	  $nodeKey: '$virtElement',
	  $nodeName: 'Virtual Element',
	  prepare: function prepare() {},
	  bind: function bind() {},
	  unbind: function unbind() {},
	  observeExpr: function observeExpr(expr, cb, scope) {
	    return this.comp.observeExpr(expr, cb, scope);
	  },
	  unobserveExpr: function unobserveExpr(expr, cb, scope) {
	    return this.comp.unobserveExpr(expr, cb, scope);
	  }
	});
	function registerDirective(name, directive) {
	  name = name.toLowerCase();
	  assert(!directives[name], "Double Register Directive[" + name + "]");

	  if (!isFn(directive)) {
	    if (!directive.extend) directive.extend = Directive;
	    directive = createClass(directive);
	  }

	  assert(directive[PROTOTYPE].$directive, "Invalid Directive[" + name + "], should extend Directive");
	  directives[name] = directive;
	  return directive;
	}
	function directive(name, value, params) {
	  var Directive = directives[name];
	  assert(Directive, "Directive[" + name + "] is undefined");
	  if (!params) params = {};
	  params.value = value;
	  params = Directive[PROTOTYPE].prepare(params, Directive) || params;
	  generator.params = params;
	  generator.dname = name;
	  generator.Directive = Directive;

	  function generator(node) {
	    return new Directive(node, params);
	  }

	  return generator;
	}

	var VElements = create(null);
	var tags = create(VElements);
	var Text, BindingText, Comment;
	function registerVElement(name, VElement) {
	  assert(!VElements[name], "Double Register Virtual Element: " + fnName(VElement) + " <" + name + ">");
	  assert(VElement[PROTOTYPE][VIRT_ELEMENT], "Invalid Virtual Element: " + fnName(VElement) + " <" + name + ">");
	  VElements[name] = VElement;
	  return VElement;
	}
	function registerVText(VText) {
	  assert(!Text, "Double Register Virtual Text");
	  assert(VText[PROTOTYPE][VIRT_TEXT], "Invalid Virtual Node: " + fnName(VText));
	  Text = VText;
	  return Text;
	}
	function registerVBindingText(VBindingText) {
	  assert(!BindingText, "Double Register Virtual Binding Text");
	  assert(VBindingText[PROTOTYPE][VIRT_BINDING_TEXT], "Invalid Virtual Binding Text: " + fnName(VBindingText));
	  BindingText = VBindingText;
	  return BindingText;
	}
	function registerVComment(VComment) {
	  assert(!Comment, "Double Register Virtual Comment ");
	  assert(VComment[PROTOTYPE][VIRT_COMMENT], "Invalid Virtual Comment: " + fnName(VComment));
	  Comment = VComment;
	  return VComment;
	}
	function elem(name, attrs, directives, children) {
	  var VElement = VElements[name];
	  if (children && !children.length) children = undefined;
	  assert(VElement, "Virtual Element[" + name + "] is undefined");
	  assert(!children || !children.length || VElement[PROTOTYPE][VIRT_COMPLEX_ELEMENT], "Virtual Element[" + name + "] have no children");
	  var gen = generator(VElement, {
	    attrs: attrs,
	    directives: directives,
	    children: children
	  });
	  gen.ename = name;
	  return gen;
	}
	function text(text, isExpr) {
	  return generator(isExpr ? BindingText : Text, text);
	}
	function comment(comment) {
	  return generator(Comment, comment);
	}

	function generator(VNode$$1, option) {
	  option = VNode$$1[PROTOTYPE].prepare(option, VNode$$1) || option;

	  function generator(comp) {
	    return new VNode$$1(comp, option);
	  }

	  generator.VNode = VNode$$1;
	  generator.option = option;
	  return generator;
	}

	var ADD_EVENT_LISTENER = 'addEventListener',
	    ATTACH_EVENT = 'attachEvent',
	    DOCUMENT_ELEMENT = 'documentElement',
	    DEFAULT_VIEW = 'defaultView',
	    PARENT_WINDOW = 'parentWindow',
	    APPEND_CHILD = 'appendChild',
	    REMOVE_CHILD = 'removeChild',
	    INSERT_BEFORE = 'insertBefore',
	    REPLACE_CHILD = 'replaceChild',
	    PARENT_NODE = 'parentNode',
	    CONTAINS = 'contains',
	    INNER_HTML = 'innerHTML',
	    CREATE_ELEMENT = 'createElement',
	    OWNER_DOCUMENT = 'ownerDocument',
	    SET_ATTRIBUTE = 'setAttribute',
	    GET_ATTRIBUTE = 'getAttribute',
	    REMOVE_ATTRIBUTE = 'removeAttribute',
	    CHECKED = 'checked',
	    SELECTED = 'selected',
	    DISABLED = 'disabled',
	    READ_ONLY = 'readOnly',
	    TAB_INDEX = 'tabIndex',
	    HTML_FOR = 'htmlFor',
	    CLASS_NAME$1 = 'className',
	    CURRENT_TARGET = 'currentTarget',
	    PREVENT_DEFAULT = 'preventDefault',
	    STOP_PROPAGATION = 'stopPropagation',
	    STOP_IMMEDIATE_PROPAGATION = 'stopImmediatePropagation',
	    CLIENT_TOP = 'clientTop',
	    CLIENT_LEFT = 'clientLeft',
	    SCROLL_LEFT = 'scrollLeft',
	    SCROLL_TOP = 'scrollTop',
	    PAGE_XOFFSET = 'pageXOffset',
	    PAGE_YOFFSET = 'pageYOffset',
	    CLIENTX = 'clientX',
	    CLIENTY = 'clientY',
	    PAGEX = 'pageX',
	    PAGEY = 'pageY';
	var ROOTELEMENT = document[DOCUMENT_ELEMENT];
	var DIV$1 = document[CREATE_ELEMENT]('div');
	function getWindow(el) {
	  return el.window && el.document ? el : el.nodeType === 9 ? el[DEFAULT_VIEW] || el[PARENT_WINDOW] : undefined;
	}
	function inDoc(el, root) {
	  if (!root) root = ROOTELEMENT;
	  if (root[CONTAINS]) return root[CONTAINS](el);

	  while (el = el[PARENT_NODE]) {
	    if (el === root) return true;
	  }

	  return false;
	}
	function query(selectors) {
	  return isStr(selectors) ? document.querySelector(selectors) : isArrayLike$1(selectors) ? selectors[0] : selectors;
	}
	function prependChild$1(parent, el) {
	  var first = parent.firstChild;
	  first ? first !== el && parent[INSERT_BEFORE](el, first) : parent[APPEND_CHILD](el);
	}
	function insertAfter(el, prev) {
	  var next = prev.nextSibling;
	  next ? next !== el && prev[PARENT_NODE][INSERT_BEFORE](el, next) : prev[PARENT_NODE][APPEND_CHILD](el);
	}
	function insertBefore(el, next) {
	  el !== next.previousSibling && next[PARENT_NODE][INSERT_BEFORE](el, next);
	}

	function HTMLMixin (VNode$$1) {
	  var _remove = VNode$$1[PROTOTYPE].remove;
	  return {
	    $htmlNode: true,
	    appendTo: function appendTo(parent) {
	      if (parent[VIRT_NODE]) {
	        parent.append(this);
	      } else {
	        query(parent)[APPEND_CHILD](this.el);
	      }

	      return this;
	    },
	    prependTo: function prependTo(parent) {
	      if (parent[VIRT_NODE]) {
	        parent.prepend(this);
	      } else {
	        prependChild$1(query(parent), this.el);
	      }

	      return this;
	    },
	    insertBeforeTo: function insertBeforeTo(target) {
	      if (target[VIRT_NODE]) {
	        target.parent.insertBefore(this, target);
	      } else {
	        insertAfter(this.el, query(target));
	      }

	      return this;
	    },
	    insertAfterTo: function insertAfterTo(target) {
	      if (target[VIRT_NODE]) {
	        target.parent.insertAfter(this, target);
	      } else {
	        insertBefore(this.el, query(target));
	      }

	      return this;
	    },
	    replaceTo: function replaceTo(target) {
	      if (target[VIRT_NODE]) {
	        target.parent.replace(this, target);
	      } else {
	        taget = query(target);
	        target[PARENT_NODE][REPLACE_CHILD](this.el, target);
	      }

	      return this;
	    },
	    remove: function remove() {
	      var el = this.el,
	          pEl = el[PARENT_NODE];
	      pEl && pEl[REMOVE_CHILD](el);
	      return _remove.call(this);
	    }
	  };
	}

	/*
	 *
	 * @Author: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Date: 2018-08-25 17:47:25
	 * @Last Modified by: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Last Modified time: 2018-09-01 11:29:48
	 */
	var DOM_ELEMENT = '__element__';
	var OUTER_HTML = 'outerHTML';
	var ElementMixin = {
	  $htmlElement: true,
	  init: function init(option) {
	    var el = document[CREATE_ELEMENT](this.tagName);
	    el[DOM_ELEMENT] = this;
	    this.el = el;
	    this.initDomEvent();
	  },
	  inDoc: function inDoc$$1() {
	    return inDoc(this.el);
	  },
	  outerHtml: function outerHtml() {
	    var el = this.el;
	    if (el[OUTER_HTML]) return el[OUTER_HTML];
	    DIV[APPEND_CHILD](el.cloneNode(true));
	    var html = DIV[INNER_HTML];
	    DIV[INNER_HTML] = '';
	    return html;
	  },
	  focus: function focus() {
	    this.el.focus();
	    return this;
	  }
	};

	function createHook (normal, __hooks, defKey, recive) {
	  var hooks = create(null),
	      revices = recive && create(null);
	  __hooks && addHook(__hooks);
	  return {
	    addHook: addHook,
	    getHook: function getHook(key) {
	      return hooks[key] || normal;
	    },
	    hookMember: function hookMember(key, member) {
	      var hook = hooks[key];
	      return hook && hook[member];
	    },
	    memberHook: function memberHook(key, member) {
	      var hook = hooks[key];
	      if (hook && hook[member]) return hook;
	      if (normal[member]) return normal;
	    },
	    hookRevice: function hookRevice(key) {
	      return revices[key];
	    }
	  };

	  function addHook(key, hook) {
	    if (arguments.length === 1) {
	      for (var k in key) {
	        if (hasOwnProp(key, k)) doAdd(k, key[k]);
	      }
	    } else {
	      return doAdd(key, hook);
	    }
	  }

	  function doAdd(key, hook) {
	    if (!isObj(hook)) {
	      var _hook;

	      hook = (_hook = {}, _hook[defKey] = hook, _hook);
	    }

	    if (revices && hook[recive]) revices[hook[recive]] = key;
	    hooks[key] = hook;
	    return hook;
	  }
	}

	/*
	 *
	 * @Author: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Date: 2018-08-20 17:54:34
	 * @Last Modified by: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Last Modified time: 2018-09-01 12:47:27
	 */
	var GET_ATTRIBUTENODE = GET_ATTRIBUTE + 'Node';
	var NAME = 'name',
	    GET = 'get',
	    SET = 'set';

	var _createHook = createHook({
	  get: function get(el, name) {
	    return el[name];
	  },
	  set: function set(el, name, value) {
	    el[name] = value;
	  }
	}, {
	  tabIndex: {
	    get: function get(el, name) {
	      var attributeNode = el[GET_ATTRIBUTENODE]('tabindex');
	      return attributeNode && attributeNode.specified ? parseInt(attributeNode.value, 10) : rfocusable.test(el.nodeName) || rclickable.test(el.nodeName) && el.href ? 0 : undefined;
	    }
	  }
	}, {
	  tabindex: TAB_INDEX,
	  readonly: READ_ONLY,
	  'for': HTML_FOR,
	  'class': 'className',
	  maxlength: 'maxLength',
	  cellspacing: 'cellSpacing',
	  cellpadding: 'cellPadding',
	  rowspan: 'rowSpan',
	  colspan: 'colSpan',
	  usemap: 'useMap',
	  frameborder: 'frameBorder',
	  contenteditable: 'contentEditable'
	}, NAME),
	    hookMember = _createHook.hookMember,
	    memberHook = _createHook.memberHook,
	    addHook = _createHook.addHook;

	var ElementAttrMixin = {
	  initAttrs: function initAttrs(attrs) {
	    attrs && this.attr(attrs);
	  },
	  attr: function attr(name, value) {
	    var el = this.el;

	    if (arguments.length === 1) {
	      if (isStr(name)) return el[GET_ATTRIBUTE](name);
	      $eachObj(name, function (value, name) {
	        el[SET_ATTRIBUTE](name, value);
	      });
	    } else {
	      el[SET_ATTRIBUTE](name, value);
	    }

	    return this;
	  },
	  removeAttr: function removeAttr(name) {
	    this.el[REMOVE_ATTRIBUTE](name);
	    return this;
	  },
	  prop: function prop(name, value) {
	    var el = this.el;

	    if (arguments.length === 1) {
	      if (isStr(name)) return getProp(el, name);
	      $eachObj(name, function (value, name) {
	        setProp(el, name, value);
	      });
	    } else {
	      setProp(el, name, value);
	    }

	    return this;
	  },
	  checked: propAccessor(CHECKED),
	  selected: propAccessor(SELECTED),
	  disabled: propAccessor(DISABLED),
	  readonly: propAccessor(READ_ONLY),
	  tabindex: propAccessor(TAB_INDEX),
	  "for": propAccessor(HTML_FOR)
	};

	function propAccessor(PROP) {
	  return function (value) {
	    var el = this.el;

	    if (arguments.length) {
	      setProp(el, PROP, value);
	      return this;
	    }

	    return getProp(el, PROP);
	  };
	}

	function getProp(el, name) {
	  name = hookMember(name, NAME);
	  return memberHook(name, GET)[GET](el, name);
	}

	function setProp(el, name, value) {
	  name = hookMember(name, NAME);
	  memberHook(name, SET)[SET](el, name, value);
	}

	/*
	 * element class operations
	 *
	 * @Author: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Date: 2018-08-20 17:48:52
	 * @Last Modified by: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Last Modified time: 2018-09-01 12:43:08
	 */
	var CLASS_LIST = 'classList';
	var wsReg$1 = /\s+/g;
	var addClass = DIV$1[CLASS_LIST] ? mkClasslistUpdator('add') : function (el, className) {
	  className = parseClassNameArray(className);
	  if (className.length) el[CLASS_NAME$1] = trim$1(clearClassName(el[CLASS_NAME$1], className) + ' ' + className.join(' '));
	  return this;
	},
	    removeClass = DIV$1[CLASS_LIST] ? mkClasslistUpdator('remove') : function (el, className) {
	  className = parseClassNameArray(className);
	  if (className.length) el[CLASS_NAME$1] = trim$1(clearClassName(el[CLASS_NAME$1], className));
	  return this;
	};
	var ElementClassMixin = {
	  className: function className(_className) {
	    var el = this.el;

	    if (arguments.length) {
	      el[CLASS_NAME$1] = parseClassName(_className);
	      return this;
	    }

	    return trim$1(el[CLASS_NAME$1]).split(wsReg$1);
	  },
	  addClass: addClass,
	  removeClass: removeClass,
	  margeClass: function margeClass(obj) {
	    var el = this.el,
	        adds = [],
	        clears = [];
	    var name, val;

	    for (name in obj) {
	      val = obj[name];

	      switch (val) {
	        case true:
	          adds.push(name);

	        case false:
	          clears.push(name);
	      }
	    }

	    el[CLASS_NAME$1] = trim$1(clearClassName(el[CLASS_NAME$1], clears) + ' ' + adds.join(' '));
	    return this;
	  }
	};

	function mkClasslistUpdator(method) {
	  return function (className) {
	    className = parseClassNameArray(className);
	    var classList = this.el[CLASS_LIST];
	    var i = className.length;

	    while (i--) {
	      classList[method](className[i]);
	    }

	    return this;
	  };
	}

	var clearRegCache = create(null);

	function clearClassName(className, removes) {
	  removes = removes.join('|');
	  var reg = clearRegCache[removes] || (clearRegCache[removes] = new RegExp('(\\s+|^)(' + removes + ')', 'g'));
	  return className.replace(reg, '');
	}

	function parseClassName(className) {
	  if (isStr(className)) return trim$1(className);
	  return parseClassNameArrayByObj(className).join(' ');
	}

	function parseClassNameArray(className) {
	  if (isStr(className)) return trim$1(className).split(wsReg$1);
	  return parseClassNameArrayByObj(className);
	}

	function parseClassNameArrayByObj(className) {
	  if (isArray(className)) return className;
	  var names = [];
	  var key,
	      i = 0;

	  for (key in className) {
	    if (className[key] === true) names[i++] = key;
	  }

	  return names;
	}

	/*
	 * @Author: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Date: 2018-09-01 10:51:15
	 * @Last Modified by: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Last Modified time: 2018-09-01 11:15:03
	 */
	var W3C = !!window.dispatchEvent;
	var IE8 = !!window.XDomainRequest;
	var IE9 = navigator.userAgent.indexOf('MSIE 9') !== -1;
	var readyList = [];

	function fireReady(fn) {

	  while (fn = readyList.shift()) {
	    fn();
	  }

	  readyList = undefined;
	}

	var READY_STATE = 'readyState',
	    DO_SCROLL = 'doScroll';

	if (document[READY_STATE] === 'complete') {
	  nextTick(fireReady);
	} else if (document[ADD_EVENT_LISTENER]) {
	  document[ADD_EVENT_LISTENER]('DOMContentLoaded', fireReady);
	} else if (document[ATTACH_EVENT]) {
	  document[ATTACH_EVENT]('onreadystatechange', function () {
	    if (document[READY_STATE] === 'complete') fireReady();
	  });

	  if (ROOTELEMENT[DO_SCROLL] && window.frameElement === null && window.external) {
	    var doScrollCheck = function doScrollCheck() {
	      try {
	        ROOTELEMENT[DO_SCROLL]('left');
	        fireReady();
	      } catch (e) {
	        nextTick(doScrollCheck);
	      }
	    };

	    doScrollCheck();
	  }
	}

	/*
	 * element css opeartions
	 *
	 * @Author: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Date: 2018-08-20 17:49:56
	 * @Last Modified by: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Last Modified time: 2018-09-01 11:55:15
	 */
	var numberCss = makeMap('animationIterationCount,columnCount,order,flex,flexGrow,flexShrink,' + 'fillOpacity,fontWeight,lineHeight,opacity,orphans,widows,zIndex,zoom');
	var GET$1 = 'get',
	    SET$1 = 'set';
	var nameHooks = create(null);

	var _createHook$1 = createHook({
	  get: function get(el, name) {
	    if (name === 'background') name = 'backgroundColor';
	    return getStyle(el, name);
	  },
	  set: function set(el, name, value) {
	    el.style[name] = value;
	  }
	}),
	    memberHook$1 = _createHook$1.memberHook,
	    addHook$1 = _createHook$1.addHook;

	nameHooks.float = W3C ? 'cssFloat' : 'styleFloat';
	var OFFSET_PARENT = 'offsetParent',
	    GET_BOUNDING_CLIENT_RECT = 'getBoundingClientRect',
	    FILTER = 'filter',
	    POSITION = 'position'; // ========================= Mixin =================================

	function setCss(el, name, value) {
	  name = camelize(name);

	  if (isNil(value)) {
	    value = '';
	  } else if (!numberCss[name] && isFinite(value)) {
	    value += 'px';
	  }

	  memberHook$1(name, SET$1)[SET$1](el, cssHookName(name), value, name);
	}

	var ElementStyleMixin = {
	  css: function css(name, value) {
	    var el = this.el;

	    if (arguments.length === 1) {
	      if (isStr(name)) {
	        name = camelize(name);

	        var _value = memberHook$1(name, GET$1)[GET$1](el, cssHookName(name), name),
	            num = parseFloat(_value);

	        return isFinite(num) ? num : _value;
	      }

	      $eachObj(name, function (value, name) {
	        setCss(el, name, value);
	      });
	    } else {
	      setCss(el, name, value);
	    }

	    return this;
	  },
	  offset: function offset() {
	    var el = this.el,
	        doc = el[OWNER_DOCUMENT],
	        box = {
	      top: 0,
	      left: 0
	    };
	    if (!doc) return box;
	    var body = doc.body,
	        win = doc[DEFAULT_VIEW] || doc[PARENT_WINDOW];
	    if (!inDoc(el)) return box;

	    if (el[GET_BOUNDING_CLIENT_RECT]) {
	      var rect = el[GET_BOUNDING_CLIENT_RECT]();
	      box.top = rect.top;
	      box.left = rect.left;
	    }

	    var clientTop = ROOTELEMENT[CLIENT_TOP] || body[CLIENT_TOP],
	        clientLeft = ROOTELEMENT[CLIENT_LEFT] || body[CLIENT_LEFT],
	        scrollTop = Math.max(win[PAGE_YOFFSET] || 0, ROOTELEMENT[SCROLL_TOP], body[SCROLL_TOP]),
	        scrollLeft = Math.max(win[PAGE_XOFFSET] || 0, ROOTELEMENT[SCROLL_LEFT], body[SCROLL_LEFT]);
	    box.top += scrollTop - clientTop;
	    box.left += scrollLeft - clientLeft;
	    return box;
	  },
	  position: function position() {
	    var el = this.el;
	    var top, left;

	    if (getStyle(el, POSITION) === 'fixed') {
	      var o = el[GET_BOUNDING_CLIENT_RECT]();
	      top = o.top;
	      left = o.left;
	    } else {
	      var o = this.offset(el),
	          p = offsetParent(el);
	      top = o.top - getNumStyle(p, 'borderTopWidth') + this.scrollTop(p);
	      left = o.left - getNumStyle(p, 'borderLeftWidth') + this.scrollLeft(p);

	      if (p.tagName !== 'HTML') {
	        var op = this.offset(p);
	        top -= op.top;
	        left -= op.left;
	      }
	    }

	    return {
	      top: top - getNumStyle(el, 'marginTop'),
	      left: left - getNumStyle(el, 'marginLeft')
	    };
	  },
	  scrollTop: function scrollTop() {
	    var el = this.el,
	        win = getWindow(el);
	    return (win ? SCROLL_TOP in win ? win[SCROLL_TOP] : ROOTELEMENT[PAGE_YOFFSET] : el[PAGE_YOFFSET]) || 0;
	  },
	  scrollLeft: function scrollLeft() {
	    var el = this.el,
	        win = getWindow(el);
	    return (win ? SCROLL_LEFT in win ? win[SCROLL_LEFT] : ROOTELEMENT[PAGE_XOFFSET] : el[PAGE_XOFFSET]) || 0;
	  },
	  scrollTo: function scrollTo(left, top) {
	    var el = this.el,
	        win = getWindow(el);

	    if (win) {
	      win.scrollTo(left, top);
	    } else {
	      el[PAGE_XOFFSET] = left;
	      el[PAGE_YOFFSET] = top;
	    }
	  }
	};

	function offsetParent(el) {
	  var p = el[OFFSET_PARENT];

	  while (p && getStyle(p, POSITION) === 'static') {
	    p = p[OFFSET_PARENT];
	  }

	  return p || ROOTELEMENT;
	} // ========================= css opeartions =================================


	var cssPrefixes = ['', '-webkit-', '-o-', '-moz-', '-ms-'],
	    host = ROOTELEMENT.style,
	    cssPrefixeSize = cssPrefixes.length;

	function cssHookName(name) {
	  var fixedName = nameHooks[name];
	  if (fixedName) return fixedName;

	  for (var i = 0; i < cssPrefixeSize; i++) {
	    fixedName = camelize(cssPrefixes[i] + name);

	    if (fixedName in host) {
	      nameHooks[name] = fixedName;
	      return fixedName;
	    }
	  }

	  throw new Error("invalid style[" + name + "]");
	}

	var GET_COMPUTED_STYLE = 'getComputedStyle';
	var computedStyle = !!window[GET_COMPUTED_STYLE];

	function getNumStyle(el, name) {
	  var val = getStyle(el, name),
	      i = parseFloat(val);
	  return i === i ? i : 0;
	}

	var getStyle;

	if (computedStyle) {
	  getStyle = function getStyle(el, name) {
	    var styles = window[GET_COMPUTED_STYLE](el, null);
	    var value;

	    if (styles) {
	      value = name === FILTER ? styles.getPropertyValue(name) : styles[name];
	      if (value === '') value = el.style[name];
	    }

	    return value;
	  };
	} else {
	  var RUNTIME_STYLE = 'runtimeStyle',
	      rnumnonpx = /^-?(?:\d*\.)?\d+(?!px)[^\d\s]+$/i,
	      rposition = /^(top|right|bottom|left)$/,
	      border = {
	    thin: IE8 ? '1px' : '2px',
	    medium: IE8 ? '3px' : '4px',
	    thick: IE8 ? '5px' : '6px'
	  };

	  getStyle = function getStyle(el, name) {
	    var currentStyle = el.currentStyle;
	    var value = currentStyle[name];

	    if (rnumnonpx.test(value) && !rposition.test(value)) {
	      var style = el.style,
	          left = style.left,
	          rsLeft = el[RUNTIME_STYLE].left;
	      el[RUNTIME_STYLE].left = currentStyle.left;
	      style.left = name === 'fontSize' ? '1em' : value || 0;
	      value = style.pixelLeft + 'px';
	      style.left = left;
	      el[RUNTIME_STYLE].left = rsLeft;
	    }

	    if (value === 'medium') {
	      name = name.replace('Width', 'Style');
	      if (currentStyle[name] === 'none') value = '0px';
	    }

	    return value === '' ? 'auto' : border[value] || value;
	  };
	}

	var camelizeReg = /[-_][^-_]/g;

	function camelize(target) {
	  return target ? target.replace(camelizeReg, camelizeHandler) : target;
	}

	function camelizeHandler(match) {
	  return match.charAt(1).toUpperCase();
	} // ========================= hooks =================================


	var OPACITY = 'opacity';

	if (computedStyle) {
	  addHook$1(OPACITY, {
	    get: function get(el, name) {
	      var value = getStyle(el, name);
	      return value === '' ? 1 : value;
	    }
	  });
	} else {
	  var FILTERS = FILTER + 's',
	      salpha = 'DXImageTransform.Microsoft.Alpha',
	      ralpha = /alpha\([^)]*\)/i;
	  addHook$1(OPACITY, {
	    get: function get(el, name) {
	      var alpha = el[FILTERS].alpha || el[FILTERS][salpha],
	          op = alpha && alpha.enabled ? alpha[OPACITY] : 100;
	      return op / 100;
	    },
	    set: function set(el, name, value) {
	      var style = el.style,
	          opacity = isFinite(value) && value <= 1 ? "alpha(" + OPACITY + "=" + value * 100 + ")" : '',
	          filter$$1 = style[FILTER] || '';
	      style.zoom = 1;
	      style[FILTER] = trim(ralpha.test(filter$$1) ? filter$$1.replace(ralpha, opacity) : filter$$1 + ' ' + opacity);
	      if (!style[FILTER]) style[REMOVE_ATTRIBUTE](FILTER);
	    }
	  });
	}

	/*
	 * Dom Value opeartions
	 *
	 * @Author: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Date: 2018-08-20 17:54:59
	 * @Last Modified by: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Last Modified time: 2018-09-01 11:43:09
	 */
	var GET$2 = 'get',
	    SET$2 = 'set';
	var ElementValueMixin = {
	  value: function value(_value) {
	    var el = this.el;
	    var type = el.tagName;
	    if (type === 'INPUT') type = el.type;

	    if (arguments.length) {
	      memberHook$2(type, SET$2)[SET$2](el, _value, type);
	      return this;
	    }

	    return memberHook$2(type, GET$2)[GET$2](el, type);
	  }
	};
	var EMPTY_MAP = create(null),
	    SELECTED_INDEX = 'selectedIndex',
	    SELECT_ONE = 'select-one',
	    OPTIONS = 'options';

	var _createHook$2 = createHook({
	  get: function get(el) {
	    return el.value || '';
	  },
	  set: function set(el, value) {
	    el.value = strval(value);
	  }
	}, {
	  option: {
	    get: function get(el) {
	      return getOptionValue(el);
	    }
	  },
	  select: {
	    get: function get(el) {
	      var signle = el.type == SELECT_ONE,
	          index = el[SELECTED_INDEX];
	      if (index < 0) return signle ? undefined : [];
	      var options = el[OPTIONS],
	          l = options.length;
	      var option,
	          i = 0;

	      if (!signle) {
	        var values$$1 = [];

	        for (; i < l; i++) {
	          option = options[i];
	          if (option[SELECTED] || i === index) values$$1.push(getOptionValue(option));
	        }

	        return values$$1;
	      }

	      for (; i < l; i++) {
	        option = options[i];
	        if (option[SELECTED] || i === index) return getOptionValue(option);
	      }
	    },
	    set: function set(el, value) {
	      var signle = el.type == SELECT_ONE,
	          options = el[OPTIONS],
	          l = options.length;
	      var option,
	          i = 0;

	      if (signle) {
	        for (; i < l; i++) {
	          option = options[i];

	          if (getOptionValue(option) === value) {
	            option[SELECTED] = true;
	            break;
	          }
	        }
	      } else {
	        el[SELECTED_INDEX] = -1;
	        var map$$1;

	        if (isNil(value)) {
	          map$$1 = EMPTY_MAP;
	        } else if (isArray(value)) {
	          map$$1 = makeMap(value);
	        } else if (isObj(value)) {
	          map$$1 = value;
	        } else {
	          map$$1 = create(null);
	          map$$1[value] = true;
	        }

	        for (; i < l; i++) {
	          option = options[i];
	          if (map$$1[getOptionValue(option)] === true) option[SELECTED] = true;
	        }
	      }
	    }
	  }
	}),
	    memberHook$2 = _createHook$2.memberHook,
	    addHook$2 = _createHook$2.addHook;

	function getOptionValue(el) {
	  var val = el.attributes.value;
	  return !val || val.specified ? el.value : el.text;
	}

	var TYPE = 'type';

	var _createHook$3 = createHook(null, null, TYPE, TYPE),
	    getHook = _createHook$3.getHook,
	    hookRevice = _createHook$3.hookRevice,
	    addHook$3 = _createHook$3.addHook; // ========================= Mixin =================================


	var DOM_ELEMENT$1 = '__element__';
	var MIXIN_EVENTS = '__domEvents',
	    MIXIN_ADD_LISTEN = '__addDomListen',
	    MIXIN_DEL_LISTEN = '__delDomListen',
	    MIXIN_EMIT_LISTEN = '__emitDomEvent';
	var EventMixin = {
	  initDomEvent: function initDomEvent() {
	    this.el[DOM_ELEMENT$1] = this;
	    this[MIXIN_EVENTS] = create(null);
	  },
	  on: function on(type, fn, scope) {
	    assert.fn(fn, 'Invalid Event Listener');

	    if (this[MIXIN_ADD_LISTEN](type, fn, scope) === 1) {
	      var el = this.el,
	          hook = getHook(type);

	      if (hook) {
	        if (hook.type) type = hook.type;
	        if (hook.bind && hook.bind(el, type) === false) return;
	      }

	      bindDispatcher(el, type);
	    }
	  },
	  un: function un(type, fn, scope) {
	    assert.fn(fn, 'Invalid Event Listener');

	    if (this[MIXIN_DEL_LISTEN](type, fn, scope) === 0) {
	      var el = this.el,
	          hook = getHook(type);

	      if (hook) {
	        if (hook.type) type = hook.type;
	        if (hook.unbind && hook.unbind(el, type) === false) return;
	      }

	      unbindDispatcher(el, type);
	    }
	  },
	  once: function once(type, fn, scope) {
	    assert.fn(fn, 'Invalid Event Listener');
	    var el = this.el,
	        binding = fn[DEFAULT_FN_BINDING],
	        self = this;
	    if (binding) proxy[DEFAULT_FN_BINDING] = binding;
	    this.on(type, proxy, scope);
	    if (!binding) fn[DEFAULT_FN_BINDING] = cb[DEFAULT_FN_BINDING];

	    function proxy() {
	      applyScope(fn, this, arguments);
	      self.un(type, proxy, scope);
	    }
	  }
	};

	EventMixin[MIXIN_ADD_LISTEN] = function (type, fn, scope) {
	  var events = this[MIXIN_EVENTS],
	      listens = events[type] || (events[type] = new FnList());
	  return listens.add(fn, scope);
	};

	EventMixin[MIXIN_DEL_LISTEN] = function (type, fn, scope) {
	  var events = this[MIXIN_EVENTS],
	      listens = events[type];
	  return listens && listens.remove(fn, scope);
	};

	EventMixin[MIXIN_EMIT_LISTEN] = function (type, event) {
	  var _this = this;

	  var events = this[MIXIN_EVENTS],
	      listens = events[type];

	  if (listens && listens.size()) {
	    if (!event.$hookEvent) {
	      event = packEvent(type, event);
	      var target = event.target;
	      event.targetEl = target;
	      event.target = target[DOM_ELEMENT$1];
	    }

	    event.current = this;
	    event[IS_IMMEDIATE_PROPAGATION_STOPPED] = false;
	    listens.each(function (fn, scope) {
	      return fn.call(scope || _this, event, _this) !== false && !event[IS_IMMEDIATE_PROPAGATION_STOPPED];
	    });
	  }

	  return event;
	};
	var ORIGINAL_EVENT = 'originalEvent',
	    RETURN_VALUE = 'returnValue',
	    GET_PREVENT_DEFAULT = 'getPreventDefault',
	    TIME_STAMP = 'timeStamp',
	    ORIGINAL_PROPS = 'originalProps',
	    IS_IMMEDIATE_PROPAGATION_STOPPED = 'isImmediatePropagationStopped',
	    CANCEL_BUBBLE = 'cancelBubble'; // ========================= event tool =================================

	var addEventListener = W3C ? function (el, type, fn) {
	  el[ADD_EVENT_LISTENER](type, fn, type !== 'focus' && type !== 'blur');
	} : function (el, type, fn) {
	  el[ATTACH_EVENT]('on' + type, fn);
	},
	    removeEventListener = W3C ? function (el, type, fn) {
	  el.removeEventListener(type, fn);
	} : function (el, type, fn) {
	  el.detachEvent('on' + type, fn);
	}; // ========================= bind event dispatcher =================================

	var bubbleUpEvents = makeMap('click,dblclick,keydown,keypress,keyup,mousedown,mousemove,mouseup,mouseover,' + 'mouseout,wheel,mousewheel,input,beforeinput,compositionstart,compositionupdate,' + 'compositionend,cut,copy,paste,beforecut,beforecopy,beforepaste,focusin,focusout,' + 'DOMFocusIn,DOMFocusOut,DOMActivate,dragend,datasetchanged');
	if (W3C) bubbleUpEvents.change = bubbleUpEvents.select = true;

	function listenEl(el) {
	  return bubbleUpEvents[el.type] ? ROOTELEMENT : el;
	}

	var DOM_DISPATCH_EVENTS = '__dispatch_events__';

	function bindDispatcher(el, type) {
	  el = listenEl(el);
	  var events = el[DOM_DISPATCH_EVENTS] || (el[DOM_DISPATCH_EVENTS] = create(null)),
	      num = events[type] || 0;
	  if (!num) addEventListener(el, type, dispatch);
	  events[type] = num + 1;
	}

	function unbindDispatcher(el, type) {
	  el = listenEl(el);
	  var events = el[DOM_DISPATCH_EVENTS],
	      num = events && events[type];

	  if (num) {
	    if (num === 1) removeEventListener(el, type, dispatch);
	    events[type] = num - 1;
	  }
	} // ========================= hook =================================


	var keyEventReg = /^key/,
	    CHARCODE = 'charCode',
	    KEYCODE = 'keyCode',
	    WHICH = 'which',
	    keyEventProps = ['char', 'key', CHARCODE, KEYCODE],
	    keyEventHook = {
	  fix: function fix(event, original) {
	    event[ORIGINAL_PROPS](keyEventProps);
	    if (!event[WHICH]) event[WHICH] = original[CHARCODE] != null ? original[CHARCODE] : original[KEYCODE];
	  }
	},
	    mouseEventReg = /^(?:mouse|contextmenu|drag)|click/,
	    BUTTON = 'button',
	    mouseEventProps = [BUTTON, BUTTON + 's', CLIENTX, CLIENTY, 'offsetX', 'offsetY', PAGEX, PAGEY, 'screenX', 'screenY', 'toElement'],
	    mouseEventHook = {
	  fix: function fix(event, original) {
	    var button = original[BUTTON];
	    event[ORIGINAL_PROPS](mouseEventProps);

	    if (!event[PAGEX] && original[CLIENTX]) {
	      var eventDoc = event.target[OWNER_DOCUMENT] || document,
	          doc = eventDoc[DOCUMENT_ELEMENT],
	          body = eventDoc.body;
	      event[PAGEX] = original[CLIENTX] + (doc && doc[SCROLL_LEFT] || body && body[SCROLL_LEFT] || 0) - (doc && doc[CLIENT_LEFT] || body && body[CLIENT_LEFT] || 0);
	      event[PAGEY] = original[CLIENTY] + (doc && doc[SCROLL_TOP] || body && body[SCROLL_TOP] || 0) - (doc && doc[CLIENT_TOP] || body && body[CLIENT_TOP] || 0);
	    }

	    if (!event[WHICH] && button !== undefined) event[WHICH] = button & 1 ? 1 : button & 2 ? 3 : button & 4 ? 2 : 0;
	  }
	};
	var last = 0;
	var moveEventReg = /move|scroll/;

	function dispatch(event) {
	  var type = event.type,
	      target = eventTarget(event);
	  type = hookRevice(type) || type;

	  if (moveEventReg.test(type)) {
	    var now = new Date();
	    if (now - last < 16) return;
	    last = now;
	  }

	  var elem;

	  if (target[DISABLED] !== true || type !== 'click') {
	    if (bubbleUpEvents[type]) {
	      do {
	        if (elem = target[DOM_ELEMENT$1]) event = elem[MIXIN_EMIT_LISTEN](type, event);
	        target = target[PARENT_NODE];
	      } while (target && !event[CANCEL_BUBBLE]);
	    } else {
	      elem = target[DOM_ELEMENT$1];
	      if (elem) elem[MIXIN_EMIT_LISTEN](type, event);
	    }
	  }
	}

	function packEvent(type, originalEvent) {
	  var event = new Event(originalEvent, type);
	  var hook = getHook(type);

	  if (!hook) {
	    if (mouseEventReg.test(type)) {
	      hook = mouseEventHook;
	    } else if (keyEventReg.test(type)) {
	      hook = keyEventHook;
	    } else {
	      hook = {};
	    }

	    hook = addHook$3(type, hook);
	  }

	  hook.fix && hook.fix(event, originalEvent);
	  return event;
	} // ========================= Event =================================


	function eventTarget(event) {
	  var target = event.target || event.srcElement || document;
	  return target.nodeType == 3 ? target[PARENT_NODE] : target;
	}

	var eventProps = 'altKey,bubbles,cancelable,ctrlKey,eventPhase,metaKey,shiftKey,view'.split(',').concat(RELATED_TARGET, PROPERTY_NAME, WHICH, CURRENT_TARGET);

	function Event(event, type) {
	  this.type = type || event.type;
	  this[ORIGINAL_EVENT] = event;
	  this.target = eventTarget(event);
	  this[RETURN_VALUE] = !(event.defaultPrevented || event[RETURN_VALUE] === false || event[GET_PREVENT_DEFAULT] && event[GET_PREVENT_DEFAULT]());
	  this[TIME_STAMP] = event[TIME_STAMP] || new Date().getTime();
	  this[ORIGINAL_PROPS](eventProps);
	}

	var EventProto = Event.prototype;
	EventProto.$hookEvent = true;

	EventProto[ORIGINAL_PROPS] = function (props) {
	  var e = this[ORIGINAL_EVENT];

	  for (var i = 0, l = props.length; i < l; i++) {
	    this[props[i]] = e[props[i]];
	  }
	};

	EventProto[PREVENT_DEFAULT] = function () {
	  var e = this[ORIGINAL_EVENT];
	  this[RETURN_VALUE] = false;
	  e[RETURN_VALUE] = false;
	  e[PREVENT_DEFAULT] && e[PREVENT_DEFAULT]();
	};

	EventProto[STOP_PROPAGATION] = function () {
	  var e = this[ORIGINAL_EVENT];
	  this[CANCEL_BUBBLE] = true;
	  e[CANCEL_BUBBLE] = true;
	  e[STOP_PROPAGATION] && e[STOP_PROPAGATION]();
	};

	EventProto[STOP_IMMEDIATE_PROPAGATION] = function () {
	  var e = this[ORIGINAL_EVENT];
	  this[IS_IMMEDIATE_PROPAGATION_STOPPED] = true;
	  e[STOP_IMMEDIATE_PROPAGATION] && e[STOP_IMMEDIATE_PROPAGATION]();
	  this[STOP_PROPAGATION]();
	}; // ========================= hooks =================================


	var PROPERTY_NAME = 'propertyName',
	    RELATED_TARGET = 'relatedTarget'; // firefox, chrome: mouseenter and mouseleave

	if (ROOTELEMENT.onmouseenter === undefined) {
	  var fix = function fix(event) {
	    var el = event.target,
	        t = event[RELATED_TARGET];
	    return !t || t !== el && !(el.compareDocumentPosition(t) & 16);
	  };

	  addHook$3({
	    'mouseover': {
	      type: 'mouseenter',
	      fix: fix
	    },
	    'mouseout': {
	      type: 'mouseleave',
	      fix: fix
	    }
	  });
	} // IE9+, W3C: animationend


	if (window.AnimationEvent) {
	  addHook$3('animationend', 'AnimationEvent');
	} else if (window.WebKitAnimationEvent) {
	  addHook$3('animationend', 'WebKitAnimationEvent');
	} // IE6-11, chrome: mousewheel, wheelDetla
	// IE9-11: wheel deltaY
	// firefox: DOMMouseScroll detail, wheel detlaY
	// chrome: wheel deltaY


	if (document.onmousewheel === undefined) {
	  var fixWheelType = document.onwheel ? 'wheel' : 'DOMMouseScroll',
	      fixWheelDelta = fixWheelType === 'wheel' ? 'deltaY' : 'detail',
	      WHEEL_DELTA = 'wheelDelta',
	      WHEEL_DELTAY = WHEEL_DELTA + 'Y';
	  addHook$3('mousewheel', {
	    type: fixWheelType,
	    fix: function fix(event) {
	      event[WHEEL_DELTAY] = event[WHEEL_DELTA] = event[fixWheelDelta] > 0 ? -120 : 120;
	      event[WHEEL_DELTAY] = 0;
	    }
	  });
	}

	var INPUT = 'input'; // IE6-9: input
	// IE6-8: change

	if (document[CREATE_ELEMENT](INPUT).oninput === undefined) {
	  var changeEventDispath = function changeEventDispath(event) {
	    var target = eventTarget(event);
	    if (target[DOM_CHANGE_EVENT]) dispatch(packEvent('change', event));
	  };

	  // IE6-IE8: input, change
	  delete bubbleUpEvents[INPUT];
	  addHook$3(INPUT, {
	    type: 'propertychange',
	    fix: function fix(event) {
	      return event[PROPERTY_NAME] === 'value';
	    }
	  });
	  var changeEventNum = 0;
	  var DOM_CHANGE_EVENT = '__change_event';
	  addHook$3('change', {
	    bind: function bind(el) {
	      if (el.type == 'checkbox' || el.type == 'radio') {
	        if (changeEventNum++ === 0) addEventListener(ROOTELEMENT, 'click', changeEventDispath);
	        el[DOM_CHANGE_EVENT] = true;
	        return false;
	      }
	    },
	    unbind: function unbind(el) {
	      if (el.type == 'checkbox' || el.type == 'radio') {
	        if (--changeEventNum === 0) removeEventListener(ROOTELEMENT, 'click', changeEventDispath);
	        el[DOM_CHANGE_EVENT] = false;
	        return false;
	      }
	    }
	  });
	} else if (IE9) {
	  // IE9: input
	  var OLD_VALUE = 'oldValue';
	  addHook$3(INPUT, {
	    fix: function fix(event) {
	      var el = event.target;
	      el[OLD_VALUE] = el.value;
	    }
	  }); // http://stackoverflow.com/questions/6382389/oninput-in-ie9-doesnt-fire-when-we-hit-backspace-del-do-cut

	  addEventListener('selectionchange', function (event) {
	    var actEl = document.activeElement;

	    switch (actEl.tagName) {
	      case 'INPUT':
	        if (actEl.type !== 'text') return;

	      case 'TEXTAREA':
	        if (actEl.value !== actEl[OLD_VALUE]) {
	          actEl[OLD_VALUE] = actEl.value;
	          dispatch(packEvent(INPUT, event));
	        }

	    }
	  });
	}

	/*
	 *
	 * @Author: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Date: 2018-08-25 17:47:25
	 * @Last Modified by: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Last Modified time: 2018-08-31 18:36:56
	 */
	var Element = inherit(function Element(comp, option) {
	  VElement.call(this, comp, option);
	}, VElement, HTMLMixin(VElement), ElementMixin, ElementAttrMixin, ElementClassMixin, ElementStyleMixin, ElementValueMixin, EventMixin);

	var _VComplexElement$PROT = VComplexElement[PROTOTYPE],
	    _append = _VComplexElement$PROT.append,
	    appendAll = _VComplexElement$PROT.appendAll,
	    _prepend = _VComplexElement$PROT.prepend,
	    _insertBefore = _VComplexElement$PROT.insertBefore,
	    _insertAfter = _VComplexElement$PROT.insertAfter,
	    _replace = _VComplexElement$PROT.replace;
	var __TEXT_CONTENT = 'textContent';
	var TEXT_CONTENT = isStr(DIV$1[__TEXT_CONTENT]) ? __TEXT_CONTENT : 'innerText';
	var ComplexElement = inherit(function ComplexElement(comp, option) {
	  VComplexElement.call(this, comp, option);
	}, VComplexElement, HTMLMixin(VComplexElement), ElementMixin, ElementAttrMixin, ElementClassMixin, ElementStyleMixin, ElementValueMixin, EventMixin, {
	  $htmlComplexElement: true,
	  $childKey: '$htmlNode',
	  $childName: 'HTML Virtual Node',
	  initChild: function initChild(child) {
	    this.el[APPEND_CHILD](child.el);
	  },
	  html: function html(_html) {
	    var el = this.el;

	    if (arguments.length) {
	      el[INNER_HTML] = _html;
	      return this;
	    }

	    return el[INNER_HTML];
	  },
	  text: function text$$1(_text) {
	    var el = this.el;

	    if (arguments.length) {
	      el[TEXT_CONTENT] = _text;
	      return this;
	    }

	    return el[TEXT_CONTENT];
	  },
	  append: function append(node) {
	    _append.call(this, node);

	    this.el[APPEND_CHILD](node.el);
	    return this;
	  },
	  prepend: function prepend(node) {
	    _prepend.call(this, node);

	    prependChild(this.el, node.el);
	    return this;
	  },
	  insertBefore: function insertBefore$$1(node, target) {
	    _insertBefore.call(this, node, target);

	    doInsertBefore(node.el, target.el);
	    return this;
	  },
	  insertAfter: function insertAfter$$1(node, target) {
	    _insertAfter.call(this, node, target);

	    doInsertAfter(node.el, target.el);
	    return this;
	  },
	  replace: function replace(node, target) {
	    _replace.call(this, node, target);

	    target.el[PARENT_NODE][REPLACE_CHILD](node.el, target.el);
	    return this;
	  }
	});

	var Compontent$1 = inherit(function HTMLCompontent(option) {
	  Compontent.call(this, option);
	}, Compontent, {
	  $htmlComp: true
	});

	var Comment$1 = registerVComment(inherit(function Comment(comment$$1) {
	  VComment.call(this, comment$$1);
	  this.el = document.createComment(comment$$1);
	}, VComment, HTMLMixin(VComment), {
	  $htmlComment: true
	}));

	var TextMixin = {
	  update: function update(text$$1) {
	    this.el.data = text$$1;
	  }
	};
	var HTMLText = registerVText(inherit(function Text(comp, text$$1) {
	  VText.call(this, comp, text$$1);
	  this.el = textNode$1(text$$1);
	}, VText, HTMLMixin(VText), TextMixin));
	var HTMLBindingText = registerVBindingText(inherit(function BindingText(comp, expr) {
	  VBindingText.call(this, comp, expr);
	  this.el = textNode$1('');
	}, VBindingText, HTMLMixin(VBindingText), TextMixin));

	function textNode$1(text$$1) {
	  return document.createTextNode(text$$1);
	}

	/*
	 *
	 * Void elements:
	 *      area, base, br, col, embed, hr, img, input, link, meta, param, source, track, wbr
	 *
	 * The template elements
	 *      template
	 *
	 * Raw text elements
	 *      script, style
	 *
	 * escapable raw text elements
	 *      textarea, title
	 *
	 * Normal elements
	 *      All other allowed HTML elements are normal elements.
	 *
	 *      Main root:               html
	 *      Document metadata:       link, meta, style, title
	 *      Sectioning root:         body
	 *      Content sectioning:      address, article, aside, footer, header, h1, h2, h3, h4, h5, h6, hgroup, nav, section
	 *      Text content:            blockquote, dd, dir, div, dl, dt, figcaption, figure, hr, li, main, ol, p, pre, ul
	 *      Inline text semantics:   a, abbr, b, bdi, bdo, br, cite, code, data, dfn, em, i, kbd, mark, nobr, q, rp,
	 *                               rt, rtc, ruby, s, samp, small, span, strong, sub, sup, time, tt, u, var, wbr
	 *      Image and multimedia:    area, audio, img, map, track, video
	 *      Embedded content:        applet, embed, iframe, noembed, object, param, picture, source
	 *      Scripting:               canvas, noscript, script
	 *      Demarcating edits:       del, ins
	 *      Table content:           caption, col, colgroup, table, tbody, td, tfoot, th, thead, tr
	 *      Forms:                   button, datalist, fieldset, form, input, label, legend, meter,
	 *                               optgroup, option, output, progress, select, textarea
	 *      Interactive elements:    details, dialog, menu, menuitem, summary
	 *      Web Components:          content, element, shadow, slot, template
	 *
	 *      Obsolete and deprecated elements:
	 *           acronym, applet, basefont, bgsound, big, blink, center, command, content, dir, element,
	 *           font, frame, frameset, image, isindex, keygen, listing, marquee, menuitem, multicol, nextid,
	 *           nobr, noembed, noframes, plaintext, shadow, spacer, strike, tt, xmp
	 *
	 * Foreign elements
	 *      Elements from the MathML namespace and the SVG namespace.
	 *
	 *      SVG:
	 *          https://developer.mozilla.org/en-US/docs/Web/SVG/Element
	 *
	 *      MathML:
	 *          https://developer.mozilla.org/en-US/docs/Web/MathML/Element
	 *
	 * links:
	 *      https://www.w3.org/TR/html5/syntax.html#writing-html-documents
	 *      https://developer.mozilla.org/my/docs/Web/HTML/Element
	 *
	 * @Author: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Date: 2018-08-25 18:55:34
	 * @Last Modified by: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Last Modified time: 2018-08-27 14:29:35
	 */
	register(Element, 'area,br,col,embed,hr,img,input,param,source,track,wbr');
	register(ComplexElement, 'address,article,aside,footer,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' + 'blockquote,dd,dir,div,dl,dt,figcaption,figure,li,main,ol,p,pre,ul,a,abbr,b,bdi,bdo,cite,code,data,dfn,em,i,kbd,' + 'mark,nobr,q,rp,rt,rtc,ruby,s,samp,small,span,strong,sub,sup,time,tt,u,var,audio,map,video,applet,iframe,' + 'noembed,object,picture,canvas,noscript,del,ins,caption,colgroup,table,tbody,td,tfoot,th,thead,tr,' + 'button,datalist,fieldset,form,label,legend,meter,optgroup,option,output,progress,select,details,' + 'dialog,menu,menuitem,summary,content,element,shadow,slot');
	register(ComplexElement, 'template');
	register(ComplexElement, 'textarea');
	register(ComplexElement, 'script');
	register(ComplexElement, 'style');
	register(ComplexElement, 'link,meta,base');
	register(ComplexElement, 'title');

	function register(Element$$1, tags$$1) {
	  tags$$1 = tags$$1.split(',');

	  for (var i = 0, l = tags$$1.length; i < l; i++) {
	    registerVElement(tags$$1[i], createClass({
	      extend: Element$$1,
	      name: Element$$1.name,
	      tagName: tags$$1[i]
	    }));
	  }
	}

	/*
	 * Dom Event Expression
	 *
	 * @Author: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Date: 2018-08-20 16:46:41
	 * @Last Modified by: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Last Modified time: 2018-09-04 17:04:17
	 */
	var eventFilters = create(null);
	var EventKeyword = '$event';

	function eventIdentityHandler(prefix, identity, opt) {
	  identity = parsePath(identity);
	  if (identity[0] !== EventKeyword) return doIdentityHandler(prefix, identity, opt);
	}

	var paramNames$1 = [VNodeKeyword, EventKeyword];
	function EventExpression(code, eventFilters, keywords$$1) {
	  Expression.call(this, code, paramNames$1, eventIdentityHandler, this.parseFilter.bind(this), keywords$$1);
	  this.eventFilters = eventFilters;
	}

	function doFilter(filter$$1, args) {
	  return filter$$1(args[1], args);
	}

	inherit(EventExpression, Expression, {
	  transformValue: function transformValue(scope, args) {
	    return this.transform(this.execute(scope, args), scope, args);
	  },
	  filter: function filter$$1(scope, args) {
	    return this.eachFilter(doFilter, scope, args) !== false;
	  },
	  parseFilter: function parseFilter(name) {
	    var localFilters = this.eventFilters;
	    var filter$$1 = localFilters && localFilters[name] || eventFilters[name];
	    assert(filter$$1, "EventFilter[" + name + "] is undefined");
	    assert(isFn(filter$$1), "Invalid EventFilter[" + name + "] on " + (localFilters && localFilters[name] ? 'Local' : 'Global') + " EventFilters");
	    return filter$$1;
	  }
	});

	/*
	 * Dom Event Filters
	 *
	 * @Author: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Date: 2018-08-20 18:15:02
	 * @Last Modified by: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Last Modified time: 2018-09-05 15:30:40
	 */
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

	eventFilters.key = function (e, param) {
	  var which = e.which,
	      codes = param.get(),
	      l = codes.length;
	  if (!l) return true;

	  for (var i = 0, code, key, j, m; i < l; i++) {
	    code = codes[i];

	    if (isStr(code)) {
	      key = code;
	      code = +code;

	      if (isNaN(code)) {
	        // key code
	        code = keyCodes[key];
	        assert(isInt(code) || isArray(code), "Invalid Key Code[" + key + "]");

	        if (isArray(code)) {
	          // multi code
	          for (j = 0, m = code.length; j < m; j++) {
	            if (which === code[j]) return true;
	          }

	          continue;
	        }
	      }
	    }

	    if (which === code) return true;
	  }

	  return false;
	};

	eventFilters.stop = function (e) {
	  e[STOP_PROPAGATION]();
	};

	eventFilters.prevent = function (e) {
	  e.preventDefault();
	};

	eventFilters.self = function (e) {
	  return e.target === e.currentTarget;
	};

	/*
	 * Dom Expression
	 *
	 * @Author: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Date: 2018-08-20 18:32:15
	 * @Last Modified by: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Last Modified time: 2018-08-20 18:35:02
	 */

	var DomDirective = inherit(function DomDirective(node, expr, params) {
	  Directive.call(this, node, params);
	}, Directive, {
	  $nodeKey: '$htmlElement',
	  $nodeName: 'HTML Virtual Element'
	});

	var ExpressionDirective = inherit(function ExpressionDirective(node, params) {
	  DomDirective.call(this, node, params);
	  this.expr = params.expr;
	}, DomDirective, {
	  prepare: function prepare(params) {
	    params.expr = new TransformExpression(params.value);
	  },
	  realValue: function realValue() {
	    return this.expr.value(this.comp, [this.node]);
	  },
	  value: function value() {
	    return this.expr.transformValue(this.comp, [this.node]);
	  },
	  transform: function transform(value) {
	    return this.expr.transform(value, this.comp, [this.node]);
	  },
	  blankValue: function blankValue(value) {
	    if (!arguments.length) value = this.value();
	    return isNil(value) ? '' : value;
	  },
	  observeHandler: function observeHandler(path, value) {
	    this.update(this.expr.simple ? this.transform(value) : this.value());
	  },
	  bind: function bind() {
	    this.observeExpr(this.expr, this.observeHandler, this);
	    this.update(this.value());
	  },
	  unbind: function unbind() {
	    this.unobserveExpr(this.expr, this.observeHandler, this);
	  },
	  update: function update(value) {
	    throw new Error("abstract method");
	  }
	});

	var EventDirective = inherit(function EventDirective(node, expr, params) {
	  DomDirective.call(this, node, params);
	  this.expr = params.expr;
	}, DomDirective, {
	  prepare: function prepare(params) {
	    params.expr = new EventExpression(params.value);
	  },
	  handler: function handler(e) {
	    var expr = this.expr,
	        comp = this.comp,
	        node = this.node,
	        args = [node, e];
	    e[STOP_PROPAGATION]();

	    if (expr.filter(comp, args)) {
	      var ret = expr.value(comp, args);

	      if (isFn(ret)) {
	        ret.call(comp, e, node);
	      } else {
	        assert(!expr.sample, "Invalid Event Handler: " + this.params.value);
	      }
	    }
	  },
	  bind: function bind() {
	    var node = this.node,
	        handler = this.handler,
	        type = this.eventType;

	    if (type.push) {
	      for (var i = 0; i < type.length; i++) {
	        node.on(type[i], handler, this);
	      }
	    } else {
	      node.on(type, handler, this);
	    }
	  },
	  unbind: function unbind() {
	    var node = this.node,
	        handler = this.handler,
	        type = this.eventType;

	    if (type.push) {
	      for (var i = 0; i < type.length; i++) {
	        node.un(type[i], handler, this);
	      }
	    } else {
	      node.un(type, handler, this);
	    }
	  }
	});

	/*
	 * @Author: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Date: 2018-08-20 19:54:12
	 * @Last Modified by: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Last Modified time: 2018-08-27 15:26:30
	 */
	array2obj(map(['blur', 'change', 'click', 'dblclick', 'error', 'focus', 'keydown', 'keypress', 'keyup', 'load', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'resize', 'scroll', 'select', 'submit', 'unload', {
	  eventName: 'input',
	  eventType: ['input', 'propertychange']
	}], function (event) {
	  if (isStr(event)) event = {
	    eventName: event,
	    eventType: event
	  };
	  event.extend = EventDirective;
	  event.name = upperFirst(event.eventName) + 'EventDirective';
	  return registerDirective('on' + event.eventName, event);
	}), function (directive$$1) {
	  return directive$$1.name;
	});

	/*
	 * @Author: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Date: 2018-08-20 19:53:22
	 * @Last Modified by: tao.zeng (tao.zeng.zt@gmail.com)
	 * @Last Modified time: 2018-09-05 15:29:52
	 */
	var DISPLAY = 'display',
	    NONE = 'none';
	eachObj({
	  // ================ text =================
	  text: {
	    update: function update(value) {
	      this.node.text(this.blankValue(value));
	    }
	  },
	  // ================ html =================
	  html: {
	    update: function update(value) {
	      this.node.html(this.blankValue(value));
	    }
	  },
	  // ================ show =================
	  show: {
	    update: function update(value) {
	      this.node.css(DISPLAY, value ? '' : NONE);
	    }
	  },
	  // ================ hide =================
	  hide: {
	    update: function update(value) {
	      this.node.css(DISPLAY, value ? NONE : '');
	    }
	  },
	  // ================ focus =================
	  focus: {
	    update: function update(value) {
	      if (value) this.node.focus();
	    }
	  },
	  // ================ value (input/textarea/select/option) =================
	  value: {
	    update: function update(value) {
	      this.node.value(this.blankValue(value));
	    }
	  },
	  // ================ checked (radio/checkbox) =================
	  checked: {
	    update: function update(value) {
	      var node = this.node;
	      node.checked(boolVal(node.value(), value));
	    }
	  },
	  // ================ selected (option) =================
	  selected: {
	    update: function update(value) {
	      var node = this.node;
	      node.selected(boolVal(node.value(), value));
	    }
	  },
	  // ================ class =================
	  'class': {
	    update: function update(value) {
	      if (isStr(value)) value = trim(value).split(/\s+/g);
	      var cache = create(null),
	          oldCache = this.cache;

	      if (oldCache) {
	        for (var k in oldCache) {
	          if (oldCache[k] === true) cache[k] = false;
	        }
	      }

	      if (isArrayLike$1(value)) {
	        var i = value.length;

	        while (i--) {
	          cache[value[i]] = true;
	        }
	      } else if (value) {
	        for (var k in value) {
	          if (value[k] === true) cache[k] = true;
	        }
	      }

	      this.cache = cache;
	      this.node.margeClass(cache);
	    }
	  },
	  // =================== style =======================
	  style: {
	    update: function update(value) {
	      var ncsses;

	      if (typeof value === 'string' && (value = trim(value))) {
	        var split = value.split(styleSplitReg);
	        ncsses = {};

	        for (var i = 0, l = split.length, s; i < l; i++) {
	          s = split[i].split(cssSplitReg);
	          ncsses[s[0]] = s[1];
	        }
	      } else if (isObj(value)) {
	        ncsses = value;
	      }

	      var csses = this.csses;

	      if (csses) {
	        if (ncsses) {
	          for (var name in csses) {
	            if (!ncsses[name]) css(el, name, '');
	          }
	        } else {
	          for (var name in csses) {
	            css(el, name, '');
	          }
	        }
	      }

	      this.csses = ncsses;

	      if (ncsses) {
	        for (var name in ncsses) {
	          css(el, name, ncsses[name]);
	        }
	      }
	    }
	  }
	}, function (directive$$1, name) {
	  __register(name, directive$$1);
	});

	function __register(name, directive$$1) {
	  directive$$1.extend = ExpressionDirective;
	  directive$$1.name = upperFirst(name) + 'Directive';
	  registerDirective(name, directive$$1);
	} // ================================= input =======================


	var EVENT_CHANGE = 'change',
	    EVENT_INPUT = 'input',
	    SELECT = 'select',
	    TEXTAREA = 'textarea',
	    INPUT$1 = 'input',
	    INPUT_RADIO = 'radio',
	    INPUT_CHECKBOX = 'checkbox';
	var _ExpressionDirective$ = ExpressionDirective[PROTOTYPE],
	    _prepare$1 = _ExpressionDirective$.prepare,
	    _bind = _ExpressionDirective$.bind,
	    _unbind = _ExpressionDirective$.unbind;

	__register('input', {
	  prepare: function prepare(params, D) {
	    _prepare$1.call(this, params, D);

	    params.expr.checkRestore();
	  },
	  constructor: function constructor(node, params) {
	    ExpressionDirective.call(this, node, params);
	    assert(this.expr.simple, "Invalid Expression[" + params.value + "] on directive[input]");
	    var type = node.tagName,
	        event = EVENT_CHANGE,
	        domValue = this.elemValue;

	    switch (type) {
	      case INPUT$1:
	        switch (node.el.type) {
	          case INPUT_RADIO:
	          case INPUT_CHECKBOX:
	            type = itype;
	            domValue = this.checkedValue;
	            break;

	          default:
	            event = EVENT_INPUT;
	        }

	        break;

	      case TEXTAREA:
	        event = EVENT_INPUT;
	        break;

	      case SELECT:
	        break;

	      default:
	        throw new TypeError("<" + type + "> not support Directive[input], should be <input | textarea | select>");
	    }

	    this.type = type;
	    this.event = event;
	    this.domValue = domValue;
	  },
	  update: function update(value) {
	    this.node.value(this.blankValue(value));
	  },
	  elemValue: function elemValue(value) {
	    var node = this.node;
	    if (arguments.length === 0) return node.value();
	    node.value(value);
	  },
	  checkedValue: function checkedValue(value) {
	    var node = this.node;
	    if (arguments.length === 0) return node.checked() ? node.value() : undefined;
	    node.checked(value == node.value());
	  },
	  onChange: function onChange(e) {
	    var expr = this.expr;
	    this.comp.set(expr.simple, expr.restore(this.domValue(), this.comp, [this.node]));
	    e[STOP_PROPAGATION]();
	  },
	  bind: function bind() {
	    _bind.call(this);

	    this.node.on(this.event, this.onChange, this);
	  },
	  unbind: function unbind() {
	    this.node.un(this.event, this.onChange, this);

	    _unbind.call(this);
	  }
	});

	function boolVal(elValue, value) {
	  if (isArray(value)) {
	    var i = value.length;

	    while (i--) {
	      if (value[i] === elValue) return true;
	    }

	    return false;
	  } else if (isStr(value)) {
	    return value === elValue;
	  } else if (isObj(value)) {
	    return !!value[elValue];
	  }

	  return !!value;
	}

	var EXPR_START = '{',
	    EXPR_END = '}';
	var AutoCloseElems = makeMap('input'),
	    ContentElems = makeMap('textarea');
	var EXPR_START_LEN = EXPR_START.length,
	    EXPR_END_LEN = EXPR_END.length;
	var EXPR_KEY_WORDS = "\"'`[{";
	var EXPR_KEYS = match(EXPR_KEY_WORDS.split(''), UNATTACH),
	    EXPR_STR = match(/"(?:[^\\"\n]|\\.)*"|'(?:[^\\'\n]|\\.)*'|`(?:[^\\`]|\\.)*`/, false, "'\"`", UNATTACH),
	    ExprObject = and('ExprObject', function () {
	  return ['{', anyOne('ObjBody', [EXPR_STR, // match by "'`
	  ExprObject, // match by {
	  ExprArray, // match by ]
	  EXPR_KEYS, // consume start char when EXPR_STR | ExprObject | ExprArray match failed
	  new RegExp("[^" + reEscape(EXPR_KEY_WORDS + '}') + "]+") // consume chars which before start codes of EXPR_STR | ExprObject | ExprArray and "}"
	  ], UNATTACH), '}'];
	}, UNATTACH),
	    ExprArray = and('ExprArray', function () {
	  return ['[', anyOne('ArrayBody', [EXPR_STR, ExprObject, ExprArray, EXPR_KEYS, new RegExp("[^" + reEscape(EXPR_KEY_WORDS + ']') + "]+")], UNATTACH), ']'];
	}),
	    Expr = and('Expr', [['ExprStart', EXPR_START, attachOffset], anyOne('ExprBody', [EXPR_STR, ExprObject, ExprArray, match((EXPR_KEY_WORDS + EXPR_START[0]).split(''), UNATTACH), new RegExp("[^" + reEscape(EXPR_KEY_WORDS + EXPR_START[0] + EXPR_END[0]) + "]+")], UNATTACH), ['ExprEnd', EXPR_END, attachOffset]], function (d, rs, stream) {
	  var content_start = d[0],
	      expr_end = d[1];
	  rs.add([stream.orgbuff.substring(content_start, expr_end - EXPR_END_LEN), content_start - EXPR_START_LEN, expr_end]);
	});

	function createStringRule(name, mask, mline) {
	  return and(name, [match(mask, attachOffset), anyOne([Expr, EXPR_START[0], // consume expr start char when parse expr failed
	  new RegExp("(?:[^\\\\" + (mline ? '' : '\\n') + mask + reEscape(EXPR_START[0]) + "]|\\\\.)+") // string fragment
	  ]), match(mask, attachOffset)], function (d, rs, stream) {
	    var buff = stream.orgbuff;
	    var start = d[0],
	        end = d[2] - 1,
	        exprs = d[1];

	    if (exprs.length) {
	      var offset = start - 1;
	      var i = 0,
	          l = exprs.length,
	          estart;
	      var expr = [];

	      for (; i < l; i++) {
	        estart = exprs[i][1];
	        if (start < estart) expr.push(exprStr(buff, start, estart));
	        expr.push("(" + exprs[i][0] + ")");
	        start = exprs[i][2];
	      }

	      if (start < end) expr.push(exprStr(buff, start, end));
	      rs.add(['expr', expr.join(' + '), offset, end + 1]);
	    } else {
	      rs.add(['string', buff.substring(start, end)]);
	    }
	  });

	  function exprStr(buff, start, end) {
	    return "\"" + escapeString(buff.substring(start, end)) + "\"";
	  }
	}

	var ATTR_NAME = match('AttrName', /([@:$_a-zA-Z][\w-\.]*)\s*/, 1),
	    AttrValue = or('AttrValue', [createStringRule('SQString', "'"), createStringRule('DQString', '"'), createStringRule('MString', '`', true), and(Expr, attachValue('expr', function (expr) {
	  return expr[0][0];
	})), match('Number', /-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/, '-0123456789', attachValue('number', function (num) {
	  return +num;
	})), match('NaN', attachStaticValue('number', NaN)), match('undefined', attachStaticValue('undefined', undefined)), match('null', attachStaticValue('null', undefined)), match('true', attachStaticValue('boolean', true)), match('false', attachStaticValue('boolean', false))], {
	  capturable: false,
	  attach: function attach(val, rs) {
	    rs.add(val[0]);
	  }
	}),
	    Attrs = any('Attrs', [ATTR_NAME, option('AttrValue', [[/=\s*/, false, '=', UNATTACH], AttrValue, /\s*/])], function (d, rs) {
	  var attrs = {};

	  for (var i = 0, l = d.length; i < l; i += 2) {
	    attrs[d[i]] = d[i + 1][0];
	  }

	  rs.add(attrs);
	});
	var ELEM_NAME_REG = '[_a-zA-Z][\\w-]*',
	    ELEM_NAME = match('ElemName', new RegExp("<(" + ELEM_NAME_REG + ")\\s*"), 1, '<'),
	    NodeCollection = anyOne('NodeCollection', function () {
	  return [Elem, and(Expr, function (d, rs, stream) {
	    rs.add({
	      type: 'expr',
	      data: d[0][0]
	    });
	  }), match('<', function (d, rs, stream, rule) {
	    //consume one char when Elem match failed
	    if (stream.nextCode() === 47) // is close element
	      return rule.error(stream, 'expect: /<[^\/]/', true);
	    attachText(d, rs, stream, rule); // not element
	  }), match(EXPR_START[0], attachText), // consume one char when Expr match failed
	  match(new RegExp("[^\\\\<" + reEscape(EXPR_START[0]) + "]+|\\\\" + reEscape(EXPR_START[0])), attachText)];
	}),
	    Elem = and('Elem', [ELEM_NAME, Attrs, or('ElemBody', [match(/\/>\s*/, false, '/', UNATTACH), and('childNodes', [match(/>/, false, '>', UNATTACH), NodeCollection, option([match('ElemClose', new RegExp("</(" + ELEM_NAME_REG + ")>\\s*"), 1, '<')], function (close, childNodesResult, stream) {
	  var closeTag = close[0],
	      elemResult = childNodesResult.parent.parent,
	      tag = elemResult.data[0];

	  if (closeTag) {
	    if (closeTag !== tag) {
	      if (AutoCloseElems[tag]) {
	        stream.reset();
	      } else {
	        return "expect: </" + tag + ">";
	      }
	    }
	  } else if (!AutoCloseElems[tag]) {
	    return "expect: </" + tag + ">";
	  }
	})])])], function (d, rs) {
	  var tag = d[0],
	      children = d[2][0] && d[2][0][0],
	      elem = {
	    type: 'elem',
	    tag: tag,
	    attrs: d[1],
	    children: children
	  };
	  rs.add(elem);

	  if (children && AutoCloseElems[tag]) {
	    rs.addAll(children);
	    children.length = 0;
	  }
	});

	function attachText(text, rs) {
	  var data = rs.data,
	      len = data.length;
	  var prev;

	  if (len && (prev = data[len - 1]) && prev.type === 'text') {
	    prev.data += text;
	  } else {
	    rs.add({
	      type: 'text',
	      data: text
	    });
	  }
	}

	var ElemContent = and('Elem-Content', [/\s*/, many(Elem), match('EOF', /\s*$/, UNATTACH)], function (d, rs) {
	  rs.addAll(d[0]);
	}).init();

	function attachValue(type, valHandler) {
	  return function (value, rs) {
	    rs.add([type, valHandler(value)]);
	  };
	}

	function attachStaticValue(type, val) {
	  return attachValue(type, function (v) {
	    return v;
	  });
	}

	function attachOffset(d, rs, stream) {
	  rs.add(stream.orgOffset());
	}

	exports.global = __global;
	exports.create = create;
	exports.assign = assign;
	exports.assignIf = assignIf;
	exports.assignBy = assignBy;
	exports.extend = extend;
	exports.extendIf = extendIf;
	exports.extendBy = extendBy;
	exports.inherit = inherit;
	exports.superCls = superCls;
	exports.subclassOf = subclassOf;
	exports.createClass = createClass;
	exports.each = each;
	exports.eachArray = eachArray;
	exports.eachStr = eachStr;
	exports.eachObj = eachObj;
	exports.reach = reach;
	exports.reachArray = reachArray;
	exports.reachStr = reachStr;
	exports.eachChain = eachChain;
	exports.STOP = STOP$1;
	exports.map = map;
	exports.mapArray = mapArray;
	exports.mapStr = mapStr;
	exports.mapObj = mapObj;
	exports.SKIP = SKIP;
	exports.filter = filter;
	exports.filterArray = filterArray;
	exports.filterStr = filterStr;
	exports.filterObj = filterObj;
	exports.find = find;
	exports.findArray = findArray;
	exports.findStr = findStr;
	exports.findObj = findObj;
	exports.rfind = rfind;
	exports.rfindStr = rfindStr;
	exports.indexOf = indexOf;
	exports.indexOfArray = indexOfArray;
	exports.indexOfObj = indexOfObj;
	exports.lastIndexOf = lastIndexOf;
	exports.lastIndexOfArray = lastIndexOfArray;
	exports.obj2array = obj2array;
	exports.keys = keys;
	exports.values = values;
	exports.eq = eq$1;
	exports.isNull = isNull;
	exports.isUndef = isUndef;
	exports.isNil = isNil;
	exports.isFn = isFn;
	exports.is = is;
	exports.isObj = isObj;
	exports.isBool = isBool;
	exports.isNum = isNum;
	exports.isStr = isStr;
	exports.isDate = isDate;
	exports.isReg = isReg;
	exports.isArray = isArray;
	exports.isInt = isInt;
	exports.isTypedArray = isTypedArray;
	exports.isArrayLike = isArrayLike$1;
	exports.isInstOf = isInstOf;
	exports.isPrimitive = isPrimitive;
	exports.isBlank = isBlank;
	exports.applyScope = applyScope;
	exports.applyNoScope = applyNoScope$1;
	exports.applyScopeN = applyScopeN;
	exports.applyNoScopeN = applyNoScopeN;
	exports.apply = apply;
	exports.applyN = applyN;
	exports.createFn = createFn;
	exports.fnName = fnName;
	exports.trim = trim$1;
	exports.upperFirst = upperFirst;
	exports.strval = strval;
	exports.charCode = charCode;
	exports.genCharCodes = genCharCodes;
	exports.reEscape = reEscape;
	exports.reUnion = reUnion;
	exports.regStickySupport = regStickySupport;
	exports.regUnicodeSupport = regUnicodeSupport;
	exports.array2obj = array2obj;
	exports.makeMap = makeMap;
	exports.makeArray = makeArray;
	exports.cached = cached;
	exports.hasOwnProp = hasOwnProp;
	exports.getOwnProp = getOwnProp;
	exports.prototypeOfSupport = prototypeOfSupport;
	exports.prototypeOf = prototypeOf;
	exports.setPrototypeOf = setPrototypeOf;
	exports.defPropSupport = defPropSupport;
	exports.defProp = defProp;
	exports.defPropValue = defPropValue;
	exports.Parser = ASTBuilder;
	exports.List = List;
	exports.FnList = FnList;
	exports.nextTick = nextTick;
	exports.clearTick = clearTick;
	exports.escapeString = escapeString;
	exports.pad = pad;
	exports.plural = plural;
	exports.singular = singular;
	exports.thousandSeparate = thousandSeparate;
	exports.format = format;
	exports.parsePath = parsePath;
	exports.formatPath = formatPath;
	exports.get = get;
	exports.set = set;
	exports.defaultProps = defaultProps$1;
	exports.isDefaultProp = isDefaultProp;
	exports.isProxyEnabled = isProxyEnabled;
	exports.$set = $set;
	exports.observer = observer$1;
	exports.observe = observe;
	exports.unobserve = unobserve;
	exports.isObserved = isObserved;
	exports.$getOwnProp = $getOwnProp;
	exports.$eachArray = $eachArray;
	exports.$reachArray = $reachArray;
	exports.$each = $each;
	exports.$reach = $reach;
	exports.$eachObj = $eachObj;
	exports.$mapArray = $mapArray;
	exports.$mapObj = $mapObj;
	exports.$map = $map;
	exports.$filterArray = $filterArray;
	exports.$filterObj = $filterObj;
	exports.$filter = $filter;
	exports.$findArray = $findArray;
	exports.$findObj = $findObj;
	exports.$find = $find;
	exports.$rfindArray = $rfindArray;
	exports.$rfind = $rfind;
	exports.$indexOfArray = $indexOfArray;
	exports.$indexOfObj = $indexOfObj;
	exports.$lastIndexOfArray = $lastIndexOfArray;
	exports.$indexOf = $indexOf;
	exports.$lastIndexOf = $lastIndexOf;
	exports.$assign = $assign;
	exports.$assignIf = $assignIf;
	exports.$assignBy = $assignBy;
	exports.$obj2array = $obj2array;
	exports.$keys = $keys;
	exports.$values = $values;
	exports.tags = tags;
	exports.registerVElement = registerVElement;
	exports.registerVText = registerVText;
	exports.registerVBindingText = registerVBindingText;
	exports.registerVComment = registerVComment;
	exports.elem = elem;
	exports.text = text;
	exports.comment = comment;
	exports.VNode = VNode;
	exports.VText = VText;
	exports.VBindingText = VBindingText;
	exports.VElement = VElement;
	exports.VComplexElement = VComplexElement;
	exports.Compontent = Compontent;
	exports.VComment = VComment;
	exports.TransformExpression = TransformExpression;
	exports.transforms = transforms;
	exports.directives = directives;
	exports.Directive = Directive;
	exports.registerDirective = registerDirective;
	exports.directive = directive;
	exports.HTMLElement = Element;
	exports.HTMLComplexElement = ComplexElement;
	exports.HTMLCompontent = Compontent$1;
	exports.HTMLComment = Comment$1;
	exports.HTMLText = HTMLText;
	exports.HTMLBindingText = HTMLBindingText;
	exports.ExpressionDirective = ExpressionDirective;
	exports.EventDirective = EventDirective;
	exports.DomDirective = DomDirective;
	exports.eventFilters = eventFilters;
	exports.EventKeyword = EventKeyword;
	exports.EventExpression = EventExpression;
	exports.keyCodes = keyCodes;
	exports.keywords = keywords;
	exports.IDENTITY_OPT_GET = IDENTITY_OPT_GET;
	exports.IDENTITY_OPT_SET = IDENTITY_OPT_SET;
	exports.IDENTITY_OPT_CALL = IDENTITY_OPT_CALL;
	exports.Expression = Expression;
	exports.NodeParser = ElemContent;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=argilo.js.map
