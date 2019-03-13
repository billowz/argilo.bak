import { ObserverPolicy, ObserverTarget, IWatcher } from './IObserver'
import { GLOBAL } from '../utility/consts'

export default function(): ObserverPolicy {
	if (GLOBAL.Proxy)
		return {
			__name: 'Proxy',
			__proxy: true,
			__createProxy(
				target: ObserverTarget,
				isArray: boolean,
				watchers: { [prop: string]: IWatcher }
			): ObserverTarget {
				return new Proxy(target, {
					set: (source, prop: string, value) => {
						const watcher = watchers[prop]
						watcher && watcher.notify(source[prop])
						source[prop] = value
						return true
					}
				})
			}
		}
}
