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

export const HAS_OWN_PROP = 'hasOwnProperty'

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

export type IArray<T> =
	| T[]
	| string
	| {
			length: number
			[Symbol.iterator](): IterableIterator<T>
	  }

export function EMPTY_FN() {}

export function NULL_CONSTRUCTOR() {}
NULL_CONSTRUCTOR[PROTOTYPE] = null
