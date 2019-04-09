/**
 * @module util
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 15:23:56 GMT+0800 (China Standard Time)
 * @modified Mon Apr 08 2019 11:49:38 GMT+0800 (China Standard Time)
 */
import { P_CTOR, P_PROTO, P_PROTOTYPE } from '../consts'
import { addDKey } from '../dkeys'

const $getProto = Object.getPrototypeOf,
	$setProto = Object.setPrototypeOf

/**
 * whether to support Object.getPrototypeOf and Object.setPrototypeOf
 */
export const prototypeOf = !!$setProto

/**
 * whether to support `__proto__`
 */
export const protoProp = { [P_PROTO]: [] } instanceof Array

!protoProp && addDKey(P_PROTO)

/**
 * get prototype
 */
export const protoOf: (o: any) => any = $setProto
	? $getProto
	: $getProto
	? function getPrototypeOf(obj) {
			return obj[P_PROTO] || $getProto(obj)
	  }
	: function getPrototypeOf(obj) {
			return obj[P_PROTO] || obj[P_CTOR][P_PROTOTYPE]
	  }

/**
 * set prototype
 * > properties on the prototype are not inherited on older browsers
 */
export const __setProto: <T>(obj: any, proto: any) => any =
	$setProto ||
	function setPrototypeOf(obj, proto) {
		obj[P_PROTO] = proto
		return obj
	}

/**
 * set prototype
 * > the properties on the prototype will be copied on the older browser
 */
export const setProto: <T>(obj: any, proto: any) => any =
	$setProto ||
	(protoProp
		? __setProto
		: function setPrototypeOf(obj, proto) {
				for (let p in proto) {
					if (!(p in obj)) obj[p] = proto[p]
				}
				return __setProto(obj, proto)
		  })
