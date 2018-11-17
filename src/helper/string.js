// @flow
/**
 * String utilities
 * @module helper/string
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Mon Dec 11 2017 13:57:32 GMT+0800 (China Standard Time)
 * @modified Thu Nov 15 2018 14:08:32 GMT+0800 (China Standard Time)
 */

import { isNil } from './is'

const TRIM_REG = /(^\s+)|(\s+$)/g

/**
 * string.trim
 * @param  {string} str
 * @returns {string}
 */
export function trim(str: string): string {
	return str.replace(TRIM_REG, '')
}

const FIRST_LOWER_LETTER_REG = /^[a-z]/

/**
 * upper first char
 * @param  {string} str
 * @returns {string}
 */
export function upperFirst(str: string): string {
	return str.replace(FIRST_LOWER_LETTER_REG, upperHandler)
}

function upperHandler(m) {
	return m.toUpperCase()
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
 * > string.charCodeAt
 * @param  {string} str
 * @param  {number} offset?
 * @returns {number}
 */
export function charCode(str: string, offset?: number): number {
	return str.charCodeAt(offset || 0)
}

/**
 * get char by char code
 * > String.fromCharCode
 * @param  {number} code
 * @returns {string}
 */
export function char(code: number): string {
	return String.fromCharCode(code)
}

/**
 * generate char codes in constom range
 * @param  {string} startChar
 * @param  {string} endChar
 * @returns {Array<number>}
 */
export function genCharCodes(startChar: string, endChar: string): Array<number> {
	const start = charCode(startChar),
		end = charCode(endChar)
	const codes = new Array(end - start + 1)
	for (let i = start; i <= end; i++) codes[i - start] = start
	return codes
}
