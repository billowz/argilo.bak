/**
 * Observe implementation on the Object.defineProperty of ES5 or `__defineGetter__` and `__defineSetter__`
 * @module observer
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Mar 19 2019 14:12:23 GMT+0800 (China Standard Time)
 * @modified Thu Apr 04 2019 20:04:01 GMT+0800 (China Standard Time)
 */

import { IObserver, IWatcher, ARRAY_CHANGE, ObserverTarget, ARRAY_LENGTH } from './IObserver'
import { ObservePolicy } from './ObservePolicy'
import { propAccessor, defProp } from '../utility'
import { applyArrayHooks } from './arrayHook'

/**
 * @ignore
 */
export default function(): ObservePolicy {
	if (propAccessor)
		return {
			__name: 'Accessor',
			__createProxy<T extends ObserverTarget>(observer: IObserver<T>, target: T, isArray: boolean): T {
				if (isArray) applyArrayHooks(target as any[])
				return target
			},
			__watch<T extends ObserverTarget>(observer: IObserver<T>, prop: string, watcher: IWatcher): Error {
				const { target } = observer
				let setter: (newValue: any) => void
				if (!observer.isArray) {
					setter = (newValue: any) => {
						watcher.notify(value)
						value = newValue
					}
				} else if (prop !== ARRAY_CHANGE && prop !== ARRAY_LENGTH) {
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
