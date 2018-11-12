// @flow
/**
 * @module helper/prop
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 15:22:57 GMT+0800 (China Standard Time)
 * @modified Sat Nov 10 2018 16:14:06 GMT+0800 (China Standard Time)
 */

import { PROTOTYPE } from './constants'

const __hasOwn = Object[PROTOTYPE].hasOwnProperty

/**
 * Object.prototype.hasOwnProperty proxy
 * @param  {any} obj
 * @param  {string} prop
 * @returns {boolean}
 */
export function hasOwnProp(obj: any, prop: string): boolean {
	return __hasOwn.call(obj, prop)
}

/**
 * get owner property value
 * @param  {any} obj
 * @param  {string} prop		property name
 * @param  {any} defaultVal? 	default value
 * @returns {any}
 */
export function getOwnProp(obj: any, prop: string, defaultVal?: any): any {
	return obj && __hasOwn.call(obj, prop) ? obj[prop] : defaultVal
}
