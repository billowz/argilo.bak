import { addDefaultKey } from '../utility'

export type ObserverTarget = any[] | {}

/**
 * Observer Key
 */
export const OBSERVER_KEY = addDefaultKey('__observer__')

/**
 * the property of observe an array change
 */
export const ARRAY_CHANGE = '$change'

export type IWatcher = {
	notify(original: any): void
}

export interface IObserver {
	readonly target: ObserverTarget
	readonly isArray: boolean
	notify(prop: string, original: any): void
	notifyAll(): void
	watcher(prop: string): IWatcher
}

export type ObserverPolicy = {
	__name: string
	__proxy?: boolean
	/**
	 * create Proxy
	 */
	__createProxy?: (target: ObserverTarget, isArray: boolean, watchers: { [prop: string]: IWatcher }) => ObserverTarget
	/**
	 * watch property
	 * @protected
	 * @param prop	property
	 * @return false: watch failed
	 */
	__watch?: (observer: IObserver, prop: string, watcher: IWatcher) => boolean | void
}
