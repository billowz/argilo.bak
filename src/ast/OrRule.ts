/**
 *
 * @module util/AST
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Nov 27 2018 19:05:48 GMT+0800 (China Standard Time)
 * @modified Mon Apr 08 2019 14:09:35 GMT+0800 (China Standard Time)
 */

import { Rule, MatchError } from './Rule'
import { MatchContext, CheckPoint } from './MatchContext'
import { ComplexRule } from './ComplexRule'
import { eachCharCodes } from './util'
import { mixin } from '../util'

/**
 * OR Complex Rule
 */
@mixin({ type: 'Or', split: ' | ' })
export class OrRule extends ComplexRule {
	index: Rule[][]
	__init(rules: Rule[]) {
		const { id } = this
		const len = rules.length,
			starts: number[] = [], // all distinct start codes
			rStarts: number[][] = [], // start codes per rule
			index: Rule[][] = [
				[] // rules which without start code
			]

		let i: number, j: number, k: Rule[] & { idx: number }, codes: number[]

		// get start codes of all rules
		for (i = 0; i < len; i++) {
			rStarts[i] = [] // init rule start codes
			eachCharCodes(rules[i].getStart([id]), false, code => {
				rStarts[i].push(code) // append to rule start codes
				if (!index[code]) {
					index[code] = [] // init start code index
					starts.push(code) // append to all start codes
				}
			})
		}

		// fill index
		for (i = 0; i < len; i++) {
			codes = rStarts[i] // append rule to start code index by rule start codes
			if (!codes.length) {
				// rule without start code
				index[0].push(rules[i]) // append rule to index[0]
				codes = starts // append rule to start code index by all start codes
			}

			// append rule to start code index (by rule start codes or all start codes)
			j = codes.length
			while (j--) {
				k = index[codes[j]] as Rule[] & { idx: number }
				if (k.idx !== i) {
					// deduplication
					k.push(rules[i]) // append rules[i] to start code index[codes[j]]
					k.idx = i
				}
			}
		}

		// rule have unkown start code when got unkown start code from any rules
		const startCodes = !index[0].length && starts
		this.startCodes = startCodes || []
		startCodes && this.setCodeIdx(index)
		this.index = index
	}

	match(context: MatchContext): MatchError {
		const index = this.index || (this.init(), this.index),
			rules: Rule[] = index[context.nextCode()] || index[0],
			len = rules.length,
			ctx = context.create()

		let err: MatchError,
			upErr: MatchError,
			i = 0

		for (; i < len; i++) {
			err = rules[i].match(ctx) || this.consume(ctx)
			if (!err) return
			if (!err.capturable) {
				upErr = err
				break
			}
			if (!upErr || err.pos >= upErr.pos) upErr = err
			ctx.rollback()
		}
		return this.error(this.EXPECT, ctx, upErr)
	}

	protected rmatch(context: MatchContext): MatchError {
		const { rMin, rMax } = this
		const index = this.index || (this.init(), this.index),
			ctx = context.create()

		let rules: Rule[],
			len: number,
			err: MatchError,
			upErr: MatchError,
			repeat: number = 0,
			i: number,
			cp: CheckPoint

		out: for (; repeat < rMax; repeat++) {
			rules = index[ctx.nextCode()] || index[0]
			upErr = null
			if ((len = rules.length)) {
				cp = ctx.checkpoint()
				for (i = 0; i < len; i++) {
					err = rules[i].match(ctx)
					if (!err) continue out
					if (!err.capturable) {
						upErr = err
						break
					}
					if (!upErr || err.pos >= upErr.pos) upErr = err
					ctx.rollback(cp)
				}
			}
			if (repeat < rMin || (upErr && !upErr.capturable)) return this.error(this.EXPECT, ctx, upErr)
			break
		}
		return this.consume(ctx)
	}
}
