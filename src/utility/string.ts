/**
 * String utilities
 * @module utility/string
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Mon Dec 11 2017 13:57:32 GMT+0800 (China Standard Time)
 * @modified Tue Mar 05 2019 18:59:22 GMT+0800 (China Standard Time)
 */
const toString = Object.prototype.toString
export function toStr(obj: any): String {
	return toString.call(obj)
}

export function toStrType(obj: any) {
	return toString.call(obj).match(/^\[object ([^\]]+)\]$/)[1]
}

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

export function cutLStr(str: string, start: number, len?: number) {
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

const FIRST_LOWER_LETTER_REG = /^[a-z]/,
	FIRST_UPPER_LETTER_REG = /^[A-Z]/

export function upper(str: string): string {
	return str.toUpperCase()
}

export function lower(str: string): string {
	return str.toLowerCase()
}

export function upperFirst(str: string): string {
	return str.replace(FIRST_LOWER_LETTER_REG, upper)
}

export function lowerFirst(str: string): string {
	return str.replace(FIRST_UPPER_LETTER_REG, lower)
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
