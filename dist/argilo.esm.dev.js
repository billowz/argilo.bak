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
 * Date: Fri, 01 Mar 2019 10:19:23 GMT
 */
/**
 *
 * @author Tao Zeng (tao.zeng.zt@qq.com)
 * @module utility
 * @created 2018-11-09 15:23:35
 * @modified 2018-11-09 15:23:35 by Tao Zeng (tao.zeng.zt@qq.com)
 */
const CONSTRUCTOR = 'constructor';
const PROTOTYPE = 'prototype';
const HAS_OWN_PROP = 'hasOwnProperty';
const TYPE_BOOL = 'boolean';
const TYPE_FN = 'function';
const TYPE_NUM = 'number';
const TYPE_STRING = 'string';
const TYPE_UNDEF = 'undefined';
const GLOBAL = typeof window !== TYPE_UNDEF ? window : typeof global !== TYPE_UNDEF ? global : typeof self !== TYPE_UNDEF ? self : {};
function EMPTY_FN() {}

/**
 * @module utility
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Mon Dec 11 2017 13:57:32 GMT+0800 (China Standard Time)
 * @modified Sat Feb 16 2019 10:53:30 GMT+0800 (China Standard Time)
 */
function getConstructor(o) {
  let C = o[CONSTRUCTOR];
  return typeof C === TYPE_FN ? C : Object;
}

/**
 * type checker
 * @module utility
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Mon Dec 11 2017 13:57:32 GMT+0800 (China Standard Time)
 * @modified Mon Feb 25 2019 16:59:04 GMT+0800 (China Standard Time)
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
  return o !== undefined && o !== null && getConstructor(o) === Object;
}

function mkIs(Type) {
  return function is(o) {
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
  _bind = function bind(fn, scope) {
    const args = arguments,
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
    return function bindProxy() {
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

const stickyReg = isBool(/(?:)/.sticky);
/**
 * whether to support unicode on RegExp
 */

const unicodeReg = isBool(/(?:)/.unicode);
const REG_ESCAPE = /[-\/\\^$*+?.()|[\]{}]/g;
/**
 * escape string for RegExp
 */

function reEscape(str) {
  return str.replace(REG_ESCAPE, '\\$&');
}

/**
 * @module utility
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 15:23:56 GMT+0800 (China Standard Time)
 * @modified Thu Jan 31 2019 10:10:48 GMT+0800 (China Standard Time)
 */
const prototypeOf = true;
const protoProp = true;
const protoOf = Object.getPrototypeOf;
const __setProto = Object.setPrototypeOf;
const setProto = __setProto;

/**
 * prototype utilities
 * @module utility
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 15:24:47 GMT+0800 (China Standard Time)
 * @modified Thu Jan 31 2019 10:11:40 GMT+0800 (China Standard Time)
 */

/**
 * @module utility
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 15:22:57 GMT+0800 (China Standard Time)
 * @modified Sat Dec 29 2018 18:35:40 GMT+0800 (China Standard Time)
 */
const __hasOwn = Object[PROTOTYPE][HAS_OWN_PROP];
/**
 * has own property
 */

function hasOwnProp(obj, prop) {
  return __hasOwn.call(obj, prop);
}

/**
 * @module utility
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 15:22:57 GMT+0800 (China Standard Time)
 * @modified Sat Dec 29 2018 18:57:32 GMT+0800 (China Standard Time)
 */
const propDescriptor = true;
const propAccessor = true;
const defProp = Object.defineProperty;
function defPropValue(obj, prop, value, enumerable, configurable, writable) {
  defProp(obj, prop, {
    value,
    enumerable: enumerable !== false,
    configurable: configurable !== false,
    writable: writable !== false
  });
  return value;
}

/**
 * property utilities
 * @module utility
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 15:24:47 GMT+0800 (China Standard Time)
 * @modified Thu Jan 31 2019 10:15:09 GMT+0800 (China Standard Time)
 */
/**
 * get owner property value
 * @param prop 			property name
 * @param defaultVal 	default value
 */

function getOwnProp(obj, prop, defaultVal) {
  return hasOwnProp(obj, prop) ? obj[prop] : defaultVal;
}

/**
 * @module utility/create
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 15:24:47 GMT+0800 (China Standard Time)
 * @modified Tue Feb 19 2019 11:52:42 GMT+0800 (China Standard Time)
 */
const create = Object.create;

/**
 * @module utility/create
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 15:24:47 GMT+0800 (China Standard Time)
 * @modified Thu Jan 31 2019 10:15:42 GMT+0800 (China Standard Time)
 */

/**
 * @module utility/collection
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 17:10:41 GMT+0800 (China Standard Time)
 * @modified Sat Dec 29 2018 19:37:44 GMT+0800 (China Standard Time)
 */
class Control {
  constructor(desc) {
    this.__desc = desc;
  }

  toString() {
    return this.__desc;
  }

}

/**
 * @module utility/collection
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 17:10:41 GMT+0800 (China Standard Time)
 * @modified Sat Dec 29 2018 19:34:51 GMT+0800 (China Standard Time)
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

  let k;

  if (own === false) {
    for (k in obj) if (callback(k, obj) === STOP) return k;
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

  let k;

  if (own === false) {
    for (k in obj) if (callback(obj[k], k, obj) === STOP) return k;
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
 * @modified Sat Dec 29 2018 19:37:30 GMT+0800 (China Standard Time)
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

function doMapObj(each, obj, callback, scope, own) {
  if (isBool(scope)) {
    own = scope;
  } else {
    callback = bind(callback, scope);
  }

  const copy = create(null);
  each(obj, (value, prop, obj) => {
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

function doMapArray(each, array, callback, scope) {
  callback = bind(callback, scope);
  const copy = [];
  let j = 0;
  each(array, (data, index, array) => {
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

  const callback = parseCallback(value, scope);
  let idx = -1;
  each(obj, (data, prop, obj) => {
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

function doIdxOfArray(each, array, value, scope) {
  const callback = parseCallback(value, scope);
  let idx = -1;
  each(array, (data, index, array) => {
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

function doReduceObj(each, obj, accumulator, callback, scope, own) {
  if (isBool(scope)) {
    own = scope;
  } else {
    callback = bind(callback, scope);
  }

  each(obj, (value, prop, obj) => {
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

function doReduceArray(each, array, accumulator, callback, scope) {
  callback = bind(callback, scope);
  each(array, (data, index, array) => {
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
 * @modified Sat Dec 29 2018 19:34:56 GMT+0800 (China Standard Time)
 */

/*                                                                                      *
 *                                         keys                                         *
 *                                                                                      */
//========================================================================================

function defaultObjKeyHandler(prop, obj) {
  return prop;
}

