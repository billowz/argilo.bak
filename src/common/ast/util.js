// @flow
/**
 * utilities for ast builder
 *
 * @author Tao Zeng (tao.zeng.zt@qq.com)
 * @created 2018-11-09 13:22:51
 * @modified 2018-11-09 13:22:51 by Tao Zeng (tao.zeng.zt@qq.com)
 */
import { isStr, isArray, isInt } from '../../helper'

/**
 * each char codes
 * @param  {number|string|Array} codes	char codes
 * @param  {boolean} ignoreCase			ignore case
 * @param  {(code:number)=>void} cb		each callback
 */
export function eachCharCodes(codes: number | string | Array<any>, ignoreCase: boolean, cb: (code: number) => void) {
	if (isStr(codes)) {
		var i = (codes: any).length
		while (i--) eachCharCode((codes: any).charCodeAt(i), ignoreCase, cb)
	} else if (isArray(codes)) {
		var i = (codes: any).length
		while (i--) eachCharCodes((codes: any)[i], ignoreCase, cb)
	} else if (isInt(codes)) {
		eachCharCode((codes: any), ignoreCase, cb)
	}
}
/**
 * @function
 * @param  {number} code				char code
 * @param  {boolean} ignoreCase			ignore case
 * @param  {(code:number)=>void} cb 	callback
 * @returns void
 */
function eachCharCode(code: number, ignoreCase: boolean, cb: (code: number) => void): void {
	cb(code)
	if (ignoreCase) {
		if (code <= 90) {
			if (code >= 65) cb(code + 32)
		} else if (code <= 122) {
			cb(code - 32)
		}
	}
}
