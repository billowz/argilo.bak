/**
 * @module utility/AST
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Dec 11 2018 15:36:42 GMT+0800 (China Standard Time)
 * @modified Sat Dec 15 2018 11:53:49 GMT+0800 (China Standard Time)
 */

import { MatchError, onMatchCallback, onErrorCallback } from './Rule'
import { MatchContext } from './MatchContext'
import { MatchRule } from './MatchRule'
import { regStickySupport } from '../reg'
import { isInt } from '../is'
import { createFn } from '../fn'
import { map, mapArray } from '../collection'

/**
 * match string by RegExp
 *
 * optimization:
 * - Priority use sticky mode {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/sticky}

 */
export class RegMatchRule extends MatchRule {
	readonly regexp: RegExp
	readonly pick: boolean | number
	private picker: (m: string[]) => string | string[]
	private spicker: (buff: string, start: number, end: number) => string
	/**
	 * @param name 			match name
	 * @param regexp		regular
	 * @param pick			pick regular matching results
	 * 						    0: pick results[0] (optimize: test and substring in sticky mode)
	 * 						  > 0: pick results[{pick}]
	 * 						  < 0: pick first non-blank string from 1 to -{pick} index on results
	 * 						 true: pick results
	 * 						false: not pick result, result is null (optimize: just test string in sticky mode)
	 * @param start			start character codes in the regular, optimize performance by start character codes
	 * @param capturable	error is capturable
	 * @param onMatch		match callback
	 * @param onErr			error callback
	 */
	constructor(
		name: string,
		regexp: RegExp,
		pick: boolean | number,
		start: number | string | any[],
		capturable: boolean,
		onMatch: onMatchCallback,
		onErr: onErrorCallback
	) {
		pick = pick === false || isInt(pick) ? pick : !!pick || 0

		const sticky = regStickySupport && !pick, // use exec mode when need pick match group data
			pattern = regexp.source,
			ignoreCase = regexp.ignoreCase

		// always wrapping in a none capturing group preceded by '^' to make sure
		// matching can only work on start of input. duplicate/redundant start of
		// input markers have no meaning (/^^^^A/ === /^A/)

		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/sticky
		// When the y flag is used with a pattern, ^ always matches only at the
		// beginning of the input, or (if multiline is true) at the beginning of a
		// line.
		regexp = new RegExp(
			sticky ? pattern : `^(?:${pattern})`,
			(ignoreCase ? 'i' : '') + (regexp.multiline ? 'm' : '') + (sticky ? 'y' : '')
		)

		super(name, start, ignoreCase, capturable, onMatch, onErr)
		this.type = 'RegExp'
		this.regexp = regexp
		this.pick = pick
		this.match = sticky ? this.stickyMatch : this.execMatch

		sticky ? (this.spicker = pick === false ? pickNone : pickTestStr) : (this.picker = mkPicker(pick))

		this.setExpr(pattern)
	}
	match(context: MatchContext) {
		return this.comsume(context.nextChar(), 1, context)
	}
	/**
	 * match on sticky mode
	 */
	stickyMatch(context: MatchContext): MatchError {
		const reg = this.regexp,
			buff = context.getBuff(),
			start = context.getOffset()
		reg.lastIndex = start
		return reg.test(buff)
			? this.comsume(this.spicker(buff, start, reg.lastIndex), reg.lastIndex - start, context)
			: this.error(this.EXPECT, context)
	}
	/**
	 * match on exec mode
	 */
	execMatch(context: MatchContext): MatchError {
		const m = this.regexp.exec(context.getBuff(true))
		if (m) {
			return this.comsume(this.picker(m), m[0].length, context)
		}
		return this.error(this.EXPECT, context)
	}
}

function mkPicker(pick: number | boolean): (m: string[]) => string | string[] {
	return pick === false
		? pickNone
		: pick === true
		? pickAll
		: pick >= 0
		? (m: string[]): string => m[pick as number]
		: createFn(`return ${mapArray(new Array(-pick), (v, i) => `m[${i + 1}]`).join(' || ')}`, ['m'])
}

function pickNone(): string {
	return null
}

function pickAll(m: string[]): string[] {
	return m
}

function pickTestStr(buff: string, start: number, end: number): string {
	return buff.substring(start, end)
}
