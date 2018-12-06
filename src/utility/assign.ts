/**
 * Object.assign shim
 * @module utility/assign
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 15:22:13 GMT+0800 (China Standard Time)
 * @modified Tue Nov 27 2018 14:03:59 GMT+0800 (China Standard Time)
 */
import { hasOwnProp } from './prop'

/**
 * @param prop
 * @param target
 * @param override
 * @return is assign
 */
export type AssignFilter = (prop: string, target: any, override: any) => boolean

/**
 *
 * @param target
 * @param overrides
 * @param filter
 * @param startOffset 	start offset in overrides, default: 0
 * @param endOffset 	end offset in overrides, default: overrides.length-1
 */
export function doAssign(
	target: any,
	overrides: object[] | IArguments,
	filter: AssignFilter,
	startOffset?: number,
	endOffset?: number
): any {
	if (!target) {
		target = {}
	}
	const l = endOffset || overrides.length - 1
	let i = startOffset || 0,
		override,
		prop
	for (; i < l; i++) {
		if ((override = overrides[i])) {
			for (prop in override) {
				if (filter(prop, target, override)) {
					target[prop] = override[prop]
				}
			}
		}
	}
	return target
}

/**
 * assign properties
 * > Object.assign shim
 */
export function assign(target: any, ...args: any[]): any
export function assign(target: any): any {
	return doAssign(target, arguments, defaultAssignFilter, 1)
}

/**
 * assign un-exist properties
 */
export function assignIf(target: any, ...args: any[]): any
export function assignIf(target: any): any {
	return doAssign(target, arguments, assignIfFilter, 1)
}

/**
 * default assign filter
 * - property is owner in override
 * @see {AssignFilter}
 */
export function defaultAssignFilter(prop: string, target: any, override: any): boolean {
	return hasOwnProp(override, prop)
}

/**
 * assign if filter
 * - property is owner in override
 * - property not in target object
 * @see {AssignFilter}
 */
export function assignIfFilter(prop: string, target: any, override: any): boolean {
	return hasOwnProp(override, prop) && !(prop in target)
}
