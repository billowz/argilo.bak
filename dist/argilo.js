/*
 *    __ _ _ __ __ _(_) | ___
 *   / _` | '__/ _` | | |/ _ \
 *  | (_| | | | (_| | | | (_) |
 *   \__,_|_|  \__, |_|_|\___/
 *             |___/
 *
 * argilo v1.0.0
 * https://github.com/tao-zeng/argilo
 *
 * Copyright (c) 2018 Tao Zeng <tao.zeng.zt@qq.com>
 * Released under the MIT license
 *
 * Date: Thu, 04 Apr 2019 12:00:00 GMT
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define('argilo', ['exports'], factory) :
	(global = global || self, factory(global.argilo = {}));
}(this, function (exports) {
	/**
	 *
	 * @author Tao Zeng (tao.zeng.zt@qq.com)
	 * @module utility
	 * @created 2018-11-09 15:23:35
	 * @modified 2018-11-09 15:23:35 by Tao Zeng (tao.zeng.zt@qq.com)
	 */
	var CONSTRUCTOR = 'constructor';
	var PROTOTYPE = 'prototype';
	var PROTO = '__proto__';
	var HAS_OWN_PROP = 'hasOwnProperty';
	var TYPE_BOOL = 'boolean';
	var TYPE_FN = 'function';
	var TYPE_NUM = 'number';
	var TYPE_STRING = 'string';
	var TYPE_UNDEF = 'undefined';
	var GLOBAL = typeof window !== TYPE_UNDEF ? window : typeof global !== TYPE_UNDEF ? global : typeof self !== TYPE_UNDEF ? self : {};
	function EMPTY_FN() {}
	function NULL_CONSTRUCTOR() {}
	NULL_CONSTRUCTOR[PROTOTYPE] = null;

	/**
	 * @module utility/dkeys
	 * @author Tao Zeng <tao.zeng.zt@qq.com>
	 * @created Mon Mar 11 2019 17:22:13 GMT+0800 (China Standard Time)
	 * @modified Sat Mar 23 2019 17:42:04 GMT+0800 (China Standard Time)
	 */
	var defaultKeyMap = new NULL_CONSTRUCTOR();
	var defaultKeys = [];
	function isDefaultKey(key) {
	  return defaultKeyMap[key] || false;
	}
	function addDefaultKey(key) {
	  if (!defaultKeyMap[key]) {
	    defaultKeyMap[key] = true;
	    defaultKeys.push(key);
	  }

	  return key;
	}
	function addDefaultKeys() {
	  var args = arguments,
	      l = args.length;

	  for (var i = 0; i < l; i++) {
	    addDefaultKey(args[i] + '');
	  }
	}
	function getDefaultKeys() {
	  return defaultKeys;
	}
	function getDefaultKeyMap() {
	  return defaultKeys;
	}

	/**
	 * @module utility
	 * @author Tao Zeng <tao.zeng.zt@qq.com>
	 * @created Mon Dec 11 2017 13:57:32 GMT+0800 (China Standard Time)
	 * @modified Sat Feb 16 2019 10:53:30 GMT+0800 (China Standard Time)
	 */
	function getConstructor(o) {
	  var C = o[CONSTRUCTOR];
	  return typeof C === TYPE_FN ? C : Object;
	}

	/**
	 * @module utility
	 * @author Tao Zeng <tao.zeng.zt@qq.com>
	 * @created Mon Dec 11 2017 13:57:32 GMT+0800 (China Standard Time)
	 * @modified Sat Mar 23 2019 18:50:53 GMT+0800 (China Standard Time)
	 */
	var toString = Object.prototype.toString;
	function toStr(obj) {
	  return toString.call(obj);
	}
	function toStrType(obj) {
	  return toString.call(obj).match(/^\[object ([^\]]+)\]$/)[1];
	}

	/**
	 * type checker
	 * @module utility
	 * @author Tao Zeng <tao.zeng.zt@qq.com>
	 * @created Mon Dec 11 2017 13:57:32 GMT+0800 (China Standard Time)
	 * @modified Sat Mar 23 2019 18:55:31 GMT+0800 (China Standard Time)
	 */
	/**
	 * is equals
	 * > o1 === o2 || NaN === NaN
	 */

	function eq(o1, o2) {
	  return o1 === o2 || o1 !== o1 && o2 !== o2;
	} //========================================================================================

	/*                                                                                      *
	 *                                    primitive type                                    *
	 *                                                                                      */
	//========================================================================================

	/**
	 * is null
	 */

	function isNull(o) {
	  return o === null;
	}
	/**
	 * is undefined
	 */

	function isUndef(o) {
	  return o === undefined;
	}
	/**
	 * is null or undefined
	 */

	function isNil(o) {
	  return o === null || o === undefined;
	}
	/**
	 * is boolean
	 */

	var isBool = mkIsPrimitive(TYPE_BOOL);
	/**
	 * is a number
	 */

	var isNum = mkIsPrimitive(TYPE_NUM);
	/**
	 * is a string
	 */

	var isStr = mkIsPrimitive(TYPE_STRING);
	/**
	 * is a function
	 */

	var isFn = mkIsPrimitive(TYPE_FN);
	/**
	 * is integer number
	 */

	function isInt(o) {
	  return o === 0 || (o ? typeof o === TYPE_NUM && o % 1 === 0 : false);
	}
	/**
	 * is primitive type
	 * - null
	 * - undefined
	 * - boolean
	 * - number
	 * - string
	 * - function
	 */

	function isPrimitive(o) {
	  if (o === undefined || o === null) {
	    return true;
	  }

	  switch (typeof o) {
	    case TYPE_BOOL:
	    case TYPE_NUM:
	    case TYPE_STRING:
	    case TYPE_FN:
	      return true;
	  }

	  return false;
	}

	function mkIsPrimitive(type) {
	  return function is(o) {
	    return typeof o === type;
	  };
	} //========================================================================================

	/*                                                                                      *
	 *                                    reference type                                    *
	 *                                                                                      */
	//========================================================================================

	/**
	 * is instanceof
	 */


	function instOf(obj, Cls) {
	  return obj !== undefined && obj !== null && obj instanceof Cls;
	}
	/**
	 * is child instance of Type
	 */

	function is(o, Type) {
	  if (o !== undefined && o !== null) {
	    var C = o[CONSTRUCTOR] || Object;

	    if (Type[CONSTRUCTOR] === Array) {
	      var i = Type.length;

	      while (i--) {
	        if (C === Type[i]) {
	          return true;
	        }
	      }
	    } else {
	      return C === Type;
	    }
	  }

	  return false;
	}
	/**
	 * is boolean or Boolean
	 */

	var isBoolean = mkIs(Boolean);
	/**
	 * is number or Number
	 */

	var isNumber = mkIs(Number);
	/**
	 * is string or String
	 */

	var isString = mkIs(String);
	/**
	 * is Date
	 */

	var isDate = mkIs(Date);
	/**
	 * is RegExp
	 */

	var isReg = mkIs(RegExp);
	/**
	 * is Array
	 */

	var isArray = Array.isArray || mkIs(Array);
	/**
	 * is Typed Array
	 */

	var isTypedArray = isFn(ArrayBuffer) ? ArrayBuffer.isView : function () {
	  return false;
	};
	/**
	 * is Array or pseudo-array
	 * - Array
	 * - String
	 * - IArguments
	 * - NodeList
	 * - HTMLCollection
	 * - Typed Array
	 * - {length: int, [length-1]: any}
	 */

	function isArrayLike(o) {
	  if (o && o[CONSTRUCTOR]) {
	    switch (o[CONSTRUCTOR]) {
	      case Array:
	      case String:
	      case GLOBAL.NodeList:
	      case GLOBAL.HTMLCollection:
	      case GLOBAL.Int8Array:
	      case GLOBAL.Uint8Array:
	      case GLOBAL.Int16Array:
	      case GLOBAL.Uint16Array:
	      case GLOBAL.Int32Array:
	      case GLOBAL.Uint32Array:
	      case GLOBAL.Float32Array:
	      case GLOBAL.Float64Array:
	        return true;
	    }

	    var len = o.length;
	    return typeof len === TYPE_NUM && (len === 0 || len > 0 && len % 1 === 0 && len - 1 in o);
	  }

	  return o === '';
	}
	/**
	 * is simple Object
	 * TODO object may has constructor property
	 */

	function isObj(o) {
	  return o !== undefined && o !== null && getConstructor(o) === Object;
	}
	/**
	 * is simple Object
	 * TODO object may has constructor property
	 */

	function isObject(o) {
	  return toStr(o) === '[object Object]';
	}

	function mkIs(Type) {
	  return function is(o) {
	    return o !== undefined && o !== null && o[CONSTRUCTOR] === Type;
	  };
	}

	var blankStrReg = /^\s*$/;
	/**
	 * is empty
	 * - string: trim(string).length === 0
	 * - array: array.length === 0
	 * - pseudo-array: pseudo-array.length === 0
	 */

	function isBlank(o) {
	  if (o) {
	    if (o[CONSTRUCTOR] === String) {
	      return blankStrReg.test(o);
	    }

	    return o.length === 0;
	  }

	  return true;
	}

	/**
	 * Function utilities
	 * @module utility
	 * @author Tao Zeng <tao.zeng.zt@qq.com>
	 * @created Mon Dec 11 2017 13:57:32 GMT+0800 (China Standard Time)
	 * @modified Sat Mar 30 2019 15:42:28 GMT+0800 (China Standard Time)
	 */

	/*                                                                                      *
	 *                                    create function                                   *
	 *                                                                                      */
	// ========================================================================================

	/**
	 * create function by code string
	 * @param body	function body
	 * @param args	function argument names
	 * @param name	function name
	 */

	function createFn(body, args, name) {
	  return name ? Function("return function " + name + "(" + (args ? args.join(', ') : '') + "){" + body + "}")() : applyScope(Function, Function, args && args.length ? args.concat(body) : [body]);
	} // ========================================================================================

	/*                                                                                      *
	 *                                    function apply                                    *
	 *                                                                                      */
	// ========================================================================================

	/**
	 * generate apply function
	 */

	function applyBuilder(maxArgs, scope, offset) {
	  scope = scope ? 'scope' : '';
	  offset = offset ? 'offset' : '';
	  var args = new Array(maxArgs + 1);
	  var cases = new Array(maxArgs + 1);

	  for (var i = 0; i <= maxArgs; i++) {
	    args[i] = (i || scope ? ', ' : '') + "args[" + (offset ? "offset" + (i ? ' + ' + i : '') : i) + "]";
	    cases[i] = "case " + i + ": return fn" + (scope && '.call') + "(" + scope + args.slice(0, i).join('') + ");";
	  }

	  return Function("return function(fn, " + (scope && scope + ', ') + "args" + (offset && ', offset, len') + "){\nswitch(" + (offset ? 'len' : 'args.length') + "){\n" + cases.join('\n') + "\n}\n" + (offset && "var arr = new Array(len);\nfor(var i=0; i<len; i++) arr[i] = arr[offset + i];") + "\nreturn fn.apply(" + (scope || 'null') + ", " + (offset ? 'arr' : 'args') + ");\n}")();
	}
	/**
	 * apply function with scope
	 * @param fn	target function
	 * @param scope	scope of function
	 * @param args	arguments of function
	 */


	var applyScope = applyBuilder(8, 1, 0);
	/**
	 * apply function without scope
	 * @param fn		target function
	 * @param args	arguments of function
	 */

	var applyNoScope = applyBuilder(8, 0, 0);
	/**
	 * apply function with scope
	 * @param fn		target function
	 * @param scope		scope of function
	 * @param args		arguments of function
	 * @param offset	start offset of args
	 * @param len		arg size from offset
	 */

	var applyScopeN = applyBuilder(8, 1, 1);
	/**
	 * apply function without scope
	 * @param fn		target function
	 * @param args		arguments of function
	 * @param offset	start offset of args
	 * @param len		arg size from offset
	 */

	var applyNoScopeN = applyBuilder(8, 0, 1);
	/**
	 * apply function
	 * @param fn		target function
	 * @param scope		scope of function
	 * @param args		arguments of function
	 */

	function apply(fn, scope, args) {
	  if (scope === undefined || scope === null || scope === GLOBAL) {
	    return applyNoScope(fn, args || []);
	  }

	  return applyScope(fn, scope, args || []);
	}
	/**
	 * apply function
	 * @param fn		target function
	 * @param scope		scope of function
	 * @param args		arguments of function
	 * @param offset	start offset of args
	 * @param len		arg size from offset
	 */

	function applyN(fn, scope, args, offset, len) {
	  if (scope === undefined || scope === null || scope === GLOBAL) {
	    return applyNoScopeN(fn, args, offset, len);
	  }

	  return applyScopeN(fn, scope, args, offset, len);
	} // ========================================================================================

	/*                                                                                      *
	 *                                     function name                                    *
	 *                                                                                      */
	// ========================================================================================

	var varGenReg = /\$\d+$/;
	/**
	 * get function name
	 */

	function fnName(fn) {
	  var name = fn.name;
	  return name ? name.replace(varGenReg, '') : 'anonymous';
	} // ========================================================================================

	/*                                                                                      *
	 *                                         bind                                         *
	 *                                                                                      */
	// ========================================================================================

	var _bind;

	var funcProto = Function[PROTOTYPE];

	if (funcProto.bind) {
	  _bind = function bind(fn, scope) {
	    var args = arguments,
	        argLen = args.length;

	    if (isNil(scope)) {
	      return argLen > 2 ? bindPolyfill(fn, scope, args, 2) : fn;
	    }

	    return applyScopeN(fn.bind, fn, args, 1, argLen - 1);
	  };
	} else {
	  funcProto.bind = function bind(scope) {
	    return bindPolyfill(this, scope, arguments, 1);
	  };

	  _bind = function bind(fn, scope) {
	    return bindPolyfill(fn, scope, arguments, 2);
	  };
	}
	/**
	 * bind scope or arguments on function
	 * - return source function when without arguments and scope is undefined or null
	 * - only bind arguments when scope is undefined or null, well can call the new function proxy with some scope
	 *
	 * @example
	 * 		function example() {
	 * 			console.log(this, arguments);
	 * 		}
	 * 		var proxy = bind(example, null) 	// proxy === example
	 * 		proxy() 							// log: window | undefined, []
	 * 		proxy.call(1) 						// log: 1, []
	 *
	 * 		proxy = bind(example, null, 1) 		// proxy !== example
	 * 		proxy() 							// log: window | undefined, [1]
	 * 		proxy(2) 							// log: window | undefined, [1, 2]
	 * 		proxy.call(1, 2) 					// log: 1, [1, 2]
	 *
	 * 		proxy = bind(example, {}, 1, 2)		// proxy !== example
	 * 		proxy() 							// log: {}, [1]
	 * 		proxy(2) 							// log: {}, [1, 2, 2]
	 * 		proxy.call(1, 2) 					// log: {}, [1, 2, 2]
	 *
	 * @param fn	source function
	 * @param scope	bind scope
	 * @param args	bind arguments
	 * @return function proxy
	 */


	var bind = _bind;
	/**
	 * bind
	 * > not bind scope when scope is null or undefined
	 * @param fn		source function
	 * @param scope		bind scope
	 * @param args		bind arguments
	 * @param argOffset	offset of args
	 * @return function proxy
	 */

	function bindPolyfill(fn, scope, bindArgs, argOffset) {
	  var argLen = bindArgs.length - argOffset;

	  if (scope === undefined) {
	    scope = null;
	  }

	  if (argLen > 0) {
	    // bind with arguments
	    return function bindProxy() {
	      var args = arguments;
	      var i = args.length;

	      if (i) {
	        var params = new Array(argLen + i);

	        while (i--) {
	          params[argLen + i] = args[i];
	        }

	        i = argLen;

	        while (i--) {
	          params[i] = bindArgs[i + argOffset];
	        }

	        return apply(fn, scope === null ? this : scope, params); // call with scope or this
	      }

	      return applyN(fn, scope === null ? this : scope, bindArgs, argOffset, argLen); // call with scope or this
	    };
	  }

	  if (scope === null) {
	    return fn;
	  }

	  if (scope === GLOBAL) {
	    // bind on GLOBAL
	    return function bindProxy() {
	      return applyNoScope(fn, arguments);
	    };
	  }

	  return function bindProxy() {
	    return applyScope(fn, scope, arguments);
	  };
	}

	/**
	 * regexp utilities
	 * @module utility/reg
	 * @author Tao Zeng <tao.zeng.zt@qq.com>
	 * @created Thu Sep 06 2018 18:27:51 GMT+0800 (China Standard Time)
	 * @modified Sat Dec 29 2018 19:29:00 GMT+0800 (China Standard Time)
	 */
	/**
	 * whether to support sticky on RegExp
	 */

	var stickyReg = isBool(/(?:)/.sticky);
	/**
	 * whether to support unicode on RegExp
	 */

	var unicodeReg = isBool(/(?:)/.unicode);
	var REG_ESCAPE = /[-\/\\^$*+?.()|[\]{}]/g;
	/**
	 * escape string for RegExp
	 */

	function reEscape(str) {
	  return str.replace(REG_ESCAPE, '\\$&');
	}

	var _ref;
	var PROTO_PROP = '__proto__';
	var __getProto = Object.getPrototypeOf,
	    ____setProto = Object.setPrototypeOf;
	/**
	 * whether to support Object.getPrototypeOf and Object.setPrototypeOf
	 */

	var prototypeOf = !!____setProto;
	/**
	 * whether to support `__proto__`
	 */

	var protoProp = (_ref = {}, _ref[PROTO_PROP] = [], _ref) instanceof Array;
	!protoProp && addDefaultKey(PROTO_PROP);
	/**
	 * get prototype
	 */

	var protoOf = ____setProto ? __getProto : __getProto ? function getPrototypeOf(obj) {
	  return obj[PROTO] || __getProto(obj);
	} : function getPrototypeOf(obj) {
	  return obj[PROTO] || obj[CONSTRUCTOR][PROTOTYPE];
	};
	/**
	 * set prototype
	 * > properties on the prototype are not inherited on older browsers
	 */

	var __setProto = ____setProto || function setPrototypeOf(obj, proto) {
	  obj[PROTO] = proto;
	  return obj;
	};
	/**
	 * set prototype
	 * > the properties on the prototype will be copied on the older browser
	 */

	var setProto = ____setProto || (protoProp ? __setProto : function setPrototypeOf(obj, proto) {
	  for (var p in proto) {
	    if (!(p in obj)) obj[p] = proto[p];
	  }

	  return __setProto(obj, proto);
	});

	/**
	 * prototype utilities
	 * @module utility
	 * @author Tao Zeng <tao.zeng.zt@qq.com>
	 * @created Wed Jul 25 2018 15:24:47 GMT+0800 (China Standard Time)
	 * @modified Thu Mar 14 2019 09:20:31 GMT+0800 (China Standard Time)
	 */

	/**
	 * prop utilities
	 * @module utility
	 * @author Tao Zeng <tao.zeng.zt@qq.com>
	 * @created Wed Jul 25 2018 15:22:57 GMT+0800 (China Standard Time)
	 * @modified Thu Mar 14 2019 09:18:39 GMT+0800 (China Standard Time)
	 */
	var __defProp = Object.defineProperty;
	var _ref$1 = Object[PROTOTYPE],
	    __defineGetter__ = _ref$1.__defineGetter__,
	    __defineSetter__ = _ref$1.__defineSetter__;
	/**
	 * whether to support Object.defineProperty
	 */

	var propDescriptor = __defProp && !!function () {
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
	/**
	 * whether to support `__defineGetter__` and `__defineSetter__`
	 */

	var propAccessor = propDescriptor || !!__defineSetter__;
	if (!propDescriptor) __defProp = __defineSetter__ ? function defineProperty(obj, prop, desc) {
	  var get = desc.get,
	      set = desc.set;
	  if ('value' in desc || !(prop in obj)) obj[prop] = desc.value;
	  get && __defineGetter__.call(obj, prop, get);
	  set && __defineSetter__.call(obj, prop, set);
	  return obj;
	} : function defineProperty(obj, prop, desc) {
	  if (desc.get || desc.set) throw new TypeError('property accessors are not supported.');
	  if ('value' in desc || !(prop in obj)) obj[prop] = desc.value;
	  return obj;
	};
	/**
	 * define property
	 */

	var defProp = __defProp;
	/**
	 * define property by value
	 */

	var defPropValue = propDescriptor ? function defPropValue(obj, prop, value, configurable, writable, enumerable) {
	  __defProp(obj, prop, {
	    value: value,
	    enumerable: enumerable !== false,
	    configurable: configurable !== false,
	    writable: writable !== false
	  });

	  return value;
	} : function defPropValue(obj, prop, value) {
	  obj[prop] = value;
	  return value;
	};

	/**
	 * property utilities
	 * @module utility
	 * @author Tao Zeng <tao.zeng.zt@qq.com>
	 * @created Wed Jul 25 2018 15:24:47 GMT+0800 (China Standard Time)
	 * @modified Thu Mar 14 2019 09:21:12 GMT+0800 (China Standard Time)
	 */

	/**
	 * @module utility
	 * @author Tao Zeng <tao.zeng.zt@qq.com>
	 * @created Wed Jul 25 2018 15:22:57 GMT+0800 (China Standard Time)
	 * @modified Thu Mar 14 2019 09:22:38 GMT+0800 (China Standard Time)
	 */
	var __hasOwn = Object[PROTOTYPE][HAS_OWN_PROP];
	/**
	 * has own property
	 */

	var hasOwnProp = function hasOwnProp(obj, prop) {
	  return __hasOwn.call(obj, prop);
	};
	/**
	 * get owner property value
	 * @param prop 			property name
	 * @param defaultVal 	default value
	 */

	function getOwnProp(obj, prop, defaultVal) {
	  return hasOwnProp(obj, prop) ? obj[prop] : defaultVal;
	}

	/**
	 * Object.create polyfill
	 * @module utility/create
	 * @author Tao Zeng <tao.zeng.zt@qq.com>
	 * @created Wed Jul 25 2018 15:24:47 GMT+0800 (China Standard Time)
	 * @modified Wed Mar 13 2019 20:08:04 GMT+0800 (China Standard Time)
	 */

	function __() {}
	/**
	 * create shim
	 */


	function doCreate(o, props) {
	  __[PROTOTYPE] = o;
	  var obj = new __();
	  __[PROTOTYPE] = null;

	  if (props) {
	    for (var k in props) {
	      if (hasOwnProp(props, k)) {
	        defProp(obj, k, props[k]);
	      }
	    }
	  }

	  return obj;
	}
	/**
	 * create object
	 */


	var create = Object.create || (Object.create = Object.getPrototypeOf ? doCreate : function create(o, props) {
	  var obj = doCreate(o, props);

	  __setProto(obj, o);

	  return obj;
	});

	/**
	 * @module utility/create
	 * @author Tao Zeng <tao.zeng.zt@qq.com>
	 * @created Wed Jul 25 2018 15:24:47 GMT+0800 (China Standard Time)
	 * @modified Mon Mar 04 2019 18:35:26 GMT+0800 (China Standard Time)
	 */

	/**
	 * @module utility/collection
	 * @author Tao Zeng <tao.zeng.zt@qq.com>
	 * @created Wed Jul 25 2018 17:10:41 GMT+0800 (China Standard Time)
	 * @modified Sat Dec 29 2018 19:37:44 GMT+0800 (China Standard Time)
	 */
	var Control =
	/*#__PURE__*/
	function () {
	  function Control(desc) {
	    this.__desc = desc;
	  }

	  var _proto = Control.prototype;

	  _proto.toString = function toString() {
	    return this.__desc;
	  };

	  return Control;
	}();

	/**
	 * @module utility/collection
	 * @author Tao Zeng <tao.zeng.zt@qq.com>
	 * @created Wed Jul 25 2018 17:10:41 GMT+0800 (China Standard Time)
	 * @modified Thu Apr 04 2019 19:32:58 GMT+0800 (China Standard Time)
	 */
	/**
	 * STOP Control
	 * > stop each/map/indexOf...
	 */

	var STOP = new Control('STOP'); //========================================================================================

	/*                                                                                      *
	 *                                each object properties                                *
	 *                                                                                      */
	//========================================================================================

	/**
	 * each callback on object
	 * - will stop each on return STOP
	 */

	function eachProps(obj, callback, scope, own) {
	  if (isBool(scope)) {
	    own = scope;
	  } else {
	    callback = bind(callback, scope);
	  }

	  var k;

	  if (own === false) {
	    for (k in obj) {
	      if (!defaultKeyMap[k] && callback(k, obj) === STOP) return k;
	    }
	  } else {
	    for (k in obj) {
	      if (!defaultKeyMap[k] && hasOwnProp(obj, k) && callback(k, obj) === STOP) return k;
	    }
	  }

	  return false;
	} //========================================================================================

	/*                                                                                      *
	 *                                      each object                                     *
	 *                                                                                      */
	//========================================================================================

	/**
	 * each callback on object
	 * - will stop each on callback return STOP
	 */

	function eachObj(obj, callback, scope, own) {

	  if (isBool(scope)) {
	    own = scope;
	  } else {
	    callback = bind(callback, scope);
	  }

	  var k;

	  if (own === false) {
	    for (k in obj) {
	      if (!defaultKeyMap[k] && callback(obj[k], k, obj) === STOP) return k;
	    }
	  } else {
	    for (k in obj) {
	      if (!defaultKeyMap[k] && hasOwnProp(obj, k) && callback(obj[k], k, obj) === STOP) return k;
	    }
	  }

	  return false;
	} //========================================================================================

	/*                                                                                      *
	 *                                      each array                                      *
	 *                                                                                      */
	//========================================================================================

	/**
	 * each callback on array
	 * - will stop each on callback return STOP
	 */

	/**
	 * each array
	 * - will stop each on callback return STOP
	 * @param array		each target
	 * @param callback	callback
	 * @param scope		scope of callback
	 * @return stoped index or false
	 */
	function eachArray(array, callback, scope) {
	  callback = bind(callback, scope);

	  for (var i = 0, l = array.length; i < l; i++) {
	    if (callback(array[i], i, array) === STOP) return i;
	  }

	  return false;
	}

	/*                                                                                      *
	 *                                         each                                         *
	 *                                                                                      */
	//========================================================================================

	function doEach(_eachArray, _eachObj, obj, callback, scope, own) {
	  if (isArrayLike(obj)) return _eachArray(obj, callback, scope);
	  return _eachObj(obj, callback, scope, own);
	}
	/**
	 * each
	 * - will stop each on callback return STOP
	 * @param obj		each target
	 * @param callback	callback
	 * @param scope		scope of callback
	 * @param own		each own properties on object, default: true
	 * @return stoped index or false
	 */

	function each(obj, callback, scope, own) {
	  return doEach(eachArray, eachObj, obj, callback, scope, own);
	}

	/**
	 * @module utility/collection
	 * @author Tao Zeng <tao.zeng.zt@qq.com>
	 * @created Wed Jul 25 2018 17:12:06 GMT+0800 (China Standard Time)
	 * @modified Thu Apr 04 2019 19:31:21 GMT+0800 (China Standard Time)
	 */
	/**
	 * SKIP Control
	 * > skip map
	 */

	var SKIP = new Control('SKIP'); //========================================================================================

	/*                                                                                      *
	 *                                    map object                                   *
	 *                                                                                      */
	//========================================================================================

	/**
	 * callback on object
	 * - will stop map on callback return STOP
	 * - will ignore item on callback return SKIP
	 * @param value	property value
	 * @param prop	property name
	 * @param obj	map target
	 */

	function doMapObj(each, obj, callback, scope, own) {
	  if (isBool(scope)) {
	    own = scope;
	  } else {
	    callback = bind(callback, scope);
	  }

	  var copy = create(null);
	  each(obj, function (value, prop, obj) {
	    var v = callback(value, prop, obj);
	    if (v === STOP) return STOP;
	    if (v !== SKIP) copy[prop] = v;
	  }, null, own);
	  return copy;
	}
	/**
	 * object: map
	 * - will stop map on callback return STOP
	 * - will ignore item on callback return SKIP
	 * @param obj		map target
	 * @param callback	callback
	 * @param scope		scope of callback
	 * @param own		map own properties, default: true
	 */

	function mapObj(obj, callback, scope, own) {
	  return doMapObj(eachObj, obj, callback, scope, own);
	} //========================================================================================

	/*                                                                                      *
	 *                                     indexof Array                                    *
	 *                                                                                      */
	//========================================================================================

	/**
	 * callback on array
	 * - will stop map on callback return STOP
	 * - will ignore item on callback return SKIP
	 * @param data	item data
	 * @param index	item index
	 * @param array	map target
	 */

	function doMapArray(each, array, callback, scope) {
	  callback = bind(callback, scope);
	  var copy = [];
	  var j = 0;
	  each(array, function (data, index, array) {
	    var v = callback(data, index, array);
	    if (v === STOP) return STOP;
	    if (v !== SKIP) copy[j++] = v;
	  });
	  return copy;
	}
	/**
	 * array: map
	 * - will stop map on callback return STOP
	 * - will ignore item on callback return SKIP
	 * @param array		map target
	 * @param value		callback
	 * @param scope		scope of callback
	 * @return array index or -1
	 */

	function mapArray(array, callback, scope) {
	  return doMapArray(eachArray, array, callback, scope);
	}

	/*                                                                                      *
	 *                                       map                                       *
	 *                                                                                      */
	//========================================================================================

	function doMap(eacharray, eachobj, obj, callback, scope, own) {
	  if (isArrayLike(obj)) return doMapArray(eacharray, obj, callback, scope);
	  return doMapObj(eachobj, obj, callback, scope, own);
	}
	/**
	 * map
	 * - will stop map on callback return STOP
	 * - will ignore item on callback return SKIP
	 * @param obj		map target
	 * @param value		map value of callback
	 * @param scope		scope of callback
	 * @param own		map own properties on object, default: true
	 * @return array index or property name or -1
	 */

	function map(obj, callback, scope, own) {
	  return doMap(eachArray, eachObj, obj, callback, scope, own);
	}

	/**
	 * @module utility/collection
	 * @author Tao Zeng <tao.zeng.zt@qq.com>
	 * @created Wed Jul 25 2018 17:12:06 GMT+0800 (China Standard Time)
	 * @modified Thu Apr 04 2019 19:32:32 GMT+0800 (China Standard Time)
	 */

	function parseCallback(value, scope) {
	  if (isFn(value)) return bind(value, scope);
	  return function defaultHandler(data, idx, obj) {
	    return eq(data, value);
	  };
	} //========================================================================================

	/*                                                                                      *
	 *                                    index of object                                   *
	 *                                                                                      */
	//========================================================================================

	/**
	 * indexOf callback on object
	 * - will stop find on callback return STOP
	 * @param value	property value
	 * @param prop	property name
	 * @param obj		indexOf target
	 * @return
	 * - boolean: is finded
	 * - void: find next
	 * - STOP: stop find
	 */


	function doIdxOfObj(each, obj, value, scope, own) {
	  if (isBool(scope)) {
	    own = scope;
	    scope = null;
	  }

	  var callback = parseCallback(value, scope);
	  var idx = -1;
	  each(obj, function (data, prop, obj) {
	    var r = callback(data, prop, obj);

	    if (r === true) {
	      idx = prop;
	      return STOP;
	    } else if (r === STOP) return r;
	  }, null, own);
	  return idx;
	}
	/**
	 * object: indexOf
	 * - will stop find on callback return STOP
	 * @param obj		find target
	 * @param callback	find value or callback
	 * @param scope		scope of callback
	 * @param own		find own properties, default: true
	 * @return property name or -1
	 */

	function idxOfObj(obj, value, scope, own) {
	  return doIdxOfObj(eachObj, obj, value, scope, own);
	} //========================================================================================

	/*                                                                                      *
	 *                                     indexof Array                                    *
	 *                                                                                      */
	//========================================================================================

	/**
	 * indexOf callback on array
	 * - will stop find on callback return STOP
	 * @param data	item data
	 * @param index	item index
	 * @param array	indexOf target
	 * @return
	 * - boolean: is finded
	 * - void: find next
	 * - STOP: stop find
	 */

	function doIdxOfArray(each, array, value, scope) {
	  var callback = parseCallback(value, scope);
	  var idx = -1;
	  each(array, function (data, index, array) {
	    var r = callback(data, index, array);

	    if (r === true) {
	      idx = index;
	      return STOP;
	    } else if (r === STOP) return r;
	  });
	  return idx;
	}
	/**
	 * array: indexOf
	 * - will stop find on callback return STOP
	 * @param array		find target
	 * @param value		find value or callback
	 * @param scope		scope of callback
	 * @return array index or -1
	 */

	function idxOfArray(array, value, scope) {
	  return doIdxOfArray(eachArray, array, value, scope);
	}

	/*                                                                                      *
	 *                                       index of                                       *
	 *                                                                                      */
	//========================================================================================
	// find by value

	function doIdxOf(eacharray, eachobj, obj, value, scope, own) {
	  if (isArrayLike(obj)) return doIdxOfArray(eacharray, obj, value, scope);
	  return doIdxOfObj(eachobj, obj, value, scope, own);
	}
	/**
	 * indexOf
	 * - will stop find on callback return STOP
	 * @param obj		find target
	 * @param value		find value of callback
	 * @param scope		scope of callback
	 * @param own		find own properties on object, default: true
	 * @return array index or property name or -1
	 */

	function idxOf(obj, value, scope, own) {
	  return doIdxOf(eachArray, eachObj, obj, value, scope, own);
	}

	/**
	 * @module utility/collection
	 * @author Tao Zeng <tao.zeng.zt@qq.com>
	 * @created Wed Jul 25 2018 17:12:06 GMT+0800 (China Standard Time)
	 * @modified Thu Apr 04 2019 19:30:27 GMT+0800 (China Standard Time)
	 */

	/*                                                                                      *
	 *                                     reduce object                                    *
	 *                                                                                      */
	//========================================================================================

	/**
	 * reduce callback on object
	 * - will stop reduce on return STOP
	 */

	function doReduceObj(each, obj, accumulator, callback, scope, own) {
	  if (isBool(scope)) {
	    own = scope;
	  } else {
	    callback = bind(callback, scope);
	  }

	  each(obj, function (value, prop, obj) {
	    var rs = callback(accumulator, value, prop, obj);
	    if (rs === STOP) return STOP;
	    accumulator = rs;
	  }, null, own);
	  return accumulator;
	}
	/**
	 * reduce object
	 * - will stop reduce on callback return STOP
	 * @param obj			reduce target
	 * @param accumulator	accumulator
	 * @param callback		value callback
	 * @param scope			scope of callback
	 * @param own			reduce own properties, default: true
	 */

	function reduceObj(obj, accumulator, callback, scope, own) {
	  return doReduceObj(eachObj, obj, accumulator, callback, scope, own);
	} //========================================================================================

	/*                                                                                      *
	 *                                     reduce array                                     *
	 *                                                                                      */
	//========================================================================================

	/**
	 * reduce callback on array
	 * - will stop reduce on return STOP
	 */

	function doReduceArray(each, array, accumulator, callback, scope) {
	  callback = bind(callback, scope);
	  each(array, function (data, index, array) {
	    var rs = callback(accumulator, data, index, array);
	    if (rs === STOP) return STOP;
	    accumulator = rs;
	  });
	  return accumulator;
	}
	/**
	 * reduce array
	 * - will stop reduce on callback return STOP
	 * @param array			reduce target
	 * @param accumulator	accumulator
	 * @param callback		value callback
	 * @param scope			scope of callback
	 */

	function reduceArray(array, accumulator, callback, scope) {
	  return doReduceArray(eachArray, array, accumulator, callback, scope);
	}

	/*                                                                                      *
	 *                                        reduce                                        *
	 *                                                                                      */
	//========================================================================================

	function doReduce(eacharray, eachobj, obj, accumulator, callback, scope, own) {
	  if (isArrayLike(obj)) return doReduceArray(eacharray, obj, accumulator, callback, scope);
	  return doReduceObj(eachobj, obj, accumulator, callback, scope, own);
	}
	/**
	 * reduce
	 * - will stop reduce on callback return STOP
	 * @param obj			reduce target
	 * @param accumulator	accumulator
	 * @param callback		value callback
	 * @param scope			scope of callback
	 * @param own			reduce own properties of reduce object, default: true
	 */

	function reduce(obj, accumulator, callback, scope, own) {
	  return doReduce(eachArray, eachObj, obj, accumulator, callback, scope, own);
	}

	/**
	 * @module utility/collection
	 * @author Tao Zeng <tao.zeng.zt@qq.com>
	 * @created Thu Jul 26 2018 10:47:47 GMT+0800 (China Standard Time)
	 * @modified Thu Apr 04 2019 19:49:02 GMT+0800 (China Standard Time)
	 */

	/*                                                                                      *
	 *                                         keys                                         *
	 *                                                                                      */
	//========================================================================================

	function defaultObjKeyHandler(prop, obj) {
	  return prop;
	}

	function doObjKeys(each, obj) {
	  var rs = [],
	      args = arguments;
	  var handler = defaultObjKeyHandler,
	      i = 2,
	      j = 0;

	  if (isFn(args[i])) {
	    handler = args[i++];
	    if (!isBool(args[i])) handler = bind(handler, args[i++]);
	  }

	  each(obj, function (prop, obj) {
	    var val = handler(prop, obj);
	    if (val === STOP) return STOP;
	    if (val !== SKIP) rs[j++] = val;
	  }, null, args[i]);
	  return rs;
	}
	/**
	 * @param obj		target
	 * @param handler	key handler
	 * @param scope		scope or handler
	 * @param own		is get own properties, default: true
	 */

	function keys(obj, callback, scope, own) {
	  return doObjKeys(eachProps, obj, callback, scope, own);
	} //========================================================================================

	/*                                                                                      *
	 *                                        values                                        *
	 *                                                                                      */
	//========================================================================================

	function defaultObjValueHandler(value, prop, obj) {
	  return value;
	}

	function doObjValues(each, obj) {
	  var rs = [],
	      args = arguments;
	  var handler = defaultObjValueHandler,
	      i = 1,
	      j = 0;

	  if (isFn(args[i])) {
	    handler = args[i++];
	    if (!isBool(args[i])) handler = bind(handler, args[i++]);
	  }

	  each(obj, function (data, prop, obj) {
	    var val = handler(data, prop, obj);
	    if (val === STOP) return STOP;
	    if (val !== SKIP) rs[j++] = val;
	  }, null, args[i]);
	  return rs;
	}
	/**
	 * @param obj		target
	 * @param handler	value handler
	 * @param scope		scope or handler
	 * @param own		is get own properties, default: true
	 */

	function values(obj, callback, scope, own) {
	  return doObjValues(eachObj, obj, callback, scope, own);
	}

	/**
	 * @module utility/collection
	 * @author Tao Zeng <tao.zeng.zt@qq.com>
	 * @created Fri Nov 16 2018 16:29:04 GMT+0800 (China Standard Time)
	 * @modified Thu Apr 04 2019 19:38:40 GMT+0800 (China Standard Time)
	 */
	/**
	 * @return STOP or SKIP or [key: string, value: any]
	 */

	function doArr2Obj(each, array, callback, scope) {
	  var obj = create(null);
	  callback = bind(callback, scope);
	  each(array, function (data, index, array) {
	    var r = callback(data, index, array);

	    if (isArray(r)) {
	      obj[r[0]] = r[1];
	    } else {
	      return r;
	    }
	  });
	  return obj;
	}
	/**
	 * convert array to object
	 */

	function arr2obj(array, callback, scope) {
	  return doArr2Obj(eachArray, array, callback, scope);
	}
	/**
	 * convert array or string to object
	 * @param array
	 * @param val	value or callback
	 * @param split	split char on string
	 */

	function makeMap(array, val, split) {
	  if (isStr(array)) array = array.split(isStr(split) ? split : ',');
	  return arr2obj(array, isFn(val) ? val : function (data) {
	    return [data, val];
	  });
	}

	/**
	 * @module utility/collection
	 * @author Tao Zeng <tao.zeng.zt@qq.com>
	 * @created Thu Nov 15 2018 12:13:54 GMT+0800 (China Standard Time)
	 * @modified Thu Mar 28 2019 19:39:52 GMT+0800 (China Standard Time)
	 */
	function makeArray(len, callback) {
	  var array = new Array(len);
	  var i = len;

	  while (i--) {
	    array[i] = callback(i);
	  }

	  return array;
	}

	/**
	 * @module utility/defProp
	 * @author Tao Zeng <tao.zeng.zt@qq.com>
	 * @created Fri Nov 30 2018 14:41:02 GMT+0800 (China Standard Time)
	 * @modified Tue Mar 26 2019 19:39:49 GMT+0800 (China Standard Time)
	 */
	var pathCache = create(null); // (^ | .) prop | (index | "string prop" | 'string prop')

	var pathReg = /(?:^|\.)([a-zA-Z$_][\w$]*)|\[\s*(?:(\d+)|"((?:[^\\"]|\\.)*)"|'((?:[^\\']|\\.)*)')\s*\]/g;
	function parsePath(propPath, cacheable) {
	  var path;

	  if (isArray(propPath)) {
	    path = propPath;
	  } else if (path = pathCache[propPath]) {
	    return path;
	  } else {
	    path = [];
	    var match,
	        idx = 0,
	        cidx,
	        i = 0;

	    while (match = pathReg.exec(propPath)) {
	      cidx = pathReg.lastIndex;
	      if (cidx !== idx + match[0].length) throw new SyntaxError("Invalid Path: \"" + propPath + "\", unkown character[" + propPath.charAt(idx) + "] at offset:" + idx);
	      path[i++] = match[1] || match[2] || match[3] || match[4];
	      idx = cidx;
	    }

	    if (propPath.length > idx + 1) {
	      throw new SyntaxError("Invalid Path: \"" + propPath + "\", unkown character[" + propPath.charAt(idx) + "] at offset:" + idx);
	    }

	    if (cacheable !== false && i) {
	      pathCache[propPath] = path;
	    }
	  }

	  if (!path.length) throw new Error("Empty Path: " + propPath);
	  return path;
	}
	function formatPath(path) {
	  return isArray(path) ? path.path || (path.path = mapArray(path, formatPathHandler).join('')) : path;
	}

	function formatPathHandler(prop) {
	  return "[\"" + String(prop).replace("'", '\\"') + "\"]";
	}

	function get(obj, path) {
	  path = parsePath(path);
	  var l = path.length - 1;
	  var i = 0;

	  for (; i < l; i++) {
	    obj = obj[path[i]];
	    if (obj === null || obj === undefined) return;
	  }

	  return obj[path[i]];
	}
	function set(obj, path, value) {
	  path = parsePath(path);
	  var l = path.length - 1;
	  var i = 0,
	      v;

	  for (; i < l; i++) {
	    v = obj[path[i]];
	    obj = v === null || v === undefined ? obj[path[i]] = {} : v;
	  }

	  obj[path[i]] = value;
	}

	/**
	 * String utilities
	 * @module utility/string
	 * @author Tao Zeng <tao.zeng.zt@qq.com>
	 * @created Mon Dec 11 2017 13:57:32 GMT+0800 (China Standard Time)
	 * @modified Sat Mar 23 2019 18:50:35 GMT+0800 (China Standard Time)
	 */
	//========================================================================================

	/*                                                                                      *
	 *                                       char code                                      *
	 *                                                                                      */
	//========================================================================================

	/**
	 * get char code
	 * > string.charCodeAt
	 */
	function charCode(str, index) {
	  return str.charCodeAt(index || 0);
	}
	/**
	 * get char by char code
	 * > String.fromCharCode
	 */

	function char(code) {
	  return String.fromCharCode(code);
	}
	function cutStr(str, start, end) {
	  return str.substring(start, end);
	}
	function cutLStr(str, start, len) {
	  return str.substr(start, len);
	} //========================================================================================

	/*                                                                                      *
	 *                                         trim                                         *
	 *                                                                                      */
	//========================================================================================

	var TRIM_REG = /(^\s+)|(\s+$)/g;
	/**
	 * trim
	 */

	function trim(str) {
	  return str.replace(TRIM_REG, '');
	} //========================================================================================

	/*                                                                                      *
	 *                                         case                                         *
	 *                                                                                      */
	//========================================================================================

	var FIRST_LOWER_LETTER_REG = /^[a-z]/,
	    FIRST_UPPER_LETTER_REG = /^[A-Z]/;
	function upper(str) {
	  return str.toUpperCase();
	}
	function lower(str) {
	  return str.toLowerCase();
	}
	function upperFirst(str) {
	  return str.replace(FIRST_LOWER_LETTER_REG, upper);
	}
	function lowerFirst(str) {
	  return str.replace(FIRST_UPPER_LETTER_REG, lower);
	} //========================================================================================

	/*                                                                                      *
	 *                                        escape                                        *
	 *                                                                                      */
	//========================================================================================

	var STR_ESCAPE_MAP = {
	  '\n': '\\n',
	  '\t': '\\t',
	  '\f': '\\f',
	  '"': '\\"',
	  "'": "\\'"
	},
	    STR_ESCAPE = /[\n\t\f"']/g;
	function escapeStr(str) {
	  return str.replace(STR_ESCAPE, function (str) {
	    return STR_ESCAPE_MAP[str];
	  });
	}

	/**
	 * @module utility/format
	 * @author Tao Zeng <tao.zeng.zt@qq.com>
	 * @created Mon Dec 03 2018 19:46:41 GMT+0800 (China Standard Time)
	 * @modified Wed Apr 03 2019 11:34:07 GMT+0800 (China Standard Time)
	 */

	/*                                                                                      *
	 *                                     pad & shorten                                    *
	 *                                                                                      */
	//========================================================================================

	function pad(str, len, chr, leftAlign) {
	  return len > str.length ? __pad(str, len, chr, leftAlign) : str;
	}
	function shorten(str, len, suffix) {
	  return len < str.length ? (suffix = suffix || '', str.substr(0, len - suffix.length) + suffix) : str;
	}

	function __pad(str, len, chr, leftAlign) {
	  var pad = new Array(len - str.length + 1).join(chr || ' ');
	  return leftAlign ? str + pad : pad + str;
	} //========================================================================================

	/*                                                                                      *
	 *                                       Separator                                      *
	 *                                                                                      */
	//========================================================================================


	var thousandSeparate = mkSeparator(3),
	    binarySeparate = mkSeparator(8, '01'),
	    octalSeparate = mkSeparator(4, '0-7'),
	    hexSeparate = mkSeparator(4, '\\da-fA-F');

	function mkSeparator(group, valReg) {
	  valReg = valReg || '\\d';
	  var reg = new RegExp("^(?:[+-]|\\s+|0[xXbBoO])|([" + valReg + "])(?=([" + valReg + "]{" + group + "})+(?![" + valReg + "]))|[^" + valReg + "].*", 'g');
	  return function (numStr) {
	    return numStr.replace(reg, separatorHandler);
	  };
	}

	function separatorHandler(m, d) {
	  return d ? d + ',' : m;
	} //========================================================================================

	/*                                                                                      *
	 *                                   plural & singular                                  *
	 *                                                                                      */
	//========================================================================================


	var PLURAL_REG = /([a-zA-Z]+)([^aeiou])y$|([sxzh])$|([aeiou]y)$|([^sxzhy])$/;
	function plural(str) {
	  return str.replace(PLURAL_REG, pluralHandler);
	}

	function pluralHandler(m, v, ies, es, ys, s) {
	  return v + (ies ? ies + 'ies' : es ? es + 'es' : (ys || s) + 's');
	}

	var SINGULAR_REG = /([a-zA-Z]+)([^aeiou])ies$|([sxzh])es$|([aeiou]y)s$|([^sxzhy])s$/;
	function singular(str) {
	  return str.replace(SINGULAR_REG, singularHandler);
	}

	function singularHandler(m, v, ies, es, ys, s) {
	  return v + (ies ? ies + 'y' : es || ys || s);
	} //========================================================================================

	/*                                                                                      *
	 *                                     format flags                                     *
	 *                                                                                      */
	//========================================================================================


	var FORMAT_XPREFIX = 0x1;
	var FORMAT_PLUS = 0x2;
	var FORMAT_ZERO = 0x4;
	var FORMAT_SPACE = 0x8;
	var FORMAT_SEPARATOR = 0x10;
	var FORMAT_LEFT = 0x20;
	var FLAG_MAPPING = {
	  '#': FORMAT_XPREFIX,
	  '+': FORMAT_PLUS,
	  '0': FORMAT_ZERO,
	  ' ': FORMAT_SPACE,
	  ',': FORMAT_SEPARATOR,
	  '-': FORMAT_LEFT
	};

	function parseFlags(f) {
	  var flags = 0;

	  if (f) {
	    var i = f.length;

	    while (i--) {
	      flags |= FLAG_MAPPING[f.charAt(i)];
	    }
	  }

	  return flags;
	} //========================================================================================

	/*                                                                                      *
	 *                                      format Rule                                     *
	 *                                                                                      */
	//========================================================================================
	//   0      1      2     3     4       5       6           7         8      9           10             11             12        13
	// [match, expr, index, prop, flags, width, width-idx, width-prop, fill, precision, precision-idx, precision-prop, shorten-suffix, type]


	var paramIdxR = "(\\d+|\\$|@)",
	    paramPropR = "(?:\\{((?:[a-zA-Z$_][\\w$_]*|\\[(?:\\d+|\"(?:[^\\\\\"]|\\\\.)*\"|'(?:[^\\\\']|\\\\.)*')\\])(?:\\.[a-zA-Z$_][\\w$_]*|\\[(?:\\d+|\"(?:[^\\\\\"]|\\\\.)*\"|'(?:[^\\\\']|\\\\.)*')\\])*)\\})",
	    widthR = "(?:([1-9]\\d*)|&" + paramIdxR + paramPropR + ")",
	    fillR = "(?:=(.))",
	    shortenSuffixR = "(?:=\"((?:[^\\\\\"]|\\\\.)*)\")",
	    formatReg = new RegExp("\\\\.|(\\{" + paramIdxR + "?" + paramPropR + "?(?::([#,+\\- 0]*)(?:" + widthR + fillR + "?)?(?:\\." + widthR + shortenSuffixR + "?)?)?([a-zA-Z_][a-zA-Z0-9_$]*)?\\})", 'g'); //========================================================================================

	/*                                                                                      *
	 *                                      Formatters                                      *
	 *                                                                                      */
	//========================================================================================

	var formatters = create(null);
	function extendFormatter(obj) {
	  var fmt, name;

	  for (name in obj) {
	    fmt = obj[name];
	    isFn(fmt) && (formatters[name] = fmt);
	  }
	}
	function getFormatter(name) {
	  var f = formatters[name || 's'];
	  if (f) return f;
	  throw new Error("Invalid Formatter: " + name);
	} //========================================================================================

	/*                                                                                      *
	 *                           format by every parameter object                           *
	 *                                                                                      */
	//========================================================================================

	/**
	 * Syntax:
	 * @example
	 * 	'{'
	 * 		(<parameter>)?
	 * 		(
	 * 			':'
	 * 			(<flags>)?
	 * 			(
	 * 				<width> ('=' <fill-char>)?
	 * 			)?
	 * 			(
	 * 				'.'
	 * 				<precision> ('=' '"' <shorten-suffix> '"')?
	 * 			)?
	 * 		)?
	 * 		(<type>)?
	 * 	'}'
	 *
	 * - parameter
	 * 		- {}					format by next unused argument
	 * 		- {<number>}			format by arguments[number]
	 * 		- {@}					format by current used argument
	 * 		- {$}					format by next unused argument
	 * 		- {{name}}				format by "name" property on next unused argument
	 * 		- {<number>{name}}		format by "name" property on arguments[number]
	 * 		- {@{name}}				format by "name" property on current used argument
	 * 		- {${name}}				format by "name" property on next unused argument
	 * @example
	 * 		format('<{} {}>', 'abc')				// return "<abc undefined>"
	 * 		format('<{$} {$}>', 'abc')				// return "<abc undefined>"
	 * 		format('<{@} {} {@}>', 'abc')			// return "<abc abc abc>"
	 * 		format('<{0} {} {0}>', 'abc')			// return "<abc abc abc>"
	 * 		format('<{0{value}} {${value}} {@{value}} {{value.a}}>', {value: 'abc'}, {value: {a: 'cbd'}})
	 * 		// return "<abc abc abc bcd>"
	 * 		format('<{0{[0]}} {${[0]}} {@{[0]}} {{[0].a}}>', ['abc'], [{a: 'cbd'}])
	 * 		// return "<abc abc abc bcd>"
	 *
	 * - flags
	 * 		- {:#}    	FORMAT_XPREFIX
	 * 					ensure the leading "0" for any octal
	 * 					prefix non-zero hexadecimal with "0x" or "0X"
	 * 					prefix non-zero binary with "0b" or "0B"
	 * 		- {:+}    	FORMAT_PLUS
	 * 					Forces to preceed the result with a plus or minus sign (+ or -) even for positive numbers.
	 * 					By default, only negative numbers are preceded with a - sign
	 * 		- {:0}		FORMAT_ZERO
	 * 					Left-pads the number with zeroes (0) instead of spaces when padding is specified
	 * 		- {: }   	FORMAT_SPACE
	 * 					If no sign is going to be written, a blank space is inserted before the value
	 * 		- {:,}		FORMAT_SEPARATOR
	 * 					use thousand separator on decimal number
	 * 					hexadecimal number: FFFFFFFF => FFFF,FFFF
	 * 					octal number: 77777777 => 7777,7777
	 * 					binary number: 1111111111111111 => 11111111,11111111
	 * 		{:-}    	FORMAT_LEFT
	 * 					Left-justify within the given field width; Right justification is the default
	 * @example
	 * 		format('<{: d}>',  12);		// return "< 12>"
	 *		format('<{: d}>',   0);		// return "< 0>"
	 *		format('<{: d}>', -12);		// return "<-12>"
	 *		format('<{:+d}>',  12);		// return "<+12>"
	 *		format('<{:+d}>',   0);		// return "<+0>"
	 *		format('<{:+d}>', -12);		// return "<-12>"
	 *		format('<{:6s}>',  12);		// return "<    12>"
	 *		format('<{:-6s}>', 12);		// return "<12    >"
	 *		format('<{:#o}>',  12);		// return "<014>"
	 *		format('<{:#x}>',  12);		// return "<0xc>"
	 *		format('<{:#X}>',  12);		// return "<0XC>"
	 *		format('<{:#b}>',  12);		// return "<0b1100>"
	 *		format('<{:#B}>',  12);		// return "<0B1100>"

	 * - width
	 * 		Minimum number of characters to be printed.
	 * 		If the value to be printed is shorter than this number, the result is padded with pad char(default is space).
	 * 		The value is not truncated even if the result is larger.
	 *		- width value
	 * 			{:<number>}
	 * 			{:&@}
	 * 			{:&$}
	 * 			{:&<number>}
	 * 			{:&@{<prop>}}
	 * 			{:&${<prop>}}
	 * 			{:&<number>{<prop>}}
	 *		- pad char
	 * 			{:&@=<pad-char>}
	 * 			{:&$=<pad-char>}
	 * 			{:&<number>=<pad-char>}
	 * 			{:&@{<prop>}=<pad-char>}
	 * 			{:&${<prop>}=<pad-char>}
	 * 			{:&<number>{<prop>}=<pad-char>}
	 * @example
	 * - precision
	 * 		For integer specifiers (d,  o, u, x, X): precision specifies the minimum number of digits to be written.
	 * 		If the value to be written is shorter than this number, the result is padded with leading zeros.
	 * 		The value is not truncated even if the result is longer. A precision of 0 means that no character is written for the value 0.
	 * 		For a, A, e, E, f and F specifiers: this is the number of digits to be printed after the decimal point (by default, this is 6).
	 * 		For g and G specifiers: This is the maximum number of significant digits to be printed.
	 * 		For s: this is the maximum number of characters to be printed. By default all characters are printed until the ending null character is encountered.
	 * 		If the period is specified without an explicit value for precision, 0 is assumed.
	 * 		- precision value
	 * 			{:.<number>}
	 * 			{:.&@}
	 * 			{:.&$}
	 * 			{:.&<number>}
	 * 			{:.&@{<prop>}}
	 * 			{:.&${<prop>}}
	 * 			{:.&<number>{<prop>}}
	 * 		- shorten suffix
	 * 			{:.&@="<suffix>"}
	 * 			{:.&$="<suffix>"}
	 * 			{:.&<number>="<suffix>"}
	 * 			{:.&@{<prop>}="<suffix>"}
	 * 			{:.&${<prop>}="<suffix>"}
	 * 			{:.&<number>{<prop>}="<suffix>"}
	 * - type
	 * 		- default types
	 *			- {c}		Character
	 * 			- {s}		String
	 * 			- {j}		JSON String
	 * 			- {y}		Date Year
	 * 			- {m}		Date Month
	 * 			- {w}		Date Weekly
	 * 			- {W}		Date Weekly
	 * 			- {D}		Date
	 * 			- {H}		Date
	 * 			- {M}		Date
	 * 			- {S}		Date
	 * 			- {d} 		Signed decimal integer
	 *			- {u}		Unsigned decimal integer
	 *			- {o}		Unsigned octal
	 *			- {x}		Unsigned hexadecimal integer
	 *			- {X}		Unsigned hexadecimal integer (uppercase)
	 *			- {f}		Decimal floating point, lowercase,
	 *			- {e}		Scientific notation (mantissa/exponent), lowercase
	 *			- {E}		Scientific notation (mantissa/exponent), uppercase
	 *			- {g}		Use the shortest representation: %e or %f
	 *			- {G}		Use the shortest representation: %E or %F
	 * - Rules
	 * 		- property-path
	 * 				(
	 * 					(?:
	 * 						[a-zA-Z$_][\w$_]*|
	 * 						\[
	 * 						(?:
	 * 							\d+|
	 * 							"(?:[^\\"]|\\.)*"|
	 * 							'(?:[^\\']|\\.)*'
	 * 						)
	 * 						\]
	 * 					)
	 * 					(?:
	 * 						\.[a-zA-Z$_][\w$_]*|
	 * 						\[
	 * 						(?:
	 * 							\d+|
	 * 							"(?:[^\\"]|\\.)*"|
	 * 							'(?:[^\\']|\\.)*'
	 * 						)
	 * 						\]
	 * 					)*
	 * 				)
	 * 		- expression
	 * 			/\\.|												// escape
	 * 			(													// 1: expression
	 * 				\{
	 * 				(\d+|\$|@)?										// 2: parameter index
	 * 				(?:\{<property-path>\})?						// 3: property path of parameter
	 * 				(?:
	 * 					:
	 * 					([#,+\- ]*)									// 4: flags
	 * 					(?:
	 * 						(?:
	 * 							(\d+)|								// 5: width
	 * 							(?:
	 * 								&
	 * 								(\d+|\$|@)						// 6: parameter index of width
	 * 								(?:\{<property-path>\})?		// 7: property path of width parameter
	 * 							)
	 * 						)
	 * 						(?:=(.))?								// 8: pad fill
	 * 					)?
	 * 					(?:
	 * 						\.
	 * 						(?:
	 * 							(\d+)|								// 9: width
	 * 							(?:
	 * 								&
	 * 								(\d+|\$|@)						// 10: parameter index of width
	 * 								(?:\{<property-path>\})?		// 11: property path of width parameter
	 * 							)
	 * 						)
	 * 						(?:
	 * 							=
	 * 							"
	 * 							((?:[^\\"]|\\.)*)					// 12: shorten su
	 * 							"
	 * 						)
	 * 					)?
	 * 				)?
	 * 				([a-zA-Z_][a-zA-Z0-9_$]*)?						// 13: data type
	 * 				\}
	 * 			)/
	 * @param fmt 		format String
	 * @param args		format arguments
	 * @param offset	start offset of arguments
	 * @param getParam	get parameter on arguments callback
	 */

	function vformat(fmt, args, offset, getParam) {
	  offset = offset || 0;
	  var start = offset;
	  getParam = getParam || defaultGetParam;
	  return fmt.replace(formatReg, function (s, m, param, paramProp, flags, width, widx, wprop, fill, precision, pidx, pprop, shortenSuffix, type) {
	    if (!m) return s.charAt(1);
	    return getFormatter(type)(parseParam(param || '$', paramProp), parseFlags(flags), parseWidth(width, widx, wprop) || 0, fill, parseWidth(precision, pidx, pprop), shortenSuffix);
	  });

	  function parseWidth(width, idx, prop) {
	    if (width) return width >> 0;

	    if (idx) {
	      var w = parseParam(idx, prop) >> 0;
	      if (isFinite(w)) return w;
	    }
	  }

	  function parseParam(paramIdx, prop) {
	    var param = getParam(args, paramIdx === '$' ? offset++ : paramIdx === '@' ? offset === start ? offset : offset - 1 : paramIdx >> 0);
	    return prop ? get(param, prop) : param;
	  }
	}

	function defaultGetParam(args, idx) {
	  return args[idx];
	} //========================================================================================

	/*                                                                                      *
	 *                                        format                                        *
	 *                                                                                      */
	//========================================================================================

	/**
	 * @see vformat
	 * @param fmt	format string
	 * @param args	format arguments
	 */


	function format(fmt) {
	  return vformat(fmt, arguments, 0, getFormatParam);
	}

	function getFormatParam(args, idx) {
	  return args[idx + 1];
	} //========================================================================================

	/*                                                                                      *
	 *                                       formatter                                      *
	 *                                                                                      */
	//========================================================================================


	var GET_PARAM_VAR = 'getp',
	    GET_PROP_VAR = 'get',
	    STATE_VAR = 'state';

	function createFormatter(m, getParam) {
	  return createFn("return function(args, " + STATE_VAR + "){\nreturn fmt(" + getParamCode(m[2] || '$', m[3]) + ",\n\"" + parseFlags(m[4]) + "\",\n" + getWidthCode(m[5], m[6], m[7], '0') + ",\n\"" + (m[8] ? escapeStr(m[8]) : ' ') + "\",\n" + getWidthCode(m[9], m[10], m[11], 'void 0') + ",\n\"" + (m[12] ? escapeStr(m[12]) : '') + "\");\n}", ['fmt', GET_PROP_VAR, GET_PARAM_VAR])(getFormatter(m[13]), get, getParam);
	}

	function getWidthCode(width, idx, prop, def) {
	  return width ? width : idx ? getParamCode(idx, prop) : def;
	}

	function getParamCode(idx, prop) {
	  var code = GET_PARAM_VAR + "(args, " + (idx === '$' ? STATE_VAR + "[0]++" : idx === '@' ? STATE_VAR + "[0] === " + STATE_VAR + "[1] ? " + STATE_VAR + "[0] : " + STATE_VAR + "[0] - 1" : idx) + ")";

	  if (prop) {
	    var path = parsePath(prop);
	    var i = path.length;
	    var strs = new Array(i);

	    while (i--) {
	      strs[i] = "\"" + escapeStr(path[i]) + "\"";
	    }

	    return GET_PROP_VAR + "(" + code + ", [" + strs.join(', ') + "])";
	  }

	  return code;
	}

	/**
	 * @see vformat
	 * @param fmt		format string
	 * @param offset	start offset of arguments
	 * @param getParam	get parameter on arguments callback
	 */
	function formatter(fmt, offset, getParam) {
	  var m,
	      lastIdx = 0,
	      mStart,
	      mEnd,
	      arr = [],
	      codes = [],
	      i = 0;
	  offset = offset || 0;

	  while (m = formatReg.exec(fmt)) {
	    mEnd = formatReg.lastIndex;
	    mStart = mEnd - m[0].length;
	    lastIdx < mStart && pushStr(cutStr(fmt, lastIdx, mStart), 0);

	    if (m[1]) {
	      codes[i] = "arr[" + i + "](arguments, " + STATE_VAR + ")";
	      arr[i++] = createFormatter(m, getParam || defaultGetParam);
	    } else {
	      pushStr(m[0].charAt(1), i);
	    }

	    lastIdx = mEnd;
	  }

	  lastIdx < fmt.length && pushStr(cutStr(fmt, lastIdx), i);
	  return createFn("return function(){var " + STATE_VAR + " = [" + offset + ", " + offset + "]; return " + codes.join(' + ') + "}", ['arr'])(arr);

	  function pushStr(str, append) {
	    if (append && arr[i - 1].match) {
	      arr[i - 1] += str;
	    } else {
	      codes[i] = "arr[" + i + "]";
	      arr[i++] = str;
	    }
	  }
	}
	/*
	setTimeout(() => {
		var f,
			n = 100000
		console.time()
		for (var i = 0; i < n; i++) {
			f = formatter(`{:.10="..."}`)
		}
		console.timeEnd()
		console.time()
		for (var i = 0; i < n; i++) {
			f('abbdddded')
		}
		console.timeEnd()
		console.time()
		for (var i = 0; i < n; i++) {
			format(`{:.10="..."}`, 'abbdddded')
		}
		console.timeEnd()
		console.log(formatter(`{:.10="..."}`).toString())
	}) */
	//========================================================================================

	/*                                                                                      *
	 *                                  default formatters                                  *
	 *                                                                                      */
	//========================================================================================

	function strFormatter(toStr) {
	  return function (val, flags, width, fill, precision, shortenSuffix) {
	    var str = toStr(val, flags);
	    return width > str.length ? __pad(str, width, fill, flags & FORMAT_LEFT) : shorten(str, precision, shortenSuffix);
	  };
	}

	function numFormatter(parseNum, getPrefix, toStr, separator) {
	  return function (val, flags, width, fill, precision) {
	    var num = parseNum(val);
	    if (!isFinite(num)) return String(num);
	    var prefix = getPrefix(num, flags),
	        plen = prefix.length;
	    var str = toStr(num < 0 ? -num : num, flags, precision);
	    return flags & FORMAT_ZERO ? (str = prefix + pad(str, width - plen, '0'), flags & FORMAT_SEPARATOR ? separator(str) : str) : (flags & FORMAT_SEPARATOR && (str = separator(str)), pad(prefix + str, width, fill, flags & FORMAT_LEFT));
	  };
	}

	function decimalPrefix(num, flags) {
	  return num < 0 ? '-' : flags & FORMAT_PLUS ? '+' : flags & FORMAT_SPACE ? ' ' : '';
	} //──── base formatter ───────────────────────────────────────────────────────────────────────


	var BASE_RADIXS = {
	  b: [2, binarySeparate],
	  o: [8, octalSeparate],
	  u: [10, thousandSeparate],
	  x: [16, hexSeparate]
	};
	var BASE_PREFIXS = ['0b', '0o', '0x'];

	function baseFormatter(type) {
	  var base = BASE_RADIXS[type.toLowerCase()],
	      n = base[0],
	      __toStr = function __toStr(num) {
	    return num.toString(n);
	  },
	      toStr = type === 'X' ? function (num) {
	    return upper(__toStr(num));
	  } : __toStr;

	  var xprefix = n === 10 ? '' : BASE_PREFIXS[n >> 3];
	  charCode(type) < 96 && (xprefix = upper(xprefix));
	  return numFormatter(function (v) {
	    return v >>> 0;
	  }, function (num, flags) {
	    return flags & FORMAT_XPREFIX ? xprefix : '';
	  }, toStr, base[1]);
	} //──── float formatter ───────────────────────────────────────────────────────────────────


	function floatFormatter(type) {
	  var ____toStr = upper(type) === 'E' ? toExponential : type === 'f' ? toFixed : toPrecision,
	      __toStr = function __toStr(num, flags, precision) {
	    return ____toStr(num, precision) || String(num);
	  },
	      toStr = charCode(type) > 96 ? __toStr : function (num, flags, precision) {
	    return upper(__toStr(num, flags, precision));
	  };

	  return numFormatter(parseFloat, decimalPrefix, toStr, thousandSeparate);
	}

	function toExponential(num, precision) {
	  return num.toExponential(precision);
	}

	function toPrecision(num, precision) {
	  return precision && num.toPrecision(precision);
	}

	function toFixed(num, precision) {
	  return precision >= 0 && num.toFixed(precision);
	} //──── register formatters ───────────────────────────────────────────────────────────────


	extendFormatter({
	  s: strFormatter(toStr$1),
	  j: strFormatter(function (v) {
	    return v === undefined || isFn(v) || v.toJSON && v.toJSON() === undefined ? toStr$1(v) : JSON.stringify(v);
	  }),
	  c: function c(val) {
	    var num = val >> 0;
	    return num > 0 ? String.fromCharCode(num) : '';
	  },
	  d: numFormatter(function (val) {
	    return val >> 0;
	  }, decimalPrefix, toStr$1, thousandSeparate),
	  e: floatFormatter('e'),
	  E: floatFormatter('E'),
	  f: floatFormatter('f'),
	  g: floatFormatter('g'),
	  G: floatFormatter('G'),
	  b: baseFormatter('b'),
	  B: baseFormatter('B'),
	  o: baseFormatter('o'),
	  O: baseFormatter('O'),
	  u: baseFormatter('u'),
	  x: baseFormatter('x'),
	  X: baseFormatter('X')
	});

	function toStr$1(v) {
	  return String(v);
	}

	/**
	 * Object.assign shim
	 * @module utility/assign
	 * @author Tao Zeng <tao.zeng.zt@qq.com>
	 * @created Wed Jul 25 2018 15:22:13 GMT+0800 (China Standard Time)
	 * @modified Thu Mar 14 2019 09:28:49 GMT+0800 (China Standard Time)
	 */
	/**
	 * @param prop
	 * @param target
	 * @param override
	 * @return is assign
	 */

	/**
	 *
	 * @param target
	 * @param overrides
	 * @param filter
	 * @param startOffset 	start offset in overrides, default: 0
	 * @param endOffset 	end offset in overrides, default: overrides.length-1
	 */
	function doAssign(target, overrides, filter, startOffset, endOffset) {
	  if (!target) {
	    target = {};
	  }

	  var l = endOffset || overrides.length;
	  var i = startOffset || 0,
	      override,
	      prop;

	  for (; i < l; i++) {
	    if (override = overrides[i]) {
	      for (prop in override) {
	        if (!defaultKeyMap[prop] && filter(prop, target, override)) {
	          target[prop] = override[prop];
	        }
	      }
	    }
	  }

	  return target;
	}
	/**
	 * assign properties
	 * > Object.assign shim
	 */

	function assign(target) {
	  return doAssign(target, arguments, defaultAssignFilter, 1);
	}
	/**
	 * assign un-exist properties
	 */

	function assignIf(target) {
	  return doAssign(target, arguments, assignIfFilter, 1);
	}
	/**
	 * default assign filter
	 * - property is owner in override
	 * @see {AssignFilter}
	 */

	function defaultAssignFilter(prop, target, override) {
	  return hasOwnProp(override, prop);
	}
	/**
	 * assign if filter
	 * - property is owner in override
	 * - property not in target object
	 * @see {AssignFilter}
	 */

	function assignIfFilter(prop, target, override) {
	  return hasOwnProp(override, prop) && !(prop in target);
	}

	/**
	 * @module utility
	 * @author Tao Zeng <tao.zeng.zt@qq.com>
	 * @created Wed Jul 25 2018 15:24:47 GMT+0800 (China Standard Time)
	 * @modified Thu Mar 14 2019 15:05:03 GMT+0800 (China Standard Time)
	 */
	var REG_PROPS = ['source', 'global', 'ignoreCase', 'multiline'];
	function deepEq(actual, expected) {
	  return doDeepEq(actual, expected, eq, doDeepEqObj);
	}
	function doDeepEq(actual, expected, eq, eqObj) {
	  if (eq(actual, expected)) return true;

	  if (actual && expected && getConstructor(actual) === getConstructor(expected)) {
	    if (isPrimitive(actual)) return String(actual) === String(expected);
	    if (isDate(actual)) return actual.getTime() === expected.getTime();
	    if (isReg(actual)) return eqProps(actual, expected, REG_PROPS);
	    if (isArray(actual)) return eqArray(actual, expected, eq, eqObj);
	    if (isTypedArray(actual)) return eqTypeArray(actual, expected);
	    return eqObj(actual, expected);
	  }

	  return false;
	}
	function doDeepEqObj(actual, expected) {
	  var cache = create(null);
	  var k;

	  for (k in actual) {
	    if (!defaultKeyMap[k] && notEqObjKey(actual, expected, k)) {
	      return false;
	    }

	    cache[k] = true;
	  }

	  for (k in expected) {
	    if (!cache[k] && !defaultKeyMap[k] && notEqObjKey(actual, expected, k)) {
	      return false;
	    }
	  }

	  return true;
	}

	function notEqObjKey(actual, expected, k) {
	  return hasOwnProp(actual, k) ? !hasOwnProp(expected, k) || !deepEq(actual[k], expected[k]) : hasOwnProp(expected, k);
	}

	function eqProps(actual, expected, props) {
	  var i = props.length;

	  while (i--) {
	    if (actual[props[i]] !== expected[props[i]]) {
	      return false;
	    }
	  }

	  return true;
	}

	function eqTypeArray(actual, expected) {
	  var i = actual.length;

	  if (i !== expected.length) {
	    return false;
	  }

	  while (i--) {
	    if (actual[i] !== expected[i]) {
	      return false;
	    }
	  }

	  return true;
	}

	function eqArray(actual, expected, eq, eqObj) {
	  var i = actual.length;

	  if (i !== expected.length) {
	    return false;
	  }

	  while (i--) {
	    if (!doDeepEq(actual[i], expected[i], eq, eqObj)) {
	      return false;
	    }
	  }

	  return true;
	}

	/**
	 * @module utility/assert
	 * @author Tao Zeng <tao.zeng.zt@qq.com>
	 * @created Wed Nov 28 2018 11:01:45 GMT+0800 (China Standard Time)
	 * @modified Wed Apr 03 2019 12:46:25 GMT+0800 (China Standard Time)
	 */
	var formatters$1 = create(null);

	function mkError(Err, msg, args, msgIdx) {
	  var fmtter = formatters$1[msg] || (formatters$1[msg] = formatter(msg, msgIdx, function (args, offset) {
	    return args[0][offset >= msgIdx ? offset + 1 : offset];
	  }));
	  return popErrStack(new Err(fmtter(args)), 2);
	}

	function popErrStack(err, i) {
	  while (i-- > 0) {
	    err.stack = err.stack.replace(/(\n\s{4}at[^\n]*)/, '');
	  }

	  return err;
	}
	var assert = function assert(msg) {
	  throw mkError(Error, msg || 'Error', arguments, 0);
	};
	var ERROR = new Error();

	function mkThrowAssertor(th, dmsg) {
	  return function throwErr(fn, expect, msg) {
	    var err;

	    try {
	      fn();
	    } catch (e) {
	      err = e;
	    }

	    if (th != (err && (!expect || (isStr(expect) ? expect === err.message : err[CONSTRUCTOR] === expect[CONSTRUCTOR] && (!expect.message || expect.message === err.message))))) {
	      arguments[0] = err;
	      !expect && (arguments[2] = ERROR);
	      throw mkError(Error, msg || dmsg, arguments, 2);
	    }

	    return assert;
	  };
	}

	assert["throw"] = mkThrowAssertor(true, "expected catched error {0s} is {1s}");
	assert.notThrow = mkThrowAssertor(false, "expected catched error {0s} is not {1s}");
	/**
	 * @param name 		name of the assertor
	 * @param condition condition, function or expression
	 * @param args 		name or length of the parameters
	 * @param dmsg  	the default message
	 * @param Err  		the Error Constructor, default Error
	 */

	function mkAssertor(name, condition, args, dmsg, Err) {
	  var params = isStr(args) ? args.split(/,/g) : isNum(args) ? makeArray(args, function (i) {
	    return "arg" + (i + 1);
	  }) : args,
	      paramStr = params.join(', '),
	      cond = isArray(condition) ? condition[0] : condition,
	      expr = (isArray(condition) ? condition[1] : '') + (isStr(cond) ? "(" + cond + ")" : "cond(" + paramStr + ")");
	  return assert[name] = createFn("return function assert" + upperFirst(name) + "(" + paramStr + ", msg){\n\tif (" + expr + ")\n\t\tthrow mkErr(Err, msg || dmsg, arguments, " + params.length + ");\n\treturn assert;\n}", ['Err', 'mkErr', 'dmsg', 'cond', 'assert'])(Err || Error, mkError, dmsg, cond, assert);
	} // [condition, argcount?, [msg, not msg], Error]


	function mkAssertors(apis) {
	  eachObj(apis, function (desc, name) {
	    var condition = desc[0],
	        args = desc[1],
	        msg = desc[2],
	        Err = desc[3] || TypeError;
	    msg[0] && mkAssertor(name, [condition, '!'], args, msg[0], Err);
	    msg[1] && mkAssertor('not' + upperFirst(name), condition, args, msg[1], Err);
	  });
	}

	var UNDEFINED = TYPE_UNDEF,
	    BOOLEAN = TYPE_BOOL,
	    NUMBER = TYPE_NUM,
	    STRING = TYPE_STRING,
	    FUNCTION = TYPE_FN,
	    NULL = 'null',
	    INTEGER = 'integer',
	    ARRAY = 'Array',
	    TYPED_ARRAY = 'TypedArray';
	mkAssertor('is', '!o', 'o', expectMsg('Exist'));
	mkAssertor('not', 'o', 'o', expectMsg('Not Exist'));
	mkAssertors({
	  eq: [eq, 2, mkMsg(objFormatter(1))],
	  eql: [deepEq, 2, mkMsg(objFormatter(1))],
	  nul: [isNull, 1, mkMsg(NULL)],
	  nil: [isNil, 1, mkMsg(typeExpect(NULL, UNDEFINED))],
	  undef: [isUndef, 1, mkMsg(UNDEFINED)],
	  bool: [isBool, 1, mkMsg(BOOLEAN)],
	  num: [isNum, 1, mkMsg(NUMBER)],
	  int: [isInt, 1, mkMsg(INTEGER)],
	  str: [isStr, 1, mkMsg(STRING)],
	  fn: [isFn, 1, mkMsg(FUNCTION)],
	  primitive: [isPrimitive, 1, mkMsg("Primitive type(" + typeExpect(NULL, UNDEFINED, BOOLEAN, NUMBER, INTEGER, STRING, FUNCTION) + ")")],
	  boolean: [isBoolean, 1, mkMsg(packTypeExpect(BOOLEAN))],
	  number: [isNumber, 1, mkMsg(packTypeExpect(NUMBER))],
	  string: [isString, 1, mkMsg(packTypeExpect(STRING))],
	  date: [isDate, 1, mkMsg('Date')],
	  reg: [isReg, 1, mkMsg('RegExp')],
	  array: [isArray, 1, mkMsg(ARRAY)],
	  typedArray: [isTypedArray, 1, mkMsg('TypedArray')],
	  arrayLike: [isArrayLike, 1, mkMsg(typeExpect(ARRAY, packTypeExpect(STRING), 'Arguments', TYPED_ARRAY, 'NodeList', 'HTMLCollection'))],
	  obj: [isObj, 1, mkMsg('Object')],
	  nan: [isNaN, 1, mkMsg('NaN')],
	  finite: [isFinite, 1, mkMsg('Finite')],
	  blank: [isBlank, 1, mkMsg('Blank')],
	  less: ['o<t', 'o,t', mkMsg(objFormatter(1), 'less than')],
	  greater: ['o>t', 'o,t', mkMsg(objFormatter(1), 'greater than')],
	  match: ['reg.test(str)', 'str,reg', mkMsg(objFormatter(1), 'match')],
	  range: ['o>=s&&o<e', 'o,s,e', mkMsg("[{1} - {2})")]
	});

	function mkMsg(expect, to) {
	  return [expectMsg(expect, false, to), expectMsg(expect, true, to)];
	}

	function expectMsg(expect, not, to) {
	  return "Expected " + objFormatter(0) + " " + (not ? 'not ' : '') + (to || 'to') + " " + expect;
	}

	function objFormatter(idx) {
	  return "{" + idx + ":.80=\"...\"j}";
	}

	function packTypeExpect(base, all) {
	  return all ? typeExpect(base, upperFirst(base)) : upperFirst(base);
	}

	function typeExpect() {
	  return Array.prototype.join.call(arguments, ' | ');
	}

	/**
	 * Double Linked List
	 * @module utility/List
	 * @author Tao Zeng <tao.zeng.zt@qq.com>
	 * @created Mon Dec 11 2017 14:35:32 GMT+0800 (China Standard Time)
	 * @modified Wed Apr 03 2019 19:03:02 GMT+0800 (China Standard Time)
	 */
	var DEFAULT_BINDING = addDefaultKey('__list__');
	var List =
	/*#__PURE__*/
	function () {
	  function List(binding) {
	    this.__length = 0;
	    this.__scaning = false;
	    this.__ver = 0;
	    this.binding = binding || DEFAULT_BINDING;
	  }

	  var _proto = List.prototype;

	  _proto.size = function size() {
	    return this.__length;
	  };

	  _proto.has = function has(obj) {
	    var node = obj[this.binding];
	    return node ? node[0] === obj && node[3] === this : false;
	  }
	  /**
	   *
	   * @param obj
	   * @return new length
	   */
	  ;

	  _proto.add = function add(obj) {
	    return this.__insert(obj, this.__tail);
	  }
	  /**
	   *
	   * @param obj
	   * @return new length
	   */
	  ;

	  _proto.addFirst = function addFirst(obj) {
	    return this.__insert(obj);
	  }
	  /**
	   *
	   * @param obj
	   * @return new length
	   */
	  ;

	  _proto.insertAfter = function insertAfter(obj, target) {
	    return this.__insert(obj, target && this.__getNode(target));
	  }
	  /**
	   *
	   * @param obj
	   * @return new length
	   */
	  ;

	  _proto.insertBefore = function insertBefore(obj, target) {
	    return this.__insert(obj, target && this.__getNode(target)[1]);
	  }
	  /**
	   *
	   * @param objs
	   * @return new length
	   */
	  ;

	  _proto.addAll = function addAll(objs) {
	    return this.__insertAll(objs, this.__tail);
	  };

	  _proto.addFirstAll = function addFirstAll(objs) {
	    return this.__insertAll(objs);
	  };

	  _proto.insertAfterAll = function insertAfterAll(objs, target) {
	    return this.__insertAll(objs, target && this.__getNode(target));
	  };

	  _proto.insertBeforeAll = function insertBeforeAll(objs, target) {
	    return this.__insertAll(objs, target && this.__getNode(target)[1]);
	  };

	  _proto.prev = function prev(obj) {
	    return this.__siblingObj(obj, 1);
	  };

	  _proto.next = function next(obj) {
	    return this.__siblingObj(obj, 2);
	  };

	  _proto.first = function first() {
	    var node = this.__head;
	    return node && node[0];
	  };

	  _proto.last = function last() {
	    var node = this.__tail;
	    return node && node[0];
	  };

	  _proto.each = function each(cb, scope) {
	    if (this.__length) {
	      assert.not(this.__scaning, 'Nested calls are not allowed.');
	      this.__scaning = true;

	      var __ver = ++this.__ver;

	      cb = bind(cb, scope);
	      var node = this.__head;

	      while (node) {
	        if (node[3] === this && (__ver === node[4] || cb(node[0]) === false)) break;
	        node = node[2];
	      }

	      this.__doLazyRemove();

	      this.__scaning = false;
	    }
	  };

	  _proto.eachUnsafe = function eachUnsafe(cb, scope) {
	    if (this.__length) {
	      var node = this.__head;

	      while (node) {
	        if (node[3] === this && cb(node[0]) === false) break;
	        node = node[2];
	      }
	    }
	  };

	  _proto.toArray = function toArray() {
	    var array = new Array(this.__length);
	    var node = this.__head,
	        i = 0;

	    while (node) {
	      if (node[3] === this) array[i++] = node[0];
	      node = node[2];
	    }

	    return array;
	  }
	  /**
	   *
	   * @param obj
	   * @return new length
	   */
	  ;

	  _proto.remove = function remove(obj) {
	    return this.__remove(this.__getNode(obj));
	  };

	  _proto.clean = function clean() {
	    if (this.__length) {
	      if (this.__scaning) {
	        var node = this.__head;

	        while (node) {
	          node[3] === this && this.__lazyRemove(node);
	          node = node[2];
	        }

	        this.__length = 0;
	      } else {
	        this.__clean();
	      }
	    }
	  };

	  _proto.__initNode = function __initNode(obj) {
	    var binding = this.binding;
	    var node = obj[binding];

	    if (node && node[0] === obj) {
	      if (node[3] === this) {
	        this.__remove(node);

	        return this.__initNode(obj);
	      } else if (node[3]) {
	        assert('Object is still in some List');
	      }

	      node[3] = this;
	      node[4] = this.__ver;
	    } else {
	      node = [obj,,, this, this.__ver];
	      node.toJSON = EMPTY_FN;
	      defPropValue(obj, binding, node, false);
	    }

	    return node;
	  };

	  _proto.__getNode = function __getNode(obj) {
	    var node = obj[this.binding];
	    assert.is(node && node[0] === obj && node[3] === this, 'Object is not in this List');
	    return node;
	  };

	  _proto.__siblingObj = function __siblingObj(obj, siblingIdx) {
	    var node = this.__getNode(obj);

	    var sibling = node[siblingIdx];

	    if (sibling) {
	      while (!sibling[3]) {
	        sibling = sibling[siblingIdx];
	        if (!sibling) return;
	      }

	      return sibling[0];
	    }
	  };

	  _proto.__doInsert = function __doInsert(nodeHead, nodeTail, len, prev) {
	    var next;
	    nodeHead[1] = prev;

	    if (prev) {
	      nodeTail[2] = next = prev[2];
	      prev[2] = nodeHead;
	    } else {
	      nodeTail[2] = next = this.__head;
	      this.__head = nodeHead;
	    }

	    if (next) next[1] = nodeTail;else this.__tail = nodeTail;
	    return this.__length += len;
	  };

	  _proto.__insert = function __insert(obj, prev) {
	    var node = this.__initNode(obj);

	    return this.__doInsert(node, node, 1, prev);
	  };

	  _proto.__insertAll = function __insertAll(objs, prev) {
	    var l = objs.length;

	    if (l) {
	      var head = this.__initNode(objs[0]);

	      var __prev = head,
	          tail = head,
	          i = 1;

	      for (; i < l; i++) {
	        tail = this.__initNode(objs[i]);
	        tail[1] = __prev;
	        __prev[2] = tail;
	        __prev = tail;
	      }

	      return this.__doInsert(head, tail, l, prev);
	    }

	    return -1;
	  };

	  _proto.__remove = function __remove(node) {
	    this.__scaning ? this.__lazyRemove(node) : this.__doRemove(node);
	    return --this.__length;
	  };

	  _proto.__lazyRemove = function __lazyRemove(node) {
	    var lazyRemoves = this.__lazyRemoves;
	    node[0][this.binding] = null; // unbind this node

	    node[3] = null;

	    if (lazyRemoves) {
	      lazyRemoves.push(node);
	    } else {
	      this.__lazyRemoves = [node];
	    }
	  };

	  _proto.__doLazyRemove = function __doLazyRemove() {
	    var lazyRemoves = this.__lazyRemoves;

	    if (lazyRemoves) {
	      var len = lazyRemoves.length;

	      if (len) {
	        if (this.__length) {
	          while (len--) {
	            this.__doRemove(lazyRemoves[len]);
	          }
	        } else {
	          this.__clean();
	        }

	        lazyRemoves.length = 0;
	      }
	    }
	  };

	  _proto.__doRemove = function __doRemove(node) {
	    var prev = node[1],
	        next = node[2];

	    if (prev) {
	      prev[2] = next;
	    } else {
	      this.__head = next;
	    }

	    if (next) {
	      next[1] = prev;
	    } else {
	      this.__tail = prev;
	    }

	    node.length = 1;
	  };

	  _proto.__clean = function __clean() {
	    var node,
	        next = this.__head;

	    while (node = next) {
	      next = node[2];
	      node.length = 1;
	    }

	    this.__head = null;
	    this.__tail = null;
	    this.__length = 0;
	  };

	  return List;
	}();
	List.binding = DEFAULT_BINDING;

	/**
	 * Function List
	 * @module utility/List
	 * @author Tao Zeng <tao.zeng.zt@qq.com>
	 * @created Mon Dec 11 2017 14:35:32 GMT+0800 (China Standard Time)
	 * @modified Sat Mar 30 2019 16:11:18 GMT+0800 (China Standard Time)
	 */
	var DEFAULT_FN_BINDING = addDefaultKey('__flist_id__');
	var DEFAULT_SCOPE_BINDING = addDefaultKey(DEFAULT_FN_BINDING);
	var FnList =
	/*#__PURE__*/
	function () {
	  function FnList(fnBinding, scopeBinding) {
	    this.__nodeMap = create(null);
	    this.__list = new List();
	    this.fnBinding = fnBinding || DEFAULT_FN_BINDING;
	    this.scopeBinding = scopeBinding || DEFAULT_SCOPE_BINDING;
	  }
	  /**
	   * add executable function
	   * @param fn		function
	   * @param scope		scope of function
	   * @param data		user data of [function + scope]
	   * @return executable function id, can remove executable function by id: {@link FnList#removeId}
	   */


	  var _proto = FnList.prototype;

	  _proto.add = function add(fn, scope, data) {
	    scope = parseScope(scope);
	    var list = this.__list,
	        nodeMap = this.__nodeMap;
	    var id = this.id(fn, scope);
	    var node = nodeMap[id];

	    if (!node) {
	      node = [id, fn, scope, data];
	      if (list.add(node)) nodeMap[id] = node;
	      return id;
	    }
	  }
	  /**
	   * remove executable function by id
	   *
	   * @param id
	   */
	  ;

	  _proto.removeId = function removeId(id) {
	    var list = this.__list,
	        nodeMap = this.__nodeMap;
	    var node = nodeMap[id];

	    if (node) {
	      nodeMap[id] = undefined;
	      return list.remove(node);
	    }

	    return -1;
	  };

	  _proto.remove = function remove(fn, scope) {
	    return this.removeId(this.id(fn, parseScope(scope)));
	  };

	  _proto.has = function has(fn, scope) {
	    var id = this.id(fn, parseScope(scope));
	    return this.__nodeMap[id] && id;
	  };

	  _proto.hasId = function hasId(id) {
	    return !!this.__nodeMap[id];
	  };

	  _proto.size = function size() {
	    return this.__list.size();
	  };

	  _proto.clean = function clean() {
	    this.__nodeMap = create(null);

	    this.__list.clean();
	  };

	  _proto.each = function each(cb, scope) {
	    cb = cb.bind(scope);

	    this.__list.each(function (node) {
	      return cb(node[1], node[2], node[3], node);
	    });
	  };

	  _proto.eachUnsafe = function eachUnsafe(cb, scope) {
	    this.__list.eachUnsafe(function (node) {
	      return cb(node[1], node[2], node[3], node);
	    });
	  };

	  _proto.id = function id(fn, scope) {
	    var fnBinding = this.fnBinding,
	        scopeBinding = this.scopeBinding;
	    var fnId = fn[fnBinding],
	        scopeId = scope ? scope[scopeBinding] : DEFAULT_SCOPE_ID;
	    if (!fnId) fnId = defPropValue(fn, fnBinding, ++fnIdGenerator, false, false, false);
	    if (!scopeId) scopeId = defPropValue(scope, scopeBinding, ++scopeIdGenerator, false, false, false);
	    return fnId + "#" + scopeId;
	  };

	  return FnList;
	}();
	FnList.fnBinding = DEFAULT_FN_BINDING;
	FnList.scopeBinding = DEFAULT_SCOPE_BINDING;
	var DEFAULT_SCOPE_ID = 1;
	var scopeIdGenerator = 1,
	    fnIdGenerator = 0;

	function parseScope(scope) {
	  return !scope ? undefined : scope;
	}

	/**
	 * @module utility/List
	 * @author Tao Zeng <tao.zeng.zt@qq.com>
	 * @created Tue Nov 27 2018 19:06:18 GMT+0800 (China Standard Time)
	 * @modified Tue Nov 27 2018 19:07:34 GMT+0800 (China Standard Time)
	 */

	/**
	 * String format
	 * @module utility/nextTick
	 * @author Tao Zeng <tao.zeng.zt@qq.com>
	 * @created Mon Dec 11 2017 14:35:32 GMT+0800 (China Standard Time)
	 * @modified Wed Apr 03 2019 19:45:47 GMT+0800 (China Standard Time)
	 */
	var next;

	if (typeof MutationObserver === TYPE_FN) {
	  // chrome18+, safari6+, firefox14+,ie11+,opera15
	  var textNode = document.createTextNode(v);
	  new MutationObserver(flush).observe(textNode, {
	    characterData: true
	  });
	  var v = '';

	  next = function next() {
	    textNode.data = v = v ? '0' : '';
	  };
	} else {
	  next = function next() {
	    setTimeout(flush, 0);
	  };
	}

	var ticks = [new FnList(), new FnList()];
	var pending,
	    i = 0;

	function executeTick(fn, scope) {
	  scope ? fn.call(scope) : fn();
	}

	function flush() {
	  var t = pending;
	  pending = null;
	  t.each(executeTick);
	  t.clean();
	}

	function nextTick(fn, scope) {
	  if (!pending) {
	    pending = ticks[++i & 1];
	    next();
	  }

	  return pending.add(fn, scope);
	}
	function clearTick(fn, scope) {
	  return pending.remove(fn, scope);
	}
	function clearTickId(id) {
	  return pending.removeId(id);
	}

	/**
	 * @module utility/Source
	 * @author Tao Zeng <tao.zeng.zt@qq.com>
	 * @created Mon Dec 17 2018 10:41:21 GMT+0800 (China Standard Time)
	 * @modified Sat Dec 22 2018 14:37:32 GMT+0800 (China Standard Time)
	 */
	var LINE_REG = /([^\n]+)?(\n|$)/g;
	var Source =
	/*#__PURE__*/
	function () {
	  function Source(buff) {
	    this.buff = buff;
	    this.len = buff.length;
	    this.__lines = [];
	    this.__linePos = 0;
	  }

	  var _proto = Source.prototype;

	  _proto.position = function position(offset) {
	    var buff = this.buff,
	        len = this.len,
	        lines = this.__lines,
	        linePos = this.__linePos;
	    var i = lines.length,
	        p;

	    if (offset < linePos) {
	      while (i--) {
	        p = offset - lines[i][0];
	        if (p >= 0) return [i + 1, p, lines[i][1]];
	      }
	    } else {
	      if (linePos < len) {
	        var m;
	        LINE_REG.lastIndex = p = linePos;

	        while (m = LINE_REG.exec(buff)) {
	          lines[i++] = [p, m[1] || ''];
	          p = LINE_REG.lastIndex;
	          if (!p || offset < p) break;
	        }

	        this.__linePos = p || len;
	      }

	      return i ? [i, (offset > len ? len : offset) - lines[i - 1][0], lines[i - 1][1]] : [1, 0, ''];
	    }
	  };

	  _proto.source = function source(escape) {
	    var buff = this.buff;
	    var line = 1,
	        toSourceStr = escape ? escapeSourceStr : sourceStr;
	    return buff.replace(LINE_REG, function (m, s, t) {
	      return pad(String(line++), 3) + ': ' + toSourceStr(m, s, t);
	    });
	  };

	  return Source;
	}();

	function sourceStr(m, s, t) {
	  return m || '';
	}

	function escapeSourceStr(m, s, t) {
	  return s ? escapeStr(s) + t : t;
	}

	function _inheritsLoose(subClass, superClass) {
	  subClass.prototype = Object.create(superClass.prototype);
	  subClass.prototype.constructor = subClass;
	  subClass.__proto__ = superClass;
	}

	/**
	 * utilities for ast builder
	 *
	 * @module utility/AST
	 * @author Tao Zeng (tao.zeng.zt@qq.com)
	 * @created 2018-11-09 13:22:51
	 * @modified 2018-11-09 13:22:51 by Tao Zeng (tao.zeng.zt@qq.com)
	 */
	/**
	 * each char codes
	 */

	function eachCharCodes(codes, ignoreCase, cb) {
	  var i;

	  if (isStr(codes)) {
	    i = codes.length;

	    while (i--) {
	      eachCharCode(charCode(codes, i), ignoreCase, cb);
	    }
	  } else if (isArray(codes)) {
	    i = codes.length;

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
	    var c = getAnotherCode(code);
	    c && cb(c);
	  }
	}

	function getAnotherCode(code) {
	  return code <= 90 ? code >= 65 ? code + 32 : 0 : code <= 122 ? code - 32 : 0;
	}

	/**
	 * @module utility/mixin
	 * @author Tao Zeng <tao.zeng.zt@qq.com>
	 * @created Tue Dec 18 2018 16:41:03 GMT+0800 (China Standard Time)
	 * @modified Wed Mar 13 2019 20:03:31 GMT+0800 (China Standard Time)
	 */
	function mixin(behaviour) {
	  return function mixin(Class) {
	    var proto = Class.prototype;

	    for (var k in behaviour) {
	      if (hasOwnProp(behaviour, k)) proto[k] = behaviour[k];
	    }

	    return Class;
	  };
	}

	var _dec, _class, _dec2, _class2;
	var MatchError = (_dec = mixin({
	  $ruleErr: true
	}), _dec(_class =
	/*#__PURE__*/
	function () {
	  function MatchError(msg, capturable, source, context, rule) {
	    !isBool(capturable) && (capturable = rule.capturable);
	    this.capturable = capturable && source ? source.capturable : capturable;
	    this.msg = msg;
	    this.source = source;
	    this.target = source ? source.target : this;
	    this.context = context;
	    this.rule = rule;
	    this.pos = context.startPos();
	  }

	  var _proto = MatchError.prototype;

	  _proto.position = function position() {
	    return this.context.source.position(this.pos);
	  };

	  return MatchError;
	}()) || _class);

	function defaultErr(err) {
	  return err;
	}

	function defaultMatch(data, len, context) {
	  context.add(data);
	}

	var idGen = 0;
	/**
	 * Abstract Rule
	 */

	var Rule = (_dec2 = mixin({
	  $rule: true
	}), _dec2(_class2 =
	/*#__PURE__*/
	function () {
	  // rule type (for debug)
	  // rule id
	  // rule name
	  // error is capturable
	  // rule expression (for debug)
	  // rule EXPECT content (for debug)
	  // matched callback
	  // error callback
	  // index of start codes
	  // start codes

	  /**
	   * @param name			rule name
	   * @param capturable	error is capturable
	   * @param onMatch		callback on matched, allow modify the match result or return an error
	   * @param onErr			callback on Error, allow to ignore error or modify error message or return new error
	   */
	  function Rule(name, options) {
	    this.id = idGen++;
	    this.name = name;
	    this.capturable = options.capturable !== false;
	    this.onMatch = options.match || defaultMatch;
	    this.onErr = options.err || defaultErr;
	  }
	  /**
	   * create Error
	   * @param msg 			error message
	   * @param context 		match context
	   * @param capturable 	is capturable error
	   * @param src 			source error
	   */


	  var _proto2 = Rule.prototype;

	  _proto2.mkErr = function mkErr(msg, context, capturable, source) {
	    return new MatchError(msg, capturable, source, context, this);
	  }
	  /**
	   * match fail
	   * @param msg 			error message
	   * @param context 		match context
	   * @param capturable 	is capturable error
	   * @param src 			source error
	   * @return Error|void: may ignore Error in the error callback
	   */
	  ;

	  _proto2.error = function error(msg, context, src, capturable) {
	    var err = this.mkErr(msg, context, capturable, src);
	    var userErr = this.onErr(err, context, this);
	    if (userErr) return userErr.$ruleErr ? userErr : (err[0] = String(userErr), err);
	  }
	  /**
	   * match success
	   * > attach the matched result by match callback
	   * @param data 		matched data
	   * @param len  		matched data length
	   * @param context 	match context
	   * @return Error|void: may return Error in the match callback
	   */
	  ;

	  _proto2.matched = function matched(data, len, context) {
	    var err = this.onMatch(data, len, context, this);
	    if (err) return err.$ruleErr ? err : this.mkErr(String(err), context, false);
	  };

	  _proto2.enter = function enter(context) {
	    return context.create();
	  }
	  /**
	   * match
	   * @param context match context
	   */
	  ;

	  _proto2.match = function match(context) {
	    return assert();
	  }
	  /**
	   * get start char codes
	   */
	  ;

	  _proto2.getStart = function getStart(stack) {
	    return this.startCodes;
	  }
	  /**
	   * prepare test before match
	   */
	  ;

	  _proto2.test = function test(context) {
	    return true;
	  };

	  _proto2.startCodeTest = function startCodeTest(context) {
	    return this.startCodeIdx[context.nextCode()];
	  };

	  _proto2.setStartCodes = function setStartCodes(start, ignoreCase) {
	    var codes = [],
	        index = [];
	    eachCharCodes(start, ignoreCase, function (code) {
	      if (!index[code]) {
	        codes.push(code);
	        index[code] = code;
	      }
	    });
	    this.startCodes = codes;
	    this.setCodeIdx(index);
	  };

	  _proto2.setCodeIdx = function setCodeIdx(index) {
	    if (index.length > 1) {
	      this.startCodeIdx = index;
	      this.test = this.startCodeTest;
	    }
	  } //──── for debug ─────────────────────────────────────────────────────────────────────────

	  /**
	   * make rule expression
	   * @param expr expression text
	   */
	  ;

	  _proto2.mkExpr = function mkExpr(expr) {
	    return "<" + this.type + ": " + expr + ">";
	  }
	  /**
	   * set rule expression
	   * 		1. make rule expression
	   * 		2. make Expect text
	   */
	  ;

	  _proto2.setExpr = function setExpr(expr) {
	    this.expr = this.mkExpr(expr);
	    this.EXPECT = "Expect: " + expr;
	  };

	  _proto2.getExpr = function getExpr(stack) {
	    return this.name || this.expr;
	  }
	  /**
	   * toString by name or expression
	   */
	  ;

	  _proto2.toString = function toString() {
	    return this.getExpr();
	  };

	  return Rule;
	}()) || _class2);

	/**
	 * Match Rule Interface
	 */
	var MatchRule =
	/*#__PURE__*/
	function (_Rule) {
	  _inheritsLoose(MatchRule, _Rule);

	  /**
	   * @param name 			match name
	   * @param start 		start char codes, prepare test by start char codes before match
	   * @param ignoreCase	ignore case for the start char codes
	   * @param options		Rule Options
	   */
	  function MatchRule(name, start, ignoreCase, options) {
	    var _this;

	    _this = _Rule.call(this, name, options) || this;

	    _this.setStartCodes(start, ignoreCase);

	    return _this;
	  }
	  /**
	   * consume matched result
	   * @param data 		matched result
	   * @param len 		matched chars
	   * @param context 	match context
	   */


	  var _proto = MatchRule.prototype;

	  _proto.comsume = function comsume(data, len, context) {
	    context.advance(len);
	    return this.matched(data, len, context);
	  };

	  return MatchRule;
	}(Rule);

	var _dec$1, _class$1;
	/**
	 * match a character in the allowed list
	 * > well match any character if the allowed list is empty
	 *
	 * > must call test() before match
	 */

	var CharMatchRule = (_dec$1 = mixin({
	  type: 'Character'
	}), _dec$1(_class$1 =
	/*#__PURE__*/
	function (_MatchRule) {
	  _inheritsLoose(CharMatchRule, _MatchRule);

	  /**
	   * @param name 			match name
	   * @param allows 		allowed character codes for match
	   * 						well match any character if the allowed list is empty
	   * @param ignoreCase	ignore case for the allowed character codes
	   * @param options		Rule Options
	   */
	  function CharMatchRule(name, allows, ignoreCase, options) {
	    var _this;

	    _this = _MatchRule.call(this, name, allows, ignoreCase, options) || this; // generate expression for debug

	    var codes = _this.startCodes;
	    var i = codes.length,
	        expr = '*';

	    if (i) {
	      var chars = [];

	      while (i--) {
	        chars[i] = char(codes[i]);
	      }

	      expr = "\"" + chars.join('" | "') + "\"";
	    }

	    _this.setExpr(expr);

	    return _this;
	  }

	  var _proto = CharMatchRule.prototype;

	  _proto.match = function match(context) {
	    return this.comsume(context.nextChar(), 1, context);
	  };

	  return CharMatchRule;
	}(MatchRule)) || _class$1);

	var _dec$2, _class$2;
	/**
	 * match string by RegExp
	 *
	 * optimization:
	 * - Priority use sticky mode {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/sticky}
	 *
	 */

	var RegMatchRule = (_dec$2 = mixin({
	  type: 'RegExp'
	}), _dec$2(_class$2 =
	/*#__PURE__*/
	function (_MatchRule) {
	  _inheritsLoose(RegMatchRule, _MatchRule);

	  /**
	   * @param name 			match name
	   * @param regexp		regular
	   * @param pick			pick regular matching results
	   * 						    0: pick results[0] (optimize: test and substring in sticky mode)
	   * 						  > 0: pick results[{pick}]
	   * 						  < 0: pick first non-blank string from 1 to -{pick} index on results
	   * 						 true: pick results
	   * 						false: not pick result, result is null (optimize: just test string in sticky mode)
	   * @param start			start character codes in the regular, optimize performance by start character codes
	   * @param capturable	error is capturable
	   * @param onMatch		match callback
	   * @param onErr			error callback
	   */
	  function RegMatchRule(name, regexp, pick, start, options) {
	    var _this;

	    pick = pick === false || isInt(pick) ? pick : !!pick || 0;
	    var sticky = stickyReg && !pick,
	        // use exec mode when need pick match group data
	    pattern = regexp.source,
	        ignoreCase = regexp.ignoreCase; // always wrapping in a none capturing group preceded by '^' to make sure
	    // matching can only work on start of input. duplicate/redundant start of
	    // input markers have no meaning (/^^^^A/ === /^A/)
	    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/sticky
	    // When the y flag is used with a pattern, ^ always matches only at the
	    // beginning of the input, or (if multiline is true) at the beginning of a
	    // line.

	    regexp = new RegExp(sticky ? pattern : "^(?:" + pattern + ")", (ignoreCase ? 'i' : '') + (regexp.multiline ? 'm' : '') + (sticky ? 'y' : ''));
	    _this = _MatchRule.call(this, name, start, ignoreCase, options) || this;
	    _this.regexp = regexp;
	    _this.pick = pick;
	    _this.match = sticky ? _this.stickyMatch : _this.execMatch;
	    sticky ? _this.spicker = pick === false ? pickNone : pickTestStr : _this.picker = mkPicker(pick);

	    _this.setExpr(pattern);

	    return _this;
	  }
	  /**
	   * match on sticky mode
	   */


	  var _proto = RegMatchRule.prototype;

	  _proto.stickyMatch = function stickyMatch(context) {
	    var reg = this.regexp,
	        buff = context.buff(),
	        start = context.offset();
	    reg.lastIndex = start;
	    var len;
	    return reg.test(buff) ? (len = reg.lastIndex - start, this.comsume(this.spicker(buff, start, len), len, context)) : this.error(this.EXPECT, context);
	  }
	  /**
	   * match on exec mode
	   */
	  ;

	  _proto.execMatch = function execMatch(context) {
	    var m = this.regexp.exec(context.buff(true));
	    return m ? this.comsume(this.picker(m), m[0].length, context) : this.error(this.EXPECT, context);
	  };

	  return RegMatchRule;
	}(MatchRule)) || _class$2);
	var cache = create(null);

	function mkPicker(pick) {
	  return cache[pick] || (cache[pick] = pick === false ? pickNone : pick === true ? pickAll : pick >= 0 ? createFn("return m[" + pick + "]", ['m'], "pick_" + pick) : createFn("return " + mapArray(new Array(-pick), function (v, i) {
	    return "m[" + (i + 1) + "]";
	  }).join(' || '), ['m'], "pick_1_" + -pick));
	}

	function pickNone() {
	  return null;
	}

	function pickAll(m) {
	  return m;
	}

	function pickTestStr(buff, start, end) {
	  return cutLStr(buff, start, end);
	}

	var _dec$3, _class$3;
	var StringMatchRule = (_dec$3 = mixin({
	  type: 'String'
	}), _dec$3(_class$3 =
	/*#__PURE__*/
	function (_RegMatchRule) {
	  _inheritsLoose(StringMatchRule, _RegMatchRule);

	  /**
	   * @param name 			match name
	   * @param str 			match string
	   * @param ignoreCase	ignore case
	   * @param options		Rule Options
	   */
	  function StringMatchRule(name, str, ignoreCase, options) {
	    var _this;

	    _this = _RegMatchRule.call(this, name, new RegExp(reEscape(str), ignoreCase ? 'i' : ''), 0, charCode(str), options) || this;

	    _this.setExpr(str);

	    return _this;
	  }

	  return StringMatchRule;
	}(RegMatchRule)) || _class$3);

	/**
	 * @module utility/AST
	 * @author Tao Zeng <tao.zeng.zt@qq.com>
	 * @created Tue Dec 11 2018 15:36:42 GMT+0800 (China Standard Time)
	 * @modified Sat Dec 22 2018 16:32:31 GMT+0800 (China Standard Time)
	 */

	/**
	 * Match Context of Rule
	 */
	var MatchContext =
	/*#__PURE__*/
	function () {
	  // start offset of original buff
	  // parent context
	  // matched result list
	  // template buff
	  // current offset of template buff
	  // current offset of original buff
	  // advanced characters
	  // cached character
	  function MatchContext(source, buff, offset, orgOffset, parent) {
	    this.source = source;
	    this.parent = parent;
	    this.result = [];
	    this.__buff = buff;
	    this.__offset = offset;
	    this.__orgOffset = orgOffset;
	    this.__advanced = 0;
	    parent ? (this.__code = parent.__code, this.data = parent.data) : this.__flushCode();
	  }

	  var _proto = MatchContext.prototype;

	  _proto.__flushCode = function __flushCode() {
	    var buff = this.__buff,
	        offset = this.__offset;
	    this.__code = offset < buff.length ? charCode(buff, offset) : 0;
	  }
	  /**
	   * create sub Context
	   */
	  ;

	  _proto.create = function create() {
	    return new MatchContext(this.source, this.__buff, this.__offset, this.__orgOffset + this.__advanced, this);
	  };

	  _proto.__setAdvanced = function __setAdvanced(advanced) {
	    assert.notLess(advanced, 0);
	    var offset = this.__offset - this.__advanced + advanced;

	    if (offset < 0) {
	      this.__buff = this.source.buff;
	      this.__offset = this.__orgOffset + advanced;
	    }

	    this.__advanced = advanced;
	    this.__offset = offset;

	    this.__flushCode();
	  }
	  /**
	   * commit context state to parent context
	   */
	  ;

	  _proto.commit = function commit() {
	    var advanced = this.__advanced;
	    this.parent.advance(advanced);
	    this.__orgOffset += advanced;
	    this.__advanced = 0;
	    this.data = null;
	  }
	  /**
	   * marge context state
	   */
	  ;

	  _proto.margeState = function margeState(context) {
	    this.__setAdvanced(context.__orgOffset + context.__advanced - this.__orgOffset);
	  }
	  /**
	   * rollback state and result
	   * @param checkpoint 	rollback to checkpoint
	   */
	  ;

	  _proto.rollback = function rollback(checkpoint) {
	    var advanced = 0,
	        resultLen = 0;
	    checkpoint && (advanced = checkpoint[0], resultLen = checkpoint[1]);

	    this.__setAdvanced(advanced);

	    var result = this.result;
	    if (result.length > resultLen) result.length = resultLen;
	  }
	  /**
	   * get a check point
	   */
	  ;

	  _proto.checkpoint = function checkpoint() {
	    return [this.__advanced, this.result.length];
	  }
	  /**
	   * advance buffer position
	   */
	  ;

	  _proto.advance = function advance(i) {
	    this.__offset += i;
	    this.__advanced += i;

	    this.__flushCode();
	  }
	  /**
	   * advanced buff length
	   */
	  ;

	  _proto.advanced = function advanced() {
	    return this.__advanced;
	  }
	  /**
	   * get buffer
	   * @param reset reset buffer string from 0
	   */
	  ;

	  _proto.buff = function buff(reset) {
	    var buff = this.__buff;

	    if (reset) {
	      this.__buff = buff = cutStr(buff, this.__offset);
	      this.__offset = 0;
	    }

	    return buff;
	  };

	  _proto.orgBuff = function orgBuff() {
	    return this.source.buff;
	  };

	  _proto.offset = function offset() {
	    return this.__offset;
	  };

	  _proto.startPos = function startPos() {
	    return this.__orgOffset;
	  };

	  _proto.currPos = function currPos() {
	    return this.__orgOffset + this.__advanced;
	  };

	  _proto.pos = function pos() {
	    var offset = this.__orgOffset;
	    return [offset, offset + this.__advanced];
	  }
	  /**
	   * get next char code
	   * @return number char code number
	   */
	  ;

	  _proto.nextCode = function nextCode() {
	    return this.__code;
	  };

	  _proto.nextChar = function nextChar() {
	    return char(this.__code);
	  } //──── result opeartions ───────────────────────────────────────────────────────────────────

	  /**
	   * append result
	   */
	  ;

	  _proto.add = function add(data) {
	    var result = this.result;
	    result[result.length] = data;
	  }
	  /**
	   * append resultset
	   */
	  ;

	  _proto.addAll = function addAll(data) {
	    var result = this.result;
	    var len = result.length;
	    var i = data.length;

	    while (i--) {
	      result[len + i] = data[i];
	    }
	  }
	  /**
	   * get result size
	   */
	  ;

	  _proto.resultSize = function resultSize() {
	    return this.result.length;
	  };

	  return MatchContext;
	}();

	var MAX = -1 >>> 0;
	/**
	 * Abstract Complex Rule
	 */

	var ComplexRule =
	/*#__PURE__*/
	function (_Rule) {
	  _inheritsLoose(ComplexRule, _Rule);

	  /**
	   * @param name 			match name
	   * @param builder 		callback of build rules
	   * @param options		Rule Options
	   */
	  function ComplexRule(name, repeat, builder, options) {
	    var _this;

	    _this = _Rule.call(this, name, options) || this;
	    var rMin = repeat[0],
	        rMax = repeat[1];
	    rMin < 0 && (rMin = 0);
	    rMax <= 0 && (rMax = MAX);
	    assert.notGreater(rMin, rMax);
	    _this.rMin = rMin;
	    _this.rMax = rMax;
	    _this.builder = builder;

	    if (rMin !== rMax || rMin !== 1) {
	      _this.match = _this.rmatch; // for debug

	      _this.type = _this.type + "[" + rMin + (rMin === rMax ? '' : " - " + (rMax === MAX ? 'MAX' : rMax)) + "]";
	    }

	    return _this;
	  }

	  var _proto = ComplexRule.prototype;

	  _proto.parse = function parse(buff, data) {
	    var ctx = new MatchContext(new Source(buff), buff, 0, 0);
	    ctx.data = data;
	    var err = this.match(ctx);

	    if (err) {
	      var msg = [];
	      var pos;

	      do {
	        pos = err.position();
	        msg.unshift("[" + pad(String(pos[0]), 3) + ":" + pad(String(pos[1]), 2) + "] - " + err.rule.toString() + ": " + err.msg + " on \"" + escapeStr(pos[2]) + "\"");
	      } while (err = err.source);

	      msg.push('[Source]', ctx.source.source());
	      throw new SyntaxError(msg.join('\n'));
	    }

	    return ctx.result;
	  };

	  _proto.init = function init() {
	    var rules = this.builder(this);
	    var i = rules && rules.length;
	    assert.is(i, "Require Complex Rules");
	    this.rules = rules; // generate expression and expect string for debug

	    var names = this.rnames(rules);
	    this.setExpr(names.join(this.split));

	    while (i--) {
	      names[i] = "Expect[" + i + "]: " + names[i];
	    }

	    this.EXPECTS = names;

	    this.__init(rules);

	    this.builder = null;
	    return this;
	  };

	  _proto.__init = function __init(rules) {};

	  _proto.rmatch = function rmatch(context) {
	    return assert();
	  };

	  _proto.setCodeIdx = function setCodeIdx(index) {
	    this.rMin && _Rule.prototype.setCodeIdx.call(this, index);
	  };

	  _proto.getRules = function getRules() {
	    return this.rules || (this.init(), this.rules);
	  };

	  _proto.getStart = function getStart(stack) {
	    var id = this.id,
	        startCodes = this.startCodes;
	    return startCodes ? startCodes : stack && ~idxOfArray(stack, id) || this.rules ? [] : (this.init(), this.startCodes);
	  };

	  _proto.consume = function consume(context) {
	    var err = this.matched(context.result, context.advanced(), context.parent);
	    !err && context.commit();
	    return err;
	  } // for debug
	  ;

	  _proto.rnames = function rnames(rules, stack) {
	    var i = rules.length;
	    var names = new Array(i),
	        id = this.id;

	    while (i--) {
	      names[i] = rules[i].getExpr(stack ? stack.concat(id) : [id]);
	    }

	    return names;
	  };

	  _proto.getExpr = function getExpr(stack) {
	    var id = this.id,
	        name = this.name;
	    var i;
	    return name ? name : stack ? ~(i = idxOfArray(stack, id)) ? "<" + this.type + " -> $" + stack[i] + ">" : this.mkExpr(this.rnames(this.getRules(), stack).join(this.split)) : this.expr;
	  };

	  return ComplexRule;
	}(Rule);

	var _dec$4, _class$4;
	/**
	 * AND Complex Rule
	 */

	var AndRule = (_dec$4 = mixin({
	  type: 'And',
	  split: ' '
	}), _dec$4(_class$4 =
	/*#__PURE__*/
	function (_ComplexRule) {
	  _inheritsLoose(AndRule, _ComplexRule);

	  function AndRule() {
	    return _ComplexRule.apply(this, arguments) || this;
	  }

	  var _proto = AndRule.prototype;

	  _proto.__init = function __init(rules) {
	    this.setStartCodes(rules[0].getStart([this.id]));
	  };

	  _proto.match = function match(context) {
	    var rules = this.getRules(),
	        len = rules.length,
	        ctx = context.create();
	    var err,
	        i = 0;

	    for (; i < len; i++) {
	      if (err = this.testRule(rules[i], i, ctx)) return err;
	    }

	    return this.consume(ctx);
	  };

	  _proto.rmatch = function rmatch(context) {
	    var rMin = this.rMin,
	        rMax = this.rMax;
	    var rules = this.getRules(),
	        len = rules.length,
	        ctx = context.create();
	    var err,
	        repeat = 0,
	        i,
	        cp;

	    out: for (; repeat < rMax; repeat++) {
	      cp = ctx.checkpoint();

	      for (i = 0; i < len; i++) {
	        if (err = this.testRule(rules[i], i, ctx)) {
	          if (repeat < rMin) return err;
	          ctx.rollback(cp);
	          break out;
	        }
	      }
	    }

	    return this.consume(ctx);
	  };

	  _proto.testRule = function testRule(rule, i, ctx) {
	    var err;

	    if (!rule.test(ctx)) {
	      return this.error(this.EXPECTS[i], ctx);
	    } else if (err = rule.match(ctx)) {
	      return this.error(this.EXPECTS[i], ctx, err);
	    } // return (!rule.test(ctx) || (err = rule.match(ctx))) && (err = this.error(this.EXPECTS[i], ctx, err))

	  };

	  return AndRule;
	}(ComplexRule)) || _class$4);

	var _dec$5, _class$5;
	/**
	 * OR Complex Rule
	 */

	var OrRule = (_dec$5 = mixin({
	  type: 'Or',
	  split: ' | '
	}), _dec$5(_class$5 =
	/*#__PURE__*/
	function (_ComplexRule) {
	  _inheritsLoose(OrRule, _ComplexRule);

	  function OrRule() {
	    return _ComplexRule.apply(this, arguments) || this;
	  }

	  var _proto = OrRule.prototype;

	  _proto.__init = function __init(rules) {
	    var id = this.id;
	    var len = rules.length,
	        starts = [],
	        // all distinct start codes
	    rStarts = [],
	        // start codes per rule
	    index = [[] // rules which without start code
	    ];
	    var i, j, k, codes; // get start codes of all rules

	    for (i = 0; i < len; i++) {
	      rStarts[i] = []; // init rule start codes

	      eachCharCodes(rules[i].getStart([id]), false, function (code) {
	        rStarts[i].push(code); // append to rule start codes

	        if (!index[code]) {
	          index[code] = []; // init start code index

	          starts.push(code); // append to all start codes
	        }
	      });
	    } // fill index


	    for (i = 0; i < len; i++) {
	      codes = rStarts[i]; // append rule to start code index by rule start codes

	      if (!codes.length) {
	        // rule without start code
	        index[0].push(rules[i]); // append rule to index[0]

	        codes = starts; // append rule to start code index by all start codes
	      } // append rule to start code index (by rule start codes or all start codes)


	      j = codes.length;

	      while (j--) {
	        k = index[codes[j]];

	        if (k.idx !== i) {
	          // deduplication
	          k.push(rules[i]); // append rules[i] to start code index[codes[j]]

	          k.idx = i;
	        }
	      }
	    } // rule have unkown start code when got unkown start code from any rules


	    var startCodes = !index[0].length && starts;
	    this.startCodes = startCodes || [];
	    startCodes && this.setCodeIdx(index);
	    this.index = index;
	  };

	  _proto.match = function match(context) {
	    var index = this.index || (this.init(), this.index),
	        rules = index[context.nextCode()] || index[0],
	        len = rules.length,
	        ctx = context.create();
	    var err,
	        upErr,
	        i = 0;

	    for (; i < len; i++) {
	      err = rules[i].match(ctx) || this.consume(ctx);
	      if (!err) return;

	      if (!err.capturable) {
	        upErr = err;
	        break;
	      }

	      if (!upErr || err.pos >= upErr.pos) upErr = err;
	      ctx.rollback();
	    }

	    return this.error(this.EXPECT, ctx, upErr);
	  };

	  _proto.rmatch = function rmatch(context) {
	    var rMin = this.rMin,
	        rMax = this.rMax;
	    var index = this.index || (this.init(), this.index),
	        ctx = context.create();
	    var rules,
	        len,
	        err,
	        upErr,
	        repeat = 0,
	        i,
	        cp;

	    out: for (; repeat < rMax; repeat++) {
	      rules = index[ctx.nextCode()] || index[0];
	      upErr = null;

	      if (len = rules.length) {
	        cp = ctx.checkpoint();

	        for (i = 0; i < len; i++) {
	          err = rules[i].match(ctx);
	          if (!err) continue out;

	          if (!err.capturable) {
	            upErr = err;
	            break;
	          }

	          if (!upErr || err.pos >= upErr.pos) upErr = err;
	          ctx.rollback(cp);
	        }
	      }

	      if (repeat < rMin || upErr && !upErr.capturable) return this.error(this.EXPECT, ctx, upErr);
	      break;
	    }

	    return this.consume(ctx);
	  };

	  return OrRule;
	}(ComplexRule)) || _class$5);

	/**
	 * AST Parser API
	 * @module utility/AST
	 * @author Tao Zeng <tao.zeng.zt@qq.com>
	 * @created Tue Nov 06 2018 10:58:52 GMT+0800 (China Standard Time)
	 * @modified Thu Apr 04 2019 19:59:23 GMT+0800 (China Standard Time)
	 */

	/*                                                                                      *
	 *                                      match tools                                     *
	 *                                                                                      */
	//========================================================================================

	var discardMatch = EMPTY_FN;
	function appendMatch(data, len, context) {
	  context.addAll(data);
	}
	function attachMatch(val) {
	  var callback = isFn(val) ? val : function () {
	    return val;
	  };
	  return function (data, len, context, rule) {
	    context.add(callback(data, len, context, rule));
	  };
	} //========================================================================================

	/*                                                                                      *
	 *                                       match api                                      *
	 *                                                                                      */
	//========================================================================================

	function match() {
	  return mkMatch(arguments);
	} //========================================================================================

	/*                                                                                      *
	 *                                     and rule api                                     *
	 *                                                                                      */
	//========================================================================================
	//──── and ───────────────────────────────────────────────────────────────────────────────

	function and() {
	  return mkComplexRule(arguments, AndRule, [1, 1]);
	} //──── and any ───────────────────────────────────────────────────────────────────────────

	function any() {
	  return mkComplexRule(arguments, AndRule, [0, -1]);
	} //──── and many ──────────────────────────────────────────────────────────────────────────

	function many() {
	  return mkComplexRule(arguments, AndRule, [1, -1]);
	} //──── and option ────────────────────────────────────────────────────────────────────────

	function option() {
	  return mkComplexRule(arguments, AndRule, [0, 1]);
	} //========================================================================================

	/*                                                                                      *
	 *                                      or rule api                                     *
	 *                                                                                      */
	//========================================================================================
	//──── or ────────────────────────────────────────────────────────────────────────────────

	function or() {
	  return mkComplexRule(arguments, OrRule, [1, 1]);
	} //──── or any ────────────────────────────────────────────────────────────────────────────

	function anyOne() {
	  return mkComplexRule(arguments, OrRule, [0, -1]);
	} //──── or many ───────────────────────────────────────────────────────────────────────────

	function manyOne() {
	  return mkComplexRule(arguments, OrRule, [1, -1]);
	} //──── or option ─────────────────────────────────────────────────────────────────────────

	function optionOne() {
	  return mkComplexRule(arguments, OrRule, [0, 1]);
	} //========================================================================================

	/*                                                                                      *
	 *                                  Match Rule Builder                                  *
	 *                                                                                      */
	//========================================================================================

	function mkMatch(args, defaultMatchCallback) {
	  var name,
	      pattern,
	      regexp,
	      pick = 0,
	      startCodes,
	      ignoreCase = false,
	      options;

	  if (isObj(args[0])) {
	    var _desc = args[0],
	        p = _desc.pattern;

	    if (isReg(p)) {
	      regexp = p;
	      pick = _desc.pick;
	      startCodes = _desc.startCodes;
	    } else if (isStrOrCodes(p)) {
	      pattern = p;
	      ignoreCase = _desc.ignoreCase;
	    }

	    name = _desc.name;
	    options = _desc;
	  } else {
	    var i = 1;

	    if (isStr(args[0]) && isMatchPattern(args[1])) {
	      name = args[0];
	      isReg(args[1]) ? regexp = args[1] : pattern = args[1];
	      i = 2;
	    } else if (isMatchPattern(args[0])) {
	      isReg(args[0]) ? regexp = args[0] : pattern = args[0];
	    }

	    if (regexp) {
	      if (isBool(args[i]) || isInt(args[i])) pick = args[i++];
	      if (isStrOrCodes(args[i])) startCodes = args[i++];
	    } else {
	      if (isBool(args[i])) ignoreCase = args[i++];
	    }

	    options = parseRuleOptions(args, i);
	  }

	  !options.match && (options.match = defaultMatchCallback);
	  return regexp ? new RegMatchRule(name, regexp, options.match === discardMatch ? false : pick, startCodes, options) : pattern ? strMatch(name, pattern, ignoreCase, options) : assert('invalid match rule {j}', args);
	}

	function isStrOrCodes(pattern) {
	  return isStr(pattern) || isNum(pattern) || isArray(pattern);
	}

	function isMatchPattern(pattern) {
	  return isReg(pattern) || isStrOrCodes(pattern);
	}

	function strMatch(name, pattern, ignoreCase, options) {
	  var C = isStr(pattern) && pattern.length > 1 ? StringMatchRule : CharMatchRule;
	  return new C(name, pattern, ignoreCase, options);
	} //========================================================================================

	/*                                                                                      *
	 *                                 complex rule builder                                 *
	 *                                                                                      */
	//========================================================================================


	function mkComplexRule(args, Rule, defaultRepeat) {
	  var name, builder, rules, repeat, options;

	  if (isObj(args[0])) {
	    var _desc2 = args[0],
	        r = _desc2.rules;
	    if (isArray(r) || isFn(r)) rules = r;
	    repeat = _desc2.repeat;
	    name = _desc2.name;
	    options = _desc2;
	  } else {
	    var i = 0;
	    if (isStr(args[i])) name = args[i++];
	    if (isArray(args[i]) || isFn(args[i])) rules = args[i++];
	    if (isArray(args[i])) repeat = args[i++];
	    options = parseRuleOptions(args, i);
	  }

	  if (!repeat) repeat = defaultRepeat;

	  if (rules) {
	    builder = rulesBuilder(rules);
	    return new Rule(name, repeat, builder, options);
	  }
	}

	function rulesBuilder(rules) {
	  return function (_rule) {
	    return mapArray(isFn(rules) ? rules(_rule) : rules, function (r, i) {
	      if (!r) return SKIP;
	      var rule = r.$rule ? r : mkMatch(isArray(r) ? r : [r], discardMatch);
	      assert.is(rule, '{}: Invalid Rule Configuration on index {d}: {j}', _rule, i, r);
	      return rule;
	    });
	  };
	} //========================================================================================

	/*                                                                                      *
	 *                                         tools                                        *
	 *                                                                                      */
	//========================================================================================


	function parseRuleOptions(args, i) {
	  var options = {};
	  if (isBool(args[i])) options.capturable = args[i++];
	  options.match = args[i++];
	  options.err = args[i];
	  return options;
	}

	/**
	 * utility utilities
	 * @module utility
	 * @preferred
	 * @author Tao Zeng <tao.zeng.zt@qq.com>
	 * @created Wed Nov 21 2018 10:21:41 GMT+0800 (China Standard Time)
	 * @modified Sat Mar 23 2019 18:50:43 GMT+0800 (China Standard Time)
	 */

	/**
	 * Observer Key
	 */

	var OBSERVER_KEY = addDefaultKey('__observer__');
	/**
	 * the property of observe an array change
	 */

	var ARRAY_CHANGE = '$change';
	var ARRAY_LENGTH = 'length';
	/**
	 * The dirty collector lost the original value
	 */

	var MISS = {
	  toString: function toString() {
	    return 'MISS';
	  },
	  toJSON: function toJSON() {
	    return 'MISS';
	  }
	};

	/**
	 * Observe implementation on the Proxy of ES6
	 * @module observer
	 * @author Tao Zeng <tao.zeng.zt@qq.com>
	 * @created Tue Mar 19 2019 14:12:23 GMT+0800 (China Standard Time)
	 * @modified Thu Mar 28 2019 15:37:58 GMT+0800 (China Standard Time)
	 */
	/**
	 * @ignore
	 */

	function proxyPolicy () {
	  if (GLOBAL.Proxy) return {
	    __name: 'Proxy',
	    __proxy: 'proxy',
	    __createProxy: function __createProxy(observer, target, isArray) {
	      var setter;

	      if (isArray) {
	        var changeWatcher = observer.initWatcher(ARRAY_CHANGE);

	        setter = function setter(source, prop, value) {
	          var watcher = observer.watcher(prop);
	          watcher && watcher.notify(source[prop]);
	          source[prop] = value;
	          changeWatcher.notify(observer.proxy);
	          return true;
	        };
	      } else {
	        setter = function setter(source, prop, value) {
	          var watcher = observer.watcher(prop);
	          watcher && watcher.notify(source[prop]);
	          source[prop] = value;
	          return true;
	        };
	      }

	      return new Proxy(target, {
	        set: setter
	      });
	    }
	  };
	}

	/**
	 * Observe implementation on the Object.defineProperty of ES5 or `__defineGetter__` and `__defineSetter__`
	 * @module observer
	 * @author Tao Zeng <tao.zeng.zt@qq.com>
	 * @created Tue Mar 19 2019 14:12:23 GMT+0800 (China Standard Time)
	 * @modified Thu Apr 04 2019 18:49:04 GMT+0800 (China Standard Time)
	 */
	/**
	 * @ignore
	 */

	function accessorPolicy () {
	  if (propAccessor) return {
	    __name: 'Accessor',
	    __watch: function __watch(observer, prop, watcher) {
	      var target = observer.target;
	      var setter;

	      if (!observer.isArray) {
	        setter = function setter(newValue) {
	          watcher.notify(value);
	          value = newValue;
	        };
	      } else if (prop !== ARRAY_CHANGE && prop !== ARRAY_LENGTH) {
	        var changeWatcher = observer.initWatcher(ARRAY_CHANGE);

	        setter = function setter(newValue) {
	          watcher.notify(value);
	          value = newValue;
	          changeWatcher.notify(target);
	        };
	      } else {
	        return;
	      }

	      var value = target[prop];

	      try {
	        defProp(target, prop, {
	          get: function get() {
	            return value;
	          },
	          set: setter
	        });
	      } catch (e) {
	        return e;
	      }
	    }
	  };
	}

	/**
	 * Observe implementation on the VBScript of MSIE
	 * @module observer
	 * @author Tao Zeng <tao.zeng.zt@qq.com>
	 * @created Tue Mar 19 2019 14:12:23 GMT+0800 (China Standard Time)
	 * @modified Thu Mar 28 2019 15:38:05 GMT+0800 (China Standard Time)
	 */
	function vbPolicy () {
	  if (GLOBAL.VBArray) {
	    try {
	      execScript(['Function parseVB(code)', '\tExecuteGlobal(code)', 'End Function'].join('\n'), 'VBScript');
	      addDefaultKeys(VBPROXY_KEY, VBPROXY_CTOR_KEY);
	      return {
	        __name: 'VBProxy',
	        __proxy: 'vb',
	        __createProxy: function __createProxy(observer, target, isArray) {
	          return isArray ? target : new VBProxy(target, observer).__proxy;
	        },
	        __watch: function __watch(observer, prop, watcher) {
	          if (!observer.isArray && !observer.target[VBPROXY_KEY].__props[prop]) {
	            return new Error("property[" + prop + "] is not defined");
	          }
	        }
	      };
	    } catch (e) {
	      console.error(e.message, e);
	    }
	  }
	}
	var VBProxy =
	/*#__PURE__*/
	function () {
	  /**
	   * function property map
	   * 	- key: property name
	   * 	- value: [scoped function, original function]
	   */
	  function VBProxy(source, observer) {
	    var props = [],
	        propMap = create(null),
	        __fns = [],
	        fns = create(null);
	    var prop,
	        i = 0,
	        j = 0;

	    for (prop in source) {
	      propMap[prop] = true;
	      props[i++] = prop;
	      if (isFn(source[prop])) __fns[j++] = prop;
	    }

	    applyProps(props, propMap, OBJECT_DEFAULT_PROPS);
	    applyProps(props, propMap, getDefaultKeys());
	    var proxy = loadClassFactory(props)(this);

	    while (j--) {
	      prop = __fns[j];
	      fns[prop] = [, source[prop]];
	    }

	    this.__source = source;
	    this.__observer = observer;
	    this.__proxy = proxy;
	    this.__fns = fns;
	    this.__props = propMap;
	    source[VBPROXY_KEY] = this;
	  }

	  var _proto = VBProxy.prototype;

	  _proto.set = function set(prop, value) {
	    var source = this.__source,
	        fns = this.__fns;

	    if (isFn(value)) {
	      fns[prop] = [, value];
	    } else if (fns[prop]) {
	      fns[prop] = null;
	    }

	    var watcher = this.__observer.watcher(prop);

	    watcher && watcher.notify(source[prop]);
	    source[prop] = value;
	  };

	  _proto.get = function get(prop) {
	    var fn = this.__fns[prop];
	    return fn ? fn[0] || (fn[0] = fn[1].bind(this.__proxy)) : this.__source[prop];
	  };

	  return VBProxy;
	}();

	function applyProps(props, propMap, applyProps) {
	  var i = applyProps.length,
	      j = props.length,
	      prop;

	  while (i--) {
	    prop = applyProps[i];

	    if (!propMap[prop]) {
	      propMap[prop] = true;
	      props[j++] = prop;
	    }
	  }
	}

	var VBPROXY_KEY = '__vbclass_binding__',
	    VBPROXY_CTOR_KEY = '__vbclass_constructor__',
	    OBJECT_DEFAULT_PROPS = [VBPROXY_KEY, CONSTRUCTOR, HAS_OWN_PROP, 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'valueOf'];
	var CONSTRUCTOR_SCRIPT = "\n\tPublic [" + VBPROXY_KEY + "]\n\tPublic Default Function [" + VBPROXY_CTOR_KEY + "](source)\n\t\tSet [" + VBPROXY_KEY + "] = source\n\t\tSet [" + VBPROXY_CTOR_KEY + "] = Me\n\tEnd Function\n\t",
	    classPool = create(null);

	function genAccessorScript(prop) {
	  return "\n\tPublic Property Let [" + prop + "](value)\n\t\tCall [" + VBPROXY_KEY + "].set(\"" + prop + "\", val)\n\tEnd Property\n\tPublic Property Set [" + prop + "](value)\n\t\tCall [" + VBPROXY_KEY + "].set(\"" + prop + "\", val)\n\tEnd Property\n\n\tPublic Property Get [" + prop + "]\n\tOn Error Resume Next\n\t\tSet [" + prop + "] = [" + VBPROXY_KEY + "].get(\"" + prop + "\")\n\tIf Err.Number <> 0 Then\n\t\t[" + prop + "] = [" + VBPROXY_KEY + "].get(\"" + prop + "\")\n\tEnd If\n\tOn Error Goto 0\n\tEnd Property\n\n";
	}

	function genClassScript(className, props) {
	  var buffer = ['Class ', className, CONSTRUCTOR_SCRIPT],
	      l = props.length;
	  var i = 0;

	  for (; i < l; i++) {
	    buffer[i + 3] = genAccessorScript(props[i]);
	  }

	  buffer[i + 3] = 'End Class';
	  return buffer.join('\n');
	}

	var classNameGenerator = 1;

	function loadClassFactory(props) {
	  var classKey = props.sort().join('|');
	  var factoryName = classPool[classKey];

	  if (!factoryName) {
	    var className = "VBClass" + classNameGenerator++;
	    factoryName = className + "Factory"; // build VB Class

	    parseVB(genClassScript(className, props));
	    parseVB("\nFunction " + factoryName + "(desc)\n\tDim o\n\tSet o=(New " + className + ")(desc)\n\tSet " + factoryName + " = o\nEnd Function");
	    classPool[classKey] = factoryName;
	  }

	  return GLOBAL[factoryName];
	}

	/*                                                                                      *
	 *                                        topic                                         *
	 *                                                                                      */
	//========================================================================================

	/**
	 * special object
	 * - special object indicates that the topic has not changed
	 */

	var V = {};

	function isObserverTarget(obj) {
	  return obj && (isArray(obj) || isObject(obj));
	}
	/**
	 * is array change property
	 * @param observer 	observer
	 * @param prop 		property of the observer's target
	 */


	function isArrayChangeProp(observer, prop) {
	  return observer.isArray && prop === ARRAY_CHANGE;
	}
	/**
	 * get property value on object
	 * @param obj 	object
	 * @param prop 	property
	 */


	function getValue(obj, prop) {
	  return obj === undefined || obj === null ? undefined : obj[prop];
	}
	/**
	 * get property value on the original value
	 * check {@link MISS}
	 * @param original 	original value
	 * @param prop 		property
	 */


	function getOriginalValue(original, prop) {
	  return original === undefined || original === null ? undefined : original === MISS ? original : original[prop];
	} // id generator of topic


	var topicIdGen = 0; // the dirty topic queue waiting for collection

	var collectQueue = []; // the dirty topic queue waiting for notification

	var dirtyQueue = []; // flags of topic

	var TOPIC_ENABLED_FLAG = 0x1,
	    // topic is enabled
	TOPIC_LISTEN_FLAG = 0x2,
	    // topic is listend
	TOPIC_SUB_FLAG = 0x4; // topic has subtopic

	/**
	 * @ignore
	 */

	var Topic =
	/*#__PURE__*/
	function () {
	  // parent topic
	  // own observer
	  // watch property
	  // binded observer
	  // property path
	  // listeners
	  // the original value before change
	  // collected dirty value: [new value, original value, force notify]
	  // subtopics
	  // cache of subtopics
	  // flags: TOPIC_ENABLED_FLAG | TOPIC_LISTEN_FLAG | TOPIC_SUB_FLAG

	  /**
	   * create a Topic
	   * @param owner		own observer
	   * @param prop		watch property
	   * @param parent	parent topic
	   */
	  function Topic(owner, prop, parent) {
	    this.__state = 0;
	    this.__original = V; // special object indicates that the topic has not changed

	    this.__owner = owner;
	    this.__prop = prop;
	    this.__parent = parent;
	    this.__id = topicIdGen++;
	  }
	  /**
	   * add listener
	   * @param path		path of topic
	   * @param cb		observe callback
	   * @param scope		scope of the callback
	   * @return listen-id | undefined
	   */


	  var _proto = Topic.prototype;

	  _proto.__listen = function __listen(path, cb, scope) {
	    var listeners = this.__listeners;

	    if (!listeners) {
	      this.__listeners = listeners = new FnList();
	      this.__path = path;
	    }

	    var id = listeners.add(cb, scope);
	    id && (this.__state |= TOPIC_LISTEN_FLAG | TOPIC_ENABLED_FLAG);
	    return id;
	  }
	  /**
	   * remove listener by callback
	   * @param cb		observe callback
	   * @param scope		scope of the callback
	   */
	  ;

	  _proto.__unlisten = function __unlisten(cb, scope) {
	    var listeners = this.__listeners;

	    if (listeners) {
	      listeners.remove(cb, scope);

	      this.____unlisten(listeners);
	    }
	  }
	  /**
	   * remove listener by listen-id
	   * @param id	listen-id
	   */
	  ;

	  _proto.__unlistenId = function __unlistenId(id) {
	    var listeners = this.__listeners;

	    if (listeners) {
	      listeners.removeId(id);

	      this.____unlisten(listeners);
	    }
	  }
	  /**
	   * Clear all unlistening leaf topics (!TOPIC_LISTEN_FLAG && !TOPIC_SUB_FLAG)
	   * @param listeners	listeners
	   */
	  ;

	  _proto.____unlisten = function ____unlisten(listeners) {
	    if (!listeners.size()) {
	      // this topic has no listeners, clear the listen flag
	      var topic = this,
	          parent;
	      topic.__state &= ~TOPIC_LISTEN_FLAG;

	      while (topic.__state === TOPIC_ENABLED_FLAG) {
	        // the topic has no listeners and subtopics
	        //  - unbind the observer on the topic
	        //  - clear topic state
	        //  - remove from the parent topic
	        topic.__bind();

	        topic.__state = 0;
	        if (!(parent = topic.__parent)) break;

	        parent.__removeSub(topic);

	        topic = parent; // re-check the parent topic
	      }
	    }
	  }
	  /**
	   * bind observer
	   * @param observer new observer
	   */
	  ;

	  _proto.__bind = function __bind(observer) {
	    var org = this.__observer;

	    if (org !== observer) {
	      org && org.__unwatchTopic(this); // unbind old observer

	      if (observer) {
	        var err = observer.__watchTopic(this);

	        if (err) {
	          var path = this.__getPath();

	          assert("observer[{}]: can not watch {} on {}{}, {{message}}.", formatPath(path), formatPath(path.slice(-1)), toStrType(observer.target), path.length > 1 ? "[" + formatPath(path.slice(0, -1)) + "]" : '', err, err, this.__owner.target);
	        }
	      }

	      this.__observer = observer;
	    }
	  }
	  /**
	   * get a subtopic from the cache
	   * @param prop property
	   */
	  ;

	  _proto.__getSub = function __getSub(prop) {
	    var subCache = this.__subCache;
	    return subCache && subCache[prop];
	  }
	  /**
	   * get or create a subtopic on the cache
	   * @param subProp	property of the subtopic
	   * @return subtopic
	   */
	  ;

	  _proto.__addSub = function __addSub(subProp) {
	    var subCache = this.__subCache || (this.__subs = [], this.__subCache = create(null)),
	        sub = subCache[subProp] || (subCache[subProp] = new Topic(this.__owner, subProp, this));

	    if (!(sub.__state & TOPIC_ENABLED_FLAG)) {
	      // init the subtopic
	      var subs = this.__subs,
	          _observer = this.__observer; // 1. bind observer

	      if (_observer) {
	        var _prop = this.__prop;
	        var subObserver;

	        if (subs[0]) {
	          subObserver = subs[0].__observer;
	        } else if (!isArrayChangeProp(_observer, _prop)) {
	          var subTarget = _observer.target[_prop];

	          if (isObserverTarget(subTarget)) {
	            subObserver = __loadSubObserver(_observer, _prop, subTarget);
	          }
	        }

	        sub.__bind(subObserver);
	      } // 2. attach subtopic


	      sub.__state |= TOPIC_ENABLED_FLAG;
	      subs.push(sub);
	    }

	    this.__state |= TOPIC_SUB_FLAG | TOPIC_ENABLED_FLAG;
	    return sub;
	  }
	  /**
	   * remove the subtopic from the subs
	   * @param topic topic
	   */
	  ;

	  _proto.__removeSub = function __removeSub(topic) {
	    var subs = this.__subs;
	    var l = subs.length;
	    var i = l;

	    while (i--) {
	      if (topic === subs[i]) {
	        subs.splice(i, 1);
	        l === 1 && (this.__state &= ~TOPIC_SUB_FLAG);
	        return;
	      }
	    }

	    assert('un-attached topic');
	  };

	  _proto.__getPath = function __getPath() {
	    var path = this.__path;

	    if (!path) {
	      var parent = this.__parent,
	          _prop2 = this.__prop;
	      this.__path = path = parent ? parent.__getPath().concat(_prop2) : [_prop2];
	    }

	    return path;
	  }
	  /**
	   * mark the change in topic
	   *
	   * @param original original value
	   */
	  ;

	  _proto.__update = function __update(original) {
	    if (this.__original === V) {
	      this.__original = original; // add to collect queue

	      var l = collectQueue.length;
	      collectQueue[l] = this;
	      !l && nextTick(collect);
	    }
	  }
	  /**
	   * collect the dirty topics(this topic and subtopics) from collectQueue
	   * may collected by parent-topic
	   */
	  ;

	  _proto.__collect = function __collect() {
	    var original = this.__original;

	    if (original !== V) {
	      var _observer2 = this.__observer;
	      this.__original = V;
	      _observer2 && this.____collect(_observer2, _observer2.target, original, false);
	    } // this topic has been collected, retains its dirty value

	  }
	  /**
	   * collect the dirty topics(this topic and subtopics)
	   * - collect from collectQueue
	   * 	1. this topic has been collected, stop collect
	   * 	2. save the dirty value when the topic has a listener
	   * 	3. clean the change state
	   * 	4. collect the subtopics
	   *		use this original value when subtopic has not changed
	   *		use the subtopic's original value when subtopic is changed
	   * 		clean the change state
	   *		replace the new value on subtopics
	   * - re-collect by parent-topic (this does not happen after the topics are sorted by ID before collection)
	   * 	1. replace the new value and discard the original value(keep the existing original value)
	   * 	2. re-collect subtopics
	   *
	   * @param observer 	observer of this topic
	   * @param target 	new target of this topic
	   * @param original 	original value of this topic
	   * @param force  	force notify
	   */
	  ;

	  _proto.____collect = function ____collect(observer, target, original, force) {
	    var flags = this.__state,
	        prop = this.__prop;
	    var dirty,
	        subTarget = V; // lazy load the sub-target

	    if (flags & TOPIC_LISTEN_FLAG) {
	      if (!(dirty = this.__dirty)) {
	        this.__dirty = dirty = [, original, force];
	        dirtyQueue.push(this);
	      } else if (force) {
	        dirty[2] = force; // if this topic has been changed and collected, retains its original value
	      } // set the new value


	      dirty[0] = observer && isArrayChangeProp(observer, prop) ? target : subTarget = getValue(target, prop);
	    }

	    if (flags & TOPIC_SUB_FLAG) {
	      subTarget === V && (subTarget = getValue(target, prop));
	      var subs = this.__subs;
	      var l = subs.length;
	      var subObserver,
	          orgSubObserver,
	          sub,
	          subOriginal,
	          i = 0;

	      if (observer) {
	        if (!isArrayChangeProp(observer, prop)) {
	          if (isObserverTarget(subTarget)) {
	            subObserver = __loadSubObserver(observer, prop, subTarget);

	            if (proxyEnable) {
	              subTarget = subObserver.target;
	              dirty && (dirty[0] = subObserver.proxy); // update dirty proxy
	            }
	          }
	        }
	      } else if (proxyEnable && dirty) {
	        dirty[0] = exports.proxy(dirty[0]);
	      }

	      for (; i < l; i++) {
	        sub = subs[i];
	        orgSubObserver = sub.__observer;

	        if (!subObserver || orgSubObserver != subObserver) {
	          sub.__bind(subObserver);

	          if ((subOriginal = sub.__original) === V) {
	            // 1. this subtopic has not been changed, using the original value of the current topic
	            // *2. this subtopic has been changed and collected, and the collector retains its original value
	            // *   this does not happen after the topics are sorted by ID before collection
	            subOriginal = sub.__dirty ? undefined : getOriginalValue(original, sub.__prop);
	          } else {
	            // this subtopic was changed but not collected, collected in advance
	            sub.__original = V;
	          }

	          sub.____collect(subObserver, subTarget, subOriginal, orgSubObserver != subObserver);
	        }
	      }
	    } else if (dirty && proxyEnable) {
	      dirty[0] = exports.proxy(dirty[0]);
	    }
	  };

	  return Topic;
	}();

	function compareTopic(topic1, topic2) {
	  return topic1.__id - topic2.__id;
	}
	/**
	 * collect the dirty topics on the collectQueue
	 */


	function collect() {
	  var l = collectQueue.length,
	      i = 0; // sort by topic id

	  collectQueue.sort(compareTopic);

	  for (; i < l; i++) {
	    collectQueue[i].__collect();
	  }

	  collectQueue.length = 0;
	  notify();
	}
	/**
	 * notify all of the dirty topics
	 */

	function notify() {
	  var l = dirtyQueue.length;
	  var topic,
	      owner,
	      path,
	      value,
	      original,
	      dirty,
	      i = 0;

	  for (; i < l; i++) {
	    topic = dirtyQueue[i];
	    dirty = topic.__dirty;
	    value = dirty[0];
	    original = dirty[1];
	    topic.__dirty = null; // clean the dirty

	    if (dirty[2] || value !== original || !isPrimitive(value)) {
	      // real dirty
	      owner = topic.__owner;
	      path = topic.__path;

	      topic.__listeners.each(function (fn, scope) {
	        scope ? fn.call(scope, path, value, original, owner) : fn(path, value, original, owner);
	      });
	    }
	  }

	  dirtyQueue.length = 0;
	} //========================================================================================

	/*                                                                                      *
	 *                                       Observer                                       *
	 *                                                                                      */
	//========================================================================================


	var __original__;

	function __updateTopicCB(topic) {
	  topic.__update(__original__);
	}

	var Watcher =
	/*#__PURE__*/
	function (_List) {
	  _inheritsLoose(Watcher, _List);

	  function Watcher() {
	    return _List.call(this) || this;
	  }
	  /**
	   * notify topics
	   *
	   * @param original the original value
	   */


	  var _proto2 = Watcher.prototype;

	  _proto2.notify = function notify(original) {
	    __original__ = original;
	    this.eachUnsafe(__updateTopicCB);
	    __original__ = 0;
	  };

	  return Watcher;
	}(List);

	var Observer =
	/*#__PURE__*/
	function () {
	  /**
	   * observer target
	   */

	  /**
	   * observer proxy
	   */

	  /**
	   * is array target
	   */

	  /**
	   * topics
	   * 	- key: property of topic in the observer's target
	   * 	- value: topic
	   */

	  /**
	   * watchers
	   * 	- key: property of watcher in the observer's target
	   * 	- value: watcher
	   */

	  /**
	   * properties of watchers in the observer's target
	   */

	  /**
	   * create Observer
	   *
	   * @param target observer target
	   */
	  function Observer(target) {
	    var arrayTarget = isArray(target);

	    if (arrayTarget) {
	      applyArrayHooks(target);
	    } else {
	      assert.is(isObject(target), "the observer's target can only be an object or an array");
	    }

	    var watchers = create(null);
	    this.__watchers = watchers;
	    this.__watcherProps = [];
	    this.isArray = arrayTarget;
	    this.target = target; // bind observer key on the observer's target

	    defPropValue(target, OBSERVER_KEY, this, false, false, false);
	    this.proxy = policy.__createProxy(this, target, arrayTarget);
	  }
	  /**
	   * observe changes in the observer's target
	   *
	   * @param propPath 	property path for observe, parse string path by {@link parsePath}
	   * @param cb		callback
	   * @param scope		scope of callback
	   * @return listen-id
	   */


	  var _proto3 = Observer.prototype;

	  _proto3.observe = function observe(propPath, cb, scope) {
	    var path = parsePath(propPath),
	        topics = this.__topics || (this.__topics = create(null)),
	        prop0 = path[0];
	    var topic = topics[prop0] || (topics[prop0] = new Topic(this, prop0)),
	        i = 1,
	        l = path.length;

	    topic.__bind(this);

	    topic.__flags |= TOPIC_ENABLED_FLAG;

	    for (; i < l; i++) {
	      topic = topic.__addSub(path[i]);
	    }

	    return topic.__listen(path, cb, scope);
	  }
	  /**
	   * get listen-id of callback in the observer's target
	   *
	   * @param propPath 	property path for observe, parse string path by {@link parsePath}
	   * @param cb		callback
	   * @param scope		scope of callback
	   * @return listen-id
	   */
	  ;

	  _proto3.observed = function observed(propPath, cb, scope) {
	    var topic = this.__getTopic(parsePath(propPath));

	    var listeners;
	    return topic && (listeners = topic.__listeners) && listeners.has(cb, scope);
	  }
	  /**
	   * has listen-id in the observer's target
	   *
	   * @param propPath 	property path for observe, parse string path by {@link parsePath}
	   * @param id		listen-id
	   * @return listen-id
	   */
	  ;

	  _proto3.observedId = function observedId(propPath, id) {
	    var topic = this.__getTopic(parsePath(propPath));

	    var listeners;
	    return topic && (listeners = topic.__listeners) && listeners.hasId(id);
	  }
	  /**
	   * cancel observing the changes in the observer's target
	   *
	   * @param propPath	property path for unobserve, parse string path by {@link parsePath}
	   * @param cb		callback
	   * @param scope		scope of callback
	   */
	  ;

	  _proto3.unobserve = function unobserve(propPath, cb, scope) {
	    var topic = this.__getTopic(parsePath(propPath));

	    topic && topic.__unlisten(cb, scope);
	  }
	  /**
	   * cancel observing the changes in the observer's target by listen-id
	   *
	   * @param propPath	property path for unobserve, parse string path by {@link parsePath}
	   * @param id 		listen-id
	   */
	  ;

	  _proto3.unobserveId = function unobserveId(propPath, id) {
	    var topic = this.__getTopic(parsePath(propPath));

	    topic && topic.__unlistenId(id);
	  }
	  /**
	   * notify change on the property
	   *
	   * @param prop		the property
	   * @param original 	the original value
	   */
	  ;

	  _proto3.notify = function notify(prop, original) {
	    var watcher = this.__watchers[prop];
	    watcher && watcher.notify(original);
	  }
	  /**
	   * notify the observer that properties in the target have changed
	   *
	   * @param props 		notify properties, notify all watchers when the props is null or undefined
	   * @param getOriginal	get the original value
	   * @param execludes		do not notify watchers in execludes
	   */
	  ;

	  _proto3.notifies = function notifies(props, getOriginal, execludes) {
	    props || (props = this.__watcherProps);
	    var watchers = this.__watchers;
	    var prop,
	        watcher,
	        i = props.length,
	        origin;

	    if (execludes) {
	      while (i--) {
	        prop = props[i];

	        if (!execludes[prop] && (watcher = watchers[prop]) && watcher.size()) {
	          origin = getOriginal(prop, this);
	          origin !== V && watcher.notify(origin);
	        }
	      }
	    } else {
	      while (i--) {
	        prop = props[i];

	        if ((watcher = watchers[prop]) && watcher.size()) {
	          origin = getOriginal(prop, this);
	          origin !== V && watcher.notify(origin);
	        }
	      }
	    }
	  }
	  /**
	   * get wather by property
	   *
	   * @protected
	   * @param prop the property
	   */
	  ;

	  _proto3.watcher = function watcher(prop) {
	    var watcher = this.__watchers[prop];
	    if (watcher && watcher.size()) return watcher;
	  }
	  /**
	   * get or create wather by property
	   *
	   * @protected
	   * @param prop the property
	   */
	  ;

	  _proto3.initWatcher = function initWatcher(prop) {
	    var watchers = this.__watchers;
	    var watcher = watchers[prop];

	    if (!watcher) {
	      watchers[prop] = watcher = new Watcher();

	      this.__watcherProps.push(prop);

	      var err = policy.__watch(this, prop, watcher);

	      assert.not(err, "can not watch property[{}] on the Observer, {{message}}", prop, err, err, this.target);
	    }

	    return watcher;
	  }
	  /**
	   * watch the topic
	   *
	   * @private
	   * @param topic topic
	   * @return is successful
	   */
	  ;

	  _proto3.__watchTopic = function __watchTopic(topic) {
	    var watchers = this.__watchers;
	    var prop = topic.__prop;
	    var watcher = watchers[prop],
	        err;

	    if (!watcher) {
	      watchers[prop] = watcher = new Watcher();

	      this.__watcherProps.push(prop);

	      err = policy.__watch(this, prop, watcher);
	    }

	    watcher.add(topic);
	    return err;
	  }
	  /**
	   * unwatched the topic
	   *
	   * @private
	   * @param topic topic
	   */
	  ;

	  _proto3.__unwatchTopic = function __unwatchTopic(topic) {
	    this.__watchers[topic.__prop].remove(topic);
	  }
	  /**
	   * get topic by property path
	   *
	   * @param path property path of topic, parse string path by {@link parsePath}
	   * @return topic | undefined
	   */
	  ;

	  _proto3.__getTopic = function __getTopic(path) {
	    var topics = this.__topics;
	    var topic;

	    if (topics && (topic = topics[path[0]])) {
	      for (var i = 1, l = path.length; i < l; i++) {
	        if (!(topic = topic.__getSub(path[i]))) break;
	      }
	    }

	    return topic;
	  }
	  /**
	   * get the value at path of target object
	   *
	   * @param propPath 	property path of target object, parse string path by {@link parsePath}
	   * @return the value
	   */
	  ;

	  _proto3.get = function get(propPath) {
	    return exports.$get(this.target, propPath);
	  }
	  /**
	   * set the value at path of target object
	   *
	   * @param propPath 	property path for target object, parse string path by {@link parsePath}
	   * @param value		the value
	   */
	  ;

	  _proto3.set = function set(propPath, value) {
	    exports.$set(this.proxy, propPath, value);
	  }
	  /**
	   * @ignore
	   */
	  ;

	  _proto3.toJSON = function toJSON() {};

	  return Observer;
	}(); //========================================================================================

	/*                                                                                      *
	 *                                      Array Hooks                                     *
	 *                                                                                      */
	//========================================================================================


	var arrayHooks = [];
	var ARRAY_LEN_CHANGE = [ARRAY_LENGTH, ARRAY_CHANGE];
	var arrayHookCfg = {
	  push: [ARRAY_LEN_CHANGE],
	  pop: [ARRAY_LEN_CHANGE],
	  splice: function splice(ob, args) {
	    var target = ob.target,
	        proxy = ob.proxy;
	    var start = args[0],
	        d = args.length - 2 - args[1];
	    ob.notifies(null, function (prop) {
	      return prop === ARRAY_CHANGE ? proxy : prop === ARRAY_LENGTH ? d ? target[prop] : V : prop > start && (d || prop < start + args[1]) ? target[prop] : V;
	    });
	  },
	  shift: [],
	  unshift: [],
	  'fill,reverse,sort': [null, {
	    length: 1
	  }]
	};
	eachObj(arrayHookCfg, function (hooker, methods) {
	  eachArray(methods.split(','), function (method) {
	    var fn = Array[PROTOTYPE][method];
	    var hook;

	    if (isFn(hooker)) {
	      var cb = hooker;

	      hook = function hook() {
	        var ob = this[OBSERVER_KEY];
	        cb(ob, arguments);
	        return applyScope(fn, ob.target, arguments);
	      };
	    } else {
	      var _ref = hooker,
	          props = _ref[0],
	          execludes = _ref[1];

	      hook = function hook() {
	        var ob = this[OBSERVER_KEY];
	        ob.notifies(props, getArrayOriginValue, execludes);
	        return applyScope(fn, ob.target, arguments);
	      };
	    }

	    arrayHooks.push([method, hook]);
	  });
	});

	function getArrayOriginValue(prop, ob) {
	  return prop === ARRAY_CHANGE ? ob.proxy : ob.target[prop];
	}
	/**
	 * apply observer hooks on Array
	 * @param array
	 */


	function applyArrayHooks(array) {
	  var hook,
	      i = arrayHooks.length;

	  while (i--) {
	    hook = arrayHooks[i];
	    defPropValue(array, hook[0], hook[1], false, false, false);
	  }
	} //========================================================================================

	/*                                                                                      *
	 *                                        policy                                        *
	 *                                                                                      */
	//========================================================================================


	var policy = proxyPolicy() || accessorPolicy() || vbPolicy();
	assert.is(policy, 'The observer module is not supported.');
	if (!policy.__createProxy) policy.__createProxy = function (observer, target) {
	  return target;
	};
	if (!policy.__watch) policy.__watch = function () {};
	var proxyEnable = policy.__proxy;
	/**
	 * get existing observer on object
	 *
	 * @return existing observer
	 */

	var __getObserver = function __getObserver(target) {
	  var ob = target[OBSERVER_KEY];
	  if (ob && (ob.target === target || ob.proxy === target)) return ob;
	};
	/**
	 * get or create sub-observer (well fix proxy value)
	 *
	 * @param observer 	observer
	 * @param prop		property of the observer's target
	 * @param target	target = observer.target[prop]
	 * @return sub-observer
	 */


	var __loadSubObserver = function __loadSubObserver(observer, prop, target) {
	  var subObserver = __getObserver(target) || new Observer(target);
	  if (subObserver.proxy !== target) observer.target[prop] = subObserver.proxy;
	  return subObserver;
	};
	/**
	 * get the original object of the observer on the object
	 *
	 * @param object the object
	 * @return the original object | the object
	 */


	exports.source = function source(obj) {
	  var observer = obj && __getObserver(obj);

	  return observer ? observer.target : obj;
	};
	/**
	 * get the proxy object for the observer on the object
	 *
	 * @param object the object
	 * @return the proxy object | the object
	 */


	exports.proxy = function proxy(obj) {
	  var observer = obj && __getObserver(obj);

	  return observer ? observer.proxy : obj;
	};
	/**
	 * support equals function between observer objects
	 */


	exports.$eq = function $eq(o1, o2) {
	  return eq(o1, o2) || (o1 && o2 && (o1 = __getObserver(o1)) ? o1 === __getObserver(o2) : false);
	};
	/**
	 * get the value at path of object
	 *
	 * @param obj 		the object
	 * @param path		property path of object, parse string path by {@link parsePath}
	 * @return the value | the proxy of value
	 */


	exports.$get = function $get(obj, path) {
	  return exports.proxy(get(obj, path));
	};
	/**
	 * set the value at path of object
	 *
	 * @param obj 		the object
	 * @param path		property path of object, parse string path by {@link parsePath}
	 * @param value 	value
	 */


	exports.$set = function $set(obj, path, value) {
	  path = parsePath(path);
	  var l = path.length - 1;
	  var i = 0,
	      v;

	  for (; i < l; i++) {
	    v = obj[path[i]];
	    obj = v === null || v === undefined ? exports.proxy(obj)[path[i]] = {} : v;
	  }

	  exports.proxy(obj)[path[i]] = exports.proxy(value);
	}; //──── optimize on Non-Proxy policy ──────────────────────────────────────────────────────


	if (!proxyEnable) {
	  __getObserver = function __getObserver(target) {
	    var oserver = target[OBSERVER_KEY];
	    if (oserver && oserver.target === target) return oserver;
	  };

	  __loadSubObserver = function __loadSubObserver(observer, prop, target) {
	    return __getObserver(target) || new Observer(target);
	  };

	  exports.source = function source(obj) {
	    return obj;
	  };

	  exports.proxy = exports.source;
	  exports.$eq = eq;
	  exports.$get = get;
	  exports.$set = set;
	}
	/**
	 * get or create observer on object
	 *
	 * @param target 	the target object
	 */


	function observer(target) {
	  return __getObserver(target) || new Observer(target);
	}
	/**
	 * observe changes in the target object
	 *
	 * @param target 	the target object
	 * @param propPath 	property path of object, parse string path by {@link parsePath}
	 * @param cb		callback
	 * @param scope		scope of callback
	 * @return listen-id
	 */

	function observe(target, propPath, cb, scope) {
	  var __observer = observer(target);

	  return __observer.observe(propPath, cb, scope);
	}
	/**
	 * get listen-id of callback in the target object
	 *
	 * @param target 	the target object
	 * @param propPath 	property path of object, parse string path by {@link parsePath}
	 * @param cb		callback
	 * @param scope		scope of callback
	 * @return listen-id
	 */

	function observed(target, propPath, cb, scope) {
	  var __observer = __getObserver(target);

	  return __observer && __observer.observed(propPath, cb, scope);
	}
	/**
	 * has listen-id in the target object
	 *
	 * @param target 	the target object
	 * @param propPath 	property path of object, parse string path by {@link parsePath}
	 * @param id		listen-id
	 */

	function observedId(target, propPath, id) {
	  var __observer = __getObserver(target);

	  return __observer && __observer.observedId(propPath, id);
	}
	/**
	 * cancel observing the changes in the target object
	 *
	 * @param target 	the target object
	 * @param propPath 	property path of object, parse string path by {@link parsePath}
	 * @param cb		callback
	 * @param scope		scope of callback
	 */

	function unobserve(target, propPath, cb, scope) {
	  var __observer = __getObserver(target);

	  __observer && __observer.unobserve(propPath, cb, scope);
	}
	/**
	 * cancel observing the changes in the target object by listen-id
	 *
	 * @param target 	the target object
	 * @param propPath 	property path of object, parse string path by {@link parsePath}
	 * @param listenId	listen-id
	 */

	function unobserveId(target, propPath, listenId) {
	  var __observer = __getObserver(target);

	  __observer && __observer.unobserveId(propPath, listenId);
	}
	var getObserver = __getObserver;

	/**
	 * @module observer
	 * @author Tao Zeng <tao.zeng.zt@qq.com>
	 * @created Fri Mar 01 2019 18:17:27 GMT+0800 (China Standard Time)
	 * @modified Thu Mar 28 2019 19:40:22 GMT+0800 (China Standard Time)
	 */

	/**
	 *
	 * @author Tao Zeng <tao.zeng.zt@qq.com>
	 * @module main
	 * @preferred
	 * @created Wed Nov 21 2018 10:21:20 GMT+0800 (China Standard Time)
	 * @modified Fri Mar 08 2019 15:35:52 GMT+0800 (China Standard Time)
	 */

	exports.isDefaultKey = isDefaultKey;
	exports.addDefaultKey = addDefaultKey;
	exports.addDefaultKeys = addDefaultKeys;
	exports.getDefaultKeys = getDefaultKeys;
	exports.getDefaultKeyMap = getDefaultKeyMap;
	exports.createFn = createFn;
	exports.applyScope = applyScope;
	exports.applyNoScope = applyNoScope;
	exports.applyScopeN = applyScopeN;
	exports.applyNoScopeN = applyNoScopeN;
	exports.apply = apply;
	exports.applyN = applyN;
	exports.fnName = fnName;
	exports.bind = bind;
	exports.eq = eq;
	exports.isNull = isNull;
	exports.isUndef = isUndef;
	exports.isNil = isNil;
	exports.isBool = isBool;
	exports.isNum = isNum;
	exports.isStr = isStr;
	exports.isFn = isFn;
	exports.isInt = isInt;
	exports.isPrimitive = isPrimitive;
	exports.instOf = instOf;
	exports.is = is;
	exports.isBoolean = isBoolean;
	exports.isNumber = isNumber;
	exports.isString = isString;
	exports.isDate = isDate;
	exports.isReg = isReg;
	exports.isArray = isArray;
	exports.isTypedArray = isTypedArray;
	exports.isArrayLike = isArrayLike;
	exports.isObj = isObj;
	exports.isObject = isObject;
	exports.isBlank = isBlank;
	exports.stickyReg = stickyReg;
	exports.unicodeReg = unicodeReg;
	exports.reEscape = reEscape;
	exports.prototypeOf = prototypeOf;
	exports.protoProp = protoProp;
	exports.protoOf = protoOf;
	exports.__setProto = __setProto;
	exports.setProto = setProto;
	exports.propDescriptor = propDescriptor;
	exports.propAccessor = propAccessor;
	exports.defProp = defProp;
	exports.defPropValue = defPropValue;
	exports.hasOwnProp = hasOwnProp;
	exports.getOwnProp = getOwnProp;
	exports.parsePath = parsePath;
	exports.formatPath = formatPath;
	exports.get = get;
	exports.set = set;
	exports.toStr = toStr;
	exports.toStrType = toStrType;
	exports.charCode = charCode;
	exports.char = char;
	exports.cutStr = cutStr;
	exports.cutLStr = cutLStr;
	exports.trim = trim;
	exports.upper = upper;
	exports.lower = lower;
	exports.upperFirst = upperFirst;
	exports.lowerFirst = lowerFirst;
	exports.escapeStr = escapeStr;
	exports.pad = pad;
	exports.shorten = shorten;
	exports.thousandSeparate = thousandSeparate;
	exports.binarySeparate = binarySeparate;
	exports.octalSeparate = octalSeparate;
	exports.hexSeparate = hexSeparate;
	exports.plural = plural;
	exports.singular = singular;
	exports.FORMAT_XPREFIX = FORMAT_XPREFIX;
	exports.FORMAT_PLUS = FORMAT_PLUS;
	exports.FORMAT_ZERO = FORMAT_ZERO;
	exports.FORMAT_SPACE = FORMAT_SPACE;
	exports.FORMAT_SEPARATOR = FORMAT_SEPARATOR;
	exports.FORMAT_LEFT = FORMAT_LEFT;
	exports.extendFormatter = extendFormatter;
	exports.getFormatter = getFormatter;
	exports.vformat = vformat;
	exports.format = format;
	exports.formatter = formatter;
	exports.create = create;
	exports.doAssign = doAssign;
	exports.assign = assign;
	exports.assignIf = assignIf;
	exports.defaultAssignFilter = defaultAssignFilter;
	exports.assignIfFilter = assignIfFilter;
	exports.makeArray = makeArray;
	exports.STOP = STOP;
	exports.eachProps = eachProps;
	exports.eachArray = eachArray;
	exports.eachObj = eachObj;
	exports.each = each;
	exports.SKIP = SKIP;
	exports.mapArray = mapArray;
	exports.mapObj = mapObj;
	exports.map = map;
	exports.idxOfArray = idxOfArray;
	exports.idxOfObj = idxOfObj;
	exports.idxOf = idxOf;
	exports.reduceArray = reduceArray;
	exports.reduceObj = reduceObj;
	exports.reduce = reduce;
	exports.keys = keys;
	exports.values = values;
	exports.arr2obj = arr2obj;
	exports.makeMap = makeMap;
	exports.List = List;
	exports.FnList = FnList;
	exports.nextTick = nextTick;
	exports.clearTick = clearTick;
	exports.clearTickId = clearTickId;
	exports.Source = Source;
	exports.discardMatch = discardMatch;
	exports.appendMatch = appendMatch;
	exports.attachMatch = attachMatch;
	exports.match = match;
	exports.and = and;
	exports.any = any;
	exports.many = many;
	exports.option = option;
	exports.or = or;
	exports.anyOne = anyOne;
	exports.manyOne = manyOne;
	exports.optionOne = optionOne;
	exports.popErrStack = popErrStack;
	exports.assert = assert;
	exports.VBPROXY_KEY = VBPROXY_KEY;
	exports.VBPROXY_CTOR_KEY = VBPROXY_CTOR_KEY;
	exports.OBSERVER_KEY = OBSERVER_KEY;
	exports.ARRAY_CHANGE = ARRAY_CHANGE;
	exports.ARRAY_LENGTH = ARRAY_LENGTH;
	exports.MISS = MISS;
	exports.collect = collect;
	exports.proxyEnable = proxyEnable;
	exports.observer = observer;
	exports.observe = observe;
	exports.observed = observed;
	exports.observedId = observedId;
	exports.unobserve = unobserve;
	exports.unobserveId = unobserveId;
	exports.getObserver = getObserver;

}));
//# sourceMappingURL=argilo.js.map
