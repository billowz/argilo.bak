/**
 * @module util/AST
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Nov 06 2018 10:06:22 GMT+0800 (China Standard Time)
 * @modified Mon Apr 08 2019 13:58:23 GMT+0800 (China Standard Time)
 */
import { MatchContext } from './MatchContext'
import { eachCharCodes } from './util'
import { assert } from '../assert'
import { isBool, mixin } from '../util'

@mixin({ $ruleErr: true })
export class MatchError {
	readonly $ruleErr: boolean
	readonly rule: Rule
	readonly context: MatchContext
	readonly source: MatchError
	readonly target: MatchError
	capturable: boolean
	readonly pos: number
	msg: string
	constructor(msg: string, capturable: boolean, source: MatchError, context: MatchContext, rule: Rule) {
		!isBool(capturable) && (capturable = rule.capturable)
		this.capturable = capturable && source ? source.capturable : capturable
		this.msg = msg
		this.source = source
		this.target = source ? source.target : this
		this.context = context
		this.rule = rule
		this.pos = context.startPos()
	}
	position(): [number, number, string] {
		return this.context.source.position(this.pos)
	}
}

export type onMatchCallback = (data: any, len: number, context: MatchContext, rule: Rule) => MatchError | string | void
export type onErrorCallback = (err: MatchError, context: MatchContext, rule: Rule) => MatchError | string | void

function defaultErr(err: MatchError) {
	return err
}

function defaultMatch(data: any, len: number, context: MatchContext) {
	context.add(data)
}

export type RuleOptions = {
	/**
	 * error is capturable
	 */
	capturable?: boolean
	/**
	 * matched callback
	 */
	match?: (data: any, len: number, context: MatchContext, rule: Rule) => MatchError | string | void
	/**
	 * error callback
	 */
	err?: (err: MatchError, context: MatchContext, rule: Rule) => MatchError | string | void
}

let idGen = 0
/**
 * Abstract Rule
 */
@mixin({ $rule: true })
export class Rule {
	readonly $rule: boolean
	// rule type (for debug)
	type: string
	// rule id
	readonly id: number
	// rule name
	readonly name: string
	// error is capturable
	readonly capturable: boolean
	// rule expression (for debug)
	protected expr: string
	// rule EXPECT content (for debug)
	protected EXPECT: string
	// matched callback
	readonly onMatch: onMatchCallback
	// error callback
	readonly onErr: onErrorCallback
	// index of start codes
	protected startCodeIdx: any[]
	// start codes
	protected startCodes: number[]

	/**
	 * @param name			rule name
	 * @param capturable	error is capturable
	 * @param onMatch		callback on matched, allow modify the match result or return an error
	 * @param onErr			callback on Error, allow to ignore error or modify error message or return new error
	 */
	constructor(name: string, options: RuleOptions) {
		this.id = idGen++
		this.name = name
		this.capturable = options.capturable !== false
		this.onMatch = options.match || defaultMatch
		this.onErr = options.err || defaultErr
	}

	/**
	 * create Error
	 * @param msg 			error message
	 * @param context 		match context
	 * @param capturable 	is capturable error
	 * @param src 			source error
	 */
	mkErr(msg: string, context: MatchContext, capturable?: boolean, source?: MatchError): MatchError {
		return new MatchError(msg, capturable, source, context, this)
	}

	/**
	 * match fail
	 * @param msg 			error message
	 * @param context 		match context
	 * @param capturable 	is capturable error
	 * @param src 			source error
	 * @return Error|void: may ignore Error in the error callback
	 */
	protected error(msg: string, context: MatchContext, src?: MatchError, capturable?: boolean): MatchError {
		const err = this.mkErr(msg, context, capturable, src)
		const userErr = this.onErr(err, context, this)
		if (userErr) return (userErr as any).$ruleErr ? (userErr as MatchError) : ((err[0] = String(userErr)), err)
	}

	/**
	 * match success
	 * > attach the matched result by match callback
	 * @param data 		matched data
	 * @param len  		matched data length
	 * @param context 	match context
	 * @return Error|void: may return Error in the match callback
	 */
	protected matched(data: any, len: number, context: MatchContext): MatchError {
		const err = this.onMatch(data, len, context, this)
		if (err) return (err as any).$ruleErr ? (err as MatchError) : this.mkErr(String(err), context, false)
	}

	protected enter(context: MatchContext) {
		return context.create()
	}

	/**
	 * match
	 * @param context match context
	 */
	match(context: MatchContext): MatchError {
		return assert()
	}

	/**
	 * get start char codes
	 */
	getStart(stack?: number[]): number[] {
		return this.startCodes
	}

	/**
	 * prepare test before match
	 */
	test(context: MatchContext): boolean {
		return true
	}

	protected startCodeTest(context: MatchContext): boolean {
		return this.startCodeIdx[context.nextCode()]
	}

	protected setStartCodes(start: number | string | any[], ignoreCase?: boolean) {
		const codes: number[] = [],
			index: number[] = []
		eachCharCodes(start, ignoreCase, code => {
			if (!index[code]) {
				codes.push(code)
				index[code] = code
			}
		})
		this.startCodes = codes
		this.setCodeIdx(index)
	}

	protected setCodeIdx(index: any[]) {
		if (index.length > 1) {
			this.startCodeIdx = index
			this.test = this.startCodeTest
		}
	}

	//──── for debug ─────────────────────────────────────────────────────────────────────────
	/**
	 * make rule expression
	 * @param expr expression text
	 */
	protected mkExpr(expr: string): string {
		return `<${this.type}: ${expr}>`
	}

	/**
	 * set rule expression
	 * 		1. make rule expression
	 * 		2. make Expect text
	 */
	protected setExpr(expr: string) {
		this.expr = this.mkExpr(expr)
		this.EXPECT = `Expect: ${expr}`
	}

	getExpr(stack?: number[]): string {
		return this.name || this.expr
	}

	/**
	 * toString by name or expression
	 */
	toString(): string {
		return this.getExpr()
	}
}
