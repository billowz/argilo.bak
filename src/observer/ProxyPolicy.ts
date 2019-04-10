/**
 * Observe implementation on the Proxy of ES6
 * @module observer
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Mar 19 2019 14:12:23 GMT+0800 (China Standard Time)
 * @modified Wed Apr 10 2019 12:56:14 GMT+0800 (China Standard Time)
 */

import { IObserver, ObserverTarget, ARRAY_CHANGE, ARRAY_LENGTH } from './IObserver'
import { ObservePolicy } from './ObservePolicy'
import { T_UNDEF } from '../util/consts'

/**
 * @ignore
 */
export default function(): ObservePolicy {
	if (typeof Proxy !== T_UNDEF)
		return {
			__name: 'Proxy',
			__proxy: 'proxy',
			__createProxy<T extends ObserverTarget>(observer: IObserver<T>, target: T, isArray: boolean): T {
				let setter: (source: ObserverTarget, prop: string, value: any) => boolean
				if (isArray) {
					var len = target[ARRAY_LENGTH]
					setter = (source, prop, value) => {
						if (prop === ARRAY_LENGTH) {
							if (len !== value) {
								observer.notify(ARRAY_LENGTH, len)
								observer.notify(ARRAY_CHANGE, observer.proxy)
								len = value
							}
						} else {
							var orginal = source[prop],
								changed = 0
							if (orginal !== value) {
								observer.notify(prop, orginal)
								changed = 1
							}
							if (prop >= len) {
								observer.notify(ARRAY_LENGTH, len)
								len = target[ARRAY_LENGTH]
								changed = 1
							}
							changed && observer.notify(ARRAY_CHANGE, observer.proxy)
						}
						source[prop] = value
						return true
					}
				} else {
					setter = (source, prop, value) => {
						var orginal = source[prop]
						if (orginal !== value) {
							observer.notify(prop, orginal)
						}
						source[prop] = value
						return true
					}
				}
				return new Proxy(target, {
					set: setter
				}) as T
			}
		}
}
