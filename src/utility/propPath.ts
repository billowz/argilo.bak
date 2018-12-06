import create from './create'
import { isArray } from './is'
import { mapArray } from './collection'

const pathCache: { [key: string]: string[] } = create(null)

// prop | [index | "string prop" | 'string prop']
const pathReg = /(?:^|\.)([a-zA-Z$_][\w$]*)|\[\s*(?:(\d+)|"((?:[^\\"]|\\.)*)"|'((?:[^\\']|\\.)*)')\s*\]/g

export function parsePath(path: string | string[], cacheable?: boolean): string[]
export function parsePath(path, cacheable) {
	if (isArray(path)) return path

	let array = pathCache[path]
	if (!array) {
		array = []
		var match,
			idx = 0,
			cidx,
			i = 0
		while ((match = pathReg.exec(path))) {
			cidx = pathReg.lastIndex
			if (cidx !== idx + match[0].length) {
				throw new SyntaxError(`Invalid Path: "${path}", unkown character[${path.charAt(idx)}] at offset:${idx}`)
			}
			array[i++] = match[1] || match[2] || match[3] || match[4]
			idx = cidx
		}
		if (cacheable === false) return array
		pathCache[path] = array
	}
	return array.slice()
}

export function formatPath(path: string | string[]): string {
	return isArray(path) ? mapArray(path, formatPathHandler).join('') : (path as string)
}

function formatPathHandler(prop: string): string {
	return `["${String(prop).replace("'", '\\"')}"]`
}

export function get(obj, path) {
	path = parsePath(path)
	const l = path.length - 1
	if (l === -1) return obj
	let i = 0
	for (; i < l; i++) {
		obj = obj[path[i]]
		if (obj === null || obj === undefined) return undefined
	}
	return obj ? obj[path[i]] : undefined
}

export function set(obj, path, value) {
	path = parsePath(path)
	const l = path.length - 1
	if (l === -1) return
	let attr,
		v,
		i = 0
	for (; i < l; i++) {
		attr = path[i]
		v = obj[attr]
		if (!v) obj[attr] = v = {}
		obj = v
	}
	attr = path[i]
	obj[attr] = value
}
