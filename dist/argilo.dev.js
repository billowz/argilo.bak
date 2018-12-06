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
 * Date: Thu, 06 Dec 2018 12:10:36 GMT
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define('argilo', ['exports'], factory) :
	(factory((global.argilo = {})));
}(this, (function (exports) {
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
	var TYPE_BOOL = 'boolean';
	var TYPE_FN = 'function';
	var TYPE_NUM = 'number';
	var TYPE_STRING = 'string';
	var TYPE_UNDEF = 'undefined';
	var GLOBAL = typeof window !== TYPE_UNDEF ? window : typeof global !== TYPE_UNDEF ? global : typeof self !== TYPE_UNDEF ? self : {};

	/**
	 * type checker
	 * @module utility
	 * @author Tao Zeng <tao.zeng.zt@qq.com>
	 * @created Mon Dec 11 2017 13:57:32 GMT+0800 (China Standard Time)
	 * @modified Mon Dec 03 2018 17:48:07 GMT+0800 (China Standard Time)
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
	  return function (o) {
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
	  if (o) {
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
	  if (o === undefined || o === null) {
	    return false;
	  }

	  var C = o[CONSTRUCTOR];
	  return C === undefined || C === Object;
	}

	function mkIs(Type) {
	  return function (o) {
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
	 * @modified Fri Nov 23 2018 11:18:33 GMT+0800 (China Standard Time)
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
	  _bind = function (fn, scope) {
	    var args = arguments,
	        argLen = args.length;

	    if (isNil(scope)) {
	      return argLen > 2 ? bindPolyfill(fn, scope, args, 2) : fn;
	    }

	    return applyScopeN(fn.bind, fn, args, 1, argLen - 1);
	  };
	} else {
	  funcProto.bind = function (scope) {
	    return bindPolyfill(this, scope, arguments, 1);
	  };

	  _bind = function (fn, scope) {
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
	    return function () {
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
	    return function () {
	      return applyNoScope(fn, arguments);
	    };
	  }

	  return function () {
	    return applyScope(fn, scope, arguments);
	  };
	}

	/**
	 * regexp utilities
	 * @module utility/reg
	 * @author Tao Zeng <tao.zeng.zt@qq.com>
	 * @created Thu Sep 06 2018 18:27:51 GMT+0800 (China Standard Time)
	 * @modified Tue Nov 27 2018 20:00:44 GMT+0800 (China Standard Time)
	 */
	/**
	 * is support sticky on RegExp
	 */

	var regStickySupport = isBool(/(?:)/.sticky);
	/**
	 * is support unicode on RegExp
	 */

	var regUnicodeSupport = isBool(/(?:)/.unicode);
	var REG_ESCAPE = /[-\/\\^$*+?.()|[\]{}]/g;
	/**
	 * escape string for RegExp
	 */

	function reEscape(str) {
	  return str.replace(REG_ESCAPE, '\\$&');
	}

	/**
	 * prototype utilities
	 * @module utility
	 * @author Tao Zeng <tao.zeng.zt@qq.com>
	 * @created Wed Jul 25 2018 15:23:56 GMT+0800 (China Standard Time)
	 * @modified Tue Nov 27 2018 20:00:18 GMT+0800 (China Standard Time)
	 */
	var __hasOwn = Object[PROTOTYPE].hasOwnProperty;
	var __getProto = Object.getPrototypeOf,
	    ____setProto = Object.setPrototypeOf;
	/**
	 * is support Object.getPrototypeOf and Object.setPrototypeOf
	 */

	var prototypeOfSupport = !!____setProto;
	var protoPropSupport = {
	  __proto__: []
	} instanceof Array;
	/**
	 * Object.getPrototypeOf shim
	 */

	var protoOf = ____setProto ? __getProto : __getProto ? function (obj) {
	  return obj[PROTO] || __getProto(obj);
	} : function (obj) {
	  return (__hasOwn.call(obj, PROTO) ? obj[PROTO] : obj[CONSTRUCTOR][PROTOTYPE]) || null;
	};
	var __setProto = ____setProto || function (obj, proto) {
	  obj[PROTO] = proto;
	  return obj;
	};
	/**
	 * Object.setPrototypeOf shim
	 */

	var setProto = ____setProto || (protoPropSupport ? __setProto : function (obj, proto) {
	  for (var p in proto) {
	    if (__hasOwn.call(proto, p)) {
	      obj[p] = proto[p];
	    }
	  }

	  return __setProto(obj, proto);
	});

	/**
	 * prop utilities
	 * @module utility
	 * @author Tao Zeng <tao.zeng.zt@qq.com>
	 * @created Wed Jul 25 2018 15:22:57 GMT+0800 (China Standard Time)
	 * @modified Tue Nov 27 2018 20:00:13 GMT+0800 (China Standard Time)
	 */
	var __hasOwn$1 = Object[PROTOTYPE].hasOwnProperty;
	/**
	 * has own property
	 */

	var hasOwnProp = protoPropSupport ? function (obj, prop) {
	  return __hasOwn$1.call(obj, prop);
	} : function (obj, prop) {
	  return prop !== PROTO && __hasOwn$1.call(obj, prop);
	};
	/**
	 * get owner property value
	 * @param prop 			property name
	 * @param defaultVal 	default value
	 */

	function getOwnProp(obj, prop, defaultVal) {
	  return hasOwnProp(obj, prop) ? obj[prop] : defaultVal;
	}
	var __defProp = Object.defineProperty;
	/**
	 * is support Object.defineProperty
	 */

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
	  __defProp = function (obj, prop, desc) {
	    if (desc.get || desc.set) {
	      throw new Error('not support getter/setter on defineProperty');
	    }

	    obj[prop] = desc.value;
	    return obj;
	  };
	}
	/**
	 * define property
	 */


	var defProp = __defProp;
	/**
	 * define property by value
	 */

	var defPropValue = defPropSupport ? function (obj, prop, value, configurable, writable, enumerable) {
	  __defProp(obj, prop, {
	    value: value,
	    configurable: configurable || false,
	    writable: writable || false,
	    enumerable: enumerable || false
	  });

	  return value;
	} : function (obj, prop, value) {
	  obj[prop] = value;
	  return value;
	};

	/**
	 * Object.create shim
	 * @module utility/create
	 * @author Tao Zeng <tao.zeng.zt@qq.com>
	 * @created Wed Jul 25 2018 15:24:47 GMT+0800 (China Standard Time)
	 * @modified Tue Nov 27 2018 15:37:23 GMT+0800 (China Standard Time)
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


	var create = Object.create || (Object.getPrototypeOf ? doCreate : function (o, props) {
	  var obj = doCreate(o, props);

	  __setProto(obj, o);

	  return obj;
	});

	/**
	 * @module utility/collection
	 * @author Tao Zeng <tao.zeng.zt@qq.com>
	 * @created Wed Jul 25 2018 17:10:41 GMT+0800 (China Standard Time)
	 * @modified Tue Nov 27 2018 14:17:32 GMT+0800 (China Standard Time)
	 */
	var Control =
	/*#__PURE__*/
	function () {
	  function Control(desc) {
	    this.desc = void 0;
	    this.desc = desc;
	  }

	  var _proto = Control.prototype;

	  _proto.toString = function toString() {
	    return this.desc;
	  };

	  return Control;
	}();

	/**
	 * @module utility/collection
	 * @author Tao Zeng <tao.zeng.zt@qq.com>
	 * @created Wed Jul 25 2018 17:10:41 GMT+0800 (China Standard Time)
	 * @modified Tue Nov 27 2018 13:39:11 GMT+0800 (China Standard Time)
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

	  if (own === false) {
	    for (var k in obj) {
	      if (callback(k, obj) === STOP) return k;
	    }
	  } else {
	    for (k in obj) {
	      if (hasOwnProp(obj, k) && callback(k, obj) === STOP) return k;
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

	  if (own === false) {
	    for (var k in obj) {
	      if (callback(obj[k], k, obj) === STOP) return k;
	    }
	  } else {
	    for (k in obj) {
	      if (hasOwnProp(obj, k) && callback(obj[k], k, obj) === STOP) return k;
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
	 * @modified Tue Nov 27 2018 13:54:35 GMT+0800 (China Standard Time)
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

	function doMapObj(each$$1, obj, callback, scope, own) {
	  if (isBool(scope)) {
	    own = scope;
	  } else {
	    callback = bind(callback, scope);
	  }

	  var copy = create(null);
	  each$$1(obj, function (value, prop, obj) {
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

	function doMapArray(each$$1, array, callback, scope) {
	  callback = bind(callback, scope);
	  var copy = [];
	  var j = 0;
	  each$$1(array, function (data, index, array) {
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
	 * @modified Tue Nov 27 2018 13:38:16 GMT+0800 (China Standard Time)
	 */

	function parseCallback(value, scope) {
	  if (isFn(value)) return bind(value, scope);
	  return function (data) {
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


	function doIdxOfObj(each$$1, obj, value, scope, own) {
	  if (isBool(scope)) {
	    own = scope;
	    scope = null;
	  }

	  var callback = parseCallback(value, scope);
	  var idx = -1;
	  each$$1(obj, function (data, prop, obj) {
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

	function doIdxOfArray(each$$1, array, value, scope) {
	  var callback = parseCallback(value, scope);
	  var idx = -1;
	  each$$1(array, function (data, index, array) {
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
	 * @modified Tue Nov 27 2018 14:02:39 GMT+0800 (China Standard Time)
	 */

	/*                                                                                      *
	 *                                     reduce object                                    *
	 *                                                                                      */
	//========================================================================================

	/**
	 * reduce callback on object
	 * - will stop reduce on return STOP
	 */

	function doReduceObj(each$$1, obj, accumulator, callback, scope, own) {
	  if (isBool(scope)) {
	    own = scope;
	  } else {
	    callback = bind(callback, scope);
	  }

	  each$$1(obj, function (value, prop, obj) {
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

	function doReduceArray(each$$1, array, accumulator, callback, scope) {
	  callback = bind(callback, scope);
	  each$$1(array, function (data, index, array) {
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
	 * @modified Tue Nov 27 2018 13:59:31 GMT+0800 (China Standard Time)
	 */

	/*                                                                                      *
	 *                                         keys                                         *
	 *                                                                                      */
	//========================================================================================

	function defaultObjKeyHandler(prop) {
	  return prop;
	}

	function doObjKeys(each$$1, obj) {
	  var rs = [],
	      args = arguments;
	  var handler = defaultObjKeyHandler,
	      i = 2,
	      j = 0;

	  if (isFn(args[i])) {
	    handler = args[i++];
	    if (!isBool(args[i])) handler = bind(handler, args[i++]);
	  }

	  each$$1(obj, function (prop, obj) {
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

	function defaultObjValueHandler(value) {
	  return value;
	}

	function doObjValues(each$$1, obj) {
	  var rs = [],
	      args = arguments;
	  var handler = defaultObjValueHandler,
	      i = 1,
	      j = 0;

	  if (isFn(args[i])) {
	    handler = args[i++];
	    if (!isBool(args[i])) handler = bind(handler, args[i++]);
	  }

	  each$$1(obj, function (data, prop, obj) {
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
	 * @modified Fri Nov 30 2018 17:42:28 GMT+0800 (China Standard Time)
	 */
	/**
	 * @return STOP or SKIP or [key: string, value: any]
	 */

	function doArr2Obj(each$$1, array, callback, scope) {
	  var obj = create(null);
	  callback = bind(callback, scope);
	  each$$1(array, function (data, index, array) {
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
	 * @modified Tue Dec 04 2018 20:10:32 GMT+0800 (China Standard Time)
	 */
	function makeArray(len, callback) {
	  var array = new Array(len);
	  var i = len;

	  while (i--) {
	    array[i] = callback(i);
	  }

	  return array;
	}

	var pathCache = create(null); // prop | [index | "string prop" | 'string prop']

	var pathReg = /(?:^|\.)([a-zA-Z$_][\w$]*)|\[\s*(?:(\d+)|"((?:[^\\"]|\\.)*)"|'((?:[^\\']|\\.)*)')\s*\]/g;
	function parsePath(path, cacheable) {
	  if (isArray(path)) return path;
	  var array = pathCache[path];

	  if (!array) {
	    array = [];
	    var match,
	        idx = 0,
	        cidx,
	        i = 0;

	    while (match = pathReg.exec(path)) {
	      cidx = pathReg.lastIndex;

	      if (cidx !== idx + match[0].length) {
	        throw new SyntaxError("Invalid Path: \"" + path + "\", unkown character[" + path.charAt(idx) + "] at offset:" + idx);
	      }

	      array[i++] = match[1] || match[2] || match[3] || match[4];
	      idx = cidx;
	    }

	    if (cacheable === false) return array;
	    pathCache[path] = array;
	  }

	  return array.slice();
	}
	function formatPath(path) {
	  return isArray(path) ? mapArray(path, formatPathHandler).join('') : path;
	}

	function formatPathHandler(prop) {
	  return "[\"" + String(prop).replace("'", '\\"') + "\"]";
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

	/**
	 * String utilities
	 * @module utility/string
	 * @author Tao Zeng <tao.zeng.zt@qq.com>
	 * @created Mon Dec 11 2017 13:57:32 GMT+0800 (China Standard Time)
	 * @modified Thu Dec 06 2018 18:45:25 GMT+0800 (China Standard Time)
	 */

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

	var FIRST_LOWER_LETTER_REG = /^[a-z]/;
	/**
	 * upper first char
	 */

	function upperFirst(str) {
	  return str.replace(FIRST_LOWER_LETTER_REG, upperHandler);
	}

	function upperHandler(m) {
	  return m.toUpperCase();
	} //========================================================================================

	/*                                                                                      *
	 *                                  parse string value                                  *
	 *                                                                                      */
	//========================================================================================

	/**
	 * convert any value to string
	 * - undefined | null: ''
	 * - NaN:
	 * - Infinity:
	 * - other: String(value)
	 * TODO support NaN, Infinity
	 */


	function strval(obj) {
	  return isNil(obj) ? '' : String(obj);
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
	function escapeString(str) {
	  return str.replace(STR_ESCAPE, function (str) {
	    return STR_ESCAPE_MAP[str];
	  });
	} //========================================================================================

	/*                                                                                      *
	 *                                          pad                                         *
	 *                                                                                      */
	//========================================================================================

	function pad(str, len, chr, leftAlign) {
	  str = String(str);
	  var l = str.length;
	  if (l >= len) return str;
	  var padding = new Array(len - l + 1).join(chr || ' ');
	  return leftAlign ? str + padding : padding + str;
	} //========================================================================================

	/*                                                                                      *
	 *                                   plural & singular                                  *
	 *                                                                                      */
	//========================================================================================

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
	var singular = replacor([[/([a-zA-Z]+[^aeiou])ies$/, '$1y'], [/([a-zA-Z]+[aeiou])s$/, '$1'], [/([a-zA-Z]+[sxzh])es$/, '$1'], [/([a-zA-Z]+[^sxzhy])s$/, '$1']]); //========================================================================================

	/*                                                                                      *
	 *                                   thousand separate                                  *
	 *                                                                                      */
	//========================================================================================

	var thousandSeparationReg = /(\d)(?=(\d{3})+(?!\d))/g;
	function thousandSeparate(number) {
	  var split = String(number).split('.');
	  split[0] = split[0].replace(thousandSeparationReg, '$1,');
	  return split.join('.');
	}

	/**
	 * @module utility/format
	 * @author Tao Zeng <tao.zeng.zt@qq.com>
	 * @created Mon Dec 03 2018 19:46:41 GMT+0800 (China Standard Time)
	 * @modified Thu Dec 06 2018 20:10:18 GMT+0800 (China Standard Time)
	 */

	/*                                                                                      *
	 *                                      format Rule                                     *
	 *                                                                                      */
	//========================================================================================
	//   0      1      2     3     4       5       6           7         8      9           10             11             12      13
	// [match, expr, index, prop, flags, width, width-idx, width-prop, fill, precision, precision-idx, precision-prop, cut-fill, type]

	var paramIdxR = "(\\d+|\\$|@)",
	    paramPropR = "(?:\\{((?:[a-zA-Z$_][\\w$_]*|\\[(?:\\d+|\"(?:[^\\\\\"]|\\\\.)*\"|'(?:[^\\\\']|\\\\.)*')\\])(?:\\.[a-zA-Z$_][\\w$_]*|\\[(?:\\d+|\"(?:[^\\\\\"]|\\\\.)*\"|'(?:[^\\\\']|\\\\.)*')\\])*)\\})",
	    widthR = "(?:([1-9]\\d*)|&" + paramIdxR + paramPropR + ")",
	    fillR = "(?:=(.))",
	    cutSuffixR = "(?:=\"((?:[^\\\\\"]|\\\\.)*)\")",
	    formatReg = new RegExp("\\\\.|(\\{" + paramIdxR + "?" + paramPropR + "?(?::([#,+\\- 0]*)(?:" + widthR + fillR + "?)?(?:\\." + widthR + cutSuffixR + "?)?)?(?::?([a-zA-Z_][a-zA-Z0-9_$]*))?\\})", 'g'); //========================================================================================

	/*                                                                                      *
	 *                                     format flags                                     *
	 *                                                                                      */
	//========================================================================================

	var FORMAT_XPREFIX = 0x1;
	var FORMAT_PLUS = 0x1;
	var FORMAT_ZERO = 0x2;
	var FORMAT_SPACE = 0x4;
	var FORMAT_THOUSAND = 0x8;
	var FORMAT_LEFT = 0x16; //──── flags parser ──────────────────────────────────────────────────────────────────────

	var FLAG_MAPPING = {
	  '#': FORMAT_XPREFIX,
	  '+': FORMAT_PLUS,
	  '0': FORMAT_ZERO,
	  ' ': FORMAT_SPACE,
	  ',': FORMAT_THOUSAND,
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
	 *                                      Formatters                                      *
	 *                                                                                      */
	//========================================================================================


	var formatters = create(null);
	function extendFormatter(obj) {
	  var fmt, name;

	  for (name in obj) {
	    fmt = obj[name];

	    if (isFn(fmt)) {
	      formatters[name] = {
	        fmt: fmt,
	        get: get
	      };
	    } else if (isFn(fmt.fmt)) {
	      formatters[name] = fmt;
	    }
	  }
	}

	function getFormatter(name) {
	  var f = formatters[name || 's'];
	  if (f) return f;
	  throw new Error("Invalid Formatter: " + name);
	}

	function __doFormat(formatter, val, flags, width, fill, precision, cutSuffix) {
	  var str = formatter.fmt(val, flags, width, precision, cutSuffix);
	  if (width > str.length) str = pad(str, width, fill, flags & FORMAT_LEFT);
	  return str;
	} //========================================================================================

	/*                                                                                      *
	 *                           format by every parameter object                           *
	 *                                                                                      */
	//========================================================================================

	/**
	 * Syntax:
	 * 			'{' (<parameter>)? ('!' <property>)? (':' (<flags>)? (<width>)? ('!' <property>)? ('=' <fill-char>)? ('.' <precision>  ('!' <property>)? )? )? (':'? <data-type>)? '}'
	 * - parameter
	 * 		- parameter index
	 * 			{}						format by next unused argument
	 * 			{<number>}				format by arguments[number]
	 * 			{@}						format by current used argument
	 * 			{$}						format by next unused argument
	 * 		- property
	 * 			{.<path>}				get value on parameter by property path
	 * 									Syntax: '.' (<propName> | '[' (<number> | <string>) ']') ('.' <propName> | '[' (<number> | <string>) ']')*
	 * 									eg. .abc.abc | .["abc"]['abc'] | .abc[0] | .[0].abc
	 * - flags
	 * 		space   prefix non-negative number with a space
	 * 		+       prefix non-negative number with a plus sign
	 * 		-       left-justify within the field
	 * 		,		thousand separation number
	 * 		#       ensure the leading "0" for any octal
	 * 				prefix non-zero hexadecimal with "0x" or "0X"
	 * 				prefix non-zero binary with "0b" or "0B"
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
	 * 			(<width>)? ('=' <fill-char>)? ('.' <precision>)?
	 * 		- min width
	 * 		- precision width
	 * - data-type
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
	 * 			/[^\\{]+|											// escape
	 * 			\\.|												// escape
	 * 			(													// 1: expression
	 * 				\{
	 * 				(\d+|\$|@)?										// 2: parameter index
	 * 				(?:!<property-path> )?							// 3: property path of parameter
	 * 				(?:
	 * 					:
	 * 					([#,+\- ]*)									// 4: flags
	 * 					(?:
	 * 						(?:
	 * 							(\d+)|								// 5: width
	 * 							(?:
	 * 								&
	 * 								(\d+|\$|@)						// 6: parameter index of width
	 * 								(?:!<property-path>)?			// 7: property path of width parameter
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
	 * 								(?:!<property-path>)?			// 11: property path of width parameter
	 * 							)
	 * 						)
	 * 					)?
	 * 				)?
	 * 				(?:
	 * 					:?
	 * 					([a-zA-Z_][a-zA-Z0-9_$]*))?					// 12: data type
	 * 				\}
	 * 			)/
	 */


	function vformat(fmt, args, offset, getParam) {
	  offset = offset || 0;
	  var state = [offset, offset];
	  getParam = getParam || defaultGetParam;
	  return fmt.replace(formatReg, function (s, m, param, paramProp, flags, width, widx, wprop, fill, precision, pidx, pprop, cutSuffix, type) {
	    if (!m) return s.charAt(1);
	    var formatter = getFormatter(type);
	    return __doFormat(formatter, parseParam(param || '$', paramProp, state, args, getParam), parseFlags(flags), parseWidth(width, widx, wprop, state, args, getParam) || 0, fill || ' ', parseWidth(precision, pidx, pprop, state, args, getParam), cutSuffix || '');
	  });
	}

	function parseWidth(width, idx, prop, state, args, getParam) {
	  if (width) return width >> 0;

	  if (idx) {
	    var w = parseParam(idx, prop, state, args, getParam) >> 0;
	    if (isFinite(w)) return w;
	  }
	}

	function parseParam(paramIdx, prop, state, args, getParam) {
	  var param = getParam(args, paramIdx === '$' ? state[0]++ : paramIdx === '@' ? state[0] === state[1] ? state[0] : state[0] - 1 : paramIdx >> 0);
	  if (prop) param = get(param, prop);
	  return param;
	}

	function defaultGetParam(args, idx) {
	  return args[idx];
	} //========================================================================================

	/*                                                                                      *
	 *                                        format                                        *
	 *                                                                                      */
	//========================================================================================


	function getFormatParam(args, idx) {
	  return args[idx + 1];
	}
	/**
	 * @see vformat
	 */


	function format(fmt) {
	  return vformat(fmt, arguments, 0, getFormatParam);
	} //========================================================================================

	/*                                                                                      *
	 *                                       formatter                                      *
	 *                                                                                      */
	//========================================================================================

	var PROP1_VAR = 'p1',
	    PROP2_VAR = 'p2',
	    PROP3_VAR = 'p3',
	    GET_PARAM_VAR = 'getp',
	    GET_PROP_VAR = 'get',
	    STATE_VAR = 'state';

	function createFormatter(m, getParam) {
	  var formatter = getFormatter(m[13]);
	  var p1 = m[3] && parsePath(m[3]),
	      p2 = m[7] && parsePath(m[7]),
	      p3 = m[11] && parsePath(m[11]);
	  return createFn("return function(args, " + STATE_VAR + "){\n\treturn dofmt(fmt,\n\t\t" + getParamCode(m[2] || '$', p1 && PROP1_VAR) + ",\n\t\tg,\n\t\t" + getWidthCode(m[5], m[6], p2 && PROP2_VAR, '0') + ",\n\t\tf,\n\t\t" + getWidthCode(m[9], m[10], p3 && PROP3_VAR, 'void 0') + ",\n\t\tcf);\n}", ['dofmt', 'fmt', 'g', 'f', 'cf', GET_PROP_VAR, GET_PARAM_VAR, PROP1_VAR, PROP2_VAR, PROP3_VAR])(__doFormat, formatter, parseFlags(m[4]), m[8] || ' ', m[12] || '', get, getParam, p1, p2, p3);
	}

	function getWidthCode(width, idx, prop, def) {
	  return width ? width : idx ? getParamCode(idx, prop) : def;
	}

	function getParamCode(idx, prop) {
	  var code = GET_PARAM_VAR + "(args, " + (idx === '$' ? STATE_VAR + "[0]++" : idx === '@' ? STATE_VAR + "[0] === " + STATE_VAR + "[1] ? " + STATE_VAR + "[0] : " + STATE_VAR + "[0] - 1" : idx) + ")";
	  if (prop) return GET_PROP_VAR + "(" + code + ", " + prop + ")";
	  return code;
	}

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
	    lastIdx < mStart && pushStr(fmt.substring(lastIdx, mStart), 0);

	    if (m[1]) {
	      codes[i] = "arr[" + i + "](arguments, " + STATE_VAR + ")";
	      arr[i++] = createFormatter(m, getParam || defaultGetParam);
	    } else {
	      pushStr(m[0].charAt(1), i);
	    }

	    lastIdx = mEnd;
	  }

	  lastIdx < fmt.length && pushStr(fmt.substring(lastIdx), i);
	  return createFn("return function(){var " + STATE_VAR + " = [" + offset + ", " + offset + "]; return " + codes.join(' + ') + "}", ['arr'])(arr);

	  function pushStr(str, append) {
	    if (append && arr[i - 1].length) {
	      arr[i - 1] += str;
	    } else {
	      codes[i] = "arr[" + i + "]";
	      arr[i++] = str;
	    }
	  }
	} //========================================================================================

	/*                                                                                      *
	 *                                  default formatters                                  *
	 *                                                                                      */
	//========================================================================================

	var TOEXPONENTIAL = 'toExponential',
	    TOPRECISION = 'toPrecision',
	    TOFIXED = 'toFixed';

	function floatFormatter(type) {
	  var toStr = type === 'e' || type === 'E' ? function (num, precision) {
	    return num[TOEXPONENTIAL](precision);
	  } : type === 'f' ? function (num, precision) {
	    return precision >= 0 && num[TOFIXED](precision);
	  } : function (num, precision) {
	    return precision && num[TOPRECISION](precision);
	  },
	      upper = charCode(type) < 97;
	  return function (val, flags, width, precision) {
	    var num = parseFloat(val);
	    if (!isFinite(num)) return String(num);
	    var str = toStr(num, precision) || String(num);

	    if (flags & FORMAT_THOUSAND) {
	      var split = str.split('.');
	      split[0] = split[0].replace(thousandSeparationReg, '$1,');
	      str = split.join('.');
	    }

	    str = prefixNum(num, str, flags, width);
	    return upper ? str.toUpperCase() : str;
	  };
	}

	var BaseRadixs = {
	  b: 2,
	  B: 2,
	  o: 8,
	  u: 10,
	  x: 16,
	  X: 16
	};
	var BasePrefixs = ['0b', '0', '0x'];

	function baseFormatter(type) {
	  var base = BaseRadixs[type],
	      xprefix = base != 10 ? BasePrefixs[base >> 3] : '',
	      upper = charCode(type) < 97;
	  return function (val, flags, width) {
	    var num = val >>> 0;
	    if (!isFinite(num)) return String(num);
	    var str = formatNum(num.toString(base), flags & FORMAT_XPREFIX ? xprefix : '', flags, width);
	    return upper ? str.toUpperCase() : str;
	  };
	}

	function cutStr(str, len, suffix) {
	  return len < str.length ? str.substr(0, len - suffix.length) + suffix : str;
	}

	extendFormatter({
	  s: function s(val, flags, width, precision, cutSuffix) {
	    return cutStr(String(val), precision, cutSuffix);
	  },
	  j: function j(val, flags, width, precision, cutSuffix) {
	    return cutStr(JSON.stringify(val), precision, cutSuffix);
	  },
	  c: function c(val) {
	    var num = val >> 0;
	    return num > 0 ? String.fromCharCode(num) : '';
	  },
	  d: function d(val, flags, width) {
	    var num = val >> 0;
	    if (!isFinite(num)) return String(num);
	    var str = String(num);
	    if (flags & FORMAT_THOUSAND) str = str.replace(thousandSeparationReg, '$1,');
	    return prefixNum(num, str, flags, width);
	  },
	  e: floatFormatter('e'),
	  E: floatFormatter('E'),
	  f: floatFormatter('f'),
	  g: floatFormatter('g'),
	  G: floatFormatter('G'),
	  b: baseFormatter('b'),
	  B: baseFormatter('B'),
	  o: baseFormatter('o'),
	  u: baseFormatter('u'),
	  x: baseFormatter('x'),
	  X: baseFormatter('X')
	});

	function prefixNum(num, str, flags, width) {
	  return formatNum(str, num < 0 ? '' : flags & FORMAT_PLUS ? '+' : flags & FORMAT_SPACE ? ' ' : '', flags, width);
	}

	function formatNum(str, prefix, flags, width) {
	  if (flags & FORMAT_ZERO && width > str.length - prefix.length) {
	    str = pad(str, width - prefix.length, '0');
	  }

	  return prefix + str;
	}

	/**
	 * Object.assign shim
	 * @module utility/assign
	 * @author Tao Zeng <tao.zeng.zt@qq.com>
	 * @created Wed Jul 25 2018 15:22:13 GMT+0800 (China Standard Time)
	 * @modified Tue Nov 27 2018 14:03:59 GMT+0800 (China Standard Time)
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

	  var l = endOffset || overrides.length - 1;
	  var i = startOffset || 0,
	      override,
	      prop;

	  for (; i < l; i++) {
	    if (override = overrides[i]) {
	      for (prop in override) {
	        if (filter(prop, target, override)) {
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
	 * Double Linked List
	 * @module utility/List
	 * @author Tao Zeng <tao.zeng.zt@qq.com>
	 * @created Mon Dec 11 2017 14:35:32 GMT+0800 (China Standard Time)
	 * @modified Tue Nov 27 2018 19:56:25 GMT+0800 (China Standard Time)
	 */
	var DEFAULT_BINDING = '__list__'; //type ListNode = [ListElement | void, IListNode | void, IListNode | void, List]

	var List =
	/*#__PURE__*/
	function () {
	  function List(binding) {
	    this.length = 0;
	    this.head = void 0;
	    this.tail = void 0;
	    this.binding = void 0;
	    this.scaning = false;
	    this.lazyRemoves = void 0;
	    this.binding = binding || DEFAULT_BINDING;
	  }

	  var _proto = List.prototype;

	  _proto.has = function has(obj) {
	    var node = obj[this.binding];
	    return node ? node[0] === obj && node[3] === this : false;
	  };

	  _proto.add = function add(obj) {
	    return __insert(this, obj, this.tail);
	  };

	  _proto.addFirst = function addFirst(obj) {
	    return __insert(this, obj);
	  };

	  _proto.insertAfter = function insertAfter(obj, target) {
	    return __insert(this, obj, target && __getNode(this, target));
	  };

	  _proto.insertBefore = function insertBefore(obj, target) {
	    return __insert(this, obj, target && __getNode(this, target)[1]);
	  };

	  _proto.addAll = function addAll(objs) {
	    return __insertAll(this, objs, this.tail);
	  };

	  _proto.addFirstAll = function addFirstAll(objs) {
	    return __insertAll(this, objs);
	  };

	  _proto.insertAfterAll = function insertAfterAll(objs, target) {
	    return __insertAll(this, objs, target && __getNode(this, target));
	  };

	  _proto.insertBeforeAll = function insertBeforeAll(objs, target) {
	    return __insertAll(this, objs, target && __getNode(this, target)[1]);
	  };

	  _proto.prev = function prev(obj) {
	    return __siblingObj(this, obj, 1);
	  };

	  _proto.next = function next(obj) {
	    return __siblingObj(this, obj, 2);
	  };

	  _proto.first = function first() {
	    var node = this.head;
	    return node && node[0];
	  };

	  _proto.last = function last() {
	    var node = this.tail;
	    return node && node[0];
	  };

	  _proto.remove = function remove(obj) {
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
	  };

	  _proto.each = function each(cb, scope) {
	    if (!this.scaning) throw new Error('Recursive calls are not allowed.');

	    if (this.length) {
	      this.scaning = true;
	      cb = bind(cb, scope);
	      var node = this.head;

	      while (node) {
	        if (node[3] === this && cb(node[0]) === false) break;
	        node = node[2];
	      }

	      __doLazyRemove(this);

	      this.scaning = false;
	    }
	  };

	  _proto.toArray = function toArray() {
	    var array = new Array(this.length);
	    var node = this.head,
	        i = 0;

	    while (node) {
	      if (node[3] === this) array[i++] = node[0];
	      node = node[2];
	    }

	    return array;
	  };

	  _proto.clean = function clean() {
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
	  };

	  _proto.clone = function clone(cb, scope) {
	    var newlist = new List(this.binding);

	    if (this.length) {
	      cb = bind(cb, scope);
	      var node = this.head,
	          newtail,
	          newhead,
	          newprev = undefined,
	          i = 0;

	      while (node) {
	        if (node[3] === this && (newtail = cb(node[0]))) {
	          newtail = __initNode(newlist, newtail);
	          if (!newtail[3]) throw new Error('Double add List, Clone Callback should return a new Object');
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
	  };

	  return List;
	}();
	List.binding = DEFAULT_BINDING;

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

	  if (l) {
	    var head = __initNode(list, objs[0]);

	    if (!head[3]) throw new Error('Double add List, Object have added in this List');
	    head[3] = list;
	    var __prev = head,
	        tail = head,
	        i = 1;

	    for (; i < l; i++) {
	      tail = __initNode(list, objs[i]);
	      if (!tail[3]) throw new Error('Double add List, Object have added in this List');
	      tail[3] = list;
	      tail[1] = __prev;
	      __prev[2] = tail;
	      __prev = tail;
	    }

	    return __doInsert(list, head, tail, l, prev);
	  }
	}

	function __initNode(list, obj) {
	  var binding = list.binding;
	  var node = obj[binding];

	  if (node && node[0] === obj) {
	    if (!node[3] || node[3] === list) throw new Error('Double add List, Object is still in other List');
	  } else {
	    node = [obj];
	    defPropValue(obj, binding, node, true, true);
	  }

	  return node;
	}

	function __getNode(list, obj) {
	  var node = obj[list.binding];

	  if (node && node[0] === obj) {
	    if (node[3] === list) throw new Error('Object is not in this List');
	    return node;
	  }

	  throw new Error('Object is not in List');
	}

	function __siblingObj(list, obj, siblingIdx) {
	  var node = __getNode(list, obj);

	  var sibling = node[siblingIdx];

	  if (sibling) {
	    while (!sibling[3]) {
	      sibling = sibling[siblingIdx];
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
	export default function List(binding?: string) {
		this.binding = binding || DEFAULT_BINDING
	}

	defPropValue(List, 'binding', DEFAULT_BINDING)

	inherit(List, {
		length: 0,
		has(obj: ListElement): boolean {
			const node?:ListNode = obj[this.binding]
			return node ? node[0] === obj && node[3] === this : false
		},
		add(obj: ListElement) {
			return __insert(this, obj, this.tail)
		},
		addFirst(obj: ListElement) {
			return __insert(this, obj)
		},
		insertAfter(obj: ListElement, target?:ListElement) {
			return __insert(this, obj, target && __getNode(this, target))
		},
		insertBefore(obj: ListElement, target?:ListElement) {
			return __insert(this, obj, target && __getNode(this, target)[1])
		},
		addAll(objs: ListElement[]) {
			return __insertAll(this, objs, this.tail)
		},
		addFirstAll(objs: ListElement[]) {
			return __insertAll(this, objs)
		},
		insertAfterAll(objs: ListElement[], target?:ListElement) {
			return __insertAll(this, objs, target && __getNode(this, target))
		},
		insertBeforeAll(objs: ListElement[], target?:ListElement) {
			return __insertAll(this, objs, target && __getNode(this, target)[1])
		},
		prev(obj: ListElement): ListElement {
			return __siblingObj(this, obj, 1)
		},
		next(obj: ListElement): ListElement {
			return __siblingObj(this, obj, 2)
		},
		first(): ListElement {
			const node?:ListNode = this.head
			return node && node[0]
		},
		last(): ListElement {
			const node?:ListNode = this.tail
			return node && node[0]
		},
		remove(obj: ListElement) {
			const node = __getNode(this, obj)
			if (this.scaning) {
				const { lazyRemoves } = this
				obj[this.binding] = undefined // unbind list node
				node[3] = undefined
				if (lazyRemoves) {
					lazyRemoves.push(node)
				} else {
					this.lazyRemoves = [node]
				}
			} else {
				__remove(this, node)
			}
			return --this.length
		},
		each(cb, scope?: any) {
			assert(!this.scaning, 'Recursive calls are not allowed.')
			this.scaning = true
			cb = bind(cb, scope)
			let node = this.head
			while (node) {
				if (node[3] === this && cb(node[0]) === false) break
				node = node[2]
			}
			__doLazyRemove(this)
			this.scaning = false
		},
		toArray() {
			const array = new Array(this.length)
			let node = this.head,
				i = 0
			while (node) {
				if (node[3] === this) array[i++] = node[0]
				node = node[2]
			}
			return array
		},
		clean() {
			if (this.length) {
				if (this.scaning) {
					const { binding } = this
					const lazyRemoves = this.lazyRemoves || (this.lazyRemoves = [])
					var node = this.head
					while (node) {
						if (node[3] === this) {
							node[0][binding] = undefined
							lazyRemoves.push(node)
						}
						node = node[2]
					}
					this.length = 0
				} else {
					__clean(this)
				}
			}
		},
		clone(cb, scope) {
			const newlist = new List(this.binding)
			if (this.length) {
				if (scope) cb = cb.bind(scope)
				var node = this.head,
					newtail,
					newhead,
					newprev = undefined,
					i = 0
				while (node) {
					if (node[3] === this && (newtail = cb(node[0]))) {
						newtail = __initNode(newlist, newtail)
						assert(!newtail[3], 'Double add List, Clone Callback should return a new Object')
						newtail[3] = newlist
						if (newprev) {
							newtail[1] = newprev
							newprev[2] = newtail
							newprev = newtail
						} else {
							newprev = newhead = newtail
						}
						i++
					}
					node = node[2]
				}
				i && __doInsert(newlist, newhead, newtail, i)
			}
			return newlist
		}
	})

	function __doInsert(list: List, nodeHead: ListNode, nodeTail: ListNode, len: number, prev?:ListNode) {
		let next
		nodeHead[1] = prev
		if (prev) {
			nodeTail[2] = next = prev[2]
			prev[2] = nodeHead
		} else {
			nodeTail[2] = next = list.head
			list.head = nodeHead
		}
		if (next) next[1] = nodeTail
		else list.tail = nodeTail
		return (list.length += len)
	}

	function __insert(list, obj, prev) {
		const node = __initNode(list, obj)
		if (!node[3]) {
			node[3] = list
			return __doInsert(list, node, node, 1, prev)
		}
	}

	function __insertAll(list, objs, prev) {
		let l = objs.length
		if (!l) return
		const head = __initNode(list, objs[0])
		assert(!head[3], 'Double add List, Object have added in this List')
		head[3] = list
		let __prev = head,
			tail = head,
			i = 1
		for (; i < l; i++) {
			tail = __initNode(list, objs[i])
			assert(!tail[3], 'Double add List, Object have added in this List')
			tail[3] = list
			tail[1] = __prev
			__prev[2] = tail
			__prev = tail
		}
		return __doInsert(list, head, tail, l, prev)
	}

	function __initNode(list: List, obj: ListElement): ListNode {
		const { binding } = list
		let node?:ListNode = obj[binding]
		if (node && node[0] === obj) {
			assert(!node[3] || node[3] === list, 'Double add List, Object is still in other List')
		} else {
			node = defPropValue(obj, binding, [obj], true, true)
		}
		return node
	}

	function __getNode(list: List, obj: ListElement): ListNode {
		const node?:ListNode = obj[list.binding]
		if (node && node[0] === obj) {
			assert(node[3] === list, 'Object is not in this List')
			return node
		}
		assert(0, 'Object is not in List')
	}

	function __siblingObj(list: List, obj: ListElement, siblingIdx: number): ListElement {
		const node: ListNode = __getNode(list, obj)
		let sibling: ListNode = node[siblingIdx]
		if (sibling) {
			while (!sibling[3]) {
				sibling = sibling[siblingIdx]
				if (!sibling) return
			}
			return sibling[0]
		}
	}

	function __remove(list, node) {
		const prev = node[1],
			next = node[2]
		if (prev) {
			prev[2] = next
		} else {
			list.head = next
		}
		if (next) {
			next[1] = prev
		} else {
			list.tail = prev
		}
		node.length = 1
	}

	function __clean(list) {
		let node,
			next = list.head
		while ((node = next)) {
			next = node[2]
			node.length = 1
		}
		list.head = undefined
		list.tail = undefined
		list.length = 0
	}

	function __doLazyRemove(list) {
		const { lazyRemoves } = list
		if (lazyRemoves) {
			var len = lazyRemoves.length
			if (len) {
				if (list.length) {
					while (len--) __remove(list, lazyRemoves[len])
				} else {
					__clean(list)
				}
				lazyRemoves.length = 0
			}
		}
	}
	*/

	/**
	 * Function List
	 * @module utility/List
	 * @author Tao Zeng <tao.zeng.zt@qq.com>
	 * @created Mon Dec 11 2017 14:35:32 GMT+0800 (China Standard Time)
	 * @modified Tue Nov 27 2018 19:56:10 GMT+0800 (China Standard Time)
	 */
	var DEFAULT_FN_BINDING = '__id__';
	var DEFAULT_SCOPE_BINDING = '__id__';
	var FnList =
	/*#__PURE__*/
	function () {
	  function FnList(fnBinding, scopeBinding) {
	    this.nodeMap = void 0;
	    this.list = void 0;
	    this.fnBinding = void 0;
	    this.scopeBinding = void 0;
	    this.nodeMap = create(null);
	    this.list = new List();
	    this.fnBinding = fnBinding || DEFAULT_FN_BINDING;
	    this.scopeBinding = scopeBinding || DEFAULT_SCOPE_BINDING;
	  }

	  var _proto = FnList.prototype;

	  _proto.add = function add(fn, scope, data) {
	    scope = parseScope(scope);
	    var list = this.list,
	        nodeMap = this.nodeMap;
	    var id = nodeId(this, fn, scope);
	    var node = nodeMap[id];

	    if (!node) {
	      node = [id, fn, scope, data];
	      var ret = list.add(node);
	      if (ret) nodeMap[id] = node;
	      return ret;
	    }
	  };

	  _proto.remove = function remove(fn, scope) {
	    var list = this.list,
	        nodeMap = this.nodeMap;
	    var id = nodeId(this, fn, parseScope(scope));
	    var node = nodeMap[id];

	    if (node) {
	      nodeMap[id] = undefined;
	      return list.remove(node);
	    }
	  };

	  _proto.has = function has(fn, scope) {
	    return !!this.nodeMap[nodeId(this, fn, parseScope(scope))];
	  };

	  _proto.size = function size() {
	    return this.list.length;
	  };

	  _proto.clean = function clean() {
	    this.nodeMap = create(null);
	    this.list.clean();
	  };

	  _proto.each = function each(cb, scope) {
	    cb = cb.bind(scope);
	    this.list.each(function (node) {
	      return cb(node[1], node[2], node[3]);
	    });
	  };

	  return FnList;
	}();
	FnList.fnBinding = DEFAULT_FN_BINDING;
	FnList.scopeBinding = DEFAULT_SCOPE_BINDING;
	var DEFAULT_SCOPE_ID = 1;
	var scopeIdGenerator = 1,
	    fnIdGenerator = 0;

	function nodeId(list, fn, scope) {
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
	 * @modified Tue Nov 27 2018 20:00:52 GMT+0800 (China Standard Time)
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
	      textNode = document.createTextNode(counter + '');
	  observer.observe(textNode, {
	    characterData: true
	  });

	  next = function () {
	    textNode.data = counter + '';
	    counter = counter ? 0 : 1;
	  };
	} else {
	  next = function () {
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

	/**
	 * common utilities
	 * @module utility
	 * @preferred
	 * @author Tao Zeng <tao.zeng.zt@qq.com>
	 * @created Wed Nov 21 2018 10:21:41 GMT+0800 (China Standard Time)
	 * @modified Tue Dec 04 2018 20:12:57 GMT+0800 (China Standard Time)
	 */

	/**
	 *
	 * @author Tao Zeng <tao.zeng.zt@qq.com>
	 * @module main
	 * @preferred
	 * @created Wed Nov 21 2018 10:21:20 GMT+0800 (China Standard Time)
	 * @modified Thu Nov 22 2018 09:32:01 GMT+0800 (China Standard Time)
	 */

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
	exports.isBlank = isBlank;
	exports.regStickySupport = regStickySupport;
	exports.regUnicodeSupport = regUnicodeSupport;
	exports.reEscape = reEscape;
	exports.prototypeOfSupport = prototypeOfSupport;
	exports.protoPropSupport = protoPropSupport;
	exports.protoOf = protoOf;
	exports.__setProto = __setProto;
	exports.setProto = setProto;
	exports.hasOwnProp = hasOwnProp;
	exports.getOwnProp = getOwnProp;
	exports.defPropSupport = defPropSupport;
	exports.defProp = defProp;
	exports.defPropValue = defPropValue;
	exports.parsePath = parsePath;
	exports.formatPath = formatPath;
	exports.get = get;
	exports.set = set;
	exports.charCode = charCode;
	exports.char = char;
	exports.trim = trim;
	exports.upperFirst = upperFirst;
	exports.strval = strval;
	exports.escapeString = escapeString;
	exports.pad = pad;
	exports.plural = plural;
	exports.singular = singular;
	exports.thousandSeparationReg = thousandSeparationReg;
	exports.thousandSeparate = thousandSeparate;
	exports.FORMAT_XPREFIX = FORMAT_XPREFIX;
	exports.FORMAT_PLUS = FORMAT_PLUS;
	exports.FORMAT_ZERO = FORMAT_ZERO;
	exports.FORMAT_SPACE = FORMAT_SPACE;
	exports.FORMAT_THOUSAND = FORMAT_THOUSAND;
	exports.FORMAT_LEFT = FORMAT_LEFT;
	exports.extendFormatter = extendFormatter;
	exports.vformat = vformat;
	exports.format = format;
	exports.formatter = formatter;
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
	exports.nextTick = nextTick;
	exports.clearTick = clearTick;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=argilo.dev.js.map
