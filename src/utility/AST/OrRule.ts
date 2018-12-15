/**
 *
 * @module common/AST
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Nov 27 2018 19:05:48 GMT+0800 (China Standard Time)
 * @modified Sat Dec 15 2018 18:03:34 GMT+0800 (China Standard Time)
 */

import { Rule, onMatchCallback, onErrorCallback, MatchError } from './Rule'
import { MatchContext } from './MatchContext'
import { ComplexRule, ruleBuilder } from './ComplexRule'
import { eachCharCodes } from './util'

/**
 * and complex rule interface
 *
 */
export class OrRule extends ComplexRule {
	startCodeIdx: Rule[][]
	type: 'Or'
	split: ' | '
	index: Rule[][]
	constructor(
		name: string,
		repeat: [number, number],
		builder: ruleBuilder,
		capturable: boolean,
		onMatch: onMatchCallback,
		onErr: onErrorCallback
	) {
		super(name, 'And', repeat, builder, capturable, onMatch, onErr)
	}
	init(): Rule[] {
		const rules = super.init(),
			len = rules.length,
			id = this.id,
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
		this.startCodes = index[0].length ? [] : starts

		this.index = starts.length && index
		starts.length && !index[0].length && this.setCodeIdx(index)
		return rules
	}
	match(context: MatchContext): MatchError {
		const { index } = this
		const rules: Rule[] = index ? index[context.nextCode()] || index[0] : this.getRules(),
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
			ctx.reset(0, 0)
		}
		return this.error(this.EXPECT, ctx, upErr)
	}
	protected repeatMatch(context: MatchContext): MatchError {
		const { index } = this
		const [min, max] = this.repeat,
			ctx = context.create()

		let rules: Rule[],
			len: number,
			err: MatchError,
			upErr: MatchError,
			repeat: number = 0,
			i: number,
			mlen: number,
			dlen: number

		if (!index) {
			rules = this.getRules()
			len = rules.length
		}

		out: for (; repeat < max; repeat++) {
			if (index) {
				rules = index[ctx.nextCode()] || index[0]
				len = rules.length
			}
			if (len) {
				dlen = ctx.dataLen()
				mlen = ctx.len()
				upErr = null
				for (i = 0; i < len; i++) {
					err = rules[i].match(ctx)
					if (!err) continue out
					if (!err.capturable) {
						upErr = err
						break
					}
					if (!upErr || err.pos >= upErr.pos) upErr = err
					ctx.reset(mlen, dlen)
				}
			}
			if (repeat < min) return this.error(this.EXPECT, ctx, upErr)
		}
		return this.consume(ctx)
	}
}
