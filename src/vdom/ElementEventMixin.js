import { assert } from 'devlevel'
import { W3C, IE9 } from './util'
import {
	ROOTELEMENT,
	DOCUMENT_ELEMENT,
	OWNER_DOCUMENT,
	CREATE_ELEMENT,
	ADD_EVENT_LISTENER,
	ATTACH_EVENT,
	PARENT_NODE,
	CURRENT_TARGET,
	PREVENT_DEFAULT,
	STOP_PROPAGATION,
	STOP_IMMEDIATE_PROPAGATION,
	SCROLL_LEFT,
	SCROLL_TOP,
	CLIENT_TOP,
	CLIENT_LEFT,
	CLIENTX,
	CLIENTY,
	PAGEX,
	PAGEY,
	DISABLED,
} from './util/util'
import createHook from './util/hook'
import { inherit, create, applyScope, applyNoScope, hasOwnProp, isFn, isStr, makeMap } from '../helper'
import { FnList } from '../common'
import { DEFAULT_FN_BINDING } from '../common/FnList'

const TYPE = 'type'
const { getHook, hookRevice, addHook } = createHook(null, null, TYPE, TYPE)

// ========================= Mixin =================================
const DOM_ELEMENT = '__element__'

const MIXIN_EVENTS = '__domEvents',
	MIXIN_ADD_LISTEN = '__addDomListen',
	MIXIN_DEL_LISTEN = '__delDomListen',
	MIXIN_EMIT_LISTEN = '__emitDomEvent'

const EventMixin = {
	initDomEvent() {
		this.el[DOM_ELEMENT] = this
		this[MIXIN_EVENTS] = create(null)
	},
	on(type, fn, scope) {
		assert.fn(fn, 'Invalid Event Listener')

		if (this[MIXIN_ADD_LISTEN](type, fn, scope) === 1) {
			const el = this.el,
				hook = getHook(type)
			if (hook) {
				if (hook.type) type = hook.type
				if (hook.bind && hook.bind(el, type) === false) return
			}
			bindDispatcher(el, type)
		}
	},
	un(type, fn, scope) {
		assert.fn(fn, 'Invalid Event Listener')

		if (this[MIXIN_DEL_LISTEN](type, fn, scope) === 0) {
			const el = this.el,
				hook = getHook(type)
			if (hook) {
				if (hook.type) type = hook.type
				if (hook.unbind && hook.unbind(el, type) === false) return
			}
			unbindDispatcher(el, type)
		}
	},
	once(type, fn, scope) {
		assert.fn(fn, 'Invalid Event Listener')

		const el = this.el,
			binding = fn[DEFAULT_FN_BINDING],
			self = this

		if (binding) proxy[DEFAULT_FN_BINDING] = binding

		this.on(type, proxy, scope)

		if (!binding) fn[DEFAULT_FN_BINDING] = cb[DEFAULT_FN_BINDING]

		function proxy() {
			applyScope(fn, this, arguments)
			self.un(type, proxy, scope)
		}
	},
}

EventMixin[MIXIN_ADD_LISTEN] = function(type, fn, scope) {
	const events = this[MIXIN_EVENTS],
		listens = events[type] || (events[type] = new FnList())
	return listens.add(fn, scope)
}

EventMixin[MIXIN_DEL_LISTEN] = function(type, fn, scope) {
	const events = this[MIXIN_EVENTS],
		listens = events[type]
	return listens && listens.remove(fn, scope)
}

EventMixin[MIXIN_EMIT_LISTEN] = function(type, event) {
	const events = this[MIXIN_EVENTS],
		listens = events[type]
	if (listens && listens.size()) {
		if (!event.$hookEvent) {
			event = packEvent(type, event)
			const target = event.target
			event.targetEl = target
			event.target = target[DOM_ELEMENT]
		}
		event.current = this
		event[IS_IMMEDIATE_PROPAGATION_STOPPED] = false
		listens.each((fn, scope) => {
			return fn.call(scope || this, event, this) !== false && !event[IS_IMMEDIATE_PROPAGATION_STOPPED]
		})
	}
	return event
}

export default EventMixin

export function addDomEventHook() {
	return applyNoScope(addHook, arguments)
}

const ORIGINAL_EVENT = 'originalEvent',
	RETURN_VALUE = 'returnValue',
	GET_PREVENT_DEFAULT = 'getPreventDefault',
	TIME_STAMP = 'timeStamp',
	ORIGINAL_PROPS = 'originalProps',
	IS_IMMEDIATE_PROPAGATION_STOPPED = 'isImmediatePropagationStopped',
	CANCEL_BUBBLE = 'cancelBubble'

// ========================= event tool =================================
const addEventListener = W3C
		? function(el, type, fn) {
				el[ADD_EVENT_LISTENER](type, fn, type !== 'focus' && type !== 'blur')
		  }
		: function(el, type, fn) {
				el[ATTACH_EVENT]('on' + type, fn)
		  },
	removeEventListener = W3C
		? function(el, type, fn) {
				el.removeEventListener(type, fn)
		  }
		: function(el, type, fn) {
				el.detachEvent('on' + type, fn)
		  }

