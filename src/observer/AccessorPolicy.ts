import { ObserverPolicy, IObserver, IWatcher } from './IObserver'
import { propAccessor, defProp } from '../utility'

export default function(): ObserverPolicy {
	if (propAccessor)
		return {
			__name: 'Accessor',
			__watch(observer: IObserver, prop: string, watcher: IWatcher): boolean | void {
				let value: any = observer.target[prop]
				try {
					defProp(observer.target, prop, {
						get() {
							return value
						},
						set(newValue: any) {
							watcher.notify(value)
							value = newValue
						}
					})
				} catch (e) {
					console.warn(e.message, e)
				}
			}
		}
}
