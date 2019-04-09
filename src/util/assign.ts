/**
 * Object.assign shim
 * @module util
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 15:22:13 GMT+0800 (China Standard Time)
 * @modified Mon Apr 08 2019 14:11:20 GMT+0800 (China Standard Time)
 */
import { hasOwnProp } from './ownProp'
import { DKeyMap } from './dkeys'

/**
 * @param prop
 * @param target
 * @param source
 * @return is assign
 */
export type AssignFilter<T, O> = (prop: string, target: T, source: O) => boolean

/**
 *
 * @param target
 * @param sources
 * @param filter
 * @param startOffset 	start offset in sources, default: 0
 * @param endOffset 	end offset in sources, default: sources.length-1
 */
export function doAssign<T extends object, U>(target: T, sources: [U], filter: AssignFilter<T, U>): T & U
export function doAssign<T extends object, U, V>(target: T, sources: [U, V], filter: AssignFilter<T, U | V>): T & U & V
export function doAssign<T extends object, U, V, W>(
	target: T,
	sources: [U, V],
	filter: AssignFilter<T, U | V | W>
): T & U & W
export function doAssign<T extends object>(
	target: T,
	sources: any[] | IArguments,
	filter: AssignFilter<T, object>,
	startOffset?: number,
	endOffset?: number
): any
export function doAssign<T extends object>(
	target: T,
	sources: any[] | IArguments,
	filter: AssignFilter<T, object>,
	startOffset?: number,
	endOffset?: number
): any {
	const l = endOffset || sources.length
	let i = startOffset || 0,
		source: any,
		prop: string
	target || (target = {} as T)
	for (; i < l; i++) {
		if ((source = sources[i])) {
			for (prop in source) {
				if (!DKeyMap[prop] && filter(prop, target, source)) {
					target[prop] = source[prop]
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
export function assign<T, U>(target: T, source: U): T & U
export function assign<T, U, V>(target: T, source: U, source2: V): T & U & V
export function assign<T, U, V, W>(target: T, source: U, source2: V, source3: W): T & U & W
export function assign(target: object, ...args: any[]): any
export function assign(target: object): any {
	return doAssign(target, arguments, defaultAssignFilter, 1)
}

/**
 * assign un-exist properties
 */
export function assignIf<T, U>(target: T, source: U): T & U
export function assignIf<T, U, V>(target: T, source: U, source2: V): T & U & V
export function assignIf<T, U, V, W>(target: T, source: U, source2: V, source3: W): T & U & W
export function assignIf(target: object, ...args: any[]): any
export function assignIf(target: object): any {
	return doAssign(target, arguments, assignIfFilter, 1)
}

/**
 * default assign filter
 * - property is owner in source
 * @see {AssignFilter}
 */
export function defaultAssignFilter(prop: string, target: object, source: object): boolean {
	return hasOwnProp(source, prop)
}

/**
 * assign if filter
 * - property is owner in source
 * - property not in target object
 * @see {AssignFilter}
 */
export function assignIfFilter(prop: string, target: object, source: object): boolean {
	return hasOwnProp(source, prop) && !(prop in target)
}
