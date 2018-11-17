// @flow
/**
 * prototype utilities
 * @module helper/proto
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 15:23:56 GMT+0800 (China Standard Time)
 * @modified Thu Nov 15 2018 19:07:38 GMT+0800 (China Standard Time)
 */
import { hasOwnProp } from './prop'
import { CONSTRUCTOR, PROTOTYPE, PROTO } from './consts'

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
 * TODO copy prototype properties when getPrototypeOf not support
 * @function prototypeOf
 * @static
 * @param {any} obj
 * @returns {Object|null}
 */
export const prototypeOf = ((__setProto
	? (__getProto: any)
	: __getProto
	? function getPrototypeOf(obj) {
			return obj[PROTO] || __getProto(obj)
	  }
	: function getPrototypeOf(obj) {
			return (hasOwnProp(obj, PROTO) ? obj[PROTO] : obj[CONSTRUCTOR][PROTOTYPE]) || null
	  }): (obj: any) => any)

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
	function setPrototypeOf(obj, proto) {
		return (obj[PROTO] = proto)
	}
