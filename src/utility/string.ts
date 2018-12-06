/**
 * String utilities
 * @module utility/string
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Mon Dec 11 2017 13:57:32 GMT+0800 (China Standard Time)
 * @modified Thu Dec 06 2018 18:45:25 GMT+0800 (China Standard Time)
 */
import { createFn } from './fn'
import { isNil, isFn, isNum } from './is'
import { get } from './propPath'
import create from './create'

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
	return str.replace(FIRST_LOWER_LETTER_REG, upperHandler)
}

function upperHandler(m) {
	return m.toUpperCase()
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

export function escapeString(str: string): string {
	return str.replace(STR_ESCAPE, str => STR_ESCAPE_MAP[str])
}

//========================================================================================
/*                                                                                      *
 *                                          pad                                         *
 *                                                                                      */
//========================================================================================

export function pad(str: any, len: number, chr?: string, leftAlign?: boolean | number): string {
	str = String(str)
	const l = str.length
	if (l >= len) return str

	const padding = new Array(len - l + 1).join(chr || ' ')
	return leftAlign ? str + padding : padding + str
}

//========================================================================================
/*                                                                                      *
 *                                   plural & singular                                  *
 *                                                                                      */
//========================================================================================

function replacor(regs: ([RegExp, string])[]): (str: string) => string {
	return function(str: string): string {
		for (let i = 0, reg; i < 4; i++) {
			reg = regs[i]
			if (reg[0].test(str)) return str.replace(reg[0], reg[1])
		}
		return str
	}
}

export const plural: (str: string) => string = replacor([
	[/([a-zA-Z]+[^aeiou])y$/, '$1ies'],
	[/([a-zA-Z]+[aeiou]y)$/, '$1s'],
	[/([a-zA-Z]+[sxzh])$/, '$1es'],
	[/([a-zA-Z]+[^sxzhy])$/, '$1s']
])

export const singular: (str: string) => string = replacor([
	[/([a-zA-Z]+[^aeiou])ies$/, '$1y'],
	[/([a-zA-Z]+[aeiou])s$/, '$1'],
	[/([a-zA-Z]+[sxzh])es$/, '$1'],
	[/([a-zA-Z]+[^sxzhy])s$/, '$1']
])

//========================================================================================
/*                                                                                      *
 *                                   thousand separate                                  *
 *                                                                                      */
//========================================================================================

export const thousandSeparationReg = /(\d)(?=(\d{3})+(?!\d))/g
export function thousandSeparate(number: number): string {
	const split = String(number).split('.')
	split[0] = split[0].replace(thousandSeparationReg, '$1,')
	return split.join('.')
}
