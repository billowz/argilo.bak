/**
 * @module vdom
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Nov 06 2018 10:06:22 GMT+0800 (China Standard Time)
 * @modified Sat Nov 17 2018 09:27:59 GMT+0800 (China Standard Time)
 */
import createHook from './util/hook'
import {
	SET_ATTRIBUTE,
	GET_ATTRIBUTE,
	REMOVE_ATTRIBUTE,
	CHECKED,
	SELECTED,
	DISABLED,
	READ_ONLY,
	TAB_INDEX,
	HTML_FOR
} from './util/util'
import { $eachObj } from '../observer'
import { create, applyNoScope, isStr } from '../helper'

const GET_ATTRIBUTENODE = GET_ATTRIBUTE + 'Node'

const NAME = 'name',
	GET = 'get',
	SET = 'set'

const { hookMember, memberHook, addHook } = createHook(
	{
		get(el, name) {
			return el[name]
		},
		set(el, name, value) {
			el[name] = value
		}
	},
	{
		tabIndex: {
			get(el, name) {
				let attributeNode = el[GET_ATTRIBUTENODE]('tabindex')
				return attributeNode && attributeNode.specified
					? parseInt(attributeNode.value, 10)
					: rfocusable.test(el.nodeName) || (rclickable.test(el.nodeName) && el.href)
					? 0
					: undefined
			}
		}
	},
	{
		tabindex: TAB_INDEX,
		readonly: READ_ONLY,
		for: HTML_FOR,
		class: 'className',
		maxlength: 'maxLength',
		cellspacing: 'cellSpacing',
		cellpadding: 'cellPadding',
		rowspan: 'rowSpan',
		colspan: 'colSpan',
		usemap: 'useMap',
		frameborder: 'frameBorder',
		contenteditable: 'contentEditable'
	},
	NAME
)

export default {
	initAttrs(attrs) {
		attrs && this.attr(attrs)
	},
	attr(name, value) {
		const el = this.el
		if (arguments.length === 1) {
			if (isStr(name)) return el[GET_ATTRIBUTE](name)
			$eachObj(name, (value, name) => {
				el[SET_ATTRIBUTE](name, value)
			})
		} else {
			el[SET_ATTRIBUTE](name, value)
		}
		return this
	},
	removeAttr(name) {
		this.el[REMOVE_ATTRIBUTE](name)
		return this
	},
	prop(name, value) {
		const el = this.el
		if (arguments.length === 1) {
			if (isStr(name)) return getProp(el, name)
			$eachObj(name, (value, name) => {
				setProp(el, name, value)
			})
		} else {
			setProp(el, name, value)
		}
		return this
	},
	checked: propAccessor(CHECKED),
	selected: propAccessor(SELECTED),
	disabled: propAccessor(DISABLED),
	readonly: propAccessor(READ_ONLY),
	tabindex: propAccessor(TAB_INDEX),
	for: propAccessor(HTML_FOR)
}

export function addDomPropHook() {
	return applyNoScope(addHook, arguments)
}

function propAccessor(PROP) {
	return function(value) {
		const el = this.el
		if (arguments.length) {
			setProp(el, PROP, value)
			return this
		}
		return getProp(el, PROP)
	}
}

function getProp(el, name) {
	name = hookMember(name, NAME)
	return memberHook(name, GET)[GET](el, name)
}

function setProp(el, name, value) {
	name = hookMember(name, NAME)
	memberHook(name, SET)[SET](el, name, value)
}
