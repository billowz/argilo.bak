/**
 * @module util/collection
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 17:10:41 GMT+0800 (China Standard Time)
 * @modified Sat Dec 29 2018 19:37:44 GMT+0800 (China Standard Time)
 */
export class Control {
	private __desc: string

	constructor(desc: string) {
		this.__desc = desc
	}

	toString() {
		return this.__desc
	}
}
