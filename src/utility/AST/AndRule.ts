/**
 *
 * @module common/AST
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Nov 27 2018 19:05:48 GMT+0800 (China Standard Time)
 * @modified Sat Dec 15 2018 18:03:08 GMT+0800 (China Standard Time)
 */

import { Rule, onMatchCallback, onErrorCallback, MatchError } from './Rule'
import { MatchContext } from './MatchContext'
import { ComplexRule, ruleBuilder } from './ComplexRule'

/**
 * and complex rule interface
 *
 */
export class AndRule extends ComplexRule {
	type: 'And'
	split: ' '
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
		const rules = super.init()
		this.setStartCodes(rules[0].getStart([this.id]))
		return rules
	}
	match(context: MatchContext): MatchError {
		const rules = this.getRules(),
			len = rules.length,
			ctx = context.create()
		let err: MatchError,
			i: number = 0
		for (; i < len; i++) if ((err = this.testRule(rules[i], i, ctx))) return err
		return this.consume(ctx)
	}
	protected repeatMatch(context: MatchContext): MatchError {
		const rules = this.getRules(),
			len = rules.length,
			[min, max] = this.repeat,
			ctx = context.create()

		let err: MatchError,
			repeat: number = 0,
			i: number,
			mlen: number,
			dlen: number

		out: for (; repeat < max; repeat++) {
			dlen = ctx.dataLen()
			mlen = ctx.len()
			for (i = 0; i < len; i++) {
				if ((err = this.testRule(rules[i], i, ctx))) {
					if (repeat < min) return err
					ctx.reset(mlen, dlen)
					break out
				}
			}
		}
		return this.consume(ctx)
	}
	testRule(rule: Rule, i: number, ctx: MatchContext): MatchError {
		let err
		return (!rule.test(ctx) || (err = rule.match(ctx))) && (err = this.error(this.EXPECTS[i], ctx, err))
	}
}
