/*
 * Function List
 *
 * @author tao.zeng (tao.zeng.zt@gmail.com)
 * @created 2018-08-20 17:59:11
 * @Last Modified by: tao.zeng (tao.zeng.zt@gmail.com)
 * @Last Modified time: 2018-09-06 13:57:17
 */
import { assert } from 'devlevel'
import List from './List'
import { inherit, create, defPropValue } from '../helper'

export const DEFAULT_FN_BINDING = '__id__'
export const DEFAULT_SCOPE_BINDING = '__id__'
export default function FnList(fnBinding, scopeBinding) {
	this.nodeMap = create(null)
	this.list = new List()
	this.fnBinding = fnBinding || DEFAULT_FN_BINDING
	this.scopeBinding = scopeBinding || DEFAULT_SCOPE_BINDING
}

defPropValue(FnList, 'fnBinding', DEFAULT_FN_BINDING)
defPropValue(FnList, 'scopeBinding', DEFAULT_FN_BINDING)

inherit(FnList, {
	add(fn, scope, data) {
		assert.fn(fn, 'fn is not a Function.')
		scope = parseScope(scope)
		const { list, nodeMap } = this
		const id = nodeId(fn, scope, this)
		let node = nodeMap[id]
		if (!node) {
			node = [id, fn, scope, data]
			var ret = list.add(node)
			if (ret) nodeMap[id] = node
			return ret
		}
	},
	remove(fn, scope) {
		assert.fn(fn, 'fn is not a Function.')
		const { list, nodeMap } = this
		const id = nodeId(fn, parseScope(scope), this)
		const node = nodeMap[id]
		if (node) {
			nodeMap[id] = undefined
			return list.remove(node)
		}
		return false
	},
	has(fn, scope) {
		assert.fn(fn, 'fn is not a Function.')
		return !!this.nodeMap[nodeId(fn, parseScope(scope), this)]
	},
	size() {
		return this.list.length
	},
	clean() {
		this.nodeMap = create(null)
		this.list.clean()
	},
	each(cb, scope) {
		assert.fn(cb, 'callback is not a Function.')
		if (scope) cb = cb.bind(scope)
		this.list.each(node => cb(node[1], node[2], node[3]))
	},
})

const DEFAULT_SCOPE_ID = 1
let scopeIdGenerator = 1,
	fnIdGenerator = 0

function nodeId(fn, scope, list) {
	const { fnBinding, scopeBinding } = list

	let fnId = fn[fnBinding],
		scopeId = scope ? scope[scopeBinding] : DEFAULT_SCOPE_ID
	if (!fnId) fnId = defPropValue(fn, fnBinding, ++fnIdGenerator)
	if (!scopeId) scopeId = defPropValue(scope, scopeBinding, ++scopeIdGenerator)
	return `${fnId}&${scopeId}`
}

function parseScope(scope) {
	return !scope ? undefined : scope
}
