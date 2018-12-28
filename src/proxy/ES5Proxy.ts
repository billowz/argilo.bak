import { Proxy, ProxyGetter, ProxySetter } from './Proxy'
import { propAccessor, defProp } from '../utility'

export class ES5Proxy extends Proxy {
	static init() {
		return propAccessor
	}
	private readonly source: {}
	private readonly values: {}
	constructor(source: {}) {
		super()
	}
	protected __addAccessor(prop: string, accessor: [ProxyGetter, ProxySetter]) {
		const { source, __accessors: accessors, values } = this
		values[prop] = source[prop]
		defProp(source, prop, {
			get() {
				const accessor = accessors[prop]
				return accessor && accessor[0] ? accessor[0](values, prop) : values[prop]
			},
			set(value) {
				const accessor = accessors[prop]
				return accessor && accessor[1] ? accessor[1](values, prop, value) : (values[prop] = value)
			}
		})
	}
}
