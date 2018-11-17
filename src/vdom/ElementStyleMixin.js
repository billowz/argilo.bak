/**
 * element css opeartions
 *
 * @module vdom
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Nov 06 2018 10:06:22 GMT+0800 (China Standard Time)
 * @modified Sat Nov 17 2018 09:29:10 GMT+0800 (China Standard Time)
 */
import {
	inDoc,
	getWindow,
	ROOTELEMENT,
	OWNER_DOCUMENT,
	PARENT_WINDOW,
	DEFAULT_VIEW,
	REMOVE_ATTRIBUTE,
	CLIENT_TOP,
	CLIENT_LEFT,
	SCROLL_LEFT,
	SCROLL_TOP,
	PAGE_XOFFSET,
	PAGE_YOFFSET
} from './util/util'
import createHook from './util/hook'
import { W3C, IE8 } from './util'
import { create, applyScope, makeMap, isNil, isStr } from '../helper'
import { $eachObj } from '../observer'

const numberCss = makeMap(
	'animationIterationCount,columnCount,order,flex,flexGrow,flexShrink,' +
		'fillOpacity,fontWeight,lineHeight,opacity,orphans,widows,zIndex,zoom'
)

const NAME = 'name',
	GET = 'get',
	SET = 'set'
const nameHooks = create(null)
const { memberHook, addHook } = createHook({
	get(el, name) {
		if (name === 'background') name = 'backgroundColor'
		return getStyle(el, name)
	},
	set(el, name, value) {
		el.style[name] = value
	}
})
nameHooks.float = W3C ? 'cssFloat' : 'styleFloat'

const OFFSET_PARENT = 'offsetParent',
	GET_BOUNDING_CLIENT_RECT = 'getBoundingClientRect',
	FILTER = 'filter',
	POSITION = 'position'

// ========================= Mixin =================================
function setCss(el, name, value) {
	name = camelize(name)
	if (isNil(value)) {
		value = ''
	} else if (!numberCss[name] && isFinite(value)) {
		value += 'px'
	}
	memberHook(name, SET)[SET](el, cssHookName(name), value, name)
}

export default {
	css(name, value) {
		const el = this.el
		if (arguments.length === 1) {
			if (isStr(name)) {
				name = camelize(name)
				const value = memberHook(name, GET)[GET](el, cssHookName(name), name),
					num = parseFloat(value)
				return isFinite(num) ? num : value
			}
			$eachObj(name, (value, name) => {
				setCss(el, name, value)
			})
		} else {
			setCss(el, name, value)
		}
		return this
	},
	offset() {
		const el = this.el,
			doc = el[OWNER_DOCUMENT],
			box = {
				top: 0,
				left: 0
			}

		if (!doc) return box

		const body = doc.body,
			win = doc[DEFAULT_VIEW] || doc[PARENT_WINDOW]

		if (!inDoc(el)) return box

		if (el[GET_BOUNDING_CLIENT_RECT]) {
			var rect = el[GET_BOUNDING_CLIENT_RECT]()
			box.top = rect.top
			box.left = rect.left
		}
		const clientTop = ROOTELEMENT[CLIENT_TOP] || body[CLIENT_TOP],
			clientLeft = ROOTELEMENT[CLIENT_LEFT] || body[CLIENT_LEFT],
			scrollTop = Math.max(win[PAGE_YOFFSET] || 0, ROOTELEMENT[SCROLL_TOP], body[SCROLL_TOP]),
			scrollLeft = Math.max(win[PAGE_XOFFSET] || 0, ROOTELEMENT[SCROLL_LEFT], body[SCROLL_LEFT])

		box.top += scrollTop - clientTop
		box.left += scrollLeft - clientLeft
		return box
	},
	position() {
		const el = this.el
		let top, left
		if (getStyle(el, POSITION) === 'fixed') {
			var o = el[GET_BOUNDING_CLIENT_RECT]()
			top = o.top
			left = o.left
		} else {
			var o = this.offset(el),
				p = offsetParent(el)
			top = o.top - getNumStyle(p, 'borderTopWidth') + this.scrollTop(p)
			left = o.left - getNumStyle(p, 'borderLeftWidth') + this.scrollLeft(p)
			if (p.tagName !== 'HTML') {
				var op = this.offset(p)
				top -= op.top
				left -= op.left
			}
		}
		return {
			top: top - getNumStyle(el, 'marginTop'),
			left: left - getNumStyle(el, 'marginLeft')
		}
	},
	scrollTop() {
		const el = this.el,
			win = getWindow(el)
		return (win ? (SCROLL_TOP in win ? win[SCROLL_TOP] : ROOTELEMENT[PAGE_YOFFSET]) : el[PAGE_YOFFSET]) || 0
	},
	scrollLeft() {
		const el = this.el,
			win = getWindow(el)
		return (win ? (SCROLL_LEFT in win ? win[SCROLL_LEFT] : ROOTELEMENT[PAGE_XOFFSET]) : el[PAGE_XOFFSET]) || 0
	},
	scrollTo(left, top) {
		const el = this.el,
			win = getWindow(el)
		if (win) {
			win.scrollTo(left, top)
		} else {
			el[PAGE_XOFFSET] = left
			el[PAGE_YOFFSET] = top
		}
	}
}

