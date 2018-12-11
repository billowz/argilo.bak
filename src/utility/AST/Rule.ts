/**
 * @module common/AST
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Nov 06 2018 10:06:22 GMT+0800 (China Standard Time)
 * @modified Tue Dec 11 2018 19:53:20 GMT+0800 (China Standard Time)
 */
import { MatchContext } from './MatchContext'
import { assert } from '../assert'
import { isStr } from '../is'

export interface MatchError extends Array<any> {
	0: string // error message
	1: boolean // capturable
	2: MatchError // source error
	3: MatchContext //context
	4: Rule // rule
}

export interface IRule {
	match(context: MatchContext): MatchError
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
export class Rule {
	readonly $rule: boolean = true
	readonly id: number
	protected type: string = 'Rule'
	protected expr: string
	protected EXPECT: string
	readonly onMatch: onMatchCallback
	readonly onErr: onErrorCallback
	constructor(
		public readonly name: string,
		public readonly capturable: boolean,
		onMatch: onMatchCallback,
		onErr: onErrorCallback
	) {
		this.id = idGen++
		this.onMatch = onMatch || defaultMatch
		this.onErr = onErr || defaultErr
	}

	mkErr(msg: string, context: MatchContext, capturable: boolean, src?: MatchError): MatchError {
		return [msg, capturable && src ? src[1] : capturable, src, context, this]
	}

	error(msg: string, context: MatchContext, capturable: boolean, src?: MatchError): MatchError {
		const err = this.mkErr(msg, context, capturable, src)
		const userErr = this.onErr(err, context, this)
		if (userErr) return isStr(userErr) ? ((err[0] = userErr as string), err) : (userErr as MatchError)
	}

	matched(data: any, len: number, context: MatchContext): MatchError {
		const err = this.onMatch(data, len, context, this)
		if (err)
			return (err as any).push && err.length === 5 ? (err as MatchError) : this.mkErr(String(err), context, false)
	}

	/**
	 * prepare test before match
	 */
	test(context: MatchContext): boolean {
		return !context.eof()
	}

	match(context: MatchContext): MatchError {
		return assert('abstruct')
	}

	/**
	 * get start char codes
	 */
	protected getStart(): number[] {
		return []
	}

	//──── for debug ─────────────────────────────────────────────────────────────────────────
	/**
	 * make rule expression
	 *
	 * @param expr expression text
	 */
	protected mkExpr(expr: string): string {
		return `<${this.type}: ${expr}>`
	}
	/**
	 * set rule expression
	 * 1. make rule expression
	 * 2. make rule Expect text
	 */
	protected setExpr(expr: string) {
		this.expr = this.mkExpr(expr)
		this.EXPECT = `Expect: ${expr}`
	}
	/**
	 * tostring by name or expression
	 * @return {string}
	 */
	toString(): string {
		return this.name || this.expr
	}
}
