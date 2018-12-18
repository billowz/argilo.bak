/**
 * @module utility/AST
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Nov 06 2018 10:06:22 GMT+0800 (China Standard Time)
 * @modified Tue Dec 18 2018 18:57:47 GMT+0800 (China Standard Time)
 */
import { MatchContext } from './MatchContext'
import { eachCharCodes } from './util'
import { assert } from '../assert'
import { isStr, isBool } from '../is'
import { PROTOTYPE } from '../consts'
import { mixin } from '../mixin'

@mixin({ $ruleErr: true })
export class MatchError {
	readonly $ruleErr: boolean
	readonly rule: Rule
	readonly context: MatchContext
	readonly source: MatchError
	readonly capturable: boolean
	readonly pos: number
	msg: string
	constructor(msg: string, capturable: boolean, source: MatchError, context: MatchContext, rule: Rule) {
		!isBool(capturable) && (capturable = rule.capturable)
		this.capturable = capturable && source ? source.capturable : capturable
		this.msg = msg
		this.source = source
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
	readonly name: string
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
	constructor(name: string, capturable: boolean, onMatch: onMatchCallback, onErr: onErrorCallback) {
		this.id = idGen++
		this.name = name
		this.capturable = capturable !== false
		this.onMatch = onMatch || defaultMatch
		this.onErr = onErr || defaultErr
	}

	/**
	 * create Error
	 * @param msg 			error message
	 * @param context 		match context
	 * @param capturable 	is capturable error
	 * @param src 			source error
	 */
	mkErr(msg: string, context: MatchContext, source?: MatchError, capturable?: boolean): MatchError {
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
		const err = this.mkErr(msg, context, src, capturable)
		const userErr = this.onErr(err, context, this)
		if (userErr) return isStr(userErr) ? ((err[0] = userErr as string), err) : (userErr as MatchError)
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
		if (err) return (err as any).$ruleErr ? (err as MatchError) : this.mkErr(String(err), context, null, false)
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
		return true //return context.nextCode() !== 0
	}

	protected startCodeTest(context: MatchContext): boolean {
		const code = context.nextCode()
		return code !== 0 && !!this.startCodeIdx[code]
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
		this.startCodeIdx = index
		this.test = index && index.length > 1 ? this.startCodeTest : Rule[PROTOTYPE].test
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
