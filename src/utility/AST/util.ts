/**
 * utilities for ast builder
 *
 * @module utility/AST
 * @author Tao Zeng (tao.zeng.zt@qq.com)
 * @created 2018-11-09 13:22:51
 * @modified 2018-11-09 13:22:51 by Tao Zeng (tao.zeng.zt@qq.com)
 */
import { isStr, isArray, isInt } from '../is'

/**
 * each char codes
 */
export function eachCharCodes(codes: number | string | any[], ignoreCase: boolean, cb: (code: number) => void) {
	if (isStr(codes)) {
		var i = (codes as any).length
		while (i--) eachCharCode((codes as any).charCodeAt(i), ignoreCase, cb)
	} else if (isArray(codes)) {
		var i = (codes as any).length
		while (i--) eachCharCodes((codes as any)[i], ignoreCase, cb)
	} else if (isInt(codes)) {
		eachCharCode(codes as any, ignoreCase, cb)
	}
}
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
