import { ObserverPolicy, ObserverTarget, IWatcher } from './ObserverPolicy'
import { GLOBAL } from '../utility/consts'

const policy: ObserverPolicy = {
	name: 'Proxy',
	proxy: true,
	support(): boolean {
		return !!GLOBAL.Proxy
	},
	createProxy(target: ObserverTarget, watchers: { [prop: string]: IWatcher }): ObserverTarget {
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
export default policy
