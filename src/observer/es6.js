// @flow
/**
 *
 * @module observer
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Mon Dec 11 2017 14:35:32 GMT+0800 (China Standard Time)
 * @modified Fri Nov 16 2018 19:16:32 GMT+0800 (China Standard Time)
 */
import { global, isFn } from '../helper'

export default function(defaultProps) {
	if (isFn(global.Proxy)) {
		return {
			name: 'Proxy',
			proxyEnabled: true,
			impl: {
				__init() {
					let isArray = this.isArray
					this.proxy = new Proxy(this.source, {
						get: (source, attr, proxy) => {
							return source[attr]
						},
						set: (source, attr, value, proxy) => {
							if (defaultProps[attr]) {
								source[attr] = value
							} else {
								var oldValue = source[attr]
								source[attr] = value
								this.__write(attr, value, oldValue)
							}
							return true
						}
					})
				}
			}
		}
		return true
	}
}
