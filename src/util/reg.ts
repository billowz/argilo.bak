/**
 * @module util
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Thu Sep 06 2018 18:27:51 GMT+0800 (China Standard Time)
 * @modified Mon Apr 08 2019 13:25:13 GMT+0800 (China Standard Time)
 */

import { isBool } from './is'

/**
 * whether to support sticky on RegExp
 */
export const stickyReg = isBool(/(?:)/.sticky)

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
