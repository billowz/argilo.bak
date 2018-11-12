// @flow
/**
 * Function Tool
 * @module helper/fn
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Mon Dec 11 2017 13:57:32 GMT+0800 (China Standard Time)
 * @modified Sat Nov 10 2018 17:15:26 GMT+0800 (China Standard Time)
 */

import { isStr } from './is'

/**
 * apply function generator
 * @private
 * @param  {number} max_args max arguments for optimize
 * @param  {any} scope 		is enable scope
 * @param  {number} offset	is enable arguments range
 * @returns Function apply function
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
 * @function applyScope
 * @static
 * @param  {Function} fn
 * @param  {any} scope
 * @param  {Array} args
 * @returns {any}
 */
export const applyScope: (fn: Function, scope: any, args: Array) => any = applyBuilder(8, 1, 0)

/**
 * apply function without scope
 * @function applyNoScope
 * @static
 * @param  {Function} fn
 * @param  {Array} args
 */
export const applyNoScope: (fn: Function, args: Array) => any = applyBuilder(8, 0, 0)

/**
 * apply function with scope
 * @function applyScopeN
 * @static
 * @param  {Function} fn
 * @param  {any} scope
 * @param  {Array} args
 * @param  {number} offset	start offset of args
 * @param  {number} len		arg size from offset
 * @returns {any}
 */
export const applyScopeN: (fn: Function, scope: any, args: Array, offset: number, len: number) => any = applyBuilder(
	8,
	1,
	1
)

/**
 * apply function without scope
 * @function applyNoScopeN
 * @static
 * @param  {Function} fn
 * @param  {Array} args
 * @param  {number} offset	start offset of args
 * @param  {number} len		arg size from offset
 * @returns {any}
 */
export const applyNoScopeN: (fn: Function, args: Array, offset: number, len: number) => any = applyBuilder(8, 0, 1)

/**
 * apply function
 * @param  {Function} fn
 * @param  {any} scope?
 * @param  {Array} args
 * @returns {any}
 */
export function apply(fn: Function, scope?: any, args: Array): any {
	switch (scope) {
		case undefined:
		case null:
			return applyNoScope(fn, args)
	}
	return applyScope(fn, scope, args)
}
/**
 * apply function
 * @param  {Function} fn
 * @param  {any} scope?
 * @param  {Array} args
 * @param  {number} offset	start offset of args
 * @param  {number} len		arg size from offset
 * @returns {any}
 */
export function applyN(fn: Function, scope?: any, args: Array, offset: number, len: number): any {
	switch (scope) {
		case undefined:
		case null:
			return applyNoScopeN(fn, args, offset, len)
	}
	return applyScopeN(fn, scope, args, offset, len)
}
/**
 * @param  {string} name?	function name
 * @param  {Array} args?	function arguments
 * @param  {string} body	function body
 * @returns Function
 */
export function createFn(name, args, body): Function {
	const l = arguments.length
	if (l === 1) {
		body = name
		name = args = 0
	} else if (l === 2) {
		body = args
		if (isStr(name)) {
			args = 0
		} else {
			args = name
			name = 0
		}
	}
	return name
		? Function(`return function ${name}(${args ? args.join(', ') : ''}){${body}}`)()
		: applyScope(Function, Function, args ? args.concat(body) : [body])
}

const varGenReg = /\$\d+$/
/**
 * get function name
 * @param  {Function} fn
 * @returns {string}
 */
export function fnName(fn: Function): string {
	const name = fn.name
	return name ? name.replace(varGenReg, '') : ''
}
