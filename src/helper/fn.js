// @flow
/**
 * Function utilities
 * @module helper/fn
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Mon Dec 11 2017 13:57:32 GMT+0800 (China Standard Time)
 * @modified Fri Nov 16 2018 10:29:31 GMT+0800 (China Standard Time)
 */

import { isStr, isNil } from './is'
import { PROTOTYPE, global } from './consts'
import { isArray } from 'util'

//========================================================================================
/*                                                                                      *
 *                                    create function                                   *
 *                                                                                      */
//========================================================================================

declare function Function(...args: Array<string>): Function
/**
 * create function by code string
 * @param  {string} body	function body
 * @param  {Array} 	[args]	function argument names
 * @param  {string} [name]	function name
 * @returns {Function}
 */
export function createFn(body: string, args?: Array<string>, name?: string) {
	return name
		? Function(`return function ${name}(${args ? args.join(', ') : ''}){${body}}`)()
		: applyScope(Function, Function, args && args.length ? args.concat(body) : [body])
}

//========================================================================================
/*                                                                                      *
 *                                    function apply                                    *
 *                                                                                      */
//========================================================================================

/**
 * apply function generator
 * @private
 * @param  {number} max_args max arguments for optimize
 * @param  {any} 	scope 		is enable scope
 * @param  {number} offset	is enable arguments range
 * @returns {Function} apply function
 */
