import { Proxy as IProxy, ProxyConstructor } from './Proxy'
import { GLOBAL } from '../utility/consts'

export class ES6Proxy extends IProxy {
	static init() {
		return GLOBAL.Proxy
	}
	private readonly __proxy: {}
	constructor(source: {}) {
		super()
		const { __accessors: accessors } = this
		this.__proxy = new Proxy(source, {
			get(source: {}, prop: string) {
				const accessor = accessors[prop]
				return accessor && accessor[0] ? accessor[0](source, prop) : source[prop]
			},
			set(source: {}, prop: string, value: any) {
				const accessor = accessors[prop]
				accessor && accessor[1] ? accessor[1](source, prop, value) : (source[prop] = value)
				return true
			}
		})
	}
}
