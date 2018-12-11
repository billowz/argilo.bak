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
 * Date: Tue, 11 Dec 2018 12:13:30 GMT
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 *
 * @author Tao Zeng (tao.zeng.zt@qq.com)
 * @module utility
 * @created 2018-11-09 15:23:35
 * @modified 2018-11-09 15:23:35 by Tao Zeng (tao.zeng.zt@qq.com)
 */
const CONSTRUCTOR = 'constructor';
const PROTOTYPE = 'prototype';
const PROTO = '__proto__';
const TYPE_BOOL = 'boolean';
const TYPE_FN = 'function';
const TYPE_NUM = 'number';
const TYPE_STRING = 'string';
const TYPE_UNDEF = 'undefined';
const GLOBAL = typeof window !== TYPE_UNDEF ? window : typeof global !== TYPE_UNDEF ? global : typeof self !== TYPE_UNDEF ? self : {};

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

const isBool = mkIsPrimitive(TYPE_BOOL);
/**
 * is a number
 */

const isNum = mkIsPrimitive(TYPE_NUM);
/**
 * is a string
 */

const isStr = mkIsPrimitive(TYPE_STRING);
/**
 * is a function
 */

const isFn = mkIsPrimitive(TYPE_FN);
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
    const C = o[CONSTRUCTOR] || Object;

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

const isBoolean = mkIs(Boolean);
/**
 * is number or Number
 */

const isNumber = mkIs(Number);
/**
 * is string or String
 */

const isString = mkIs(String);
/**
 * is Date
 */

const isDate = mkIs(Date);
/**
 * is RegExp
 */

const isReg = mkIs(RegExp);
/**
 * is Array
 */

const isArray = Array.isArray || mkIs(Array);
/**
 * is Typed Array
 */

const isTypedArray = isFn(ArrayBuffer) ? ArrayBuffer.isView : () => false;
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

    const len = o.length;
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

  const C = o[CONSTRUCTOR];
  return C === undefined || C === Object;
}

function mkIs(Type) {
  return function (o) {
    return o !== undefined && o !== null && o[CONSTRUCTOR] === Type;
  };
}

const blankStrReg = /^\s*$/;
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
  return name ? Function(`return function ${name}(${args ? args.join(', ') : ''}){${body}}`)() : applyScope(Function, Function, args && args.length ? args.concat(body) : [body]);
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
  const args = new Array(maxArgs + 1);
  const cases = new Array(maxArgs + 1);

  for (let i = 0; i <= maxArgs; i++) {
    args[i] = `${i || scope ? ', ' : ''}args[${offset ? `offset${i ? ' + ' + i : ''}` : i}]`;
    cases[i] = `case ${i}: return fn${scope && '.call'}(${scope}${args.slice(0, i).join('')});`;
  }

  return Function(`return function(fn, ${scope && scope + ', '}args${offset && ', offset, len'}){
switch(${offset ? 'len' : 'args.length'}){
${cases.join('\n')}
}
${offset && `var arr = new Array(len);
for(var i=0; i<len; i++) arr[i] = arr[offset + i];`}
return fn.apply(${scope || 'null'}, ${offset ? 'arr' : 'args'});
}`)();
}
/**
 * apply function with scope
 * @param fn	target function
 * @param scope	scope of function
 * @param args	arguments of function
 */


const applyScope = applyBuilder(8, 1, 0);
/**
 * apply function without scope
 * @param fn		target function
 * @param args	arguments of function
 */

const applyNoScope = applyBuilder(8, 0, 0);
/**
 * apply function with scope
 * @param fn		target function
 * @param scope		scope of function
 * @param args		arguments of function
 * @param offset	start offset of args
 * @param len		arg size from offset
 */

const applyScopeN = applyBuilder(8, 1, 1);
/**
 * apply function without scope
 * @param fn		target function
 * @param args		arguments of function
 * @param offset	start offset of args
 * @param len		arg size from offset
 */

const applyNoScopeN = applyBuilder(8, 0, 1);
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

const varGenReg = /\$\d+$/;
/**
 * get function name
 */

function fnName(fn) {
  const name = fn.name;
  return name ? name.replace(varGenReg, '') : 'anonymous';
} // ========================================================================================

/*                                                                                      *
 *                                         bind                                         *
 *                                                                                      */
// ========================================================================================

let _bind;

const funcProto = Function[PROTOTYPE];

