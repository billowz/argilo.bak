/*
 * @author tao.zeng (tao.zeng.zt@gmail.com)
 * @created 2018-08-20 19:53:22
 * @Last Modified by: tao.zeng (tao.zeng.zt@gmail.com)
 * @Last Modified time: 2018-09-05 15:29:52
 */
import { assert } from 'devlevel'
import ExpressionDirective from './ExpressionDirective'
import { registerDirective } from '../../vnode'
import { isStr, upperFirst, isObj, assignBy, create, isArray, eachObj, isArrayLike } from '../../helper'
import { PROTOTYPE } from '../../helper/constants'
import { STOP_PROPAGATION } from '../util/util'

const DISPLAY = 'display',
	NONE = 'none'
eachObj(
	{
		// ================ text =================
		text: {
			update(value) {
				this.node.text(this.blankValue(value))
			},
		},
		// ================ html =================
		html: {
			update(value) {
				this.node.html(this.blankValue(value))
			},
		},
		// ================ show =================
		show: {
			update(value) {
				this.node.css(DISPLAY, value ? '' : NONE)
			},
		},
		// ================ hide =================
		hide: {
			update(value) {
				this.node.css(DISPLAY, value ? NONE : '')
			},
		},
		// ================ focus =================
		focus: {
			update(value) {
				if (value) this.node.focus()
			},
		},
		// ================ value (input/textarea/select/option) =================
		value: {
			update(value) {
				this.node.value(this.blankValue(value))
			},
		},
		// ================ checked (radio/checkbox) =================
		checked: {
			update(value) {
				const node = this.node
				node.checked(boolVal(node.value(), value))
			},
		},
		// ================ selected (option) =================
		selected: {
			update(value) {
				const node = this.node
				node.selected(boolVal(node.value(), value))
			},
		},
		// ================ class =================
		class: {
			update(value) {
				if (isStr(value)) value = trim(value).split(/\s+/g)

				const cache = create(null),
					oldCache = this.cache
				if (oldCache) {
					for (var k in oldCache) if (oldCache[k] === true) cache[k] = false
				}
				if (isArrayLike(value)) {
					var i = value.length
					while (i--) cache[value[i]] = true
				} else if (value) {
					for (var k in value) if (value[k] === true) cache[k] = true
				}
				this.cache = cache
				this.node.margeClass(cache)
			},
		},
		// =================== style =======================
		style: {
			update(value) {
				let ncsses
				if (typeof value === 'string' && (value = trim(value))) {
					var split = value.split(styleSplitReg)
					ncsses = {}
					for (var i = 0, l = split.length, s; i < l; i++) {
						s = split[i].split(cssSplitReg)
						ncsses[s[0]] = s[1]
					}
				} else if (isObj(value)) {
					ncsses = value
				}
				let csses = this.csses
				if (csses) {
					if (ncsses) {
						for (var name in csses) if (!ncsses[name]) css(el, name, '')
					} else {
						for (var name in csses) css(el, name, '')
					}
				}
				this.csses = ncsses
				if (ncsses) {
					for (var name in ncsses) css(el, name, ncsses[name])
				}
			},
		},
	},
	(directive, name) => {
		__register(name, directive)
	}
)

function __register(name, directive) {
	directive.extend = ExpressionDirective
	directive.name = upperFirst(name) + 'Directive'
	registerDirective(name, directive)
}

// ================================= input =======================
const EVENT_CHANGE = 'change',
	EVENT_INPUT = 'input',
	EVENT_CLICK = 'click',
	SELECT = 'select',
	OPTION = 'option',
	TEXTAREA = 'textarea',
	INPUT = 'input',
	INPUT_RADIO = 'radio',
	INPUT_CHECKBOX = 'checkbox'

const { prepare, bind, unbind } = ExpressionDirective[PROTOTYPE]

__register('input', {
	prepare(params, D) {
		prepare.call(this, params, D)
		params.expr.checkRestore()
	},
	constructor(node, params) {
		ExpressionDirective.call(this, node, params)

		assert(this.expr.simple, `Invalid Expression[${params.value}] on directive[input]`)

		let type = node.tagName,
			event = EVENT_CHANGE,
			domValue = this.elemValue
		switch (type) {
			case INPUT:
				switch (node.el.type) {
					case INPUT_RADIO:
					case INPUT_CHECKBOX:
						type = itype
						domValue = this.checkedValue
						break
					default:
						event = EVENT_INPUT
				}
				break
			case TEXTAREA:
				event = EVENT_INPUT
				break
			case SELECT:
				break
			default:
				throw new TypeError(`<${type}> not support Directive[input], should be <input | textarea | select>`)
		}
		this.type = type
		this.event = event
		this.domValue = domValue
	},
	update(value) {
		this.node.value(this.blankValue(value))
	},
	elemValue(value) {
		const node = this.node
		if (arguments.length === 0) return node.value()
		node.value(value)
	},
	checkedValue(value) {
		const node = this.node
		if (arguments.length === 0) return node.checked() ? node.value() : undefined
		node.checked(value == node.value())
	},
	onChange(e) {
		const expr = this.expr
		this.comp.set(expr.simple, expr.restore(this.domValue(), this.comp, [this.node]))
		e[STOP_PROPAGATION]()
	},
	bind() {
		bind.call(this)
		this.node.on(this.event, this.onChange, this)
	},
	unbind() {
		this.node.un(this.event, this.onChange, this)
		unbind.call(this)
	},
})

function boolVal(elValue, value) {
	if (isArray(value)) {
		var i = value.length
		while (i--) if (value[i] === elValue) return true
		return false
	} else if (isStr(value)) {
		return value === elValue
	} else if (isObj(value)) {
		return !!value[elValue]
	}
	return !!value
}
