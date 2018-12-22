/**
 *
 * @module utility/AST
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Nov 27 2018 19:05:48 GMT+0800 (China Standard Time)
 * @modified Sat Dec 22 2018 15:56:09 GMT+0800 (China Standard Time)
 */

import { Rule, MatchError } from './Rule'
import { MatchContext, CheckPoint } from './MatchContext'
import { ComplexRule } from './ComplexRule'
import { mixin } from '../mixin'

/**
 * AND Complex Rule
 */
@mixin({ type: 'And', split: ' ' })
export class AndRule extends ComplexRule {
	__init(rules: Rule[]) {
		this.setStartCodes(rules[0].getStart([this.id]))
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
		const { rMin, rMax } = this
		const rules = this.getRules(),
			len = rules.length,
			ctx = context.create()

		let err: MatchError,
			repeat: number = 0,
			i: number,
			cp: CheckPoint

		out: for (; repeat < rMax; repeat++) {
			cp = ctx.checkpoint()
			for (i = 0; i < len; i++) {
				if ((err = this.testRule(rules[i], i, ctx))) {
					if (repeat < rMin) return err
					ctx.rollback(cp)
					break out
				}
			}
		}
		return this.consume(ctx)
	}
	testRule(rule: Rule, i: number, ctx: MatchContext): MatchError {
		let err: MatchError
		if (!rule.test(ctx)) {
			return this.error(this.EXPECTS[i], ctx)
		} else if ((err = rule.match(ctx))) {
			return this.error(this.EXPECTS[i], ctx, err)
		}

		// return (!rule.test(ctx) || (err = rule.match(ctx))) && (err = this.error(this.EXPECTS[i], ctx, err))
	}
}
