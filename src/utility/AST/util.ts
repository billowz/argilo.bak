/**
 * utilities for ast builder
 *
 * @module utility/AST
 * @author Tao Zeng (tao.zeng.zt@qq.com)
 * @created 2018-11-09 13:22:51
 * @modified 2018-11-09 13:22:51 by Tao Zeng (tao.zeng.zt@qq.com)
 */
import { isStr, isArray, isInt, isNum } from '../is'
import { charCode } from '../string'

export function genCharCodes(start: number | string, end: number | string, ignoreCase?: boolean) {
	let s: number = isNum(start) ? (start as number) : charCode(start as string),
		e: number = isNum(end) ? (end as number) : charCode(end as string),
		codes: number[] = new Array(e - s),
		i = 0
	if (ignoreCase) {
		var c: number
		for (; s <= e; s++) {
			codes[i++] = s
			c = getAnotherCode(s)
			codes[i++] = c
		}
	} else {
		for (; s <= e; s++) codes[i++] = s
	}
	return codes
}

/**
 * each char codes
 */
export function eachCharCodes(codes: number | string | any[], ignoreCase: boolean, cb: (code: number) => void) {
	let i: number
	if (isStr(codes)) {
		i = (codes as any).length
		while (i--) eachCharCode(charCode(codes as any, i), ignoreCase, cb)
	} else if (isArray(codes)) {
		i = (codes as any).length
		while (i--) eachCharCodes((codes as any)[i], ignoreCase, cb)
	} else if (isInt(codes)) {
		eachCharCode(codes as any, ignoreCase, cb)
	}
}
function eachCharCode(code: number, ignoreCase: boolean, cb: (code: number) => void): void {
	cb(code)
	if (ignoreCase) {
		var c = getAnotherCode(code)
		c && cb(c)
	}
}

function getAnotherCode(code: number) {
	return code <= 90 ? (code >= 65 ? code + 32 : 0) : code <= 122 ? code - 32 : 0
}
