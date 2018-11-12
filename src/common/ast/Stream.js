// @flow
/**
 *
 * @author Tao Zeng (tao.zeng.zt@qq.com)
 * @created 2018-11-08 19:18:51
 * @modified 2018-11-08 19:18:51 by Tao Zeng (tao.zeng.zt@qq.com)
 */

import { inherit } from '../../helper'
import { pad } from '../format'
const LINE_REG = /\n/g

export default inherit(
	/**
	 * @constructor Stream
	 * @param  {string} text
	 */
	function Stream(text: string) {
		this.text = text
		this.len = text.length
		// [buff, offset, orgoffset, prev, char code cache]
		const curr = [text, 0, 0, null, null]
		this.curr = curr
		this.stack = [curr]
	},
	/** @lends Stream.prototype */
	{
		/**
		 * enter new context
		 */
		enter(): void {
			let { curr } = this
			// [buff, offset, orgoffset, prev, char code cache]
			this.curr = curr = [curr[0], curr[1], curr[2], curr, null]
			this.stack.push(curr)
		},
		/**
		 * reset current context state
		 * @returns boolean
		 */
		reset(): boolean {
			const { curr } = this
			const prev = curr[3]
			if (curr[2] !== prev[2]) {
				curr[0] = prev[0]
				curr[1] = prev[1]
				curr[2] = prev[2]
				curr[4] = null
				return true
			}
		},
		/**
		 * exit current context
		 * well discard current context state
		 */
		exit(): void {
			const curr = this.stack.pop()
			this.curr = curr[3]
		},
		/**
		 * commit current context
		 * well marge prev context state by current context state
		 */
		commit(): void {
			const curr = this.stack.pop(),
				prev = curr[3]
			this.curr = prev
			prev[0] = curr[0]
			prev[1] = curr[1]
			prev[2] = curr[2]
			prev[4] = curr[4]
		},
		/**
		 * @param  {boolean} reset is remove the preceding characters
		 * @returns string
		 */
		buff(reset: boolean): string {
			const { curr } = this
			if (reset) {
				curr[0] = curr[0].substring(curr[1])
				curr[1] = 0
			}
			return curr[0]
		},
		/**
		 * get text offset in current context
		 * @returns number
		 */
		offset(): number {
			return this.curr[1]
		},
		/**
		 * get text offset on original text
		 * @returns number
		 */
		textOffset() {
			return this.curr[2]
		},
		/**
		 * get text offset on original text in prev context
		 * @returns number
		 */
		upOrgOffset() {
			const prev = this.curr[3]
			return prev ? prev[2] : 0
		},
		/**
		 * get next char code
		 * @returns number char code number
		 */
		nextCode() {
			const { curr } = this
			if (curr[4] === null) curr[4] = curr[2] < this.orglen ? curr[0].charCodeAt(curr[1]) : 0
			return curr[4]
		},
		/**
		 * advance text offset in current context
		 * @param {number} len advance length
		 */
		advance(len: number): void {
			const { curr } = this
			curr[1] += len
			curr[2] += len
			curr[4] = null
		},
		/**
		 * retreat text offset in current context
		 * @param {number} len retreat length
		 */
		retreat(len: number): void {
			this.advance(-len)
		},
		/**
		 * get position(line and columns) by offset on original text
		 * @param {number} offset
		 * @returns Array [LineNumber, ColumnNumber]
		 */
		position(offset: number): Array {
			const { orgbuff } = this
			let line = 0,
				lineOffset = 0

			while (LINE_REG.exec(orgbuff) && offset >= LINE_REG.lastIndex) {
				lineOffset = LINE_REG.lastIndex
				line++
			}
			LINE_REG.lastIndex = 0
			return [line, offset - lineOffset]
		},
		/**
		 * get original text with line number
		 * @returns string
		 */
		source(): string {
			const { orgbuff } = this
			let line = 1
			return ` 0: ${orgbuff.replace(LINE_REG, () => `\n${pad(line++, 2)}: `)}`
		},
	}
)
