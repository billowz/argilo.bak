/**
 *
 * @module util
 * @author Tao Zeng (tao.zeng.zt@qq.com)
 * @created 2018-11-09 15:23:35
 * @modified 2018-11-09 15:23:35 by Tao Zeng (tao.zeng.zt@qq.com)
 */

export const P_CTOR = 'constructor'

export const P_PROTOTYPE = 'prototype'

export const P_PROTO= '__proto__'

export const P_OWNPROP = 'hasOwnProperty'

export const T_BOOL = 'boolean'

export const T_FN = 'function'

export const T_NUM = 'number'

export const T_STRING = 'string'

export const T_UNDEF = 'undefined'

export const GLOBAL: any =
	typeof window !== T_UNDEF
		? window
		: typeof global !== T_UNDEF
		? global
		: typeof self !== T_UNDEF
		? self
		: {}

export type IArray<T> =
	| T[]
	| string
	| {
			length: number
			[Symbol.iterator](): IterableIterator<T>
	  }

export function EMPTY_FN() {}

export function NULL_CTOR() {}
NULL_CTOR[P_PROTOTYPE] = null
