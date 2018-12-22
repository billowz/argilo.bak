/**
 * @module utility/AST
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Nov 06 2018 10:06:22 GMT+0800 (China Standard Time)
 * @modified Sat Dec 22 2018 15:24:21 GMT+0800 (China Standard Time)
 */

import { Rule, MatchError, onMatchCallback, onErrorCallback, RuleOptions } from './Rule'
import { MatchContext } from './MatchContext'
import { assert } from '../assert'
import { idxOfArray } from '../collection'
import { pad } from '../format'
import { escapeStr } from '../string'
import { Source } from '../Source'

export type ComplexRuleBuilder = (rule: Rule) => Rule[]

const MAX = -1 >>> 0
/**
 * Abstract Complex Rule
 */
export class ComplexRule extends Rule {
	readonly split: string
	private builder: ComplexRuleBuilder
	protected EXPECTS: string[]
	protected rules: Rule[]
	protected readonly rMin: number
	protected readonly rMax: number

	/**
	 * @param name 			match name
	 * @param builder 		callback of build rules
	 * @param options		Rule Options
	 */
	constructor(name: string, repeat: [number, number], builder: ComplexRuleBuilder, options: RuleOptions) {
		super(name, options)

		let [rMin, rMax] = repeat

		rMin < 0 && (rMin = 0)
		rMax <= 0 && (rMax = MAX)

		assert.notGreater(rMin, rMax)

		this.rMin = rMin
		this.rMax = rMax

		this.builder = builder

		if (rMin !== rMax || rMin !== 1) {
			this.match = this.repeatMatch

			// for debug
			this.type = `${this.type}[${rMin}${rMin === rMax ? '' : ` - ${rMax === MAX ? 'MAX' : rMax}`}]`
		}
	}
	parse(buff: string, data?: any): any[] {
		const ctx = new MatchContext(new Source(buff), buff, 0, 0)
		ctx.data = data
		let err = this.match(ctx)
		if (err) {
			const msg = []
			var pos: [number, number, string]
			do {
				pos = err.position()
				msg.unshift(
					`[${pad(String(pos[0]), 3)}:${pad(String(pos[1]), 2)}] - ${err.rule.toString()}: ${
						err.msg
					} on "${escapeStr(pos[2])}"`
				)
			} while ((err = err.source))
			msg.push('[Source]', ctx.source.source())
			throw new SyntaxError(msg.join('\n'))
		}
		return ctx.result
	}
	init(): ComplexRule {
		const rules = this.builder(this)
		let i = rules && rules.length

		assert.is(i, `Require Complex Rules`)

		this.rules = rules

		// generate expression and expect string for debug
		const names = this.rnames(rules)
		this.setExpr(names.join(this.split))
		while (i--) names[i] = `Expect[${i}]: ${names[i]}`
		this.EXPECTS = names

		this.__init(rules)

		this.builder = null

		return this
	}
	__init(rules: Rule[]) {}

	protected repeatMatch(context: MatchContext): MatchError {
		return assert()
	}

	protected setCodeIdx(index: any[]) {
		this.rMin && super.setCodeIdx(index)
	}

	getRules(): Rule[] {
		return this.rules || (this.init(), this.rules)
	}

	getStart(stack?: number[]): number[] {
		const { id, startCodes } = this
		return startCodes
			? startCodes
			: (stack && ~idxOfArray(stack, id)) || this.rules
			? []
			: (this.init(), this.startCodes)
	}

	consume(context: MatchContext): MatchError {
		const err = this.matched(context.result, context.advanced(), context.parent)
		!err && context.commit()
		return err
	}

	// for debug
	private rnames(rules: Rule[], stack?: number[]): string[] {
		let i = rules.length
		const names: string[] = new Array(i),
			id = this.id
		while (i--) names[i] = rules[i].getExpr(stack ? stack.concat(id) : [id])
		return names
	}

	getExpr(stack?: number[]): string {
		const { id, name } = this
		let i: number

		return name
			? name
			: stack
			? ~(i = idxOfArray(stack, id))
				? `<${this.type} -> $${stack[i]}>`
				: this.mkExpr(this.rnames(this.getRules(), stack).join(this.split))
			: this.expr
	}
}
