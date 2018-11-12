/*
 * @author tao.zeng (tao.zeng.zt@gmail.com)
 * @created 2018-08-29 12:32:14
 * @Last Modified by:   tao.zeng (tao.zeng.zt@gmail.com)
 * @Last Modified time: 2018-08-29 12:32:14
 */
import { create, defProp, defPropSupport } from '../helper'
import { PROTOTYPE } from '../helper/constants'

export default function() {
	let defineProperty,
		name = 'Define Property'
	if (defPropSupport) {
		defineProperty = function(observer, attr) {
			const source = observer.source
			let value = source[attr]
			defProp(source, attr, {
				enumerable: true,
				configurable: true,
				get() {
					return value
				},
				set(newValue) {
					let oldValue = value
					value = newValue
					observer.__write(attr, newValue, oldValue)
				},
			})
		}
	} else if ('__defineGetter__' in {}) {
		name = 'Define getter and setter'
		const { __defineGetter__, __defineSetter__ } = Object[PROTOTYPE]
		defineProperty = function(observer, attr) {
			const source = observer.source
			let value = source[attr]
			__defineGetter__.call(source, attr, function() {
				return value
			})
			__defineSetter__.call(source, attr, function(newValue) {
				let oldValue = value
				value = newValue
				observer.__write(attr, newValue, oldValue)
			})
		}
	}
	if (defineProperty) {
		return {
			name,
			impl: {
				__init() {
					this.defined = create(null)
				},
				__watch(attr) {
					const defined = this.defined
					if (defined[attr]) {
						defineProperty(this, attr)
						defined[attr] = true
					}
				},
			},
		}
	}
}