if (funcProto.bind) {
  _bind = function (fn, scope) {
    const args = arguments,
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


const bind = _bind;
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
  const argLen = bindArgs.length - argOffset;

  if (scope === undefined) {
    scope = null;
  }

  if (argLen > 0) {
    // bind with arguments
    return function () {
      const args = arguments;
      let i = args.length;

      if (i) {
        const params = new Array(argLen + i);

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

const regStickySupport = isBool(/(?:)/.sticky);
/**
 * is support unicode on RegExp
 */

const regUnicodeSupport = isBool(/(?:)/.unicode);
const REG_ESCAPE = /[-\/\\^$*+?.()|[\]{}]/g;
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
const __hasOwn = Object[PROTOTYPE].hasOwnProperty;
const __getProto = Object.getPrototypeOf,
      ____setProto = Object.setPrototypeOf;
/**
 * is support Object.getPrototypeOf and Object.setPrototypeOf
 */

const prototypeOfSupport = !!____setProto;
const protoPropSupport = {
  __proto__: []
} instanceof Array;
/**
 * Object.getPrototypeOf shim
 */

const protoOf = ____setProto ? __getProto : __getProto ? function (obj) {
  return obj[PROTO] || __getProto(obj);
} : function (obj) {
  return (__hasOwn.call(obj, PROTO) ? obj[PROTO] : obj[CONSTRUCTOR][PROTOTYPE]) || null;
};
const __setProto = ____setProto || function (obj, proto) {
  obj[PROTO] = proto;
  return obj;
};
/**
 * Object.setPrototypeOf shim
 */

const setProto = ____setProto || (protoPropSupport ? __setProto : function (obj, proto) {
  for (let p in proto) {
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
 * @modified Mon Dec 10 2018 12:44:40 GMT+0800 (China Standard Time)
 */
const __hasOwn$1 = Object[PROTOTYPE].hasOwnProperty;
/**
 * has own property
 */

const hasOwnProp = protoPropSupport ? function (obj, prop) {
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
let __defProp = Object.defineProperty;
/**
 * is support Object.defineProperty
 */

const defPropSupport = __defProp && function () {
  try {
    var val,
        obj = {};

    __defProp(obj, 's', {
      get() {
        return val;
      },

      set(value) {
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


const defProp = __defProp;
/**
 * define property by value
 */

const defPropValue = defPropSupport ? function (obj, prop, value, configurable, writable, enumerable) {
  __defProp(obj, prop, {
    value,
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
 * @modified Mon Dec 10 2018 11:45:30 GMT+0800 (China Standard Time)
 */

function __() {}
/**
 * create shim
 */


function doCreate(o, props) {
  __[PROTOTYPE] = o;
  const obj = new __();
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


const create = Object.create || (Object.getPrototypeOf ? doCreate : function (o, props) {
  const obj = doCreate(o, props);

  __setProto(obj, o);

  return obj;
});

/**
 * @module utility/collection
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 17:10:41 GMT+0800 (China Standard Time)
 * @modified Tue Nov 27 2018 14:17:32 GMT+0800 (China Standard Time)
 */
class Control {
  constructor(desc) {
    this.desc = void 0;
    this.desc = desc;
  }

  toString() {
    return this.desc;
  }

}

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

const STOP = new Control('STOP'); //========================================================================================

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
    for (var k in obj) if (callback(k, obj) === STOP) return k;
  } else {
    for (k in obj) if (hasOwnProp(obj, k) && callback(k, obj) === STOP) return k;
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
    for (var k in obj) if (callback(obj[k], k, obj) === STOP) return k;
  } else {
    for (k in obj) if (hasOwnProp(obj, k) && callback(obj[k], k, obj) === STOP) return k;
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

  for (let i = 0, l = array.length; i < l; i++) {
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

const SKIP = new Control('SKIP'); //========================================================================================

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

  const copy = create(null);
  each$$1(obj, (value, prop, obj) => {
    const v = callback(value, prop, obj);
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
  const copy = [];
  let j = 0;
  each$$1(array, (data, index, array) => {
    const v = callback(data, index, array);
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

  const callback = parseCallback(value, scope);
  let idx = -1;
  each$$1(obj, (data, prop, obj) => {
    const r = callback(data, prop, obj);

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
  const callback = parseCallback(value, scope);
  let idx = -1;
  each$$1(array, (data, index, array) => {
    const r = callback(data, index, array);

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

  each$$1(obj, (value, prop, obj) => {
    const rs = callback(accumulator, value, prop, obj);
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
  each$$1(array, (data, index, array) => {
    const rs = callback(accumulator, data, index, array);
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
  const rs = [],
        args = arguments;
  let handler = defaultObjKeyHandler,
      i = 2,
      j = 0;

  if (isFn(args[i])) {
    handler = args[i++];
    if (!isBool(args[i])) handler = bind(handler, args[i++]);
  }

  each$$1(obj, (prop, obj) => {
    const val = handler(prop, obj);
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
  const rs = [],
        args = arguments;
  let handler = defaultObjValueHandler,
      i = 1,
      j = 0;

  if (isFn(args[i])) {
    handler = args[i++];
    if (!isBool(args[i])) handler = bind(handler, args[i++]);
  }

  each$$1(obj, function (data, prop, obj) {
    const val = handler(data, prop, obj);
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
  const obj = create(null);
  callback = bind(callback, scope);
  each$$1(array, (data, index, array) => {
    const r = callback(data, index, array);

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
  return arr2obj(array, isFn(val) ? val : data => [data, val]);
}

/**
 * @module utility/collection
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Thu Nov 15 2018 12:13:54 GMT+0800 (China Standard Time)
 * @modified Tue Dec 04 2018 20:10:32 GMT+0800 (China Standard Time)
 */
function makeArray(len, callback) {
  const array = new Array(len);
  let i = len;

  while (i--) array[i] = callback(i);

  return array;
}

/**
 * @module utility/prop
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Fri Nov 30 2018 14:41:02 GMT+0800 (China Standard Time)
 * @modified Mon Dec 10 2018 16:59:08 GMT+0800 (China Standard Time)
 */
const pathCache = create(null); // prop | [index | "string prop" | 'string prop']

const pathReg = /(?:^|\.)([a-zA-Z$_][\w$]*)|\[\s*(?:(\d+)|"((?:[^\\"]|\\.)*)"|'((?:[^\\']|\\.)*)')\s*\]/g;
function parsePath(path, cacheable) {
  if (isArray(path)) return path;
  let array = pathCache[path];

  if (!array) {
    array = [];
    var match,
        idx = 0,
        cidx,
        i = 0;

    while (match = pathReg.exec(path)) {
      cidx = pathReg.lastIndex;

      if (cidx !== idx + match[0].length) {
        throw new SyntaxError(`Invalid Path: "${path}", unkown character[${path.charAt(idx)}] at offset:${idx}`);
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
  return `["${String(prop).replace("'", '\\"')}"]`;
}

function get(obj, path) {
  path = parsePath(path);
  const l = path.length - 1;
  if (l === -1) return obj;
  let i = 0;

  for (; i < l; i++) {
    obj = obj[path[i]];
    if (obj === null || obj === undefined) return undefined;
  }

  return obj ? obj[path[i]] : undefined;
}
function set(obj, path, value) {
  path = parsePath(path);
  const l = path.length - 1;
  if (l === -1) return;
  let attr,
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
 * @modified Sat Dec 08 2018 16:16:42 GMT+0800 (China Standard Time)
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

const TRIM_REG = /(^\s+)|(\s+$)/g;
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

const FIRST_LOWER_LETTER_REG = /^[a-z]/;
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

const STR_ESCAPE_MAP = {
  '\n': '\\n',
  '\t': '\\t',
  '\f': '\\f',
  '"': '\\"',
  "'": "\\'"
},
      STR_ESCAPE = /[\n\t\f"']/g;
function escapeStr(str) {
  return str.replace(STR_ESCAPE, str => STR_ESCAPE_MAP[str]);
}

/**
 * @module utility/format
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Mon Dec 03 2018 19:46:41 GMT+0800 (China Standard Time)
 * @modified Mon Dec 10 2018 16:26:23 GMT+0800 (China Standard Time)
 */

/*                                                                                      *
 *                                       pad & cut                                      *
 *                                                                                      */
//========================================================================================

function pad(str, len, chr, leftAlign) {
  return len > str.length ? __pad(str, len, chr, leftAlign) : str;
}
function cut(str, len, suffix) {
  return len < str.length ? (suffix = suffix || '', str.substr(0, len - suffix.length) + suffix) : str;
}

function __pad(str, len, chr, leftAlign) {
  const padding = new Array(len - str.length + 1).join(chr || ' ');
  return leftAlign ? str + padding : padding + str;
} //========================================================================================

/*                                                                                      *
 *                                       Separator                                      *
 *                                                                                      */
//========================================================================================


const thousandSeparate = mkSeparator(3),
      binarySeparate = mkSeparator(8, '01'),
      octalSeparate = mkSeparator(4, '0-7'),
      hexSeparate = mkSeparator(4, '\\da-fA-F');

function mkSeparator(group, valReg) {
  valReg = valReg || '\\d';
  const reg = new RegExp(`^(?:[+-]|\\s+|0[xXbBoO])|([${valReg}])(?=([${valReg}]{${group}})+(?![${valReg}]))|[^${valReg}].*`, 'g');
  return numStr => numStr.replace(reg, separatorHandler);
}

function separatorHandler(m, d) {
  return d ? d + ',' : m;
} //========================================================================================

/*                                                                                      *
 *                                   plural & singular                                  *
 *                                                                                      */
//========================================================================================


const PLURAL_REG = /([a-zA-Z]+)([^aeiou])y$|([sxzh])$|([aeiou]y)$|([^sxzhy])$/;
function plural(str) {
  return str.replace(PLURAL_REG, pluralHandler);
}

function pluralHandler(m, v, ies, es, ys, s) {
  return v + (ies ? ies + 'ies' : es ? es + 'es' : (ys || s) + 's');
}

const SINGULAR_REG = /([a-zA-Z]+)([^aeiou])ies$|([sxzh])es$|([aeiou]y)s$|([^sxzhy])s$/;
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


const FORMAT_XPREFIX = 0x1;
const FORMAT_PLUS = 0x2;
const FORMAT_ZERO = 0x4;
const FORMAT_SPACE = 0x8;
const FORMAT_SEPARATOR = 0x10;
const FORMAT_LEFT = 0x20;
const FLAG_MAPPING = {
  '#': FORMAT_XPREFIX,
  '+': FORMAT_PLUS,
  '0': FORMAT_ZERO,
  ' ': FORMAT_SPACE,
  ',': FORMAT_SEPARATOR,
  '-': FORMAT_LEFT
};

function parseFlags(f) {
  let flags = 0;

  if (f) {
    var i = f.length;

    while (i--) flags |= FLAG_MAPPING[f.charAt(i)];
  }

  return flags;
} //========================================================================================

/*                                                                                      *
 *                                      format Rule                                     *
 *                                                                                      */
//========================================================================================
//   0      1      2     3     4       5       6           7         8      9           10             11             12        13
// [match, expr, index, prop, flags, width, width-idx, width-prop, fill, precision, precision-idx, precision-prop, cut-suffix, type]


const paramIdxR = `(\\d+|\\$|@)`,
      paramPropR = `(?:\\{((?:[a-zA-Z$_][\\w$_]*|\\[(?:\\d+|"(?:[^\\\\"]|\\\\.)*"|'(?:[^\\\\']|\\\\.)*')\\])(?:\\.[a-zA-Z$_][\\w$_]*|\\[(?:\\d+|"(?:[^\\\\"]|\\\\.)*"|'(?:[^\\\\']|\\\\.)*')\\])*)\\})`,
      widthR = `(?:([1-9]\\d*)|&${paramIdxR}${paramPropR})`,
      fillR = `(?:=(.))`,
      cutSuffixR = `(?:="((?:[^\\\\"]|\\\\.)*)")`,
      formatReg = new RegExp(`\\\\.|(\\{${paramIdxR}?${paramPropR}?(?::([#,+\\- 0]*)(?:${widthR}${fillR}?)?(?:\\.${widthR}${cutSuffixR}?)?)?([a-zA-Z_][a-zA-Z0-9_$]*)?\\})`, 'g'); //========================================================================================

/*                                                                                      *
 *                                      Formatters                                      *
 *                                                                                      */
//========================================================================================

const formatters = create(null);
function extendFormatter(obj) {
  var fmt, name;

  for (name in obj) {
    fmt = obj[name];
    isFn(fmt) && (formatters[name] = fmt);
  }
}
function getFormatter(name) {
  const f = formatters[name || 's'];
  if (f) return f;
  throw new Error(`Invalid Formatter: ${name}`);
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
 * 				<precision> ('=' '"' <cut-suffix> '"')?
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
 * 		- cut suffix
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
 * 							((?:[^\\"]|\\.)*)					// 12: cut su
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
  const start = offset;
  getParam = getParam || defaultGetParam;
  return fmt.replace(formatReg, function (s, m, param, paramProp, flags, width, widx, wprop, fill, precision, pidx, pprop, cutSuffix, type) {
    if (!m) return s.charAt(1);
    return getFormatter(type)(parseParam(param || '$', paramProp), parseFlags(flags), parseWidth(width, widx, wprop) || 0, fill, parseWidth(precision, pidx, pprop), cutSuffix);
  });

  function parseWidth(width, idx, prop) {
    if (width) return width >> 0;

    if (idx) {
      const w = parseParam(idx, prop) >> 0;
      if (isFinite(w)) return w;
    }
  }

  function parseParam(paramIdx, prop) {
    let param = getParam(args, paramIdx === '$' ? offset++ : paramIdx === '@' ? offset === start ? offset : offset - 1 : paramIdx >> 0);
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


const GET_PARAM_VAR = 'getp',
      GET_PROP_VAR = 'get',
      STATE_VAR = 'state';

function createFormatter(m, getParam) {
  return createFn(`return function(args, ${STATE_VAR}){
return fmt(${getParamCode(m[2] || '$', m[3])},
"${parseFlags(m[4])}",
${getWidthCode(m[5], m[6], m[7], '0')},
"${m[8] ? escapeStr(m[8]) : ' '}",
${getWidthCode(m[9], m[10], m[11], 'void 0')},
"${m[12] ? escapeStr(m[12]) : ''}");
}`, ['fmt', GET_PROP_VAR, GET_PARAM_VAR])(getFormatter(m[13]), get, getParam);
}

function getWidthCode(width, idx, prop, def) {
  return width ? width : idx ? getParamCode(idx, prop) : def;
}

function getParamCode(idx, prop) {
  let code = `${GET_PARAM_VAR}(args, ${idx === '$' ? `${STATE_VAR}[0]++` : idx === '@' ? `${STATE_VAR}[0] === ${STATE_VAR}[1] ? ${STATE_VAR}[0] : ${STATE_VAR}[0] - 1` : idx})`;

  if (prop) {
    const path = parsePath(prop);
    var i = path.length;

    while (i--) path[i] = `"${escapeStr(path[i])}"`;

    return `${GET_PROP_VAR}(${code}, [${path.join(', ')}])`;
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
  let m,
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
      codes[i] = `arr[${i}](arguments, ${STATE_VAR})`;
      arr[i++] = createFormatter(m, getParam || defaultGetParam);
    } else {
      pushStr(m[0].charAt(1), i);
    }

    lastIdx = mEnd;
  }

  lastIdx < fmt.length && pushStr(fmt.substring(lastIdx), i);
  return createFn(`return function(){var ${STATE_VAR} = [${offset}, ${offset}]; return ${codes.join(' + ')}}`, ['arr'])(arr);

  function pushStr(str, append) {
    if (append && arr[i - 1].match) {
      arr[i - 1] += str;
    } else {
      codes[i] = `arr[${i}]`;
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
  return function (val, flags, width, fill, precision, cutSuffix) {
    const str = toStr(val, flags);
    return width > str.length ? __pad(str, width, fill, flags & FORMAT_LEFT) : cut(str, precision, cutSuffix);
  };
}

function numFormatter(parseNum, getPrefix, toStr, separator) {
  return function (val, flags, width, fill, precision) {
    const num = parseNum(val);
    if (!isFinite(num)) return String(num);
    const prefix = getPrefix(num, flags),
          plen = prefix.length;
    let str = toStr(num < 0 ? -num : num, flags, precision);
    return flags & FORMAT_ZERO ? (str = prefix + pad(str, width - plen, '0'), flags & FORMAT_SEPARATOR ? separator(str) : str) : (flags & FORMAT_SEPARATOR && (str = separator(str)), pad(prefix + str, width, fill, flags & FORMAT_LEFT));
  };
}

function decimalPrefix(num, flags) {
  return num < 0 ? '-' : flags & FORMAT_PLUS ? '+' : flags & FORMAT_SPACE ? ' ' : '';
} //──── base formatter ───────────────────────────────────────────────────────────────────────


const BASE_RADIXS = {
  b: [2, binarySeparate],
  o: [8, octalSeparate],
  u: [10, thousandSeparate],
  x: [16, hexSeparate]
};
const BASE_PREFIXS = ['0b', '0o', '0x'];

function baseFormatter(type) {
  const base = BASE_RADIXS[type.toLowerCase()],
        n = base[0],
        __toStr = num => num.toString(n),
        toStr = type === 'X' ? num => upper(__toStr(num)) : __toStr;

  let xprefix = n === 10 ? '' : BASE_PREFIXS[n >> 3];
  charCode(type) < 96 && (xprefix = upper(xprefix));
  return numFormatter(v => v >>> 0, (num, flags) => flags & FORMAT_XPREFIX ? xprefix : '', toStr, base[1]);
} //──── float formatter ───────────────────────────────────────────────────────────────────


function floatFormatter(type) {
  const ____toStr = upper(type) === 'E' ? toExponential : type === 'f' ? toFixed : toPrecision,
        __toStr = (num, flags, precision) => ____toStr(num, precision) || String(num),
        toStr = charCode(type) > 96 ? __toStr : (num, flags, precision) => upper(__toStr(num, flags, precision));

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
  j: strFormatter(v => v === undefined ? 'undefined' : JSON.stringify(v)),

  c(val) {
    const num = val >> 0;
    return num > 0 ? String.fromCharCode(num) : '';
  },

  d: numFormatter(val => val >> 0, decimalPrefix, toStr, thousandSeparate),
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

  const l = endOffset || overrides.length - 1;
  let i = startOffset || 0,
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
 * @module utility/assert
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Nov 28 2018 11:01:45 GMT+0800 (China Standard Time)
 * @modified Tue Dec 11 2018 16:43:09 GMT+0800 (China Standard Time)
 */
const formatters$1 = [],
      formatArgHandlers = [];

function parseMessage(msg, args, msgIdx) {
  const fs = formatters$1[msgIdx] || (formatArgHandlers[msgIdx] = (args, offset) => {
    return args[0][offset >= msgIdx ? offset + 1 : offset];
  }, formatters$1[msgIdx] = create(null));
  return (fs[msg] || (fs[msg] = formatter(msg, msgIdx, formatArgHandlers[msgIdx])))(args);
}

const assert = function (msg) {
  throw new Error(parseMessage(msg, arguments, 0));
};

function catchErr(fn) {
  try {
    fn();
  } catch (e) {
    return e;
  }
}

function checkErr(expect, err) {
  let msg = isStr(expect) ? expect : expect.message;
  return msg === err.message;
}

const ERROR = new Error();
const throwMsg = mkMsg(objFormatter(1), 'throw');

assert["throw"] = function (fn, expect, msg) {
  const err = catchErr(fn);

  if (!err || expect && !checkErr(expect, err)) {
    arguments[0] = err;
    !expect && (arguments[2] = ERROR);
    throw new Error(parseMessage(msg || throwMsg[0], arguments, 2));
  }

  return assert;
};

assert.notThrow = function (fn, expect, msg) {
  const err = catchErr(fn);

  if (err && (!expect || !checkErr(expect, err))) {
    arguments[0] = err;
    !expect && (arguments[2] = ERROR);
    throw new Error(parseMessage(msg || throwMsg[0], arguments, 2));
  }

  return assert;
};

function extendAssert(name, condition, args, dmsg, Err) {
  const params = isStr(args) ? args.split(/,/g) : isNum(args) ? makeArray(args, i => `arg${i + 1}`) : args,
        paramStr = params.join(', '),
        cond = isArray(condition) ? condition[0] : condition,
        expr = (isArray(condition) ? condition[1] : '') + (isStr(cond) ? `(${cond})` : `cond(${paramStr})`);
  return assert[name] = createFn(`return function assert${upperFirst(name)}(${paramStr}, msg){
	if (${expr})
		throw new Err(parseMsg(msg || dmsg, arguments, ${params.length}));
	return assert;
}`, ['Err', 'parseMsg', 'dmsg', 'cond', 'assert'])(Err || Error, parseMessage, dmsg, cond, assert);
} // [condition, argcount?, [msg, not msg], Error]


function extendAsserts(apis) {
  eachObj(apis, (desc, name) => {
    const condition = desc[0],
          args = desc[1],
          msg = desc[2],
          Err = desc[3] || TypeError;
    msg[0] && extendAssert(name, [condition, '!'], args, msg[0], Err);
    msg[1] && extendAssert('not' + upperFirst(name), condition, args, msg[1], Err);
  });
}

const NULL = 'null';
const UNDEFINED = 'undefined';
const BOOLEAN = 'boolean';
const NUMBER = 'number';
const INTEGER = 'integer';
const STRING = 'string';
const FUNCTION = 'function';
const ARRAY = 'Array';
const TYPED_ARRAY = 'TypedArray';
extendAssert('is', '!o', 'o', expectMsg('Exist'));
extendAssert('not', 'o', 'o', expectMsg('Not Exist'));
extendAsserts({
  eq: [eq, 2, mkMsg(objFormatter(1))],
  nul: [isNull, 1, mkMsg(NULL)],
  nil: [isNil, 1, mkMsg(typeExpect(NULL, UNDEFINED))],
  undef: [isUndef, 1, mkMsg(UNDEFINED)],
  bool: [isBool, 1, mkMsg(BOOLEAN)],
  num: [isNum, 1, mkMsg(NUMBER)],
  int: [isInt, 1, mkMsg(INTEGER)],
  str: [isStr, 1, mkMsg(STRING)],
  fn: [isFn, 1, mkMsg(FUNCTION)],
  primitive: [isPrimitive, 1, mkMsg(`Primitive type(${typeExpect(NULL, UNDEFINED, BOOLEAN, NUMBER, INTEGER, STRING, FUNCTION)})`)],
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
  range: ['o>=s&&o<e', 'o,s,e', mkMsg(`[{1} - {2})`)]
});

function mkMsg(expect, to) {
  return [expectMsg(expect, false, to), expectMsg(expect, true, to)];
}

function expectMsg(expect, not, to) {
  return `Expected ${objFormatter(0)} ${not ? 'not ' : ''}${to || 'to'} ${expect}`;
}

function objFormatter(idx) {
  return `{${idx}:.20="..."j}`;
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
 * @modified Mon Dec 10 2018 19:07:47 GMT+0800 (China Standard Time)
 */
const DEFAULT_BINDING = '__this__'; //type ListNode = [ListElement, IListNode, IListNode, List]

class List {
  constructor(binding) {
    this.binding = void 0;
    this.head = void 0;
    this.tail = void 0;
    this.length = 0;
    this.scaning = false;
    this.lazyRemoves = void 0;
    this.binding = binding || DEFAULT_BINDING;
  }

  size() {
    return this.length;
  }

  has(obj) {
    const node = obj[this.binding];
    return node ? node[0] === obj && node[3] === this : false;
  }

  add(obj) {
    return this.__insert(obj, this.tail);
  }

  addFirst(obj) {
    return this.__insert(obj);
  }

  insertAfter(obj, target) {
    return this.__insert(obj, target && this.__getNode(target));
  }

  insertBefore(obj, target) {
    return this.__insert(obj, target && this.__getNode(target)[1]);
  }

  addAll(objs) {
    return this.__insertAll(objs, this.tail);
  }

  addFirstAll(objs) {
    return this.__insertAll(objs);
  }

  insertAfterAll(objs, target) {
    return this.__insertAll(objs, target && this.__getNode(target));
  }

  insertBeforeAll(objs, target) {
    return this.__insertAll(objs, target && this.__getNode(target)[1]);
  }

  prev(obj) {
    return this.__siblingObj(obj, 1);
  }

  next(obj) {
    return this.__siblingObj(obj, 2);
  }

  first() {
    const node = this.head;
    return node && node[0];
  }

  last() {
    const node = this.tail;
    return node && node[0];
  }

  each(cb, scope) {
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
  }

  toArray() {
    const array = new Array(this.length);
    let node = this.head,
        i = 0;

    while (node) {
      if (node[3] === this) array[i++] = node[0];
      node = node[2];
    }

    return array;
  }

  remove(obj) {
    return this.__remove(this.__getNode(obj));
  }

  pop() {}

  clean() {
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
  }

  toJSON() {}

  __initNode(obj) {
    const {
      binding
    } = this;
    let node = obj[binding];

    if (node && node[0] === obj) {
      if (node[3] === this) {
        this.__remove(node);

        return this.__initNode(obj);
      } else if (node[3]) {
        assert('Object is still in some List');
      }
    } else {
      node = [obj];
      defPropValue(obj, binding, node, false);
    }

    node[3] = this;
    return node;
  }

  __getNode(obj) {
    const node = obj[this.binding];
    assert.is(node && node[3] === this, 'Object is not in this List');
    return node;
  }

  __siblingObj(obj, siblingIdx) {
    const node = this.__getNode(obj);

    let sibling = node[siblingIdx];

    if (sibling) {
      while (!sibling[3]) {
        sibling = sibling[siblingIdx];
        if (!sibling) return;
      }

      return sibling[0];
    }
  }

  __doInsert(nodeHead, nodeTail, len, prev) {
    let next;
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
  }

  __insert(obj, prev) {
    const node = this.__initNode(obj);

    return this.__doInsert(node, node, 1, prev);
  }

  __insertAll(objs, prev) {
    let l = objs.length;

    if (l) {
      const head = this.__initNode(objs[0]);

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
  }

  __remove(node) {
    this.scaning ? this.__lazyRemove(node) : this.__doRemove(node);
    return --this.length;
  }

  __lazyRemove(node) {
    const {
      lazyRemoves
    } = this;
    node[0][this.binding] = undefined; // unbind this node

    node[3] = null;

    if (lazyRemoves) {
      lazyRemoves.push(node);
    } else {
      this.lazyRemoves = [node];
    }
  }

  __doLazyRemove() {
    const {
      lazyRemoves
    } = this;

    if (lazyRemoves) {
      var len = lazyRemoves.length;

      if (len) {
        if (this.length) {
          while (len--) this.__doRemove(lazyRemoves[len]);
        } else {
          this.__clean();
        }

        lazyRemoves.length = 0;
      }
    }
  }

  __doRemove(node) {
    const prev = node[1],
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
  }

  __clean() {
    let node,
        next = this.head;

    while (node = next) {
      next = node[2];
      node.length = 1;
    }

    this.head = undefined;
    this.tail = undefined;
    this.length = 0;
  }

}
List.binding = DEFAULT_BINDING;

/**
 * Function List
 * @module utility/List
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Mon Dec 11 2017 14:35:32 GMT+0800 (China Standard Time)
 * @modified Mon Dec 10 2018 18:48:02 GMT+0800 (China Standard Time)
 */
const DEFAULT_FN_BINDING = '__id__';
const DEFAULT_SCOPE_BINDING = '__id__';
class FnList {
  constructor(fnBinding, scopeBinding) {
    this.fnBinding = void 0;
    this.scopeBinding = void 0;
    this.list = void 0;
    this.nodeMap = void 0;
    this.nodeMap = create(null);
    this.list = new List();
    this.fnBinding = fnBinding || DEFAULT_FN_BINDING;
    this.scopeBinding = scopeBinding || DEFAULT_SCOPE_BINDING;
  }

  add(fn, scope, data) {
    scope = parseScope(scope);
    const {
      list,
      nodeMap
    } = this;
    const id = nodeId(this, fn, scope);
    let node = nodeMap[id];

    if (!node) {
      node = [id, fn, scope, data];
      var ret = list.add(node);
      if (ret) nodeMap[id] = node;
      return ret;
    }

    return -1;
  }

  remove(fn, scope) {
    const {
      list,
      nodeMap
    } = this;
    const id = nodeId(this, fn, parseScope(scope));
    const node = nodeMap[id];

    if (node) {
      nodeMap[id] = undefined;
      return list.remove(node);
    }

    return -1;
  }

  has(fn, scope) {
    return !!this.nodeMap[nodeId(this, fn, parseScope(scope))];
  }

  size() {
    return this.list.size();
  }

  clean() {
    this.nodeMap = create(null);
    this.list.clean();
  }

  each(cb, scope) {
    cb = cb.bind(scope);
    this.list.each(node => cb(node[1], node[2], node[3]));
  }

  toJSON() {}

}
FnList.fnBinding = DEFAULT_FN_BINDING;
FnList.scopeBinding = DEFAULT_SCOPE_BINDING;
const DEFAULT_SCOPE_ID = 1;
let scopeIdGenerator = 1,
    fnIdGenerator = 0;

function nodeId(list, fn, scope) {
  const {
    fnBinding,
    scopeBinding
  } = list;
  let fnId = fn[fnBinding],
      scopeId = scope ? scope[scopeBinding] : DEFAULT_SCOPE_ID;
  if (!fnId) fnId = defPropValue(fn, fnBinding, ++fnIdGenerator, false, false, false);
  if (!scopeId) scopeId = defPropValue(scope, scopeBinding, ++scopeIdGenerator, false, false, false);
  return `${fnId}&${scopeId}`;
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
const ticks = new FnList();
let pending = false;
let next;

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
 * @module common/AST
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Nov 06 2018 10:06:22 GMT+0800 (China Standard Time)
 * @modified Tue Dec 11 2018 19:53:20 GMT+0800 (China Standard Time)
 */

function defaultErr(err) {
  return err;
}

function defaultMatch(data, len, context) {
  context.add(data);
}

let idGen = 0;
class Rule {
  constructor(name, capturable, onMatch, onErr) {
    this.name = name;
    this.capturable = capturable;
    this.$rule = true;
    this.id = void 0;
    this.type = 'Rule';
    this.expr = void 0;
    this.EXPECT = void 0;
    this.onMatch = void 0;
    this.onErr = void 0;
    this.id = idGen++;
    this.onMatch = onMatch || defaultMatch;
    this.onErr = onErr || defaultErr;
  }

  mkErr(msg, context, capturable, src) {
    return [msg, capturable && src ? src[1] : capturable, src, context, this];
  }

  error(msg, context, capturable, src) {
    const err = this.mkErr(msg, context, capturable, src);
    const userErr = this.onErr(err, context, this);
    if (userErr) return isStr(userErr) ? (err[0] = userErr, err) : userErr;
  }

  matched(data, len, context) {
    const err = this.onMatch(data, len, context, this);
    if (err) return err.push && err.length === 5 ? err : this.mkErr(String(err), context, false);
  }
  /**
   * prepare test before match
   */


  test(context) {
    return !context.eof();
  }

  match() {
    return assert('abstruct');
  }
  /**
   * get start char codes
   */


  getStart() {
    return [];
  } //──── for debug ─────────────────────────────────────────────────────────────────────────

  /**
   * make rule expression
   *
   * @param expr expression text
   */


  mkExpr(expr) {
    return `<${this.type}: ${expr}>`;
  }
  /**
   * set rule expression
   * 1. make rule expression
   * 2. make rule Expect text
   */


  setExpr(expr) {
    this.expr = this.mkExpr(expr);
    this.EXPECT = `Expect: ${expr}`;
  }
  /**
   * tostring by name or expression
   * @return {string}
   */


  toString() {
    return this.name || this.expr;
  }

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
  if (isStr(codes)) {
    var i = codes.length;

    while (i--) eachCharCode(codes.charCodeAt(i), ignoreCase, cb);
  } else if (isArray(codes)) {
    var i = codes.length;

    while (i--) eachCharCodes(codes[i], ignoreCase, cb);
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
}

/**
 * @module common/AST
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Nov 06 2018 10:06:22 GMT+0800 (China Standard Time)
 * @modified Tue Dec 11 2018 17:07:13 GMT+0800 (China Standard Time)
 */
class MatchRule extends Rule {
  constructor(name, start, ignoreCase, capturable, onMatch, onErr) {
    super(name, capturable, onMatch, onErr);
    this.start = void 0;
    this.index = void 0;
    this.ignoreCase = void 0;
    this.ignoreCase = ignoreCase;
    const __start = [],
          index = [];
    eachCharCodes(start, ignoreCase, code => {
      if (!index[code]) {
        __start.push(code);

        index[code] = code;
      }
    });
    this.start = __start;
    this.index = index;
    __start.length && (this.test = indexTest);
  }

  comsume(data, len, context) {
    context.advance(len);
    return this.matched(data, len, context);
  }

  getStart() {
    return this.start;
  }

}
/**
 * prepare test by index of start codes
 */

function indexTest(context) {
  return this.index[context.nextCode()];
}

/**
 * @module utility/AST
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Dec 11 2018 15:36:42 GMT+0800 (China Standard Time)
 * @modified Tue Dec 11 2018 19:58:29 GMT+0800 (China Standard Time)
 */
/**
 * match by RegExp
 *
 * optimization:
 * - Priority use sticky mode {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/sticky}
 *
 * @class RegMatchRule
 * @implements MatchRule
 *
 * @param name		rule name
 * @param regexp	regexp
 * @param start		start chars
 * @param pick		pick match result
 * <table>
 * <tr><td> 0            </td><td> pick match[0] (optimize: test and substring in sticky mode)  </td></tr>
 * <tr><td> less than 0  </td><td> pick match[pick]                                             </td></tr>
 * <tr><td> great than 0 </td><td> pick first matched group                                     </td></tr>
 * <tr><td> true         </td><td> pick match                                                   </td></tr>
 * <tr><td> false        </td><td> no data pick (optimize: just test string in sticky mode)     </td></tr>
 * </table>
 */

class RegMatchRule extends MatchRule {
  constructor(name, regexp, pick, start, capturable, onMatch, onErr) {
    pick = pick === false || isInt(pick) ? pick : !!pick || 0;
    const sticky = regStickySupport && !pick,
          // use exec when need pick match group data
    pattern = regexp.source,
          ignoreCase = regexp.ignoreCase; // always wrapping in a none capturing group preceded by '^' to make sure
    // matching can only work on start of input. duplicate/redundant start of
    // input markers have no meaning (/^^^^A/ === /^A/)
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/sticky
    // When the y flag is used with a pattern, ^ always matches only at the
    // beginning of the input, or (if multiline is true) at the beginning of a
    // line.

    regexp = new RegExp(sticky ? pattern : `^(?:${pattern})`, (ignoreCase ? 'i' : '') + (regexp.multiline ? 'm' : '') + (sticky ? 'y' : ''));
    super(name, start, regexp.ignoreCase, capturable, onMatch, onErr);
    this.regexp = void 0;
    this.pick = void 0;
    this.picker = void 0;
    this.regexp = regexp;
    this.pick = pick;
    this.match = sticky ? this.stickyMatch : this.execMatch;
    !sticky && (this.picker = pick === true ? pickAll : pick < 0 ? anyPicker(-pick) : idxPicker(pick || 0));
    this.setExpr(pattern);
  }

  match(context) {
    return this.comsume(context.nextChar(), 1, context);
  }

  stickyMatch(context) {
    const reg = this.regexp,
          buff = context.getBuff(),
          start = context.getOffset();
    reg.lastIndex = start;
    if (reg.test(buff)) return this.comsume(this.pick === false ? null : buff.substring(start, reg.lastIndex), reg.lastIndex - start, context);
    return this.error(this.EXPECT, context, this.capturable);
  }

  execMatch(context) {
    const m = this.regexp.exec(context.getBuff(true));

    if (m) {
      return this.comsume(this.picker(m), m[0].length, context);
    }

    return this.error(this.EXPECT, context, this.capturable);
  }

}

function pickAll(m) {
  return m;
}

const idxPickers = [];

function idxPicker(pick) {
  return idxPickers[pick] || (idxPickers[pick] = m => m[pick]);
}

const anyPickers = [];

function anyPicker(size) {
  let picker = anyPickers[size];

  if (!picker) {
    const arr = new Array(size);
    var i = size;

    while (i--) arr[i] = `m[${i + 1}]`;

    anyPickers[size] = picker = createFn(`return ${arr.join(' || ')}`, ['m']);
  }

  return picker;
}

/**
 * @module utility/AST
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Dec 11 2018 15:36:42 GMT+0800 (China Standard Time)
 * @modified Tue Dec 11 2018 19:57:58 GMT+0800 (China Standard Time)
 */
/**
 * match one char which in allow list.
 * well match every char when allows is empty
 *
 * @param name                        rule name
 * @param allows                      which char can be matched.
 *                                    well match every char when allows is empty
 */

class CharMatchRule extends MatchRule {
  constructor(name, allows, ignoreCase, capturable, onMatch, onErr) {
    super(name, allows, ignoreCase, capturable, onMatch, onErr);
    this.type = 'Character';
    const codes = this.start;
    let i = codes.length,
        expr = '*';

    if (i) {
      const chars = [];

      while (i--) chars[i] = char(codes[i]);

      expr = `"${chars.join('" | "')}"`;
    }

    this.setExpr(expr);
  }

  match(context) {
    return this.comsume(context.nextChar(), 1, context);
  }

}

/**
 * @module utility/AST
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Dec 11 2018 15:36:42 GMT+0800 (China Standard Time)
 * @modified Tue Dec 11 2018 19:58:37 GMT+0800 (China Standard Time)
 */
class StrMatchRule extends RegMatchRule {
  constructor(name, str, ignoreCase, capturable, onMatch, onErr) {
    super(name, new RegExp(reEscape(str), ignoreCase ? 'i' : ''), 0, str.charCodeAt(0), capturable, onMatch, onErr);
    this.setExpr(str);
  }

}

/**
 *
 * @module common/AST
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Nov 06 2018 10:58:52 GMT+0800 (China Standard Time)
 * @modified Tue Dec 11 2018 19:57:06 GMT+0800 (China Standard Time)
 */

/**
 * common utilities
 * @module utility
 * @preferred
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Nov 21 2018 10:21:41 GMT+0800 (China Standard Time)
 * @modified Tue Dec 11 2018 09:21:05 GMT+0800 (China Standard Time)
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
exports.upper = upper;
exports.lower = lower;
exports.strval = strval;
exports.escapeStr = escapeStr;
exports.pad = pad;
exports.cut = cut;
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
exports.RegMatchRule = RegMatchRule;
exports.CharMatchRule = CharMatchRule;
exports.StrMatchRule = StrMatchRule;
//# sourceMappingURL=argilo.cjs.js.map
