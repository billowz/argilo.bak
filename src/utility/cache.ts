import { create } from './create'

export function cache<T extends Function>(key: any | ((args: IArguments) => string), builder: T, ca): T {
	const cache = create(null)
	return function() {} as any
}
