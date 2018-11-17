/**
 * @module vnode
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Nov 06 2018 10:06:22 GMT+0800 (China Standard Time)
 * @modified Sat Nov 17 2018 09:30:38 GMT+0800 (China Standard Time)
 */
import { assert, info } from 'devlevel'
import { createClass, inherit, create, subclassOf, fnName, isObj, isFn } from '../helper'
import { PROTOTYPE } from '../helper/consts'

export const directives = create(null)
export function Directive(node, params) {
	this.comp = node.comp
	this.node = node
	this.params = params
}
inherit(Directive, {
	$directive: true,
	$nodeKey: '$virtElement',
	$nodeName: 'Virtual Element',
	prepare() {},
	bind() {},
	unbind() {},
	observeExpr(expr, cb, scope) {
		return this.comp.observeExpr(expr, cb, scope)
	},
	unobserveExpr(expr, cb, scope) {
		return this.comp.unobserveExpr(expr, cb, scope)
	}
})

export function registerDirective(name, directive) {
	name = name.toLowerCase()
	assert(!directives[name], `Double Register Directive[${name}]`)
	if (!isFn(directive)) {
		if (!directive.extend) directive.extend = Directive
		directive = createClass(directive)
	}
	assert(directive[PROTOTYPE].$directive, `Invalid Directive[${name}], should extend Directive`)

	directives[name] = directive
	info(`Register Directive: ${fnName(directive)} [${name}]`)
	return directive
}

export function directive(name, value, params) {
	const Directive = directives[name]
	assert(Directive, `Directive[${name}] is undefined`)
	if (!params) params = {}
	params.value = value
	params = Directive[PROTOTYPE].prepare(params, Directive) || params

	generator.params = params
	generator.dname = name
	generator.Directive = Directive

	function generator(node) {
		return new Directive(node, params)
	}
	return generator
}
