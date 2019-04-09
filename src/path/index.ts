/**
 * @module util/path
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Fri Nov 30 2018 14:41:02 GMT+0800 (China Standard Time)
 * @modified Mon Apr 08 2019 13:47:29 GMT+0800 (China Standard Time)
 */

import { create, mapArray, defValue, addDKey, isArray } from '../util'

export const PATH_BINDING = addDKey('__path__')
const pathCache: { [key: string]: string[] } = create(null)

// (^ | .) prop | (index | "string prop" | 'string prop')
const pathReg = /(?:^|\.)([a-zA-Z$_][\w$]*)|\[\s*(?:(\d+)|"((?:[^\\"]|\\.)*)"|'((?:[^\\']|\\.)*)')\s*\]/g

export function parsePath(propPath: string | string[], cacheable?: boolean): string[] {
	let path: string[]
	if (isArray(propPath)) {
		path = propPath as string[]
	} else if ((path = pathCache[propPath as string])) {
		return path
	} else {
		path = []
		var match: string[],
			idx = 0,
			cidx: number,
			i = 0
		while ((match = pathReg.exec(propPath as string))) {
			cidx = pathReg.lastIndex
			if (cidx !== idx + match[0].length)
				throw new SyntaxError(
					`Invalid Path: "${propPath}", unkown character[${(propPath as string).charAt(
						idx
					)}] at offset:${idx}`
				)
			path[i++] = match[1] || match[2] || match[3] || match[4]
			idx = cidx
		}
		if (propPath.length > idx + 1) {
			throw new SyntaxError(
				`Invalid Path: "${propPath}", unkown character[${(propPath as string).charAt(idx)}] at offset:${idx}`
			)
		}
		if (cacheable !== false && i) {
			pathCache[propPath as string] = path
		}
	}
	if (!path.length) throw new Error(`Empty Path: ${propPath}`)
	return path
}

export function formatPath(path: string | (string[] & { path?: string })): string {
	return isArray(path)
		? (path as string[] & { path?: string }).path ||
				defValue(path, PATH_BINDING, mapArray(path, formatPathHandler).join(''))
		: (path as string)
}

function formatPathHandler(prop: string): string {
	return `["${String(prop).replace("'", '\\"')}"]`
}

export function get<T>(obj: any, path: string | string[]): any {
	path = parsePath(path)
	const l = path.length - 1
	let i = 0
	for (; i < l; i++) {
		obj = obj[path[i]]
		if (obj === null || obj === undefined) return
	}
	return obj[path[i]]
}

export function set(obj: any, path: string | string[], value: any) {
	path = parsePath(path)
	const l = path.length - 1
	let i = 0,
		v: any
	for (; i < l; i++) {
		v = obj[path[i]]
		obj = v === null || v === undefined ? (obj[path[i]] = {}) : v
	}
	obj[path[i]] = value
}
