import { create } from '../utility'

export interface ProxyConstructor {
	new (source: {}): Proxy
	support(): boolean
}

export type ProxySetter = (source: {}, prop: string, value: any) => void
export type ProxyGetter = (source: {}, prop: string) => any

export class Proxy {
	protected readonly __accessors: { [prop: string]: [ProxyGetter, ProxySetter] }
	constructor() {
		this.__accessors = create(null)
	}
	accessor(prop: string, setter: ProxySetter, getter: ProxyGetter) {
		const { __accessors: accessors } = this
		const accessor = accessors[prop]
		if (accessor) {
			accessor[0] = getter
			accessor[1] = setter
		} else {
			this.__addAccessor(prop, (accessors[prop] = [getter, setter]))
		}
	}
	protected __addAccessor(prop: string, accessor: [ProxyGetter, ProxySetter]) {}
}