// ========================= bind event dispatcher =================================

const bubbleUpEvents = makeMap(
	'click,dblclick,keydown,keypress,keyup,mousedown,mousemove,mouseup,mouseover,' +
		'mouseout,wheel,mousewheel,input,beforeinput,compositionstart,compositionupdate,' +
		'compositionend,cut,copy,paste,beforecut,beforecopy,beforepaste,focusin,focusout,' +
		'DOMFocusIn,DOMFocusOut,DOMActivate,dragend,datasetchanged'
)

if (W3C) bubbleUpEvents.change = bubbleUpEvents.select = true

function listenEl(el) {
	return bubbleUpEvents[el.type] ? ROOTELEMENT : el
}

const DOM_DISPATCH_EVENTS = '__dispatch_events__'

function bindDispatcher(el, type) {
	el = listenEl(el)
	const events = el[DOM_DISPATCH_EVENTS] || (el[DOM_DISPATCH_EVENTS] = create(null)),
		num = events[type] || 0
	if (!num) addEventListener(el, type, dispatch)
	events[type] = num + 1
}

function unbindDispatcher(el, type) {
	el = listenEl(el)
	const events = el[DOM_DISPATCH_EVENTS],
		num = events && events[type]
	if (num) {
		if (num === 1) removeEventListener(el, type, dispatch)
		events[type] = num - 1
	}
}

// ========================= hook =================================
const keyEventReg = /^key/,
	CHARCODE = 'charCode',
	KEYCODE = 'keyCode',
	WHICH = 'which',
	keyEventProps = ['char', 'key', CHARCODE, KEYCODE],
	keyEventHook = {
		fix(event, original) {
			event[ORIGINAL_PROPS](keyEventProps)
			if (!event[WHICH]) event[WHICH] = original[CHARCODE] != null ? original[CHARCODE] : original[KEYCODE]
		},
	},
	mouseEventReg = /^(?:mouse|contextmenu|drag)|click/,
	BUTTON = 'button',
	mouseEventProps = [BUTTON, BUTTON + 's', CLIENTX, CLIENTY, 'offsetX', 'offsetY', PAGEX, PAGEY, 'screenX', 'screenY', 'toElement'],
	mouseEventHook = {
		fix(event, original) {
			const button = original[BUTTON]
			event[ORIGINAL_PROPS](mouseEventProps)
			if (!event[PAGEX] && original[CLIENTX]) {
				var eventDoc = event.target[OWNER_DOCUMENT] || document,
					doc = eventDoc[DOCUMENT_ELEMENT],
					body = eventDoc.body
				event[PAGEX] = original[CLIENTX] + ((doc && doc[SCROLL_LEFT]) || (body && body[SCROLL_LEFT]) || 0) - ((doc && doc[CLIENT_LEFT]) || (body && body[CLIENT_LEFT]) || 0)
				event[PAGEY] = original[CLIENTY] + ((doc && doc[SCROLL_TOP]) || (body && body[SCROLL_TOP]) || 0) - ((doc && doc[CLIENT_TOP]) || (body && body[CLIENT_TOP]) || 0)
			}
			if (!event[WHICH] && button !== undefined) event[WHICH] = button & 1 ? 1 : button & 2 ? 3 : button & 4 ? 2 : 0
		},
	}

let last = 0
const moveEventReg = /move|scroll/

function dispatch(event) {
	let type = event.type,
		target = eventTarget(event)

	type = hookRevice(type) || type
	if (moveEventReg.test(type)) {
		var now = new Date()
		if (now - last < 16) return
		last = now
	}
	let elem
	if (target[DISABLED] !== true || type !== 'click') {
		if (bubbleUpEvents[type]) {
			do {
				if ((elem = target[DOM_ELEMENT])) event = elem[MIXIN_EMIT_LISTEN](type, event)
				target = target[PARENT_NODE]
			} while (target && !event[CANCEL_BUBBLE])
		} else {
			elem = target[DOM_ELEMENT]
			if (elem) elem[MIXIN_EMIT_LISTEN](type, event)
		}
	}
}

function packEvent(type, originalEvent) {
	const event = new Event(originalEvent, type)
	let hook = getHook(type)
	if (!hook) {
		if (mouseEventReg.test(type)) {
			hook = mouseEventHook
		} else if (keyEventReg.test(type)) {
			hook = keyEventHook
		} else {
			hook = {}
		}
		hook = addHook(type, hook)
	}
	hook.fix && hook.fix(event, originalEvent)
	return event
}

// ========================= Event =================================
function eventTarget(event) {
	const target = event.target || event.srcElement || document
	return target.nodeType == 3 ? target[PARENT_NODE] : target
}

const eventProps = 'altKey,bubbles,cancelable,ctrlKey,eventPhase,metaKey,shiftKey,view'.split(',').concat(RELATED_TARGET, PROPERTY_NAME, WHICH, CURRENT_TARGET)

function Event(event, type) {
	this.type = type || event.type
	this[ORIGINAL_EVENT] = event
	this.target = eventTarget(event)
	this[RETURN_VALUE] = !(event.defaultPrevented || event[RETURN_VALUE] === false || (event[GET_PREVENT_DEFAULT] && event[GET_PREVENT_DEFAULT]()))
	this[TIME_STAMP] = event[TIME_STAMP] || new Date().getTime()
	this[ORIGINAL_PROPS](eventProps)
}

