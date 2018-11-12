/*
 * @author tao.zeng (tao.zeng.zt@gmail.com)
 * @created 2018-08-29 12:32:09
 * @Last Modified by:   tao.zeng (tao.zeng.zt@gmail.com)
 * @Last Modified time: 2018-08-29 12:32:09
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
						},
					})
				},
			},
		}
		return true
	}
}
