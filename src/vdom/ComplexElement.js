import { VComplexElement } from '../vnode'
import HTMLMixin from './HTMLMixin'
import ElementMixin from './ElementMixin'
import ElementAttrMixin from './ElementAttrMixin'
import ElementClassMixin from './ElementClassMixin'
import ElementStyleMixin from './ElementStyleMixin'
import ElementValueMixin from './ElementValueMixin'
import ElementEventMixin from './ElementEventMixin'
import { DIV, PARENT_NODE, APPEND_CHILD, REPLACE_CHILD, INNER_HTML } from './util/util'
import { inherit, isStr } from '../helper'
import { PROTOTYPE } from '../helper/constants'

const { append, appendAll, prepend, insertBefore, insertAfter, replace } = VComplexElement[PROTOTYPE]

const __TEXT_CONTENT = 'textContent'
const TEXT_CONTENT = isStr(DIV[__TEXT_CONTENT]) ? __TEXT_CONTENT : 'innerText'

export default inherit(
	function ComplexElement(comp, option) {
		VComplexElement.call(this, comp, option)
	},
	VComplexElement,
	HTMLMixin(VComplexElement),
	ElementMixin,
	ElementAttrMixin,
	ElementClassMixin,
	ElementStyleMixin,
	ElementValueMixin,
	ElementEventMixin,
	{
		$htmlComplexElement: true,
		$childKey: '$htmlNode',
		$childName: 'HTML Virtual Node',
		initChild(child) {
			this.el[APPEND_CHILD](child.el)
		},
		html(html) {
			const el = this.el
			if (arguments.length) {
				el[INNER_HTML] = html
				return this
			}
			return el[INNER_HTML]
		},
		text(text) {
			const el = this.el
			if (arguments.length) {
				el[TEXT_CONTENT] = text
				return this
			}
			return el[TEXT_CONTENT]
		},
		append(node) {
			append.call(this, node)
			this.el[APPEND_CHILD](node.el)
			return this
		},
		prepend(node) {
			prepend.call(this, node)
			prependChild(this.el, node.el)
			return this
		},
		insertBefore(node, target) {
			insertBefore.call(this, node, target)
			doInsertBefore(node.el, target.el)
			return this
		},
		insertAfter(node, target) {
			insertAfter.call(this, node, target)
			doInsertAfter(node.el, target.el)
			return this
		},
		replace(node, target) {
			replace.call(this, node, target)
			target.el[PARENT_NODE][REPLACE_CHILD](node.el, target.el)
			return this
		},
	}
)
