/**
 * @module utility/AST
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Dec 11 2018 15:36:42 GMT+0800 (China Standard Time)
 * @modified Sat Dec 15 2018 17:31:42 GMT+0800 (China Standard Time)
 */

import { char, charCode } from '../string'
import { assert } from '../assert'
/**
 * Match Context of Rule
 */
export class MatchContext {
	// matched data list
	data: any[]

	// start offset of original buff
	readonly orgBuff: string

	// start offset of original buff
	private orgPos: number

	// template buff
	private buff: string

	// current offset of template buff
	private offset: number

	// advanced characters
	private advanced: number

	// cached character
	private codeCache: number

	// parent context
	private readonly parent: MatchContext

	constructor(buff: string, offset: number, orgBuff: string, orgPos: number, parent?: MatchContext, code?: number) {
		this.data = []
		this.advanced = 0
		this.buff = buff
		this.offset = offset
		this.orgBuff = orgBuff
		this.orgPos = orgPos
		this.parent = parent
		code ? (this.codeCache = code) : this.flushCache()
	}

	private flushCache() {
		const { buff, offset } = this
		this.codeCache = offset < buff.length ? charCode(buff, offset) : 0
	}

	/**
	 * create sub Context
	 */
	create() {
		return new MatchContext(this.buff, this.offset, this.orgBuff, this.orgPos + this.advanced, this, this.codeCache)
	}

	commit(margeData?: boolean) {
		const { parent, advanced } = this
		if (parent) {
			parent.advance(advanced)
			this.orgPos += advanced
			this.advanced = 0
			margeData ? parent.addAll(this.data) : parent.add(this.data)
		}
	}

	reset(len?: number, dataLen?: number) {
		assert.range(len, 0, this.advanced + 1)
		this.advance(-(this.advanced - len))
		dataLen >= 0 && this.resetData(dataLen)
	}

	advance(i: number) {
		this.offset += i
		this.advanced += i
		if (this.offset < 0) {
			this.buff = this.orgBuff
			this.offset = this.orgPos + this.advanced
		}
		this.flushCache()
	}

	getBuff(reset?: boolean): string {
		if (reset) {
			const { offset } = this
			this.buff = this.buff.substring(offset)
			this.offset = 0
		}
		return this.buff
	}
	getOffset(): number {
		return this.offset
	}

	startPos(): number {
		return this.orgPos
	}

	currPos(): number {
		return this.orgPos + this.advanced
	}

	position(): [number, number] {
		const { orgPos } = this
		return [orgPos, orgPos + this.advanced]
	}
	len(): number {
		return this.advanced
	}
	/**
	 * get next char code
	 * @return number char code number
	 */
	nextCode() {
		return this.codeCache
	}

	nextChar() {
		return char(this.codeCache)
	}

	eof(): boolean {
		return this.codeCache === 0
	}

	//──── data opeartions ───────────────────────────────────────────────────────────────────
	/**
	 * append data
	 */
	add(data: any) {
		this.data.push(data)
	}
	/**
	 * append datas
	 */
	addAll(datas: any[]) {
		const { data } = this
		const len = data.length
		let i = datas.length
		while (i--) data[len + i] = datas[i]
	}
	/**
	 * reset result data size
	 */
	resetData(len?: number) {
		const { data } = this
		len = len || 0
		if (data.length > len) data.length = len
	}
	dataLen() {
		return this.data.length
	}
}
