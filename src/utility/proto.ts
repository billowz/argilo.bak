/**
 * prototype utilities
 * @module utility
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 15:23:56 GMT+0800 (China Standard Time)
 * @modified Tue Nov 27 2018 20:00:18 GMT+0800 (China Standard Time)
 */
import { CONSTRUCTOR, PROTO, PROTOTYPE } from './consts'

const __hasOwn = Object[PROTOTYPE].hasOwnProperty
const __getProto = Object.getPrototypeOf,
	____setProto = Object.setPrototypeOf

/**
 * is support Object.getPrototypeOf and Object.setPrototypeOf
 */
export const prototypeOfSupport = !!____setProto

export const protoPropSupport = { __proto__: [] } instanceof Array

/**
 * Object.getPrototypeOf shim
 */
export const protoOf: (o: any) => any = ____setProto
	? __getProto
	: __getProto
	? function getPrototypeOf(obj) {
			return obj[PROTO] || __getProto(obj)
	  }
	: function getPrototypeOf(obj) {
			return (__hasOwn.call(obj, PROTO) ? obj[PROTO] : obj[CONSTRUCTOR][PROTOTYPE]) || null
	  }

export const __setProto: <T>(obj: any, proto: any) => any =
	____setProto ||
	function setPrototypeOf(obj, proto) {
		obj[PROTO] = proto
		return obj
	}

/**
 * Object.setPrototypeOf shim
 */
export const setProto: <T>(obj: any, proto: any) => any =
	____setProto ||
	(protoPropSupport
		? __setProto
		: function setPrototypeOf(obj, proto) {
				for (let p in proto) {
					if (__hasOwn.call(proto, p)) {
						obj[p] = proto[p]
					}
				}
				return __setProto(obj, proto)
		  })
