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
 * Date: Fri, 28 Dec 2018 12:19:13 GMT
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
	var HAS_OWN_PROP = 'hasOwnProperty';
	var TYPE_BOOL = 'boolean';
	var TYPE_FN = 'function';
	var TYPE_NUM = 'number';
	var TYPE_STRING = 'string';
	var TYPE_UNDEF = 'undefined';
	var GLOBAL = typeof window !== TYPE_UNDEF ? window : typeof global !== TYPE_UNDEF ? global : typeof self !== TYPE_UNDEF ? self : {};
	function EMPTY_FN() {}

	/**
	 * @module utility
	 * @author Tao Zeng <tao.zeng.zt@qq.com>
	 * @created Mon Dec 11 2017 13:57:32 GMT+0800 (China Standard Time)
	 * @modified Wed Dec 19 2018 11:11:43 GMT+0800 (China Standard Time)
	 */
	function getConstructor(o) {
	  var C = o[CONSTRUCTOR];
	  return typeof C === TYPE_FN ? C : Object;
	}

	/**
	 * type checker
	 * @module utility
	 * @author Tao Zeng <tao.zeng.zt@qq.com>
	 * @created Mon Dec 11 2017 13:57:32 GMT+0800 (China Standard Time)
	 * @modified Wed Dec 19 2018 11:11:05 GMT+0800 (China Standard Time)
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
	  return o !== undefined && o !== null && getConstructor(o) === Object;
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
	 * @modified Thu Dec 27 2018 16:22:16 GMT+0800 (China Standard Time)
	 */
	/**
	 * whether to support sticky on RegExp
	 */

	var stickyReg = false; //isBool(/(?:)/.sticky)

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

	/**
	 * prototype utilities
	 * @module utility
	 * @author Tao Zeng <tao.zeng.zt@qq.com>
	 * @created Wed Jul 25 2018 15:23:56 GMT+0800 (China Standard Time)
	 * @modified Thu Dec 27 2018 19:23:11 GMT+0800 (China Standard Time)
	 */
	var __hasOwn = Object[PROTOTYPE][HAS_OWN_PROP];
	var __getProto = Object.getPrototypeOf,
	    ____setProto = Object.setPrototypeOf;
	/**
	 * whether to support Object.getPrototypeOf and Object.setPrototypeOf
	 */

	var prototypeOf = !!____setProto;
	var protoProp = {
	  __proto__: []
	} instanceof Array;
	/**
	 * get prototype
	 */

	var protoOf = ____setProto ? __getProto : __getProto ? function (obj) {
	  return obj[PROTO] || __getProto(obj);
	} : function (obj) {
	  return (__hasOwn.call(obj, PROTO) ? obj[PROTO] : obj[CONSTRUCTOR][PROTOTYPE]) || null;
	};
	/**
	 * set prototype
	 * > properties on the prototype are not inherited on older browsers
	 */

	var __setProto = ____setProto || function (obj, proto) {
	  obj[PROTO] = proto;
	  return obj;
	};
	/**
	 * set prototype
	 * > the properties on the prototype will be copied on the older browser
	 */

	var setProto = ____setProto || (protoProp ? __setProto : function (obj, proto) {
	  for (var p in proto) {
	    if (__hasOwn.call(proto, p)) obj[p] = proto[p];
	  }

	  return __setProto(obj, proto);
	});

	/**
	 * prop utilities
	 * @module utility
	 * @author Tao Zeng <tao.zeng.zt@qq.com>
	 * @created Wed Jul 25 2018 15:22:57 GMT+0800 (China Standard Time)
	 * @modified Thu Dec 27 2018 19:23:34 GMT+0800 (China Standard Time)
	 */

	/*                                                                                      *
	 *                                     own property                                     *
	 *                                                                                      */
	//========================================================================================

	var __hasOwn$1 = Object[PROTOTYPE][HAS_OWN_PROP];
	/**
	 * has own property
	 */

	var hasOwnProp = protoProp ? function (obj, prop) {
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
	} //========================================================================================

	/*                                                                                      *
	 *                                    define property                                   *
	 *                                                                                      */
	//========================================================================================

	var _ref = Object[PROTOTYPE],
	    __defineGetter__ = _ref.__defineGetter__,
	    __defineSetter__ = _ref.__defineSetter__;
	var __defProp = Object.defineProperty;
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
	if (!propDescriptor) __defProp = __defineSetter__ ? function (obj, prop, desc) {
	  var get = desc.get,
	      set = desc.set;
	  if ('value' in desc || !(prop in obj)) obj[prop] = desc.value;
	  if (get) __defineGetter__.call(obj, prop, get);
	  if (set) __defineSetter__.call(obj, prop, set);
	  return obj;
	} : function (obj, prop, desc) {
	  if (desc.get || desc.set) throw new TypeError('Invalid property descriptor. Accessor descriptors are not supported.');
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

	var defPropValue = propDescriptor ? function (obj, prop, value, configurable, writable, enumerable) {
	  __defProp(obj, prop, {
	    value: value,
	    enumerable: enumerable !== false,
	    configurable: configurable !== false,
	    writable: writable !== false
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
	 * @modified Fri Dec 28 2018 20:13:58 GMT+0800 (China Standard Time)
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
	 * @modified Fri Dec 21 2018 14:09:49 GMT+0800 (China Standard Time)
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
	 * @modified Fri Dec 21 2018 14:09:44 GMT+0800 (China Standard Time)
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

	/**
	 * @module utility/prop
	 * @author Tao Zeng <tao.zeng.zt@qq.com>
	 * @created Fri Nov 30 2018 14:41:02 GMT+0800 (China Standard Time)
	 * @modified Fri Dec 28 2018 20:05:26 GMT+0800 (China Standard Time)
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
	    if ((obj = obj[path[i]]) === null || obj === undefined) return;
	  }

	  if (obj && ~l) return obj[path[i]];
	}
	function set(obj, path, value) {
	  path = parsePath(path);
	  var l = path.length - 1;
	  var i = 0;

	  for (; i < l; i++) {
	    obj = obj[path[i]] || (obj[path[i]] = {});
	  }

	  ~l && (obj[path[i]] = value);
	}

	/**
	 * String utilities
	 * @module utility/string
	 * @author Tao Zeng <tao.zeng.zt@qq.com>
	 * @created Mon Dec 11 2017 13:57:32 GMT+0800 (China Standard Time)
	 * @modified Sat Dec 22 2018 15:06:34 GMT+0800 (China Standard Time)
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
	}
	function cutStr(str, start, end) {
	  return str.substring(start, end);
	}
	function cutStrLen(str, start, len) {
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

	var FIRST_LOWER_LETTER_REG = /^[a-z]/;
	/**
	 * upper first char
	 */

	function upperFirst(str) {
	  return str.replace(FIRST_LOWER_LETTER_REG, upper);
	}
	function upper(m) {
	  return m.toUpperCase();
	}
	function lower(m) {
	  return m.toLowerCase();
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
	function escapeStr(str) {
	  return str.replace(STR_ESCAPE, function (str) {
	    return STR_ESCAPE_MAP[str];
	  });
	}

	/**
	 * @module utility/format
	 * @author Tao Zeng <tao.zeng.zt@qq.com>
	 * @created Mon Dec 03 2018 19:46:41 GMT+0800 (China Standard Time)
	 * @modified Sat Dec 22 2018 15:08:24 GMT+0800 (China Standard Time)
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
	  var padding = new Array(len - str.length + 1).join(chr || ' ');
	  return leftAlign ? str + padding : padding + str;
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
	 *
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

	    while (i--) {
	      path[i] = "\"" + escapeStr(path[i]) + "\"";
	    }

	    return GET_PROP_VAR + "(" + code + ", [" + path.join(', ') + "])";
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
	      __toStr = function (num) {
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
	      __toStr = function (num, flags, precision) {
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
	  s: strFormatter(toStr),
	  j: strFormatter(function (v) {
	    return v === undefined || isFn(v) || v.toJSON && v.toJSON() === undefined ? toStr(v) : JSON.stringify(v);
	  }),
	  c: function c(val) {
	    var num = val >> 0;
	    return num > 0 ? String.fromCharCode(num) : '';
	  },
	  d: numFormatter(function (val) {
	    return val >> 0;
	  }, decimalPrefix, toStr, thousandSeparate),
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

	function toStr(v) {
	  return String(v);
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

	var REG_PROPS = ['source', 'global', 'ignoreCase', 'multiline'];
	function deepEq(actual, expected) {
	  if (eq(actual, expected)) return true;

	  if (actual && expected && getConstructor(actual) === getConstructor(expected)) {
	    if (isPrimitive(actual)) return String(actual) === String(expected);
	    if (isDate(actual)) return actual.getTime() === expected.getTime();
	    if (isReg(actual)) return eqProps(actual, expected, REG_PROPS);
	    if (isArray(actual)) return eqArray(actual, expected, deepEq);
	    if (isTypedArray(actual)) return eqArray(actual, expected, eq);
	    return eqObj(actual, expected);
	  }

	  return false;
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

	function eqArray(actual, expected, eq$$1) {
	  var i = actual.length;

	  if (i !== expected.length) {
	    return false;
	  }

	  while (i--) {
	    if (!eq$$1(actual[i], expected[i])) {
	      return false;
	    }
	  }

	  return true;
	}

	function eqObj(actual, expected) {
	  var cache = create(null);

	  for (var k in actual) {
	    if (notEqObjKey(actual, expected, k)) {
	      return false;
	    }

	    cache[k] = true;
	  }

	  for (k in expected) {
	    if (!cache[k] && notEqObjKey(actual, expected, k)) {
	      return false;
	    }
	  }

	  return true;
	}

	function notEqObjKey(actual, expected, k) {
	  return hasOwnProp(actual, k) ? !hasOwnProp(expected, k) || !deepEq(actual[k], expected[k]) : hasOwnProp(expected, k);
	}

	/**
	 * @module utility/assert
	 * @author Tao Zeng <tao.zeng.zt@qq.com>
	 * @created Wed Nov 28 2018 11:01:45 GMT+0800 (China Standard Time)
	 * @modified Fri Dec 21 2018 14:17:26 GMT+0800 (China Standard Time)
	 */
	var formatters$1 = [],
	    formatArgHandlers = [];

	function parseMessage(msg, args, msgIdx) {
	  var fs = formatters$1[msgIdx];

	  if (!fs) {
	    formatArgHandlers[msgIdx] = function (args, offset) {
	      return args[0][offset >= msgIdx ? offset + 1 : offset];
	    };

	    formatters$1[msgIdx] = fs = create(null);
	  }

	  return (fs[msg] || (fs[msg] = formatter(msg, msgIdx, formatArgHandlers[msgIdx])))(args);
	}

	var assert = function (msg) {
	  throw new Error(parseMessage(msg || 'Error', arguments, 0));
	};

	function catchErr(fn) {
	  try {
	    fn();
	  } catch (e) {
	    return e;
	  }
	}

	function checkErr(expect, err) {
	  var msg = isStr(expect) ? expect : expect.message;
	  return msg === err.message;
	}

	var ERROR = new Error();
	var throwMsg = mkMsg(objFormatter(1), 'throw');

	assert["throw"] = function (fn, expect, msg) {
	  var err = catchErr(fn);

	  if (!err || expect && !checkErr(expect, err)) {
	    arguments[0] = err;
	    !expect && (arguments[2] = ERROR);
	    throw new Error(parseMessage(msg || throwMsg[0], arguments, 2));
	  }

	  return assert;
	};

	assert.notThrow = function (fn, expect, msg) {
	  var err = catchErr(fn);

	  if (err && (!expect || !checkErr(expect, err))) {
	    arguments[0] = err;
	    !expect && (arguments[2] = ERROR);
	    throw new Error(parseMessage(msg || throwMsg[0], arguments, 2));
	  }

	  return assert;
	};

	function extendAssert(name, condition, args, dmsg, Err) {
	  var params = isStr(args) ? args.split(/,/g) : isNum(args) ? makeArray(args, function (i) {
	    return "arg" + (i + 1);
	  }) : args,
	      paramStr = params.join(', '),
	      cond = isArray(condition) ? condition[0] : condition,
	      expr = (isArray(condition) ? condition[1] : '') + (isStr(cond) ? "(" + cond + ")" : "cond(" + paramStr + ")");
	  return assert[name] = createFn("return function assert" + upperFirst(name) + "(" + paramStr + ", msg){\n\tif (" + expr + ")\n\t\tthrow new Err(parseMsg(msg || dmsg, arguments, " + params.length + "));\n\treturn assert;\n}", ['Err', 'parseMsg', 'dmsg', 'cond', 'assert'])(Err || Error, parseMessage, dmsg, cond, assert);
	} // [condition, argcount?, [msg, not msg], Error]


	function extendAsserts(apis) {
	  eachObj(apis, function (desc, name) {
	    var condition = desc[0],
	        args = desc[1],
	        msg = desc[2],
	        Err = desc[3] || TypeError;
	    msg[0] && extendAssert(name, [condition, '!'], args, msg[0], Err);
	    msg[1] && extendAssert('not' + upperFirst(name), condition, args, msg[1], Err);
	  });
	}

	var NULL = 'null';
	var UNDEFINED = 'undefined';
	var BOOLEAN = 'boolean';
	var NUMBER = 'number';
	var INTEGER = 'integer';
	var STRING = 'string';
	var FUNCTION = 'function';
	var ARRAY = 'Array';
	var TYPED_ARRAY = 'TypedArray';
	extendAssert('is', '!o', 'o', expectMsg('Exist'));
	extendAssert('not', 'o', 'o', expectMsg('Not Exist'));
	extendAsserts({
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
	 * @modified Thu Dec 27 2018 14:00:33 GMT+0800 (China Standard Time)
	 */
	var DEFAULT_BINDING = '__list__'; //type ListNode = [ListElement, IListNode, IListNode, List]

	var List =
	/*#__PURE__*/
	function () {
	  function List(binding) {
	    this.length = 0;
	    this.scaning = false;
	    this.binding = binding || DEFAULT_BINDING;
	  }

	  var _proto = List.prototype;

	  _proto.size = function size() {
	    return this.length;
	  };

	  _proto.has = function has(obj) {
	    var node = obj[this.binding];
	    return node ? node[0] === obj && node[3] === this : false;
	  };

	  _proto.add = function add(obj) {
	    return this.__insert(obj, this.tail);
	  };

	  _proto.addFirst = function addFirst(obj) {
	    return this.__insert(obj);
	  };

	  _proto.insertAfter = function insertAfter(obj, target) {
	    return this.__insert(obj, target && this.__getNode(target));
	  };

	  _proto.insertBefore = function insertBefore(obj, target) {
	    return this.__insert(obj, target && this.__getNode(target)[1]);
	  };

	  _proto.addAll = function addAll(objs) {
	    return this.__insertAll(objs, this.tail);
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
	    var node = this.head;
	    return node && node[0];
	  };

	  _proto.last = function last() {
	    var node = this.tail;
	    return node && node[0];
	  };

	  _proto.each = function each(cb, scope) {
	    if (this.length) {
	      assert.not(this.scaning, 'Recursive calls are not allowed.');
	      this.scaning = true;
	      cb = bind(cb, scope);
	      var node = this.head;

	      while (node) {
	        if (node[3] === this && cb(node[0]) === false) break;
	        node = node[2];
	      }

	      this.__doLazyRemove();

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

	  _proto.remove = function remove(obj) {
	    return this.__remove(this.__getNode(obj));
	  };

	  _proto.pop = function pop() {};

	  _proto.clean = function clean() {
	    if (this.length) {
	      if (this.scaning) {
	        var node = this.head;

	        while (node) {
	          node[3] === this && this.__lazyRemove(node);
	          node = node[2];
	        }

	        this.length = 0;
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
	    } else {
	      node = [obj];
	      node.toJSON = EMPTY_FN;
	      defPropValue(obj, binding, node, false);
	    }

	    node[3] = this;
	    return node;
	  };

	  _proto.__getNode = function __getNode(obj) {
	    var node = obj[this.binding];
	    assert.is(node && node[3] === this, 'Object is not in this List');
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
	      nodeTail[2] = next = this.head;
	      this.head = nodeHead;
	    }

	    if (next) next[1] = nodeTail;else this.tail = nodeTail;
	    return this.length += len;
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
	    this.scaning ? this.__lazyRemove(node) : this.__doRemove(node);
	    return --this.length;
	  };

	  _proto.__lazyRemove = function __lazyRemove(node) {
	    var lazyRemoves = this.lazyRemoves;
	    node[0][this.binding] = undefined; // unbind this node

	    node[3] = null;

	    if (lazyRemoves) {
	      lazyRemoves.push(node);
	    } else {
	      this.lazyRemoves = [node];
	    }
	  };

	  _proto.__doLazyRemove = function __doLazyRemove() {
	    var lazyRemoves = this.lazyRemoves;

	    if (lazyRemoves) {
	      var len = lazyRemoves.length;

	      if (len) {
	        if (this.length) {
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
	      this.head = next;
	    }

	    if (next) {
	      next[1] = prev;
	    } else {
	      this.tail = prev;
	    }

	    node[1] = node[2] = node[3] = null;
	  };

	  _proto.__clean = function __clean() {
	    var node,
	        next = this.head;

	    while (node = next) {
	      next = node[2];
	      node.length = 1;
	    }

	    this.head = undefined;
	    this.tail = undefined;
	    this.length = 0;
	  };

	  return List;
	}();
	List.binding = DEFAULT_BINDING;

	/**
	 * Function List
	 * @module utility/List
	 * @author Tao Zeng <tao.zeng.zt@qq.com>
	 * @created Mon Dec 11 2017 14:35:32 GMT+0800 (China Standard Time)
	 * @modified Thu Dec 27 2018 14:00:58 GMT+0800 (China Standard Time)
	 */
	var DEFAULT_FN_BINDING = '__flist_id__';
	var DEFAULT_SCOPE_BINDING = '__flist_id__';
	var FnList =
	/*#__PURE__*/
	function () {
	  function FnList(fnBinding, scopeBinding) {
	    this.nodeMap = create(null);
	    this.list = new List();
	    this.fnBinding = fnBinding || DEFAULT_FN_BINDING;
	    this.scopeBinding = scopeBinding || DEFAULT_SCOPE_BINDING;
	  }

	  var _proto = FnList.prototype;

	  _proto.add = function add(fn, scope) {
	    scope = parseScope(scope);
	    var list = this.list,
	        nodeMap = this.nodeMap;
	    var id = nodeId(this, fn, scope);
	    var node = nodeMap[id];

	    if (!node) {
	      node = [id, fn, scope];
	      var ret = list.add(node);
	      if (ret) nodeMap[id] = node;
	      return ret;
	    }

	    return -1;
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

	    return -1;
	  };

	  _proto.has = function has(fn, scope) {
	    return !!this.nodeMap[nodeId(this, fn, parseScope(scope))];
	  };

	  _proto.size = function size() {
	    return this.list.size();
	  };

	  _proto.clean = function clean() {
	    this.nodeMap = create(null);
	    this.list.clean();
	  };

	  _proto.each = function each(cb, scope) {
	    cb = cb.bind(scope);
	    this.list.each(function (node) {
	      return cb(node[1], node[2]);
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
	  if (!fnId) fnId = defPropValue(fn, fnBinding, ++fnIdGenerator, false, false, false);
	  if (!scopeId) scopeId = defPropValue(scope, scopeBinding, ++scopeIdGenerator, false, false, false);
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
	 * @modified Mon Dec 10 2018 16:59:56 GMT+0800 (China Standard Time)
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

	if (isFn(MutationObserver)) {
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

	function sourceStr(m) {
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
	function genCharCodes(start, end, ignoreCase) {
	  var s = isNum(start) ? start : charCode(start),
	      e = isNum(end) ? end : charCode(end),
	      codes = new Array(e - s),
	      i = 0;

	  if (ignoreCase) {
	    var c;

	    for (; s <= e; s++) {
	      codes[i++] = s;
	      c = getAnotherCode(s);
	      codes[i++] = c;
	    }
	  } else {
	    for (; s <= e; s++) {
	      codes[i++] = s;
	    }
	  }

	  return codes;
	}
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
	 * @modified Fri Dec 21 2018 10:24:24 GMT+0800 (China Standard Time)
	 */
	function mixin(behaviour) {
	  return function (Class) {
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
	  };
	  /**
	   * match fail
	   * @param msg 			error message
	   * @param context 		match context
	   * @param capturable 	is capturable error
	   * @param src 			source error
	   * @return Error|void: may ignore Error in the error callback
	   */


	  _proto2.error = function error(msg, context, src, capturable) {
	    var err = this.mkErr(msg, context, capturable, src);
	    var userErr = this.onErr(err, context, this);
	    if (userErr) return userErr.$ruleErr ? userErr : (err[0] = String(userErr), err);
	  };
	  /**
	   * match success
	   * > attach the matched result by match callback
	   * @param data 		matched data
	   * @param len  		matched data length
	   * @param context 	match context
	   * @return Error|void: may return Error in the match callback
	   */


	  _proto2.matched = function matched(data, len, context) {
	    var err = this.onMatch(data, len, context, this);
	    if (err) return err.$ruleErr ? err : this.mkErr(String(err), context, false);
	  };

	  _proto2.enter = function enter(context) {
	    return context.create();
	  };
	  /**
	   * match
	   * @param context match context
	   */


	  _proto2.match = function match() {
	    return assert();
	  };
	  /**
	   * get start char codes
	   */


	  _proto2.getStart = function getStart() {
	    return this.startCodes;
	  };
	  /**
	   * prepare test before match
	   */


	  _proto2.test = function test() {
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
	  }; //──── for debug ─────────────────────────────────────────────────────────────────────────

	  /**
	   * make rule expression
	   * @param expr expression text
	   */


	  _proto2.mkExpr = function mkExpr(expr) {
	    return "<" + this.type + ": " + expr + ">";
	  };
	  /**
	   * set rule expression
	   * 		1. make rule expression
	   * 		2. make Expect text
	   */


	  _proto2.setExpr = function setExpr(expr) {
	    this.expr = this.mkExpr(expr);
	    this.EXPECT = "Expect: " + expr;
	  };

	  _proto2.getExpr = function getExpr() {
	    return this.name || this.expr;
	  };
	  /**
	   * toString by name or expression
	   */


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
	    var _this = _Rule.call(this, name, options) || this;

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
	    var _this = _MatchRule.call(this, name, allows, ignoreCase, options) || this; // generate expression for debug


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
	    var // use exec mode when need pick match group data
	    pattern = regexp.source,
	        ignoreCase = regexp.ignoreCase; // always wrapping in a none capturing group preceded by '^' to make sure
	    // matching can only work on start of input. duplicate/redundant start of
	    // input markers have no meaning (/^^^^A/ === /^A/)
	    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/sticky
	    // When the y flag is used with a pattern, ^ always matches only at the
	    // beginning of the input, or (if multiline is true) at the beginning of a
	    // line.

	    regexp = new RegExp("^(?:" + pattern + ")", (ignoreCase ? 'i' : '') + (regexp.multiline ? 'm' : '') + (''));
	    _this = _MatchRule.call(this, name, start, ignoreCase, options) || this;
	    _this.regexp = regexp;
	    _this.pick = pick;
	    _this.match = _this.execMatch;
	    _this.picker = mkPicker(pick);

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
	  };
	  /**
	   * match on exec mode
	   */


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
	    var _this = _RegMatchRule.call(this, name, new RegExp(reEscape(str), ignoreCase ? 'i' : ''), 0, charCode(str), options) || this;

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
	  };
	  /**
	   * create sub Context
	   */


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
	  };
	  /**
	   * commit context state to parent context
	   */


	  _proto.commit = function commit() {
	    var advanced = this.__advanced;
	    this.parent.advance(advanced);
	    this.__orgOffset += advanced;
	    this.__advanced = 0;
	    this.data = null;
	  };
	  /**
	   * marge context state
	   */


	  _proto.margeState = function margeState(context) {
	    this.__setAdvanced(context.__orgOffset + context.__advanced - this.__orgOffset);
	  };
	  /**
	   * rollback state and result
	   * @param checkpoint 	rollback to checkpoint
	   */


	  _proto.rollback = function rollback(checkpoint) {
	    var advanced = 0,
	        resultLen = 0;
	    checkpoint && (advanced = checkpoint[0], resultLen = checkpoint[1]);

	    this.__setAdvanced(advanced);

	    var result = this.result;
	    if (result.length > resultLen) result.length = resultLen;
	  };
	  /**
	   * get a check point
	   */


	  _proto.checkpoint = function checkpoint() {
	    return [this.__advanced, this.result.length];
	  };
	  /**
	   * advance buffer position
	   */


	  _proto.advance = function advance(i) {
	    this.__offset += i;
	    this.__advanced += i;

	    this.__flushCode();
	  };
	  /**
	   * advanced buff length
	   */


	  _proto.advanced = function advanced() {
	    return this.__advanced;
	  };
	  /**
	   * get buffer
	   * @param reset reset buffer string from 0
	   */


	  _proto.buff = function (reset) {
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
	  };
	  /**
	   * get next char code
	   * @return number char code number
	   */


	  _proto.nextCode = function nextCode() {
	    return this.__code;
	  };

	  _proto.nextChar = function nextChar() {
	    return char(this.__code);
	  }; //──── result opeartions ───────────────────────────────────────────────────────────────────

	  /**
	   * append result
	   */


	  _proto.add = function add(data) {
	    var result = this.result;
	    result[result.length] = data;
	  };
	  /**
	   * append resultset
	   */


	  _proto.addAll = function addAll(data) {
	    var result = this.result;
	    var len = result.length;
	    var i = data.length;

	    while (i--) {
	      result[len + i] = data[i];
	    }
	  };
	  /**
	   * get result size
	   */


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
	    var _this = _Rule.call(this, name, options) || this;

	    var rMin = repeat[0],
	        rMax = repeat[1];
	    rMin < 0 && (rMin = 0);
	    rMax <= 0 && (rMax = MAX);
	    assert.notGreater(rMin, rMax);
	    _this.rMin = rMin;
	    _this.rMax = rMax;
	    _this.builder = builder;

	    if (rMin !== rMax || rMin !== 1) {
	      _this.match = _this.repeatMatch; // for debug

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

	  _proto.__init = function __init() {};

	  _proto.repeatMatch = function repeatMatch() {
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
	  }; // for debug


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

	  _proto.repeatMatch = function repeatMatch(context) {
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

	  _proto.repeatMatch = function repeatMatch(context) {
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
	 * @modified Sat Dec 22 2018 15:45:10 GMT+0800 (China Standard Time)
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

	var VOID_ELEM = makeMap('input,br,hr', 1),
	    CONTENT_ELEM = makeMap('script,style,textarea', 1);
	var UNDEFINED$1 = match('undefined', attachMatch(undefined)),
	    NULL$1 = match('null', attachMatch(null)),
	    BOOLEAN$1 = match('boolean', /true|false/, 'tf', attachMatch(function (b) {
	  return b === 'true';
	})),
	    NUMBER$1 = match('number', /[+-]?(?:0x[\da-f]+|0X[\dA-F]+|0[oO][0-7]+|0[bB][01]+|(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)/, '+-0123456789', attachMatch(function (n) {
	  return +n;
	})),
	    NAN = match('NaN', attachMatch(function () {
	  return NaN;
	})),
	    STRING$1 = match('string', /"((?:[^\\"]|\\.)*)"|'((?:[^\\']|\\.)*)'/, -2, "'\"");
	var ATTR_NAME = match('attr-name', /([@:$_a-zA-Z][\w-\.]*)\s*/, 1, ['@', ':', '$', '_'].concat(genCharCodes('a', 'z', true))),
	    // prettier-ignore
	ATTR_VALUE = or('attr-value', [UNDEFINED$1, BOOLEAN$1, NUMBER$1, NAN, STRING$1], appendMatch),
	    // prettier-ignore
	ATTRS = any('attrs', [ATTR_NAME, option([['attr-op', /=\s*/, '='], ATTR_VALUE, /\s*/])], function (data, l, ctx) {
	  var attrs = {};

	  for (var i = 0, _l = data.length; i < _l; i += 2) {
	    attrs[data[i]] = data[i + 1][0];
	  }

	  ctx.add(attrs);
	});
	var ELEM_NAME = match('elem-open', /<([_a-zA-Z][\w-]*)\s*/, 1, '<'),
	    ELEM = and('elem', function () {
	  return [ELEM_NAME, ATTRS, or([['elem-slash-close', /\/>\s*/, '/'], match('elem-close', />\s*/, false, '>', function (d, l, ctx) {
	    var parent = ctx.parent,
	        tag = ctx.data = parent.result[0],
	        rule = CONTENT_ELEM[tag] ? ELEM_CONTENT : ELEM_CHILDREN,
	        err = rule.match(ctx);
	    var target = err.target,
	        context = err.context;
	    if (target.msg) return err;
	    ctx.margeState(context);
	    ctx.add(context.result);
	  })])];
	}, function (d, l, ctx) {
	  var tag = d[0],
	      children = d[2][0],
	      elem = {
	    tag: tag,
	    attrs: d[1]
	  };
	  ctx.add(elem);
	  VOID_ELEM[tag] ? ctx.addAll(children) : CONTENT_ELEM[tag] ? elem.content = children[0] || '' : children.length && (elem.children = children);
	});
	var ELEM_CHILDREN = elemBody('elem-children', [ELEM], function (m, l, ctx, rule) {
	  var tag = ctx.data;
	  return rule.mkErr(tag === m[1] ? VOID_ELEM[tag] && ctx.resultSize() ? "<" + tag + "> have no children" : null : VOID_ELEM[tag] ? (ctx.advance(-l), null) : "expect: </" + tag + ">", ctx, false);
	}),
	    ELEM_CONTENT = elemBody('elem-content', [], function (m, l, ctx, rule) {
	  if (ctx.data === m[1]) return rule.mkErr(null, ctx, false);
	  attachText(m[0], l, ctx);
	});

	function elemBody(name, rules, onEnd) {
	  return anyOne(name, rules.concat([match('elem-end', /<\/([_a-zA-Z][\w-]*)>\s*/, true, '<', onEnd), match('text', /.[^<]*/, 0, false, attachText, function (err, ctx) {
	    return "expect: </" + ctx.data + ">";
	  })]), appendMatch);
	} // prettier-ignore


	var html = and('html', [/\s*/, many('elems', [or([ELEM, match('text', /.[^<]*/, attachText)])], appendMatch), ['EOF', /\s*$/]], function (data, len, ctx) {
	  ctx.addAll(data[0]);
	}).init();

	function attachText(text, length, ctx) {
	  var data = ctx.result,
	      len = data.length;
	  var prev;

	  if (len && (prev = data[len - 1]) && prev.text) {
	    prev.text += text;
	  } else {
	    ctx.add({
	      text: text
	    });
	  }
	}

	/**
	 * utility utilities
	 * @module utility
	 * @preferred
	 * @author Tao Zeng <tao.zeng.zt@qq.com>
	 * @created Wed Nov 21 2018 10:21:41 GMT+0800 (China Standard Time)
	 * @modified Fri Dec 21 2018 20:35:04 GMT+0800 (China Standard Time)
	 */

	/**
	 *
	 * @author Tao Zeng <tao.zeng.zt@qq.com>
	 * @module main
	 * @preferred
	 * @created Wed Nov 21 2018 10:21:20 GMT+0800 (China Standard Time)
	 * @modified Fri Dec 21 2018 14:08:39 GMT+0800 (China Standard Time)
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
	exports.stickyReg = stickyReg;
	exports.unicodeReg = unicodeReg;
	exports.reEscape = reEscape;
	exports.prototypeOf = prototypeOf;
	exports.protoProp = protoProp;
	exports.protoOf = protoOf;
	exports.__setProto = __setProto;
	exports.setProto = setProto;
	exports.hasOwnProp = hasOwnProp;
	exports.getOwnProp = getOwnProp;
	exports.propDescriptor = propDescriptor;
	exports.propAccessor = propAccessor;
	exports.defProp = defProp;
	exports.defPropValue = defPropValue;
	exports.parsePath = parsePath;
	exports.formatPath = formatPath;
	exports.get = get;
	exports.set = set;
	exports.charCode = charCode;
	exports.char = char;
	exports.cutStr = cutStr;
	exports.cutStrLen = cutStrLen;
	exports.trim = trim;
	exports.upperFirst = upperFirst;
	exports.upper = upper;
	exports.lower = lower;
	exports.strval = strval;
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
	exports.html = html;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
