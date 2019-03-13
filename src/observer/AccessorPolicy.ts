import { ObserverPolicy, ObserverTarget, IWatcher } from './IObserver'
import { propAccessor, defProp } from '../utility'

export default function(): ObserverPolicy {
	if (propAccessor)
		return {
			__name: 'Accessor',
			__watch(target: ObserverTarget, prop: string, watcher: IWatcher): boolean | void {
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
}
