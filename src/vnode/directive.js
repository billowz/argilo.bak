/*
 * @author tao.zeng (tao.zeng.zt@gmail.com)
 * @created 2018-08-29 12:36:45
 * @Last Modified by: tao.zeng (tao.zeng.zt@gmail.com)
 * @Last Modified time: 2018-09-04 18:03:59
 */
import { assert, info } from 'devlevel'
import { createClass, inherit, create, subclassOf, fnName, isObj, isFn } from '../helper'
import { PROTOTYPE } from '../helper/constants'

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
	},
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
