/**
 * @module utility/AST
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Dec 11 2018 15:36:42 GMT+0800 (China Standard Time)
 * @modified Sat Dec 22 2018 15:09:12 GMT+0800 (China Standard Time)
 */

import { MatchError, RuleOptions } from './Rule'
import { MatchContext } from './MatchContext'
import { MatchRule } from './MatchRule'
import { regStickySupport } from '../reg'
import { isInt } from '../is'
import { createFn } from '../fn'
import { mapArray } from '../collection'
import { mixin } from '../mixin'
import { create } from '../create'
import { cutStrLen } from '../string'

/**
 * match string by RegExp
 *
 * optimization:
 * - Priority use sticky mode {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/sticky}
 *
 */
@mixin({ type: 'RegExp' })
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
		options: RuleOptions
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

		super(name, start, ignoreCase, options)

		this.regexp = regexp
		this.pick = pick
		this.match = sticky ? this.stickyMatch : this.execMatch

		sticky ? (this.spicker = pick === false ? pickNone : pickTestStr) : (this.picker = mkPicker(pick))

		this.setExpr(pattern)
	}
	/**
	 * match on sticky mode
	 */
	stickyMatch(context: MatchContext): MatchError {
		const reg = this.regexp,
			buff = context.buff(),
			start = context.offset()
		reg.lastIndex = start
		let len: number
		return reg.test(buff)
			? ((len = reg.lastIndex - start), this.comsume(this.spicker(buff, start, len), len, context))
			: this.error(this.EXPECT, context)
	}
	/**
	 * match on exec mode
	 */
	execMatch(context: MatchContext): MatchError {
		const m = this.regexp.exec(context.buff(true))
		return m ? this.comsume(this.picker(m), m[0].length, context) : this.error(this.EXPECT, context)
	}
}

const cache = create(null)
function mkPicker(pick: number | boolean): (m: string[]) => string | string[] {
	return (
		cache[pick as any] ||
		(cache[pick as any] =
			pick === false
				? pickNone
				: pick === true
				? pickAll
				: pick >= 0
				? createFn(`return m[${pick}]`, ['m'], `pick_${pick}`)
				: createFn(
						`return ${mapArray(new Array(-pick), (v, i) => `m[${i + 1}]`).join(' || ')}`,
						['m'],
						`pick_1_${-pick}`
				  ))
	)
}

function pickNone(): string {
	return null
}

function pickAll(m: string[]): string[] {
	return m
}

function pickTestStr(buff: string, start: number, end: number): string {
	return cutStrLen(buff, start, end)
}
