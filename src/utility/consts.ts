/**
 *
 * @author Tao Zeng (tao.zeng.zt@qq.com)
 * @module utility
 * @created 2018-11-09 15:23:35
 * @modified 2018-11-09 15:23:35 by Tao Zeng (tao.zeng.zt@qq.com)
 */

export const CONSTRUCTOR = 'constructor'

export const PROTOTYPE = 'prototype'

export const PROTO = '__proto__'

export const TYPE_BOOL = 'boolean'

export const TYPE_FN = 'function'

export const TYPE_NUM = 'number'

export const TYPE_STRING = 'string'

export const TYPE_UNDEF = 'undefined'

export const GLOBAL: any =
	typeof window !== TYPE_UNDEF
		? window
		: typeof global !== TYPE_UNDEF
		? global
		: typeof self !== TYPE_UNDEF
		? self
		: {}

export interface ObjArray {
	length: number
}
export type IArray = any[] | string | IArguments | ObjArray

export function EMPTY_FN() {}