function applyBuilder(max_args: number, scope: any, offset: any): Function {
	scope = scope ? 'scope' : ''
	offset = offset ? 'offset' : ''
	const args = new Array(max_args + 1)
	const cases = new Array(max_args + 1)
	for (var i = 0; i <= max_args; i++) {
		args[i] = `${i || scope ? ', ' : ''}args[${offset ? `offset${i ? ' + ' + i : ''}` : i}]`
		cases[i] = `case ${i}: return fn${scope && '.call'}(${scope}${args.slice(0, i).join('')});`
	}
	return createFn(`return function(fn, ${scope && scope + ', '}args${offset && ', offset, len'}){
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
 * @function applyScope
 * @static
 * @param  {Function} 	fn
 * @param  {any} 		scope
 * @param  {Array} 		args
 * @returns {any}
 */
export const applyScope: (fn: Function, scope: any, args: Array<any>) => any = applyBuilder(8, 1, 0)

/**
 * apply function without scope
 * @function applyNoScope
 * @static
 * @param  {Function} 	fn
 * @param  {Array} 		args
 */
export const applyNoScope: (fn: Function, args: Array<any>) => any = applyBuilder(8, 0, 0)

/**
 * apply function with scope
 * @function applyScopeN
 * @static
 * @param  {Function} 	fn
 * @param  {any} 		scope
 * @param  {Array} 		args
 * @param  {number} 	offset	start offset of args
 * @param  {number} 	len		arg size from offset
 * @returns {any}
 */
export const applyScopeN: (fn: Function, scope: any, args: Array<any>, offset: number, len: number) => any = applyBuilder(
	8,
	1,
	1
)

/**
 * apply function without scope
 * @function applyNoScopeN
 * @static
 * @param  {Function} 	fn
 * @param  {Array} 		args
 * @param  {number} 	offset	start offset of args
 * @param  {number} 	len		arg size from offset
 * @returns {any}
 */
export const applyNoScopeN: (fn: Function, args: Array<any>, offset: number, len: number) => any = applyBuilder(8, 0, 1)

/**
 * apply function
 * @param  {Function} 	fn
 * @param  {any} 		scope
 * @param  {Array} 		[args]
 * @returns {any}
 */
export function apply(fn: Function, scope: any, args?: Array<any>): any {
	if (scope === undefined || scope === null || scope === global) return applyNoScope(fn, args || [])
	return applyScope(fn, scope, args || [])
}

/**
 * apply function
 * @param  {Function} 	fn
 * @param  {any} 		scope
 * @param  {Array} 		args
 * @param  {number} 	offset	start offset of args
 * @param  {number} 	len		arg size from offset
 * @returns {any}
 */
export function applyN(fn: Function, scope: any, args: Array<any>, offset: number, len: number): any {
	if (scope === undefined || scope === null || scope === global) return applyNoScopeN(fn, args, offset, len)
	return applyScopeN(fn, scope, args, offset, len)
}

//========================================================================================
/*                                                                                      *
 *                                     function name                                    *
 *                                                                                      */
//========================================================================================

const varGenReg = /\$\d+$/
/**
 * get function name
 * @param  {Function} fn
 * @returns {string}
 */
export function fnName(fn: Function): string {
	const name = fn.name
	return name ? name.replace(varGenReg, '') : 'anonymous'
}

//========================================================================================
/*                                                                                      *
 *                                         bind                                         *
 *                                                                                      */
//========================================================================================

/**
 * bind
 * - return source function when without arguments and scope is undefined or null
 * - only bind arguments when scope is undefined or null, well can call the new function proxy with some scope
 * @example
 * 		function example() {
 * 			console.log(this, arguments);
 * 		}
 * 		var proxy = bind(example, null) 	// proxy === example
 * 		proxy() 							// log: window | undefined, []
 * 		proxy.call(1) 						// log: 1, []
 *
 * 		proxy = bind(example, null, 1) 	// proxy !== example
 * 		proxy() 							// log: window | undefined, [1]
 * 		proxy(2) 							// log: window | undefined, [1, 2]
 * 		proxy.call(1, 2) 					// log: 1, [1, 2]
 *
 * 		proxy = bind(example, {}, 1, 2)		// proxy !== example
 * 		proxy() 							// log: {}, [1]
 * 		proxy(2) 							// log: {}, [1, 2, 2]
 * 		proxy.call(1, 2) 					// log: {}, [1, 2, 2]
 *
 * @param  {Function} 	fn				source function
 * @param  {any} 		scope			bind scope
 * @param  {Array} 		[...args]		bind arguments
 * @returns {Function} function proxy
 */
let bind: (fn: Function, scope: any, ...args: Array<any>) => Function

const funcProto = Function[PROTOTYPE]
if (funcProto.bind) {
	bind = function bind(fn: Function, scope: any): Function {
		const args = arguments,
			argLen = args.length - 2
		if (isNil(scope)) return argLen > 0 ? bindPolyfill(fn, scope, args, 2) : fn
		return applyScopeN(fn.bind, fn, args, 2, argLen)
	}
} else {
	funcProto.bind = function bind(scope) {
		return bindPolyfill(this, scope, arguments, 1)
	}
	bind = function bind(fn: Function, scope: any): Function {
		return bindPolyfill(fn, scope, arguments, 2)
	}
}

export { bind }

/**
 * bind
 * > not bind scope when scope is null or undefined
 * @private
 * @param  {Function} 	fn
 * @param  {any} 		scope
 * @param  {Array} 		bindArgs
 * @param  {number} 	argOffset
 * @returns {Function}
 */
function bindPolyfill(fn: Function, scope: any, bindArgs: Array<any>, argOffset: number): Function {
	const argLen = bindArgs.length - argOffset
	if (scope === undefined) scope = null
	if (argLen > 0) {
		// bind with arguments
		return function bindProxy() {
			const args = arguments
			let i = args.length
			if (i) {
				const params = new Array(argLen + i)
				while (i--) params[argLen + i] = args[i]
				i = argLen
				while (i--) params[i] = bindArgs[i + argOffset]
				return apply(fn, scope === null ? this : scope, params) // call with scope or this
			}
			return applyN(fn, scope === null ? this : scope, bindArgs, argOffset, argLen) // call with scope or this
		}
	}
	if (scope === null) return fn
	if (scope === global)
		// bind on global
		return function bindProxy() {
			return applyNoScope(fn, arguments)
		}
	return function bindProxy() {
		return applyScope(fn, scope, arguments)
	}
}
