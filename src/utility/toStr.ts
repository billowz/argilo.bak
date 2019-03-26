/**
 * @module utility
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Mon Dec 11 2017 13:57:32 GMT+0800 (China Standard Time)
 * @modified Sat Mar 23 2019 18:50:53 GMT+0800 (China Standard Time)
 */
const toString = Object.prototype.toString
export function toStr(obj: any): String {
	return toString.call(obj)
}

export function toStrType(obj: any) {
	return toString.call(obj).match(/^\[object ([^\]]+)\]$/)[1]
}
