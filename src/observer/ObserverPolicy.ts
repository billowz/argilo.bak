export type ObserverTarget = any[] | {}

export type IWatcher = {
	notify(original: any): void
}

export interface ObserverPolicy {
	name: string
	proxy?: boolean
	proxyChangeable?: boolean
	sourceOwnProp?: boolean
	support(): boolean
	createProxy?: (target: ObserverTarget, watchers: { [prop: string]: IWatcher }) => ObserverTarget
	watch?: (target: ObserverTarget, prop: string, watcher: IWatcher) => boolean | void
}
