/**
 * @module util
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Dec 18 2018 16:41:03 GMT+0800 (China Standard Time)
 * @modified Mon Apr 08 2019 12:14:27 GMT+0800 (China Standard Time)
 */
// TODO Cache API
import { create } from './create'

export function cache<T extends Function>(key: any | ((args: IArguments) => string), builder: T, ca): T {
	const cache = create(null)
	return function() {} as any
}
