import { ObserverPolicy, ObserverTarget, IWatcher } from './ObserverPolicy'
import { propAccessor, defProp } from '../utility/prop/main'

const policy: ObserverPolicy = {
	name: 'Accessor',
	support(): boolean {
		return propAccessor
	},
	watch(target: ObserverTarget, prop: string, watcher: IWatcher): boolean | void {
		let value: any = target[prop]
		defProp(target, prop, {
			get() {
				return value
			},
			set(newValue: any) {
				watcher.notify(value)
				value = newValue
			}
		})
	}
}
export default policy
