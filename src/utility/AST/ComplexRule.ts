/**
 * @module common/AST
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Nov 06 2018 10:06:22 GMT+0800 (China Standard Time)
 * @modified Sat Dec 15 2018 19:43:41 GMT+0800 (China Standard Time)
 */

import { Rule, MatchError, onMatchCallback, onErrorCallback } from './Rule'
import { MatchContext } from './MatchContext'
import { assert } from '../assert'
import { idxOfArray } from '../collection'
import { PROTOTYPE } from '../consts'

export type ruleBuilder = (rule: Rule) => Rule[]

/**
 * complex rule interface
 *
 */
export class ComplexRule extends Rule {
	protected split: string
	protected EXPECTS: string[]
	private builder: ruleBuilder
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
		type: string,
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
		if (repeat[0] === repeat[1] && repeat[0] === 1) {
			this.match = this.repeatMatch
		} else {
			type = `${type}[${repeat[0]}${
				repeat[0] === repeat[1] ? '' : ` - ${repeat[1] === 1e5 ? 'MAX' : repeat[1]}`
			}]`
		}
		this.type = type
	}
	protected repeatMatch(context: MatchContext): MatchError {
		return assert()
	}
	init(): Rule[] {
		const rules = this.builder(this)
		let i = rules && rules.length

		assert.is(i, `Require Complex Rules`)

		this.rules = rules
		this.builder = null

		const names = this.rnames(rules)

		this.setExpr(names.join(this.split))

		while (i--) names[i] = `Expect[${i}]: ${names[i]}`
		this.EXPECTS = names

		return rules
	}

	getRules(): Rule[] {
		return this.rules || this.init()
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
		const err = this.matched(context.data, context.len(), context)
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