export function addDomStyleHook() {
	return applyNoScope(addHook, arguments)
}

function offsetParent(el) {
	let p = el[OFFSET_PARENT]
	while (p && getStyle(p, POSITION) === 'static') p = p[OFFSET_PARENT]
	return p || ROOTELEMENT
}

// ========================= css opeartions =================================

const cssPrefixes = ['', '-webkit-', '-o-', '-moz-', '-ms-'],
	host = ROOTELEMENT.style,
	cssPrefixeSize = cssPrefixes.length

function cssHookName(name) {
	let fixedName = nameHooks[name]
	if (fixedName) return fixedName
	for (var i = 0; i < cssPrefixeSize; i++) {
		fixedName = camelize(cssPrefixes[i] + name)
		if (fixedName in host) {
			nameHooks[name] = fixedName
			return fixedName
		}
	}
	throw new Error(`invalid style[${name}]`)
}

const GET_COMPUTED_STYLE = 'getComputedStyle'
const computedStyle = !!window[GET_COMPUTED_STYLE]

function getNumStyle(el, name) {
	const val = getStyle(el, name),
		i = parseFloat(val)
	return i === i ? i : 0
}
let getStyle
if (computedStyle) {
	getStyle = function(el, name) {
		const styles = window[GET_COMPUTED_STYLE](el, null)
		let value
		if (styles) {
			value = name === FILTER ? styles.getPropertyValue(name) : styles[name]
			if (value === '') value = el.style[name]
		}
		return value
	}
} else {
	const RUNTIME_STYLE = 'runtimeStyle',
		rnumnonpx = /^-?(?:\d*\.)?\d+(?!px)[^\d\s]+$/i,
		rposition = /^(top|right|bottom|left)$/,
		border = {
			thin: IE8 ? '1px' : '2px',
			medium: IE8 ? '3px' : '4px',
			thick: IE8 ? '5px' : '6px'
		}
	getStyle = function(el, name) {
		const currentStyle = el.currentStyle
		let value = currentStyle[name]
		if (rnumnonpx.test(value) && !rposition.test(value)) {
			const style = el.style,
				left = style.left,
				rsLeft = el[RUNTIME_STYLE].left

			el[RUNTIME_STYLE].left = currentStyle.left
			style.left = name === 'fontSize' ? '1em' : value || 0
			value = style.pixelLeft + 'px'
			style.left = left
			el[RUNTIME_STYLE].left = rsLeft
		}
		if (value === 'medium') {
			name = name.replace('Width', 'Style')
			if (currentStyle[name] === 'none') value = '0px'
		}
		return value === '' ? 'auto' : border[value] || value
	}
}

const camelizeReg = /[-_][^-_]/g

function camelize(target) {
	return target ? target.replace(camelizeReg, camelizeHandler) : target
}

function camelizeHandler(match) {
	return match.charAt(1).toUpperCase()
}

// ========================= hooks =================================
const OPACITY = 'opacity'
if (computedStyle) {
	addHook(OPACITY, {
		get(el, name) {
			let value = getStyle(el, name)
			return value === '' ? 1 : value
		}
	})
} else {
	const FILTERS = FILTER + 's',
		salpha = 'DXImageTransform.Microsoft.Alpha',
		ralpha = /alpha\([^)]*\)/i

	addHook(OPACITY, {
		get(el, name) {
			const alpha = el[FILTERS].alpha || el[FILTERS][salpha],
				op = alpha && alpha.enabled ? alpha[OPACITY] : 100
			return op / 100
		},
		set(el, name, value) {
			const style = el.style,
				opacity = isFinite(value) && value <= 1 ? `alpha(${OPACITY}=${value * 100})` : '',
				filter = style[FILTER] || ''
			style.zoom = 1
			style[FILTER] = trim(ralpha.test(filter) ? filter.replace(ralpha, opacity) : filter + ' ' + opacity)
			if (!style[FILTER]) style[REMOVE_ATTRIBUTE](FILTER)
		}
	})
}