const EventProto = Event.prototype
EventProto.$hookEvent = true
EventProto[ORIGINAL_PROPS] = function(props) {
	const e = this[ORIGINAL_EVENT]
	for (var i = 0, l = props.length; i < l; i++) {
		this[props[i]] = e[props[i]]
	}
}

EventProto[PREVENT_DEFAULT] = function() {
	const e = this[ORIGINAL_EVENT]
	this[RETURN_VALUE] = false
	e[RETURN_VALUE] = false
	e[PREVENT_DEFAULT] && e[PREVENT_DEFAULT]()
}

EventProto[STOP_PROPAGATION] = function() {
	const e = this[ORIGINAL_EVENT]
	this[CANCEL_BUBBLE] = true
	e[CANCEL_BUBBLE] = true
	e[STOP_PROPAGATION] && e[STOP_PROPAGATION]()
}

EventProto[STOP_IMMEDIATE_PROPAGATION] = function() {
	const e = this[ORIGINAL_EVENT]
	this[IS_IMMEDIATE_PROPAGATION_STOPPED] = true
	e[STOP_IMMEDIATE_PROPAGATION] && e[STOP_IMMEDIATE_PROPAGATION]()
	this[STOP_PROPAGATION]()
}

// ========================= hooks =================================

const PROPERTY_NAME = 'propertyName',
	RELATED_TARGET = 'relatedTarget'

// firefox, chrome: mouseenter and mouseleave
if (ROOTELEMENT.onmouseenter === undefined) {
	function fix(event) {
		let el = event.target,
			t = event[RELATED_TARGET]
		return !t || (t !== el && !(el.compareDocumentPosition(t) & 16))
	}
	addHook({
		mouseover: {
			type: 'mouseenter',
			fix,
		},
		mouseout: {
			type: 'mouseleave',
			fix,
		},
	})
}

// IE9+, W3C: animationend
if (window.AnimationEvent) {
	addHook('animationend', 'AnimationEvent')
} else if (window.WebKitAnimationEvent) {
	addHook('animationend', 'WebKitAnimationEvent')
}

// IE6-11, chrome: mousewheel, wheelDetla
// IE9-11: wheel deltaY
// firefox: DOMMouseScroll detail, wheel detlaY
// chrome: wheel deltaY
if (document.onmousewheel === undefined) {
	const fixWheelType = document.onwheel ? 'wheel' : 'DOMMouseScroll',
		fixWheelDelta = fixWheelType === 'wheel' ? 'deltaY' : 'detail',
		WHEEL_DELTA = 'wheelDelta',
		WHEEL_DELTAY = WHEEL_DELTA + 'Y'
	addHook('mousewheel', {
		type: fixWheelType,
		fix(event) {
			event[WHEEL_DELTAY] = event[WHEEL_DELTA] = event[fixWheelDelta] > 0 ? -120 : 120
			event[WHEEL_DELTAY] = 0
		},
	})
}

const INPUT = 'input'

// IE6-9: input
// IE6-8: change
if (document[CREATE_ELEMENT](INPUT).oninput === undefined) {
	// IE6-IE8: input, change
	delete bubbleUpEvents[INPUT]
	addHook(INPUT, {
		type: 'propertychange',
		fix(event) {
			return event[PROPERTY_NAME] === 'value'
		},
	})
	let changeEventNum = 0
	const DOM_CHANGE_EVENT = '__change_event'
	addHook('change', {
		bind(el) {
			if (el.type == 'checkbox' || el.type == 'radio') {
				if (changeEventNum++ === 0) addEventListener(ROOTELEMENT, 'click', changeEventDispath)
				el[DOM_CHANGE_EVENT] = true
				return false
			}
		},
		unbind(el) {
			if (el.type == 'checkbox' || el.type == 'radio') {
				if (--changeEventNum === 0) removeEventListener(ROOTELEMENT, 'click', changeEventDispath)
				el[DOM_CHANGE_EVENT] = false
				return false
			}
		},
	})

	function changeEventDispath(event) {
		const target = eventTarget(event)
		if (target[DOM_CHANGE_EVENT]) dispatch(packEvent('change', event))
	}
} else if (IE9) {
	// IE9: input
	const OLD_VALUE = 'oldValue'
	addHook(INPUT, {
		fix(event) {
			const el = event.target
			el[OLD_VALUE] = el.value
		},
	})

	// http://stackoverflow.com/questions/6382389/oninput-in-ie9-doesnt-fire-when-we-hit-backspace-del-do-cut
	addEventListener('selectionchange', function(event) {
		var actEl = document.activeElement
		switch (actEl.tagName) {
			case 'INPUT':
				if (actEl.type !== 'text') return
			case 'TEXTAREA':
				if (actEl.value !== actEl[OLD_VALUE]) {
					actEl[OLD_VALUE] = actEl.value
					dispatch(packEvent(INPUT, event))
				}
		}
	})
}
