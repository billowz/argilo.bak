/**
 * String utilities
 * @module utility/string
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Mon Dec 11 2017 13:57:32 GMT+0800 (China Standard Time)
 * @modified Sat Dec 22 2018 15:06:34 GMT+0800 (China Standard Time)
 */
import { isNil } from './is'

//========================================================================================
/*                                                                                      *
 *                                       char code                                      *
 *                                                                                      */
//========================================================================================

/**
 * get char code
 * > string.charCodeAt
 */
export function charCode(str: string, index?: number): number {
	return str.charCodeAt(index || 0)
}

/**
 * get char by char code
 * > String.fromCharCode
 */
export function char(code: number): string {
	return String.fromCharCode(code)
}

export function cutStr(str: string, start: number, end?: number) {
	return str.substring(start, end)
}

export function cutStrLen(str: string, start: number, len?: number) {
	return str.substr(start, len)
}

//========================================================================================
/*                                                                                      *
 *                                         trim                                         *
 *                                                                                      */
//========================================================================================

const TRIM_REG = /(^\s+)|(\s+$)/g

/**
 * trim
 */
export function trim(str: string): string {
	return str.replace(TRIM_REG, '')
}

//========================================================================================
/*                                                                                      *
 *                                         case                                         *
 *                                                                                      */
//========================================================================================

const FIRST_LOWER_LETTER_REG = /^[a-z]/

/**
 * upper first char
 */
export function upperFirst(str: string): string {
	return str.replace(FIRST_LOWER_LETTER_REG, upper)
}

export function upper(m: string): string {
	return m.toUpperCase()
}

export function lower(m: string): string {
	return m.toLowerCase()
}

//========================================================================================
/*                                                                                      *
 *                                  parse string value                                  *
 *                                                                                      */
//========================================================================================

/**
 * convert any value to string
 * - undefined | null: ''
 * - NaN:
 * - Infinity:
 * - other: String(value)
 * TODO support NaN, Infinity
 */
export function strval(obj: any): string {
	return isNil(obj) ? '' : String(obj)
}

//========================================================================================
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
	STR_ESCAPE = /[\n\t\f"']/g

export function escapeStr(str: string): string {
	return str.replace(STR_ESCAPE, str => STR_ESCAPE_MAP[str])
}
