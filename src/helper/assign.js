// @flow
/**
 * Object.assign shim
 * @module helper/assign
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 15:22:13 GMT+0800 (China Standard Time)
 * @modified Sat Nov 10 2018 16:40:55 GMT+0800 (China Standard Time)
 */
import create from './create'
import { hasOwnProp } from './ownProp'

/**
 * do assign
 * @function
 * @param  {Object} dist
 * @param  {Array<Object>} overrides
 * @param  {number=0} offset?
 * @param  {(prop:string,dist:Object,override:Object,data:any)=>boolean} filter?
 * @param  {any} data?
 * @returns {any}
 */
export function __assign(
	dist: Object,
	overrides: Array<Object>,
	offset?: number,
	filter?: (prop: string, dist: Object, override: Object, data: any) => boolean,
	data?: any
) {
	if (!dist) dist = {}
	let i = offset || 0,
		l = overrides.length,
		override,
		prop
	for (; i < l; i++) {
		if ((override = overrides[i]))
			for (prop in override) if (filter(prop, dist, override, data)) dist[prop] = override[prop]
	}
	return dist
}

/**
 * assign
 * > Object.assign shim
 * @function
 * @param  {Object} obj 	assign target
 * @param  {Array<Object>} ...args 	assign Objects
 * @returns Object
 */
export function assign(obj: Object): Object {
	return __assign(obj, arguments, 1, __assignFilter)
}

/**
 * default assign filter
 * @function
 * @param  {string} prop
 * @param  {Object} dist
 * @param  {Object} override
 * @returns {Object}
 */
export function __assignFilter(prop: string, dist: Object, override: Object): Object {
	return hasOwnProp(override, prop)
}

/**
 * assign if property is not exist
 * @function
 * @param  {Object} obj 	assign target
 * @param  {Array<Object>} ...args 	assign Objects
 * @returns {Object}
 */
export function assignIf(obj: Object): Object {
	return __assign(obj, arguments, 1, __assignIfFilter)
}

/**
 * assign if filter
 * @function
 * @param  {string} prop
 * @param  {Object} dist
 * @param  {Object} override
 * @returns {Object}
 */
export function __assignIfFilter(prop: string, dist: Object, override: Object): Object {
	return hasOwnProp(override, prop) && !hasOwnProp(dist, prop)
}

/**
 * assign by user filter
 * @function
 * @param  {Object} obj
 * @param  {(prop:string,dist:Object,overide:Object)=>boolean} filter
 * @param  {Array<Object>} ...args
 * @returns {Object}
 */
export function assignBy(obj: Object, filter: (prop: string, dist: Object, overide: Object) => boolean): Object {
	return __assign(obj, arguments, 2, __assignUserFilter, filter)
}

/**
 * user assign filter hook
 * @param  {string} prop
 * @param  {Object} dist
 * @param  {Object} override
 * @param  {(prop:string,dist:Object,overide:Object)=>boolean} cb
 * @returns {Object}
 */
export function __assignUserFilter(
	prop: string,
	dist: Object,
	override: Object,
	cb: (prop: string, dist: Object, overide: Object) => boolean
): Object {
	return hasOwnProp(override, prop) && cb(prop, dist, override)
}
