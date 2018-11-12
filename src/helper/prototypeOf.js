// @flow
/**
 * @module helper/proto
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 15:23:56 GMT+0800 (China Standard Time)
 * @modified Sat Nov 10 2018 17:17:05 GMT+0800 (China Standard Time)
 */
import { hasOwnProp } from './ownProp'
import { CONSTRUCTOR, PROTOTYPE, PROTO } from './constants'

const __getProto = Object.getPrototypeOf,
	__setProto = Object.setPrototypeOf

/**
 * is support Object.getPrototypeOf and Object.setPrototypeOf
 * @constant {boolean}
 * @static
 * @name prototypeOfSupport
 */
export const prototypeOfSupport = !!__setProto

/**
 * Object.getPrototypeOf shim
 * @function prototypeOf
 * @static
 * @param {any} obj
 * @returns {Object|null}
 */
export const prototypeOf: (obj: any) => Object | null = __setProto
	? __getProto
	: __getProto
	? function getPrototypeOf(obj) {
			return obj[PROTO] || __getProto(obj)
	  }
	: function getPrototypeOf(obj) {
			return (hasOwnProp(obj, PROTO) ? obj[PROTO] : obj[CONSTRUCTOR][PROTOTYPE]) || null
	  }

/**
 * Object.setPrototypeOf shim
 * @function setPrototypeOf
 * @static
 * @param  {T} obj
 * @param  {any} proto
 * @returns {T}
 */
export const setPrototypeOf: <T>(obj: T, proto: any) => T =
	__setProto ||
	function setPrototypeOf<T>(obj: T, proto: any): T {
		return (obj[PROTO] = proto)
	}
