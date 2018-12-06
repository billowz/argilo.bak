/**
 * Function List
 * @module utility/List
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Mon Dec 11 2017 14:35:32 GMT+0800 (China Standard Time)
 * @modified Tue Nov 27 2018 19:56:10 GMT+0800 (China Standard Time)
 */

import { List } from './List'
import create from '../create'
import { defPropValue } from '../prop'

export const DEFAULT_FN_BINDING = '__id__'
export const DEFAULT_SCOPE_BINDING = '__id__'

export class FnList {
	static fnBinding: string = DEFAULT_FN_BINDING
	static scopeBinding: string = DEFAULT_SCOPE_BINDING

	nodeMap: object
	list: List
	fnBinding: string
	scopeBinding: string
	constructor(fnBinding?: string, scopeBinding?: string) {
		this.nodeMap = create(null)
		this.list = new List()
		this.fnBinding = fnBinding || DEFAULT_FN_BINDING
		this.scopeBinding = scopeBinding || DEFAULT_SCOPE_BINDING
	}
	add(fn: Function, scope?: any, data?: any): number {
		scope = parseScope(scope)
		const { list, nodeMap } = this
		const id = nodeId(this, fn, scope)
		let node = nodeMap[id]
		if (!node) {
			node = [id, fn, scope, data]
			var ret = list.add(node)
			if (ret) nodeMap[id] = node
			return ret
		}
	}
	remove(fn: Function, scope?: any): number {
		const { list, nodeMap } = this
		const id = nodeId(this, fn, parseScope(scope))
		const node = nodeMap[id]
		if (node) {
			nodeMap[id] = undefined
			return list.remove(node)
		}
	}
	has(fn: Function, scope?: any): boolean {
		return !!this.nodeMap[nodeId(this, fn, parseScope(scope))]
	}
	size(): number {
		return this.list.length
	}
	clean() {
		this.nodeMap = create(null)
		this.list.clean()
	}
	each(cb: (fn: Function, scope: any, data: any) => boolean | void, scope?: any) {
		cb = cb.bind(scope)
		this.list.each(node => cb(node[1], node[2], node[3]))
	}
}

const DEFAULT_SCOPE_ID = 1
let scopeIdGenerator = 1,
	fnIdGenerator = 0

function nodeId(list: FnList, fn: Function, scope?: any) {
	const { fnBinding, scopeBinding } = list

	let fnId = fn[fnBinding],
		scopeId = scope ? scope[scopeBinding] : DEFAULT_SCOPE_ID
	if (!fnId) fnId = defPropValue(fn, fnBinding, ++fnIdGenerator)
	if (!scopeId) scopeId = defPropValue(scope, scopeBinding, ++scopeIdGenerator)
	return `${fnId}&${scopeId}`
}

function parseScope(scope: any): any {
	return !scope ? undefined : scope
}
