import { ObserverTarget, IObserver, IWatcher } from './IObserver'

/**
 * @ignore
 */
export type ObservePolicy = {
	/**
	 * policy name
	 */
	__name: string

	/**
	 * is proxy policy
	 */
	__proxy?: 'vb' | 'proxy'

	/**
	 * create Proxy
	 * @param observer	observer
	 * @param target 	target object
	 * @param isArray 	is array target
	 */
	__createProxy?: <T extends ObserverTarget>(observer: IObserver<T>, target: T, isArray: boolean) => T

	/**
	 * watch property
	 * @param observer	observer
	 * @param prop		the property
	 * @param watcher	the watcher of the property
	 */
	__watch?: <T extends ObserverTarget>(observer: IObserver<T>, prop: string, watcher: IWatcher) => Error | void
}
