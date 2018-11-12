export { default as VNode } from './VNode'
export { default as VText } from './VText'
export { default as VBindingText } from './VBindingText'
export { default as VElement } from './VElement'
export { default as VComplexElement } from './VComplexElement'
export { default as Compontent } from './Compontent'
export { default as VComment } from './VComment'
export { default as TransformExpression, transforms } from './expression'
export * from './Directive'

import { assert, info, debug } from 'devlevel'
import { create, fnName } from '../helper'
import { PROTOTYPE } from '../helper/constants'
import { VIRT_TEXT, VIRT_BINDING_TEXT, VIRT_COMMENT, VIRT_ELEMENT, VIRT_COMPLEX_ELEMENT } from './VNode'

const VElements = create(null)
export const tags = create(VElements)
let Text, BindingText, Comment

export function registerVElement(name, VElement) {
	assert(!VElements[name], `Double Register Virtual Element: ${fnName(VElement)} <${name}>`)
	assert(VElement[PROTOTYPE][VIRT_ELEMENT], `Invalid Virtual Element: ${fnName(VElement)} <${name}>`)

	VElements[name] = VElement

	info(`register Virtual Element: ${fnName(VElement)} <${name}>`)
	return VElement
}

export function registerVText(VText) {
	assert(!Text, `Double Register Virtual Text`)
	assert(VText[PROTOTYPE][VIRT_TEXT], `Invalid Virtual Node: ${fnName(VText)}`)

	Text = VText

	info(`register Virtual Text: ${fnName(VText)}`)
	return Text
}

export function registerVBindingText(VBindingText) {
	assert(!BindingText, `Double Register Virtual Binding Text`)
	assert(VBindingText[PROTOTYPE][VIRT_BINDING_TEXT], `Invalid Virtual Binding Text: ${fnName(VBindingText)}`)

	BindingText = VBindingText

	info(`register Virtual Binding Text: ${fnName(VBindingText)}`)
	return BindingText
}

export function registerVComment(VComment) {
	assert(!Comment, `Double Register Virtual Comment `)
	assert(VComment[PROTOTYPE][VIRT_COMMENT], `Invalid Virtual Comment: ${fnName(VComment)}`)

	Comment = VComment

	info(`register Virtual Comment : ${fnName(VComment)}`)
	return VComment
}

export function elem(name, attrs, directives, children) {
	const VElement = VElements[name]
	if (children && !children.length) children = undefined

	assert(VElement, `Virtual Element[${name}] is undefined`)

	assert(!children || !children.length || VElement[PROTOTYPE][VIRT_COMPLEX_ELEMENT], `Virtual Element[${name}] have no children`)

	const gen = generator(VElement, {
		attrs,
		directives,
		children,
	})
	gen.ename = name
	return gen
}

export function text(text, isExpr) {
	return generator(isExpr ? BindingText : Text, text)
}

export function comment(comment) {
	return generator(Comment, comment)
}

function generator(VNode, option) {
	option = VNode[PROTOTYPE].prepare(option, VNode) || option

	function generator(comp) {
		return new VNode(comp, option)
	}
	generator.VNode = VNode
	generator.option = option

	return generator
}
