/**
 * @module utility/AST
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Nov 06 2018 10:06:22 GMT+0800 (China Standard Time)
 * @modified Tue Dec 18 2018 18:57:10 GMT+0800 (China Standard Time)
 */

import { Rule, MatchError, onMatchCallback, onErrorCallback } from './Rule'
import { MatchContext } from './MatchContext'
import { assert } from '../assert'
import { idxOfArray } from '../collection'
import { pad } from '../format'
import { escapeStr } from '../string'
import { Source } from '../Source'

export type ruleBuilder = (rule: Rule) => Rule[]

/**
 * Abstract Complex Rule
 */
export class ComplexRule extends Rule {
	readonly split: string
	private builder: ruleBuilder
	protected EXPECTS: string[]
	protected rules: Rule[]
	protected readonly repeat: [number, number]
	/**
	 * @param name 			match name
	 * @param builder 		callback of build rules
	 * @param capturable	error is capturable
	 * @param onMatch		match callback
	 * @param onErr			error callback
	 */
	constructor(
		name: string,
		repeat: [number, number],
		builder: ruleBuilder,
		capturable: boolean,
		onMatch: onMatchCallback,
		onErr: onErrorCallback
	) {
		super(name, capturable, onMatch, onErr)
		this.builder = builder

		if (!(repeat[0] >= 0)) repeat[0] = 0
		if (!(repeat[1] > 0)) repeat[1] = 1e5
		assert.notGreater(repeat[0], repeat[1])
		this.repeat = [repeat[0], repeat[1]]
		if (repeat[0] !== repeat[1] || repeat[0] !== 1) {
			this.match = this.repeatMatch
			this.type = `${this.type}[${repeat[0]}${
				repeat[0] === repeat[1] ? '' : ` - ${repeat[1] === 1e5 ? 'MAX' : repeat[1]}`
			}]`
		}
	}
	parse(buff: string, errSource?: boolean): any[] {
		const ctx = new MatchContext(new Source(buff), buff, 0, 0)
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
			if (errSource !== false) msg.push('[Source]', ctx.source.source())
			throw new SyntaxError(msg.join('\n'))
		}
		return ctx.data
	}
	protected repeatMatch(context: MatchContext): MatchError {
		return assert()
	}
	init(): ComplexRule {
		const rules = this.builder(this)
		let i = rules && rules.length

		assert.is(i, `Require Complex Rules`)

		this.rules = rules

		const names = this.rnames(rules)

		this.setExpr(names.join(this.split))

		while (i--) names[i] = `Expect[${i}]: ${names[i]}`
		this.EXPECTS = names

		this.__init(rules)

		this.builder = null

		return this
	}
	__init(rules: Rule[]) {}

	protected setCodeIdx(index: any[]) {
		if (this.repeat[0]) super.setCodeIdx(index)
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
		const err = this.matched(context.data, context.len(), context.parent)
		!err && context.commit()
		return err
	}

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
			? ((i = idxOfArray(stack, id)), ~i)
				? `<${this.type} -> $${stack[i]}>`
				: this.mkExpr(this.rnames(this.getRules(), stack).join(this.split))
			: this.expr
	}
}
