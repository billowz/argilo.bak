/**
 * @module utility
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Dec 18 2018 16:41:03 GMT+0800 (China Standard Time)
 * @modified Tue Feb 19 2019 11:54:00 GMT+0800 (China Standard Time)
 */
import { create } from './create'

export function cache<T extends Function>(key: any | ((args: IArguments) => string), builder: T, ca): T {
	const cache = create(null)
	return function() {} as any
}
