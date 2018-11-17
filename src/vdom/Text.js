import { VText, VBindingText, registerVText, registerVBindingText } from '../vnode'
import HTMLMixin from './HTMLMixin'
import { inherit } from '../helper'

const TextMixin = {
	update(text) {
		this.el.data = text
	}
}

export const HTMLText = registerVText(
	inherit(
		function Text(comp, text) {
			VText.call(this, comp, text)
			this.el = textNode(text)
		},
		VText,
		HTMLMixin(VText),
		TextMixin
	)
)

export const HTMLBindingText = registerVBindingText(
	inherit(
		function BindingText(comp, expr) {
			VBindingText.call(this, comp, expr)
			this.el = textNode('')
		},
		VBindingText,
		HTMLMixin(VBindingText),
		TextMixin
	)
)

function textNode(text) {
	return document.createTextNode(text)
}
