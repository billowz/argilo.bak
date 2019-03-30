import { addDefaultKey } from '../utility'

/**
 * Observer Key
 */
export const OBSERVER_KEY = addDefaultKey('__observer__')

/**
 * the property of observe an array change
 */
export const ARRAY_CHANGE = '$change'

/**
 * The dirty collector lost the original value
 */
export const MISS = {}

export type ObserverTarget = any[] | {}

/**
 * change callback for observer
 * @param path 		the observe path
 * @param value 	new value
 * @param original	original value. the original value is {@link MISS} when the dirty collector loses the original value
 */
export type ObserverCallback<T extends ObserverTarget> = (
	path: string[],
	value: any,
	original: any,
	observer: IObserver<T>
) => void

export type IWatcher = {
	/**
	 * notify topics
	 * @param original the original value
	 */
	notify(original: any): void
}

export interface IObserver<T extends ObserverTarget> {
	/**
	 * target of the observer
	 */
	readonly target: T

	/**
	 * observer proxy
	 */
	readonly proxy: T

	/**
	 * is array object
	 */
	readonly isArray: boolean

	/**
	 * observe changes in the observer's target
	 * @param propPath 	property path for observe, parse string path by {@link parsePath}
	 * @param cb		callback
	 * @param scope		scope of callback
	 * @return listen-id
	 */
	observe(propPath: string | string[], cb: ObserverCallback<T>, scope?: any): string

	/**
	 * cancel observing the changes in the observer's target
	 * @param propPath	property path for unobserve, parse string path by {@link parsePath}
	 * @param cb		callback
	 * @param scope		scope of callback
	 */
	unobserve(propPath: string | string[], cb: ObserverCallback<T>, scope?: any): void

	/**
	 * cancel observing the changes in the observer's target by listen-id
	 * @param propPath	property path for unobserve, parse string path by {@link parsePath}
	 * @param id 		listen-id
	 */
	unobserveId(propPath: string | string[], id: string): void

	/**
	 * set value
	 * @param propPath 	property path for set, parse string path by {@link parsePath}
	 * @param value		the value
	 */
	set(propPath: string | string[], value: any): void

	/**
	 * get value
	 * @param propPath 	property path for get, parse string path by {@link parsePath}
	 * @return the value
	 */
	get(propPath: string | string[]): any

	/**
	 * notify change on the property
	 * @param prop		the property
	 * @param original 	the original value
	 */
	notify(prop: string, original: any): void

	/**
	 * notify the observer that all properties in the target have changed
	 * the original value well be {@link MISS}
	 */
	notifyAll(): void

	/**
	 * get wather by property
	 * @param prop the property
	 */
	watcher(prop: string): IWatcher

	/**
	 * get or create wather by property
	 * @param prop the property
	 */
	initWatcher(prop: string): IWatcher
}
