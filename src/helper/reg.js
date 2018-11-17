// @flow
/**
 * regexp utilities
 * @module helper/reg
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Thu Sep 06 2018 18:27:51 GMT+0800 (China Standard Time)
 * @modified Thu Nov 15 2018 14:09:30 GMT+0800 (China Standard Time)
 */

import { mapArray } from './collection/map'
import { isBool } from './is'

/**
 * is support sticky on RegExp
 * @constant {boolean}
 * @static
 * @name regStickySupport
 */
export const regStickySupport = isBool(/(?:)/.sticky)

/**
 * is support unicode on RegExp
 * @constant {boolean}
 * @static
 * @name regUnicodeSupport
 */
export const regUnicodeSupport = isBool(/(?:)/.unicode)

const REG_ESCAPE = /[-\/\\^$*+?.()|[\]{}]/g

/**
 * escape string for RegExp
 * @param  {string} str
 * @returns {string}
 */
export function reEscape(str: string): string {
	return str.replace(REG_ESCAPE, '\\$&')
}

/**
 * union multi RegExp fragment
 * @param  {Array<string>} regexps
 * @returns {string}
 */
export function reUnion(regexps: Array<string>): string {
	if (!regexps.length) return '(?!)'
	return `(?:${mapArray(regexps, s => `(?:${s})`).join('|')})`
}
