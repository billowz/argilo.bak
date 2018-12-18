/**
 * @module utility/AST
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Dec 11 2018 15:36:42 GMT+0800 (China Standard Time)
 * @modified Tue Dec 18 2018 19:00:01 GMT+0800 (China Standard Time)
 */
import { Source } from '../Source'
import { char, charCode } from '../string'
import { assert } from '../assert'
/**
 * Match Context of Rule
 */
export class MatchContext {
	// matched data list
	data: any[]

	// start offset of original buff
	readonly source: Source

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
	readonly parent: MatchContext

	constructor(source: Source, buff: string, offset: number, orgPos: number, parent?: MatchContext, code?: number) {
		this.source = source
		this.buff = buff
		this.offset = offset
		this.orgPos = orgPos
		this.parent = parent
		this.data = []
		this.advanced = 0
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
		return new MatchContext(this.source, this.buff, this.offset, this.orgPos + this.advanced, this, this.codeCache)
	}

	/**
	 * commit context states to parent context
	 * @param margeData is marge data to parent
	 */
	commit() {
		const { advanced } = this
		this.parent.advance(advanced)
		this.orgPos += advanced
		this.advanced = 0
	}

	/**
	 *
	 * @param len 		reset buff length
	 * @param dataLen 	reset data length
	 */
	reset(len?: number, dataLen?: number) {
		len || (len = 0)
		assert.range(len, 0, this.advanced + 1)
		this.advance(-(this.advanced - len))
		this.resetData(dataLen || 0)
	}

	len(): number {
		return this.advanced
	}

	/**
	 * advance buffer position
	 */
	advance(i: number) {
		this.offset += i
		this.advanced += i
		if (this.offset < 0) {
			this.buff = this.source.buff
			this.offset = this.orgPos + this.advanced
		}
		this.flushCache()
	}

	/**
	 * get buffer
	 * @param reset reset buffer string from 0
	 */
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

	pos(): [number, number] {
		const { orgPos } = this
		return [orgPos, orgPos + this.advanced]
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