function doObjKeys(each, obj) {
  const rs = [],
        args = arguments;
  let handler = defaultObjKeyHandler,
      i = 2,
      j = 0;

  if (isFn(args[i])) {
    handler = args[i++];
    if (!isBool(args[i])) handler = bind(handler, args[i++]);
  }

  each(obj, (prop, obj) => {
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

function defaultObjValueHandler(value, prop, obj) {
  return value;
}

function doObjValues(each, obj) {
  const rs = [],
        args = arguments;
  let handler = defaultObjValueHandler,
      i = 1,
      j = 0;

  if (isFn(args[i])) {
    handler = args[i++];
    if (!isBool(args[i])) handler = bind(handler, args[i++]);
  }

  each(obj, function (data, prop, obj) {
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
 * @modified Sat Dec 29 2018 19:33:49 GMT+0800 (China Standard Time)
 */
/**
 * @return STOP or SKIP or [key: string, value: any]
 */

function doArr2Obj(each, array, callback, scope) {
  const obj = create(null);
  callback = bind(callback, scope);
  each(array, (data, index, array) => {
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
 * @modified Sat Feb 23 2019 10:45:54 GMT+0800 (China Standard Time)
 */
const pathCache = create(null); // (^ | .) prop | (index | "string prop" | 'string prop')

const pathReg = /(?:^|\.)([a-zA-Z$_][\w$]*)|\[\s*(?:(\d+)|"((?:[^\\"]|\\.)*)"|'((?:[^\\']|\\.)*)')\s*\]/g;
function parsePath(propPath, cacheable) {
  let path;

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
      if (cidx !== idx + match[0].length) throw new SyntaxError(`Invalid Path: "${propPath}", unkown character[${propPath.charAt(idx)}] at offset:${idx}`);
      path[i++] = match[1] || match[2] || match[3] || match[4];
      idx = cidx;
    }

    if (cacheable !== false && i) {
      pathCache[propPath] = path;
    }
  }

  if (!path.length) throw new Error(`Empty Path: ${propPath}`);
  return path;
}
function formatPath(path) {
  return isArray(path) ? path.path || (path.path = mapArray(path, formatPathHandler).join('')) : path;
}

function formatPathHandler(prop) {
  return `["${String(prop).replace("'", '\\"')}"]`;
}

function get(obj, path) {
  path = parsePath(path);
  const l = path.length - 1;
  let i = 0;

  for (; i < l; i++) if ((obj = obj[path[i]]) === null || obj === undefined) return;

  if (obj && ~l) return obj[path[i]];
}
function set(obj, path, value) {
  path = parsePath(path);
  const l = path.length - 1;
  let i = 0;

  for (; i < l; i++) obj = obj[path[i]] || (obj[path[i]] = {});

  ~l && (obj[path[i]] = value);
}

/**
 * String utilities
 * @module utility/string
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Mon Dec 11 2017 13:57:32 GMT+0800 (China Standard Time)
 * @modified Thu Jan 31 2019 10:04:55 GMT+0800 (China Standard Time)
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

const FIRST_LOWER_LETTER_REG = /^[a-z]/,
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
 * @modified Fri Feb 22 2019 11:37:25 GMT+0800 (China Standard Time)
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
  const pad = new Array(len - str.length + 1).join(chr || ' ');
  return leftAlign ? str + pad : pad + str;
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
// [match, expr, index, prop, flags, width, width-idx, width-prop, fill, precision, precision-idx, precision-prop, shorten-suffix, type]


const paramIdxR = `(\\d+|\\$|@)`,
      paramPropR = `(?:\\{((?:[a-zA-Z$_][\\w$_]*|\\[(?:\\d+|"(?:[^\\\\"]|\\\\.)*"|'(?:[^\\\\']|\\\\.)*')\\])(?:\\.[a-zA-Z$_][\\w$_]*|\\[(?:\\d+|"(?:[^\\\\"]|\\\\.)*"|'(?:[^\\\\']|\\\\.)*')\\])*)\\})`,
      widthR = `(?:([1-9]\\d*)|&${paramIdxR}${paramPropR})`,
      fillR = `(?:=(.))`,
      shortenSuffixR = `(?:="((?:[^\\\\"]|\\\\.)*)")`,
      formatReg = new RegExp(`\\\\.|(\\{${paramIdxR}?${paramPropR}?(?::([#,+\\- 0]*)(?:${widthR}${fillR}?)?(?:\\.${widthR}${shortenSuffixR}?)?)?([a-zA-Z_][a-zA-Z0-9_$]*)?\\})`, 'g'); //========================================================================================

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
  const start = offset;
  getParam = getParam || defaultGetParam;
  return fmt.replace(formatReg, function (s, m, param, paramProp, flags, width, widx, wprop, fill, precision, pidx, pprop, shortenSuffix, type) {
    if (!m) return s.charAt(1);
    return getFormatter(type)(parseParam(param || '$', paramProp), parseFlags(flags), parseWidth(width, widx, wprop) || 0, fill, parseWidth(precision, pidx, pprop), shortenSuffix);
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
    const strs = new Array(i);

    while (i--) strs[i] = `"${escapeStr(path[i])}"`;

    return `${GET_PROP_VAR}(${code}, [${strs.join(', ')}])`;
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
    lastIdx < mStart && pushStr(cutStr(fmt, lastIdx, mStart), 0);

    if (m[1]) {
      codes[i] = `arr[${i}](arguments, ${STATE_VAR})`;
      arr[i++] = createFormatter(m, getParam || defaultGetParam);
    } else {
      pushStr(m[0].charAt(1), i);
    }

    lastIdx = mEnd;
  }

  lastIdx < fmt.length && pushStr(cutStr(fmt, lastIdx), i);
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
  return function (val, flags, width, fill, precision, shortenSuffix) {
    const str = toStr(val, flags);
    return width > str.length ? __pad(str, width, fill, flags & FORMAT_LEFT) : shorten(str, precision, shortenSuffix);
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
  j: strFormatter(v => v === undefined || isFn(v) || v.toJSON && v.toJSON() === undefined ? toStr(v) : JSON.stringify(v)),

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
 * @module utility
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 15:24:47 GMT+0800 (China Standard Time)
 * @modified Tue Feb 19 2019 11:53:18 GMT+0800 (China Standard Time)
 */
const REG_PROPS = ['source', 'global', 'ignoreCase', 'multiline'];
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
  let i = props.length;

  while (i--) if (actual[props[i]] !== expected[props[i]]) {
    return false;
  }

  return true;
}

function eqArray(actual, expected, eq) {
  let i = actual.length;

  if (i !== expected.length) {
    return false;
  }

  while (i--) if (!eq(actual[i], expected[i])) {
    return false;
  }

  return true;
}

function eqObj(actual, expected) {
  const cache = create(null);
  let k;

  for (k in actual) {
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
 * @modified Tue Feb 19 2019 10:38:22 GMT+0800 (China Standard Time)
 */
const formatters$1 = [],
      formatArgHandlers = [];

function parseMessage(msg, args, msgIdx) {
  let fs = formatters$1[msgIdx];

  if (!fs) {
    formatArgHandlers[msgIdx] = (args, offset) => args[0][offset >= msgIdx ? offset + 1 : offset];

    formatters$1[msgIdx] = fs = create(null);
  }

  return (fs[msg] || (fs[msg] = formatter(msg, msgIdx, formatArgHandlers[msgIdx])))(args);
}

const assert = function assert(msg) {
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
}

// [condition, argcount?, [msg, not msg], Error]
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

const UNDEFINED = TYPE_UNDEF,
      BOOLEAN = TYPE_BOOL,
      NUMBER = TYPE_NUM,
      STRING = TYPE_STRING,
      FUNCTION = TYPE_FN,
      NULL = 'null',
      INTEGER = 'integer',
      ARRAY = 'Array',
      TYPED_ARRAY = 'TypedArray';
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
  return `{${idx}:.80="..."j}`;
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
 * @modified Fri Feb 22 2019 16:45:27 GMT+0800 (China Standard Time)
 */
const DEFAULT_BINDING = '__list__';
//type ListNode = [ListElement, IListNode, IListNode, List]
class List {
  constructor(binding) {
    this.__length = 0;
    this.__scaning = false;
    this.binding = binding || DEFAULT_BINDING;
  }

  size() {
    return this.__length;
  }

  has(obj) {
    const node = obj[this.binding];
    return node ? node[0] === obj && node[3] === this : false;
  }
  /**
   *
   * @param obj
   * @return new length
   */


  add(obj) {
    return this.__insert(obj, this.__tail);
  }
  /**
   *
   * @param obj
   * @return new length
   */


  addFirst(obj) {
    return this.__insert(obj);
  }
  /**
   *
   * @param obj
   * @return new length
   */


  insertAfter(obj, target) {
    return this.__insert(obj, target && this.__getNode(target));
  }
  /**
   *
   * @param obj
   * @return new length
   */


  insertBefore(obj, target) {
    return this.__insert(obj, target && this.__getNode(target)[1]);
  }
  /**
   *
   * @param objs
   * @return new length
   */


  addAll(objs) {
    return this.__insertAll(objs, this.__tail);
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
    const node = this.__head;
    return node && node[0];
  }

  last() {
    const node = this.__tail;
    return node && node[0];
  }

  each(cb, scope) {
    if (this.__length) {
      assert.not(this.__scaning, 'Nested calls are not allowed.');
      this.__scaning = true;
      cb = bind(cb, scope);
      var node = this.__head;

      while (node) {
        if (node[3] === this && cb(node[0]) === false) break;
        node = node[2];
      }

      this.__doLazyRemove();

      this.__scaning = false;
    }
  }

  toArray() {
    const array = new Array(this.__length);
    let node = this.__head,
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


  remove(obj) {
    return this.__remove(this.__getNode(obj));
  }

  pop() {}

  clean() {
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
  }

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
      node.toJSON = EMPTY_FN;
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
      nodeTail[2] = next = this.__head;
      this.__head = nodeHead;
    }

    if (next) next[1] = nodeTail;else this.__tail = nodeTail;
    return this.__length += len;
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
    this.__scaning ? this.__lazyRemove(node) : this.__doRemove(node);
    return --this.__length;
  }

  __lazyRemove(node) {
    const {
      __lazyRemoves: lazyRemoves
    } = this;
    node[0][this.binding] = undefined; // unbind this node

    node[3] = null;

    if (lazyRemoves) {
      lazyRemoves.push(node);
    } else {
      this.__lazyRemoves = [node];
    }
  }

  __doLazyRemove() {
    const {
      __lazyRemoves: lazyRemoves
    } = this;

    if (lazyRemoves) {
      var len = lazyRemoves.length;

      if (len) {
        if (this.__length) {
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
      this.__head = next;
    }

    if (next) {
      next[1] = prev;
    } else {
      this.__tail = prev;
    }

    node[1] = node[2] = node[3] = null;
  }

  __clean() {
    let node,
        next = this.__head;

    while (node = next) {
      next = node[2];
      node.length = 1;
    }

    this.__head = undefined;
    this.__tail = undefined;
    this.__length = 0;
  }

}
List.binding = DEFAULT_BINDING;

/**
 * Function List
 * @module utility/List
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Mon Dec 11 2017 14:35:32 GMT+0800 (China Standard Time)
 * @modified Thu Feb 28 2019 09:50:35 GMT+0800 (China Standard Time)
 */
const DEFAULT_FN_BINDING = '__flist_id__';
const DEFAULT_SCOPE_BINDING = DEFAULT_FN_BINDING;
class FnList {
  constructor(fnBinding, scopeBinding) {
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


  add(fn, scope, data) {
    scope = parseScope(scope);
    const {
      __list: list,
      __nodeMap: nodeMap
    } = this;
    const id = this.id(fn, scope);
    let node = nodeMap[id];

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


  removeId(id) {
    const {
      __list: list,
      __nodeMap: nodeMap
    } = this;
    const node = nodeMap[id];

    if (node) {
      nodeMap[id] = undefined;
      return list.remove(node);
    }

    return -1;
  }

  remove(fn, scope) {
    return this.removeId(this.id(fn, parseScope(scope)));
  }

  has(fn, scope) {
    return !!this.__nodeMap[this.id(fn, parseScope(scope))];
  }

  size() {
    return this.__list.size();
  }

  clean() {
    this.__nodeMap = create(null);

    this.__list.clean();
  }

  each(cb, scope) {
    cb = cb.bind(scope);

    this.__list.each(node => cb(node[1], node[2], node[3], node));
  }

  id(fn, scope) {
    const {
      fnBinding,
      scopeBinding
    } = this;
    let fnId = fn[fnBinding],
        scopeId = scope ? scope[scopeBinding] : DEFAULT_SCOPE_ID;
    if (!fnId) fnId = defPropValue(fn, fnBinding, ++fnIdGenerator, false, false, false);
    if (!scopeId) scopeId = defPropValue(scope, scopeBinding, ++scopeIdGenerator, false, false, false);
    return `${fnId}#${scopeId}`;
  }

}
FnList.fnBinding = DEFAULT_FN_BINDING;
FnList.scopeBinding = DEFAULT_SCOPE_BINDING;
const DEFAULT_SCOPE_ID = 1;
let scopeIdGenerator = 1,
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
 * @modified Thu Jan 31 2019 16:34:55 GMT+0800 (China Standard Time)
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

if (typeof MutationObserver === TYPE_FN) {
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
const LINE_REG = /([^\n]+)?(\n|$)/g;
class Source {
  constructor(buff) {
    this.buff = buff;
    this.len = buff.length;
    this.__lines = [];
    this.__linePos = 0;
  }

  position(offset) {
    const {
      buff,
      len,
      __lines: lines,
      __linePos: linePos
    } = this;
    let i = lines.length,
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
  }

  source(escape) {
    const {
      buff
    } = this;
    let line = 1,
        toSourceStr = escape ? escapeSourceStr : sourceStr;
    return buff.replace(LINE_REG, (m, s, t) => pad(String(line++), 3) + ': ' + toSourceStr(m, s, t));
  }

}

function sourceStr(m, s, t) {
  return m || '';
}

function escapeSourceStr(m, s, t) {
  return s ? escapeStr(s) + t : t;
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
  let i;

  if (isStr(codes)) {
    i = codes.length;

    while (i--) eachCharCode(charCode(codes, i), ignoreCase, cb);
  } else if (isArray(codes)) {
    i = codes.length;

    while (i--) eachCharCodes(codes[i], ignoreCase, cb);
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
  return function mixin(Class) {
    const proto = Class.prototype;

    for (var k in behaviour) if (hasOwnProp(behaviour, k)) proto[k] = behaviour[k];

    return Class;
  };
}

var _dec, _class, _dec2, _class2;
let MatchError = (_dec = mixin({
  $ruleErr: true
}), _dec(_class = class MatchError {
  constructor(msg, capturable, source, context, rule) {
    !isBool(capturable) && (capturable = rule.capturable);
    this.capturable = capturable && source ? source.capturable : capturable;
    this.msg = msg;
    this.source = source;
    this.target = source ? source.target : this;
    this.context = context;
    this.rule = rule;
    this.pos = context.startPos();
  }

  position() {
    return this.context.source.position(this.pos);
  }

}) || _class);

function defaultErr(err) {
  return err;
}

function defaultMatch(data, len, context) {
  context.add(data);
}

let idGen = 0;
/**
 * Abstract Rule
 */

let Rule = (_dec2 = mixin({
  $rule: true
}), _dec2(_class2 = class Rule {
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
  constructor(name, options) {
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


  mkErr(msg, context, capturable, source) {
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


  error(msg, context, src, capturable) {
    const err = this.mkErr(msg, context, capturable, src);
    const userErr = this.onErr(err, context, this);
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


  matched(data, len, context) {
    const err = this.onMatch(data, len, context, this);
    if (err) return err.$ruleErr ? err : this.mkErr(String(err), context, false);
  }

  enter(context) {
    return context.create();
  }
  /**
   * match
   * @param context match context
   */


  match(context) {
    return assert();
  }
  /**
   * get start char codes
   */


  getStart(stack) {
    return this.startCodes;
  }
  /**
   * prepare test before match
   */


  test(context) {
    return true;
  }

  startCodeTest(context) {
    return this.startCodeIdx[context.nextCode()];
  }

  setStartCodes(start, ignoreCase) {
    const codes = [],
          index = [];
    eachCharCodes(start, ignoreCase, code => {
      if (!index[code]) {
        codes.push(code);
        index[code] = code;
      }
    });
    this.startCodes = codes;
    this.setCodeIdx(index);
  }

  setCodeIdx(index) {
    if (index.length > 1) {
      this.startCodeIdx = index;
      this.test = this.startCodeTest;
    }
  } //──── for debug ─────────────────────────────────────────────────────────────────────────

  /**
   * make rule expression
   * @param expr expression text
   */


  mkExpr(expr) {
    return `<${this.type}: ${expr}>`;
  }
  /**
   * set rule expression
   * 		1. make rule expression
   * 		2. make Expect text
   */


  setExpr(expr) {
    this.expr = this.mkExpr(expr);
    this.EXPECT = `Expect: ${expr}`;
  }

  getExpr(stack) {
    return this.name || this.expr;
  }
  /**
   * toString by name or expression
   */


  toString() {
    return this.getExpr();
  }

}) || _class2);

/**
 * @module utility/AST
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Nov 06 2018 10:06:22 GMT+0800 (China Standard Time)
 * @modified Sat Dec 22 2018 15:11:19 GMT+0800 (China Standard Time)
 */

/**
 * Match Rule Interface
 */
class MatchRule extends Rule {
  /**
   * @param name 			match name
   * @param start 		start char codes, prepare test by start char codes before match
   * @param ignoreCase	ignore case for the start char codes
   * @param options		Rule Options
   */
  constructor(name, start, ignoreCase, options) {
    super(name, options);
    this.setStartCodes(start, ignoreCase);
  }
  /**
   * consume matched result
   * @param data 		matched result
   * @param len 		matched chars
   * @param context 	match context
   */


  comsume(data, len, context) {
    context.advance(len);
    return this.matched(data, len, context);
  }

}

var _dec$1, _class$1;
/**
 * match a character in the allowed list
 * > well match any character if the allowed list is empty
 *
 * > must call test() before match
 */

let CharMatchRule = (_dec$1 = mixin({
  type: 'Character'
}), _dec$1(_class$1 = class CharMatchRule extends MatchRule {
  /**
   * @param name 			match name
   * @param allows 		allowed character codes for match
   * 						well match any character if the allowed list is empty
   * @param ignoreCase	ignore case for the allowed character codes
   * @param options		Rule Options
   */
  constructor(name, allows, ignoreCase, options) {
    super(name, allows, ignoreCase, options); // generate expression for debug

    const codes = this.startCodes;
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

}) || _class$1);

var _dec$2, _class$2;
/**
 * match string by RegExp
 *
 * optimization:
 * - Priority use sticky mode {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/sticky}
 *
 */

let RegMatchRule = (_dec$2 = mixin({
  type: 'RegExp'
}), _dec$2(_class$2 = class RegMatchRule extends MatchRule {
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
  constructor(name, regexp, pick, start, options) {
    pick = pick === false || isInt(pick) ? pick : !!pick || 0;
    const sticky = stickyReg && !pick,
          // use exec mode when need pick match group data
    pattern = regexp.source,
          ignoreCase = regexp.ignoreCase; // always wrapping in a none capturing group preceded by '^' to make sure
    // matching can only work on start of input. duplicate/redundant start of
    // input markers have no meaning (/^^^^A/ === /^A/)
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/sticky
    // When the y flag is used with a pattern, ^ always matches only at the
    // beginning of the input, or (if multiline is true) at the beginning of a
    // line.

    regexp = new RegExp(sticky ? pattern : `^(?:${pattern})`, (ignoreCase ? 'i' : '') + (regexp.multiline ? 'm' : '') + (sticky ? 'y' : ''));
    super(name, start, ignoreCase, options);
    this.regexp = regexp;
    this.pick = pick;
    this.match = sticky ? this.stickyMatch : this.execMatch;
    sticky ? this.spicker = pick === false ? pickNone : pickTestStr : this.picker = mkPicker(pick);
    this.setExpr(pattern);
  }
  /**
   * match on sticky mode
   */


  stickyMatch(context) {
    const reg = this.regexp,
          buff = context.buff(),
          start = context.offset();
    reg.lastIndex = start;
    let len;
    return reg.test(buff) ? (len = reg.lastIndex - start, this.comsume(this.spicker(buff, start, len), len, context)) : this.error(this.EXPECT, context);
  }
  /**
   * match on exec mode
   */


  execMatch(context) {
    const m = this.regexp.exec(context.buff(true));
    return m ? this.comsume(this.picker(m), m[0].length, context) : this.error(this.EXPECT, context);
  }

}) || _class$2);
const cache = create(null);

function mkPicker(pick) {
  return cache[pick] || (cache[pick] = pick === false ? pickNone : pick === true ? pickAll : pick >= 0 ? createFn(`return m[${pick}]`, ['m'], `pick_${pick}`) : createFn(`return ${mapArray(new Array(-pick), (v, i) => `m[${i + 1}]`).join(' || ')}`, ['m'], `pick_1_${-pick}`));
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
let StringMatchRule = (_dec$3 = mixin({
  type: 'String'
}), _dec$3(_class$3 = class StringMatchRule extends RegMatchRule {
  /**
   * @param name 			match name
   * @param str 			match string
   * @param ignoreCase	ignore case
   * @param options		Rule Options
   */
  constructor(name, str, ignoreCase, options) {
    super(name, new RegExp(reEscape(str), ignoreCase ? 'i' : ''), 0, charCode(str), options);
    this.setExpr(str);
  }

}) || _class$3);

/**
 * @module utility/AST
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Dec 11 2018 15:36:42 GMT+0800 (China Standard Time)
 * @modified Sat Dec 22 2018 16:32:31 GMT+0800 (China Standard Time)
 */

/**
 * Match Context of Rule
 */
class MatchContext {
  // start offset of original buff
  // parent context
  // matched result list
  // template buff
  // current offset of template buff
  // current offset of original buff
  // advanced characters
  // cached character
  constructor(source, buff, offset, orgOffset, parent) {
    this.source = source;
    this.parent = parent;
    this.result = [];
    this.__buff = buff;
    this.__offset = offset;
    this.__orgOffset = orgOffset;
    this.__advanced = 0;
    parent ? (this.__code = parent.__code, this.data = parent.data) : this.__flushCode();
  }

  __flushCode() {
    const {
      __buff: buff,
      __offset: offset
    } = this;
    this.__code = offset < buff.length ? charCode(buff, offset) : 0;
  }
  /**
   * create sub Context
   */


  create() {
    return new MatchContext(this.source, this.__buff, this.__offset, this.__orgOffset + this.__advanced, this);
  }

  __setAdvanced(advanced) {
    assert.notLess(advanced, 0);
    const offset = this.__offset - this.__advanced + advanced;

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


  commit() {
    const {
      __advanced: advanced
    } = this;
    this.parent.advance(advanced);
    this.__orgOffset += advanced;
    this.__advanced = 0;
    this.data = null;
  }
  /**
   * marge context state
   */


  margeState(context) {
    this.__setAdvanced(context.__orgOffset + context.__advanced - this.__orgOffset);
  }
  /**
   * rollback state and result
   * @param checkpoint 	rollback to checkpoint
   */


  rollback(checkpoint) {
    let advanced = 0,
        resultLen = 0;
    checkpoint && (advanced = checkpoint[0], resultLen = checkpoint[1]);

    this.__setAdvanced(advanced);

    const {
      result
    } = this;
    if (result.length > resultLen) result.length = resultLen;
  }
  /**
   * get a check point
   */


  checkpoint() {
    return [this.__advanced, this.result.length];
  }
  /**
   * advance buffer position
   */


  advance(i) {
    this.__offset += i;
    this.__advanced += i;

    this.__flushCode();
  }
  /**
   * advanced buff length
   */


  advanced() {
    return this.__advanced;
  }
  /**
   * get buffer
   * @param reset reset buffer string from 0
   */


  buff(reset) {
    let {
      __buff: buff
    } = this;

    if (reset) {
      this.__buff = buff = cutStr(buff, this.__offset);
      this.__offset = 0;
    }

    return buff;
  }

  orgBuff() {
    return this.source.buff;
  }

  offset() {
    return this.__offset;
  }

  startPos() {
    return this.__orgOffset;
  }

  currPos() {
    return this.__orgOffset + this.__advanced;
  }

  pos() {
    const {
      __orgOffset: offset
    } = this;
    return [offset, offset + this.__advanced];
  }
  /**
   * get next char code
   * @return number char code number
   */


  nextCode() {
    return this.__code;
  }

  nextChar() {
    return char(this.__code);
  } //──── result opeartions ───────────────────────────────────────────────────────────────────

  /**
   * append result
   */


  add(data) {
    const {
      result
    } = this;
    result[result.length] = data;
  }
  /**
   * append resultset
   */


  addAll(data) {
    const {
      result
    } = this;
    const len = result.length;
    let i = data.length;

    while (i--) result[len + i] = data[i];
  }
  /**
   * get result size
   */


  resultSize() {
    return this.result.length;
  }

}

/**
 * @module utility/AST
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Nov 06 2018 10:06:22 GMT+0800 (China Standard Time)
 * @modified Sat Dec 22 2018 15:24:21 GMT+0800 (China Standard Time)
 */
const MAX = -1 >>> 0;
/**
 * Abstract Complex Rule
 */

class ComplexRule extends Rule {
  /**
   * @param name 			match name
   * @param builder 		callback of build rules
   * @param options		Rule Options
   */
  constructor(name, repeat, builder, options) {
    super(name, options);
    let [rMin, rMax] = repeat;
    rMin < 0 && (rMin = 0);
    rMax <= 0 && (rMax = MAX);
    assert.notGreater(rMin, rMax);
    this.rMin = rMin;
    this.rMax = rMax;
    this.builder = builder;

    if (rMin !== rMax || rMin !== 1) {
      this.match = this.rmatch; // for debug

      this.type = `${this.type}[${rMin}${rMin === rMax ? '' : ` - ${rMax === MAX ? 'MAX' : rMax}`}]`;
    }
  }

  parse(buff, data) {
    const ctx = new MatchContext(new Source(buff), buff, 0, 0);
    ctx.data = data;
    let err = this.match(ctx);

    if (err) {
      const msg = [];
      var pos;

      do {
        pos = err.position();
        msg.unshift(`[${pad(String(pos[0]), 3)}:${pad(String(pos[1]), 2)}] - ${err.rule.toString()}: ${err.msg} on "${escapeStr(pos[2])}"`);
      } while (err = err.source);

      msg.push('[Source]', ctx.source.source());
      throw new SyntaxError(msg.join('\n'));
    }

    return ctx.result;
  }

  init() {
    const rules = this.builder(this);
    let i = rules && rules.length;
    assert.is(i, `Require Complex Rules`);
    this.rules = rules; // generate expression and expect string for debug

    const names = this.rnames(rules);
    this.setExpr(names.join(this.split));

    while (i--) names[i] = `Expect[${i}]: ${names[i]}`;

    this.EXPECTS = names;

    this.__init(rules);

    this.builder = null;
    return this;
  }

  __init(rules) {}

  rmatch(context) {
    return assert();
  }

  setCodeIdx(index) {
    this.rMin && super.setCodeIdx(index);
  }

  getRules() {
    return this.rules || (this.init(), this.rules);
  }

  getStart(stack) {
    const {
      id,
      startCodes
    } = this;
    return startCodes ? startCodes : stack && ~idxOfArray(stack, id) || this.rules ? [] : (this.init(), this.startCodes);
  }

  consume(context) {
    const err = this.matched(context.result, context.advanced(), context.parent);
    !err && context.commit();
    return err;
  } // for debug


  rnames(rules, stack) {
    let i = rules.length;
    const names = new Array(i),
          id = this.id;

    while (i--) names[i] = rules[i].getExpr(stack ? stack.concat(id) : [id]);

    return names;
  }

  getExpr(stack) {
    const {
      id,
      name
    } = this;
    let i;
    return name ? name : stack ? ~(i = idxOfArray(stack, id)) ? `<${this.type} -> $${stack[i]}>` : this.mkExpr(this.rnames(this.getRules(), stack).join(this.split)) : this.expr;
  }

}

var _dec$4, _class$4;
/**
 * AND Complex Rule
 */

let AndRule = (_dec$4 = mixin({
  type: 'And',
  split: ' '
}), _dec$4(_class$4 = class AndRule extends ComplexRule {
  __init(rules) {
    this.setStartCodes(rules[0].getStart([this.id]));
  }

  match(context) {
    const rules = this.getRules(),
          len = rules.length,
          ctx = context.create();
    let err,
        i = 0;

    for (; i < len; i++) if (err = this.testRule(rules[i], i, ctx)) return err;

    return this.consume(ctx);
  }

  rmatch(context) {
    const {
      rMin,
      rMax
    } = this;
    const rules = this.getRules(),
          len = rules.length,
          ctx = context.create();
    let err,
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
  }

  testRule(rule, i, ctx) {
    let err;

    if (!rule.test(ctx)) {
      return this.error(this.EXPECTS[i], ctx);
    } else if (err = rule.match(ctx)) {
      return this.error(this.EXPECTS[i], ctx, err);
    } // return (!rule.test(ctx) || (err = rule.match(ctx))) && (err = this.error(this.EXPECTS[i], ctx, err))

  }

}) || _class$4);

var _dec$5, _class$5;
/**
 * OR Complex Rule
 */

let OrRule = (_dec$5 = mixin({
  type: 'Or',
  split: ' | '
}), _dec$5(_class$5 = class OrRule extends ComplexRule {
  __init(rules) {
    const {
      id
    } = this;
    const len = rules.length,
          starts = [],
          // all distinct start codes
    rStarts = [],
          // start codes per rule
    index = [[] // rules which without start code
    ];
    let i, j, k, codes; // get start codes of all rules

    for (i = 0; i < len; i++) {
      rStarts[i] = []; // init rule start codes

      eachCharCodes(rules[i].getStart([id]), false, code => {
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


    const startCodes = !index[0].length && starts;
    this.startCodes = startCodes || [];
    startCodes && this.setCodeIdx(index);
    this.index = index;
  }

  match(context) {
    const index = this.index || (this.init(), this.index),
          rules = index[context.nextCode()] || index[0],
          len = rules.length,
          ctx = context.create();
    let err,
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
  }

  rmatch(context) {
    const {
      rMin,
      rMax
    } = this;
    const index = this.index || (this.init(), this.index),
          ctx = context.create();
    let rules,
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
  }

}) || _class$5);

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

const discardMatch = EMPTY_FN;
function appendMatch(data, len, context) {
  context.addAll(data);
}
function attachMatch(val) {
  const callback = isFn(val) ? val : () => val;
  return (data, len, context, rule) => {
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
  let name,
      pattern,
      regexp,
      pick = 0,
      startCodes,
      ignoreCase = false,
      options;

  if (isObj(args[0])) {
    const desc = args[0],
          p = desc.pattern;

    if (isReg(p)) {
      regexp = p;
      pick = desc.pick;
      startCodes = desc.startCodes;
    } else if (isStrOrCodes(p)) {
      pattern = p;
      ignoreCase = desc.ignoreCase;
    }

    name = desc.name;
    options = desc;
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
  const C = isStr(pattern) && pattern.length > 1 ? StringMatchRule : CharMatchRule;
  return new C(name, pattern, ignoreCase, options);
} //========================================================================================

/*                                                                                      *
 *                                 complex rule builder                                 *
 *                                                                                      */
//========================================================================================


function mkComplexRule(args, Rule, defaultRepeat) {
  let name, builder, rules, repeat, options;

  if (isObj(args[0])) {
    const desc = args[0],
          r = desc.rules;
    if (isArray(r) || isFn(r)) rules = r;
    repeat = desc.repeat;
    name = desc.name;
    options = desc;
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
    return mapArray(isFn(rules) ? rules(_rule) : rules, (r, i) => {
      if (!r) return SKIP;
      let rule = r.$rule ? r : mkMatch(isArray(r) ? r : [r], discardMatch);
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
  const options = {};
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
 * @modified Mon Feb 18 2019 14:52:12 GMT+0800 (China Standard Time)
 */

/**
 * @module observer
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Dec 26 2018 13:59:10 GMT+0800 (China Standard Time)
 * @modified Wed Feb 27 2019 13:12:54 GMT+0800 (China Standard Time)
 */

function checkObserverTarget(obj) {
  return obj && isArray(obj) || isObj(obj);
}

const dirtyQueue = [],
      notifyQueue = [];
const SUBJECT_ENABLED_FLAG = 0x2,
      SUBJECT_LISTEN_FLAG = 0x4,
      SUBJECT_SUB_FLAG = 0x8;
let listenerIdGen = 1;
/**
 * @ignore
 */

class Subject {
  // parent subject
  // own observer
  // property
  // binded observer
  // property path
  // listeners
  // sub-subjects
  // cache of sub-subjects

  /**
   *
   * @param owner
   * @param prop
   * @param binded
   * @param parent
   */
  constructor(owner, prop, parent) {
    this.__owner = owner;
    this.__prop = prop;
    this.__parent = parent;
    this.__flags = 0;
  }

  __initSubObserver() {
    const {
      __observer: observer,
      __prop: prop
    } = this;

    if (observer) {
      const target = observer.target[prop];

      if (checkObserverTarget(target)) {
        var subObserver = target[OBSERVER_KEY];

        if (!subObserver || !(subObserver.target === target || subObserver.proxy === target)) {
          subObserver = observer.observerOf(target);
        }

        if (subObserver.proxy !== target) {
          observer.target[prop] = subObserver.proxy;
        }

        return subObserver;
      }
    }
  }
  /**
   * get sub-subject from cache
   * @param prop property
   */


  __getSub(prop) {
    const {
      __subCache: subCache
    } = this;
    return subCache && subCache[prop];
  }

  __badArrayPath(i, msg) {
    const path = this.__getPath();

    console.error(`bad path[{}]: not support {} on Array{}{}.`, formatPath(path), formatPath(path.slice(-i)), path.length > i ? `[${formatPath(path.slice(0, -i))}]` : '', msg || '', this.__owner.target);
  }
  /**
   * bind observer
   * @param observer new observer
   * @return binded observer
   */


  __bind(observer) {
    const {
      __observer: org
    } = this;

    if (org !== observer) {
      org && org.__unwatch(this); // unbind old observer

      if (observer) {
        if (observer.isArray && !ARRAY_EVENTS[this.__prop]) {
          this.__badArrayPath(1, ', change to "change" or "length"');

          observer = undefined;
        } else {
          observer.__watch(this);
        }
      }

      this.__observer = observer;
      return observer;
    }
  }
  /**
   * create or get sub-subject on cache
   * @param subProp	property
   * @param binded	binded observer
   */


  __addSub(subProp) {
    // get or init cache and subs
    const subCache = this.__subCache || (this.__subs = [], this.__subCache = create(null)),
          // get or create sub-subject on cache
    sub = subCache[subProp] || (subCache[subProp] = new Subject(this.__owner, subProp, this));

    if (!(sub.__flags & SUBJECT_ENABLED_FLAG)) {
      const {
        __subs: subs
      } = this; // attach sub-subject

      sub.__flags |= SUBJECT_ENABLED_FLAG;
      subs.push(sub);
      const {
        __observer: observer
      } = this;

      if (observer) {
        if (observer.isArray) {
          sub.__badArrayPath(2);
        } else {
          sub.__bind(subs[0] ? subs[0].__observer : this.__initSubObserver());
        }
      }
    }

    this.__flags |= SUBJECT_SUB_FLAG | SUBJECT_ENABLED_FLAG;
    return sub;
  }
  /**
   * add listener
   */


  __listen(path, listener, scope) {
    let {
      __listeners: listeners
    } = this;

    if (!listeners) {
      this.__listeners = listeners = new FnList();
      this.__path = path;
    }

    const id = listeners.add(listener, scope, listenerIdGen++);
    id && (this.__flags |= SUBJECT_LISTEN_FLAG | SUBJECT_ENABLED_FLAG);
    return id;
  }
  /**
   * remove sub-subject
   * @param subject subject
   */


  __removeSub(subject) {
    const {
      __subs: subs
    } = this;
    const l = subs.length;
    let i = l;

    while (i--) {
      if (subject === subs[i]) {
        subs.splice(i, 1);
        l === 1 && (this.__flags &= ~SUBJECT_SUB_FLAG);
        return;
      }
    }

    assert('un-attached subject');
  }
  /**
   * check subject state
   */


  ____unlisten(listeners) {
    if (!listeners.size()) {
      var subject = this,
          parent;
      subject.__flags &= ~SUBJECT_LISTEN_FLAG;

      while ((subject.__flags & (SUBJECT_SUB_FLAG | SUBJECT_LISTEN_FLAG | SUBJECT_ENABLED_FLAG)) === SUBJECT_ENABLED_FLAG) {
        subject.__bind();

        subject.__flags = 0;
        if (!(parent = subject.__parent)) break;

        parent.__removeSub(subject);

        subject = parent;
      }
    }
  }
  /**
   * remove listener
   */


  __unlisten(listener, scope) {
    const {
      __listeners: listeners
    } = this;

    if (listeners) {
      listeners.remove(listener, scope);

      this.____unlisten(listeners);
    }
  }
  /**
   * remove listener by id
   */


  __unlistenId(id) {
    const {
      __listeners: listeners
    } = this;

    if (listeners) {
      listeners.removeId(id);

      this.____unlisten(listeners);
    }
  }

  __collect(dirty) {
    const {
      __flags: flags
    } = this;

    if (flags & SUBJECT_LISTEN_FLAG) {
      !this.__notifyDirty && notifyQueue.push(this);
      this.__notifyDirty = dirty;
    }

    if (flags & SUBJECT_SUB_FLAG) {
      const {
        __subs: subs
      } = this;

      const l = subs.length,
            subObserver = this.__initSubObserver();

      subObserver && (dirty[0] = subObserver.proxy);

      for (var i = 0; i < l; i++) {
        subs[i].__collectDep(subObserver, dirty[0]);
      }
    }
  }

  __collectDep(observer, value) {
    const {
      __observer: org
    } = this;

    if (org !== observer) {
      const {
        __prop: prop
      } = this;
      var {
        __dirty: dirty
      } = this;

      this.__bind(observer);

      if (dirty) {
        this.__dirty = null;
      } else {
        dirty = this.__notifyDirty || [, org && org.__value(prop)];
      }

      dirty[0] = observer ? observer.__value(prop) : isNil(value) ? undefined : value[prop];

      this.__collect(dirty);
    }
  }
  /**
   * notify change
   * @param value
   * @param original
   */


  __notify(value, original) {
    const {
      __dirty: dirty
    } = this;

    if (dirty) {
      dirty[0] = value;
    } else {
      this.__dirty = [value, original];
      const l = dirtyQueue.length;
      dirtyQueue[l] = this;
      !l && nextTick(notify);
    }
  }

  __getPath() {
    let path = this.__path;

    if (!path) {
      const {
        __parent: parent,
        __prop: prop
      } = this;
      this.__path = path = parent ? parent.__getPath().concat(prop) : [prop];
    }

    return path;
  }

}

function notify() {
  let start = Date.now(); // collect dirty subjects

  let subject,
      l = dirtyQueue.length,
      i = 0,
      dirty;

  for (; i < l; i++) {
    subject = dirtyQueue[i];

    if (dirty = subject.__dirty) {
      subject.__collect(dirty);

      subject.__dirty = null;
    }
  }

  console.log(`collect observed subjects: x${notifyQueue.length} use ${Date.now() - start}ms`);
  let changed = 0,
      listens = 0;
  start = Date.now(); // notify subject listeners

  let owner, path, value, original;
  l = notifyQueue.length;
  i = 0;

  for (; i < l; i++) {
    subject = notifyQueue[i];
    dirty = subject.__notifyDirty;
    value = dirty[0];
    original = dirty[1];
    subject.__notifyDirty = null;

    if (value !== original || !isPrimitive(value)) {
      owner = subject.__owner;
      path = subject.__path;

      subject.__listeners.each((fn, scope) => {
        scope ? fn.call(scope, path, value, original, owner) : fn(path, value, original, owner);
        listens++;
      });

      changed++;
    }
  }

  console.log(`notify changed subjects: x${changed}/${l}, listeners: x${listens} use ${Date.now() - start}ms`);
}

const OBSERVER_KEY = '__observer__';
class Observer {
  /**
   * original object
   */

  /**
   * proxy object
   */

  /**
   * is array
   */

  /**
   * subjects
   * 	- key: property of original object
   * 	- value: subject
   */

  /**
   * watched subjects
   * 	- key: property of original object
   * 	- value: subjects
   */

  /**
   * create Observer
   * @param target original object
   */
  constructor(target) {
    this.__watchs = create(null);
    this.target = target;
    this.proxy = target;
    if (this.isArray = isArray(target)) applyArrayHooks(target);
    assert.is(isObj(target), `the observer target can only be an object or an array`); // bind observer key on original object

    defPropValue(target, OBSERVER_KEY, this, false, false, false);
  }
  /**
   * observe property
   * @param propPath 	property path of original object, parse string path by {@link parsePath}
   * @param listener	callback
   * @param scope		scope of callback
   */


  observe(propPath, listener, scope) {
    const path = parsePath(propPath),
          subjects = this.__subjects || (this.__subjects = create(null)),
          prop0 = path[0];
    let subject = subjects[prop0] || (subjects[prop0] = new Subject(this, prop0)),
        i = 1,
        l = path.length;

    subject.__bind(this);

    for (; i < l; i++) {
      subject = subject.__addSub(path[i]);
    }

    return subject.__listen(path, listener, scope);
  }
  /**
   * @param propPath	property path on object
   * @param listener	listener
   * @param scope		scope of listener
   * @return >= 0: listener count on the property path of object
   * 			 -1: no listener
   */


  unobserve(propPath, listener, scope) {
    const subject = this.__getSubject(parsePath(propPath));

    subject && subject.__unlisten(listener, scope);
  }

  unobserveId(propPath, id) {
    const subject = this.__getSubject(parsePath(propPath));

    subject && subject.__unlistenId(id);
  }
  /**
   *
   * @param path
   */


  __getSubject(path) {
    const {
      __subjects: subjects
    } = this;
    let subject;

    if (subjects && (subject = subjects[path[0]])) {
      for (var i = 1, l = path.length; i < l; i++) {
        if (!(subject = subject.__getSub(path[i]))) break;
      }
    }

    return subject;
  }
  /**
   * update property value and notify changes
   * @param prop		property
   * @param value		new value
   * @param original	original value
   */


  update(prop, value, original) {
    const subjects = this.__watchs[prop];

    if (subjects && subjects.size()) {
      subjects.each(subject => subject.__notify(value, original));
    }
  }
  /**
   * get or create observer
   * @abstract
   * @protected
   */


  observerOf(target) {
    return assert('abstruct');
  }
  /**
   * watch subject
   * @private
   * @param subject
   */


  __watch(subject) {
    const {
      __watchs: watchs
    } = this;
    const {
      __prop: prop
    } = subject;
    const subjects = watchs[prop] || (watchs[prop] = new List());
    subjects.add(subject);
  }
  /**
   * remove watched subject
   * @private
   * @param subject
   */


  __unwatch(subject) {
    this.__watchs[subject.__prop].remove(subject);
  }
  /**
   * get property value
   * @private
   * @param prop property
   */


  __value(prop) {
    const {
      target
    } = this;
    return this.isArray && prop === ARRAY_CHANGE_PROP ? target : target[prop];
  }
  /**
   * @ignore
   */


  toJSON() {}

} //========================================================================================

/*                                                                                      *
 *                                      Array Hooks                                     *
 *                                                                                      */
//========================================================================================

const ARRAY_CHANGE_PROP = 'change',
      ARRAY_LENGTH_PROP = 'length',
      ARRAY_EVENTS = makeMap([ARRAY_CHANGE_PROP, ARRAY_LENGTH_PROP]),
      arrayHooks = mapArray('fill,pop,push,reverse,shift,sort,splice,unshift'.split(','), method => {
  const fn = Array[PROTOTYPE][method];
  return [method, function () {
    const array = this,
          len = array.length,
          rs = applyScope(fn, array, arguments),
          newlen = array.length,
          observer = array[OBSERVER_KEY];
    observer.update(ARRAY_CHANGE_PROP, array, array);
    if (len !== newlen) observer.update(ARRAY_LENGTH_PROP, newlen, len);
    return rs;
  }];
});
/**
 * apply observer hooks on Array
 * @param array
 */

function applyArrayHooks(array) {
  let hook,
      i = arrayHooks.length;

  while (i--) {
    hook = arrayHooks[i];
    defPropValue(array, hook[0], hook[1], false, false, false);
  }
} //========================================================================================

/*                                                                                      *
 *                                     test subject                                     *
 *                                                                                      */
//========================================================================================


const objIdGen = {};

function objId(obj, str) {
  return obj.id || (obj.id = str + '-' + (objIdGen[str] ? ++objIdGen[str] : objIdGen[str] = 1));
}

function subjectState(subject) {
  const path = [];
  let p = subject;

  while (p) {
    path.unshift(p.__prop);
    p = p.__parent;
  }

  const subs = subject.__subs && subject.__subs.length;

  const listeners = subject.__listeners && subject.__listeners.size();

  assert.is(!!(subs || listeners) === !!(subject.__flags & SUBJECT_ENABLED_FLAG));
  assert.is(!!subs === !!(subject.__flags & SUBJECT_SUB_FLAG));
  assert.is(!!listeners === !!(subject.__flags & SUBJECT_LISTEN_FLAG));
  assert.is(!subject.__observer || subject.__flags & SUBJECT_ENABLED_FLAG);
  return {
    id: objId(subject, 'subject'),
    path: formatPath(path),
    obj: JSON.stringify(subject.__owner.target),
    enabled: !!(subs || listeners),
    listeners: listeners,
    watched: subject.__observer && {
      id: objId(subject.__observer, 'observer'),
      obj: JSON.stringify(subject.__observer.target),
      watchs: watchs(subject.__observer)
    },
    subCache: subject.__subCache && map(subject.__subCache, subjectState),
    subs: subs && map(subject.__subs, sub => objId(sub, 'subject'))
  };
}

function observerState(observer) {
  return {
    id: objId(observer, 'observer'),
    obj: JSON.stringify(observer.target),
    watchs: watchs(observer),
    subjects: map(observer.__subjects, subj => subjectState(subj))
  };
}

function watchs(observer) {
  return map(observer.__watchs, w => w.toArray().map(s => objId(s, 'subject')).join(', '));
}

function logState(obs) {
  const state = observerState(obs);
  console.log(JSON.stringify(state, null, '  '));
}

let obs = new Observer({
  a: {
    b: {
      c: 1
    }
  }
});
let id1 = obs.observe('a.b.c', () => {});
let id2 = obs.observe('a.b.d', () => {}); //logState(obs)

obs.unobserveId('a.b.c', id1);
obs.unobserveId('a.b.c', id1); //logState(obs)

obs.unobserveId('a.b.d', id2); //logState(obs)

id1 = obs.observe('a.b.c', function () {
  console.log('a.b.c', arguments);
});
id2 = obs.observe('a.b.d', function () {
  console.log('a.b.d', arguments);
}); //logState(obs)

const ov = obs.target['a'];
obs.target['a'] = {
  b: {
    d: 2
  }
};
obs.update('a', obs.target['a'], ov);
setTimeout(function () {
  logState(obs);
}, 1000);
logState(obs);

/**
 * @module observer
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Fri Mar 01 2019 18:17:27 GMT+0800 (China Standard Time)
 * @modified Fri Mar 01 2019 18:17:50 GMT+0800 (China Standard Time)
 */

/**
 *
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @module main
 * @preferred
 * @created Wed Nov 21 2018 10:21:20 GMT+0800 (China Standard Time)
 * @modified Fri Mar 01 2019 18:20:02 GMT+0800 (China Standard Time)
 */

export { createFn, applyScope, applyNoScope, applyScopeN, applyNoScopeN, apply, applyN, fnName, bind, eq, isNull, isUndef, isNil, isBool, isNum, isStr, isFn, isInt, isPrimitive, instOf, is, isBoolean, isNumber, isString, isDate, isReg, isArray, isTypedArray, isArrayLike, isObj, isBlank, stickyReg, unicodeReg, reEscape, prototypeOf, protoProp, protoOf, __setProto, setProto, getOwnProp, hasOwnProp, propDescriptor, propAccessor, defProp, defPropValue, parsePath, formatPath, get, set, charCode, char, cutStr, cutLStr, trim, upper, lower, upperFirst, lowerFirst, escapeStr, pad, shorten, thousandSeparate, binarySeparate, octalSeparate, hexSeparate, plural, singular, FORMAT_XPREFIX, FORMAT_PLUS, FORMAT_ZERO, FORMAT_SPACE, FORMAT_SEPARATOR, FORMAT_LEFT, extendFormatter, getFormatter, vformat, format, formatter, create, doAssign, assign, assignIf, defaultAssignFilter, assignIfFilter, makeArray, STOP, eachProps, eachArray, eachObj, each, SKIP, mapArray, mapObj, map, idxOfArray, idxOfObj, idxOf, reduceArray, reduceObj, reduce, keys, values, arr2obj, makeMap, List, FnList, nextTick, clearTick, Source, discardMatch, appendMatch, attachMatch, match, and, any, many, option, or, anyOne, manyOne, optionOne, OBSERVER_KEY, Observer };
//# sourceMappingURL=argilo.esm.dev.js.map
