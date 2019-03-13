/**
 * @module utility
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 15:23:56 GMT+0800 (China Standard Time)
 * @modified Wed Mar 13 2019 20:10:16 GMT+0800 (China Standard Time)
 */
import { CONSTRUCTOR, PROTO, PROTOTYPE } from '../consts'
import { addDefaultKey } from '../dkeys'

const PROTO_PROP = '__proto__'

const __getProto = Object.getPrototypeOf,
	____setProto = Object.setPrototypeOf

/**
 * whether to support Object.getPrototypeOf and Object.setPrototypeOf
 */
export const prototypeOf = !!____setProto

/**
 * whether to support `__proto__`
 */
export const protoProp = { [PROTO_PROP]: [] } instanceof Array

!protoProp && addDefaultKey(PROTO_PROP)

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
			return obj[PROTO] || obj[CONSTRUCTOR][PROTOTYPE]
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
					if (!(p in obj)) obj[p] = proto[p]
				}
				return __setProto(obj, proto)
		  })
