/**
 * @module utility/prop
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Fri Nov 30 2018 14:41:02 GMT+0800 (China Standard Time)
 * @modified Fri Dec 21 2018 14:15:13 GMT+0800 (China Standard Time)
 */

import { create } from './create'
import { isArray } from './is'
import { mapArray } from './collection'

const pathCache: { [key: string]: string[] } = create(null)

// (^ | .) prop | (index | "string prop" | 'string prop')
const pathReg = /(?:^|\.)([a-zA-Z$_][\w$]*)|\[\s*(?:(\d+)|"((?:[^\\"]|\\.)*)"|'((?:[^\\']|\\.)*)')\s*\]/g

export function parsePath(path: string | string[], cacheable?: boolean): string[] {
	if (isArray(path)) return path as string[]

	let array = pathCache[path as string]
	if (!array) {
		array = []
		var match: string[],
			idx = 0,
			cidx: number,
			i = 0
		while ((match = pathReg.exec(path as string))) {
			cidx = pathReg.lastIndex
			if (cidx !== idx + match[0].length)
				throw new SyntaxError(
					`Invalid Path: "${path}", unkown character[${(path as string).charAt(idx)}] at offset:${idx}`
				)
			array[i++] = match[1] || match[2] || match[3] || match[4]
			idx = cidx
		}
		if (cacheable === false) return array
		pathCache[path as string] = array
	}
	return array.slice()
}

export function formatPath(path: string | string[]): string {
	return isArray(path) ? mapArray(path, formatPathHandler).join('') : (path as string)
}

function formatPathHandler(prop: string): string {
	return `["${String(prop).replace("'", '\\"')}"]`
}

export function get(obj: any, path: string | string[]): any {
	path = parsePath(path)
	const l = path.length - 1
	let i = 0
	for (; i < l; i++) if ((obj = obj[path[i]]) === null || obj === undefined) return
	if (obj && ~l) return obj[path[i]]
}

export function set(obj: any, path: string | string[], value: any) {
	path = parsePath(path)
	const l = path.length - 1
	let i = 0
	for (; i < l; i++) obj = obj[path[i]] || (obj[path[i]] = {})
	~l && (obj[path[i]] = value)
}
