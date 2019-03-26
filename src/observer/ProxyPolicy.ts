/**
 * Observe implementation on the Proxy of ES6
 * @module observer
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Mar 19 2019 14:12:23 GMT+0800 (China Standard Time)
 * @modified Tue Mar 26 2019 19:52:20 GMT+0800 (China Standard Time)
 */

import { IObserver, ObservePolicy, ObserverTarget, IWatcher, ARRAY_CHANGE } from './IObserver'
import { GLOBAL } from '../utility/consts'

/**
 * @ignore
 */
export default function(): ObservePolicy {
	if (GLOBAL.Proxy)
		return {
			__name: 'Proxy',
			__proxy: 'proxy',
			__createProxy<T extends ObserverTarget>(observer: IObserver<T>, target: T, isArray: boolean): T {
				let setter: (source: ObserverTarget, prop: string, value: any) => boolean
				if (isArray) {
					const changeWatcher: IWatcher = observer.initWatcher(ARRAY_CHANGE)
					setter = (source, prop, value) => {
						const watcher: IWatcher = observer.watcher(prop)
						watcher && watcher.notify(source[prop])
						source[prop] = value
						changeWatcher.notify(observer.proxy)
						return true
					}
				} else {
					setter = (source, prop, value) => {
						const watcher: IWatcher = observer.watcher(prop)
						watcher && watcher.notify(source[prop])
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
