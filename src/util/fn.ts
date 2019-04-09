/**
 * @module util
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Mon Dec 11 2017 13:57:32 GMT+0800 (China Standard Time)
 * @modified Mon Apr 08 2019 13:26:23 GMT+0800 (China Standard Time)
 */

import { GLOBAL, P_PROTOTYPE } from './consts'
import { isNil } from './is'

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
export function createFn<T extends (...args: any[]) => any>(body: string, args?: string[], name?: string): T {
	return name
		? Function(`return function ${name}(${args ? args.join(', ') : ''}){${body}}`)()
		: applyScope(Function, Function, args && args.length ? args.concat(body) : [body])
}

// ========================================================================================
/*                                                                                      *
 *                                    function apply                                    *
 *                                                                                      */
// ========================================================================================

/**
 * generate apply function
 */
function applyBuilder<T extends (...args: any[]) => any>(maxArgs: number, scope: any, offset: any): T {
	scope = scope ? 'scope' : ''
	offset = offset ? 'offset' : ''
	const args = new Array(maxArgs + 1)
	const cases = new Array(maxArgs + 1)
	for (let i = 0; i <= maxArgs; i++) {
		args[i] = `${i || scope ? ', ' : ''}args[${offset ? `offset${i ? ' + ' + i : ''}` : i}]`
		cases[i] = `case ${i}: return fn${scope && '.call'}(${scope}${args.slice(0, i).join('')});`
	}
	return Function(`return function(fn, ${scope && scope + ', '}args${offset && ', offset, len'}){
switch(${offset ? 'len' : 'args.length'}){
${cases.join('\n')}
}
${offset &&
	`var arr = new Array(len);
for(var i=0; i<len; i++) arr[i] = arr[offset + i];`}
return fn.apply(${scope || 'null'}, ${offset ? 'arr' : 'args'});
}`)()
}

/**
 * apply function with scope
 * @param fn	target function
 * @param scope	scope of function
 * @param args	arguments of function
 */
export const applyScope: (fn: (...args: any[]) => any, scope: any, args: any[] | IArguments) => any = applyBuilder(
	8,
	1,
	0
)

/**
 * apply function without scope
 * @param fn		target function
 * @param args	arguments of function
 */
export const applyNoScope: (fn: (...args: any[]) => any, args: any[] | IArguments) => any = applyBuilder(8, 0, 0)

/**
 * apply function with scope
 * @param fn		target function
 * @param scope		scope of function
 * @param args		arguments of function
 * @param offset	start offset of args
 * @param len		arg size from offset
 */
export const applyScopeN: (
	fn: (...args: any[]) => any,
	scope: any,
	args: any[] | IArguments,
	offset: number,
	len: number
) => any = applyBuilder(8, 1, 1)

/**
 * apply function without scope
 * @param fn		target function
 * @param args		arguments of function
 * @param offset	start offset of args
 * @param len		arg size from offset
 */
export const applyNoScopeN: (
	fn: (...args: any[]) => any,
	args: any[] | IArguments,
	offset: number,
	len: number
) => any = applyBuilder(8, 0, 1)

/**
 * apply function
 * @param fn		target function
 * @param scope		scope of function
 * @param args		arguments of function
 */
export function apply(fn: (...args: any[]) => any, scope: any, args: any[] | IArguments): any {
	if (scope === undefined || scope === null || scope === GLOBAL) {
		return applyNoScope(fn, args || [])
	}
	return applyScope(fn, scope, args || [])
}

/**
 * apply function
 * @param fn		target function
 * @param scope		scope of function
 * @param args		arguments of function
 * @param offset	start offset of args
 * @param len		arg size from offset
 */
export function applyN(
	fn: (...args: any[]) => any,
	scope: any,
	args: any[] | IArguments,
	offset: number,
	len: number
): any {
	if (scope === undefined || scope === null || scope === GLOBAL) {
		return applyNoScopeN(fn, args, offset, len)
	}
	return applyScopeN(fn, scope, args, offset, len)
}

// ========================================================================================
/*                                                                                      *
 *                                     function name                                    *
 *                                                                                      */
// ========================================================================================

const varGenReg = /\$\d+$/

/**
 * get function name
 */
export function fnName(fn: (...args: any[]) => any): string {
	const name: string = (fn as any).name
	return name ? name.replace(varGenReg, '') : 'anonymous'
}

// ========================================================================================
/*                                                                                      *
 *                                         bind                                         *
 *                                                                                      */
// ========================================================================================

let _bind: <T extends (...args: any[]) => any>(fn: T, scope: any, ...args: any[]) => T

const funcProto = Function[P_PROTOTYPE]
if (funcProto.bind) {
	_bind = function bind<T extends (...args: any[]) => any>(fn: T, scope: any): T {
		const args = arguments,
			argLen = args.length
		if (isNil(scope)) {
			return argLen > 2 ? bindPolyfill(fn, scope, args, 2) : fn
		}
		return applyScopeN(fn.bind, fn, args, 1, argLen - 1)
	}
} else {
	funcProto.bind = function bind(scope) {
		return bindPolyfill(this as any, scope, arguments, 1)
	}
	_bind = function bind<T extends (...args: any[]) => any>(fn: T, scope: any): T {
		return bindPolyfill(fn, scope, arguments, 2)
	}
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
export const bind: <T extends (...args: any[]) => any>(fn: T, scope: any, ...args: any[]) => T = _bind

/**
 * bind
 * > not bind scope when scope is null or undefined
 * @param fn		source function
 * @param scope		bind scope
 * @param args		bind arguments
 * @param argOffset	offset of args
 * @return function proxy
 */
function bindPolyfill<T extends (...args: any[]) => any>(
	fn: T,
	scope: any,
	bindArgs: any[] | IArguments,
	argOffset: number
): T {
	const argLen = bindArgs.length - argOffset
	if (scope === undefined) {
		scope = null
	}
	if (argLen > 0) {
		// bind with arguments
		return function bindProxy() {
			const args = arguments
			let i = args.length
			if (i) {
				const params = new Array(argLen + i)
				while (i--) {
					params[argLen + i] = args[i]
				}
				i = argLen
				while (i--) {
					params[i] = bindArgs[i + argOffset]
				}
				return apply(fn, scope === null ? this : scope, params) // call with scope or this
			}
			return applyN(fn, scope === null ? this : scope, bindArgs, argOffset, argLen) // call with scope or this
		} as any
	}
	if (scope === null) {
		return fn
	}
	if (scope === GLOBAL) {
		// bind on GLOBAL
		return function bindProxy() {
			return applyNoScope(fn, arguments)
		} as any
	}
	return function bindProxy() {
		return applyScope(fn, scope, arguments)
	} as any
}
