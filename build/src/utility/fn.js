/**
 * Function utilities
 * @module utility
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Mon Dec 11 2017 13:57:32 GMT+0800 (China Standard Time)
 * @modified Fri Nov 23 2018 11:18:33 GMT+0800 (China Standard Time)
 */
exports.__esModule = true;
var consts_1 = require("./consts");
var is_1 = require("./is");
// ========================================================================================
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
    return name
        ? Function("return function " + name + "(" + (args ? args.join(', ') : '') + "){" + body + "}")()
        : exports.applyScope(Function, Function, args && args.length ? args.concat(body) : [body]);
}
exports.createFn = createFn;
// ========================================================================================
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
    return Function("return function(fn, " + (scope && scope + ', ') + "args" + (offset && ', offset, len') + "){\nswitch(" + (offset ? 'len' : 'args.length') + "){\n" + cases.join('\n') + "\n}\n" + (offset &&
        "var arr = new Array(len);\nfor(var i=0; i<len; i++) arr[i] = arr[offset + i];") + "\nreturn fn.apply(" + (scope || 'null') + ", " + (offset ? 'arr' : 'args') + ");\n}")();
}
/**
 * apply function with scope
 * @param fn	target function
 * @param scope	scope of function
 * @param args	arguments of function
 */
exports.applyScope = applyBuilder(8, 1, 0);
/**
 * apply function without scope
 * @param fn		target function
 * @param args	arguments of function
 */
exports.applyNoScope = applyBuilder(8, 0, 0);
/**
 * apply function with scope
 * @param fn		target function
 * @param scope		scope of function
 * @param args		arguments of function
 * @param offset	start offset of args
 * @param len		arg size from offset
 */
exports.applyScopeN = applyBuilder(8, 1, 1);
/**
 * apply function without scope
 * @param fn		target function
 * @param args		arguments of function
 * @param offset	start offset of args
 * @param len		arg size from offset
 */
exports.applyNoScopeN = applyBuilder(8, 0, 1);
/**
 * apply function
 * @param fn		target function
 * @param scope		scope of function
 * @param args		arguments of function
 */
function apply(fn, scope, args) {
    if (scope === undefined || scope === null || scope === consts_1.GLOBAL) {
        return exports.applyNoScope(fn, args || []);
    }
    return exports.applyScope(fn, scope, args || []);
}
exports.apply = apply;
/**
 * apply function
 * @param fn		target function
 * @param scope		scope of function
 * @param args		arguments of function
 * @param offset	start offset of args
 * @param len		arg size from offset
 */
function applyN(fn, scope, args, offset, len) {
    if (scope === undefined || scope === null || scope === consts_1.GLOBAL) {
        return exports.applyNoScopeN(fn, args, offset, len);
    }
    return exports.applyScopeN(fn, scope, args, offset, len);
}
exports.applyN = applyN;
// ========================================================================================
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
}
exports.fnName = fnName;
// ========================================================================================
/*                                                                                      *
 *                                         bind                                         *
 *                                                                                      */
// ========================================================================================
var _bind;
var funcProto = Function[consts_1.PROTOTYPE];
if (funcProto.bind) {
    _bind = function bind(fn, scope) {
        var args = arguments, argLen = args.length;
        if (is_1.isNil(scope)) {
            return argLen > 2 ? bindPolyfill(fn, scope, args, 2) : fn;
        }
        return exports.applyScopeN(fn.bind, fn, args, 1, argLen - 1);
    };
}
else {
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
exports.bind = _bind;
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
    if (scope === consts_1.GLOBAL) {
        // bind on GLOBAL
        return function bindProxy() {
            return exports.applyNoScope(fn, arguments);
        };
    }
    return function bindProxy() {
        return exports.applyScope(fn, scope, arguments);
    };
}
//# sourceMappingURL=fn.js.map