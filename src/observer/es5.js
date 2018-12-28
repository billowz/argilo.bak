import { defPropSupport, defProp, create } from "../utility";
import { PROTOTYPE } from "../utility/consts";

// @flow
/**
 *
 * @module observer
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Mon Dec 11 2017 14:35:32 GMT+0800 (China Standard Time)
 * @modified Thu Dec 27 2018 14:39:37 GMT+0800 (China Standard Time)
 */

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
				}
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
				}
			}
		}
	}
}
