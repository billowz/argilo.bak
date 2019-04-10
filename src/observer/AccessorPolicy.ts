/**
 * Observe implementation on the Object.defineProperty of ES5 or `__defineGetter__` and `__defineSetter__`
 * @module observer
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Mar 19 2019 14:12:23 GMT+0800 (China Standard Time)
 * @modified Wed Apr 10 2019 13:07:06 GMT+0800 (China Standard Time)
 */

import { IObserver, IWatcher, ARRAY_CHANGE, ObserverTarget, ARRAY_LENGTH } from './IObserver'
import { ObservePolicy } from './ObservePolicy'
import { propAccessor, defAccessor } from '../util'
import { applyArrayHooks } from './arrayHook'

/**
 * @ignore
 */
export default function(): ObservePolicy {
	if (propAccessor)
		return {
			__name: 'Accessor',
			__createProxy<T extends ObserverTarget>(observer: IObserver<T>, target: T, isArray: boolean): T {
				isArray && applyArrayHooks(target as any[])
				return target
			},
			__watch<T extends ObserverTarget>(observer: IObserver<T>, prop: string, watcher: IWatcher): Error {
				const { target } = observer
				let setter: (newValue: any) => void
				if (!observer.isArray) {
					setter = (newValue: any) => {
						if (value !== newValue) {
							watcher.notify(value)
						}
						value = newValue
					}
				} else if (prop !== ARRAY_CHANGE && prop !== ARRAY_LENGTH) {
					setter = (newValue: any) => {
						if (value !== newValue) {
							watcher.notify(value)
							observer.notify(ARRAY_CHANGE, target)
						}
						value = newValue
					}
				} else {
					return
				}
				var value: any = target[prop]
				try {
					defAccessor(target, prop, () => value, setter, true, false)
				} catch (e) {
					return e
				}
			}
		}
}
