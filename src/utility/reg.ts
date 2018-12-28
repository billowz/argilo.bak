/**
 * regexp utilities
 * @module utility/reg
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Thu Sep 06 2018 18:27:51 GMT+0800 (China Standard Time)
 * @modified Thu Dec 27 2018 16:22:16 GMT+0800 (China Standard Time)
 */

import { isBool } from './is'

/**
 * whether to support sticky on RegExp
 */
export const stickyReg = false //isBool(/(?:)/.sticky)

/**
 * whether to support unicode on RegExp
 */
export const unicodeReg = isBool(/(?:)/.unicode)

const REG_ESCAPE = /[-\/\\^$*+?.()|[\]{}]/g

/**
 * escape string for RegExp
 */
export function reEscape(str: string): string {
	return str.replace(REG_ESCAPE, '\\$&')
}
