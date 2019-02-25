/**
 * @module utility
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 15:23:56 GMT+0800 (China Standard Time)
 * @modified Thu Jan 31 2019 10:10:28 GMT+0800 (China Standard Time)
 */
import { CONSTRUCTOR, PROTO, PROTOTYPE } from '../consts'
import { hasOwnProp } from '../prop/hasOwnProp'

const __getProto = Object.getPrototypeOf,
	____setProto = Object.setPrototypeOf

/**
 * whether to support Object.getPrototypeOf and Object.setPrototypeOf
 */
export const prototypeOf = !!____setProto

/**
 * whether to support `__proto__`
 */
export const protoProp = { __proto__: [] } instanceof Array

/**
 * get prototype
 */
export const protoOf: (o: any) => any = ____setProto
	? __getProto
	: __getProto
	? function getPrototypeOf(obj) {
			return obj[PROTO] || __getProto(obj)
	  }
	: function getPrototypeOf(obj) {
			return (hasOwnProp(obj, PROTO) ? obj[PROTO] : obj[CONSTRUCTOR][PROTOTYPE]) || null
	  }

/**
 * set prototype
 * > properties on the prototype are not inherited on older browsers
 */
export const __setProto: <T>(obj: any, proto: any) => any =
	____setProto ||
	function setPrototypeOf(obj, proto) {
		obj[PROTO] = proto
		return obj
	}

/**
 * set prototype
 * > the properties on the prototype will be copied on the older browser
 */
export const setProto: <T>(obj: any, proto: any) => any =
	____setProto ||
	(protoProp
		? __setProto
		: function setPrototypeOf(obj, proto) {
				for (let p in proto) {
					if (hasOwnProp(proto, p)) obj[p] = proto[p]
				}
				return __setProto(obj, proto)
		  })
