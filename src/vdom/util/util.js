import { isStr, isArrayLike } from '../../helper'

export const ADD_EVENT_LISTENER = 'addEventListener',
	ATTACH_EVENT = 'attachEvent',
	DOCUMENT_ELEMENT = 'documentElement',
	DEFAULT_VIEW = 'defaultView',
	PARENT_WINDOW = 'parentWindow',
	APPEND_CHILD = 'appendChild',
	REMOVE_CHILD = 'removeChild',
	INSERT_BEFORE = 'insertBefore',
	REPLACE_CHILD = 'replaceChild',
	PARENT_NODE = 'parentNode',
	CONTAINS = 'contains',
	INNER_HTML = 'innerHTML',
	CREATE_ELEMENT = 'createElement',
	OWNER_DOCUMENT = 'ownerDocument',
	SET_ATTRIBUTE = 'setAttribute',
	GET_ATTRIBUTE = 'getAttribute',
	REMOVE_ATTRIBUTE = 'removeAttribute',
	CHECKED = 'checked',
	SELECTED = 'selected',
	DISABLED = 'disabled',
	READ_ONLY = 'readOnly',
	TAB_INDEX = 'tabIndex',
	HTML_FOR = 'htmlFor',
	CLASS_NAME = 'className',
	CURRENT_TARGET = 'currentTarget',
	PREVENT_DEFAULT = 'preventDefault',
	STOP_PROPAGATION = 'stopPropagation',
	STOP_IMMEDIATE_PROPAGATION = 'stopImmediatePropagation',
	CLIENT_TOP = 'clientTop',
	CLIENT_LEFT = 'clientLeft',
	SCROLL_LEFT = 'scrollLeft',
	SCROLL_TOP = 'scrollTop',
	PAGE_XOFFSET = 'pageXOffset',
	PAGE_YOFFSET = 'pageYOffset',
	CLIENTX = 'clientX',
	CLIENTY = 'clientY',
	PAGEX = 'pageX',
	PAGEY = 'pageY'

export const ROOTELEMENT = document[DOCUMENT_ELEMENT]
export const DIV = document[CREATE_ELEMENT]('div')

export function getWindow(el) {
	return el.window && el.document ? el : el.nodeType === 9 ? el[DEFAULT_VIEW] || el[PARENT_WINDOW] : undefined
}

export function inDoc(el, root) {
	if (!root) root = ROOTELEMENT
	if (root[CONTAINS]) return root[CONTAINS](el)
	while ((el = el[PARENT_NODE])) if (el === root) return true
	return false
}

export function query(selectors) {
	return isStr(selectors) ? document.querySelector(selectors) : isArrayLike(selectors) ? selectors[0] : selectors
}

export function prependChild(parent, el) {
	let first = parent.firstChild
	first ? first !== el && parent[INSERT_BEFORE](el, first) : parent[APPEND_CHILD](el)
}

export function insertAfter(el, prev) {
	var next = prev.nextSibling
	next ? next !== el && prev[PARENT_NODE][INSERT_BEFORE](el, next) : prev[PARENT_NODE][APPEND_CHILD](el)
}

export function insertBefore(el, next) {
	el !== next.previousSibling && next[PARENT_NODE][INSERT_BEFORE](el, next)
}
