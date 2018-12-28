/**
 * @module utility/AST
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Dec 11 2018 15:36:42 GMT+0800 (China Standard Time)
 * @modified Sat Dec 22 2018 16:32:31 GMT+0800 (China Standard Time)
 */
import { Source } from '../Source'
import { char, charCode, cutStr } from '../string'
import { assert } from '../assert'

export type CheckPoint = [number, number]
/**
 * Match Context of Rule
 */
export class MatchContext {
	// start offset of original buff
	readonly source: Source

	// parent context
	readonly parent: MatchContext

	// matched result list
	result: any[]

	data: any

	// template buff
	private __buff: string

	// current offset of template buff
	private __offset: number

	// current offset of original buff
	private __orgOffset: number

	// advanced characters
	private __advanced: number

	// cached character
	private __code: number

	constructor(source: Source, buff: string, offset: number, orgOffset: number, parent?: MatchContext) {
		this.source = source
		this.parent = parent
		this.result = []
		this.__buff = buff
		this.__offset = offset
		this.__orgOffset = orgOffset
		this.__advanced = 0
		parent ? ((this.__code = parent.__code), (this.data = parent.data)) : this.__flushCode()
	}

	private __flushCode() {
		const { __buff: buff, __offset: offset } = this
		this.__code = offset < buff.length ? charCode(buff, offset) : 0
	}

	/**
	 * create sub Context
	 */
	create() {
		return new MatchContext(this.source, this.__buff, this.__offset, this.__orgOffset + this.__advanced, this)
	}

	private __setAdvanced(advanced: number) {
		assert.notLess(advanced, 0)

		const offset = this.__offset - this.__advanced + advanced
		if (offset < 0) {
			this.__buff = this.source.buff
			this.__offset = this.__orgOffset + advanced
		}
		this.__advanced = advanced
		this.__offset = offset
		this.__flushCode()
	}

	/**
	 * commit context state to parent context
	 */
	commit() {
		const { __advanced: advanced } = this
		this.parent.advance(advanced)
		this.__orgOffset += advanced
		this.__advanced = 0
		this.data = null
	}

	/**
	 * marge context state
	 */
	margeState(context: MatchContext) {
		this.__setAdvanced(context.__orgOffset + context.__advanced - this.__orgOffset)
	}

	/**
	 * rollback state and result
	 * @param checkpoint 	rollback to checkpoint
	 */
	rollback(checkpoint?: CheckPoint) {
		let advanced = 0,
			resultLen = 0

		checkpoint && ((advanced = checkpoint[0]), (resultLen = checkpoint[1]))

		this.__setAdvanced(advanced)

		const { result } = this
		if (result.length > resultLen) result.length = resultLen
	}

	/**
	 * get a check point
	 */
	checkpoint(): CheckPoint {
		return [this.__advanced, this.result.length]
	}

	/**
	 * advance buffer position
	 */
	advance(i: number) {
		this.__offset += i
		this.__advanced += i
		this.__flushCode()
	}

	/**
	 * advanced buff length
	 */
	advanced(): number {
		return this.__advanced
	}

	/**
	 * get buffer
	 * @param reset reset buffer string from 0
	 */
	buff(reset?: boolean): string {
		let { __buff: buff } = this
		if (reset) {
			this.__buff = buff = cutStr(buff, this.__offset)
			this.__offset = 0
		}
		return buff
	}

	orgBuff() {
		return this.source.buff
	}

	offset(): number {
		return this.__offset
	}

	startPos(): number {
		return this.__orgOffset
	}

	currPos(): number {
		return this.__orgOffset + this.__advanced
	}

	pos(): [number, number] {
		const { __orgOffset: offset } = this
		return [offset, offset + this.__advanced]
	}

	/**
	 * get next char code
	 * @return number char code number
	 */
	nextCode() {
		return this.__code
	}

	nextChar() {
		return char(this.__code)
	}

	//──── result opeartions ───────────────────────────────────────────────────────────────────
	/**
	 * append result
	 */
	add(data: any) {
		const { result } = this
		result[result.length] = data
	}

	/**
	 * append resultset
	 */
	addAll(data: any[]) {
		const { result } = this
		const len = result.length
		let i = data.length
		while (i--) result[len + i] = data[i]
	}

	/**
	 * get result size
	 */
	resultSize() {
		return this.result.length
	}
}
