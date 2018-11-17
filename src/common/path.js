// @flow
/**
 * String format
 * @module common
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Mon Dec 11 2017 14:35:32 GMT+0800 (China Standard Time)
 * @modified Fri Nov 16 2018 19:19:35 GMT+0800 (China Standard Time)
 */
import { assert } from 'devlevel'
import { create, isArray } from '../helper'

const pathCache = create(null),
	pathReg = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g,
	escapeCharReg = /\\(\\)?/g,
	formatReg = /(?:\.|^)([^a-zA-Z_$][^.]*)/g

export function parsePath(path, cache) {
	if (isArray(path)) return path

	assert.str(path, `Require path[Array | String]`)

	let rs = pathCache[path]
	if (!rs) {
		rs = []
		if (cache !== false) pathCache[path] = rs
		path.replace(pathReg, function(match, number, quote, string) {
			rs.push(quote ? string.replace(escapeCharReg, '$1') : number || match)
		})
	}
	return rs.slice()
}

export function formatPath(path) {
	if (isArray(path)) return path.join('.').replace(formatReg, formatHandle)
	assert.str(path, `Require path[Array | String]`)
	return path
}

function formatHandle(m, i) {
	return `['${i}']`
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
