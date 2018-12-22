/**
 * regexp utilities
 * @module utility/reg
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Thu Sep 06 2018 18:27:51 GMT+0800 (China Standard Time)
 * @modified Sat Dec 22 2018 17:58:01 GMT+0800 (China Standard Time)
 */

import { isBool } from './is'

/**
 * is support sticky on RegExp
 */
export const regStickySupport = false //isBool(/(?:)/.sticky)

/**
 * is support unicode on RegExp
 */
export const regUnicodeSupport = isBool(/(?:)/.unicode)

const REG_ESCAPE = /[-\/\\^$*+?.()|[\]{}]/g

/**
 * escape string for RegExp
 */
export function reEscape(str: string): string {
	return str.replace(REG_ESCAPE, '\\$&')
}
