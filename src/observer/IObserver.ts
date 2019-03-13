import { addDefaultKey } from '../utility'

export type ObserverTarget = any[] | {}

/**
 * Observer Key
 */
export const OBSERVER_KEY = addDefaultKey('__observer__')

export type IWatcher = {
	notify(original: any): void
}

export interface IObserver {
	notify(prop: string, original: any): void
	notifyAll(): void
	watcher(prop: string): IWatcher
}

export interface ObserverPolicy {
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
	__watch?: (target: ObserverTarget, prop: string, watcher: IWatcher) => boolean | void
}
