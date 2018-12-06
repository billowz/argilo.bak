/**
 * @module utility/collection
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 17:10:41 GMT+0800 (China Standard Time)
 * @modified Tue Nov 27 2018 14:17:32 GMT+0800 (China Standard Time)
 */
export class Control {
	private desc: string
	constructor(desc: string) {
		this.desc = desc
	}
	toString() {
		return this.desc
	}
}
