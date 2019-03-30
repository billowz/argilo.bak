/**
 * Observe implementation on the Object.defineProperty of ES5 or `__defineGetter__` and `__defineSetter__`
 * @module observer
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Mar 19 2019 14:12:23 GMT+0800 (China Standard Time)
 * @modified Thu Mar 28 2019 15:33:29 GMT+0800 (China Standard Time)
 */

import { IObserver, IWatcher, ARRAY_CHANGE, ObserverTarget } from './IObserver'
import { ObservePolicy } from './ObservePolicy'
import { propAccessor, defProp } from '../utility'

/**
 * @ignore
 */
export default function(): ObservePolicy {
	if (propAccessor)
		return {
			__name: 'Accessor',
			__watch<T extends ObserverTarget>(observer: IObserver<T>, prop: string, watcher: IWatcher): Error {
				const { target } = observer
				let setter: (newValue: any) => void
				if (!observer.isArray) {
					setter = (newValue: any) => {
						watcher.notify(value)
						value = newValue
					}
				} else if (prop !== ARRAY_CHANGE && prop !== 'length') {
					const changeWatcher: IWatcher = observer.initWatcher(ARRAY_CHANGE)
					setter = (newValue: any) => {
						watcher.notify(value)
						value = newValue
						changeWatcher.notify(target)
					}
				} else {
					return
				}
				var value: any = target[prop]
				try {
					defProp(target, prop, {
						get() {
							return value
						},
						set: setter
					})
				} catch (e) {
					return e
				}
			}
		}
}
