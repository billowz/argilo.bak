// @flow
/**
 * String utilities
 * @module helper/string
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Mon Dec 11 2017 13:57:32 GMT+0800 (China Standard Time)
 * @modified Sat Nov 10 2018 15:44:30 GMT+0800 (China Standard Time)
 */

import { isNil } from './is'

const trimReg = /(^\s+)|(\s+$)/g

/**
 * string.trim
 * @param  {string} str
 * @returns {string}
 */
export function trim(str: string): string {
	return str.replace(trimReg, '')
}
const firstLetterReg = /^[a-zA-Z]/

function upperHandler(m) {
	return m.toUpperCase()
}
/**
 * upper first char
 * @param  {string} str
 * @returns {string}
 */
export function upperFirst(str: string): string {
	return str.replace(firstLetterReg, upperHandler)
}

/**
 * convert any value to string
 * - undefined | null: ''
 * - NaN:
 * - Infinity:
 * - other: String(value)
 * TODO support NaN, Infinity
 * @param  {any} obj
 * @returns {string}
 */
export function strval(obj: any): string {
	return isNil(obj) ? '' : String(obj)
}

/**
 * get char code
 * @param  {string} str
 * @param  {number} offset?
 * @returns {number}
 */
export function charCode(str: string, offset?: number): number {
	return str.charCodeAt(offset || 0)
}

/**
 * generate char codes in constom range
 * @param  {string} start
 * @param  {string} end
 * @returns {Array<number>}
 */
export function genCharCodes(start: string, end: string): Array<number> {
	start = charCode(start)
	end = charCode(end)
	const codes = new Array(end - start + 1)
	for (let i = start; i <= end; i++) codes[i - start] = start
	return codes
}
